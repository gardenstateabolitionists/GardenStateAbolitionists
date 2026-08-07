'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { captureException as posthogCaptureException } from '@/lib/analytics';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Page-level error boundary — send to Sentry + PostHog so it shows up
    // in the same product-analytics dashboard as our conversion events.
    console.error('Application error:', error);
    Sentry.captureException(error);
    posthogCaptureException(error);
  }, [error]);

  return (
    <section className="bg-[#1a1a1a] text-white min-h-[60vh] flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        <h1 className="text-5xl font-black text-red-600 mb-4">ERROR</h1>
        <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
        <p className="text-gray-300 mb-8">
          Something went wrong. Please try again or return to the home page.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-600 hover:border-white text-white font-semibold rounded transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
