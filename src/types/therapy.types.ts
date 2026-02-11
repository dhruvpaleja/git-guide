/**
 * Therapy Session Management Types
 */

export interface TherapySession {
  id: string;
  userId: string;
  therapistId: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: SessionStatus;
  sessionType: SessionType;
  meetingUrl?: string;
  notes?: string;
  prescription?: string;
  followUpDate?: Date;
  cancelledAt?: Date;
  cancelledReason?: string;
  completedAt?: Date;
  feedback?: SessionFeedback;
}

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
export type SessionType = 'consultation' | 'therapy' | 'follow-up' | 'assessment';

export interface SessionFeedback {
  rating: number; // 1-5
  comment: string;
  wouldRecommend: boolean;
  improvementAreas: string[];
  nextSteps: string[];
}

export interface SessionRequest {
  id: string;
  userId: string;
  issue: string;
  preferredTherapist?: string;
  availabilityTimeSlots: TimeSlot[];
  urgent: boolean;
  status: 'pending' | 'matched' | 'rejected';
  createdAt: Date;
}

export interface TimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
}

export interface TherapyProgress {
  sessionId: string;
  userId: string;
  therapistId: string;
  mood: number; // 1-10
  symptoms: string[];
  goals: string[];
  improvements: string[];
  challenges: string[];
  notes: string;
}

export interface TherapyPlan {
  id: string;
  userId: string;
  therapistId: string;
  description: string;
  goals: string[];
  sessions: number;
  duration: string; // e.g., "8 weeks"
  reviewDate: Date;
  completed: boolean;
}
