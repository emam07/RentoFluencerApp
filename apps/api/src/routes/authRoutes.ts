import { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import { z } from 'zod';
import { validate } from '../middleware/validateRequest';
import { generateTokens, hashRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../services/authService';
import prisma from '../db';
import jwt from 'jsonwebtoken';

const router = require('express').Router();

// ===== POST /api/v1/auth/register =====
router.post('/register', validate(z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
})), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Public registration always assigns RENTER role - client-supplied role is ignored
    // The registerDto schema does NOT include 'role', so it cannot be supplied

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({
        status: 'fail',
        message: 'User with this email already exists.'
      });
      return;
    }

    // Hash password with Argon2id
    const hashedPassword = await argon2.hash(password);

    // Create user with RENTER role (hardcoded, not from client)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'RENTER' // Always RENTER for public registration
      }
    });

    // Create profile if name is provided
    let profile = null;
    if (name) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          bio: '',
        }
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user.id, user.role);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profileId: profile?.id
        }
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m'
      },
      message: 'User registered successfully'
    });
  } catch (error: any) {
    next(error);
  }
});

// ===== POST /api/v1/auth/login =====
router.post('/login', validate(z.object({
  email: z.string().email(),
  password: z.string().min(8),
})), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials.'
      });
      return;
    }

    // Verify password with Argon2id
    const passwordValid = await argon2.verify(user.password, password);

    if (!passwordValid) {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials.'
      });
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user.id, user.role);

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profileId: user.profileId
        }
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m'
      },
      message: 'Logged in successfully'
    });
  } catch (error: any) {
    next(error);
  }
});

// ===== POST /api/v1/auth/refresh =====
router.post('/refresh', validate(z.object({
  refreshToken: z.string(),
})), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        status: 'fail',
        message: 'Refresh token is required.'
      });
      return;
    }

    // Verify refresh token against JWT and database, performs rotation
    const result = await verifyRefreshToken(refreshToken, prisma);

    // Generate new access token for the rotated session
    const newAccessToken = jwt.sign(
      { id: result.tokenId, email: '', role: 'RENTER' },
      process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me',
      {
        expiresIn: '15m',
        issuer: process.env.JWT_ISSUER || 'rentofluencer.app',
        audience: process.env.JWT_AUDIENCE || 'rentofluencer.users',
      }
    );

    res.json({
      status: 'success',
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: result.newRefreshToken,
          expiresIn: '15m'
        }
      },
      message: 'Token refreshed successfully'
    });
  } catch (error: any) {
    next(error);
  }
});

// ===== POST /api/v1/auth/logout =====
router.post('/logout', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

    if (refreshToken) {
      await revokeRefreshToken(refreshToken, prisma);
    }

    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    next(error);
  }
});

// ===== GET /api/v1/auth/me =====
router.get('/me', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true
      }
    });

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'User not found.'
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile || null
        }
      },
      message: 'User profile retrieved successfully'
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;