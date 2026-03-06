/**
 * Request Middleware
 * Middleware for handling API requests
 */

import { STORAGE_KEYS } from '@/constants';
import type { ApiResponse } from '@/types';
import { getCanonicalErrorCode, resolveErrorAction } from '@/utils/errors';

/**
 * Add authentication token to requests
 */
export function authMiddleware(request: RequestInit): RequestInit {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  if (token && request.headers) {
    const headers = request.headers as Record<string, string>;
    headers.Authorization = `Bearer ${token}`;
  }

  return request;
}

/**
 * Handle response errors
 */
export async function errorMiddleware<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
  if (!response.success || !response.error) {
    return response;
  }

  const canonicalCode = getCanonicalErrorCode(response.error.code);
  const action = resolveErrorAction({
    code: canonicalCode,
    hasToken: Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)),
  });

  if (action === 'logout') {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return {
    ...response,
    error: {
      ...response.error,
      code: canonicalCode,
    },
  };
}

/**
 * Log requests and responses
 */
export function loggingMiddleware<T>(response: ApiResponse<T>): ApiResponse<T> {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('API Response:', response);
  }

  return response;
}
