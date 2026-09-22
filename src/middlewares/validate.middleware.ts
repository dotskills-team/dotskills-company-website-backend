import type { Request, Response, NextFunction } from 'express';
import { type AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;

      // Express 5 এ req.query immutable
      if (parsed.query) {
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
        // ✅ Zod 4.x এ issues ব্যবহার করুন
        const issues = err.issues ?? [];
        const errors = issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        next(ApiError.badRequest('Validation failed', errors));
        return;
      }
      next(err);
    }
  };