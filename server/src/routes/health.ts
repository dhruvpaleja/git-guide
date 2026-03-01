// ---------------------------------------------------------------------------
// Health Check Routes — Deep health monitoring for load balancers & ops
// ---------------------------------------------------------------------------

import { Router } from 'express';
import type { Request, Response } from 'express';
import { checkDatabaseHealth } from '../lib/prisma.js';
import { config } from '../config/index.js';

const router = Router();

const startTime = Date.now();

/**
 * GET /health — Liveness probe
 * Returns 200 if the process is alive. Used by load balancers.
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      version: config.api.version,
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(process.uptime()),
        since: new Date(startTime).toISOString(),
      },
    },
  });
});

/**
 * GET /health/ready — Readiness probe
 * Returns 200 only if ALL dependencies are healthy. Used by k8s/ECS.
 */
router.get('/health/ready', async (_req: Request, res: Response) => {
  const checks: Record<string, { status: string; latencyMs?: number; details?: string }> = {};

  // Database check
  const dbHealth = await checkDatabaseHealth();
  checks.database = {
    status: dbHealth.healthy ? 'healthy' : 'unhealthy',
    latencyMs: dbHealth.latencyMs,
  };

  // Memory check
  const mem = process.memoryUsage();
  const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024);
  const heapPercent = Math.round((mem.heapUsed / mem.heapTotal) * 100);

  checks.memory = {
    status: heapPercent < 90 ? 'healthy' : 'warning',
    details: `${heapUsedMB}MB / ${heapTotalMB}MB (${heapPercent}%)`,
  };

  // Overall status
  const allHealthy = Object.values(checks).every(c => c.status !== 'unhealthy');
  const statusCode = allHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: allHealthy,
    data: {
      status: allHealthy ? 'ready' : 'not_ready',
      version: config.api.version,
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(process.uptime()),
        since: new Date(startTime).toISOString(),
      },
      checks,
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
      },
    },
  });
});

export default router;
