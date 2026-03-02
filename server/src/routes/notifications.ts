import { Router } from 'express';
import type { Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess, parsePagination, buildPaginationMeta } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

// List notifications for the authenticated user
router.get(
  '/',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    sendSuccess(
      res,
      { notifications, unreadCount },
      200,
      buildPaginationMeta(page, limit, total),
    );
  }),
);

// Mark a notification as read
router.put(
  '/:id/read',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;
    const id = typeof req.params.id === 'string' ? req.params.id : Array.isArray(req.params.id) ? req.params.id[0] : '';

    const notification = await prisma.notification.findFirst({ where: { id: id, userId } });
    if (!notification) throw AppError.notFound('Notification');

    const updated = await prisma.notification.update({
      where: { id: id },
      data: { isRead: true, readAt: new Date() },
    });

    sendSuccess(res, { notification: updated });
  }),
);

// Mark all notifications as read
router.put(
  '/read-all',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth as NonNullable<typeof req.auth>;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    sendSuccess(res, { message: 'All notifications marked as read' });
  }),
);

export default router;
