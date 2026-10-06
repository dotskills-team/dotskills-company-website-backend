// import type { NextFunction, Response } from "express";
// import type { AuthenticatedRequest } from "./auth.middleware.js";

// export const requireAdmin = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   if (!req.user) {
//     res.status(401).json({
//       success: false,
//       message: "Authentication required",
//     });
//     return;
//   }

//   if (req.user.role !== "admin") {
//     res.status(403).json({
//       success: false,
//       message: "Admin access required",
//     });
//     return;
//   }

//   next();
// };
import type { RequestHandler } from 'express';

import { ApiError } from '../utils/ApiError.js';

/** Must be used AFTER requireAuth. */
export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  if (req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }

  return next();
};