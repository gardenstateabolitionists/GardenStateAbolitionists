'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Legislator } from '@/lib/data/legislators';
import { partyLabel, voteStyle } from '@/lib/data/legislators';

/**
 * Search the roster by district number or member name.
 *
 * Grouped by district rather than listed flat, because in New Jersey a voter
 * has three representatives (one senator, two assembly members) and the whole
 * point is to show all three together.
 */
export default function DistrictFinder({ legislators }: { legislators: Legislator[] }) {
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = !q
      ? legislators
      : legislators.filter(
          (l) =>
            String(l.district) === q ||
            l.name.toLowerCase().includes(q) ||
            l.chamber.toLowerCase().includes(q)
        );

    const byDistrict = new Map<number, Legislator[]>();
    for (const l of matches) {
      const list = byDistrict.get(l.district) ?? [];
      list.push(l);
      byDistrict.set(l.district, list);
    }
    return [...byDistrict.entries()]
      .sort((a, b) => a[0] - b[0])
      // Senator first, then assembly members alphabetically.
      .map(([d, ls]) => [
        d,
        ls.sort((a, b) =>
          a.chamber === b.chamber ? a.name.localeCompare(b.name) : a.chamber === 'Senate' ? -1 : 1
        ),
      ]) as [number, Legislator[]][];
  }, [legislators, query]);

  const shown = grouped.reduce((n, [, ls]) => n + ls.length, 0);

  return (
    <div>
      <label htmlFor="district-search" className="block text-sm font-medium text-gray-700 mb-1">
        District number or name
      </label>
      <input
        id="district-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. 12, or Bramnick"
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <p className="text-sm text-gray-500 mt-2" role="status">
        Showing {shown} of {legislators.length} members
        {query.trim() && grouped.length === 0 ? ' — no match' : ''}
      </p>

      <div className="mt-6 space-y-6">
        {grouped.map(([district, members]) => (
          <div key={district} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Legislative District {district}</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {members.map((m) => {
                const v = voteStyle(m.frcaVote);
                return (
                  <li key={m.slug} className="px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <Link
                      href={`/legislators/${m.slug}`}
                      className="font-semibold text-green-800 underline hover:no-underline"
                    >
                      {m.name}
                    </Link>
                    <span className="text-sm text-gray-600">
                      {m.chamber} &middot; {partyLabel(m.party)}
                    </span>
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="text-sm text-green-800 underline hover:no-underline break-all"
                      >
                        {m.email}
                      </a>
                    )}
                    {m.districtPhone && (
                      <a
                        href={`tel:${m.districtPhone.replace(/[^\d]/g, '')}`}
                        className="text-sm text-green-800 underline hover:no-underline"
                      >
                        {m.districtPhone}
                      </a>
                    )}
                    <span
                      className={`ml-auto text-xs px-2 py-1 rounded border ${v.className}`}
                      title="Vote on final passage of the Freedom of Reproductive Choice Act, 10 January 2022"
                    >
                      {v.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
