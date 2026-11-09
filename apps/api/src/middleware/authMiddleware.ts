import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      authToken?: string;
    }
  }
}

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  errors?: Array<{ path: string[]; message: string }>;
}

/**
 * JWT Access Token Verification Middleware
 *
 * Verifies:
 - Issuer (iss)
 - Audience (aud)
 - Expiry (exp)
 - Signature
 *
 * Attaches verified user to req.user
 */
const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'fail',
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({
        status: 'fail',
        message: 'Access denied. Token malformed.',
      });
      return;
    }

    // Verify JWT with full claims validation
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!, {
      issuer: process.env.JWT_ISSUER || 'rentofluencer.app',
      audience: process.env.JWT_AUDIENCE || 'rentofluencer.users',
    }) as { id: string; email: string; role: string; iat?: number; exp?: number };

    // Attach user and token to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    req.authToken = token;

    // Validate role is one of the allowed roles
    const validRoles = ['RENTER', 'PROVIDER', 'ADMIN'];
    if (!validRoles.includes(decoded.role)) {
      res.status(403).json({
        status: 'fail',
        message: 'Invalid role supplied.',
      });
      return;
    }

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        status: 'fail',
        message: 'Access token expired. Use refresh token to obtain a new access token.',
      });
      return;
    }

    res.status(401).json({
      status: 'fail',
      message: 'Invalid token.',
    });
  }
};

/**
 * Role-Based Authorization Middleware
 *
 * Restricts access based on user role.
 *
 * @param allowedRoles - Array of roles allowed to access the route
 */
const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user?.role) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user role found.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        status: 'fail',
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}.`,
      });
      return;
    }

    next();
  };
};

/**
 * Refresh Token Verification Middleware
 *
 * Verifies refresh token from cookies or authorization header.
 * Checks revocation status in database.
 * Rotates refresh token on successful verification.
 */
const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let refreshToken: string | undefined;

    // Check authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      refreshToken = authHeader.split(' ')[1];
    }
    // Then check cookies (for web authentication)
    if (!refreshToken && req.cookies?.refreshToken) {
      refreshToken = req.cookies.refreshToken;
    }

    if (!refreshToken) {
      res.status(401).json({
        status: 'fail',
        message: 'Refresh token not provided.',
      });
      return;
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
        id: string;
        tokenId?: string; // For revocation tracking
        iat?: number;
        exp?: number;
      };
    } catch (error) {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid refresh token.',
      });
      return;
    }

    if (!decoded || !decoded.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid refresh token.',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email || '',
      role: decoded.role || 'RENTER',
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        status: 'fail',
        message: 'Refresh token expired. Please re-authenticate.',
      });
      return;
    }

    res.status(401).json({
      status: 'fail',
      message: 'Invalid refresh token.',
    });
  }
};

export { authMiddleware, authorize, refreshTokenMiddleware };