export const rateLimiter = (config: {
  windowMs: number;
  max: number;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}) => {
  const rateLimit = require('express-rate-limit');

  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    standardHeaders: config.standardHeaders !== false,
    legacyHeaders: config.legacyHeaders !== false,
    message: {
      status: 'fail',
      message: 'Too many requests from this IP, please try again later.',
    },
  });
};