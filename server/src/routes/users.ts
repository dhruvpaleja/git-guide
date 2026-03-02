import { Router } from 'express';

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
  uploadAvatar,
  exportUserData,
  deleteAccount,
} from '../controllers/users.controller.js';
import { avatarUpload } from '../lib/upload.js';

const router = Router();

router.post('/onboarding', requireAuth, requestBodyValidator(onboardingStepSchema), submitOnboardingStep);
router.get('/onboarding', requireAuth, getOnboardingProgress);
router.post('/astrology-profile', requireAuth, requestBodyValidator(astrologyProfileSchema), saveAstrologyProfile);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, requestBodyValidator(updateProfileSchema), updateProfile);
router.get('/dashboard', requireAuth, getDashboard);

// Avatar upload
router.post('/avatar', requireAuth, avatarUpload.single('avatar'), uploadAvatar);

// Settings
router.get('/settings', requireAuth, getSettings);
router.put('/settings', requireAuth, requestBodyValidator(updateSettingsSchema), updateSettings);

// Privacy (DPDPA/GDPR/CCPA compliance)
router.get('/export-my-data', requireAuth, exportUserData);
router.delete('/delete-account', requireAuth, deleteAccount);

export default router;
