import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as dailyController from '../controllers/daily.controller.js';
import * as validators from '../validators/daily.validator.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Video session management
router.post('/start', validators.validateStartSession, dailyController.startSession);
router.post('/end', validators.validateEndSession, dailyController.endSession);
router.get('/room/:sessionId', validators.validateGetRoom, dailyController.getRoom);

// Recording management
router.post('/recording', validators.validateToggleRecording, dailyController.toggleRecording);
router.get('/recording/:recordingId', dailyController.getRecordingUrl);

// Token generation
router.post('/token', validators.validateStartSession, dailyController.getToken);

export default router;
