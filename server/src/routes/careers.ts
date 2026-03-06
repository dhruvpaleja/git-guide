import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../lib/response.js';

const router = Router();

router.get('/positions', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/positions/:id', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/positions/:id/apply', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

export default router;
