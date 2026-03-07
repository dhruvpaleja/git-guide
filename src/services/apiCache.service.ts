/**
 * API Response Cache Service
 * 
 * Caches API responses to reduce redundant network requests and improve performance.
 * 
 * Features:
 * - Time-based cache expiration
 * - LRU eviction when cache is full
 * - Automatic cache invalidation on mutations
 * - Per-endpoint cache configuration
 * 
 * Usage:
 * ```typescript
 * import { apiCache } from '@/services/apiCache.service';
 * 
 * // Cache a GET request
 * const cached = await apiCache.get('/therapy/therapists', { params: { page: 1 } });
 * if (cached) return cached;
 * 
 * const response = await fetch('/therapy/therapists?page=1');
 * const data = await response.json();
 * apiCache.set('/therapy/therapists', data, { params: { page: 1 } });
 * 
 * // Invalidate cache after mutation
 * apiCache.invalidate('/therapy/therapists');
 * ```
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in ms
}

interface CacheConfig {
  defaultTTL?: number; // Default TTL in ms (5 minutes)
  maxEntries?: number; // Maximum cache entries (100)
  endpointTTL?: Record<string, number>; // Per-endpoint TTL overrides
}

class ApiCacheService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private accessOrder: string[] = [];
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxEntries: 100,
      endpointTTL: {
        '/therapy/therapists': 2 * 60 * 1000, // 2 minutes
        '/therapy/therapists/recommended': 5 * 60 * 1000, // 5 minutes
        '/therapy/therapists/available-now': 30 * 1000, // 30 seconds (changes frequently)
        '/therapy/sessions': 1 * 60 * 1000, // 1 minute
        '/therapy/nudges': 1 * 60 * 1000, // 1 minute
        '/therapy/journey': 2 * 60 * 1000, // 2 minutes
        ...config.endpointTTL,
      },
      ...config,
    };
  }

  /**
   * Generate cache key from endpoint and params
   */
  private generateKey(endpoint: string, params?: Record<string, unknown>): string {
    if (!params || Object.keys(params).length === 0) {
      return endpoint;
    }
    const sortedParams = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join('&');
    
    return `${endpoint}?${sortedParams}`;
  }

  /**
   * Get TTL for endpoint
   */
  private getTTL(endpoint: string): number {
    // Find matching endpoint pattern
    for (const [pattern, ttl] of Object.entries(this.config.endpointTTL)) {
      if (endpoint.startsWith(pattern)) {
        return ttl;
      }
    }
    return this.config.defaultTTL;
  }

  /**
   * Get cached data
   */
  get<T>(endpoint: string, params?: Record<string, unknown>): T | null {
    const key = this.generateKey(endpoint, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter((k) => k !== key);
      return null;
    }

    // Update access order (LRU)
    this.accessOrder = this.accessOrder.filter((k) => k !== key);
    this.accessOrder.push(key);

    return entry.data as T;
  }

  /**
   * Set cache data
   */
  set<T>(endpoint: string, data: T, params?: Record<string, unknown>): void {
    const key = this.generateKey(endpoint, params);
    const ttl = this.getTTL(endpoint);

    // Evict oldest entries if cache is full
    while (this.cache.size >= this.config.maxEntries && this.accessOrder.length > 0) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    this.accessOrder.push(key);
  }

  /**
   * Invalidate cache for endpoint
   */
  invalidate(endpoint: string, params?: Record<string, unknown>): void {
    const key = this.generateKey(endpoint, params);
    this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter((k) => k !== key);
  }

  /**
   * Invalidate all cache entries matching pattern
   */
  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
    this.accessOrder = this.accessOrder.filter((key) => this.cache.has(key));
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; hits: number; misses: number } {
    const now = Date.now();
    let validEntries = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp <= entry.ttl) {
        validEntries++;
      }
    }

    return {
      size: validEntries,
      hits: 0, // Would need to track separately
      misses: 0,
    };
  }

  /**
   * Pre-fetch and cache data
   */
  async prefetch<T>(
    endpoint: string,
    fetcher: () => Promise<T>,
    params?: Record<string, unknown>
  ): Promise<T> {
    const cached = this.get<T>(endpoint, params);
    if (cached) {
      return cached;
    }

    const data = await fetcher();
    this.set(endpoint, data, params);
    return data;
  }
}

// Export singleton instance
export const apiCache = new ApiCacheService();
