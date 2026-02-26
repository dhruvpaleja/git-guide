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
  /** Recording & transcription */
  recording?: SessionRecording;
  /** Pre-session astrology report (auto-generated 1-3hrs before) */
  astrologyReportId?: string;
  /** Post-session tasks assigned by therapist */
  tasks?: SessionTask[];
  /** Deep personality report generated after session */
  personalityReport?: PersonalityReport;
  /** AI monitoring data (client-side) — see ai.types.ts */
  clientMonitorId?: string;
  /** AI monitoring data (therapist quality + fraud) — see ai.types.ts */
  therapistMonitorId?: string;
}

export type SessionStatus = 'scheduled' | 'astrology-review' | 'in-progress' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
export type SessionType = 'consultation' | 'therapy' | 'follow-up' | 'assessment';

export interface SessionRecording {
  id: string;
  sessionId: string;
  recordingUrl: string;
  duration: number;
  transcription?: SessionTranscription;
  createdAt: Date;
}

export interface SessionTranscription {
  id: string;
  sessionId: string;
  fullText: string;
  keyPoints: string[];
  actionItems: string[];
  emotionalHighlights: EmotionalHighlight[];
  generatedAt: Date;
}

export interface EmotionalHighlight {
  timestamp: number; // seconds into session
  emotion: string;
  text: string;
  intensity: number; // 0-1
}

export interface SessionTask {
  id: string;
  sessionId: string;
  userId: string;
  therapistId: string;
  title: string;
  description: string;
  category: 'exercise' | 'journaling' | 'meditation' | 'reading' | 'social' | 'lifestyle' | 'other';
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface PersonalityReport {
  id: string;
  userId: string;
  sessionId: string;
  traits: PersonalityTrait[];
  strengths: string[];
  growthAreas: string[];
  healingRecommendations: string[];
  astrologicalInsights?: string[];
  generatedAt: Date;
}

export interface PersonalityTrait {
  name: string;
  score: number; // 0-100
  description: string;
  category: 'emotional' | 'cognitive' | 'behavioral' | 'social' | 'spiritual';
}

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
  struggles: string[];
  preferredTherapist?: string;
  availabilityTimeSlots: TimeSlot[];
  urgent: boolean;
  status: 'pending' | 'matched' | 'rejected';
  /** System auto-matches best therapist based on ranking and specialization */
  matchedTherapistId?: string;
  matchScore?: number;
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

export interface TherapistNotification {
  id: string;
  therapistId: string;
  clientId: string;
  type: 'negative-pattern' | 'emergency-flag' | 'missed-task' | 'session-reminder' | 'astrology-report-ready';
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  read: boolean;
  createdAt: Date;
}
