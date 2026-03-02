/**
 * API Service
 * Centralized API communication with circuit-breaker for fast failure
 */

import { API_CONSTANTS } from '@/constants';
import type { ApiResponse, RequestConfig } from '@/types';

/** Simple circuit-breaker: after a network failure, skip retries for a cooldown period. */
let circuitOpenUntil = 0;
const CIRCUIT_COOLDOWN = 10_000; // 10 s

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
            ...(localStorage.getItem('auth_token')
              ? { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
              : {}),
            ...mergedConfig.headers,
          },
          body: data ? JSON.stringify(data) : undefined,
          signal,
        });

        // Successful network call — reset circuit-breaker.
        circuitOpenUntil = 0;

        const result = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: {
              code: result?.error?.code || `HTTP_${response.status}`,
              message: result?.error?.message || `HTTP ${response.status}: ${response.statusText}`,
              details: result?.error?.details,
            },
            timestamp: result?.timestamp || new Date().toISOString(),
          };
        }

        if (result?.success === true) {
          return {
            success: true,
            data: result.data as T,
            timestamp: result.timestamp || new Date().toISOString(),
          };
        }

        return {
          success: true,
          data: result as T,
          timestamp: result?.timestamp || new Date().toISOString(),
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
