export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimitStore {
  consume(key: string, maxRequests: number, windowSeconds: number): Promise<RateLimitResult>;
}

interface BucketEntry {
  count: number;
  resetAtMs: number;
}

/**
 * Development & single-instance rate limiter.
 * Replace with a Redis-backed implementation (`REDIS_URL`) for multi-instance production deployments.
 */
export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly buckets = new Map<string, BucketEntry>();

  async consume(key: string, maxRequests: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (!existing || existing.resetAtMs <= now) {
      this.buckets.set(key, {
        count: 1,
        resetAtMs: now + windowSeconds * 1000,
      });
      return {
        allowed: true,
        remaining: Math.max(0, maxRequests - 1),
        retryAfterSeconds: 0,
      };
    }

    if (existing.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAtMs - now) / 1000)),
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - existing.count),
      retryAfterSeconds: 0,
    };
  }
}
