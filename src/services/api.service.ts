/**
 * API Service
 * Centralized API communication with circuit-breaker and resilience policies.
 */

import { API_CONSTANTS, STORAGE_KEYS } from '@/constants';
import type { ApiError, ApiResponse, RequestConfig } from '@/types';
import {
  CANONICAL_ERROR_CODES,
  getCanonicalErrorCode,
  isTransientFetchError,
  resolveErrorAction,
} from '@/utils/errors';
import { isApiEnvelope } from '@contracts/api.contracts';
import { activityTracker } from '@/services/activity-tracker';

/** Simple circuit-breaker: after a transient network failure, skip attempts for a cooldown period. */
let circuitOpenUntil = 0;
const CIRCUIT_COOLDOWN = 10_000; // 10s

function hasObjectShape(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function extractTimestamp(payload: unknown): string {
  if (isApiEnvelope(payload)) {
    return payload.timestamp;
  }
  if (hasObjectShape(payload) && typeof payload.timestamp === 'string') {
    return payload.timestamp;
  }
  return new Date().toISOString();
}

function extractRequestId(payload: unknown, response?: Response): string | undefined {
  if (isApiEnvelope(payload)) {
    return payload.requestId;
  }
  if (hasObjectShape(payload) && typeof payload.requestId === 'string') {
    return payload.requestId;
  }

  const headerRequestId = response?.headers.get('x-request-id') ?? response?.headers.get('X-Request-ID');
  return headerRequestId ?? undefined;
}

function extractSuccessData(payload: unknown): unknown {
  if (!hasObjectShape(payload)) {
    return payload;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }

  return payload;
}

function extractError(payload: unknown, status: number, statusText: string): ApiError {
  if (isApiEnvelope(payload) && payload.error) {
    return {
      ...payload.error,
      code: getCanonicalErrorCode(payload.error.code, status),
    };
  }

  if (hasObjectShape(payload)) {
    const nestedError = hasObjectShape(payload.error) ? payload.error : payload;
    const rawCode = typeof nestedError.code === 'string' ? nestedError.code : `HTTP_${status}`;
    const message = typeof nestedError.message === 'string'
      ? nestedError.message
      : `HTTP ${status}: ${statusText}`;
    const details = hasObjectShape(nestedError.details) ? nestedError.details : undefined;

    return {
      code: getCanonicalErrorCode(rawCode, status),
      message,
      ...(details && { details }),
    };
  }

  return {
    code: getCanonicalErrorCode(`HTTP_${status}`, status),
    message: `HTTP ${status}: ${statusText}`,
  };
}

class ApiService {
  private readonly baseUrl: string;
  private readonly defaultConfig: RequestConfig;
  private refreshTokenPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string = API_CONSTANTS.BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultConfig = {
      timeout: API_CONSTANTS.TIMEOUT,
      retries: API_CONSTANTS.RETRY_ATTEMPTS,
    };
  }

  private async parseResponseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return null;
    }

    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private resolveRetryAttempts(method: string, requestedRetries?: number): number {
    const normalizedMethod = method.toUpperCase();

    // No blind retries on non-idempotent requests.
    if (normalizedMethod !== 'GET') {
      return 1;
    }

    const configuredRetries = requestedRetries ?? API_CONSTANTS.RETRY_ATTEMPTS;
    return Math.max(2, configuredRetries);
  }

  private computeRetryDelay(attempt: number): number {
    const baseDelay = API_CONSTANTS.RETRY_DELAY * Math.pow(2, attempt);
    const boundedDelay = Math.min(4000, baseDelay);
    const jitterFactor = 0.8 + Math.random() * 0.4;
    return Math.round(boundedDelay * jitterFactor);
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(API_CONSTANTS.TIMEOUT),
        });

        const payload = await this.parseResponseBody(response);

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          }
          return false;
        }

        if (hasObjectShape(payload) && hasObjectShape(payload.data) && typeof payload.data.accessToken === 'string') {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, payload.data.accessToken);
          return true;
        }

        return false;
      } catch {
        return false;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  /**
   * Make GET request
   */
  async get<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  /**
   * Make POST request
   */
  async post<T = unknown>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  /**
   * Make PUT request
   */
  async put<T = unknown>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  /**
   * Make PATCH request
   */
  async patch<T = unknown>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  /**
   * Make DELETE request
   */
  async delete<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }

  /**
   * Upload file with multipart/form-data
   */
  async upload<T = unknown>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<ApiResponse<T>> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const timeoutMs = mergedConfig.timeout ?? API_CONSTANTS.TIMEOUT;
    const signal = mergedConfig.cancelToken ?? AbortSignal.timeout(timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...this.getAuthHeaders(),
          ...mergedConfig.headers,
          // Do not set Content-Type - browser will set it with boundary.
        },
        body: formData,
        signal,
      });

      const result = await this.parseResponseBody(response);

      if (!response.ok) {
        return {
          success: false,
          error: extractError(result, response.status, response.statusText),
          timestamp: extractTimestamp(result),
          requestId: extractRequestId(result, response),
        };
      }

      if (isApiEnvelope(result)) {
        return result as ApiResponse<T>;
      }

      return {
        success: true,
        data: extractSuccessData(result) as T,
        timestamp: extractTimestamp(result),
        requestId: extractRequestId(result, response),
      };
    } catch (error) {
      const transient = isTransientFetchError(error);
      const code = transient
        ? CANONICAL_ERROR_CODES.SERVICE_UNAVAILABLE
        : CANONICAL_ERROR_CODES.INTERNAL;

      return {
        success: false,
        error: {
          code,
          message: error instanceof Error ? error.message : 'Upload failed',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Generic request method with retry and token-refresh policies.
   */
  private async request<T = unknown>(
    method: string,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const maxAttempts = this.resolveRetryAttempts(method, mergedConfig.retries);

    // Circuit-breaker: if the backend was recently unreachable, fail instantly.
    if (Date.now() < circuitOpenUntil) {
      return {
        success: false,
        error: {
          code: CANONICAL_ERROR_CODES.SERVICE_UNAVAILABLE,
          message: 'Server unreachable - retrying shortly',
        },
        timestamp: new Date().toISOString(),
      };
    }

    let tokenRefreshAttempted = false;
    let lastError: Error | null = null;
    const startTime = performance.now();

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const timeoutMs = mergedConfig.timeout ?? API_CONSTANTS.TIMEOUT;
        const signal = mergedConfig.cancelToken ?? AbortSignal.timeout(timeoutMs);

        let url = `${this.baseUrl}${endpoint}`;
        if (mergedConfig.params) {
          const searchParams = new URLSearchParams();
          for (const [key, value] of Object.entries(mergedConfig.params)) {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          }
          const qs = searchParams.toString();
          if (qs) url += `?${qs}`;
        }

        const response = await fetch(url, {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
            ...mergedConfig.headers,
          },
          body: data ? JSON.stringify(data) : undefined,
          signal,
        });

        // Successful network call - reset circuit-breaker.
        circuitOpenUntil = 0;

        const result = await this.parseResponseBody(response);

        if (!response.ok) {
          const parsedError = extractError(result, response.status, response.statusText);

          const action = resolveErrorAction({
            code: parsedError.code,
            statusCode: response.status,
            endpoint,
            method,
            hasToken: Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)),
            attempt,
            maxAttempts,
          });

          if (action === 'refresh' && !tokenRefreshAttempted) {
            tokenRefreshAttempted = true;
            const refreshed = await this.refreshAccessToken();
            if (refreshed) {
              continue;
            }
          }

          if (action === 'retry') {
            await this.delay(this.computeRetryDelay(attempt));
            continue;
          }

          activityTracker.trackApiCall(endpoint, method, response.status, Math.round(performance.now() - startTime), parsedError.message);
          return {
            success: false,
            error: parsedError,
            timestamp: extractTimestamp(result),
            requestId: extractRequestId(result, response),
          };
        }

        if (isApiEnvelope(result)) {
          activityTracker.trackApiCall(endpoint, method, response.status, Math.round(performance.now() - startTime));
          return result as ApiResponse<T>;
        }

        activityTracker.trackApiCall(endpoint, method, response.status, Math.round(performance.now() - startTime));
        return {
          success: true,
          data: extractSuccessData(result) as T,
          timestamp: extractTimestamp(result),
          requestId: extractRequestId(result, response),
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        const transientNetworkError = isTransientFetchError(lastError);

        if (transientNetworkError) {
          circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN;
        }

        const action = resolveErrorAction({
          method,
          attempt,
          maxAttempts,
          hasToken: Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)),
          isTransientNetworkError: transientNetworkError,
        });

        if (action === 'retry') {
          await this.delay(this.computeRetryDelay(attempt));
          continue;
        }
      }
    }

    const transientNetworkError = isTransientFetchError(lastError);

    activityTracker.trackApiCall(endpoint, method, 0, Math.round(performance.now() - startTime), lastError?.message || 'Request failed');
    return {
      success: false,
      error: {
        code: transientNetworkError
          ? CANONICAL_ERROR_CODES.SERVICE_UNAVAILABLE
          : CANONICAL_ERROR_CODES.INTERNAL,
        message: lastError?.message || 'Request failed',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export const apiService = new ApiService();
export default apiService;
