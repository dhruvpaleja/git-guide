import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as videoController from '../controllers/video.controller.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Video session management
router.post('/start', videoController.startSession);
router.post('/end', videoController.endSession);
router.get('/room/:sessionId', videoController.getRoom);

// Recording management
router.post('/recording', videoController.toggleRecording);
router.get('/recording/:recordingId', videoController.getRecordingUrl);

// Token generation
router.post('/token', videoController.getToken);

export default router;
