import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../lib/response.js';

import { requireAuth } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/security.middleware.js';
import { requestBodyValidator, registerSchema, loginSchema } from '../validators/auth.validator.js';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authLimiter, requestBodyValidator(registerSchema), authController.register);
router.post('/login', authLimiter, requestBodyValidator(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

router.post('/forgot-password', authLimiter, (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/reset-password', authLimiter, (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

export default router;
