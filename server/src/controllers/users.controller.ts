import type { Response } from 'express';
import { Gender, TherapistApproach, TherapyHistory } from '@prisma/client';

import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

type OnboardingPayload = Record<string, unknown>;
type OnboardingMapped = Partial<{
  dateOfBirth: Date;
  birthTime: string;
  birthPlace: string;
  gender: Gender;
  city: string;
  state: string;
  country: string;
  struggles: string[];
  therapyHistory: TherapyHistory;
  goals: string[];
  therapistGenderPref: string;
  therapistLanguages: string[];
  therapistApproach: TherapistApproach;
  interests: string[];
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  onboardingComplete: boolean;
}>;

type AstrologyPayload = {
  birthDate?: string;
  birthTime?: string;
  birthTimeAmPm?: 'AM' | 'PM' | 'N/A';
  birthCity?: string;
  unknownBirthTime?: boolean;
  gender?: Gender;
};

export const submitOnboardingStep = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const { step, data } = req.body as { step: number; data: OnboardingPayload };

  const mapped = mapStepData(step, data);
  const markComplete = step === 10;

  await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      struggles: [],
      goals: [],
      therapistLanguages: [],
      interests: [],
      onboardingStep: step,
      onboardingComplete: markComplete,
      ...mapped,
    },
    update: {
      ...mapped,
      onboardingStep: step,
      onboardingComplete: markComplete,
    },
  });

  sendSuccess(res, { step, onboardingComplete: markComplete });
});

export const getOnboardingProgress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const profile = await prisma.userProfile.findUnique({ where: { userId } });

  if (!profile) {
    sendSuccess(res, { step: 0, data: {}, isComplete: false });
    return;
  }

  sendSuccess(res, {
    step: profile.onboardingStep,
    isComplete: profile.onboardingComplete,
    data: profile,
  });
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw AppError.notFound('User');
  }

  sendSuccess(res, user);
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const { name, email, phone, avatarUrl } = req.body as {
    name?: string;
    email?: string;
    phone?: string | null;
    avatarUrl?: string | null;
  };

  // Check if email is being changed and already taken
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      throw AppError.conflict('Email is already in use');
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
    include: { profile: true },
  });

  sendSuccess(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role,
  });
});

export const getSettings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;

  // Upsert so we always return defaults for new users
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  sendSuccess(res, {
    darkMode: settings.darkMode,
    animations: settings.animations,
    compactMode: settings.compactMode,
    pushNotifs: settings.pushNotifs,
    soundEffects: settings.soundEffects,
    patternAlerts: settings.patternAlerts,
    profileVisible: settings.profileVisible,
    constellationPublic: settings.constellationPublic,
    twoFactor: settings.twoFactor,
  });
});

export const updateSettings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const data = req.body as Record<string, boolean>;

  const settings = await prisma.userSettings.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  sendSuccess(res, {
    darkMode: settings.darkMode,
    animations: settings.animations,
    compactMode: settings.compactMode,
    pushNotifs: settings.pushNotifs,
    soundEffects: settings.soundEffects,
    patternAlerts: settings.patternAlerts,
    profileVisible: settings.profileVisible,
    constellationPublic: settings.constellationPublic,
    twoFactor: settings.twoFactor,
  });
});

export const getDashboard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw AppError.notFound('User');
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [moodCount, journalCount, meditationCount, sessionCount, recentMoodEntries, unreadNotifications] = await Promise.all([
    prisma.moodEntry.count({ where: { userId } }),
    prisma.journalEntry.count({ where: { userId } }),
    prisma.meditationLog.count({ where: { userId } }),
    prisma.session.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.moodEntry.findMany({
      where: { userId, createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: 'asc' },
      select: { score: true, createdAt: true },
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  // Build a 7-day trend array (null where no entry exists for that day)
  const moodTrend: Array<{ date: string; score: number | null }> = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dayStr = day.toISOString().slice(0, 10);
    const dayEntries = recentMoodEntries.filter(
      (e: { score: number; createdAt: Date }) => e.createdAt.toISOString().slice(0, 10) === dayStr,
    );
    const avg =
      dayEntries.length > 0
        ? Math.round(dayEntries.reduce((s: number, e: { score: number; createdAt: Date }) => s + e.score, 0) / dayEntries.length)
        : null;
    moodTrend.push({ date: dayStr, score: avg });
  }

  sendSuccess(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      onboardingComplete: user.profile?.onboardingComplete ?? false,
    },
    stats: {
      sessionsCompleted: sessionCount,
      moodEntries: moodCount,
      journalEntries: journalCount,
      meditationSessions: meditationCount,
    },
    moodTrend,
    unreadNotifications,
    quickActions: [
      { id: 'book-session', label: 'Book Session', icon: 'calendar', route: '/therapy/find' },
      { id: 'mood-check', label: 'Mood Check-in', icon: 'smile', route: '/dashboard/mood' },
      { id: 'meditate', label: 'Meditate', icon: 'brain', route: '/dashboard/meditation' },
      { id: 'journal', label: 'Journal', icon: 'book-open', route: '/dashboard/journal' },
    ],
    upcomingSession: null,
  });
});

export const saveAstrologyProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const payload = req.body as AstrologyPayload;

  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { onboardingStep: true },
  });

  const mapped: OnboardingMapped = {};

  if (payload.birthDate) {
    const parsedDate = new Date(payload.birthDate);
    if (!Number.isNaN(parsedDate.getTime())) {
      mapped.dateOfBirth = parsedDate;
    }
  }

  if (payload.birthCity && payload.birthCity.trim().length > 0) {
    mapped.birthPlace = payload.birthCity.trim();
    mapped.city = payload.birthCity.trim();
  }

  if (payload.birthTime && payload.birthTime.trim().length > 0) {
    mapped.birthTime =
      payload.birthTimeAmPm && payload.birthTimeAmPm !== 'N/A'
        ? `${payload.birthTime.trim()} ${payload.birthTimeAmPm}`
        : payload.birthTime.trim();
  }

  if (payload.gender) {
    mapped.gender = payload.gender;
  }

  const nextStep = Math.max(existingProfile?.onboardingStep ?? 0, 3);

  await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      struggles: [],
      goals: [],
      therapistLanguages: [],
      interests: [],
      onboardingStep: nextStep,
      onboardingComplete: false,
      ...mapped,
    },
    update: {
      ...mapped,
      onboardingStep: nextStep,
    },
  });

  sendSuccess(res, {
    saved: true,
    onboardingStep: nextStep,
  });
});

function mapStepData(step: number, data: OnboardingPayload): OnboardingMapped {
  switch (step) {
    case 1: {
      if (!data.dateOfBirth || typeof data.dateOfBirth !== 'string') {
        return {};
      }

      const parsedDate = new Date(data.dateOfBirth);
      if (Number.isNaN(parsedDate.getTime())) {
        return {};
      }

      return { dateOfBirth: parsedDate };
    }
    case 2:
      return { gender: data.gender as Gender };
    case 3:
      return {
        city: getStringOrUndefined(data.city),
        state: getStringOrUndefined(data.state),
        country: getStringOrUndefined(data.country),
      };
    case 4:
      return { struggles: asStringArray(data.struggles) };
    case 5:
      return { therapyHistory: data.therapyHistory as TherapyHistory };
    case 6:
      return { goals: asStringArray(data.goals) };
    case 7:
      return {
        therapistGenderPref: getStringOrUndefined(data.therapistGenderPref),
        therapistLanguages: asStringArray(data.therapistLanguages),
        therapistApproach: data.therapistApproach as TherapistApproach | undefined,
      };
    case 8:
      return { interests: asStringArray(data.interests) };
    case 9:
      return {
        emergencyName: getStringOrUndefined(data.emergencyName),
        emergencyPhone: getStringOrUndefined(data.emergencyPhone),
        emergencyRelation: getStringOrUndefined(data.emergencyRelation),
      };
    case 10:
      return { onboardingComplete: true };
    default:
      return {};
  }
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function getStringOrUndefined(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}
