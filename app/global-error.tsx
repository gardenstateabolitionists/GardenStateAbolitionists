"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";
import { captureException as posthogCaptureException } from "@/lib/analytics";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Dual-track exceptions to Sentry (with stack trace + release info) AND
    // PostHog (so it shows up alongside conversion events in the same tool
    // we use to see where users drop off). MRA does the same.
    Sentry.captureException(error);
    posthogCaptureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
