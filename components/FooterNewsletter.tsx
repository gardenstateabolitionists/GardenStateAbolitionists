'use client';

import { useState, useRef, useEffect } from 'react';
import { subscribeToNewsletter } from '@/lib/actions/petition-actions';
import { capture } from '@/lib/analytics';
import { fireAdsConversion } from '@/lib/google-ads';

// Cloudflare Turnstile browser API (loaded on demand). Minimal typing.
type TurnstileAPI = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SCRIPT_ID = 'cf-turnstile-api';

// Footer newsletter opt-in. Guarded by:
//   1. honeypot ("website" field, hidden off-screen)
//   2. server-side rate limit (5/min per IP in subscribeToNewsletter)
//   3. Cloudflare Turnstile proof-of-human — the real wall against
//      patient/headless bots. Loaded lazily on first focus so the
//      Cloudflare script doesn't hit every page. Dormant (renders
//      nothing) until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
export default function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [token, setToken] = useState('');
  const [showWidget, setShowWidget] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY || !showWidget) return;

    const render = () => {
      if (!window.turnstile || !widgetRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: SITE_KEY,
        callback: (t: string) => setToken(t),
        'error-callback': () => setToken(''),
        'expired-callback': () => setToken(''),
        'timeout-callback': () => setToken(''),
        appearance: 'interaction-only', // invisible unless a challenge is needed
        theme: 'dark', // footer is #1a1a1a
      });
    };

    let poll: ReturnType<typeof setInterval> | undefined;
    if (window.turnstile) {
      render();
    } else if (!document.getElementById(TURNSTILE_SCRIPT_ID)) {
      const s = document.createElement('script');
      s.id = TURNSTILE_SCRIPT_ID;
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      poll = setInterval(() => {
        if (window.turnstile) {
          if (poll) clearInterval(poll);
          render();
        }
      }, 150);
    }

    return () => {
      if (poll) clearInterval(poll);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [showWidget]);

  const resetWidget = () => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
    setToken('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // If Turnstile is configured but hasn't produced a token yet, surface the
    // widget and ask the visitor to complete it.
    if (SITE_KEY && !token) {
      setShowWidget(true);
      setStatus('error');
      setErrorMsg('Please complete the quick verification below, then submit again.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const res = await subscribeToNewsletter({
      email: email.trim(),
      website,
      turnstileToken: token,
    });

    if ('error' in res) {
      setStatus('error');
      setErrorMsg(res.error);
      resetWidget(); // used tokens are single-use; force a fresh one
    } else {
      setStatus('success');
      setEmail('');
      resetWidget();
      capture('newsletter_subscribed', { source: 'footer' });
      fireAdsConversion('newsletter');
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold tracking-wider mb-4">STAY INFORMED</h2>
      <p className="text-gray-300 text-sm mb-4">
        Get updates on abolition efforts in New Jersey.
      </p>

      {status === 'success' ? (
        <p className="text-green-400 text-sm">Subscribed! Thank you.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Honeypot — hidden from real users; filled only by bots. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute -left-[9999px]"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <label htmlFor="footer-newsletter-email" className="block text-sm text-gray-300 mb-1">Email address</label>
          <div className="flex gap-2">
            <input
              id="footer-newsletter-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setShowWidget(true)}
              required
              maxLength={254}
              autoComplete="email"
              className="flex-1 min-w-0 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-xs">{errorMsg}</p>
          )}

          {/* Turnstile mounts here (invisible for legit visitors; shows a
              challenge only if one is required). Nothing renders until the
              site key is set. */}
          {SITE_KEY && showWidget && <div ref={widgetRef} className="mt-2" />}
        </form>
      )}
    </div>
  );
}
