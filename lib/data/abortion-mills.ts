/**
 * Typed access to the master New Jersey abortion-provider list.
 *
 * Data source: data/abortion-mills.json — hand-curated, one row per
 * physical location. `city` is the join key with the city landing
 * pages (lib/data/cities.ts): each city page pulls the mills where
 * `city === city.name`.
 *
 * Coordinates are stored so the eventual statewide map (`/abortion-mills`)
 * can render without re-geocoding at request time.
 */

import raw from '@/data/abortion-mills.json';

export interface AbortionMill {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  /** Public email, when the facility publishes one. Many don't
   * (Planned Parenthood + Summit route all contact through phone
   * or web-form only) — leave `null` in that case. */
  email: string | null;
  latitude: number;
  longitude: number;
  notes: string | null;
  url?: string | null;
  /** Direct URL to the Google Business Profile / Google Maps
   * place listing. When absent we fall back to a `/maps/search/`
   * URL built from name + address, which reliably resolves to
   * the same place profile. Populate explicitly whenever we have
   * a canonical CID URL, so the click count feeds the profile's
   * engagement stats directly. */
  googleBusinessUrl?: string | null;
  /** True when the facility has permanently closed. We keep the
   * listing (historical record + inbound-link preservation) but
   * render it visually distinct and exclude from "active" counts. */
  closed?: boolean;
  /** ISO YYYY-MM-DD of the closure date, when known. */
  closedOn?: string;
  /** Public-facing single sentence explaining the closure — rendered
   * on the card so a visitor sees why the address is here. */
  closureReason?: string;
  /** Municipality the facility actually sits in, from the Census geocoder.
   * NOT the mailing city: "Somerset" is part of Franklin Township and
   * "Hamilton Square" of Hamilton Township. Set by
   * scripts/resolve_facility_municipalities.py. */
  municipality?: string | null;
  county?: string | null;
  /** Legislative district containing the facility. */
  district?: number | null;
  /** True when the listing's own address and coordinates disagree, so no
   * physical location has been established. Such a facility is never
   * attributed to a city page — see getMillsByMunicipality. */
  locationUnverified?: boolean;
  locationNote?: string;
}

interface RawData {
  note: string;
  mills: AbortionMill[];
}

const DATA = raw as RawData;

export function getAllMills(): AbortionMill[] {
  return DATA.mills;
}

/** Only the still-serving facilities. Used for "total active" counts
 * on /abortion-mills and city pages so a closure doesn't silently
 * overstate the abortion infrastructure in New Jersey. */
export function getActiveMills(): AbortionMill[] {
  return DATA.mills.filter((m) => !m.closed);
}

export function getMillsByCity(cityName: string): AbortionMill[] {
  const needle = cityName.trim().toLowerCase();
  return DATA.mills.filter((m) => m.city.trim().toLowerCase() === needle);
}

/**
 * Facilities inside a municipality — the correct lookup for a city page.
 *
 * Prefer this over `getMillsByCity`, which matches the mailing city and is
 * wrong in New Jersey often enough to matter. Matching "Washington" by name
 * put a Warren County clinic on the Washington Township, Gloucester page:
 * a different municipality sixty miles away in a different district.
 *
 * A facility whose address and coordinates disagree is never returned. Placing
 * a clinic in a town on the strength of contradictory data would assert
 * something the data does not support.
 */
export function getMillsByMunicipality(municipality: string, county?: string): AbortionMill[] {
  const needle = municipality.trim().toLowerCase();
  const countyNeedle = county?.trim().toLowerCase();
  return DATA.mills.filter((m) => {
    if (m.locationUnverified) return false;
    if ((m.municipality || '').trim().toLowerCase() !== needle) return false;
    // Guard the repeated names: Washington, Franklin, Monroe and Hamilton all
    // exist in more than one New Jersey county.
    if (countyNeedle && (m.county || '').trim().toLowerCase() !== countyNeedle) return false;
    return true;
  });
}
