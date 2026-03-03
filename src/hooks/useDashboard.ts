import { useState, useEffect, useCallback } from 'react';
import apiService from '@/services/api.service';

export interface DashboardStats {
  sessionsCompleted: number;
  moodEntries: number;
  journalEntries: number;
  meditationSessions: number;
}

export interface MoodTrendPoint {
  date: string;
  score: number | null;
}

export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    onboardingComplete: boolean;
  };
  stats: DashboardStats;
  moodTrend: MoodTrendPoint[];
  unreadNotifications: number;
  upcomingSession: null | {
    id: string;
    therapistName: string;
    scheduledAt: string;
    duration: number;
  };
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const res = await apiService.get<DashboardData>('/users/dashboard');
    if (res.success && res.data) {
      setData(res.data);
    } else {
      setError(res.error?.message ?? 'Failed to load dashboard');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Use setTimeout to avoid setting state directly in effect
    setTimeout(() => {
      void fetch();
    }, 0);
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
