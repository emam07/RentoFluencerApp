import { z } from 'zod';

export const createUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
  role: z.enum(['RENTER', 'PROVIDER', 'ADMIN']).optional(),
});

export const loginUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const createProfileDto = z.object({
  bio: z.string().optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
  phone: z.string().optional(),
});

export const validateRefreshDto = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});