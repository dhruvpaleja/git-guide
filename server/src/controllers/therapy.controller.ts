// ---------------------------------------------------------------------------
// therapy.controller.ts – Thin wrappers: parse request → call service → respond
// ---------------------------------------------------------------------------

import type { Response } from 'express';
import { SessionStatus } from '@prisma/client';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError, ErrorCode } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import * as therapyService from '../services/therapy.service.js';
import * as matchingService from '../services/matching.service.js';
import * as availabilityService from '../services/availability.service.js';
import * as nudgeService from '../services/nudge.service.js';

/** Safely extract a single string from a query/param value. */
function qstr(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
  return undefined;
}

/** Extract a required param as string (Express params can be string | string[]). */
function pstr(v: string | string[]): string {
  return Array.isArray(v) ? v[0] : v;
}

// ---------------------------------------------------------------------------
// 1. listTherapists — prisma query with filters from query params
// ---------------------------------------------------------------------------
export const listTherapists = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const specialization = qstr(req.query.specialization);
    const approach = qstr(req.query.approach);
    const language = qstr(req.query.language);
    const minRating = qstr(req.query.minRating);
    const sort = qstr(req.query.sort);
    const page = qstr(req.query.page) ?? '1';
    const pageSize = qstr(req.query.pageSize) ?? '20';

    const pageNum = Math.max(1, Number(page) || 1);
    const limit = Math.min(50, Math.max(1, Number(pageSize) || 20));
    const skip = (pageNum - 1) * limit;

    const where: Record<string, unknown> = {
      isVerified: true,
      isAvailable: true,
    };
    if (specialization) where.specializations = { has: specialization };
    if (approach) where.approach = approach;
    if (language) where.languages = { has: language };
    if (minRating) where.rating = { gte: Number(minRating) };

    const orderBy: Record<string, string> = {};
    if (sort === 'rating') orderBy.rating = 'desc';
    else if (sort === 'experience') orderBy.experience = 'desc';
    else if (sort === 'price') orderBy.pricePerSession = 'asc';
    else orderBy.rating = 'desc';

    const [therapists, total] = await Promise.all([
      prisma.therapistProfile.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true } },
          onlineStatus: true,
        },
      }),
      prisma.therapistProfile.count({ where }),
    ]);

    sendSuccess(res, { therapists, total, page: pageNum, pageSize: limit });
  },
);

// ---------------------------------------------------------------------------
// 2. getRecommendedTherapists
// ---------------------------------------------------------------------------
export const getRecommendedTherapists = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const matches = await matchingService.getMatchedTherapists(userId, 5);
    sendSuccess(res, matches);
  },
);

// ---------------------------------------------------------------------------
// 3. getAvailableNowTherapists
// ---------------------------------------------------------------------------
export const getAvailableNowTherapists = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const matches = await matchingService.getAvailableNowTherapists(userId);
    sendSuccess(res, matches);
  },
);

// ---------------------------------------------------------------------------
// 4. getTherapistDetail — single therapist by ID with availability preview
// ---------------------------------------------------------------------------
export const getTherapistDetail = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = pstr(req.params.id);

    const therapist = await prisma.therapistProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        onlineStatus: true,
        metrics: true,
      },
    });

    if (!therapist) {
      throw new AppError({
        message: 'Therapist not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const nextSlot = await availabilityService.getNextAvailableSlot(id);

    sendSuccess(res, { ...therapist, nextAvailableSlot: nextSlot });
  },
);

// ---------------------------------------------------------------------------
// 5. getTherapistSlots
// ---------------------------------------------------------------------------
export const getTherapistSlots = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = pstr(req.params.id);
    const fromDate = qstr(req.query.fromDate);
    const days = qstr(req.query.days);

    const slots = await availabilityService.getAvailableSlots(
      id,
      fromDate ? new Date(fromDate) : undefined,
      days ? Number(days) : undefined,
    );

    sendSuccess(res, slots);
  },
);

// ---------------------------------------------------------------------------
// 6. bookSession
// ---------------------------------------------------------------------------
export const bookSession = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const { therapistId, scheduledAt, sessionType, bookingSource } = req.body;

    const session = await therapyService.bookSession({
      userId,
      therapistId,
      scheduledAt: new Date(scheduledAt),
      sessionType,
      bookingSource,
    });

    sendSuccess(res, session, 201);
  },
);

// ---------------------------------------------------------------------------
// 7. bookInstantSession
// ---------------------------------------------------------------------------
export const bookInstantSession = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const { therapistId: requestedTherapistId } = req.body;

    let targetTherapistId = requestedTherapistId;
    let matchScore: number | undefined;
    let matchReason: string | undefined;

    if (!targetTherapistId) {
      // Auto-select best available-now therapist via matching
      const available = await matchingService.getAvailableNowTherapists(userId);
      if (available.length === 0) {
        throw new AppError({
          message: 'No therapists are available right now',
          statusCode: 409,
          code: ErrorCode.THERAPIST_NOT_ACCEPTING,
        });
      }
      const best = available[0];
      targetTherapistId = best.therapistId;
      matchScore = best.matchScore;
      matchReason = best.matchReasons.join('; ');
    }

    const session = await therapyService.bookInstantSession({
      userId,
      therapistId: targetTherapistId,
      matchScore,
      matchReason,
    });

    sendSuccess(res, session, 201);
  },
);

// ---------------------------------------------------------------------------
// 8. listSessions (user)
// ---------------------------------------------------------------------------
export const listSessions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const status = req.query.status;
    const page = qstr(req.query.page);
    const pageSize = qstr(req.query.pageSize);

    // After validation, status is either a single string or an array
    const statusArr: SessionStatus[] | undefined = status
      ? (Array.isArray(status)
        ? status as SessionStatus[]
        : [status as SessionStatus])
      : undefined;

    const result = await therapyService.listUserSessions(userId, {
      status: statusArr,
      page: page ? Number(page) : undefined,
      limit: pageSize ? Number(pageSize) : undefined,
    });

    sendSuccess(res, result);
  },
);

// ---------------------------------------------------------------------------
// 9. getSessionDetail
// ---------------------------------------------------------------------------
export const getSessionDetail = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const id = pstr(req.params.id);
    const session = await therapyService.getSessionDetail(id, userId);
    sendSuccess(res, session);
  },
);

// ---------------------------------------------------------------------------
// 10. cancelSession
// ---------------------------------------------------------------------------
export const cancelSession = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const id = pstr(req.params.id);
    const { reason } = req.body;
    const session = await therapyService.cancelSession(id, userId, reason);
    sendSuccess(res, session);
  },
);

// ---------------------------------------------------------------------------
// 11. rescheduleSession
// ---------------------------------------------------------------------------
export const rescheduleSession = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const id = pstr(req.params.id);
    const { newScheduledAt } = req.body;
    const session = await therapyService.rescheduleSession(id, userId, new Date(newScheduledAt));
    sendSuccess(res, session);
  },
);

// ---------------------------------------------------------------------------
// 12. rateSession
// ---------------------------------------------------------------------------
export const rateSession = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const id = pstr(req.params.id);
    const { rating, feedback } = req.body;
    const session = await therapyService.rateSession(id, userId, rating, feedback);
    sendSuccess(res, session);
  },
);

// ---------------------------------------------------------------------------
// 12b. getUserJourney — lazy-create TherapyJourney, return stage info
// ---------------------------------------------------------------------------
export const getUserJourney = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;

    const journey = await prisma.therapyJourney.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const pricingStage =
      journey.completedSessionCount === 0
        ? 'discovery'
        : journey.completedSessionCount <= 2
          ? 'pay_as_you_like'
          : 'standard';

    sendSuccess(res, {
      completedSessionCount: journey.completedSessionCount,
      pricingStage,
      activeTherapistCount: journey.activeTherapistCount,
      firstSessionAt: journey.firstSessionAt,
      lastSessionAt: journey.lastSessionAt,
    });
  },
);

// ---------------------------------------------------------------------------
// 13. getNudges
// ---------------------------------------------------------------------------
export const getNudges = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const nudges = await nudgeService.getActiveNudges(userId);
    sendSuccess(res, nudges);
  },
);

// ---------------------------------------------------------------------------
// 14. dismissNudge
// ---------------------------------------------------------------------------
export const dismissNudge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const id = pstr(req.params.id);
    const nudge = await nudgeService.dismissNudge(id, userId);
    sendSuccess(res, nudge);
  },
);

// ---------------------------------------------------------------------------
// 15. markNudgeActed
// ---------------------------------------------------------------------------
export const markNudgeActed = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const id = pstr(req.params.id);
    const nudge = await nudgeService.markNudgeActed(id, userId);
    sendSuccess(res, nudge);
  },
);

// ---------------------------------------------------------------------------
// 16. getTherapistDashboard
// ---------------------------------------------------------------------------
export const getTherapistDashboard = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const dashboard = await therapyService.getTherapistDashboard(profile.id);
    sendSuccess(res, dashboard);
  },
);

// ---------------------------------------------------------------------------
// 17. listTherapistSessions
// ---------------------------------------------------------------------------
export const listTherapistSessions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const status = req.query.status;
    const page = qstr(req.query.page);
    const pageSize = qstr(req.query.pageSize);

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const statusArr: SessionStatus[] | undefined = status
      ? (Array.isArray(status)
        ? status as SessionStatus[]
        : [status as SessionStatus])
      : undefined;

    const result = await therapyService.listTherapistSessions(profile.id, {
      status: statusArr,
      page: page ? Number(page) : undefined,
      limit: pageSize ? Number(pageSize) : undefined,
    });

    sendSuccess(res, result);
  },
);

// ---------------------------------------------------------------------------
// 18. getTherapistClients
// ---------------------------------------------------------------------------
export const getTherapistClients = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const result = await therapyService.getTherapistClients(profile.id);
    sendSuccess(res, result);
  },
);

// ---------------------------------------------------------------------------
// 19. getTherapistClientDetail
// ---------------------------------------------------------------------------
export const getTherapistClientDetail = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const clientId = pstr(req.params.id);

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const result = await therapyService.getTherapistClientDetail(profile.id, clientId);
    sendSuccess(res, result);
  },
);

// ---------------------------------------------------------------------------
// 20. getTherapistAvailability
// ---------------------------------------------------------------------------
export const getTherapistAvailability = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const availability = await prisma.therapistAvailability.findMany({
      where: { therapistId: profile.id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    sendSuccess(res, availability);
  },
);

// ---------------------------------------------------------------------------
// 21. updateTherapistAvailability — atomic replace
// ---------------------------------------------------------------------------
export const updateTherapistAvailability = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const { slots } = req.body;

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.therapistAvailability.deleteMany({
        where: { therapistId: profile.id },
      });

      const created = await tx.therapistAvailability.createMany({
        data: (slots as Array<{
          dayOfWeek: number;
          startTime: string;
          endTime: string;
          slotDuration?: number;
          breakAfterSlot?: number;
          isActive: boolean;
        }>).map((s) => ({
          therapistId: profile.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          slotDuration: s.slotDuration ?? 50,
          breakAfterSlot: s.breakAfterSlot ?? 10,
          isActive: s.isActive,
        })),
      });

      return created;
    });

    sendSuccess(res, { count: updated.count });
  },
);

// ---------------------------------------------------------------------------
// 22. updateOnlineStatus
// ---------------------------------------------------------------------------
export const updateOnlineStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const { isOnline, isAcceptingNow } = req.body;

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const status = await prisma.therapistOnlineStatus.upsert({
      where: { therapistId: profile.id },
      create: {
        therapistId: profile.id,
        isOnline: isOnline ?? false,
        isAcceptingNow: isAcceptingNow ?? false,
      },
      update: {
        ...(isOnline !== undefined ? { isOnline } : {}),
        ...(isAcceptingNow !== undefined ? { isAcceptingNow } : {}),
        lastSeenAt: new Date(),
      },
    });

    sendSuccess(res, status);
  },
);

// ---------------------------------------------------------------------------
// 23. getOwnProfile
// ---------------------------------------------------------------------------
export const getOwnProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        onlineStatus: true,
      },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    sendSuccess(res, profile);
  },
);

// ---------------------------------------------------------------------------
// 24. updateOwnProfile
// ---------------------------------------------------------------------------
export const updateOwnProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const { bio, specializations, languages, qualifications, approach, experience, photoUrl } = req.body;

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const updated = await prisma.therapistProfile.update({
      where: { id: profile.id },
      data: {
        ...(bio !== undefined ? { bio } : {}),
        ...(specializations !== undefined ? { specializations } : {}),
        ...(languages !== undefined ? { languages } : {}),
        ...(qualifications !== undefined ? { qualifications } : {}),
        ...(approach !== undefined ? { approach } : {}),
        ...(experience !== undefined ? { experience } : {}),
        ...(photoUrl !== undefined ? { photoUrl } : {}),
      },
    });

    sendSuccess(res, updated);
  },
);

// ---------------------------------------------------------------------------
// 25. getOwnMetrics
// ---------------------------------------------------------------------------
export const getOwnMetrics = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;

    const profile = await prisma.therapistProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError({
        message: 'Therapist profile not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    }

    const metrics = await prisma.therapistMetrics.findUnique({
      where: { therapistId: profile.id },
    });

    sendSuccess(res, metrics);
  },
);

// ---------------------------------------------------------------------------
// 26. startSession
// ---------------------------------------------------------------------------
export const startSession = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const id = pstr(req.params.id);
    const session = await therapyService.startSession(id, userId);
    sendSuccess(res, session);
  },
);

// ---------------------------------------------------------------------------
// 27. completeSession
// ---------------------------------------------------------------------------
export const completeSession = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const id = pstr(req.params.id);
    const { notes } = req.body;
    const session = await therapyService.completeSession(id, userId, notes);
    sendSuccess(res, session);
  },
);

// ---------------------------------------------------------------------------
// 28. markNoShow
// ---------------------------------------------------------------------------
export const markNoShow = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const id = pstr(req.params.id);
    const session = await therapyService.markNoShow(id, userId);
    sendSuccess(res, session);
  },
);
