/**
 * Activity Tracking Routes
 *
 * POST /activity/track       — Record events (works with or without auth)
 * GET  /activity/events      — Query events (admin/auth required)
 * GET  /activity/stats       — Aggregated stats (admin/auth required)
 * GET  /activity/journey/:userId — User journey (admin/auth required)
 * GET  /activity/my-activity — Current user's own data (auth required)
 */

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as activityController from '../controllers/activity.controller.js';

const router = Router();

// Track events — accepts both authenticated and anonymous requests
// No auth middleware so pre-login activity (landing page, signup flow) is also captured
router.post('/track', activityController.trackActivities);

// Query / analytics — require authentication
router.get('/events', requireAuth, activityController.listActivities);
router.get('/stats', requireAuth, activityController.activityStats);
router.get('/journey/:userId', requireAuth, activityController.userJourney);
router.get('/my-activity', requireAuth, activityController.myActivity);

export default router;
