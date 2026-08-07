// Client-side Google Ads conversion tracking.
//
// Fires alongside PostHog's `capture()` — PostHog is our internal product
// analytics; Google Ads needs its own gtag conversion events so the Ad Grants
// account can see conversions and stay in compliance (≥ 1 conversion / month).
//
// All env vars are optional. If NEXT_PUBLIC_GOOGLE_ADS_ID is unset, no script
// loads and every conversion call is a no-op — so the site works fine before
// Ad Grants is activated, and starts tracking automatically once the vars
// land in Vercel (and a rebuild picks them up — see [[Vercel env-var
// sensitive default]]).

type ConversionAction = 'petition' | 'inquiry' | 'newsletter' | 'donate';

const CONVERSION_ENV: Record<ConversionAction, string | undefined> = {
  petition: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONV_PETITION,
  inquiry: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONV_INQUIRY,
  newsletter: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONV_NEWSLETTER,
  donate: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONV_DONATE,
};

interface GtagWindow {
  gtag?: (
    command: 'event' | 'config' | 'set',
    action: string,
    params?: Record<string, unknown>
  ) => void;
  dataLayer?: unknown[];
}

/**
 * Fire a Google Ads conversion. Safe to call from any client component;
 * no-ops if the Ads script hasn't loaded or the conversion label isn't set.
 *
 * @param action  Which conversion action fired (matches Google Ads UI)
 * @param value   Optional monetary value (unused today — Zeffy handles donations)
 */
export function fireAdsConversion(action: ConversionAction, value?: number) {
  if (typeof window === 'undefined') return;
  const sendTo = CONVERSION_ENV[action];
  if (!sendTo) return; // env var not set = conversion action not configured yet
  const gtag = (window as unknown as GtagWindow).gtag;
  if (!gtag) return;  // script hasn't loaded (Ads ID not set, or blocked)
  gtag('event', 'conversion', {
    send_to: sendTo,
    ...(value !== undefined ? { value, currency: 'USD' } : {}),
  });
}
