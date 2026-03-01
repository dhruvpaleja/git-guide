// ---------------------------------------------------------------------------
// AppError — Industry-standard typed error class with error codes
// ---------------------------------------------------------------------------

export const ErrorCode = {
  // Auth (1xxx)
  UNAUTHORIZED: 'AUTH_001',
  FORBIDDEN: 'AUTH_002',
  TOKEN_EXPIRED: 'AUTH_003',
  TOKEN_INVALID: 'AUTH_004',
  TOKEN_REVOKED: 'AUTH_005',
  ACCOUNT_LOCKED: 'AUTH_006',
  ACCOUNT_NOT_VERIFIED: 'AUTH_007',
  INVALID_CREDENTIALS: 'AUTH_008',
  EMAIL_ALREADY_EXISTS: 'AUTH_009',
  PASSWORD_TOO_WEAK: 'AUTH_010',
  REFRESH_TOKEN_MISSING: 'AUTH_011',
  SESSION_EXPIRED: 'AUTH_012',

  // Validation (2xxx)
  VALIDATION_FAILED: 'VAL_001',
  INVALID_INPUT: 'VAL_002',
  MISSING_REQUIRED_FIELD: 'VAL_003',
  INVALID_FORMAT: 'VAL_004',
  PAYLOAD_TOO_LARGE: 'VAL_005',

  // Resource (3xxx)
  NOT_FOUND: 'RES_001',
  ALREADY_EXISTS: 'RES_002',
  CONFLICT: 'RES_003',
  GONE: 'RES_004',

  // Business Logic (4xxx)
  SLOT_UNAVAILABLE: 'BIZ_001',
  SESSION_NOT_CANCELLABLE: 'BIZ_002',
  PAYMENT_FAILED: 'BIZ_003',
  PAYMENT_DUPLICATE: 'BIZ_004',
  INSUFFICIENT_BALANCE: 'BIZ_005',
  BOOKING_TOO_SOON: 'BIZ_006',
  ONBOARDING_INCOMPLETE: 'BIZ_007',
  DAILY_LIMIT_REACHED: 'BIZ_008',
  THERAPIST_UNAVAILABLE: 'BIZ_009',

  // Rate Limiting (5xxx)
  RATE_LIMITED: 'RATE_001',
  TOO_MANY_REQUESTS: 'RATE_002',

  // Server (9xxx)
  INTERNAL: 'SRV_001',
  SERVICE_UNAVAILABLE: 'SRV_002',
  DATABASE_ERROR: 'SRV_003',
  EXTERNAL_SERVICE_ERROR: 'SRV_004',
  NOT_IMPLEMENTED: 'SRV_005',
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCodeValue;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(options: {
    message: string;
    statusCode?: number;
    code?: ErrorCodeValue;
    isOperational?: boolean;
    details?: Record<string, unknown>;
    cause?: Error;
  }) {
    super(options.message, { cause: options.cause });
    this.name = 'AppError';
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? ErrorCode.INTERNAL;
    this.isOperational = options.isOperational ?? true;
    this.details = options.details;
    this.timestamp = new Date().toISOString();

    // Preserve stack trace
    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      ...(this.details && { details: this.details }),
    };
  }

  // ------- Factory methods for common errors -------

  static badRequest(message: string, details?: Record<string, unknown>) {
    return new AppError({ message, statusCode: 400, code: ErrorCode.VALIDATION_FAILED, details });
  }

  static unauthorized(message = 'Unauthorized', code: ErrorCodeValue = ErrorCode.UNAUTHORIZED) {
    return new AppError({ message, statusCode: 401, code });
  }

  static forbidden(message = 'Forbidden') {
    return new AppError({ message, statusCode: 403, code: ErrorCode.FORBIDDEN });
  }

  static notFound(resource = 'Resource') {
    return new AppError({ message: `${resource} not found`, statusCode: 404, code: ErrorCode.NOT_FOUND });
  }

  static conflict(message: string, code: ErrorCodeValue = ErrorCode.CONFLICT) {
    return new AppError({ message, statusCode: 409, code });
  }

  static tooManyRequests(message = 'Too many requests, please try again later') {
    return new AppError({ message, statusCode: 429, code: ErrorCode.RATE_LIMITED });
  }

  static internal(message = 'Internal server error', cause?: Error) {
    return new AppError({ message, statusCode: 500, code: ErrorCode.INTERNAL, isOperational: false, cause });
  }

  static notImplemented(feature = 'Feature') {
    return new AppError({ message: `${feature} not implemented`, statusCode: 501, code: ErrorCode.NOT_IMPLEMENTED });
  }

  static serviceUnavailable(service = 'Service') {
    return new AppError({ message: `${service} is temporarily unavailable`, statusCode: 503, code: ErrorCode.SERVICE_UNAVAILABLE });
  }
}
