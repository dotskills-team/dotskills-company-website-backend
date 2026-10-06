// import type { Request, Response } from "express";
// import { authService } from "./auth.service.js";
// import { loginSchema, registerSchema } from "./auth.validation.js";
// // import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
// import {
//   signAccessToken,
//   signRefreshToken,
// } from "../../utils/jwt.js";
// import type { AuthenticatedRequest } from "../../middlewares/auth.middleware.js";

// const REFRESH_TOKEN_COOKIE = "refreshToken";

// const setRefreshTokenCookie = (
//   res: Response,
//   refreshToken: string,
// ): void => {
//   res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite:
//       process.env.NODE_ENV === "production" ? "none" : "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     path: "/api/v1/auth",
//   });
// };

// const clearRefreshTokenCookie = (res: Response): void => {
//   res.clearCookie(REFRESH_TOKEN_COOKIE, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite:
//       process.env.NODE_ENV === "production" ? "none" : "lax",
//     path: "/api/v1/auth",
//   });
// };

// export const register = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   const result = registerSchema.safeParse(req.body);

//   if (!result.success) {
//     res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors: result.error.flatten().fieldErrors,
//     });
//     return;
//   }

//   try {
//     const user = await authService.register(result.data);

//     const accessToken = signAccessToken({
//       userId: user.id,
//       role: user.role,
//     });

//     const refreshToken = signRefreshToken({
//       userId: user.id,
//       role: user.role,
//     });

//     setRefreshTokenCookie(res, refreshToken);

//     res.status(201).json({
//       success: true,
//       message: "Registration successful",
//       data: {
//         user,
//         accessToken,
//       },
//     });
//   } catch (error) {
//     if (
//       error instanceof Error &&
//       error.message === "EMAIL_ALREADY_EXISTS"
//     ) {
//       res.status(409).json({
//         success: false,
//         message: "An account with this email already exists",
//       });
//       return;
//     }

//     res.status(500).json({
//       success: false,
//       message: "Unable to create account",
//     });
//   }
// };

// export const login = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   const result = loginSchema.safeParse(req.body);

//   if (!result.success) {
//     res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors: result.error.flatten().fieldErrors,
//     });
//     return;
//   }

//   try {
//     const user = await authService.login(result.data);

//     const accessToken = signAccessToken({
//       userId: user.id,
//       role: user.role,
//     });

//     const refreshToken = signRefreshToken({
//       userId: user.id,
//       role: user.role,
//     });

//     setRefreshTokenCookie(res, refreshToken);

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: {
//         user,
//         accessToken,
//       },
//     });
//   } catch (error) {
//     if (
//       error instanceof Error &&
//       error.message === "ACCOUNT_INACTIVE"
//     ) {
//       res.status(403).json({
//         success: false,
//         message: "Your account is inactive",
//       });
//       return;
//     }

//     res.status(401).json({
//       success: false,
//       message: "Invalid email or password",
//     });
//   }
// };

// export const refresh = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

//   if (!refreshToken) {
//     res.status(401).json({
//       success: false,
//       message: "Refresh token is required",
//     });
//     return;
//   }

//   try {
//     const result = await authService.refresh(refreshToken);

//     setRefreshTokenCookie(res, result.refreshToken);

//     res.status(200).json({
//       success: true,
//       message: "Token refreshed successfully",
//       data: {
//         accessToken: result.accessToken,
//       },
//     });
//   } catch (error) {
//     clearRefreshTokenCookie(res);

//     if (
//       error instanceof Error &&
//       error.message === "ACCOUNT_INACTIVE"
//     ) {
//       res.status(403).json({
//         success: false,
//         message: "Your account is inactive",
//       });
//       return;
//     }

//     res.status(401).json({
//       success: false,
//       message: "Invalid or expired refresh token",
//     });
//   }
// };

// export const logout = async (
//   _req: Request,
//   res: Response,
// ): Promise<void> => {
//   clearRefreshTokenCookie(res);

//   res.status(200).json({
//     success: true,
//     message: "Logout successful",
//   });
// };

// export const getMe = async (
//   req: AuthenticatedRequest,
//   res: Response,
// ): Promise<void> => {
//   if (!req.user) {
//     res.status(401).json({
//       success: false,
//       message: "Authentication required",
//     });
//     return;
//   }

//   try {
//     const user = await authService.getMe(req.user.userId);

//     res.status(200).json({
//       success: true,
//       message: "User retrieved successfully",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {
//     if (
//       error instanceof Error &&
//       error.message === "ACCOUNT_INACTIVE"
//     ) {
//       res.status(403).json({
//         success: false,
//         message: "Your account is inactive",
//       });
//       return;
//     }

//     if (
//       error instanceof Error &&
//       error.message === "USER_NOT_FOUND"
//     ) {
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//       return;
//     }

//     res.status(500).json({
//       success: false,
//       message: "Unable to retrieve user",
//     });
//   }
// };

import type { Request, Response } from 'express';

import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

import {
  clearRefreshTokenCookie,
  getRefreshTokenCookie,
  setRefreshTokenCookie,
} from './auth.cookies.js';
import { authService } from './auth.service.js';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body
    );

    setRefreshTokenCookie(res, refreshToken);

    return ApiResponse.created(
      res,
      { user, accessToken },
      'Registration successful'
    );
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body
    );

    setRefreshTokenCookie(res, refreshToken);

    return ApiResponse.ok(res, { user, accessToken }, 'Login successful');
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = getRefreshTokenCookie(req);

    if (!token) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    try {
      const result = await authService.refresh(token);

      setRefreshTokenCookie(res, result.refreshToken);

      return ApiResponse.ok(
        res,
        { accessToken: result.accessToken },
        'Token refreshed successfully'
      );
    } catch (err) {
      clearRefreshTokenCookie(res);
      throw err;
    }
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    clearRefreshTokenCookie(res);
    return ApiResponse.ok(res, null, 'Logout successful');
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const user = await authService.getMe(req.user.userId);

    return ApiResponse.ok(res, { user }, 'User retrieved successfully');
  }),
};