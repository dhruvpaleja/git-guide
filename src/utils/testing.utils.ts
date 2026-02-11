/**
 * Testing Utilities and Mocks
 */

import type { ReactNode } from 'react';

/**
 * Mock API responses
 */
export const mockApiResponses = {
  success: (data: unknown) => ({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }),

  error: (code: string, message: string) => ({
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  }),
};

/**
 * Test wrapper with providers
 * Used with React Testing Library's render() function
 */
export function createTestWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    // Return children - providers would be imported if needed
    return children;
  };
}

/**
 * Mock localStorage
 */
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

/**
 * Wait for async operations in tests
 */
export async function waitFor(callback: () => void, options = {}): Promise<void> {
  const { timeout = 1000, interval = 50 } = options as { timeout?: number; interval?: number };
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      callback();
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  throw new Error('Timeout waiting for condition');
}

/**
 * Create mock user
 */
export function createMockUser(overrides = {}) {
  return {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    role: 'user' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Create mock therapist
 */
export function createMockTherapist(overrides = {}) {
  return {
    id: '2',
    email: 'therapist@example.com',
    name: 'Dr. Therapist',
    avatar: 'https://example.com/therapist.jpg',
    role: 'therapist' as const,
    licenseNumber: 'LIC123456',
    specialization: ['anxiety', 'depression'],
    yearsOfExperience: 10,
    languages: ['English'],
    hourlyRate: 100,
    availability: [],
    verified: true,
    bio: 'Experienced therapist',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
