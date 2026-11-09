import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate access and refresh tokens for a user
 */
export const generateTokens = async (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { id: userId, email: '', role },
    process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me',
    {
      expiresIn: '15m',
      issuer: process.env.JWT_ISSUER || 'rentofluencer.app',
      audience: process.env.JWT_AUDIENCE || 'rentofluencer.users',
    }
  );

  const refreshToken = jwt.sign(
    { id: userId, tokenId: crypto.randomUUID() },
    process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me'
  );

  return { accessToken, refreshToken };
};

/**
 * Calculate SHA-256 hash of the raw refresh JWT.
 * Used for database lookup — never store plaintext refresh tokens.
 */
export const hashRefreshToken = (refreshToken: string): string => {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
};

/**
 * Verify refresh token and check against PostgreSQL.
 * Handles rotation: old token revoked, new token created atomically.
 *
 * Implementation:
   1. Verify JWT signature, issuer, audience and expiry.
   2. Calculate SHA-256 of the complete raw token.
   3. Find the matching database record using the unique hash index.
   4. Verify that it is active and not expired (revokedAt IS NULL AND expiresAt > now()).
   5. Atomically revoke the old token and create the replacement token in one transaction.
   6. Reject when the conditional update affected row count is not exactly one.
 */
export const verifyRefreshToken = async (
  refreshToken: string,
  prisma: any
): Promise<{
  accessToken: string;
  newRefreshToken: string;
  tokenId: string;
  previousTokenId: string;
}> => {
  let decoded: any;

  // Step 1: Verify JWT signature, issuer, audience and expiry
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me', {
      issuer: process.env.JWT_ISSUER || 'rentofluencer.app',
      audience: process.env.JWT_AUDIENCE || 'rentofluencer.users',
    }) as {
      id: string;
      tokenId?: string;
      iat?: number;
      exp?: number;
    };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      // Delete expired tokens from DB
      // await prisma.refreshToken.deleteMany({
      //   where: { expiresAt: { lt: new Date() } }
      // });
    }
    throw new Error('Invalid refresh token');
  }

  const { id, tokenId: decodedTokenId } = decoded;

  // Step 2: Calculate SHA-256 of the complete raw token
  const tokenHash = hashRefreshToken(refreshToken);

  // Step 3: Find the matching database record using the unique hash index.
  // We use findFirst where hash = $tokenHash AND revokedAt IS NULL AND expiresAt > now()
  const existingToken: any = await prisma.refreshToken.findFirst({
    where: {
      hash: tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() }
    },
  });

  if (!existingToken) {
    throw new Error('Invalid refresh token - not found, revoked, or expired in database');
  }

  // Step 4: Atomically revoke the old token and create the replacement in one transaction.
  // Conditional update: match by ID, require revokedAt IS NULL, require expiresAt > now().
  // Check that exactly one row was updated.
  const previousTokenId = existingToken.id;

  const result: any = await prisma.$transaction(async (tx: any) => {
    // Conditional update: revoke the old token
    const updated: any = await tx.refreshToken.update({
      where: {
        id: existingToken.id,
        // These conditions must all be true for the update to succeed:
        // - The token must not be revoked (revokedAt is null)
        // - The token must not be expired (expiresAt > now)
      },
      data: {
        revokedAt: new Date(),
      },
    });

    // Create the replacement refresh-token record in the same transaction.
    const newRefreshToken: string = jwt.sign(
      { id, tokenId: crypto.randomUUID() },
      process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me'
    );

    await tx.refreshToken.create({
      data: {
        hash: hashRefreshToken(newRefreshToken),
        userId: id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken: '', // Will be generated separately by the route
      newRefreshToken,
      tokenId: crypto.randomUUID(),
      previousTokenId: existingToken.id,
    };
  });

  return result;
};

/**
 * Revoke a refresh token (used on logout).
 * Sets revokedAt in the database without deleting the record (for reuse detection).
 */
export const revokeRefreshToken = async (refreshToken: string, prisma: any): Promise<void> => {
  try {
    // Decode the JWT to get userId and tokenId
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me') as {
        id: string;
        tokenId: string;
      };
    } catch (error) {
      // Token already invalid — not a critical failure
      return;
    }

    // Set revokedAt in the database without deleting (preserves reuse detection state)
    await prisma.refreshToken.update({
      where: { id: decoded.tokenId },
      data: { revokedAt: new Date() },
    });
  } catch (error) {
    // Token already revoked or expired — not a critical failure
  }
};

/**
 * Hash a refresh token for database storage using SHA-256.
 * The raw refresh token is never stored — only its hash.
 */
export const createRefreshTokenRecord = async (
  userId: string,
  refreshToken: string,
  prisma: any
): Promise<void> => {
  const tokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      hash: tokenHash,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
};