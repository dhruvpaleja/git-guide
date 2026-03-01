/**
 * Application Constants
 * Centralized constants for the entire application
 */

export const APP_CONSTANTS = {
  APP_NAME: 'Soul Yatri',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: import.meta.env.MODE,
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
} as const;

export const API_CONSTANTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const ROUTES = {
  HOME: '/',
  ABOUT: '#about',
  BLOG: '#blog',
  SERVICES: '#services',
  CONTACT: '#contact',
  LOGIN: '#login',
  SIGNUP: '#signup',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  NOT_FOUND: '/404',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
  CACHE: 'app_cache',
} as const;

export const ERRORS = {
  NETWORK_ERROR: 'Network error. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please login.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Validation error.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  BASE: 300,
  SLOW: 500,
  SLOWER: 1000,
} as const;
