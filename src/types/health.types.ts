/**
 * Health Tools Feature Types
 */

export interface MoodLog {
  id: string;
  userId: string;
  mood: MoodLevel;
  intensity: number; // 1-10
  triggers?: string[];
  notes?: string;
  activities?: string[];
  timestamp: Date;
}

export type MoodLevel = 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';

export interface MeditationSession {
  id: string;
  userId: string;
  duration: number; // in minutes
  type: 'guided' | 'unguided';
  category: string;
  soundscape?: string;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood?: MoodLevel;
  tags: string[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BreathingExercise {
  id: string;
  userId: string;
  type: 'box' | '478' | 'alternate';
  duration: number;
  completedAt: Date;
}

export interface HealthMetrics {
  userId: string;
  date: Date;
  averageMood: number;
  meditationMinutes: number;
  journalEntries: number;
  breathingExercises: number;
  sleepHours?: number;
  stressLevel?: number;
}

export interface HealthGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  createdAt: Date;
  deadlineAt: Date;
  completed: boolean;
}
