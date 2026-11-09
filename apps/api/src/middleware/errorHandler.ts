import { Request, Response, NextFunction } from 'express';

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
 * Centralized error handler with consistent API response format
 */
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors: any[] = [];

  // Custom error with status code - check JWT error by name
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Access token expired';
  }

  // Send consistent error response
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV !== 'production' && { errors }),
    timestamp: new Date().toISOString(),
    path: req.path,
    requestId: req.id
  });
};

export default errorHandler;