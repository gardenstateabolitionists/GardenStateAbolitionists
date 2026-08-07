// Client-side analytics helpers.
//
// PostHog on this site loads lazily (see components/PostHogProvider.tsx —
// deferred to requestIdleCallback for perf). So the singleton may not yet
// be initialized when a fast user submits a form. The helpers below
// dynamically import posthog-js (cached, same instance as the provider)
// and no-op if init hasn't happened yet.
//
// Server-side capture uses lib/posthog-server.ts instead.

type Props = Record<string, string | number | boolean | null | undefined>;

async function getClient() {
  if (typeof window === 'undefined') return null;
  try {
    const mod = await import('posthog-js');
    const posthog = mod.default;
    return posthog.__loaded ? posthog : null;
  } catch {
    return null;
  }
}

export async function capture(event: string, properties?: Props) {
  const posthog = await getClient();
  if (!posthog) return;
  posthog.capture(event, properties);
}

export async function identify(distinctId: string, properties?: Props) {
  const posthog = await getClient();
  if (!posthog) return;
  posthog.identify(distinctId, properties);
}

export async function reset() {
  const posthog = await getClient();
  if (!posthog) return;
  posthog.reset();
}

export async function captureException(err: unknown) {
  const posthog = await getClient();
  if (!posthog) return;
  posthog.captureException(err);
}
