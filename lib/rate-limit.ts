import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const limiters = new Map<string, Ratelimit>();

function getLimiter(maxAttempts: number): Ratelimit {
  const key = `${maxAttempts}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxAttempts, '15 m'),
      analytics: false,
      prefix: 'ratelimit',
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds?: number };

/**
 * Non-strict rate limit — fail-open if Redis is unavailable.
 * Use for public form submissions where blocking real users during a Redis
 * outage would hurt the business more than allowing brief unmetered traffic
 * (petition, newsletter, contact inquiries).
 */
export async function checkRateLimit(
  key: string,
  maxAttempts: number = 5
): Promise<RateLimitResult> {
  try {
    const limiter = getLimiter(maxAttempts);
    const { success, reset } = await limiter.limit(key);

    if (!success) {
      const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return { allowed: false, retryAfterSeconds };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed (fail-open):', error instanceof Error ? error.message : 'Unknown error');
    return { allowed: true };
  }
}

/**
 * Strict rate limit — fail-CLOSED if Redis is unavailable.
 * Use for authentication surfaces (access code, login, PIN) where an
 * unmetered path during a Redis outage opens brute force. The caller
 * should surface a friendly "please try again in a moment" message on
 * retryAfterSeconds > 0.
 */
export async function checkRateLimitStrict(
  key: string,
  maxAttempts: number = 5
): Promise<RateLimitResult> {
  try {
    const limiter = getLimiter(maxAttempts);
    const { success, reset } = await limiter.limit(key);

    if (!success) {
      const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return { allowed: false, retryAfterSeconds };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed (fail-closed):', error instanceof Error ? error.message : 'Unknown error');
    return { allowed: false, retryAfterSeconds: 30 };
  }
}
