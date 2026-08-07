'use client';

import { useEffect, Suspense, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Import types only — the runtime import is lazy (see initPostHog below) so the
// ~40 KB posthog-js bundle stays out of the critical path. This was tanking
// LCP/TBT on the homepage before the deferral.
import type posthogType from 'posthog-js';
let posthog: typeof posthogType | null = null;

async function initPostHog() {
  if (typeof window === 'undefined') return;
  if (posthog?.__loaded) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  const mod = await import('posthog-js');
  posthog = mod.default;
  posthog.init(key, {
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    // Session replay off site-wide — rrweb bundle (~90 KiB) isn't worth it for
    // an advocacy site. Pageview/funnel analytics still work. Match the MRA
    // decision documented in that repo's instrumentation-client.ts.
    disable_session_recording: true,
    disable_surveys: true,
    debug: process.env.NODE_ENV === 'development',
  });
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !posthog?.__loaded) return;
    let url = window.origin + pathname;
    const search = searchParams?.toString();
    if (search) url += '?' + search;
    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Defer PostHog init to after the browser is idle (or 2s max). This keeps
    // the posthog-js bundle off the LCP/TBT critical path. We lose maybe 1-2s
    // of very-first-pageview signal in exchange for a much better perf score.
    const idle: ReturnType<typeof setTimeout> = (
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
            () => { initPostHog().then(() => setReady(true)); },
            { timeout: 2000 }
          )
        : setTimeout(() => { initPostHog().then(() => setReady(true)); }, 1500)
    ) as ReturnType<typeof setTimeout>;
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idle as unknown as number);
      } else {
        clearTimeout(idle);
      }
    };
  }, []);

  // PageviewTracker only mounts after PostHog is loaded, so capture() calls
  // are safe. Missing the initial pageview event on first load is the cost.
  return (
    <>
      {ready && (
        <Suspense fallback={null}>
          <PageviewTracker />
        </Suspense>
      )}
      {children}
    </>
  );
}
