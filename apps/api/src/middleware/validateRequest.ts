import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import HttpStatusCodes from 'http-status-codes';

/**
 * Zod request body validation middleware
 * Wraps async handlers and validates request body against a Zod schema
 */
export const validate = (schema: z.ZodObject<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate only the body; leave query/params for other validators
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Validation error',
          errors: error.errors.map((issue: any) => ({
            path: issue.path.map((p: any) => p.key),
            message: issue.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
};

/**
 * Zod query parameter validation middleware
 */
export const validateQuery = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Validation error',
          errors: error.errors.map((issue: any) => ({
            path: issue.path.map((p: any) => p.key),
            message: issue.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
};

/**
 * Zod route parameter validation middleware
 */
export const validateParams = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Validation error',
          errors: error.errors.map((issue: any) => ({
            path: issue.path.map((p: any) => p.key),
            message: issue.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
};