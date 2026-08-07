'use server';

import { getLegislatorByDistrict } from '@/lib/data/legislators';

/**
 * Resolve a Michigan address (street + city or ZIP) to that address's
 * state House + state Senate legislator, using the free US Census
 * Bureau geocoder API (no key, no rate limit for reasonable use).
 *
 * Two paths depending on what the caller gave us:
 *   - **Address + city** → hit the geocoder's `geographies/address`
 *     endpoint. Exact street match; best precision for split ZIPs.
 *   - **ZIP only** → resolve ZIP to its centroid lat/lng via
 *     zippopotam.us, then hit `geographies/coordinates` with that
 *     point. Approximation — ZIPs on district boundaries may
 *     resolve to a district that only covers part of the ZIP.
 *
 * Earlier we tried faking a "100 Main St" for ZIP-only lookups so
 * the address endpoint would work everywhere. That silently returned
 * 0 matches in any city without a Main St (e.g. Livonia), which
 * users saw as "Address not found." The coordinates endpoint has no
 * such gotcha — every point on Earth maps to *some* census block.
 *
 * Both endpoints expose `2024 State Legislative Districts - Lower/Upper`
 * in `vintage=ACS2025_Current` (MI's post-2022 redistricting), keyed
 * by the same integer district numbers as our legislators dataset.
 */

export interface FinderInput {
  address?: string;
  city?: string;
  zip?: string;
}

export interface FinderResult {
  ok: true;
  matched: {
    display: string;
    houseSlug: string | null;
    houseDistrict: number | null;
    senateSlug: string | null;
    senateDistrict: number | null;
  };
}

export interface FinderError {
  ok: false;
  error: string;
}

interface CensusGeocoderMatch {
  matchedAddress: string;
  // Keys are vintage-dependent — the newest vintage prefixes with a
  // year (e.g. "2024 State Legislative Districts - Lower"). We match
  // any key that contains "State Legislative Districts - Lower/Upper"
  // so a vintage bump doesn't silently break the lookup.
  geographies?: Record<string, Array<{ NAME?: string; SLDL?: string; SLDU?: string }>>;
}

interface CensusGeocoderResponse {
  result: {
    addressMatches: CensusGeocoderMatch[];
  };
}

// ACS2025_Current is the newest vintage that exposes the 2024
// state-legislative-district maps (MI's 2022 redistricting takes
// effect in the 2024-vintage data). Older vintages return only
// pre-redistricting 2018 districts, which no longer match our
// legislator dataset.
const CENSUS_VINTAGE = 'ACS2025_Current';

async function censusGeocodeAddress(street: string, city: string, zip: string | undefined): Promise<CensusGeocoderMatch | null> {
  const params = new URLSearchParams({
    street,
    city,
    state: 'MI',
    benchmark: 'Public_AR_Current',
    vintage: CENSUS_VINTAGE,
    format: 'json',
  });
  if (zip) params.set('zip', zip);
  const url = `https://geocoding.geo.census.gov/geocoder/geographies/address?${params.toString()}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const data = (await res.json()) as CensusGeocoderResponse;
  return data.result.addressMatches[0] || null;
}

// The coordinates endpoint returns a single "match" object at the
// top level of `result`, not an array — shape differs from the
// address endpoint. Normalizing here keeps callers uniform.
interface CensusCoordinatesResponse {
  result: {
    geographies: CensusGeocoderMatch['geographies'];
  };
}

async function censusGeocodeCoordinates(lat: number, lng: number, displayLabel: string): Promise<CensusGeocoderMatch | null> {
  const params = new URLSearchParams({
    x: String(lng),
    y: String(lat),
    benchmark: 'Public_AR_Current',
    vintage: CENSUS_VINTAGE,
    format: 'json',
  });
  const url = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?${params.toString()}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const data = (await res.json()) as CensusCoordinatesResponse;
  const geos = data.result.geographies;
  if (!geos) return null;
  return { matchedAddress: displayLabel, geographies: geos };
}

interface ZipInfo { city: string; lat: number; lng: number; }

async function zipInfo(zip: string): Promise<ZipInfo | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      places?: Array<{ 'place name': string; state: string; latitude: string; longitude: string }>;
    };
    const p = data.places?.[0];
    if (!p || p.state !== 'Michigan') return null;
    return {
      city: p['place name'],
      lat: parseFloat(p.latitude),
      lng: parseFloat(p.longitude),
    };
  } catch {
    return null;
  }
}

export async function findLegislatorsForAddress(input: FinderInput): Promise<FinderResult | FinderError> {
  const address = (input.address || '').trim();
  const zip = (input.zip || '').trim();
  const city = (input.city || '').trim();

  // Require at least a ZIP or a street+city
  if (!zip && !(address && city)) {
    return { ok: false, error: 'Enter a Michigan ZIP code, or a street address + city.' };
  }
  if (zip && !/^\d{5}$/.test(zip)) {
    return { ok: false, error: 'ZIP code must be 5 digits.' };
  }

  let match: CensusGeocoderMatch | null = null;
  try {
    if (address && city) {
      // Address path — best precision. Zip is optional but helps the
      // geocoder disambiguate common street names.
      match = await censusGeocodeAddress(address, city, zip || undefined);
      if (!match) {
        return {
          ok: false,
          error: 'Address not found. Try including the street number and city — or just the ZIP.',
        };
      }
    } else if (zip) {
      // ZIP-only path — geocode the ZIP centroid via coordinates.
      // Falls back to a friendly error if the ZIP isn't Michigan.
      const info = await zipInfo(zip);
      if (!info) {
        return { ok: false, error: 'That ZIP code doesn’t appear to be in Michigan.' };
      }
      match = await censusGeocodeCoordinates(info.lat, info.lng, `${info.city}, MI ${zip}`);
      if (!match) {
        return { ok: false, error: 'That ZIP couldn’t be resolved to a Michigan legislative district.' };
      }
    }
  } catch {
    return { ok: false, error: 'The address lookup service is temporarily unavailable. Please try again.' };
  }

  if (!match) {
    return { ok: false, error: 'Address not found. Try including the street number and city.' };
  }

  const geos = match.geographies || {};
  const houseKey = Object.keys(geos).find((k) => /State Legislative Districts - Lower/.test(k));
  const senateKey = Object.keys(geos).find((k) => /State Legislative Districts - Upper/.test(k));
  const houseGeo = houseKey ? geos[houseKey]?.[0] : undefined;
  const senateGeo = senateKey ? geos[senateKey]?.[0] : undefined;

  const houseDistrictStr = houseGeo?.SLDL;
  const senateDistrictStr = senateGeo?.SLDU;

  // SLDL/SLDU come back as zero-padded strings ("003"); coerce to int
  // for our (chamber, district) lookup which uses plain numbers.
  const houseDistrict = houseDistrictStr ? parseInt(houseDistrictStr, 10) : null;
  const senateDistrict = senateDistrictStr ? parseInt(senateDistrictStr, 10) : null;

  const houseLeg = houseDistrict !== null ? getLegislatorByDistrict('House', houseDistrict) : undefined;
  const senateLeg = senateDistrict !== null ? getLegislatorByDistrict('Senate', senateDistrict) : undefined;

  if (!houseLeg && !senateLeg) {
    return { ok: false, error: 'Located that address, but couldn’t match it to a Michigan legislative district.' };
  }

  return {
    ok: true,
    matched: {
      display: match.matchedAddress,
      houseSlug: houseLeg?.slug ?? null,
      houseDistrict: houseDistrict,
      senateSlug: senateLeg?.slug ?? null,
      senateDistrict: senateDistrict,
    },
  };
}
