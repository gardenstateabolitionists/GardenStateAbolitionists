import { PostHog } from 'posthog-node';

/**
 * Server-side PostHog client for `capture()` from server actions / API routes.
 * Uses flushAt/Interval 1/0 so events fire on the same request rather than
 * waiting for a batching window (which serverless would kill).
 */
export function getPostHogClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  return new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
  });
}
