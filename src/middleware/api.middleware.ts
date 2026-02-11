/**
 * Request Middleware
 * Middleware for handling API requests
 */

import type { ApiResponse } from '@/types';

/**
 * Add authentication token to requests
 */
export function authMiddleware(request: RequestInit): RequestInit {
  const token = localStorage.getItem('auth_token');
  
  if (token && request.headers) {
    const headers = request.headers as Record<string, string>;
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return request;
}

/**
 * Handle response errors
 */
export async function errorMiddleware<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
  if (!response.success && response.error) {
    console.error(`API Error [${response.error.code}]:`, response.error.message);
    
    // Handle specific error codes
    if (response.error.code === 'UNAUTHORIZED') {
      // Clear auth and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
  }
  
  return response;
}

/**
 * Log requests and responses
 */
export function loggingMiddleware<T>(response: ApiResponse<T>): ApiResponse<T> {
  if (import.meta.env.DEV) {
    console.log('API Response:', response);
  }
  
  return response;
}
