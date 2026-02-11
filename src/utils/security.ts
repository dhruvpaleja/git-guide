/**
 * Security Utilities
 */

import { AuthenticationError, AuthorizationError } from '@/utils/errors';
import type { User, UserRole } from '@/types';

/**
 * Hash password (client-side basic hashing, implement server-side in production)
 */
export function hashPassword(password: string): string {
  // Note: This is a basic hash. Use bcrypt or similar on the server
  return btoa(password);
}

/**
 * Verify password
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(user: User | null): boolean {
  return !!user && !!user.id;
}

/**
 * Check if user has specific role
 */
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) throw new AuthenticationError();
  return user.role === requiredRole;
}

/**
 * Check if user has any of the roles
 */
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) throw new AuthenticationError();
  return roles.includes(user.role);
}

/**
 * Verify user permission
 */
export function verifyPermission(user: User | null, requiredRole: UserRole): void {
  if (!user) {
    throw new AuthenticationError('User not authenticated');
  }
  if (user.role !== requiredRole && user.role !== 'admin') {
    throw new AuthorizationError('Insufficient permissions');
  }
}

/**
 * Sanitize HTML string
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Encode URL parameter
 */
export function encodeURLParam(param: string): string {
  return encodeURIComponent(param);
}

/**
 * Decode URL parameter
 */
export function decodeURLParam(param: string): string {
  return decodeURIComponent(param);
}
