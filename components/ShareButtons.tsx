'use client';

import { useState } from 'react';
import { capture } from '@/lib/analytics';
import { withUtm } from '@/lib/utm';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
}

export default function ShareButtons({
  url,
  title = 'Sign the Petition - Garden State Abolitionists',
  description = 'Sign the petition calling for the immediate abolition of abortion in New Jersey.',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  // Derive shareUrl from prop or window at render time (safe: this is a client component).
  const rawUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  // Per-platform UTM-tagged share URLs so PostHog attributes referred visits
  // back to the exact channel that drove them.
  const fbUrl = rawUrl ? withUtm(rawUrl, { source: 'facebook', medium: 'share', campaign: 'petition' }) : '';
  const xUrl = rawUrl ? withUtm(rawUrl, { source: 'x', medium: 'share', campaign: 'petition' }) : '';
  const emailUrl = rawUrl ? withUtm(rawUrl, { source: 'email', medium: 'share', campaign: 'petition' }) : '';
  const copyShareUrl = rawUrl ? withUtm(rawUrl, { source: 'copy_link', medium: 'share', campaign: 'petition' }) : '';
  const encodedFb = encodeURIComponent(fbUrl);
  const encodedX = encodeURIComponent(xUrl);
  const encodedEmail = encodeURIComponent(emailUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(copyShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      capture('petition_shared', { platform: 'copy_link' });
    } catch {
      // Silently fail if clipboard access is denied
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Share this petition</p>
      <div className="flex items-center gap-3">
        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedFb}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => capture('petition_shared', { platform: 'facebook' })}
          className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
          aria-label="Share on Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>

        {/* X (Twitter) */}
        <a
          href={`https://x.com/intent/tweet?url=${encodedX}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => capture('petition_shared', { platform: 'x' })}
          className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-black text-white hover:opacity-80 transition-opacity"
          aria-label="Share on X"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Email */}
        <a
          href={`mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedEmail}`}
          onClick={() => capture('petition_shared', { platform: 'email' })}
          className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gray-600 text-white hover:opacity-80 transition-opacity"
          aria-label="Share via email"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          aria-label={copied ? 'Link copied!' : 'Copy link'}
        >
          {copied ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        </button>
      </div>
      {copied && (
        <p className="text-sm text-green-600" aria-live="polite">Link copied to clipboard!</p>
      )}
    </div>
  );
}
