/* eslint-disable react-refresh/only-export-components */
/**
 * Auth Context
 * Global authentication state management
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import apiService from '@/services/api.service';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '@/constants';
import { runtimeFlags } from '@/config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  logout: () => Promise<void>;
  signup: (data: { name: string; email: string; password: string; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Note: in a full implementation, you'd fetch `/auth/me` on mount to re-hydrate the user
  // This satisfies the Phase 1 MVP requirements.

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if this is a dev login email
      const isDevLogin = runtimeFlags.mockAuthEnabled
        && ['user@test.com', 'therapist@test.com', 'astrologer@test.com', 'admin@test.com'].includes(email);

      // DEV MODE: Use dev-login API to get REAL JWTs for test accounts
      if (isDevLogin) {
        const devPasswords: Record<string, string[]> = {
          'user@test.com': ['user123', 'User123!@#'],
          'therapist@test.com': ['therapist123', 'Therapist123!@#'],
          'astrologer@test.com': ['astrologer123', 'Astrologer123!@#'],
          'admin@test.com': ['admin123', 'Admin123!@#'],
        };

        // Validate password locally
        if (!devPasswords[email]?.includes(password)) {
          toast.error('Invalid email or password. Please try again.');
          return { success: false };
        }

        // Call dev-login API to get a real JWT token
        const response = await apiService.get<{
          user: { id: string; email: string; name: string; role: string };
          accessToken: string;
        }>(`/dev-login/${email}`);

        if (response.success && response.data) {
          const userData: User = {
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.name,
            role: response.data.user.role as User['role'],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUser(userData);
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
          toast.success('Successfully logged in!');
          return { success: true, user: userData };
        } else {
          // Fallback: try real login endpoint
          console.warn('Dev-login failed, falling back to real login');
        }
      }

      // Real authentication for non-test accounts (or dev-login fallback)
      const response = await apiService.post<{ user: User, accessToken: string }>('/auth/login', { email, password });

      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
        toast.success('Successfully logged in!');
        return { success: true, user: response.data.user };
      } else {
        const errorMessage = response.error?.message || 'Login failed';
        toast.error(errorMessage);
        return { success: false };
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiService.post('/auth/logout');
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      toast.success('Successfully logged out!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: { name: string; email: string; password: string; role?: UserRole }) => {
    setIsLoading(true);
    try {
      const response = await apiService.post<{ user: User, accessToken: string }>('/auth/register', data);

      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
        toast.success('Account created successfully!');
        return { success: true };
      } else {
        // Development mode: simulate successful signup if backend is not available
        const isDevelopment = import.meta.env.MODE === 'development';
        const errorMessage = response.error?.message || 'Signup failed';
        const isNetworkError = errorMessage.toLowerCase().includes('request failed') ||
          errorMessage.toLowerCase().includes('failed to fetch') ||
          errorMessage.toLowerCase().includes('network') ||
          errorMessage.toLowerCase().includes('connection');

        if (isDevelopment && isNetworkError) {
          // Create mock user for development
          const mockUser: User = {
            id: 'dev-user-' + Date.now(),
            name: data.name,
            email: data.email,
            role: data.role || 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          setUser(mockUser);
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'dev-token-' + Date.now());
          toast.success('Account created successfully! (Dev Mode)');
          return { success: true };
        }

        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hydrateUser = useCallback(async () => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!accessToken) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.get<{ user: User }>('/auth/me');
      if (response.success && response.data) {
        setUser(response.data.user);
        return;
      }

      const refreshResponse = await apiService.post<{ accessToken: string }>('/auth/refresh');
      if (refreshResponse.success && refreshResponse.data) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, refreshResponse.data.accessToken);
        const meResponse = await apiService.get<{ user: User }>('/auth/me');
        if (meResponse.success && meResponse.data) {
          setUser(meResponse.data.user);
          return;
        }
      }

      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setUser(null);
    } catch {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrateUser();
  }, [hydrateUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
