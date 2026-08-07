// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://d4afad843bcf14ce21a65a02c61cfe52@o4511746886598656.ingest.us.sentry.io/4511748921360384",

  tracesSampleRate: 1,
  enableLogs: true,

  // Never send PII or request bodies — see sentry.server.config.ts for why.
  sendDefaultPii: false,
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
});
