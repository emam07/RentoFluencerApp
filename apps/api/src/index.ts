import 'dotenv/config';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';

// Express rate limiter helper (CJS require works in ESM with type: "module")
const rateLimit = require('express-rate-limit');

const app = express();

// ===== Environment Configuration =====
const PORT = process.env.PORT || 4000;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
const JWT_ACCESS_EXPIRES_IN = '15m'; // 15 minutes per spec
const JWT_REFRESH_EXPIRES_IN = '7d'; // 7 days
const NODE_ENV = process.env.NODE_ENV || 'development';

// PrismaClient will be initialized lazily - we use 'any' type to avoid ESM export issues
// The actual initialization happens in the async block below
let prisma: any;

// ===== Rate Limiting Configuration =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again later.',
  },
});

// ===== Pino Logger Setup =====
const logger = pino({ level: 'info' });
const pinoHttpHandler = pinoHttp({
  logger,
  serializers: {
    req: ['method', 'url', 'headers'],
    res: ['statusCode', 'responseTime'],
  },
  audit: false,
} as any); // Type assertion for pino-http compatibility

// ===== Middleware Setup =====
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(pinoHttpHandler);
app.use(limiter);

// ===== API v1 Routes =====
import authRoutes from './routes/authRoutes';
app.use('/api/v1', authRoutes); // Auth routes

import citiesRoutes from './modules/cities/city.routes';
app.use('/api/v1/cities', citiesRoutes); // City catalogue

import kitsRoutes from './modules/kits/kits.routes';
app.use('/api/v1/kits', kitsRoutes); // Kit catalogue

import providerRoutes from './modules/providers/provider.routes';
app.use('/api/v1/providers', providerRoutes); // Provider routes

import adminRoutes from './modules/admin/admin.routes';
app.use('/api/v1/admin', adminRoutes); // Admin routes

import bookingRoutes from './modules/bookings/booking.routes';
app.use('/api/v1/bookings', bookingRoutes); // Booking routes

// ===== Health Check Endpoint =====
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

// ===== 404 Handler =====
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
  });
});

// ===== Graceful Shutdown =====
const server = app.listen(PORT, () => {
  logger.info(`🚀 RentoFluencer API v1 running on port ${PORT}`);
  logger.info(`📍 Environment: ${NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Lazy Prisma initialization via dynamic ESM import
// This must run after the module loads but before routes are used
;(async () => {
  try {
    // Use require for CJS compatibility with @prisma/client
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    await prisma.$connect();
    console.log('📊 PrismaClient connected to PostgreSQL');
  } catch (err) {
    console.error('❌ Failed to initialize PrismaClient:', err);
    process.exit(1);
  }
})();

export { app, prisma };