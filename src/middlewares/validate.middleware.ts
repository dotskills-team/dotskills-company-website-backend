import type { Request, Response, NextFunction } from 'express';
import { type ZodType, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

type ParsedRequest = {
  body?: unknown;
  query?: Record<string, unknown> | null;
  params?: Record<string, string> | null;
};

export const validate =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as ParsedRequest;

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      if (parsed.params !== undefined && parsed.params !== null) {
        req.params = parsed.params;
      }

      if (parsed.query !== undefined && parsed.query !== null) {
        Object.defineProperty(req, 'query', {
          value: parsed.query,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));

        next(ApiError.badRequest('Validation failed', errors));
        return;
      }

      next(err);
    }
  };