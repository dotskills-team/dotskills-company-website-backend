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
// }
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors: unknown[] | undefined;

  constructor(
    statusCode: number,
    message: string,
    errors?: unknown[],
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = 'Bad Request', errors?: unknown[]): ApiError {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg = 'Unauthorized'): ApiError {
    return new ApiError(401, msg);
  }

  static forbidden(msg = 'Forbidden'): ApiError {
    return new ApiError(403, msg);
  }

  static notFound(msg = 'Not Found'): ApiError {
    return new ApiError(404, msg);
  }

  static conflict(msg = 'Conflict'): ApiError {
    return new ApiError(409, msg);
  }

  static internal(msg = 'Internal Server Error'): ApiError {
    return new ApiError(500, msg, undefined, false);
  }
}