'use client';

import { useEffect, useRef } from 'react';

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

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = 'cf-turnstile-api';

interface TurnstileWidgetProps {
  /** Receives the token, or '' when it expires / errors / is not yet solved. */
  onToken: (token: string) => void;
  className?: string;
}

/**
 * Renders a Cloudflare Turnstile challenge and reports its token.
 *
 * Deliberately VISIBLE (Turnstile's default appearance) rather than
 * `interaction-only`. The invisible mode looks tidier but creates a dead end:
 * when Turnstile declines to issue a token silently, the form says "complete
 * the verification below" while nothing is rendered for the user to complete,
 * and there is no way for them to proceed. A visible widget always gives them
 * something to act on.
 *
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset, which pairs
 * with verifyTurnstile() failing open in that same case.
 */
export default function TurnstileWidget({ onToken, className }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  // Held in a ref so re-renders of the parent don't re-run the effect and tear
  // down a solved challenge. Assigned in an effect rather than during render —
  // mutating a ref mid-render is exactly the cascading-update hazard the
  // react-hooks rules exist to catch.
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const render = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (t: string) => onTokenRef.current(t),
        'error-callback': () => onTokenRef.current(''),
        'expired-callback': () => onTokenRef.current(''),
        'timeout-callback': () => onTokenRef.current(''),
        theme: 'auto',
      });
    };

    let poll: ReturnType<typeof setInterval> | undefined;
    if (window.turnstile) {
      render();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      // Script is already in flight from another widget on the page.
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
  }, []);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={containerRef} className={className} />;
}
