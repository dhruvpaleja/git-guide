export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public code?: string,
    public isOperational = true,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code?: string) {
    return new AppError(400, message, code);
  }
  static unauthorized(message = 'Unauthorized', code?: string) {
    return new AppError(401, message, code);
  }
  static forbidden(message = 'Forbidden', code?: string) {
    return new AppError(403, message, code);
  }
  static notFound(message = 'Not found', code?: string) {
    return new AppError(404, message, code);
  }
  static conflict(message: string, code?: string) {
    return new AppError(409, message, code);
  }
  static tooMany(message = 'Too many requests', code?: string) {
    return new AppError(429, message, code);
  }
  static internal(message = 'Internal server error', code?: string) {
    return new AppError(500, message, code, false);
  }
}
