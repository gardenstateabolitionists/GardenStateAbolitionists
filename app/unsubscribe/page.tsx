'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { capture } from '@/lib/analytics';

type Status = 'confirm' | 'processing' | 'success' | 'error' | 'invalid';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';
  const successParam = searchParams.get('success');

  const [override, setOverride] = useState<Status | null>(null);

  let status: Status;
  if (override) {
    status = override;
  } else if (successParam === 'true') {
    status = 'success';
  } else if (!email || !token) {
    status = 'invalid';
  } else {
    status = 'confirm';
  }

  const handleUnsubscribe = async () => {
    setOverride('processing');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });
      if (res.ok) {
        capture('email_unsubscribed');
        setOverride('success');
      } else {
        setOverride('error');
      }
    } catch {
      setOverride('error');
    }
  };

  return (
    <section className="bg-[#1a1a1a] text-white min-h-[60vh] flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center py-24">
        {status === 'invalid' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Invalid Link</h1>
            <div className="w-12 h-[3px] bg-green-700 mx-auto mb-8" />
            <p className="text-gray-300 text-lg mb-8">
              This unsubscribe link is invalid or has expired.
            </p>
            <Link
              href="/"
              className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded transition-colors"
            >
              Return to Homepage
            </Link>
          </>
        )}

        {status === 'confirm' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Unsubscribe</h1>
            <div className="w-12 h-[3px] bg-green-700 mx-auto mb-8" />
            <p className="text-gray-300 text-lg mb-4">
              Are you sure you want to unsubscribe from email communications?
            </p>
            <p className="text-gray-400 text-sm mb-8">
              You will no longer receive newsletters or article updates from Garden State Abolitionists.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-block border border-gray-500 hover:border-white text-white font-semibold py-3 px-8 rounded transition-colors"
              >
                Keep Me Subscribed
              </Link>
              <button
                onClick={handleUnsubscribe}
                className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded transition-colors"
              >
                Yes, Unsubscribe
              </button>
            </div>
          </>
        )}

        {status === 'processing' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Unsubscribing...</h1>
            <div className="w-12 h-[3px] bg-green-700 mx-auto mb-8" />
            <p className="text-gray-300">Please wait...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Unsubscribed</h1>
            <div className="w-12 h-[3px] bg-green-700 mx-auto mb-8" />
            <p className="text-gray-300 text-lg mb-4">
              You have been successfully unsubscribed from email communications from Garden State Abolitionists.
            </p>
            <p className="text-gray-400 mb-8">
              If this was a mistake, you can sign the petition again and opt in to receive updates.
            </p>
            <Link
              href="/"
              className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded transition-colors"
            >
              Return to Homepage
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Error</h1>
            <div className="w-12 h-[3px] bg-green-700 mx-auto mb-8" />
            <p className="text-gray-300 text-lg mb-8">
              This unsubscribe link is invalid or has expired. Please try again from a recent email.
            </p>
            <Link
              href="/"
              className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded transition-colors"
            >
              Return to Homepage
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <section className="bg-[#1a1a1a] text-white min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-300">Loading...</p>
      </section>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
