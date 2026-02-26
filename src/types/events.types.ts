/**
 * Events, Memberships & NGO Collaboration Types
 */

// ── Soul Events ──────────────────────────────────────────────────────────

export interface SoulEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  type: EventType;
  format: 'online' | 'offline' | 'hybrid';
  category: string;
  tags: string[];
  image: string;
  gallery?: string[];
  /** Schedule */
  startDate: Date;
  endDate: Date;
  timezone: string;
  /** Location (for offline/hybrid) */
  venue?: string;
  address?: string;
  city?: string;
  mapUrl?: string;
  /** Online (for online/hybrid) */
  meetingUrl?: string;
  /** Capacity & pricing */
  maxAttendees: number;
  currentAttendees: number;
  isFree: boolean;
  price?: number;
  currency?: string;
  /** Membership-only events */
  membershipRequired?: boolean;
  requiredMembershipTier?: string;
  /** Speakers / facilitators */
  speakers: EventSpeaker[];
  /** Status */
  status: 'draft' | 'published' | 'sold-out' | 'ongoing' | 'completed' | 'cancelled';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EventType =
  | 'workshop'
  | 'retreat'
  | 'webinar'
  | 'meditation-circle'
  | 'breathwork-session'
  | 'healing-ceremony'
  | 'talk'
  | 'corporate-session'
  | 'ngo-outreach'
  | 'community-meetup';

export interface EventSpeaker {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  ticketType: string;
  amount: number;
  paymentId?: string;
  status: 'registered' | 'confirmed' | 'attended' | 'no-show' | 'cancelled' | 'refunded';
  registeredAt: Date;
  checkedInAt?: Date;
}

export interface EventFeedback {
  id: string;
  eventId: string;
  userId: string;
  rating: number; // 1-5
  review: string;
  wouldRecommend: boolean;
  submittedAt: Date;
}

// ── Memberships ──────────────────────────────────────────────────────────

export interface MembershipTier {
  id: string;
  name: string; // e.g., "Seeker", "Healer", "Enlightened"
  slug: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'quarterly' | 'yearly' | 'lifetime';
  features: MembershipFeature[];
  /** What's included */
  therapySessionsPerMonth: number;
  aiAssistantAccess: boolean;
  meditationLibraryAccess: boolean;
  courseDiscountPercent: number;
  shopDiscountPercent: number;
  eventPriorityAccess: boolean;
  communityBadge: string;
  exclusiveContent: boolean;
  /** Limits */
  maxConcurrentCourses: number;
  /** Display */
  color: string;
  icon: string;
  popular: boolean; // highlight as "Most Popular"
  active: boolean;
  sortOrder: number;
}

export interface MembershipFeature {
  name: string;
  included: boolean;
  details?: string;
}

export interface UserMembership {
  id: string;
  userId: string;
  tierId: string;
  tierName: string;
  status: 'active' | 'expired' | 'cancelled' | 'paused' | 'trial';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentId?: string;
  cancelledAt?: Date;
  cancelReason?: string;
}

// ── NGO Collaborations ───────────────────────────────────────────────────

export interface NGOPartner {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  focusAreas: string[]; // mental health, child welfare, etc.
  partnershipType: 'referral' | 'sponsored-sessions' | 'outreach' | 'research' | 'co-branded';
  status: 'active' | 'pending' | 'inactive';
  /** Impact metrics */
  beneficiariesServed: number;
  sessionsDonated: number;
  eventsHosted: number;
  startDate: Date;
  createdAt: Date;
}

export interface NGOBeneficiary {
  id: string;
  ngoPartnerId: string;
  name: string;
  anonymousId: string; // for privacy
  sessionsReceived: number;
  sessionsRemaining: number;
  enrolledAt: Date;
}

export interface NGOImpactReport {
  id: string;
  ngoPartnerId: string;
  period: string; // e.g., "Q1 2026"
  beneficiariesServed: number;
  sessionsProvided: number;
  averageMoodImprovement: number;
  eventsConducted: number;
  volunteerHours: number;
  testimonials: string[];
  generatedAt: Date;
}
