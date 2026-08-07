// Sentry client init — runs whenever a browser loads any page.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Fully no-op when DSN unset — avoids Sentry setting up transports and
  // error handlers on a page that has no DSN configured yet.
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  // No Replay integration on purpose: PostHog session replay (if we ever
  // re-enable it) would already record sessions; running Sentry Replay too
  // loads a second rrweb bundle — pure waste. Matches MRA's decision.
  integrations: [],

  // Sample 10% of traces to stay well within free-tier quota; errors capture
  // at 100%.
  tracesSampleRate: 0.1,
  enableLogs: true,

  // Never send PII or POST bodies — the auth routes' bodies contain plaintext
  // passwords, and the petition/contact/inquiry bodies contain personal data
  // covered by our privacy policy.
  sendDefaultPii: false,
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
