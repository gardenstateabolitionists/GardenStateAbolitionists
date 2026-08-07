// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://d4afad843bcf14ce21a65a02c61cfe52@o4511746886598656.ingest.us.sentry.io/4511748921360384",

  tracesSampleRate: 1,
  enableLogs: true,

  // Never send PII or request bodies — the auth routes' POST bodies contain
  // plaintext passwords, and petition/contact/inquiry bodies contain personal
  // data covered by our privacy policy.
  sendDefaultPii: false,
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
});
