/**
 * Therapy / Wellness Guidance Types — BUILD 1
 *
 * Matches backend Session, TherapistProfile, TherapyJourney,
 * UserNudge, and TherapistMetrics models.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type SessionType = 'discovery' | 'pay_as_you_like' | 'standard';
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type PricingStage = 'discovery' | 'pay_as_you_like' | 'standard';
export type NudgeStatus = 'pending' | 'shown' | 'dismissed' | 'acted' | 'expired';

// ---------------------------------------------------------------------------
// Therapist (search / recommendation cards)
// ---------------------------------------------------------------------------

export interface TherapistCard {
  therapistId: string;
  userId: string;
  name: string;
  bio: string;
  photoUrl: string | null;
  specializations: string[];
  approach: 'CBT' | 'HOLISTIC' | 'MIXED';
  languages: string[];
  qualifications: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  pricePerSession: number;
  isOnline: boolean;
  isAcceptingNow: boolean;
  nextAvailableSlot: string | null;
  matchScore: number;
  matchReasons: string[];
}

// ---------------------------------------------------------------------------
// Availability / Time Slots
// ---------------------------------------------------------------------------

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  startDateTime: string;
  endDateTime: string;
  isBooked: boolean;
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export interface SessionDetail {
  id: string;
  userId: string;
  therapistId: string;
  therapist: {
    name: string;
    photoUrl: string | null;
    specializations: string[];
    rating: number;
  };
  scheduledAt: string;
  duration: number;
  status: SessionStatus;
  sessionType: SessionType;
  priceAtBooking: number;
  userPaidAmount: number | null;
  matchScore: number | null;
  matchReason: string | null;
  bookingSource: string;
  userRating: number | null;
  userFeedback: string | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Nudges
// ---------------------------------------------------------------------------

export interface NudgeItem {
  id: string;
  nudgeType: string;
  nudgeData: Record<string, unknown> | null;
  status: NudgeStatus;
  shownAt: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Therapist Dashboard
// ---------------------------------------------------------------------------

export interface TherapistDashboard {
  todaySessions: SessionDetail[];
  totalEarnings: number;
  totalSessions: number;
  rating: number;
  totalClients: number;
}

export interface TherapistClient {
  userId: string;
  name: string;
  avatarUrl: string | null;
  struggles: string[];
  totalSessions: number;
  lastSessionAt: string | null;
  avgRating: number | null;
}

// ---------------------------------------------------------------------------
// Therapy Journey (pricing stage)
// ---------------------------------------------------------------------------

export interface TherapyJourney {
  completedSessionCount: number;
  pricingStage: PricingStage;
  activeTherapistCount: number;
  firstSessionAt: string | null;
  lastSessionAt: string | null;
  totalSpent: number;
}

// ---------------------------------------------------------------------------
// Legacy alias — keep until dashboard.types.ts is cleaned up
// ---------------------------------------------------------------------------

/** @deprecated Use SessionDetail instead */
export type TherapySession = SessionDetail;
