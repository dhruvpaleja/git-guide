/**
 * Analytics & User Behavior Tracking Types
 * Platform analytics, user behavior, retention, funnels, proactive AI insights
 */

// ── User Behavior Tracking ──────────────────────────────────────────────

export interface UserBehaviorEvent {
  id: string;
  userId: string;
  sessionId: string; // browser session
  eventType: BehaviorEventType;
  page: string;
  component?: string;
  action: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  ipCountry?: string;
}

export type BehaviorEventType =
  | 'page-view'
  | 'click'
  | 'scroll'
  | 'form-submit'
  | 'search'
  | 'video-play'
  | 'session-start'
  | 'session-end'
  | 'feature-use'
  | 'error'
  | 'signup-start'
  | 'signup-complete'
  | 'onboarding-step'
  | 'booking-start'
  | 'booking-complete'
  | 'payment-start'
  | 'payment-complete'
  | 'course-enroll'
  | 'course-progress'
  | 'ai-chat-start'
  | 'community-post'
  | 'shop-add-to-cart'
  | 'shop-checkout';

// ── Platform Analytics ──────────────────────────────────────────────────

export interface PlatformAnalytics {
  period: string; // e.g., '2026-02-17'
  /** User metrics */
  totalUsers: number;
  activeUsersDaily: number;
  activeUsersWeekly: number;
  activeUsersMonthly: number;
  newSignups: number;
  churnedUsers: number;
  churnRate: number;
  /** Engagement */
  averageSessionDuration: number; // minutes
  averagePagesPerSession: number;
  totalPageViews: number;
  bounceRate: number;
  /** Feature usage */
  featureUsage: FeatureUsageMetric[];
  /** Revenue */
  dailyRevenue: number;
  averageRevenuePerUser: number;
  /** Retention */
  retentionDay1: number;
  retentionDay7: number;
  retentionDay30: number;
}

export interface FeatureUsageMetric {
  feature: string;
  usageCount: number;
  uniqueUsers: number;
  averageTimeSpent: number; // seconds
  completionRate?: number;
}

// ── Funnel Analysis ─────────────────────────────────────────────────────

export interface FunnelConfig {
  id: string;
  name: string;
  steps: FunnelStep[];
  createdAt: Date;
}

export interface FunnelStep {
  order: number;
  name: string;
  eventType: BehaviorEventType;
  page?: string;
  count: number;
  dropOffRate: number;
}

export interface FunnelAnalysis {
  funnelId: string;
  period: string;
  steps: FunnelStepResult[];
  overallConversionRate: number;
  biggestDropOff: string;
}

export interface FunnelStepResult {
  stepName: string;
  entered: number;
  completed: number;
  conversionRate: number;
  averageTimeInStep: number; // seconds
}

// ── Cohort Analysis ─────────────────────────────────────────────────────

export interface CohortAnalysis {
  cohortDate: string; // e.g., '2026-W07'
  cohortSize: number;
  retentionByWeek: number[]; // [100, 60, 45, 40, ...]
  revenueByWeek: number[];
}

// ── Proactive AI Insights ───────────────────────────────────────────────

export interface ProactiveInsight {
  id: string;
  department: 'therapy' | 'astrology' | 'marketing' | 'sales' | 'support' | 'content' | 'engineering' | 'platform';
  type: InsightType;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  suggestedAction: string;
  dataEvidence: string;
  status: 'new' | 'acknowledged' | 'acted-on' | 'dismissed';
  createdAt: Date;
}

export type InsightType =
  | 'churn-risk'
  | 'revenue-opportunity'
  | 'user-engagement-drop'
  | 'therapist-performance'
  | 'content-gap'
  | 'trending-topic'
  | 'system-anomaly'
  | 'conversion-improvement'
  | 'user-satisfaction-drop'
  | 'capacity-planning';

// ── Real-Time Dashboard Metrics ─────────────────────────────────────────

export interface RealTimeDashboard {
  activeUsersNow: number;
  activeSessionsNow: number;
  aiConversationsNow: number;
  ordersLast1h: number;
  revenueLast1h: number;
  signupsLast1h: number;
  emergencyFlagsActive: number;
  serverLoad: number; // percentage
  apiLatencyMs: number;
  errorRateLast1h: number;
}
