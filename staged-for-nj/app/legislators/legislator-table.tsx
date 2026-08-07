'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import InfoTip from '@/components/legislators/InfoTip';
import {
  chamberLabel,
  grade,
  gradeBadgeClass,
  partyLabel,
  type Grade,
  type Legislator,
} from '@/lib/data/legislators';

type SortKey = 'name' | 'district' | 'grade' | 'party' | 'chamber' | 'rtl_donations_total' | 'ppac_donations_total';

/**
 * Client-side sortable/filterable table of every Michigan legislator with
 * their abortion-relevant stance, votes, and campaign finance. Uses a `q`
 * URL query param so it works with the Sitelinks Searchbox (`/legislators?q=`)
 * declared in the WebSite JSON-LD.
 */
export default function LegislatorTable({ legislators }: { legislators: Legislator[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState<string>(searchParams?.get('q') ?? '');
  const [chamber, setChamber] = useState<'All' | 'House' | 'Senate'>('All');
  const [gradeFilter, setGradeFilter] = useState<'All' | Grade>('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Sync `q` back to URL for sharability + Sitelinks Searchbox.
  useMemo(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (q) params.set('q', q); else params.delete('q');
    const qs = params.toString();
    router.replace(qs ? `/legislators?${qs}` : '/legislators', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const rowsWithGrade = useMemo(
    () => legislators.map((l) => ({ ...l, _grade: grade(l) as Grade })),
    [legislators],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = rowsWithGrade;
    if (needle) {
      rows = rows.filter(
        (l) =>
          l.name.toLowerCase().includes(needle) ||
          String(l.district).includes(needle) ||
          (l.committees ?? '').toLowerCase().includes(needle),
      );
    }
    if (chamber !== 'All') rows = rows.filter((l) => l.chamber === chamber);
    if (gradeFilter !== 'All') rows = rows.filter((l) => l._grade === gradeFilter);
    rows = [...rows].sort((a, b) => cmp(a, b, sortKey, sortDir));
    return rows;
  }, [rowsWithGrade, q, chamber, gradeFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'district' || key === 'chamber' ? 'asc' : 'desc');
    }
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <input
          type="search"
          placeholder="Search name, district, committee..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search legislators"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <select
          value={chamber}
          onChange={(e) => setChamber(e.target.value as 'All' | 'House' | 'Senate')}
          aria-label="Filter by chamber"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All chambers</option>
          <option value="House">House only</option>
          <option value="Senate">Senate only</option>
        </select>
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value as 'All' | Grade)}
          aria-label="Filter by grade"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All grades</option>
          <option value="Pass">Pass only</option>
          <option value="Fail">Fail only</option>
        </select>
        <div className="flex items-center text-sm text-gray-600">
          Showing <span className="font-semibold mx-1">{filtered.length}</span> of {legislators.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <Th onClick={() => toggleSort('name')} active={sortKey === 'name'} dir={sortDir}>
                Name
              </Th>
              <Th onClick={() => toggleSort('chamber')} active={sortKey === 'chamber'} dir={sortDir}>
                Chamber
              </Th>
              <Th onClick={() => toggleSort('district')} active={sortKey === 'district'} dir={sortDir}>
                District
              </Th>
              <Th onClick={() => toggleSort('party')} active={sortKey === 'party'} dir={sortDir}>
                Party
              </Th>
              <Th onClick={() => toggleSort('grade')} active={sortKey === 'grade'} dir={sortDir}>
                Grade
              </Th>
              <Th
                onClick={() => toggleSort('rtl_donations_total')}
                active={sortKey === 'rtl_donations_total'}
                dir={sortDir}
                className="text-right"
              >
                <span className="inline-flex items-center">
                  RTL $
                  <InfoTip label="Right to Life of Michigan PAC donations">
                    <p className="mb-2">
                      Direct contributions from the{' '}
                      <strong>Right to Life of Michigan PAC</strong>
                      {' '}to this legislator&apos;s campaign committee, summed across the 2022
                      + 2024 Michigan election cycles.
                    </p>
                    <p>
                      RTL of Michigan is the state&apos;s largest incrementalist pro-life
                      organization. Founded 1970 — supports restrictions and exceptions, not
                      abolition. A $0 usually means support flowed through independent
                      expenditures (ads) rather than direct contributions.
                    </p>
                  </InfoTip>
                </span>
              </Th>
              <Th
                onClick={() => toggleSort('ppac_donations_total')}
                active={sortKey === 'ppac_donations_total'}
                dir={sortDir}
                className="text-right"
              >
                <span className="inline-flex items-center">
                  PP $
                  <InfoTip label="Planned Parenthood PAC donations">
                    <p className="mb-2">
                      Direct contributions from{' '}
                      <strong>Planned Parenthood Affiliates of Michigan</strong>
                      {' '}and{' '}
                      <strong>Planned Parenthood Federation of America</strong>
                      {' '}to this legislator&apos;s campaign committee, summed across the 2022
                      + 2024 Michigan election cycles.
                    </p>
                    <p>
                      Planned Parenthood is the largest abortion provider and pro-choice advocacy
                      organization in the US. A $0 doesn&apos;t mean no support — pro-choice
                      candidates often receive money through aligned PACs (Reproductive Freedom
                      for All, EMILY&apos;s List, MI Democratic Party) rather than directly.
                    </p>
                  </InfoTip>
                </span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.slug} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-3 py-2 font-semibold">
                  <Link href={`/legislators/${l.slug}`} className="text-red-700 hover:underline">
                    {l.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-gray-700">{chamberLabel(l.chamber)}</td>
                <td className="px-3 py-2 text-gray-700">{l.district}</td>
                <td className="px-3 py-2 text-gray-700">{partyLabel(l.party)}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${gradeBadgeClass(l._grade)}`}
                  >
                    {l._grade}
                  </span>
                </td>
                <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                  {l.rtl_donations_total > 0 ? `$${l.rtl_donations_total.toLocaleString()}` : '—'}
                </td>
                <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                  {l.ppac_donations_total > 0 ? `$${l.ppac_donations_total.toLocaleString()}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No legislators match your filters.{' '}
          <button
            className="text-red-700 underline hover:no-underline"
            onClick={() => {
              setQ('');
              setChamber('All');
              setGradeFilter('All');
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: 'asc' | 'desc';
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer select-none ${className}`}
    >
      <button onClick={onClick} className="inline-flex items-center gap-1">
        {children}
        {active && <span aria-hidden="true">{dir === 'asc' ? '▲' : '▼'}</span>}
      </button>
    </th>
  );
}

type Row = Legislator & { _grade: Grade };

function cmp(a: Row, b: Row, key: SortKey, dir: 'asc' | 'desc'): number {
  // Grade sorts as pass-before-fail; other keys sort by their raw value.
  let r = 0;
  if (key === 'grade') {
    const rank = (g: Grade) => (g === 'Pass' ? 0 : 1);
    r = rank(a._grade) - rank(b._grade);
  } else {
    const av = (a[key as keyof Legislator] ?? '') as string | number;
    const bv = (b[key as keyof Legislator] ?? '') as string | number;
    if (typeof av === 'number' && typeof bv === 'number') r = av - bv;
    else r = String(av).localeCompare(String(bv));
  }
  return dir === 'asc' ? r : -r;
}
