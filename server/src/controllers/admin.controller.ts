import type { Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess, parsePagination, buildPaginationMeta } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * Admin Controllers
 * Handles admin operations and platform management
 */

export const getAdminDashboard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const [
    totalUsers,
    totalTherapists,
    totalSessions,
    activeSessions,
    completedSessions,
    totalPayments,
    recentUsers,
    recentSessions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.therapistProfile.count({ where: { isVerified: true } }),
    prisma.session.count(),
    prisma.session.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.session.count({ where: { status: 'COMPLETED' } }),
    prisma.payment.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true, isVerified: true },
    }),
    prisma.session.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        therapist: { select: { id: true, user: { select: { name: true } } } },
      },
    }),
  ]);

  // Weekly user growth (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newUsersThisWeek = await prisma.user.count({
    where: { createdAt: { gte: weekAgo } },
  });

  sendSuccess(res, {
    stats: {
      totalUsers,
      totalTherapists,
      totalSessions,
      activeSessions,
      completedSessions,
      totalPayments,
      newUsersThisWeek,
    },
    recentUsers,
    recentSessions,
  });
});

export const listUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const role = req.query.role as string | undefined;
  const search = req.query.search as string | undefined;

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
      select: {
        id: true, name: true, email: true, role: true,
        isVerified: true, createdAt: true, lastLoginAt: true,
        lockedUntil: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  sendSuccess(res, { users }, 200, buildPaginationMeta(page, limit, total));
});

export const updateUserStatus = asyncHandler(async (_req: AuthenticatedRequest, _res: Response) => {
  throw AppError.notImplemented('Update user status');
});
