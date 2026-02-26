import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.get('/:slug', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.post('/:id/register', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.get('/:id/attendees', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.post('/:id/feedback', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

// Admin
router.post('/', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.put('/:id', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

export default router;
