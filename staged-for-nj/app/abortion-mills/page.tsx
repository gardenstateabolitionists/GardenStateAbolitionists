import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import MillsMap from '@/components/mills/MillsMap';
import { getAllMills, getActiveMills } from '@/lib/data/abortion-mills';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abolishabortionmichigan.com';

export const metadata: Metadata = {
  title: 'Every Abortion Facility in Michigan — Statewide Map',
  description:
    'A statewide map and directory of every currently-operating abortion facility in Michigan. For prayer, education, and lawful peaceful presence.',
  alternates: { canonical: '/abortion-mills' },
  openGraph: {
    title: 'Every Abortion Facility in Michigan',
    description: 'Statewide map of MI abortion providers, grouped by operator.',
    type: 'website',
    url: `${BASE_URL}/abortion-mills`,
  },
};

export default function AbortionMillsPage() {
  const all = getAllMills();
  const active = getActiveMills();
  const closed = all.filter((m) => m.closed);

  // Group by operator so the list reads as "these five networks account
  // for every provider in Michigan," not as an undifferentiated list of
  // twenty addresses. Detection is by name-prefix.
  const groups: { label: string; blurb: string; mills: typeof all }[] = [];
  const buckets: Record<string, typeof all> = {
    'Planned Parenthood of Michigan': [],
    'Northland Family Planning': [],
    "Women's Center of Michigan": [],
    "Women's Center (unaffiliated)": [],
    'Other providers': [],
  };
  for (const m of all) {
    if (m.name.startsWith('Planned Parenthood')) buckets['Planned Parenthood of Michigan'].push(m);
    else if (m.name.startsWith('Northland Family Planning')) buckets['Northland Family Planning'].push(m);
    else if (m.name.startsWith("Women's Center of Michigan")) buckets["Women's Center of Michigan"].push(m);
    else if (m.name.startsWith("Women's Center of")) buckets["Women's Center (unaffiliated)"].push(m);
    else buckets['Other providers'].push(m);
  }
  const groupBlurbs: Record<string, string> = {
    'Planned Parenthood of Michigan':
      'The single-largest abortion operator in the state — eight locations across the Lower Peninsula.',
    'Northland Family Planning':
      'Three metro-Detroit locations. Southfield is the largest single-provider abortion facility in Michigan.',
    "Women's Center of Michigan":
      'A three-location network in Wayne, Macomb, and Oakland counties.',
    "Women's Center (unaffiliated)":
      'Standalone "Women’s Center" facilities in Flint and Saginaw serving mid-Michigan.',
    'Other providers':
      'Independent providers, including Detroit’s Summit and Scotsdale Women’s Centers.',
  };
  for (const label of Object.keys(buckets)) {
    const ms = buckets[label];
    if (ms.length > 0) groups.push({ label, blurb: groupBlurbs[label] ?? '', mills: ms });
  }

  // Cities served counts only ACTIVE facilities — a shuttered clinic in
  // a city we no longer serve shouldn't inflate the number.
  const cityCount = new Set(active.map((m) => m.city)).size;

  // Schema.org: WebPage + BreadcrumbList (via <Breadcrumbs/>) + ItemList
  // of every mill as a HealthAndBeautyBusiness so search results treat
  // each pin as a real, addressable place.
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Every Abortion Facility in Michigan',
    url: `${BASE_URL}/abortion-mills`,
    about: { '@type': 'Place', name: 'Michigan' },
  };
  // ItemList schema — only ACTIVE facilities. Closed clinics are still
  // rendered in the visible list (with a Closed badge) but shouldn't be
  // fed to Google as a live business entity.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: active.length,
    itemListElement: active.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'MedicalBusiness',
        name: m.name,
        address: m.address,
        telephone: m.phone || undefined,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: m.latitude,
          longitude: m.longitude,
        },
        areaServed: { '@type': 'State', name: 'Michigan' },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="relative text-white py-20 md:py-28 bg-gradient-to-br from-[#1a1a1a] via-[#1c1618] to-[#2a1010] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(220,38,38,0.15), transparent 55%), radial-gradient(circle at 80% 80%, rgba(220,38,38,0.10), transparent 55%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">
            Statewide directory
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Every Abortion Facility in Michigan
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            {active.length} currently-operating abortion facilities across {cityCount}{' '}
            Michigan cities. For prayer, education, and lawful, peaceful presence.
          </p>
          {closed.length > 0 && (
            <p className="text-sm text-gray-400 max-w-2xl mx-auto mt-3">
              {closed.length} additional location{closed.length === 1 ? '' : 's'} recently closed —
              still listed below for the historical record.
            </p>
          )}
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Abortion Facilities in Michigan' }]} />

      <section className="bg-white pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Active facilities" value={active.length} />
            <StatBox label="Cities served" value={cityCount} />
            <StatBox
              label="PPMI locations"
              value={buckets['Planned Parenthood of Michigan'].filter((m) => !m.closed).length}
            />
            <StatBox
              label="Non-PP providers"
              value={active.length - buckets['Planned Parenthood of Michigan'].filter((m) => !m.closed).length}
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <MillsMap mills={all} />
        </div>
      </section>

      <section className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Grouped by provider network
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Every abortion facility currently operating in Michigan, grouped by
            the operator behind it. Click a city name to see that city&apos;s
            legislators, its Prop 3 vote, its historic abolition context, and
            the local action steps to take.
          </p>
          <div className="space-y-8">
            {groups.map((g) => (
              <div key={g.label}>
                <h3 className="text-lg md:text-xl font-bold text-red-700 mb-1">
                  {g.label}{' '}
                  <span className="text-gray-500 font-normal text-sm">
                    ({g.mills.length}{' '}
                    {g.mills.length === 1 ? 'location' : 'locations'})
                  </span>
                </h3>
                {g.blurb && (
                  <p className="text-sm text-gray-600 mb-3">{g.blurb}</p>
                )}
                <ul className="grid gap-3 sm:grid-cols-2">
                  {g.mills.map((m) => {
                    const gmapsUrl =
                      m.googleBusinessUrl ||
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.name}, ${m.address}`)}`;
                    // Prefer sending the reader to the city page for
                    // full context rather than to a bare Google Business
                    // profile. The city slug is a lowercase kebab of
                    // the city name — mirror the lib/data/cities.ts
                    // slugging convention.
                    const citySlug = m.city
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .trim()
                      .replace(/\s+/g, '-');
                    return (
                      <li
                        key={m.id}
                        className={`border rounded-lg p-4 bg-white ${
                          m.closed ? 'border-gray-300 opacity-75' : 'border-gray-200'
                        }`}
                      >
                        <p className="font-semibold text-gray-900 flex flex-wrap items-center gap-2">
                          <span className={m.closed ? 'line-through decoration-2 decoration-gray-500' : ''}>
                            {m.name}
                          </span>
                          {m.closed && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gray-800 text-white">
                              Closed{m.closedOn ? ' ' + m.closedOn : ''}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 font-mono break-words mt-1">
                          {m.address}
                        </p>
                        {m.closureReason && (
                          <p className="text-xs text-gray-700 italic mt-2 border-l-2 border-gray-500 pl-2">
                            {m.closureReason}
                          </p>
                        )}
                        {m.notes && !m.closed && (
                          <p className="text-xs text-gray-500 italic mt-2">
                            {m.notes}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <Link
                            href={`/cities/${citySlug}`}
                            className="text-red-700 underline hover:no-underline font-semibold"
                          >
                            {m.city}{' '}page &rarr;
                          </Link>
                          <a
                            href={gmapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 underline hover:text-red-700"
                          >
                            Google Business
                          </a>
                          {m.phone && (
                            <a
                              href={`tel:${m.phone.replace(/[^0-9+]/g, '')}`}
                              className="text-gray-600 hover:text-red-700"
                            >
                              {m.phone}
                            </a>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-3">
            Peaceful, lawful presence — always
          </h2>
          <p className="text-gray-800 mb-4">
            Abolish Abortion Michigan is committed to nonviolence and to lawful
            conduct at every facility. Presence at an abortion mill is a
            ministry of prayer, education, and offered help — never coercion,
            never property damage, never confrontation with staff or clients
            that crosses into harassment. Read our full{' '}
            <Link href="/non-violence-statement" className="text-red-700 underline">
              non-violence statement
            </Link>
            {' '}before organizing any activity at these locations.
          </p>
          <p className="text-sm text-gray-600">
            If a facility on this list has closed, moved, or you know of a
            location we&apos;ve missed,{' '}
            <Link href="/contact" className="text-red-700 underline">
              please let us know
            </Link>
            {' '}so we can keep the record accurate.
          </p>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border-l-4 border-red-600 p-4 rounded-r shadow-sm">
      <div className="text-3xl font-black tabular-nums text-gray-900">
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-gray-500 mt-1 font-semibold">
        {label}
      </div>
    </div>
  );
}
