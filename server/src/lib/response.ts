// ---------------------------------------------------------------------------
// Response Helpers - Standardized API response envelope
// ---------------------------------------------------------------------------

import type { Response } from 'express';
import type { ApiEnvelope, PaginationMeta } from '../shared/contracts/api.contracts.js';
import { defaultErrorCodeForStatus, resolveCanonicalErrorCode } from './errors.js';
import { getRequestId } from '../middleware/request-context.js';

export type ApiResponse<T = unknown> = ApiEnvelope<T, string, PaginationMeta>;

/**
 * Send a standardized success response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta,
): void {
  const body: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId: getRequestId(res.req),
  };

  if (meta) {
    body.meta = meta;
  }

  res.status(statusCode).json(body);
}

/**
 * Send a standardized error response
 */
export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
): void {
  const canonicalCode = resolveCanonicalErrorCode(code, defaultErrorCodeForStatus(statusCode));

  const body: ApiResponse = {
    success: false,
    error: {
      code: canonicalCode,
      message,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
    requestId: getRequestId(res.req),
  };

  res.status(statusCode).json(body);
}

/**
 * Calculate pagination meta from query parameters
 */
export function parsePagination(query: Record<string, unknown>): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '20'), 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Build pagination meta object
 */
export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
