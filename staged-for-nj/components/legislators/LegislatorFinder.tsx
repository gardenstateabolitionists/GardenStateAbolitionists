'use client';

import Link from 'next/link';
import { useState } from 'react';
import { findLegislatorsForAddress, type FinderResult } from '@/lib/actions/find-legislator-actions';

/**
 * Client-side wrapper around findLegislatorsForAddress. Two forms in one:
 *   - Address form: street + city (best-precision, works for split ZIPs)
 *   - ZIP-only form: 5-digit ZIP, approximate result
 *
 * Renders the two matched profile links (House + Senate) below the form
 * on success. Errors show inline. No JS-heavy dependencies — everything
 * is a stock <input> plus a server action.
 */
export default function LegislatorFinder() {
  const [mode, setMode] = useState<'zip' | 'address'>('zip');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FinderResult['matched'] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await findLegislatorsForAddress(
      mode === 'zip' ? { zip: zip.trim() } : { address: address.trim(), city: city.trim() }
    );
    setLoading(false);
    if (res.ok) setResult(res.matched);
    else setError(res.error);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Find your Michigan legislators</h3>
      <p className="text-sm text-gray-600 mb-4">
        Enter your ZIP code — or your street + city for a more precise match if your ZIP straddles district lines.
      </p>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('zip')}
          className={`px-3 py-1.5 text-sm rounded font-medium ${
            mode === 'zip'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ZIP code
        </button>
        <button
          type="button"
          onClick={() => setMode('address')}
          className={`px-3 py-1.5 text-sm rounded font-medium ${
            mode === 'address'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Full address
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'zip' ? (
          <div>
            <label htmlFor="zip" className="sr-only">ZIP code</label>
            <input
              id="zip"
              inputMode="numeric"
              pattern="[0-9]{5}"
              maxLength={5}
              placeholder="e.g. 48933"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
              className="w-full sm:w-40 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-[2fr_1fr] gap-2">
            <input
              placeholder="Street address (e.g. 100 Main St)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading || (mode === 'zip' ? zip.length !== 5 : !address.trim() || !city.trim())}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Looking up…' : 'Find my reps'}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
          <p className="text-xs text-gray-500">
            Matched: <span className="font-mono">{result.display}</span>
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <ResultCard
              chamber="State House"
              districtNumber={result.houseDistrict}
              slug={result.houseSlug}
            />
            <ResultCard
              chamber="State Senate"
              districtNumber={result.senateDistrict}
              slug={result.senateSlug}
            />
          </div>
          {mode === 'zip' && (
            <p className="text-xs text-gray-500 italic">
              ZIP-only lookup uses an approximate centroid. If your ZIP straddles two districts, try the full-address form for a precise match.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ResultCard({
  chamber,
  districtNumber,
  slug,
}: {
  chamber: string;
  districtNumber: number | null;
  slug: string | null;
}) {
  if (!slug || districtNumber == null) {
    return (
      <div className="border border-gray-200 rounded p-3 bg-gray-50">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">{chamber}</p>
        <p className="text-sm text-gray-500">No matching legislator on file.</p>
      </div>
    );
  }
  return (
    <Link
      href={`/legislators/${slug}`}
      className="block border border-gray-200 rounded p-3 hover:border-red-600 transition-colors"
    >
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
        {chamber} · District {districtNumber}
      </p>
      <p className="text-red-700 font-semibold underline">View this legislator &rarr;</p>
    </Link>
  );
}
