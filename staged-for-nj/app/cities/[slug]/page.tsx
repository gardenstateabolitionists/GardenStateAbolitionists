import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import { getCityBySlug, getAllCitySlugs, getNearbyCities, type CityFaq } from '@/lib/data/cities';
import { getMillsByCity } from '@/lib/data/abortion-mills';
import { getChurchesByCity } from '@/lib/data/abolitionist-churches';
import { getAllNewsArticles } from '@/lib/data/news-store';
import { CITY_DATA_REFRESHED_ON } from '@/lib/data/data-freshness';
import { getCountyAbortionStats, getCountyUrHistory, getCountyProp3Vote } from '@/lib/data/mi-county-context';
import { socialLinks } from '@/lib/content';
import {
  getLegislators,
  grade,
  gradeBadgeClass,
  partyLabel,
} from '@/lib/data/legislators';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abolishabortionmichigan.com';

export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> | Metadata {
  return params.then(({ slug }) => {
    const city = getCityBySlug(slug);
    if (!city) return { title: 'City not found' };
    return {
      title: `Abolish Abortion in ${city.name} — Take Action`,
      description: `Christian abolitionists in ${city.name}, Michigan working to end abortion. Meet your ${city.name}-area state representative and senator, see their voting record, and join the movement to abolish abortion in Michigan.`,
      alternates: { canonical: `/cities/${slug}` },
      openGraph: {
        title: `Abolish Abortion in ${city.name}`,
        description: `${city.name}, MI abolition — legislator scorecard, action steps, and how to get involved.`,
        type: 'website',
        url: `${BASE_URL}/cities/${slug}`,
      },
    };
  });
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const mills = getMillsByCity(city.name);
  // Per-county context looked up by CityConfig.region (e.g. "Wayne County").
  // Both null-safe — a city whose county isn't in the source file just
  // won't render the callout, no fallback text needed.
  const countyStats = getCountyAbortionStats(city.region);
  const countyUr = getCountyUrHistory(city.region);
  const countyProp3 = getCountyProp3Vote(city.region);
  // All CityConfig rows are Michigan for now — pass 'MI' explicitly
  // so a same-name city in a different state can't accidentally match.
  const churches = getChurchesByCity(city.name, 'MI');
  const nearby = getNearbyCities(slug, 5);
  const legs = getLegislators();

  // City-mention news filter — case-insensitive whole-word match on
  // the city name across title + excerpt + content. Word-boundary
  // regex prevents "Lansing" from matching "Landsing" or similar,
  // and prevents "Warren" from matching "warren-buffett" phrasing.
  const cityMentionRegex = new RegExp(`\\b${city.name.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&')}\\b`, 'i');
  let cityNews: Awaited<ReturnType<typeof getAllNewsArticles>> = [];
  try {
    const all = await getAllNewsArticles(true);
    cityNews = all
      .filter((a) =>
        cityMentionRegex.test(a.title) ||
        cityMentionRegex.test(a.excerpt || '') ||
        cityMentionRegex.test(a.content || '')
      )
      .slice(0, 6);
  } catch {
    cityNews = [];
  }
  const houseReps = city.houseDistricts
    .map((d) => legs.find((l) => l.chamber === 'House' && l.district === d))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));
  const senateReps = city.senateDistricts
    .map((d) => legs.find((l) => l.chamber === 'Senate' && l.district === d))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));
  const allReps = [...houseReps, ...senateReps];
  const passCount = allReps.filter((l) => grade(l) === 'Pass').length;
  const failCount = allReps.length - passCount;

  // "Email all my {city} reps" — pre-drafted mailto: with every rep in
  // BCC (privacy-safe — recipients don't see each other's addresses)
  // and a city-scoped subject + body the reader can edit before
  // sending. Uses \r\n per RFC 6068 for maximum mail-client compat.
  const repEmails = allReps.map((l) => l.email).filter((e): e is string => Boolean(e));
  const emailSubject = `Constituent request: Support the abolition of abortion in Michigan`;
  const emailBody = [
    `Dear Representative/Senator,`,
    ``,
    `I am your constituent in ${city.name}. I am writing to ask you to publicly support the total abolition of abortion in Michigan — an equal-protection bill that treats abortion as homicide, without exception, from the moment of fertilization.`,
    ``,
    `The 2022 Reproductive Freedom for All amendment does not settle this question. It creates a state constitutional right to abortion, but it does not answer whether the smallest human beings deserve equal protection of the law. That is the question I ask you to answer with your vote.`,
    ``,
    `I ask you to: (1) publicly commit to sponsoring or cosponsoring a true equal-protection abolition bill; (2) publicly commit to voting against every incrementalist bill that concedes a legal right to some abortions; and (3) meet with your abolitionist constituents.`,
    ``,
    `Thank you for your service to Michigan.`,
    ``,
    `Sincerely,`,
    `A ${city.name} constituent`,
  ].join('\r\n');
  const mailToAllReps =
    repEmails.length > 0
      ? `mailto:?bcc=${encodeURIComponent(repEmails.join(','))}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      : null;

  // Schema.org: WebPage + NGO (areaServed) + BreadcrumbList + FAQPage.
  // The NGO block with areaServed=Place{city} is the local-SEO
  // load-bearing schema — it tells search we're the organization
  // whose service area covers this specific city. AreaServed on the
  // parent NGO schema (root layout) ties the org to Michigan; this
  // page narrows to the city.
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Abolish Abortion in ${city.name}`,
    url: `${BASE_URL}/cities/${slug}`,
    about: {
      '@type': 'Place',
      name: `${city.name}, Michigan`,
      containedInPlace: { '@type': 'AdministrativeArea', name: city.region },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Cities', item: `${BASE_URL}/cities` },
        { '@type': 'ListItem', position: 3, name: city.name, item: `${BASE_URL}/cities/${slug}` },
      ],
    },
  };
  const ngoSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Abolish Abortion Michigan',
    url: BASE_URL,
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: [
        { '@type': 'AdministrativeArea', name: city.region },
        { '@type': 'State', name: 'Michigan' },
      ],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: city.latitude,
        longitude: city.longitude,
      },
    },
    mission:
      `Advocating for the immediate, total abolition of abortion in ${city.name} and across the state of Michigan.`,
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ngoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero — subtle radial + linear gradient so cities feel distinct
          from flat #1a1a1a everywhere else. Warm dark → deep-red bottom-
          right, evoking the site's red accent without being loud. */}
      <section className="relative text-white py-24 md:py-32 bg-gradient-to-br from-[#1a1a1a] via-[#1c1618] to-[#2a1010] overflow-hidden">
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
            {city.region} · {city.populationLabel}
          </p>
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Abolish Abortion in</span>{' '}
            <span className="font-black">{city.name.toUpperCase()}</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Immediate, total abolition — no exceptions
          </p>
        </div>
      </section>

      <Breadcrumbs
        items={[{ label: 'Cities', href: '/cities' }, { label: city.name }]}
      />

      {/* At-a-glance scorecard box */}
      <section className="bg-white pt-10 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Local legislators" value={allReps.length} />
            <StatBox label="Passing on abolition" value={passCount} tone={passCount > 0 ? 'green' : 'neutral'} />
            <StatBox label="Failing" value={failCount} tone="red" />
            <StatBox label="House districts" value={city.houseDistricts.length} />
          </div>
        </div>
      </section>

      {/* History section — grounds the page in real, local, factual content
          that isn't duplicated on any other city page. Also good for E-E-A-T. */}
      <section className="bg-white py-10">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray">
          <h2 className="text-3xl">{city.name}&apos;s abolitionist inheritance</h2>
          {city.historyParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {countyUr && (
            <aside className="not-prose my-6 border-l-4 border-red-600 bg-red-50/60 p-5 rounded-r">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-red-700 mb-1">
                Regional heritage · {city.region}
              </p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{countyUr.headline}</h3>
              <p className="text-gray-800 text-[0.95rem] leading-relaxed">{countyUr.paragraph}</p>
            </aside>
          )}
          {slug === 'detroit' && (
            <p>
              <Link
                href="/cities/detroit/underground-railroad"
                className="text-red-700 underline font-semibold"
              >
                Read the full history of Detroit and the Underground Railroad &rarr;
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-10 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Abortion in {city.name} today</h2>
          <p className="text-gray-800 mb-6">{city.abortionLandscapeIntro}</p>
          {countyStats && (
            <div className="mb-6 bg-white border-l-4 border-red-600 rounded-r p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-red-700 mb-2">
                State-reported deaths · {countyStats.county} County · {countyStats.year}
              </p>
              <div className="flex flex-col items-center text-center gap-1 sm:flex-row sm:items-baseline sm:text-left sm:gap-3 mb-2">
                <span className="text-5xl sm:text-4xl font-black tabular-nums text-gray-900 leading-none">
                  {countyStats.count.toLocaleString()}
                </span>
                <span className="text-gray-700">
                  induced abortions to {countyStats.county} County residents
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Michigan reported <strong>{countyStats.statewideTotal.toLocaleString()}</strong>
                {' '}induced abortions statewide in {countyStats.year} — a documented rise
                since the 2022 Reproductive Freedom for All amendment. The number above
                counts only Michigan residents of {countyStats.county} County; it does not
                include out-of-state travelers or self-managed abortions at home.
              </p>
              <p className="text-xs text-gray-500">
                Source:{' '}
                <a
                  href={countyStats.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-red-700"
                >
                  MI DHHS Vital Records — Abortion Statistics, Table 2A
                </a>
              </p>
            </div>
          )}
          {countyProp3 && (
            <div className="mb-6 bg-white border-l-4 border-gray-800 rounded-r p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700 mb-2">
                Prop 3 vote · {countyProp3.county} County · 2022
              </p>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 mb-3">
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="text-4xl font-black tabular-nums text-gray-900 leading-none">
                    {countyProp3.yesPct.toFixed(1)}%
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wide text-red-700">
                    Yes
                  </span>
                </div>
                <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-2 sm:mt-0">
                  <span className="text-2xl font-black tabular-nums text-gray-700 leading-none">
                    {countyProp3.noPct.toFixed(1)}%
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    No
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                {countyProp3.yesWon ? (
                  <>
                    A majority of {countyProp3.county} County voters approved
                    Proposal 22-3, the Reproductive Freedom for All amendment.
                    Statewide, it passed <strong>{countyProp3.statewideYesPct}%</strong>
                    {' '}to <strong>{countyProp3.statewideNoPct}%</strong>. A majority
                    vote does not settle whether preborn image-bearers deserve equal
                    protection under the law — that is a moral question the ballot cannot
                    answer, and it is exactly the question the abolition movement
                    asks Michigan to reopen.
                  </>
                ) : (
                  <>
                    A majority of {countyProp3.county} County voters
                    {' '}<strong>rejected</strong> Proposal 22-3 — the
                    Reproductive Freedom for All amendment. Statewide it passed
                    {' '}{countyProp3.statewideYesPct}% to {countyProp3.statewideNoPct}%,
                    but {countyProp3.county} County did not go along. That local
                    majority is the moral and political foundation for the equal-protection
                    legislation abolitionists ask your representatives to sponsor.
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500">
                Source: MI Dept. of State certified canvass, aggregated by the AP.{' '}
                <a
                  href={countyProp3.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-red-700"
                >
                  See full county map.
                </a>
              </p>
            </div>
          )}
          {mills.length > 0 && (
            <>
              <h3 className="text-sm uppercase tracking-[0.15em] font-bold text-red-700 mb-3">
                Places to peacefully protest against child sacrifice
              </h3>
              <ol className="mb-6 space-y-2">
                {mills.map((m, i) => {
                  const gmapsUrl =
                    m.googleBusinessUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.name}, ${m.address}`)}`;
                  return (
                    <li
                      key={m.id}
                      className={`flex gap-3 items-start bg-white border rounded p-3 ${
                        m.closed ? 'border-gray-300 opacity-75' : 'border-gray-200'
                      }`}
                    >
                      <span className="text-red-600 font-bold tabular-nums pt-0.5">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
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
                        <p className="text-sm text-gray-600 font-mono break-words">{m.address}</p>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          {m.phone && (
                            <a
                              href={`tel:${m.phone.replace(/[^0-9+]/g, '')}`}
                              className="text-gray-600 hover:text-red-700"
                            >
                              {m.phone}
                            </a>
                          )}
                          {m.email && (
                            <a
                              href={`mailto:${m.email}`}
                              className="text-gray-600 hover:text-red-700 break-all"
                            >
                              {m.email}
                            </a>
                          )}
                          <a
                            href={gmapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-700 underline hover:no-underline"
                          >
                            Google Business &rarr;
                          </a>
                        </div>
                        {m.closureReason && (
                          <p className="text-xs text-gray-700 italic mt-1 border-l-2 border-gray-500 pl-2">
                            {m.closureReason}
                          </p>
                        )}
                        {m.notes && !m.closed && (
                          <p className="text-xs text-gray-500 italic mt-1">{m.notes}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
          {city.abortionLandscapeOutro && (
            <p className="text-gray-800">{city.abortionLandscapeOutro}</p>
          )}
          <p className="text-xs text-gray-500 mt-4">
            Abolish Abortion Michigan is committed to{' '}
            <Link href="/non-violence-statement" className="text-red-700 underline">
              non-violent, lawful presence
            </Link>
            {' '}at abortion facilities. See{' '}
            <Link href="/abortion-mills" className="text-red-700 underline font-semibold">
              every MI facility on the statewide map &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* Legislator list — the load-bearing local-SEO block. Each rep links
          to their full scorecard profile, which is itself a static SSG page. */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {city.name}&apos;s Michigan legislators
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            The MI state representatives and senators whose districts cover
            {' '}{city.name}. Click a name to see their full record, contact info,
            and abolition-related votes.
          </p>

          <RepGroup title="State House" reps={houseReps} />
          <div className="mt-8">
            <RepGroup title="State Senate" reps={senateReps} />
          </div>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-gray-900 mb-1">Not sure which district you&apos;re in?</h3>
            <p className="text-sm text-gray-700 mb-3">
              Enter your {city.name}{' '}ZIP code (or full address) on the
              scorecard and we&apos;ll show you your exact House and Senate
              representative.
            </p>
            <Link
              href="/legislators"
              className="inline-block px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
            >
              Find my representative &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Abolitionist churches — pulled from the NXR church-directory
          Reformed / postmillennial subset. When empty for a city we
          intentionally render an "unaware" callout rather than hiding
          the section — an honest gap is more useful than silence, and
          it invites the reader to fill it in. */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Abolitionist churches in {city.name}
          </h2>
          {/* Also update the empty-state callout text (line ~50-60 below):
              was "publicly-abolitionist Reformed churches" — now just
              "publicly-abolitionist churches" per user feedback. */}
          <p className="text-sm text-gray-600 mb-6">
            Publicly-abolitionist churches we know of in the {city.name}{' '}area.
            If your church has adopted an abolition resolution and belongs
            here,{' '}
            <Link href="/contact" className="text-red-700 underline">
              let us know
            </Link>
            .
          </p>

          {churches.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
              <p className="text-gray-800">
                <strong>We&apos;re not aware of any publicly-abolitionist
                churches inside {city.name}{' '}at this time.</strong> If you
                attend a {city.name}-area church that has taken a public stand
                for abolition — or would be open to adopting the model abolition
                resolution — please{' '}
                <Link href="/contact" className="text-red-700 underline">
                  reach out
                </Link>
                . We&apos;ll add them here and connect you with resources for
                your pastor.
              </p>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-3">
              {churches.map((c) => (
                <li
                  key={c.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-red-600 transition-colors bg-white"
                >
                  <p className="font-bold text-gray-900">{c.name}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mt-1">
                    {c.denomination}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{c.address}</p>
                  {c.pastor && (
                    <p className="text-sm text-gray-600">Pastor: {c.pastor}</p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                    {c.phone && (
                      <a
                        href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-gray-600 hover:text-red-700"
                      >
                        {c.phone}
                      </a>
                    )}
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="text-gray-600 hover:text-red-700 break-all"
                      >
                        {c.email}
                      </a>
                    )}
                  </div>
                  {c.website && (
                    <div className="mt-1 text-sm">
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-700 underline hover:no-underline font-semibold"
                      >
                        Church Website &rarr;
                      </a>
                    </div>
                  )}
                  {c.ministries && c.ministries.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                      {c.ministries.map((m) => (
                        <a
                          key={m.url}
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-700 underline hover:no-underline"
                          title={m.description || undefined}
                        >
                          {m.name} &rarr;
                        </a>
                      ))}
                    </div>
                  )}
                  {c.notes && (
                    <p className="text-xs text-gray-500 italic mt-2">{c.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Take-action block */}
      <section className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Take action in {city.name}</h2>
          <ol className="space-y-4 list-decimal pl-6 text-gray-800">
            <li>
              <strong>Sign the petition.</strong>{' '}
              Michigan needs a public record of its citizens who reject the
              pretense that abortion access is settled law.{' '}
              <Link href="/the-petition" className="text-red-700 underline">Add your name.</Link>
            </li>
            <li>
              <strong>Contact your {city.name}-area legislator.</strong>{' '}
              Every rep above has their capitol email on file — a two-minute
              email is more than most constituents ever send. Use the
              pre-drafted template on each{' '}
              <Link href="/legislators" className="text-red-700 underline">
                legislator&apos;s profile page
              </Link>
              , or{' '}
              {mailToAllReps ? (
                <a href={mailToAllReps} className="text-red-700 underline font-semibold">
                  email all {allReps.length} of your {city.name} reps at once
                </a>
              ) : (
                <span>email all reps at once (no addresses on file)</span>
              )}
              .
            </li>
            <li>
              <strong>Bring the resolution to your church.</strong>{' '}
              If you attend a {city.name}-area church, ask your pastor to
              consider signing the abolitionist resolution.{' '}
              <Link href="/contact" className="text-red-700 underline">
                Contact us
              </Link>
              {' '}for the model text and to walk through it with your pastor.
            </li>
            <li>
              <strong>Give.</strong>{' '}
              The work — legislative research, petition drives, church
              outreach, this website — runs on the sacrificial giving of
              ordinary abolitionists.{' '}
              <Link href="/donate" className="text-red-700 underline">Support the mission.</Link>
            </li>
          </ol>
        </div>
      </section>

      {/* Connect-locally callout — dedicated Signal-group invite so
          {city.name}-area visitors have a low-friction path from
          "I care about this" to "I'm in a group chat with real
          abolitionists." Kept as its own section (not another list
          item) because it's a real people-to-people ask, not just
          another task on the list. */}
      <section className="bg-white py-10 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-[#1a1a1a] text-white rounded-lg p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Connect with abolitionists near {city.name}
            </h2>
            <p className="text-gray-300 mb-5 max-w-xl mx-auto">
              If you want to get involved with someone local, join our
              Signal group — it&apos;s where {city.name}-area abolitionists
              coordinate outreach, share prayer requests, and organize.
            </p>
            <a
              href={socialLinks.signalGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.508.443a11.94 11.94 0 0 1 4.984 0l-.226 1.05a10.864 10.864 0 0 0-4.533 0L9.508.443zM12 6a6 6 0 0 0-5.318 8.778l-.798 2.667a.532.532 0 0 0 .67.67l2.668-.798A6 6 0 1 0 12 6z" />
              </svg>
              Join the Signal group
            </a>
          </div>
        </div>
      </section>

      {/* FAQ — powers the FAQPage schema above; kept as real <details>
          so it works without JS and gets crawled by search. */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {city.name} FAQ
          </h2>
          <div className="space-y-3">
            {city.faqs.map((f) => (
              <details
                key={f.q}
                className="border border-gray-200 rounded-lg p-4 group"
              >
                <summary className="cursor-pointer font-semibold text-gray-900 list-none flex justify-between items-center">
                  <span>{f.q}</span>
                  <span className="text-red-600 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-gray-700 mt-3">
                  <FaqAnswer faq={f} />
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {cityNews.length > 0 && (
        <section className="bg-gray-50 py-10 border-y border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Recent {city.name}-mentioning coverage
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              News and analysis from Abolish Abortion Michigan that mentions {city.name}.
            </p>
            <ul className="space-y-3">
              {cityNews.map((a) => (
                <li key={a.slug} className="border-l-4 border-red-600 bg-white p-4 rounded-r">
                  <Link
                    href={`/news/${a.slug}`}
                    className="font-semibold text-gray-900 hover:text-red-700"
                  >
                    {a.title}
                  </Link>
                  {a.excerpt && (
                    <p className="text-sm text-gray-600 mt-1">{a.excerpt}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="bg-white py-10 border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Nearby Michigan cities we cover
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/cities/${n.slug}`}
                    className="block border border-gray-200 rounded-lg p-3 hover:border-red-600 transition-colors"
                  >
                    <p className="font-semibold text-gray-900">{n.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {n.distanceMiles < 10
                        ? `${n.distanceMiles.toFixed(1)} mi away`
                        : `${Math.round(n.distanceMiles)} mi away`}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Further reading — internal cross-links to the theological
          pillars of the abolition case, so every city page acts as an
          entry point into the deeper /what-we-believe library. */}
      <section className="bg-white py-10 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Further reading</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm">
            <li>
              <Link href="/what-we-believe/abolitionist-not-pro-life" className="block border border-gray-200 rounded-lg p-3 hover:border-red-600 transition-colors">
                <strong className="text-gray-900">Abolitionist, not pro-life.</strong>{' '}
                <span className="text-gray-600">Why the abolition position rejects the incrementalist strategy.</span>
              </Link>
            </li>
            <li>
              <Link href="/what-we-believe/immediate-not-gradual" className="block border border-gray-200 rounded-lg p-3 hover:border-red-600 transition-colors">
                <strong className="text-gray-900">Immediate, not gradual.</strong>{' '}
                <span className="text-gray-600">Why the abolition of abortion cannot wait for public opinion.</span>
              </Link>
            </li>
            <li>
              <Link href="/what-we-believe/no-exceptions" className="block border border-gray-200 rounded-lg p-3 hover:border-red-600 transition-colors">
                <strong className="text-gray-900">No exceptions.</strong>{' '}
                <span className="text-gray-600">Why rape, incest, and life-of-the-mother exceptions concede the case.</span>
              </Link>
            </li>
            <li>
              <Link href="/what-we-believe/criminalization" className="block border border-gray-200 rounded-lg p-3 hover:border-red-600 transition-colors">
                <strong className="text-gray-900">Criminalization.</strong>{' '}
                <span className="text-gray-600">Why treating abortion as homicide follows from equal protection.</span>
              </Link>
            </li>
            <li>
              <Link href="/what-we-believe/biblical-not-secular" className="block border border-gray-200 rounded-lg p-3 hover:border-red-600 transition-colors">
                <strong className="text-gray-900">Biblical, not secular.</strong>{' '}
                <span className="text-gray-600">Why the abolition case is grounded in Scripture, not merely policy.</span>
              </Link>
            </li>
            <li>
              <Link href="/abolition-bills" className="block border border-gray-200 rounded-lg p-3 hover:border-red-600 transition-colors">
                <strong className="text-gray-900">Abolition bills.</strong>{' '}
                <span className="text-gray-600">The current Michigan legislation abolitionists support.</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <CTABanner />

      {/* Last-updated footer — sits after CTA so it doesn't compete
          for attention but reassures readers the page is maintained. */}
      <div className="bg-gray-50 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {city.name} page last updated {CITY_DATA_REFRESHED_ON} · datasets from{' '}
          <Link href="/legislators" className="underline hover:text-red-700">legislator scorecard</Link>
          {' '}and{' '}
          <Link href="/partners" className="underline hover:text-red-700">state partner directory</Link>
        </p>
      </div>
    </>
  );
}

/**
 * Render a FAQ answer with inline links wired up from f.links.
 * The plain-text `a` field stays intact (used for FAQPage schema);
 * this function walks the string once and replaces each configured
 * phrase with a rendered link. Phrases are matched case-sensitively
 * and in the order given, so put more-specific phrases first if
 * they overlap.
 *
 * Special href: `signal:group` resolves to socialLinks.signalGroup
 * so the data file doesn't have to hardcode the Signal URL.
 */
function FaqAnswer({ faq }: { faq: CityFaq }) {
  if (!faq.links || faq.links.length === 0) {
    return <>{faq.a}</>;
  }
  // Build one segmented render of the answer.
  const pieces: (string | { text: string; href: string; external: boolean })[] = [faq.a];
  for (const link of faq.links) {
    const resolvedHref = link.href === 'signal:group' ? socialLinks.signalGroup : link.href;
    const external = resolvedHref.startsWith('http') || resolvedHref.startsWith('signal:');
    const next: typeof pieces = [];
    for (const piece of pieces) {
      if (typeof piece !== 'string') {
        next.push(piece);
        continue;
      }
      const idx = piece.indexOf(link.phrase);
      if (idx === -1) {
        next.push(piece);
        continue;
      }
      if (idx > 0) next.push(piece.slice(0, idx));
      next.push({ text: link.phrase, href: resolvedHref, external });
      const rest = piece.slice(idx + link.phrase.length);
      if (rest) next.push(rest);
    }
    pieces.length = 0;
    pieces.push(...next);
  }
  return (
    <>
      {pieces.map((piece, i) => {
        if (typeof piece === 'string') return <span key={i}>{piece}</span>;
        return piece.external ? (
          <a
            key={i}
            href={piece.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-700 underline hover:no-underline"
          >
            {piece.text}
          </a>
        ) : (
          <Link
            key={i}
            href={piece.href}
            className="text-red-700 underline hover:no-underline"
          >
            {piece.text}
          </Link>
        );
      })}
    </>
  );
}

function StatBox({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: number;
  tone?: 'green' | 'red' | 'neutral';
}) {
  const border =
    tone === 'green'
      ? 'border-green-700'
      : tone === 'red'
        ? 'border-red-600'
        : 'border-gray-300';
  return (
    <div className={`bg-white border-l-4 ${border} p-4 rounded-r shadow-sm`}>
      <div className="text-3xl font-black tabular-nums text-gray-900">{value}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500 mt-1 font-semibold">
        {label}
      </div>
    </div>
  );
}

function RepGroup({
  title,
  reps,
}: {
  title: string;
  reps: ReturnType<typeof getLegislators>;
}) {
  if (reps.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
        {title}
      </h3>
      <ul className="grid sm:grid-cols-2 gap-3">
        {reps.map((l) => {
          const g = grade(l);
          return (
            <li key={l.slug}>
              <Link
                href={`/legislators/${l.slug}`}
                className="block border border-gray-200 rounded-lg p-3 hover:border-red-600 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                      District {l.district} · {partyLabel(l.party)[0]}
                    </p>
                    <p className="font-semibold text-gray-900">{l.name}</p>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${gradeBadgeClass(g)}`}
                  >
                    {g}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
