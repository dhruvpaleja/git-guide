import type { Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import { websocketService } from '../lib/websocket.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * Notifications Controllers
 * Handles notification delivery and preferences
 */

export const getNotifications = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 notifications
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    sendSuccess(res, {
      notifications,
      unread: unreadCount,
    });
  },
);

export const markNotificationRead = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const id = typeof req.params.id === 'string' ? req.params.id : Array.isArray(req.params.id) ? req.params.id[0] : '';

    const notification = await prisma.notification.findFirst({
      where: { id: id, userId },
    });

    if (!notification) {
      throw AppError.notFound('Notification');
    }

    await prisma.notification.update({
      where: { id: id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    sendSuccess(res, { success: true });
  },
);

export const markAllNotificationsRead = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;

    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    sendSuccess(res, { updated: result.count });
  },
);

export const getNotificationPreferences = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: {
        pushNotifs: true,
        patternAlerts: true,
      },
    });

    sendSuccess(res, {
      preferences: settings ?? { pushNotifs: true, patternAlerts: true },
    });
  },
);

export const updateNotificationPreferences = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const { pushNotifs, patternAlerts } = req.body as {
      pushNotifs?: boolean;
      patternAlerts?: boolean;
    };

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        pushNotifs: pushNotifs ?? true,
        patternAlerts: patternAlerts ?? true,
      },
      update: {
        ...(pushNotifs !== undefined && { pushNotifs }),
        ...(patternAlerts !== undefined && { patternAlerts }),
      },
    });

    sendSuccess(res, {
      preferences: {
        pushNotifs: settings.pushNotifs,
        patternAlerts: settings.patternAlerts,
      },
    });
  },
);

/**
 * Helper function to create and send notification
 * Can be called from other controllers
 */
export const createNotification = async (params: {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}): Promise<void> => {
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      title: params.title,
      body: params.body,
      data: params.data ? JSON.stringify(params.data) : undefined,
    },
  });

  // Send via WebSocket if user is connected
  websocketService.sendToUser(params.userId, {
    type: 'notification',
    data: notification,
  });
};

