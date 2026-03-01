// ---------------------------------------------------------------------------
// Cache Service — Redis-ready caching with in-memory Map fallback
// ---------------------------------------------------------------------------

import { logger } from '../lib/logger.js';

export interface CacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  flush(): Promise<void>;
  keys(pattern?: string): Promise<string[]>;
}

// In-memory entry with TTL support
interface MemoryCacheEntry {
  value: unknown;
  expiresAt: number | null;
}

const DEFAULT_TTL = 300; // 5 minutes

/**
 * Cache Service
 *
 * Currently uses in-memory Map (single-process, clears on restart).
 * Replace with Redis for production:
 *
 *   npm install ioredis
 *   import Redis from 'ioredis';
 *   const redis = new Redis(process.env.REDIS_URL);
 *   Swap provider implementation below.
 */

const _store = new Map<string, MemoryCacheEntry>();

// Periodic cleanup of expired entries (every 60s)
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, entry] of _store) {
    if (entry.expiresAt && entry.expiresAt <= now) {
      _store.delete(key);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    logger.debug('cache_cleanup', { expired: cleaned, remaining: _store.size });
  }
}, 60_000).unref(); // unref so it doesn't keep process alive

export const cacheService: CacheProvider = {

  get: async <T>(key: string): Promise<T | null> => {
    const entry = _store.get(key);

    if (!entry) return null;

    // Check expiration
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      _store.delete(key);
      return null;
    }

    return entry.value as T;
  },

  set: async <T>(key: string, value: T, ttlSeconds: number = DEFAULT_TTL): Promise<void> => {
    _store.set(key, {
      value,
      expiresAt: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null,
    });
  },

  del: async (key: string): Promise<void> => {
    _store.delete(key);
  },

  has: async (key: string): Promise<boolean> => {
    const entry = _store.get(key);
    if (!entry) return false;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      _store.delete(key);
      return false;
    }
    return true;
  },

  flush: async (): Promise<void> => {
    _store.clear();
    logger.info('cache_flushed');
  },

  keys: async (pattern?: string): Promise<string[]> => {
    const allKeys = Array.from(_store.keys());
    if (!pattern) return allKeys;

    // Simple glob: convert * to regex
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    return allKeys.filter(k => regex.test(k));
  },
};

// ---------------------------------------------------------------------------
// Cache Utility — Memoize expensive operations
// ---------------------------------------------------------------------------

/**
 * Cache-aside helper for async functions.
 *
 * Usage:
 *   const user = await cacheAside('user:123', 600, () => prisma.user.findUnique({ where: { id: '123' } }));
 */
export async function cacheAside<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await cacheService.get<T>(key);
  if (cached !== null) return cached;

  const value = await fetcher();
  if (value !== null && value !== undefined) {
    await cacheService.set(key, value, ttlSeconds);
  }
  return value;
}
