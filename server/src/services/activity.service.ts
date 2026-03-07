/**
 * Activity Tracking Service
 * 
 * Records every user interaction: clicks, typing, navigation, scrolls,
 * form submissions, API calls, errors, and engagement metrics.
 * 
 * Events are batched from the frontend and inserted in bulk for performance.
 */

import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

export interface ActivityEvent {
  eventType: string;
  eventCategory: string;
  target?: string;
  targetText?: string;
  value?: string;
  page: string;
  component?: string;
  section?: string;
  metadata?: Record<string, unknown>;
  deviceType?: string;
  browser?: string;
  screenWidth?: number;
  screenHeight?: number;
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  timestamp: string; // ISO string from client
  duration?: number;
  sessionId: string;
}

/**
 * Record a batch of activity events.
 * Accepts an array from the frontend tracker and inserts them all.
 */
export async function recordActivities(
  events: ActivityEvent[],
  userId?: string,
): Promise<{ recorded: number }> {
  if (!events.length) return { recorded: 0 };

  try {
    const data = events.map((e) => ({
      userId: userId || null,
      sessionId: e.sessionId,
      eventType: e.eventType,
      eventCategory: e.eventCategory,
      target: e.target || null,
      targetText: truncate(e.targetText, 200),
      value: maskSensitiveValue(e.eventType, e.target, e.value),
      page: e.page,
      component: e.component || null,
      section: e.section || null,
      metadata: e.metadata || null,
      deviceType: e.deviceType || null,
      browser: e.browser || null,
      screenWidth: e.screenWidth || null,
      screenHeight: e.screenHeight || null,
      userAgent: truncate(e.userAgent, 500),
      referrer: e.referrer || null,
      utmSource: e.utmSource || null,
      utmMedium: e.utmMedium || null,
      utmCampaign: e.utmCampaign || null,
      timestamp: new Date(e.timestamp),
      duration: e.duration || null,
    }));

    const result = await prisma.userActivity.createMany({ data });
    logger.info('Activities recorded', { count: result.count, inputCount: events.length });
    return { recorded: result.count };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : undefined;
    logger.error('Failed to record activities', { errorMessage: errMsg, errorStack: errStack, eventCount: events.length });
    // Don't throw — activity tracking should never break the app
    return { recorded: 0 };
  }
}

/**
 * Query activities for analytics / admin dashboard.
 */
export async function getActivities(filters: {
  userId?: string;
  sessionId?: string;
  eventType?: string;
  eventCategory?: string;
  page?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.sessionId) where.sessionId = filters.sessionId;
  if (filters.eventType) where.eventType = filters.eventType;
  if (filters.eventCategory) where.eventCategory = filters.eventCategory;
  if (filters.page) where.page = { contains: filters.page };
  if (filters.fromDate || filters.toDate) {
    where.timestamp = {};
    if (filters.fromDate) (where.timestamp as Record<string, unknown>).gte = new Date(filters.fromDate);
    if (filters.toDate) (where.timestamp as Record<string, unknown>).lte = new Date(filters.toDate);
  }

  const [activities, total] = await Promise.all([
    prisma.userActivity.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: filters.limit || 100,
      skip: filters.offset || 0,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    }),
    prisma.userActivity.count({ where }),
  ]);

  return { activities, total };
}

/**
 * Get aggregated stats for a user or globally.
 */
export async function getActivityStats(userId?: string, days: number = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const where: Record<string, unknown> = {
    timestamp: { gte: since },
  };
  if (userId) where.userId = userId;

  const [
    totalEvents,
    eventsByType,
    eventsByPage,
    eventsByCategory,
    uniqueSessions,
  ] = await Promise.all([
    prisma.userActivity.count({ where }),
    prisma.userActivity.groupBy({
      by: ['eventType'],
      where,
      _count: true,
      orderBy: { _count: { eventType: 'desc' } },
    }),
    prisma.userActivity.groupBy({
      by: ['page'],
      where,
      _count: true,
      orderBy: { _count: { page: 'desc' } },
      take: 20,
    }),
    prisma.userActivity.groupBy({
      by: ['eventCategory'],
      where,
      _count: true,
      orderBy: { _count: { eventCategory: 'desc' } },
    }),
    prisma.userActivity.groupBy({
      by: ['sessionId'],
      where,
      _count: true,
    }),
  ]);

  return {
    totalEvents,
    uniqueSessions: uniqueSessions.length,
    eventsByType: eventsByType.map((e) => ({ type: e.eventType, count: e._count })),
    topPages: eventsByPage.map((e) => ({ page: e.page, count: e._count })),
    eventsByCategory: eventsByCategory.map((e) => ({ category: e.eventCategory, count: e._count })),
    periodDays: days,
  };
}

/**
 * Get a user's journey (sequence of page views with timestamps).
 */
export async function getUserJourney(userId: string, sessionId?: string) {
  const where: Record<string, unknown> = {
    userId,
    eventType: 'navigate',
  };
  if (sessionId) where.sessionId = sessionId;

  const events = await prisma.userActivity.findMany({
    where,
    orderBy: { timestamp: 'asc' },
    select: {
      page: true,
      timestamp: true,
      duration: true,
      sessionId: true,
      referrer: true,
      metadata: true,
    },
    take: 500,
  });

  return events;
}

// --- Helpers ---

function truncate(str: string | undefined | null, max: number): string | null {
  if (!str) return null;
  return str.length > max ? str.slice(0, max) : str;
}

/**
 * Mask password fields and other sensitive input values.
 * Never store actual password characters.
 */
function maskSensitiveValue(
  eventType: string,
  target: string | undefined | null,
  value: string | undefined | null,
): string | null {
  if (!value) return null;
  
  // Always mask password fields
  const sensitivePatterns = /password|passwd|secret|token|credit.?card|cvv|ssn|otp/i;
  if (target && sensitivePatterns.test(target)) {
    return '[MASKED]';
  }
  
  // For typing events, mask if it looks like a sensitive field
  if (eventType === 'type' && target && sensitivePatterns.test(target)) {
    return '[MASKED]';
  }

  // Truncate long values
  return truncate(value, 500);
}
