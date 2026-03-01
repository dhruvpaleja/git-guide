/**
 * Auth Context
 * Global authentication state management
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/types';
import apiService from '@/services/api.service';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '@/constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
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
      const response = await apiService.post<{ user: User, accessToken: string }>('/auth/login', { email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
        toast.success('Successfully logged in!');
        return true;
      } else {
        // Development mode: simulate successful login if backend is not available
        const isDevelopment = import.meta.env.MODE === 'development';
        const errorMessage = response.error?.message || 'Login failed';
        const isNetworkError = errorMessage.toLowerCase().includes('request failed') || 
                               errorMessage.toLowerCase().includes('failed to fetch') ||
                               errorMessage.toLowerCase().includes('network') ||
                               errorMessage.toLowerCase().includes('connection');
        
        if (isDevelopment && isNetworkError) {
          // Create mock user for development
          const mockUser: User = {
            id: 'dev-user-' + Date.now(),
            name: 'Dev User',
            email: email,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          setUser(mockUser);
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'dev-token-' + Date.now());
          toast.success('Successfully logged in! (Dev Mode)');
          return true;
        }
        
        toast.error(errorMessage);
        return false;
      }
    } catch (e: any) {
      toast.error(e.message || 'An unexpected error occurred');
      return false;
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

  const signup = useCallback(async (data: { name: string; email: string; password: string }) => {
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
            role: 'user',
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
    } catch (e: any) {
      const message = e?.message || 'An unexpected error occurred';
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
