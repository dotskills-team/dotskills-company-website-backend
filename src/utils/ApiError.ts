// export class ApiError extends Error {
//   public readonly statusCode: number;
//   public readonly isOperational: boolean;
//   public readonly errors?: unknown[];

//   constructor(
//     statusCode: number,
//     message: string,
//     errors?: unknown[],
//     isOperational = true,
//     stack = ''
//   ) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;
//     this.errors = errors;
//     if (stack) this.stack = stack;
//     else Error.captureStackTrace(this, this.constructor);
//   }

//   static badRequest(msg = 'Bad Request', errors?: unknown[]): ApiError {
//     return new ApiError(400, msg, errors);
//   }
//   static unauthorized(msg = 'Unauthorized'): ApiError {
//     return new ApiError(401, msg);
//   }
//   static forbidden(msg = 'Forbidden'): ApiError {
//     return new ApiError(403, msg);
//   }
//   static notFound(msg = 'Not Found'): ApiError {
//     return new ApiError(404, msg);
//   }
//   static conflict(msg = 'Conflict'): ApiError {
//     return new ApiError(409, msg);
//   }
//   static internal(msg = 'Internal Server Error'): ApiError {
//     return new ApiError(500, msg, undefined, false);
//   }
// // }
// export class ApiError extends Error {
//   public readonly statusCode: number;
//   public readonly isOperational: boolean;
//   public readonly errors: unknown[] | undefined;

//   constructor(
//     statusCode: number,
//     message: string,
//     errors?: unknown[],
//     isOperational = true,
//     stack = ''
//   ) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;
//     this.errors = errors;

//     if (stack) this.stack = stack;
//     else Error.captureStackTrace(this, this.constructor);
//   }

//   static badRequest(msg = 'Bad Request', errors?: unknown[]): ApiError {
//     return new ApiError(400, msg, errors);
//   }

//   static unauthorized(msg = 'Unauthorized'): ApiError {
//     return new ApiError(401, msg);
//   }

//   static forbidden(msg = 'Forbidden'): ApiError {
//     return new ApiError(403, msg);
//   }

//   static notFound(msg = 'Not Found'): ApiError {
//     return new ApiError(404, msg);
//   }

//   static conflict(msg = 'Conflict'): ApiError {
//     return new ApiError(409, msg);
//   }

//   static internal(msg = 'Internal Server Error'): ApiError {
//     return new ApiError(500, msg, undefined, false);
//   }
// }

export interface ApiErrorOptions {
  code?: string;
  details?: unknown;
  isOperational?: boolean;
}

/**
 * Operational (expected) error that is safe to show to the client.
 * Anything that is NOT an ApiError is treated as a programmer error (500).
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    options: ApiErrorOptions = {}
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = options.code ?? 'ERROR';
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new ApiError(400, message, { code: 'BAD_REQUEST', details });
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, { code: 'UNAUTHORIZED' });
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, { code: 'FORBIDDEN' });
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, { code: 'NOT_FOUND' });
  }

  static conflict(message = 'Conflict', details?: unknown) {
    return new ApiError(409, message, { code: 'CONFLICT', details });
  }

  static unprocessable(message = 'Validation failed', details?: unknown) {
    return new ApiError(422, message, { code: 'VALIDATION_ERROR', details });
  }

  static tooManyRequests(message = 'Too many requests, please try again later.') {
    return new ApiError(429, message, { code: 'TOO_MANY_REQUESTS' });
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, {
      code: 'INTERNAL_ERROR',
      isOperational: false,
    });
  }
}