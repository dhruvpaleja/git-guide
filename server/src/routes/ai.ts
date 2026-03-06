import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../lib/response.js';

const router = Router();

router.post('/chat', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/voice', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/emergency', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/emergency', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.put('/emergency/:id', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/patterns/:userId', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

// ── Session Monitor (In-Session AI — runs during live therapy video) ─────
router.post('/session-monitor/start', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/session-monitor/frame', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/session-monitor/audio', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/session-monitor/:sessionId/client', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/session-monitor/:sessionId/therapist', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

export default router;
