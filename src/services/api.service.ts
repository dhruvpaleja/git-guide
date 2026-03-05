/**
 * API Service
 * Centralized API communication with circuit-breaker for fast failure
 */

import { API_CONSTANTS, STORAGE_KEYS } from '@/constants';
import type { ApiResponse, RequestConfig } from '@/types';
import { isApiEnvelope } from '@contracts/api.contracts';

/** Simple circuit-breaker: after a network failure, skip retries for a cooldown period. */
let circuitOpenUntil = 0;
const CIRCUIT_COOLDOWN = 10_000; // 10 s

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

function extractRequestId(payload: unknown): string | undefined {
  if (isApiEnvelope(payload)) {
    return payload.requestId;
  }
  if (hasObjectShape(payload) && typeof payload.requestId === 'string') {
    return payload.requestId;
  }
  return undefined;
}

function extractError(payload: unknown, status: number, statusText: string) {
  if (isApiEnvelope(payload) && payload.error) {
    return payload.error;
  }

  if (hasObjectShape(payload)) {
    const nestedError = hasObjectShape(payload.error) ? payload.error : payload;
    const code = typeof nestedError.code === 'string' ? nestedError.code : `HTTP_${status}`;
    const message = typeof nestedError.message === 'string'
      ? nestedError.message
      : `HTTP ${status}: ${statusText}`;
    const details = hasObjectShape(nestedError.details) ? nestedError.details : undefined;
    return { code, message, details };
  }

  return {
    code: `HTTP_${status}`,
    message: `HTTP ${status}: ${statusText}`,
  };
}

class ApiService {
  private baseUrl: string;
  private defaultConfig: RequestConfig;

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
          // Don't set Content-Type - browser will set it with boundary
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
          requestId: extractRequestId(result),
        };
      }

      if (isApiEnvelope(result)) {
        return result as ApiResponse<T>;
      }

      return {
        success: true,
        data: (hasObjectShape(result) && Object.prototype.hasOwnProperty.call(result, 'data')
          ? result.data
          : result) as T,
        timestamp: extractTimestamp(result),
        requestId: extractRequestId(result),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: error instanceof Error ? error.message : 'Upload failed',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Generic request method with retry logic
   */
  private async request<T = unknown>(
    method: string,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const maxAttempts = mergedConfig.retries || 1;
    let lastError: Error | null = null;

    // Circuit-breaker: if the backend was recently unreachable, fail instantly.
    if (Date.now() < circuitOpenUntil) {
      return {
        success: false,
        error: { code: 'CIRCUIT_OPEN', message: 'Server unreachable — retrying shortly' },
        timestamp: new Date().toISOString(),
      };
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Build abort signal: prefer caller-provided, else use a timeout signal.
        const timeoutMs = mergedConfig.timeout ?? API_CONSTANTS.TIMEOUT;
        const signal = mergedConfig.cancelToken ?? AbortSignal.timeout(timeoutMs);

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
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

        // Successful network call — reset circuit-breaker.
        circuitOpenUntil = 0;

        const result = await this.parseResponseBody(response);

        if (!response.ok) {
          return {
            success: false,
            error: extractError(result, response.status, response.statusText),
            timestamp: extractTimestamp(result),
            requestId: extractRequestId(result),
          };
        }

        if (isApiEnvelope(result)) {
          return result as ApiResponse<T>;
        }

        return {
          success: true,
          data: result as T,
          timestamp: extractTimestamp(result),
          requestId: extractRequestId(result),
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // If it's a network / timeout error, open the circuit-breaker.
        if (
          lastError.name === 'TypeError' ||
          lastError.name === 'TimeoutError' ||
          lastError.name === 'AbortError'
        ) {
          circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN;
        }

        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, API_CONSTANTS.RETRY_DELAY));
        }
      }
    }

    return {
      success: false,
      error: {
        code: 'API_ERROR',
        message: lastError?.message || 'Request failed',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export const apiService = new ApiService();
export default apiService;
