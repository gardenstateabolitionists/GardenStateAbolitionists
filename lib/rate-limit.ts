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

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds?: number;
  /**
   * True when the decision came from the in-process fallback because Redis was
   * unreachable. Callers can use this to explain themselves honestly instead of
   * reporting a credential failure.
   */
  degraded?: boolean;
};

const WINDOW_MS = 15 * 60 * 1000;

/**
 * Per-process sliding window used ONLY when Redis is unreachable.
 *
 * This exists because the strict limiter used to fail closed, which meant an
 * Upstash outage locked every admin out of the site — and the UI reported it as
 * "Invalid access code", sending you to debug credentials that were fine.
 * Failing open was not an acceptable alternative either: it would leave the
 * login, access code and PIN endpoints completely unmetered during exactly the
 * window when nobody is watching.
 *
 * Caveat worth knowing: serverless instances do not share memory, so the real
 * ceiling during an outage is roughly maxAttempts × live instances. That is far
 * weaker than Redis, but bounded — and it only applies while Redis is down.
 */
const memoryHits = new Map<string, number[]>();

function memoryLimit(key: string, maxAttempts: number): RateLimitResult {
  const now = Date.now();
  const recent = (memoryHits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= maxAttempts) {
    memoryHits.set(key, recent);
    const oldest = recent[0];
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)),
      degraded: true,
    };
  }

  recent.push(now);
  memoryHits.set(key, recent);

  // Bound the map so a long-lived instance under attack cannot grow it without
  // limit: drop any key whose entries have all aged out.
  if (memoryHits.size > 5000) {
    for (const [k, times] of memoryHits) {
      if (times.every((t) => now - t >= WINDOW_MS)) memoryHits.delete(k);
    }
  }

  return { allowed: true, degraded: true };
}

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
 * Strict rate limit — for authentication surfaces (access code, login, PIN),
 * where leaving the path unmetered would open brute force.
 *
 * When Redis is unavailable this DEGRADES to an in-process limiter rather than
 * denying outright. The previous fail-closed behavior meant an Upstash outage
 * (or a missing KV_REST_API_* variable) made admin login impossible, while the
 * UI blamed the credentials. Attempts are still bounded — see memoryLimit for
 * the trade-off — and the result is flagged `degraded` so callers can say what
 * actually happened.
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
    console.error(
      'Rate limit backend unavailable — falling back to in-process limiter:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return memoryLimit(key, maxAttempts);
  }
}
