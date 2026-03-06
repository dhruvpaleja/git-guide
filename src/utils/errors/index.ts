/**
 * Error classes and error-handling utilities.
 * Includes canonical + legacy compatibility mapping used by API middleware/services.
 */

export const CANONICAL_ERROR_CODES = {
  // Auth
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

  // Validation
  VALIDATION_FAILED: 'VAL_001',
  INVALID_INPUT: 'VAL_002',
  MISSING_REQUIRED_FIELD: 'VAL_003',
  INVALID_FORMAT: 'VAL_004',
  PAYLOAD_TOO_LARGE: 'VAL_005',

  // Resource
  NOT_FOUND: 'RES_001',
  ALREADY_EXISTS: 'RES_002',
  CONFLICT: 'RES_003',
  GONE: 'RES_004',

  // Business
  SLOT_UNAVAILABLE: 'BIZ_001',
  SESSION_NOT_CANCELLABLE: 'BIZ_002',
  PAYMENT_FAILED: 'BIZ_003',
  PAYMENT_DUPLICATE: 'BIZ_004',
  INSUFFICIENT_BALANCE: 'BIZ_005',
  BOOKING_TOO_SOON: 'BIZ_006',
  ONBOARDING_INCOMPLETE: 'BIZ_007',
  DAILY_LIMIT_REACHED: 'BIZ_008',
  THERAPIST_UNAVAILABLE: 'BIZ_009',

  // Rate limit
  RATE_LIMITED: 'RATE_001',
  TOO_MANY_REQUESTS: 'RATE_002',

  // Server
  INTERNAL: 'SRV_001',
  SERVICE_UNAVAILABLE: 'SRV_002',
  DATABASE_ERROR: 'SRV_003',
  EXTERNAL_SERVICE_ERROR: 'SRV_004',
  NOT_IMPLEMENTED: 'SRV_005',
} as const;

export type CanonicalErrorCode = (typeof CANONICAL_ERROR_CODES)[keyof typeof CANONICAL_ERROR_CODES];

const CANONICAL_CODE_SET = new Set<string>(Object.values(CANONICAL_ERROR_CODES));

const LEGACY_ERROR_CODE_ALIASES: Record<string, CanonicalErrorCode> = {
  AUTH_INVALID_CREDENTIALS: CANONICAL_ERROR_CODES.INVALID_CREDENTIALS,
  AUTH_ACCOUNT_LOCKED: CANONICAL_ERROR_CODES.ACCOUNT_LOCKED,
  AUTH_EMAIL_EXISTS: CANONICAL_ERROR_CODES.EMAIL_ALREADY_EXISTS,
  AUTH_TOKEN_EXPIRED: CANONICAL_ERROR_CODES.TOKEN_EXPIRED,
  AUTH_TOKEN_INVALID: CANONICAL_ERROR_CODES.TOKEN_INVALID,
  AUTH_TOKEN_REVOKED: CANONICAL_ERROR_CODES.TOKEN_REVOKED,
  USER_NOT_FOUND: CANONICAL_ERROR_CODES.NOT_FOUND,
  USER_ALREADY_EXISTS: CANONICAL_ERROR_CODES.ALREADY_EXISTS,
  VALIDATION_FAILED: CANONICAL_ERROR_CODES.VALIDATION_FAILED,
  NOT_FOUND: CANONICAL_ERROR_CODES.NOT_FOUND,
  FORBIDDEN: CANONICAL_ERROR_CODES.FORBIDDEN,
  INTERNAL_ERROR: CANONICAL_ERROR_CODES.INTERNAL,
  RATE_LIMIT_EXCEEDED: CANONICAL_ERROR_CODES.RATE_LIMITED,

  UNAUTHORIZED: CANONICAL_ERROR_CODES.UNAUTHORIZED,
  AUTHENTICATION_ERROR: CANONICAL_ERROR_CODES.UNAUTHORIZED,
  AUTHORIZATION_ERROR: CANONICAL_ERROR_CODES.FORBIDDEN,
  TOKEN_EXPIRED: CANONICAL_ERROR_CODES.TOKEN_EXPIRED,
  TOKEN_INVALID: CANONICAL_ERROR_CODES.TOKEN_INVALID,
  TOKEN_REVOKED: CANONICAL_ERROR_CODES.TOKEN_REVOKED,
  INTERNAL_SERVER_ERROR: CANONICAL_ERROR_CODES.INTERNAL,
  RATE_LIMITED: CANONICAL_ERROR_CODES.RATE_LIMITED,
  TOO_MANY_REQUESTS: CANONICAL_ERROR_CODES.TOO_MANY_REQUESTS,
  DATABASE_ERROR: CANONICAL_ERROR_CODES.DATABASE_ERROR,
  SERVICE_UNAVAILABLE: CANONICAL_ERROR_CODES.SERVICE_UNAVAILABLE,
  EXTERNAL_SERVICE_ERROR: CANONICAL_ERROR_CODES.EXTERNAL_SERVICE_ERROR,

  API_ERROR: CANONICAL_ERROR_CODES.INTERNAL,
  CIRCUIT_OPEN: CANONICAL_ERROR_CODES.SERVICE_UNAVAILABLE,
  UPLOAD_ERROR: CANONICAL_ERROR_CODES.SERVICE_UNAVAILABLE,
};

const AUTH_REFRESHABLE_CODES = new Set<CanonicalErrorCode>([
  CANONICAL_ERROR_CODES.UNAUTHORIZED,
  CANONICAL_ERROR_CODES.TOKEN_EXPIRED,
  CANONICAL_ERROR_CODES.TOKEN_INVALID,
  CANONICAL_ERROR_CODES.SESSION_EXPIRED,
]);

const LOGOUT_CODES = new Set<CanonicalErrorCode>([
  CANONICAL_ERROR_CODES.UNAUTHORIZED,
  CANONICAL_ERROR_CODES.TOKEN_REVOKED,
  CANONICAL_ERROR_CODES.REFRESH_TOKEN_MISSING,
  CANONICAL_ERROR_CODES.ACCOUNT_LOCKED,
]);

const RETRYABLE_TRANSIENT_CODES = new Set<CanonicalErrorCode>([
  CANONICAL_ERROR_CODES.INTERNAL,
  CANONICAL_ERROR_CODES.SERVICE_UNAVAILABLE,
  CANONICAL_ERROR_CODES.DATABASE_ERROR,
  CANONICAL_ERROR_CODES.EXTERNAL_SERVICE_ERROR,
]);

export function isCanonicalErrorCode(code: unknown): code is CanonicalErrorCode {
  return typeof code === 'string' && CANONICAL_CODE_SET.has(code);
}

export function canonicalErrorCodeForStatus(statusCode: number): CanonicalErrorCode {
  if (statusCode === 400 || statusCode === 422) {
    return CANONICAL_ERROR_CODES.VALIDATION_FAILED;
  }
  if (statusCode === 401) {
    return CANONICAL_ERROR_CODES.UNAUTHORIZED;
  }
  if (statusCode === 403) {
    return CANONICAL_ERROR_CODES.FORBIDDEN;
  }
  if (statusCode === 404) {
    return CANONICAL_ERROR_CODES.NOT_FOUND;
  }
  if (statusCode === 409) {
    return CANONICAL_ERROR_CODES.CONFLICT;
  }
  if (statusCode === 413) {
    return CANONICAL_ERROR_CODES.PAYLOAD_TOO_LARGE;
  }
  if (statusCode === 429) {
    return CANONICAL_ERROR_CODES.RATE_LIMITED;
  }
  if (statusCode === 501) {
    return CANONICAL_ERROR_CODES.NOT_IMPLEMENTED;
  }
  if (statusCode === 503) {
    return CANONICAL_ERROR_CODES.SERVICE_UNAVAILABLE;
  }
  return CANONICAL_ERROR_CODES.INTERNAL;
}

export function getCanonicalErrorCode(code?: string | null, statusCode?: number): CanonicalErrorCode {
  if (typeof code === 'string') {
    if (isCanonicalErrorCode(code)) {
      return code;
    }

    const mapped = LEGACY_ERROR_CODE_ALIASES[code];
    if (mapped) {
      return mapped;
    }

    const httpAliasMatch = /^HTTP_(\d{3})$/i.exec(code);
    if (httpAliasMatch) {
      return canonicalErrorCodeForStatus(Number(httpAliasMatch[1]));
    }
  }

  if (typeof statusCode === 'number') {
    return canonicalErrorCodeForStatus(statusCode);
  }

  return CANONICAL_ERROR_CODES.INTERNAL;
}

export function isTransientFetchError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.name === 'TypeError' || error.name === 'AbortError' || error.name === 'TimeoutError';
}

export function shouldRetryRequest(params: {
  method: string;
  statusCode?: number;
  code?: string;
  attempt: number;
  maxAttempts: number;
  isTransientNetworkError?: boolean;
}): boolean {
  if (params.attempt >= params.maxAttempts - 1) {
    return false;
  }

  if (params.method.toUpperCase() !== 'GET') {
    return false;
  }

  if (params.isTransientNetworkError) {
    return true;
  }

  if (typeof params.statusCode === 'number' && params.statusCode >= 500) {
    return true;
  }

  const canonicalCode = getCanonicalErrorCode(params.code, params.statusCode);
  return RETRYABLE_TRANSIENT_CODES.has(canonicalCode);
}

export function canAttemptTokenRefresh(params: {
  code?: string;
  statusCode?: number;
  endpoint?: string;
  hasToken: boolean;
}): boolean {
  if (!params.hasToken) {
    return false;
  }

  if (params.endpoint?.startsWith('/auth/')) {
    return false;
  }

  if (params.statusCode !== 401) {
    return false;
  }

  const canonicalCode = getCanonicalErrorCode(params.code, params.statusCode);
  return AUTH_REFRESHABLE_CODES.has(canonicalCode);
}

export function shouldLogoutForError(code?: string, statusCode?: number): boolean {
  const canonicalCode = getCanonicalErrorCode(code, statusCode);
  return LOGOUT_CODES.has(canonicalCode);
}

export type ErrorAction = 'none' | 'logout' | 'refresh' | 'retry' | 'notify';

export function resolveErrorAction(params: {
  code?: string;
  statusCode?: number;
  endpoint?: string;
  method?: string;
  hasToken?: boolean;
  attempt?: number;
  maxAttempts?: number;
  isTransientNetworkError?: boolean;
}): ErrorAction {
  const method = params.method ?? 'GET';
  const attempt = params.attempt ?? 0;
  const maxAttempts = params.maxAttempts ?? 1;

  if (canAttemptTokenRefresh({
    code: params.code,
    statusCode: params.statusCode,
    endpoint: params.endpoint,
    hasToken: Boolean(params.hasToken),
  })) {
    return 'refresh';
  }

  if (shouldRetryRequest({
    method,
    statusCode: params.statusCode,
    code: params.code,
    attempt,
    maxAttempts,
    isTransientNetworkError: params.isTransientNetworkError,
  })) {
    return 'retry';
  }

  if (shouldLogoutForError(params.code, params.statusCode)) {
    return 'logout';
  }

  if (params.statusCode === 403) {
    return 'notify';
  }

  return 'none';
}

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = CANONICAL_ERROR_CODES.INTERNAL,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = getCanonicalErrorCode(code, statusCode);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400, CANONICAL_ERROR_CODES.VALIDATION_FAILED);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, CANONICAL_ERROR_CODES.UNAUTHORIZED);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, CANONICAL_ERROR_CODES.FORBIDDEN);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, CANONICAL_ERROR_CODES.NOT_FOUND);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, CANONICAL_ERROR_CODES.CONFLICT);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class ServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, CANONICAL_ERROR_CODES.INTERNAL);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Error Messages Constants
 */
export const ErrorMessages = {
  VALIDATION_FAILED: 'Validation failed',
  AUTHENTICATION_FAILED: 'Authentication failed',
  AUTHORIZATION_FAILED: 'You do not have permission to access this resource',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  SERVER_ERROR: 'An unexpected error occurred',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT: 'Request timed out',
} as const;
