import type { Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess, parsePagination, buildPaginationMeta } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import type { MoodEntryPayload, JournalEntryPayload, MeditationLogPayload } from '../validators/health-tools.validator.js';

/**
 * Health Tools Controllers
 * Handles health tracking, mood logs, meditation, and wellness features
 */

export const getMoodHistory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);

    const [entries, total] = await Promise.all([
      prisma.moodEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.moodEntry.count({ where: { userId } }),
    ]);

    const averageMood =
      entries.length > 0
        ? Math.round((entries.reduce((sum: number, e: { score: number }) => sum + e.score, 0) / entries.length) * 10) / 10
        : 0;

    sendSuccess(
      res,
      { entries, averageMood },
      200,
      buildPaginationMeta(page, limit, total),
    );
  },
);

export const recordMoodEntry = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const payload = req.body as MoodEntryPayload;

    const entry = await prisma.moodEntry.create({
      data: {
        userId,
        score: payload.mood,
        note: payload.notes,
        tags: payload.activities ?? [],
        ...(payload.timestamp ? { createdAt: new Date(payload.timestamp) } : {}),
      },
    });

    sendSuccess(res, { entry }, 201);
  },
);

export const getJournalEntries = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.journalEntry.count({ where: { userId } }),
    ]);

    sendSuccess(res, { entries }, 200, buildPaginationMeta(page, limit, total));
  },
);

export const createJournalEntry = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const payload = req.body as JournalEntryPayload;

    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        title: payload.title,
        content: payload.content,
        mood: payload.mood,
        tags: payload.tags ?? [],
        isPrivate: payload.isPrivate ?? true,
      },
    });

    sendSuccess(res, { entry }, 201);
  },
);

export const updateJournalEntry = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const { id } = req.params;
    const payload = req.body as Partial<JournalEntryPayload>;

    const journalId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
    const existing = await prisma.journalEntry.findFirst({ where: { id: journalId, userId } });
    if (!existing) throw AppError.notFound('Journal entry');

    const entry = await prisma.journalEntry.update({
      where: { id: journalId },
      data: {
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.content !== undefined && { content: payload.content }),
        ...(payload.mood !== undefined && { mood: payload.mood }),
        ...(payload.tags !== undefined && { tags: payload.tags }),
        ...(payload.isPrivate !== undefined && { isPrivate: payload.isPrivate }),
      },
    });

    sendSuccess(res, { entry });
  },
);

export const getMeditationLogs = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);

    const [logs, total] = await Promise.all([
      prisma.meditationLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.meditationLog.count({ where: { userId } }),
    ]);

    const totalSeconds = logs.reduce((sum: number, l: { duration: number }) => sum + l.duration, 0);
    const totalMinutes = Math.round(totalSeconds / 60);

    sendSuccess(
      res,
      { logs, totalMinutes },
      200,
      buildPaginationMeta(page, limit, total),
    );
  },
);

export const logMeditationSession = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const payload = req.body as MeditationLogPayload;

    const log = await prisma.meditationLog.create({
      data: {
        userId,
        duration: payload.duration * 60, // validator receives minutes, DB stores seconds
        type: payload.type.toLowerCase(),  // DB stores lowercase: "guided", "unguided", "breathwork"
        completed: true,
      },
    });

    sendSuccess(res, { log }, 201);
  },
);

/* ─── DELETE handlers ─── */

export const deleteMoodEntry = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const { id } = req.params;
    const entryId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

    const existing = await prisma.moodEntry.findFirst({ where: { id: entryId, userId } });
    if (!existing) throw AppError.notFound('Mood entry');

    await prisma.moodEntry.delete({ where: { id: entryId } });
    sendSuccess(res, { message: 'Mood entry deleted' });
  },
);

export const deleteJournalEntry = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const { id } = req.params;
    const journalId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

    const existing = await prisma.journalEntry.findFirst({ where: { id: journalId, userId } });
    if (!existing) throw AppError.notFound('Journal entry');

    await prisma.journalEntry.delete({ where: { id: journalId } });
    sendSuccess(res, { message: 'Journal entry deleted' });
  },
);

export const deleteMeditationLog = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const { id } = req.params;
    const logId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

    const existing = await prisma.meditationLog.findFirst({ where: { id: logId, userId } });
    if (!existing) throw AppError.notFound('Meditation log');

    await prisma.meditationLog.delete({ where: { id: logId } });
    sendSuccess(res, { message: 'Meditation log deleted' });
  },
);
