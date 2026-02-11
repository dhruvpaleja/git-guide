/**
 * API Service
 * Centralized API communication
 */

import { API_CONSTANTS } from '@/constants';
import type { ApiResponse, RequestConfig } from '@/types';

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
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < (mergedConfig.retries || 1); attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...mergedConfig.headers,
          },
          body: data ? JSON.stringify(data) : undefined,
          signal: mergedConfig.cancelToken,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return {
          success: true,
          data: result,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        if (attempt < (mergedConfig.retries || 1) - 1) {
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
