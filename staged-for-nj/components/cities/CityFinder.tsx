'use client';

import Link from 'next/link';
import { useState } from 'react';
import { findCity } from '@/lib/actions/find-city-actions';

/**
 * Sitewide "Find your city" search — accepts a city name or a MI ZIP
 * code and either lands the user on the exact city page or suggests
 * the nearest covered city. Rendered on the /cities index; can be
 * reused anywhere sitewide.
 */
export default function CityFinder() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    slug: string;
    name: string;
    exact: boolean;
    distanceMiles?: number;
    inputCity?: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestion(null);
    const res = await findCity(value.trim());
    setLoading(false);
    if (res.ok) setSuggestion(res.matched);
    else setError(res.error);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Find your Michigan city</h3>
      <p className="text-sm text-gray-600 mb-4">
        Enter a city name or a Michigan ZIP code. We&apos;ll take you to that
        city&apos;s page, or point you at the nearest one we cover.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Grand Rapids, or 49503"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          disabled={loading || value.trim().length === 0}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Looking up…' : 'Find'}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {suggestion && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          {suggestion.exact ? (
            <p className="text-gray-800">
              Found a page for <strong>{suggestion.name}</strong>.{' '}
              <Link
                href={`/cities/${suggestion.slug}`}
                className="text-red-700 underline font-semibold"
              >
                Open the {suggestion.name}{' '}page &rarr;
              </Link>
            </p>
          ) : (
            <p className="text-gray-800">
              We don&apos;t have a page for{' '}
              <strong>{suggestion.inputCity || value}</strong> yet. The nearest
              city we cover is <strong>{suggestion.name}</strong>
              {suggestion.distanceMiles != null && (
                <> ({Math.round(suggestion.distanceMiles)} mi away)</>
              )}.{' '}
              <Link
                href={`/cities/${suggestion.slug}`}
                className="text-red-700 underline font-semibold"
              >
                Open the {suggestion.name}{' '}page &rarr;
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
