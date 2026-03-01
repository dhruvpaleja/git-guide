import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      data: {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected',
      },
    });
  } catch {
    res.status(503).json({
      success: true,
      data: {
        status: 'degraded',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      },
    });
  }
});

export default router;
