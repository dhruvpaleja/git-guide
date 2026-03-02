import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requestBodyValidator, onboardingStepSchema, astrologyProfileSchema, updateProfileSchema, updateSettingsSchema } from '../validators/users.validator.js';
import {
  submitOnboardingStep,
  getOnboardingProgress,
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  getDashboard,
  saveAstrologyProfile,
} from '../controllers/users.controller.js';

const router = Router();

router.post('/onboarding', requireAuth, requestBodyValidator(onboardingStepSchema), submitOnboardingStep);
router.get('/onboarding', requireAuth, getOnboardingProgress);
router.post('/astrology-profile', requireAuth, requestBodyValidator(astrologyProfileSchema), saveAstrologyProfile);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, requestBodyValidator(updateProfileSchema), updateProfile);
router.get('/dashboard', requireAuth, getDashboard);

// Settings
router.get('/settings', requireAuth, getSettings);
router.put('/settings', requireAuth, requestBodyValidator(updateSettingsSchema), updateSettings);

// Privacy (DPDPA/GDPR/CCPA compliance)
router.get('/export-my-data', requireAuth, (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { code: 'SRV_005', message: 'Not implemented' } });
});

router.delete('/delete-account', requireAuth, (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { code: 'SRV_005', message: 'Not implemented' } });
});

export default router;
