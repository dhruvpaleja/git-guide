/**
 * Activity Tracking Controller
 * 
 * Handles incoming activity events from the frontend tracker
 * and provides admin/analytics query endpoints.
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  recordActivities,
  getActivities,
  getActivityStats,
  getUserJourney,
} from '../services/activity.service.js';

/**
 * POST /activity/track
 * Accepts a batch of activity events from the frontend.
 * Works for both authenticated and anonymous users.
 */
export const trackActivities = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id || null;
  const events = req.body.events;

  if (!Array.isArray(events) || events.length === 0) {
    return sendSuccess(res, { recorded: 0 });
  }

  // Cap batch size to prevent abuse
  const capped = events.slice(0, 200);

  const result = await recordActivities(capped, userId || undefined);
  sendSuccess(res, result);
});

/**
 * GET /activity/events
 * Query activity events (admin/analytics).
 */
export const listActivities = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    userId,
    sessionId,
    eventType,
    eventCategory,
    page,
    fromDate,
    toDate,
    limit,
    offset,
  } = req.query;

  const result = await getActivities({
    userId: userId as string,
    sessionId: sessionId as string,
    eventType: eventType as string,
    eventCategory: eventCategory as string,
    page: page as string,
    fromDate: fromDate as string,
    toDate: toDate as string,
    limit: limit ? parseInt(limit as string, 10) : 100,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  sendSuccess(res, result);
});

/**
 * GET /activity/stats
 * Get aggregated activity statistics.
 */
export const activityStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.query.userId as string | undefined;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;

  const result = await getActivityStats(userId, days);
  sendSuccess(res, result);
});

/**
 * GET /activity/journey/:userId
 * Get a user's page navigation journey.
 */
export const userJourney = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  const sessionId = req.query.sessionId as string | undefined;

  const result = await getUserJourney(userId, sessionId);
  sendSuccess(res, { journey: result });
});

/**
 * GET /activity/my-activity
 * Get the current user's own activity data.
 */
export const myActivity = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;

  const [stats, journey] = await Promise.all([
    getActivityStats(userId, days),
    getUserJourney(userId),
  ]);

  sendSuccess(res, { stats, journey });
});
