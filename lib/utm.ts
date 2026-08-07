/**
 * Helpers for tagging outbound + shared links with UTM parameters so
 * PostHog can attribute where every referred visit came from.
 *
 * We split on TWO axes:
 *   - `source`  = the site/platform the link lives on (facebook, x, signal, email, ...)
 *   - `medium`  = the KIND of interaction (share, cta, invite, ...)
 *   - `campaign`= the goal we're driving (petition, donate, contact, general)
 *
 * Callers should use `withUtm(href, {...})` for external links, or
 * `internalUtm({...})` for building the `?utm_...` suffix without an href.
 */

export interface UtmParams {
  source: string;   // e.g. 'facebook', 'x', 'signal', 'email', 'donate_button'
  medium: string;   // e.g. 'share', 'cta', 'invite'
  campaign: string; // e.g. 'petition', 'donate', 'newsletter', 'general'
  content?: string; // optional variant/creative name
  term?: string;    // optional keyword
}

/**
 * Append UTM parameters to a URL. Preserves any existing query string and
 * hash. Only adds params that don't already exist so callers can override.
 */
export function withUtm(href: string, utm: UtmParams): string {
  try {
    const url = new URL(href);
    const set = (k: string, v?: string) => {
      if (v && !url.searchParams.has(k)) url.searchParams.set(k, v);
    };
    set('utm_source', utm.source);
    set('utm_medium', utm.medium);
    set('utm_campaign', utm.campaign);
    set('utm_content', utm.content);
    set('utm_term', utm.term);
    return url.toString();
  } catch {
    // Not a full URL (e.g. mailto:, relative, or malformed) — fall back to
    // string-append so we don't drop the tag entirely.
    const sep = href.includes('?') ? '&' : '?';
    const params = new URLSearchParams();
    params.set('utm_source', utm.source);
    params.set('utm_medium', utm.medium);
    params.set('utm_campaign', utm.campaign);
    if (utm.content) params.set('utm_content', utm.content);
    if (utm.term) params.set('utm_term', utm.term);
    return `${href}${sep}${params.toString()}`;
  }
}
