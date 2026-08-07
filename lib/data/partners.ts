/**
 * Typed access to the abolition partner directory.
 *
 * Data source: data/abolition-partners.json — curated from
 * C:/Users/Dustina/Downloads/abolition_site_tracker.xlsx (rating >= 5,
 * real live sites with substance). Excludes incrementalist orgs.
 */

import raw from '@/data/abolition-partners.json';

export type PartnerSocialPlatform = 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'tiktok';

export interface PartnerSocial {
  platform: PartnerSocialPlatform;
  url: string;
}

export interface Partner {
  name: string;
  /** null when the org's website is down / gone and we haven't
   * substituted a working alternative. The card renders name+blurb
   * only in that case. Also drops the row from the ItemList schema. */
  url: string | null;
  blurb: string;
  state?: string;
  /**
   * Contact address for the Partner Broadcast tool. `null` when the
   * partner site is form-only or doesn't publish a real inbox (many
   * Wix templates ship a placeholder "user@domain.com" — those are
   * filtered out during curation). Broadcasts skip null-email rows.
   */
  email?: string | null;
  /**
   * Public social channels for the org — rendered as small labeled
   * links on the partner card. Especially useful for new orgs that
   * don't have a website yet (Garden State Abolitionists) or for
   * orgs whose website has gone down (VA) where the socials are the
   * only remaining way to reach them.
   */
  socials?: PartnerSocial[];
}

interface RawData {
  note: string;
  national: Partner[];
  states: (Partner & { state: string })[];
}

const DATA = raw as RawData;

export function getNationalPartners(): Partner[] {
  return DATA.national;
}

export function getStatePartners(): (Partner & { state: string })[] {
  // Alphabetical by state — easier to scan than by rating.
  return [...DATA.states].sort((a, b) => a.state.localeCompare(b.state));
}

export function getAllPartners(): Partner[] {
  return [...DATA.national, ...DATA.states];
}

/**
 * The 50 US states in the order I want to render them for the "which
 * states have partners" grid. Alphabetical since that's the most
 * scannable arrangement in a text grid (a real map projection is a
 * bigger add and doesn't help SEO).
 */
export const ALL_STATES: string[] = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

/** Map of state name → partner (or undefined) for quick grid lookup. */
export function partnersByState(): Map<string, Partner> {
  const m = new Map<string, Partner>();
  for (const p of DATA.states) m.set(p.state, p);
  return m;
}

/**
 * Partners with a real contact email — the audience for the admin
 * Partner Broadcast tool. Order stays alphabetical-by-state so the
 * admin UI recipient preview is scannable.
 */
export function getBroadcastablePartners(): { state?: string; name: string; email: string }[] {
  const out: { state?: string; name: string; email: string }[] = [];
  for (const p of [...DATA.national, ...DATA.states]) {
    if (p.email && p.email.trim()) {
      out.push({ state: (p as { state?: string }).state, name: p.name, email: p.email.trim() });
    }
  }
  out.sort((a, b) => (a.state || '').localeCompare(b.state || ''));
  return out;
}
