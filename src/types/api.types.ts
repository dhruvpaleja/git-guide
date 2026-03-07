/**
 * API-related type definitions
 */
import type {
  ApiEnvelope,
  ApiErrorShape,
  PaginationMeta,
} from '@contracts/api.contracts';

export type CanonicalApiErrorCode =
  | 'AUTH_001' | 'AUTH_002' | 'AUTH_003' | 'AUTH_004' | 'AUTH_005' | 'AUTH_006'
  | 'AUTH_007' | 'AUTH_008' | 'AUTH_009' | 'AUTH_010' | 'AUTH_011' | 'AUTH_012'
  | 'VAL_001' | 'VAL_002' | 'VAL_003' | 'VAL_004' | 'VAL_005'
  | 'RES_001' | 'RES_002' | 'RES_003' | 'RES_004'
  | 'BIZ_001' | 'BIZ_002' | 'BIZ_003' | 'BIZ_004' | 'BIZ_005' | 'BIZ_006' | 'BIZ_007' | 'BIZ_008' | 'BIZ_009'
  | 'RATE_001' | 'RATE_002'
  | 'SRV_001' | 'SRV_002' | 'SRV_003' | 'SRV_004' | 'SRV_005';

export type LegacyApiErrorCode =
  | 'AUTH_INVALID_CREDENTIALS' | 'AUTH_ACCOUNT_LOCKED' | 'AUTH_EMAIL_EXISTS'
  | 'AUTH_TOKEN_EXPIRED' | 'AUTH_TOKEN_INVALID' | 'AUTH_TOKEN_REVOKED'
  | 'USER_NOT_FOUND' | 'USER_ALREADY_EXISTS'
  | 'VALIDATION_FAILED' | 'VALIDATION_ERROR'
  | 'NOT_FOUND' | 'FORBIDDEN' | 'UNAUTHORIZED'
  | 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR'
  | 'INTERNAL_ERROR' | 'INTERNAL_SERVER_ERROR'
  | 'RATE_LIMIT_EXCEEDED' | 'RATE_LIMITED' | 'TOO_MANY_REQUESTS'
  | 'API_ERROR' | 'UPLOAD_ERROR' | 'CIRCUIT_OPEN'
  | 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'TOKEN_REVOKED'
  | 'DATABASE_ERROR' | 'SERVICE_UNAVAILABLE' | 'EXTERNAL_SERVICE_ERROR';

export type HttpAliasErrorCode = `HTTP_${number}`;

export type ApiErrorCode = CanonicalApiErrorCode | LegacyApiErrorCode | HttpAliasErrorCode | string;

export type ApiResponse<T = unknown> = ApiEnvelope<T, ApiErrorCode, PaginationMeta>;

export type ApiError = ApiErrorShape<ApiErrorCode>;

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  cancelToken?: AbortSignal;
  params?: Record<string, string | number | boolean | undefined>;
}
