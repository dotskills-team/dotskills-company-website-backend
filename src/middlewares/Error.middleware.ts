import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { ZodError } from 'zod';

import { ApiError } from '../utils/ApiError';

const isProd = process.env['NODE_ENV'] === 'production';

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
}

const isDuplicateKeyError = (err: unknown): err is MongoDuplicateKeyError =>
  typeof err === 'object' &&
  err !== null &&
  (err as { code?: unknown }).code === 11000;

const isBodyParserSyntaxError = (err: unknown): boolean =>
  err instanceof SyntaxError && 'body' in err;

/** Converts ANY thrown value into an ApiError. */
export const normalizeError = (err: unknown): ApiError => {
  if (err instanceof ApiError) {
    return err;
  }

  if (err instanceof ZodError) {
    return ApiError.badRequest(
      'Validation failed',
      err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))
    );
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return ApiError.badRequest(
      'Validation failed',
      Object.values(err.errors).map((e) => ({
        path: e.path,
        message: e.message,
      }))
    );
  }

  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for '${err.path}'`);
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new ApiError(413, 'File is too large (max 5MB)', {
        code: 'FILE_TOO_LARGE',
      });
    }
    return ApiError.badRequest(err.message);
  }

  if (isDuplicateKeyError(err)) {
    const fields = Object.keys(err.keyValue ?? {});
    return ApiError.conflict(
      fields.length
        ? `Duplicate value for: ${fields.join(', ')}`
        : 'Duplicate value',
      err.keyValue
    );
  }

  if (isBodyParserSyntaxError(err)) {
    return ApiError.badRequest('Malformed JSON body');
  }

  return ApiError.internal();
};

/** 404 for unmatched routes. Register AFTER all routers. */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

/** Central error handler. Register LAST. */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const apiError = normalizeError(err);

  if (!apiError.isOperational || apiError.statusCode >= 500) {
    // Replace with your logger (pino / winston)
    console.error(`[${req.method}] ${req.originalUrl}`, err);
  }

  return res.status(apiError.statusCode).json({
    success: false,
    message: apiError.message,
    code: apiError.code,
    ...(apiError.details !== undefined && { errors: apiError.details }),
    ...(!isProd && { stack: apiError.stack }),
  });
};