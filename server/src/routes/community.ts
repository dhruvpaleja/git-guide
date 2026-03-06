import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../lib/response.js';

const router = Router();

router.get('/feed', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/posts', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/posts', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/posts/:id', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/posts/:id/like', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/posts/:id/comments', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/posts/:id/comments', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/posts/:id/report', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/moderation', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

export default router;
