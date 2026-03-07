// ---------------------------------------------------------------------------
// Prisma Client — Singleton with health check and connection monitoring
// ---------------------------------------------------------------------------

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize Prisma');
}

// Parse DATABASE_URL and use explicit password to avoid URL-encoding issues with @ in password
function createPool() {
  const url = new URL(databaseUrl!);
  return new pg.Pool({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    user: url.username,
    password: process.env.DATABASE_PASSWORD || decodeURIComponent(url.password),
    ssl: url.hostname !== 'localhost' ? { rejectUnauthorized: false } : undefined,
  });
}

const pool = createPool();
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

/**
 * Check database connectivity. Returns true if DB is reachable.
 */
export async function checkDatabaseHealth(): Promise<{ healthy: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    return { healthy: true, latencyMs: Date.now() - start };
  } catch {
    return { healthy: false, latencyMs: Date.now() - start };
  }
}
