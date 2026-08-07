'use server';

import { CITIES, type CityConfig } from '@/lib/data/cities';

/**
 * Resolve a user-supplied search string (city name OR MI ZIP code)
 * to a CityConfig if we have a page for it, or a nearest-city
 * suggestion if we don't.
 *
 * Name path: fuzzy contains-match on the city name.
 * ZIP path: uses zippopotam.us to convert ZIP → city name + lat/lng,
 * then either exact-name-matches a CityConfig or returns the geo-
 * nearest city we do cover.
 */

export interface FindCityMatch {
  ok: true;
  matched: {
    slug: string;
    name: string;
    exact: boolean; // false when we returned the geo-nearest fallback
    distanceMiles?: number;
    inputCity?: string;
  };
}

export interface FindCityError {
  ok: false;
  error: string;
}

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function nearest(lat: number, lng: number): (CityConfig & { distanceMiles: number }) | null {
  if (CITIES.length === 0) return null;
  const scored = CITIES.map((c) => ({
    ...c,
    distanceMiles: haversineMiles(lat, lng, c.latitude, c.longitude),
  }));
  scored.sort((a, b) => a.distanceMiles - b.distanceMiles);
  return scored[0];
}

export async function findCity(input: string): Promise<FindCityMatch | FindCityError> {
  const raw = (input || '').trim();
  if (!raw) return { ok: false, error: 'Type a Michigan city name or ZIP code.' };

  // ZIP path
  if (/^\d{5}$/.test(raw)) {
    try {
      const zRes = await fetch(`https://api.zippopotam.us/us/${raw}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!zRes.ok) return { ok: false, error: 'That ZIP doesn’t look like a US ZIP code.' };
      const zData = (await zRes.json()) as {
        places?: Array<{ 'place name': string; state: string; latitude: string; longitude: string }>;
      };
      const p = zData.places?.[0];
      if (!p || p.state !== 'Michigan') {
        return { ok: false, error: 'That ZIP code isn’t in Michigan.' };
      }
      const city = p['place name'];
      const lat = parseFloat(p.latitude);
      const lng = parseFloat(p.longitude);
      const exact = CITIES.find((c) => c.name.toLowerCase() === city.toLowerCase());
      if (exact) {
        return { ok: true, matched: { slug: exact.slug, name: exact.name, exact: true, inputCity: city } };
      }
      const near = nearest(lat, lng);
      if (near) {
        return {
          ok: true,
          matched: {
            slug: near.slug,
            name: near.name,
            exact: false,
            distanceMiles: near.distanceMiles,
            inputCity: city,
          },
        };
      }
      return { ok: false, error: 'No city page found for that area yet.' };
    } catch {
      return { ok: false, error: 'The ZIP lookup service is temporarily unavailable.' };
    }
  }

  // Name path
  const needle = raw.toLowerCase();
  const exact = CITIES.find((c) => c.name.toLowerCase() === needle);
  if (exact) return { ok: true, matched: { slug: exact.slug, name: exact.name, exact: true } };
  const contains = CITIES.find((c) => c.name.toLowerCase().includes(needle) || needle.includes(c.name.toLowerCase()));
  if (contains) return { ok: true, matched: { slug: contains.slug, name: contains.name, exact: true } };

  return {
    ok: false,
    error: `We don’t have a page for "${raw}" yet. Try a Michigan ZIP code and we’ll point you at the nearest covered city.`,
  };
}
