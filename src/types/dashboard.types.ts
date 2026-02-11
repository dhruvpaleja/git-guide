/**
 * Dashboard Types
 */

export interface DashboardStats {
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  meditationMinutesThisMonth: number;
  journalEntriesThisMonth: number;
  currentStreak: number;
  moodTrend: 'improving' | 'stable' | 'declining';
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface UserDashboard {
  stats: DashboardStats;
  recentSessions: TherapySession[];
  upcomingSessions: TherapySession[];
  recentMoodLogs: MoodLog[];
  recentJournalEntries: JournalEntry[];
  goals: HealthGoal[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  action: string;
  actionUrl: string;
  priority: 'high' | 'medium' | 'low';
}

import type { TherapySession, MoodLog, JournalEntry, HealthGoal } from './index';
