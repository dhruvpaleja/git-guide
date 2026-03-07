// ---------------------------------------------------------------------------
// therapy.service.ts – Core session CRUD & business-logic service
// ---------------------------------------------------------------------------

import { SessionStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AppError, ErrorCode } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { isSlotAvailable } from './availability.service.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_ACTIVE_THERAPISTS = 3;
const CANCELLATION_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
const RESCHEDULE_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
const START_SESSION_WINDOW_MS = 30 * 60 * 1000; // 30 minutes before/after scheduled time
const DISCOVERY_DURATION = 15; // minutes
const STANDARD_DURATION = 45; // minutes

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Ensure a TherapyJourney row exists for the user (lazy-create). */
async function ensureTherapyJourney(userId: string) {
  return prisma.therapyJourney.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

/** Recalculate TherapistProfile.rating as rolling average after a new review. */
async function recalculateRating(therapistId: string) {
  const { _avg, _count } = await prisma.session.aggregate({
    where: { therapistId, userRating: { not: null } },
    _avg: { userRating: true },
    _count: { userRating: true },
  });

  await prisma.therapistProfile.update({
    where: { id: therapistId },
    data: {
      rating: _avg.userRating ?? 0,
      totalReviews: _count.userRating,
    },
  });
}

/** Increment completed-session counter on TherapistProfile. */
async function incrementTherapistSessionCount(therapistId: string) {
  await prisma.therapistProfile.update({
    where: { id: therapistId },
    data: { totalSessions: { increment: 1 } },
  });
}

/** Write audit log for session actions (non-blocking). */
function logSessionAction(
  action: string,
  userId: string | null,
  metadata: Prisma.InputJsonValue,
) {
  prisma.auditLog.create({
    data: {
      userId,
      category: 'SESSION_ACTION',
      action,
      metadata,
    },
  }).catch((err) => logger.error('Audit log write failed', { err, action }));
}

/** Increment real-time TherapistMetrics counters (non-blocking). */
function incrementMetrics(
  therapistId: string,
  field: 'totalCompletedSessions' | 'totalCancelledSessions',
) {
  prisma.therapistMetrics.updateMany({
    where: { therapistId },
    data: { [field]: { increment: 1 } },
  }).catch((err) => logger.error('Metrics increment failed', { err, therapistId, field }));
}

/** Send in-app notification (non-blocking). */
function sendNotification(
  recipientUserId: string,
  type: 'SESSION_REMINDER' | 'SESSION_CONFIRMED' | 'SESSION_CANCELLED',
  title: string,
  body: string,
  data?: Prisma.InputJsonValue,
) {
  prisma.notification.create({
    data: { userId: recipientUserId, type, title, body, data: data ?? Prisma.JsonNull },
  }).catch((err) => logger.error('Notification send failed', { err, recipientUserId, type }));
}

// ---------------------------------------------------------------------------
// Book a scheduled session
// ---------------------------------------------------------------------------

export interface BookSessionInput {
  userId: string;
  therapistId: string;
  scheduledAt: Date;
  sessionType?: string; // "discovery" | "pay_as_you_like" | "standard"
  bookingSource?: string;
  matchScore?: number;
  matchReason?: string;
}

export async function bookSession(input: BookSessionInput) {
  const {
    userId,
    therapistId,
    scheduledAt,
    sessionType = 'standard',
    bookingSource = 'search',
    matchScore,
    matchReason,
  } = input;

  // 1. Verify therapist exists & is available
  const therapist = await prisma.therapistProfile.findUnique({
    where: { id: therapistId },
  });
  if (!therapist || !therapist.isAvailable) {
    throw new AppError({
      message: 'Therapist is not available',
      statusCode: 409,
      code: ErrorCode.THERAPIST_UNAVAILABLE,
    });
  }

  // 2. Ensure onboarding is complete
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile?.onboardingComplete) {
    throw new AppError({
      message: 'Please complete onboarding before booking',
      statusCode: 400,
      code: ErrorCode.ONBOARDING_INCOMPLETE,
    });
  }

  // 3. Determine duration (MAX_ACTIVE_THERAPISTS enforced inside transaction below)
  const duration = sessionType === 'discovery' ? DISCOVERY_DURATION : STANDARD_DURATION;

  // 5. Slot available?
  const slotOpen = await isSlotAvailable(therapistId, scheduledAt, duration);
  if (!slotOpen) {
    throw new AppError({
      message: 'Selected time slot is no longer available',
      statusCode: 409,
      code: ErrorCode.SLOT_UNAVAILABLE,
    });
  }

  // 6. Prevent duplicate booking for same therapist + time
  const existing = await prisma.session.findFirst({
    where: {
      userId,
      therapistId,
      scheduledAt,
      status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
    },
  });
  if (existing) {
    throw new AppError({
      message: 'You already have a session booked at this time',
      statusCode: 409,
      code: ErrorCode.DUPLICATE_BOOKING,
    });
  }

  // 7. Price at booking
  const priceAtBooking =
    sessionType === 'discovery' ? 0 : therapist.pricePerSession;

  // 8. Create session + ensure journey (transaction)
  const session = await prisma.$transaction(async (tx) => {
    // Enforce max active therapists inside transaction to prevent race conditions
    const activeTherapistIds = await tx.session.findMany({
      where: { userId, status: { in: ['SCHEDULED', 'IN_PROGRESS'] } },
      select: { therapistId: true },
      distinct: ['therapistId'],
    });
    const uniqueIds = new Set(activeTherapistIds.map((s) => s.therapistId));
    if (!uniqueIds.has(therapistId) && uniqueIds.size >= MAX_ACTIVE_THERAPISTS) {
      throw new AppError({
        message: `You already have ${MAX_ACTIVE_THERAPISTS} active therapists`,
        statusCode: 409,
        code: ErrorCode.MAX_THERAPISTS_REACHED,
      });
    }

    const created = await tx.session.create({
      data: {
        userId,
        therapistId,
        scheduledAt,
        duration,
        sessionType,
        priceAtBooking,
        bookingSource,
        matchScore,
        matchReason,
      },
    });

    // Recompute active therapist count from actual session data
    const postBookTherapists = await tx.session.findMany({
      where: { userId, status: { in: ['SCHEDULED', 'IN_PROGRESS'] } },
      select: { therapistId: true },
      distinct: ['therapistId'],
    });

    await tx.therapyJourney.upsert({
      where: { userId },
      create: { userId, activeTherapistCount: postBookTherapists.length },
      update: { activeTherapistCount: postBookTherapists.length },
    });

    return created;
  });

  // Audit log: session booked
  logSessionAction('SESSION_BOOKED', userId, {
    sessionId: session.id,
    therapistId,
    sessionType,
    bookingSource,
    scheduledAt: scheduledAt.toISOString(),
    priceAtBooking,
  });

  return session;
}

// ---------------------------------------------------------------------------
// Book an instant session (therapist is online & accepting)
// ---------------------------------------------------------------------------

export interface BookInstantSessionInput {
  userId: string;
  therapistId: string;
  matchScore?: number;
  matchReason?: string;
}

export async function bookInstantSession(input: BookInstantSessionInput) {
  const { userId, therapistId, matchScore, matchReason } = input;

  // Verify therapist is online & accepting
  const onlineStatus = await prisma.therapistOnlineStatus.findUnique({
    where: { therapistId },
  });
  if (!onlineStatus?.isOnline || !onlineStatus.isAcceptingNow) {
    throw new AppError({
      message: 'Therapist is not currently accepting sessions',
      statusCode: 409,
      code: ErrorCode.THERAPIST_NOT_ACCEPTING,
    });
  }

  // Auto-detect session type from user's pricing stage
  const { stage } = await getUserPricingStage(userId);

  const session = await bookSession({
    userId,
    therapistId,
    scheduledAt: new Date(),
    sessionType: stage,
    bookingSource: 'instant',
    matchScore,
    matchReason,
  });

  // Send in-app notification to therapist
  const therapist = await prisma.therapistProfile.findUnique({
    where: { id: therapistId },
    select: { userId: true },
  });
  if (therapist) {
    await prisma.notification.create({
      data: {
        userId: therapist.userId,
        type: 'SESSION_CONFIRMED',
        title: 'New instant session',
        body: 'A user has booked an instant session with you.',
        data: { sessionId: session.id },
      },
    });
  }

  return session;
}

// ---------------------------------------------------------------------------
// List sessions
// ---------------------------------------------------------------------------

export interface ListSessionsOptions {
  status?: SessionStatus[];
  page?: number;
  limit?: number;
}

export async function listUserSessions(
  userId: string,
  opts: ListSessionsOptions = {},
) {
  const { status, page = 1, limit = 20 } = opts;
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(status?.length ? { status: { in: status } } : {}),
  };

  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      skip,
      take: limit,
      include: {
        therapist: {
          select: {
            id: true,
            bio: true,
            photoUrl: true,
            specializations: true,
            rating: true,
            user: { select: { name: true } },
          },
        },
      },
    }),
    prisma.session.count({ where }),
  ]);

  return { sessions, total, page, limit };
}

export async function listTherapistSessions(
  therapistId: string,
  opts: ListSessionsOptions = {},
) {
  const { status, page = 1, limit = 20 } = opts;
  const skip = (page - 1) * limit;

  const where = {
    therapistId,
    ...(status?.length ? { status: { in: status } } : {}),
  };

  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.session.count({ where }),
  ]);

  return { sessions, total, page, limit };
}

// ---------------------------------------------------------------------------
// Session detail
// ---------------------------------------------------------------------------

export async function getSessionDetail(sessionId: string, requesterId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      therapist: {
        select: {
          id: true,
          userId: true,
          bio: true,
          photoUrl: true,
          specializations: true,
          approach: true,
          rating: true,
          user: { select: { name: true } },
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  // Only participants may view
  if (session.userId !== requesterId && session.therapist.userId !== requesterId) {
    throw new AppError({
      message: 'You do not have access to this session',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  return session;
}

// ---------------------------------------------------------------------------
// Cancel session
// ---------------------------------------------------------------------------

export async function cancelSession(
  sessionId: string,
  cancelledBy: string,
  reason?: string,
) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { therapist: { select: { userId: true } } },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  if (session.status !== 'SCHEDULED') {
    throw new AppError({
      message: 'Only scheduled sessions can be cancelled',
      statusCode: 409,
      code: ErrorCode.SESSION_NOT_CANCELLABLE,
    });
  }

  // Verify caller is a participant
  if (session.userId !== cancelledBy && session.therapist.userId !== cancelledBy) {
    throw new AppError({
      message: 'You do not have access to this session',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  // 2-hour cancellation window (user-side only)
  const isUser = session.userId === cancelledBy;
  if (isUser) {
    const msUntil = session.scheduledAt.getTime() - Date.now();
    if (msUntil < CANCELLATION_WINDOW_MS) {
      throw new AppError({
        message: 'Cannot cancel within 2 hours of scheduled time',
        statusCode: 409,
        code: ErrorCode.CANCELLATION_WINDOW_PASSED,
      });
    }
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: {
      status: 'CANCELLED',
      cancelledBy,
      cancelReason: reason,
      cancelledAt: new Date(),
    },
  });

  // Recompute active therapist count after cancellation
  const remainingTherapists = await prisma.session.findMany({
    where: { userId: session.userId, status: { in: ['SCHEDULED', 'IN_PROGRESS'] } },
    select: { therapistId: true },
    distinct: ['therapistId'],
  });
  await prisma.therapyJourney.updateMany({
    where: { userId: session.userId },
    data: { activeTherapistCount: remainingTherapists.length },
  });

  // Notify the other participant
  const isUserCancelling = session.userId === cancelledBy;
  if (isUserCancelling) {
    sendNotification(
      session.therapist.userId,
      'SESSION_CANCELLED',
      'Session cancelled',
      'A client has cancelled their upcoming session.',
      { sessionId, cancelledBy },
    );
  } else {
    sendNotification(
      session.userId,
      'SESSION_CANCELLED',
      'Session cancelled',
      'Your therapist has cancelled your upcoming session.',
      { sessionId, cancelledBy },
    );
  }

  // Audit + metrics
  logSessionAction('SESSION_CANCELLED', cancelledBy, {
    sessionId,
    cancelledBy,
    reason,
    scheduledAt: session.scheduledAt.toISOString(),
  });
  incrementMetrics(session.therapistId, 'totalCancelledSessions');

  return updated;
}

// ---------------------------------------------------------------------------
// Reschedule session
// ---------------------------------------------------------------------------

export async function rescheduleSession(
  sessionId: string,
  requesterId: string,
  newScheduledAt: Date,
) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { therapist: { select: { userId: true } } },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  if (session.status !== 'SCHEDULED') {
    throw new AppError({
      message: 'Only scheduled sessions can be rescheduled',
      statusCode: 409,
      code: ErrorCode.SESSION_NOT_RESCHEDULABLE,
    });
  }

  // Verify caller is a participant
  if (session.userId !== requesterId && session.therapist.userId !== requesterId) {
    throw new AppError({
      message: 'You do not have access to this session',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  // Reschedule window: user cannot reschedule within 2 hours of original time
  const isUser = session.userId === requesterId;
  if (isUser) {
    const msUntil = session.scheduledAt.getTime() - Date.now();
    if (msUntil < RESCHEDULE_WINDOW_MS) {
      throw new AppError({
        message: 'Cannot reschedule within 2 hours of scheduled time',
        statusCode: 409,
        code: ErrorCode.SESSION_NOT_RESCHEDULABLE,
      });
    }
  }

  // Slot must be available
  const slotOpen = await isSlotAvailable(
    session.therapistId,
    newScheduledAt,
    session.duration,
  );
  if (!slotOpen) {
    throw new AppError({
      message: 'New time slot is not available',
      statusCode: 409,
      code: ErrorCode.SLOT_UNAVAILABLE,
    });
  }

  const previousTime = session.scheduledAt;
  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { scheduledAt: newScheduledAt },
  });

  // Notify the other participant
  if (isUser && session.therapist) {
    sendNotification(
      session.therapist.userId,
      'SESSION_CONFIRMED',
      'Session rescheduled',
      `A client has rescheduled their session to ${newScheduledAt.toISOString()}.`,
      { sessionId, oldTime: previousTime.toISOString(), newTime: newScheduledAt.toISOString() },
    );
  } else {
    sendNotification(
      session.userId,
      'SESSION_CONFIRMED',
      'Session rescheduled',
      `Your therapist has rescheduled your session.`,
      { sessionId, oldTime: previousTime.toISOString(), newTime: newScheduledAt.toISOString() },
    );
  }

  logSessionAction('SESSION_RESCHEDULED', requesterId, {
    sessionId,
    previousTime: previousTime.toISOString(),
    newTime: newScheduledAt.toISOString(),
  });

  return updated;
}

// ---------------------------------------------------------------------------
// Session lifecycle transitions
// ---------------------------------------------------------------------------

export async function startSession(sessionId: string, therapistUserId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { therapist: { select: { userId: true } } },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  if (session.therapist.userId !== therapistUserId) {
    throw new AppError({
      message: 'Only the therapist can start a session',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  if (session.status !== 'SCHEDULED') {
    throw new AppError({
      message: 'Session is not in SCHEDULED status',
      statusCode: 409,
      code: ErrorCode.SESSION_ALREADY_STARTED,
    });
  }

  // Time proximity check: can only start within 30 min of scheduled time
  const msUntil = Math.abs(session.scheduledAt.getTime() - Date.now());
  if (msUntil > START_SESSION_WINDOW_MS) {
    throw new AppError({
      message: 'Session can only be started within 30 minutes of scheduled time',
      statusCode: 409,
      code: ErrorCode.BOOKING_TOO_SOON,
    });
  }

  const started = await prisma.session.update({
    where: { id: sessionId },
    data: { status: 'IN_PROGRESS', startedAt: new Date() },
  });

  // Track currentSessionId on therapist online status
  prisma.therapistOnlineStatus.updateMany({
    where: { therapistId: session.therapistId },
    data: { currentSessionId: sessionId },
  }).catch((err) => logger.error('Failed to set currentSessionId', { err }));

  logSessionAction('SESSION_STARTED', therapistUserId, {
    sessionId,
    scheduledAt: session.scheduledAt.toISOString(),
    actualStartedAt: new Date().toISOString(),
  });

  return started;
}

export async function completeSession(
  sessionId: string,
  therapistUserId: string,
  notes?: string,
) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { therapist: { select: { userId: true } } },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  if (session.therapist.userId !== therapistUserId) {
    throw new AppError({
      message: 'Only the therapist can complete a session',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  if (session.status !== 'IN_PROGRESS') {
    throw new AppError({
      message: 'Session must be in progress to complete',
      statusCode: 409,
      code: ErrorCode.SESSION_NOT_STARTED,
    });
  }

  const now = new Date();

  const updated = await prisma.$transaction(async (tx) => {
    const s = await tx.session.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: now,
        therapistPrivateNotes: notes,
      },
    });

    // Update journey counters
    await tx.therapyJourney.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        completedSessionCount: 1,
        lastSessionAt: now,
        firstSessionAt: now,
        totalSpent: session.priceAtBooking,
      },
      update: {
        completedSessionCount: { increment: 1 },
        lastSessionAt: now,
        totalSpent: { increment: session.priceAtBooking },
      },
    });

    // Set firstSessionAt if this is the user's first completed session
    // (journey may have been created during booking without firstSessionAt)
    await tx.therapyJourney.updateMany({
      where: { userId: session.userId, firstSessionAt: null },
      data: { firstSessionAt: now },
    });

    // Increment therapist session count inside transaction
    await tx.therapistProfile.update({
      where: { id: session.therapistId },
      data: { totalSessions: { increment: 1 } },
    });

    return s;
  });

  // Clear currentSessionId on therapist online status
  prisma.therapistOnlineStatus.updateMany({
    where: { therapistId: session.therapistId, currentSessionId: sessionId },
    data: { currentSessionId: null },
  }).catch((err) => logger.error('Failed to clear currentSessionId', { err }));

  // Audit + metrics
  logSessionAction('SESSION_COMPLETED', therapistUserId, {
    sessionId,
    userId: session.userId,
    duration: session.duration,
    sessionType: session.sessionType,
    priceAtBooking: session.priceAtBooking,
  });
  incrementMetrics(session.therapistId, 'totalCompletedSessions');

  return updated;
}

export async function markNoShow(sessionId: string, therapistUserId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { therapist: { select: { userId: true } } },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  if (session.therapist.userId !== therapistUserId) {
    throw new AppError({
      message: 'Only the therapist can mark no-show',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  if (session.status !== 'SCHEDULED' && session.status !== 'IN_PROGRESS') {
    throw new AppError({
      message: 'Cannot mark no-show on this session',
      statusCode: 409,
      code: ErrorCode.INVALID_SESSION_TRANSITION,
    });
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { status: 'NO_SHOW' },
  });

  logSessionAction('SESSION_NO_SHOW', therapistUserId, {
    sessionId,
    userId: session.userId,
    scheduledAt: session.scheduledAt.toISOString(),
  });

  return updated;
}

// ---------------------------------------------------------------------------
// Rate session
// ---------------------------------------------------------------------------

export async function rateSession(
  sessionId: string,
  userId: string,
  rating: number,
  feedback?: string,
) {
  if (rating < 1 || rating > 5) {
    throw new AppError({
      message: 'Rating must be between 1 and 5',
      statusCode: 400,
      code: ErrorCode.VALIDATION_FAILED,
    });
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  if (session.userId !== userId) {
    throw new AppError({
      message: 'Only the user can rate a session',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  if (session.status !== 'COMPLETED') {
    throw new AppError({
      message: 'Only completed sessions can be rated',
      statusCode: 409,
      code: ErrorCode.INVALID_SESSION_TRANSITION,
    });
  }

  if (session.userRating !== null) {
    throw new AppError({
      message: 'Session has already been rated',
      statusCode: 409,
      code: ErrorCode.SESSION_ALREADY_RATED,
    });
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { userRating: rating, userFeedback: feedback, ratedAt: new Date() },
  });

  // Rolling average recalc
  await recalculateRating(session.therapistId);

  logSessionAction('SESSION_RATED', userId, {
    sessionId,
    therapistId: session.therapistId,
    rating,
    hasFeedback: !!feedback,
  });

  return updated;
}

// ---------------------------------------------------------------------------
// Therapist dashboard
// ---------------------------------------------------------------------------

export async function getTherapistDashboard(therapistId: string) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const [
    todaySessions,
    upcomingSessions,
    metrics,
    onlineStatus,
  ] = await Promise.all([
    prisma.session.findMany({
      where: {
        therapistId,
        scheduledAt: { gte: todayStart, lt: todayEnd },
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      orderBy: { scheduledAt: 'asc' },
      include: {
        user: { select: { id: true, name: true } },
      },
    }),
    prisma.session.findMany({
      where: {
        therapistId,
        scheduledAt: { gte: todayEnd },
        status: 'SCHEDULED',
      },
      orderBy: { scheduledAt: 'asc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true } },
      },
    }),
    prisma.therapistMetrics.findUnique({ where: { therapistId } }),
    prisma.therapistOnlineStatus.findUnique({ where: { therapistId } }),
  ]);

  return {
    todaySessions,
    upcomingSessions,
    metrics,
    onlineStatus,
  };
}

// ---------------------------------------------------------------------------
// Therapist client list & detail
// ---------------------------------------------------------------------------

export async function getTherapistClients(
  therapistId: string,
  opts: { page?: number; limit?: number } = {},
) {
  const { page = 1, limit = 20 } = opts;
  const skip = (page - 1) * limit;

  // Distinct users who have had sessions with this therapist
  const clientSessions = await prisma.session.findMany({
    where: { therapistId },
    select: { userId: true },
    distinct: ['userId'],
    skip,
    take: limit,
  });

  const clientIds = clientSessions.map((s) => s.userId);

  const clients = await prisma.user.findMany({
    where: { id: { in: clientIds } },
    select: {
      id: true,
      name: true,
      email: true,
      sessions: {
        where: { therapistId },
        orderBy: { scheduledAt: 'desc' },
        take: 1,
        select: { id: true, scheduledAt: true, status: true },
      },
    },
  });

  // Count total distinct clients efficiently using groupBy
  const totalClients = await prisma.session.groupBy({
    by: ['userId'],
    where: { therapistId },
  });

  return { clients, total: totalClients.length, page, limit };
}

export async function getTherapistClientDetail(
  therapistId: string,
  clientId: string,
) {
  const sessions = await prisma.session.findMany({
    where: { therapistId, userId: clientId },
    orderBy: { scheduledAt: 'desc' },
    select: {
      id: true,
      scheduledAt: true,
      duration: true,
      status: true,
      sessionType: true,
      userRating: true,
      therapistPrivateNotes: true,
      createdAt: true,
    },
  });

  if (sessions.length === 0) {
    throw new AppError({
      message: 'No sessions found for this client',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  const client = await prisma.user.findUnique({
    where: { id: clientId },
    select: { id: true, name: true, email: true },
  });

  return {
    client,
    sessions,
    totalSessions: sessions.length,
    completedSessions: sessions.filter((s) => s.status === 'COMPLETED').length,
  };
}

// ---------------------------------------------------------------------------
// User pricing stage
// ---------------------------------------------------------------------------

export async function getUserPricingStage(userId: string) {
  const journey = await prisma.therapyJourney.findUnique({
    where: { userId },
  });

  if (!journey) {
    return { stage: 'discovery', completedSessions: 0 };
  }

  const completed = journey.completedSessionCount;

  if (completed === 0) {
    return { stage: 'discovery', completedSessions: completed };
  }
  if (completed <= 2) {
    return { stage: 'pay_as_you_like', completedSessions: completed };
  }
  return { stage: 'standard', completedSessions: completed };
}
