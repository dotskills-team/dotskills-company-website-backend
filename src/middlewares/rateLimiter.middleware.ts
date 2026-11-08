import rateLimit from 'express-rate-limit';

import { ApiError } from '../utils/ApiError.js';

const isProd = process.env.NODE_ENV === 'production';

const createLimiter = (
  windowMs: number,
  limit: number,
  message: string,
  skipSuccessfulRequests = false
) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (_req, _res, next) => next(ApiError.tooManyRequests(message)),
  });

export const apiLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests, please try again later.'
);

export const writeLimiter = createLimiter(
  60 * 1000,
  20,
  'Too many write requests, please slow down.'
);

/** Brute-force protection for login / register only. */
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  isProd ? 10 : 200,
  'Too many authentication attempts, please try again later.',
  true // সফল login কোটা খরচ করে না
);

/** Refresh runs on every page load, so it needs a higher limit. */
export const refreshLimiter = createLimiter(
  15 * 60 * 1000,
  isProd ? 100 : 1000,
  'Too many refresh requests, please try again later.'
);