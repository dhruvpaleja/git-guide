// ---------------------------------------------------------------------------
// nudge.service.ts – Behavioral nudge generation, evaluation & management
// ---------------------------------------------------------------------------

import { prisma } from '../lib/prisma.js';
import { AppError, ErrorCode } from '../lib/errors.js';

// ---------------------------------------------------------------------------
// Types & Templates
// ---------------------------------------------------------------------------

type NudgeType =
  | 'first_session_free'
  | 'low_mood_streak'
  | 'constellation_pattern'
  | 'session_gap_reminder'
  | 'post_session_rate'
  | 'astrology_interest'
  | 'pay_as_you_like_return';

interface NudgeTemplate {
  title: string;
  message: string;
  cta?: string;
  /** Days before the same nudge can re-appear after dismiss. null = never repeat. */
  cooldownDays: number | null;
}

const NUDGE_TEMPLATES: Record<NudgeType, NudgeTemplate> = {
  first_session_free: {
    title: 'Your first call is free',
    message:
      'Start your wellness journey with a complimentary discovery session — no commitment needed.',
    cta: 'Book Free Session',
    cooldownDays: 7,
  },
  low_mood_streak: {
    title: "We noticed you've been going through a rough patch",
    message:
      'Your recent entries suggest a difficult stretch. A quick call with a guide could help.',
    cta: 'Talk to Someone',
    cooldownDays: 3,
  },
  constellation_pattern: {
    title: 'Your guide specializes in this pattern',
    message:
      'Based on your constellation insights, we found a guide who understands your journey.',
    cta: 'View Guide',
    cooldownDays: 3,
  },
  session_gap_reminder: {
    title: "It's been a while. Quick check-in?",
    message:
      "It's been over two weeks since your last session. A short call can keep the momentum going.",
    cta: 'Schedule Now',
    cooldownDays: 7,
  },
  post_session_rate: {
    title: 'How was your call?',
    message:
      'Your feedback helps us improve the experience for you and your guide.',
    cta: 'Rate Session',
    cooldownDays: null,
  },
  astrology_interest: {
    title: 'Your birth chart reveals…',
    message:
      'We spotted something interesting in your chart. A guide with Vedic expertise can walk you through it.',
    cta: 'Explore',
    cooldownDays: 7,
  },
  pay_as_you_like_return: {
    title: 'Your next call is pay-what-you-feel',
    message:
      "You've completed your first session — for your second, pay whatever feels right.",
    cta: 'Book Session',
    cooldownDays: 7,
  },
};

// ---------------------------------------------------------------------------
// evaluateNudges – main entry, checks all triggers & creates nudges
// ---------------------------------------------------------------------------

export async function evaluateNudges(userId: string): Promise<void> {
  await generateNudgesForUser(userId);
}

// ---------------------------------------------------------------------------
// getActiveNudges – pending/shown, past cooldown, not expired
// ---------------------------------------------------------------------------

export async function getActiveNudges(userId: string) {
  const now = new Date();

  return prisma.userNudge.findMany({
    where: {
      userId,
      status: { in: ['pending', 'shown'] },
      AND: [
        { OR: [{ cooldownUntil: null }, { cooldownUntil: { lt: now } }] },
        { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ---------------------------------------------------------------------------
// dismissNudge
// ---------------------------------------------------------------------------

export async function dismissNudge(nudgeId: string, userId: string) {
  const nudge = await prisma.userNudge.findUnique({ where: { id: nudgeId } });

  if (!nudge || nudge.userId !== userId) {
    throw new AppError({ message: 'Nudge not found or not owned by user', code: ErrorCode.NUDGE_NOT_FOUND, statusCode: 404 });
  }

  const template = NUDGE_TEMPLATES[nudge.nudgeType as NudgeType];
  const cooldownDays = template?.cooldownDays;

  const cooldownUntil =
    cooldownDays != null
      ? new Date(Date.now() + cooldownDays * 24 * 60 * 60 * 1000)
      : undefined;

  return prisma.userNudge.update({
    where: { id: nudgeId },
    data: {
      status: 'dismissed',
      dismissedAt: new Date(),
      ...(cooldownUntil ? { cooldownUntil } : {}),
    },
  });
}

// ---------------------------------------------------------------------------
// markNudgeActed
// ---------------------------------------------------------------------------

export async function markNudgeActed(nudgeId: string, userId: string) {
  const nudge = await prisma.userNudge.findUnique({ where: { id: nudgeId } });

  if (!nudge || nudge.userId !== userId) {
    throw new AppError({ message: 'Nudge not found or not owned by user', code: ErrorCode.NUDGE_NOT_FOUND, statusCode: 404 });
  }

  return prisma.userNudge.update({
    where: { id: nudgeId },
    data: {
      status: 'acted',
      actedAt: new Date(),
    },
  });
}

// ---------------------------------------------------------------------------
// generateNudgesForUser – runs through all trigger rules
// ---------------------------------------------------------------------------

export async function generateNudgesForUser(userId: string): Promise<void> {
  // Gather user data needed for trigger evaluation
  const [profile, journey, recentNudges] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.therapyJourney.findUnique({ where: { userId } }),
    prisma.userNudge.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  if (!profile) return;

  const now = new Date();

  // Helper: check if a nudge of a given type already exists and is still
  // active (pending/shown) or was recently dismissed/acted (within cooldown).
  const canCreate = (type: NudgeType): boolean => {
    const template = NUDGE_TEMPLATES[type];
    const existing = recentNudges.filter((n) => n.nudgeType === type);

    // If cooldownDays is null, never recreate once dismissed or acted
    if (template.cooldownDays === null) {
      return !existing.some(
        (n) => n.status === 'dismissed' || n.status === 'acted',
      );
    }

    // If an active (pending/shown) nudge of this type exists, skip
    if (existing.some((n) => n.status === 'pending' || n.status === 'shown')) {
      return false;
    }

    // If most recently dismissed within cooldown window, skip
    const lastDismissed = existing.find((n) => n.dismissedAt);
    if (lastDismissed?.cooldownUntil && lastDismissed.cooldownUntil > now) {
      return false;
    }

    return true;
  };

  const toCreate: { type: NudgeType; data?: Record<string, unknown> }[] = [];

  // --- Rule 1: first_session_free ---
  if (
    profile.onboardingComplete &&
    (!journey || journey.completedSessionCount === 0) &&
    canCreate('first_session_free')
  ) {
    toCreate.push({ type: 'first_session_free' });
  }

  // --- Rule 2: low_mood_streak ---
  if (canCreate('low_mood_streak')) {
    const recentMoods = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { score: true },
    });

    if (
      recentMoods.length === 3 &&
      recentMoods.every((m) => m.score <= 3)
    ) {
      toCreate.push({ type: 'low_mood_streak' });
    }
  }

  // --- Rule 3: constellation_pattern (stub) ---
  // Will be wired to constellation engine in a future build.
  // Skip creation for now.

  // --- Rule 4: session_gap_reminder ---
  if (journey?.lastSessionAt && canCreate('session_gap_reminder')) {
    const daysSinceLast =
      (now.getTime() - journey.lastSessionAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > 14) {
      toCreate.push({ type: 'session_gap_reminder' });
    }
  }

  // --- Rule 5: post_session_rate ---
  if (canCreate('post_session_rate')) {
    const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const unratedSession = await prisma.session.findFirst({
      where: {
        userId,
        status: 'COMPLETED',
        userRating: null,
        updatedAt: { gte: thirtyMinAgo },
      },
      select: { id: true },
    });

    if (unratedSession) {
      toCreate.push({
        type: 'post_session_rate',
        data: { sessionId: unratedSession.id },
      });
    }
  }

  // --- Rule 6: astrology_interest ---
  if (canCreate('astrology_interest')) {
    const interests = profile.interests ?? [];
    if (interests.includes('astrology')) {
      // Ensure no astrology nudge in the last 7 days
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentAstro = recentNudges.find(
        (n) => n.nudgeType === 'astrology_interest' && n.createdAt > sevenDaysAgo,
      );
      if (!recentAstro) {
        toCreate.push({ type: 'astrology_interest' });
      }
    }
  }

  // --- Rule 7: pay_as_you_like_return ---
  if (journey && canCreate('pay_as_you_like_return')) {
    if (
      journey.completedSessionCount === 1 &&
      journey.lastSessionAt
    ) {
      const daysSinceLast =
        (now.getTime() - journey.lastSessionAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLast > 7) {
        toCreate.push({ type: 'pay_as_you_like_return' });
      }
    }
  }

  // --- Bulk-create new nudges ---
  if (toCreate.length > 0) {
    await prisma.userNudge.createMany({
      data: toCreate.map(({ type, data }) => {
        const template = NUDGE_TEMPLATES[type];
        return {
          userId,
          nudgeType: type,
          nudgeData: {
            title: template.title,
            message: template.message,
            cta: template.cta,
            ...data,
          },
          status: 'pending',
        };
      }),
    });
  }
}
