import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/profile', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.put('/profile', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.post('/onboarding', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.get('/dashboard', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

// Privacy (DPDPA/GDPR/CCPA compliance)
router.get('/export-my-data', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

router.delete('/delete-account', (_req: Request, res: Response) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented' } });
});

export default router;
