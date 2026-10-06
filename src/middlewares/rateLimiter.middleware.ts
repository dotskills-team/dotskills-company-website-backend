// import rateLimit from 'express-rate-limit';

// export const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { success: false, message: 'Too many requests, please try again later.' },
// });

// export const writeLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 20,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { success: false, message: 'Too many write requests, please slow down.' },
// });
import rateLimit from 'express-rate-limit';

import { ApiError } from '../utils/ApiError.js';

const createLimiter = (windowMs: number, limit: number, message: string) =>
  rateLimit({
    windowMs,
    limit, // express-rate-limit v7+ (older versions: `max`)
    standardHeaders: true,
    legacyHeaders: false,
    // goes through the central error handler => same JSON format everywhere
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

/** Strict limiter against brute force on login / register / refresh. */
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many authentication attempts, please try again later.'
);