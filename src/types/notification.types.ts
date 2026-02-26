/**
 * Notification & Broadcast Types
 * In-app, push, email, SMS notification channels with preferences
 */

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

export type NotificationType =
  | 'session-reminder'
  | 'session-booked'
  | 'session-cancelled'
  | 'session-completed'
  | 'task-assigned'
  | 'task-due'
  | 'emergency-flag'
  | 'mood-decline'
  | 'pattern-detected'
  | 'payment-success'
  | 'payment-failed'
  | 'refund-processed'
  | 'blog-approved'
  | 'blog-rejected'
  | 'course-approved'
  | 'course-rejected'
  | 'new-message'
  | 'community-reply'
  | 'community-like'
  | 'event-reminder'
  | 'membership-expiring'
  | 'membership-renewed'
  | 'order-shipped'
  | 'order-delivered'
  | 'astrology-report-ready'
  | 'therapist-alert'
  | 'admin-broadcast'
  | 'system-update'
  | 'review-received'
  | 'complaint-update'
  | 'new-follower';

export type NotificationChannel = 'in-app' | 'push' | 'email' | 'sms';

export interface NotificationPreferences {
  userId: string;
  /** Per-channel toggles */
  inApp: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
  /** Per-type overrides */
  typeOverrides: NotificationTypeOverride[];
  /** Quiet hours */
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // HH:mm
  quietHoursEnd?: string;
  /** Frequency limits */
  digestMode: 'instant' | 'hourly' | 'daily';
  updatedAt: Date;
}

export interface NotificationTypeOverride {
  type: NotificationType;
  enabled: boolean;
  channels: NotificationChannel[];
}

/** Admin broadcast to all users or specific segments */
export interface AdminBroadcast {
  id: string;
  title: string;
  message: string;
  targetAudience: BroadcastAudience;
  channels: NotificationChannel[];
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  recipientCount: number;
  readCount: number;
  createdBy: string;
  createdAt: Date;
}

export interface BroadcastAudience {
  type: 'all' | 'role' | 'membership' | 'segment' | 'custom';
  roles?: string[];
  membershipTiers?: string[];
  userIds?: string[];
  filters?: Record<string, unknown>;
}
