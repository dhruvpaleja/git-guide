/**
 * API-related type definitions
 */
import type {
  ApiEnvelope,
  ApiErrorShape,
  PaginationMeta,
} from '@contracts/api.contracts';

export type ApiResponse<T = unknown> = ApiEnvelope<T, string, PaginationMeta>;

export type ApiError = ApiErrorShape;

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
}
