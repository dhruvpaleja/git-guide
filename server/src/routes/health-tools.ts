import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// Mood
router.get('/mood', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.post('/mood', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

// Journal
router.get('/journal', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.post('/journal', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.put('/journal/:id', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

// Meditation
router.get('/meditation', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.post('/meditation', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

// Breathing
router.get('/breathing', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.post('/breathing', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

export default router;
