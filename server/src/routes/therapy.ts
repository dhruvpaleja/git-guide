import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import * as therapyController from '../controllers/therapy.controller.js';
import * as validators from '../validators/therapy.validator.js';

const router = Router();

// --- User-facing endpoints ---
router.get('/therapists', requireAuth, validators.validateListTherapists, therapyController.listTherapists);
router.get('/therapists/recommended', requireAuth, therapyController.getRecommendedTherapists);
router.get('/therapists/available-now', requireAuth, therapyController.getAvailableNowTherapists);
router.get('/therapists/:id', requireAuth, therapyController.getTherapistDetail);
router.get('/therapists/:id/slots', requireAuth, validators.validateGetSlots, therapyController.getTherapistSlots);

router.post('/sessions', requireAuth, validators.validateBookSession, therapyController.bookSession);
router.post('/sessions/instant', requireAuth, therapyController.bookInstantSession);
router.get('/sessions', requireAuth, validators.validateListSessions, therapyController.listSessions);
router.get('/sessions/:id', requireAuth, therapyController.getSessionDetail);
router.patch('/sessions/:id/cancel', requireAuth, validators.validateCancelSession, therapyController.cancelSession);
router.patch('/sessions/:id/reschedule', requireAuth, validators.validateRescheduleSession, therapyController.rescheduleSession);
router.post('/sessions/:id/rate', requireAuth, validators.validateRateSession, therapyController.rateSession);

// --- User journey ---
router.get('/journey', requireAuth, therapyController.getUserJourney);

// --- Nudge endpoints ---
router.get('/nudges', requireAuth, therapyController.getNudges);
router.patch('/nudges/:id/dismiss', requireAuth, therapyController.dismissNudge);
router.patch('/nudges/:id/acted', requireAuth, therapyController.markNudgeActed);

// --- Therapist-facing endpoints ---
router.get('/therapist/dashboard', requireAuth, requireRole('THERAPIST'), therapyController.getTherapistDashboard);
router.get('/therapist/sessions', requireAuth, requireRole('THERAPIST'), validators.validateListSessions, therapyController.listTherapistSessions);
router.get('/therapist/clients', requireAuth, requireRole('THERAPIST'), therapyController.getTherapistClients);
router.get('/therapist/clients/:id', requireAuth, requireRole('THERAPIST'), therapyController.getTherapistClientDetail);
router.get('/therapist/availability', requireAuth, requireRole('THERAPIST'), therapyController.getTherapistAvailability);
router.put('/therapist/availability', requireAuth, requireRole('THERAPIST'), validators.validateUpdateAvailability, therapyController.updateTherapistAvailability);
router.patch('/therapist/online-status', requireAuth, requireRole('THERAPIST'), validators.validateOnlineStatusToggle, therapyController.updateOnlineStatus);
router.get('/therapist/profile', requireAuth, requireRole('THERAPIST'), therapyController.getOwnProfile);
router.put('/therapist/profile', requireAuth, requireRole('THERAPIST'), validators.validateUpdateTherapistProfile, therapyController.updateOwnProfile);
router.get('/therapist/metrics', requireAuth, requireRole('THERAPIST'), therapyController.getOwnMetrics);
router.post('/sessions/:id/start', requireAuth, requireRole('THERAPIST'), therapyController.startSession);
router.post('/sessions/:id/complete', requireAuth, requireRole('THERAPIST'), validators.validateCompleteSession, therapyController.completeSession);
router.post('/sessions/:id/no-show', requireAuth, requireRole('THERAPIST'), therapyController.markNoShow);

export default router;
