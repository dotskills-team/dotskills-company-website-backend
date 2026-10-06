// // import type { NextFunction, Request, Response } from "express";
// // import { verifyAccessToken } from "../utils/jwt.js";

// // export interface AuthenticatedRequest extends Request {
// //   user?: {
// //     userId: string;
// //     role: "user" | "admin";
// //   };
// // }

// // export const requireAuth = (
// //   req: AuthenticatedRequest,
// //   res: Response,
// //   next: NextFunction,
// // ): void => {
// //   const authorization = req.headers.authorization;

// //   if (!authorization?.startsWith("Bearer ")) {
// //     res.status(401).json({
// //       success: false,
// //       message: "Authentication required",
// //     });
// //     return;
// //   }

// //   const token = authorization.slice(7).trim();

// //   if (!token) {
// //     res.status(401).json({
// //       success: false,
// //       message: "Authentication required",
// //     });
// //     return;
// //   }

// //   try {
// //     const payload = verifyAccessToken(token);

// //     req.user = {
// //       userId: payload.userId,
// //       role: payload.role,
// //     };

// //     next();
// //   } catch {
// //     res.status(401).json({
// //       success: false,
// //       message: "Invalid or expired access token",
// //     });
// //   }
// // };
// import type { RequestHandler } from 'express';

// import { ApiError } from '../utils/ApiError.js';
// import { verifyAccessToken } from '../utils/jwt.js';

// export interface AuthUser {
//   userId: string;
//   role: 'user' | 'admin';
// }

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace Express {
//     interface Request {
//       user?: AuthUser;
//     }
//   }
// }

// /** Kept for backward compatibility: `req.user` now exists on every Request. */
// export type { Request as AuthenticatedRequest } from 'express';

// export const requireAuth: RequestHandler = (req, _res, next) => {
//   const [scheme, token] = (req.headers.authorization ?? '').split(' ');

//   if (scheme !== 'Bearer' || !token) {
//     return next(ApiError.unauthorized('Authentication required'));
//   }

//   let payload: AuthUser;

//   try {
//     payload = verifyAccessToken(token);
//   } catch {
//     return next(ApiError.unauthorized('Invalid or expired access token'));
//   }

//   req.user = { userId: payload.userId, role: payload.role };
//   return next();
// };
import type { RequestHandler } from 'express';

import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/jwt.js';

export interface AuthUser {
  userId: string;
  role: 'user' | 'admin';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/** Kept for backward compatibility: `req.user` now exists on every Request. */
export type { Request as AuthenticatedRequest } from 'express';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  let payload: AuthUser;

  try {
    payload = verifyAccessToken(token);
  } catch {
    return next(ApiError.unauthorized('Invalid or expired access token'));
  }

  req.user = { userId: payload.userId, role: payload.role };
  return next();
};

/**
 * Attaches `req.user` when a VALID token is sent. Never rejects:
 * missing / invalid / expired tokens are simply treated as anonymous.
 */
export const optionalAuth: RequestHandler = (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');

  if (scheme === 'Bearer' && token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = { userId: payload.userId, role: payload.role };
    } catch {
      // invalid / expired token => anonymous
    }
  }

  return next();
};