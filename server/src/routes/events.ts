import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../lib/response.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/:slug', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/:id/register', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/:id/attendees', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/:id/feedback', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

// Admin
router.post('/', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.put('/:id', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

export default router;
