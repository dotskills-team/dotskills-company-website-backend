// import type { Request, Response, NextFunction } from 'express';
// import { type ZodType, ZodError } from 'zod';
// import { ApiError } from '../utils/ApiError';

// type ParsedRequest = {
//   body?: unknown;
//   query?: Record<string, unknown> | null;
//   params?: Record<string, string> | null;
// };

// export const validate =
//   (schema: ZodType) =>
//   (req: Request, _res: Response, next: NextFunction): void => {
//     try {
//       const parsed = schema.parse({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//       }) as ParsedRequest;

//       if (parsed.body !== undefined) {
//         req.body = parsed.body;
//       }

//       if (parsed.params !== undefined && parsed.params !== null) {
//         req.params = parsed.params;
//       }

//       if (parsed.query !== undefined && parsed.query !== null) {
//         Object.defineProperty(req, 'query', {
//           value: parsed.query,
//           writable: true,
//           configurable: true,
//           enumerable: true,
//         });
//       }

//       next();
//     } catch (err) {
//       if (err instanceof ZodError) {
//         const errors = err.issues.map((e) => ({
//           path: e.path.join('.'),
//           message: e.message,
//         }));

//         next(ApiError.badRequest('Validation failed', errors));
//         return;
//       }

//       next(err);
//     }
//   };
import type { Request, RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

const override = (req: Request, key: 'params' | 'query', value: unknown) => {
  // Express 5: req.query is a getter, so it cannot be assigned directly.
  Object.defineProperty(req, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
};

/**
 * Validates { body, params, query } against a Zod schema and replaces them
 * with the parsed values (defaults, coercion and stripping take effect).
 * Errors are forwarded to the central error handler.
 */
export const validate =
  (schema: ZodTypeAny): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(result.error);
    }

    const data = result.data as {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };

    if (data.body !== undefined) req.body = data.body;
    if (data.params !== undefined) override(req, 'params', data.params);
    if (data.query !== undefined) override(req, 'query', data.query);

    next();
  };