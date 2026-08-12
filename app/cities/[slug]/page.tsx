import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import {
  getCityBySlug,
  getAllCitySlugs,
  getNearbyCities,
  districtLabel,
  type CityFaq,
} from '@/lib/data/cities';
import { getMillsByMunicipality } from '@/lib/data/abortion-mills';
import { getChurchesByCity } from '@/lib/data/abolitionist-churches';
import { getCountyHistory, getAbortionContext, getFrcaRollCall } from '@/lib/data/nj-context';
import { FRCA, formatVoteDate, partyLabel, voteStyle } from '@/lib/data/legislators';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }));
}

/**
 * Any slug not returned above is a hard 404.
 *
 * Without this, Next renders unknown slugs on demand; `notFound()` produces the
 * 404 *page* but the response still carries **HTTP 200**. That is a soft 404 —
 * search engines treat it as a real page, and the whole 50-city dataset would
 * otherwise expose a valid-looking URL for every municipality we have not
 * written yet. The complete set of cities is known at build time, so there is
 * nothing to render on demand.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return { title: 'City not found' };
  const title = `${city.formalName}, NJ — Your Legislators and Their Abortion Record`;
  const description =
    `Who represents ${city.formalName} in the New Jersey Legislature, how each of them voted on the ` +
    `Freedom of Reproductive Choice Act, and what operates in ${city.county} County.`;
  return {
    title,
    description,
    alternates: { canonical: `/cities/${city.slug}` },
    openGraph: { title, description, type: 'article', url: `${BASE_URL}/cities/${city.slug}` },
  };
}

/**
 * Renders a plain-text FAQ answer with its linked phrases turned into anchors.
 * The answer stays plain in the JSON-LD, which must not contain markup.
 */
function AnswerWithLinks({ faq }: { faq: CityFaq }) {
  if (!faq.links?.length) return <>{faq.a}</>;
  // Longest phrase first so a short phrase nested inside a longer one does not
  // split it and leave the outer link half-rendered.
  const links = [...faq.links].sort((a, b) => b.phrase.length - a.phrase.length);
  const nodes: React.ReactNode[] = [faq.a];
  links.forEach((l, li) => {
    for (let i = 0; i < nodes.length; i++) {
      const chunk = nodes[i];
      if (typeof chunk !== 'string') continue;
      const at = chunk.indexOf(l.phrase);
      if (at === -1) continue;
      nodes.splice(
        i,
        1,
        chunk.slice(0, at),
        <Link
          key={`${li}-${i}`}
          href={l.href}
          className="text-green-800 underline hover:no-underline"
        >
          {l.phrase}
        </Link>,
        chunk.slice(at + l.phrase.length),
      );
      break;
    }
  });
  return <>{nodes}</>;
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const mills = getMillsByMunicipality(city.name, city.county);
  const churches = getChurchesByCity(city.name);
  const countyHistory = getCountyHistory(city.county);
  const abortion = getAbortionContext();
  const roll = getFrcaRollCall(city.districts);
  const nearby = getNearbyCities(city.slug, 5);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: `${city.formalName}, New Jersey`,
        url: `${BASE_URL}/cities/${city.slug}`,
        about: {
          '@type': 'Place',
          name: `${city.formalName}, New Jersey`,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: city.latitude,
            longitude: city.longitude,
          },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: city.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="bg-[#1a1a1a] text-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Abolition in</span>{' '}
            <span className="font-black uppercase">{city.name}</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            {city.county} County &middot; {city.populationLabel}
          </p>
        </div>
      </section>

      <Breadcrumbs
        items={[{ label: 'Cities', href: '/cities' }, { label: city.formalName }]}
      />

      {/* At a glance */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-black text-gray-900">{city.population.toLocaleString()}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500">Residents</p>
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{city.districts.join(', ')}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {city.districts.length > 1 ? 'Legislative districts' : 'Legislative district'}
            </p>
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{roll.members.length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500">Legislators</p>
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{mills.length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {mills.length === 1 ? 'Abortion facility' : 'Abortion facilities'}
            </p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {city.name} and the long road out of slavery
          </h2>
          {city.historyParagraphs.map((p, i) => (
            <p key={i} className="text-gray-700 mb-4 leading-relaxed">
              {p}
            </p>
          ))}

          {countyHistory && (
            <div className="border-l-4 border-green-700 bg-gray-50 p-6 rounded-r mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{countyHistory.headline}</h3>
              <p className="text-gray-800 text-[0.95rem] leading-relaxed mb-3">
                {countyHistory.paragraph}
              </p>
              <p className="text-xs text-gray-500">
                Source:{' '}
                <a
                  href={countyHistory.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-700"
                >
                  {countyHistory.source}
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Abortion in this city */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Abortion in {city.name} today</h2>

          {/* New Jersey publishes no abortion counts at any geography, so this
              box reports that fact rather than substituting an estimate that
              would read as official. */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-sm uppercase tracking-[0.15em] font-bold text-green-800 mb-3">
              {abortion.reportingGap.headline}
            </h3>
            <p className="text-gray-700 mb-3">{abortion.reportingGap.detail}</p>
            <p className="text-gray-700 mb-3">
              There is no figure for {city.name}, or for {city.county} County, because there is no
              figure for anywhere in New Jersey. The best available independent estimate is{' '}
              <strong>{abortion.statewide.count.toLocaleString()}</strong> abortions provided by
              clinicians statewide in {abortion.statewide.year}.
            </p>
            <p className="text-xs text-gray-500">
              Sources:{' '}
              <a
                href={abortion.reportingGap.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                {abortion.reportingGap.source}
              </a>
              {' · '}
              <a
                href={abortion.statewide.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                {abortion.statewide.source}
              </a>
            </p>
          </div>

          <p className="text-gray-700 mb-6">{city.abortionLandscapeIntro}</p>

          {mills.length > 0 ? (
            <ul className="space-y-4 mb-6">
              {mills.map((m) => (
                <li
                  key={m.id}
                  className="bg-white border-l-4 border-green-700 rounded-r p-5 shadow-sm"
                >
                  <p className="font-bold text-gray-900">{m.name}</p>
                  <p className="text-sm text-gray-600">{m.address}</p>
                  {m.phone && <p className="text-sm text-gray-600">{m.phone}</p>}
                  {m.closed && (
                    <p className="text-sm text-gray-500 italic mt-1">
                      Closed{m.closedOn ? ` ${formatVoteDate(m.closedOn)}` : ''}.
                      {m.closureReason ? ` ${m.closureReason}` : ''}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic mb-6">
              No abortion facility in our directory is located inside {city.formalName}.
            </p>
          )}

          <p className="text-sm text-gray-600">
            <Link href="/abortion-mills" className="text-green-800 underline hover:no-underline">
              Every abortion facility in New Jersey &rarr;
            </Link>
          </p>

          {city.abortionLandscapeOutro && (
            <p className="text-gray-700 mt-6">{city.abortionLandscapeOutro}</p>
          )}
        </div>
      </section>

      {/* Legislators + FRCA roll call */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Who represents {city.name}
          </h2>
          <p className="text-gray-600 mb-6">
            {city.formalName} is in {districtLabel(city.districts)}. New Jersey elects one senator
            and two assembly members from each district, so {roll.members.length} people represent
            this {city.kind === 'city' ? 'city' : 'municipality'} in Trenton.
          </p>

          {/* Legislative District 8 is the one district in the state where not a
              single sitting member has a recorded vote on the Act. Saying so is
              more useful than hiding the block, and it is a fact about turnover,
              not about them. */}
          {!roll.hasAnyRecord && (
            <div className="border-l-4 border-green-700 bg-gray-50 p-6 rounded-r mb-8">
              <h3 className="text-sm uppercase tracking-[0.15em] font-bold text-green-800 mb-3">
                No recorded vote on the {FRCA.title}
              </h3>
              <p className="text-gray-700">
                None of the {roll.members.length} people who represent this district today was
                serving when the Act was voted on in {formatVoteDate(FRCA.date)}. They have no
                record on it either way, and we do not present an absence as a position. Ask them
                where they stand &mdash; their contact details are on their pages below.
              </p>
            </div>
          )}

          {roll.hasAnyRecord && (
            <div className="border-l-4 border-green-700 bg-gray-50 p-6 rounded-r mb-8">
              <h3 className="text-sm uppercase tracking-[0.15em] font-bold text-green-800 mb-3">
                How they voted on the {FRCA.title}
              </h3>
              <div className="flex flex-wrap gap-6 mb-3">
                <div>
                  <span className="text-2xl font-black text-gray-900">{roll.yes}</span>{' '}
                  <span className="text-sm text-gray-600">voted yes</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-gray-900">{roll.no}</span>{' '}
                  <span className="text-sm text-gray-600">voted no</span>
                </div>
                {roll.other > 0 && (
                  <div>
                    <span className="text-2xl font-black text-gray-900">{roll.other}</span>{' '}
                    <span className="text-sm text-gray-600">abstained or did not vote</span>
                  </div>
                )}
                {roll.noRecord > 0 && (
                  <div>
                    <span className="text-2xl font-black text-gray-900">{roll.noRecord}</span>{' '}
                    <span className="text-sm text-gray-600">have no recorded vote</span>
                  </div>
                )}
              </div>
              {roll.noRecord > 0 && (
                <p className="text-sm text-gray-600">
                  &ldquo;No recorded vote&rdquo; means the member was not serving when the bill was
                  voted on in {formatVoteDate(FRCA.date)}. It is not an abstention, and we do not
                  present it as one.
                </p>
              )}
            </div>
          )}

          <ul className="space-y-3">
            {roll.members.map((l) => {
              const v = voteStyle(l.frcaVote);
              return (
                <li
                  key={l.slug}
                  className="border border-gray-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <Link
                      href={`/legislators/${l.slug}`}
                      className="font-bold text-gray-900 hover:text-green-800 hover:underline"
                    >
                      {l.name}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {l.chamber} &middot; District {l.district} &middot; {partyLabel(l.party)}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${v.className}`}>
                    {v.label}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="text-sm text-gray-600 mt-6">
            <Link href="/legislators" className="text-green-800 underline hover:no-underline">
              Every legislator in New Jersey, with contact details &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* Abolitionist churches */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Abolitionist churches in {city.name}
          </h2>
          <p className="text-gray-600 mb-6">
            Congregations we know of in {city.formalName}{' '}
            that have taken a public abolitionist position &mdash; not simply a pro-life one.
          </p>

          {churches.length === 0 ? (
            <div className="border-l-4 border-green-700 bg-white p-6 rounded-r">
              <p className="text-gray-800 mb-3">
                <strong>
                  We are not aware of a publicly abolitionist church in {city.formalName}.
                </strong>{' '}
                We read every New Jersey congregation in the directory we work from &mdash; 106 of
                them &mdash; and found one in the whole state, in Glassboro. Abolitionists Rising,
                the movement&apos;s own national organisation, lists the same single church on its
                New Jersey page and no others. That is not a gap in the research. It is the
                situation.
              </p>
              <p className="text-gray-700">
                If your church has taken a public position on abolition &mdash; from the pulpit, in
                a resolution, or in its own published words &mdash;{' '}
                <Link href="/contact" className="text-green-800 underline hover:no-underline">
                  tell us
                </Link>{' '}
                and we will verify it and list it here.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {churches.map((c) => (
                <li key={c.id} className="bg-white border-l-4 border-green-700 rounded-r p-5">
                  <p className="font-bold text-gray-900">{c.name}</p>
                  {c.denomination && <p className="text-sm text-gray-600">{c.denomination}</p>}
                  <p className="text-sm text-gray-600">{c.address}</p>
                  {c.pastor && <p className="text-sm text-gray-600">{c.pastor}</p>}
                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-800 underline hover:no-underline"
                    >
                      Church website &rarr;
                    </a>
                  )}
                  {/* Where the stance comes from. A church listed by someone else
                      is not the same as a church we have read taking the position
                      in its own words, and the page should not blur the two. */}
                  {c.listedBy && c.stanceBasis !== 'evidenced' && (
                    <p className="text-xs text-gray-500 mt-3 border-t border-gray-200 pt-3">
                      Listed as an abolitionist church by{' '}
                      {c.listedByUrl ? (
                        <a
                          href={c.listedByUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-gray-700"
                        >
                          {c.listedBy}
                        </a>
                      ) : (
                        c.listedBy
                      )}
                      . We have not been able to confirm that position from the church&apos;s own
                      published words, so we pass on the listing and its source rather than
                      vouching for it ourselves.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Take action */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Take action in {city.name}</h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              &middot;{' '}
              <Link href="/the-petition" className="text-green-800 underline hover:no-underline">
                Sign the petition
              </Link>{' '}
              calling for the abolition of abortion in New Jersey.
            </li>
            <li>
              &middot; Contact the {roll.members.length} people who represent this municipality.
              Their office numbers and email addresses are on{' '}
              <Link href="/legislators" className="text-green-800 underline hover:no-underline">
                their pages
              </Link>
              .
            </li>
            <li>
              &middot; Read{' '}
              <Link
                href="/abolition-bills/components"
                className="text-green-800 underline hover:no-underline"
              >
                what a bill of abolition has to contain
              </Link>{' '}
              so you can tell one from a regulation when it appears.
            </li>
            <li>
              &middot;{' '}
              <Link href="/contact" className="text-green-800 underline hover:no-underline">
                Get in touch
              </Link>{' '}
              if you want to help start local work in {city.name}.
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Questions about {city.name}
          </h2>
          <div className="space-y-3">
            {city.faqs.map((f) => (
              <details
                key={f.q}
                className="bg-white border border-gray-200 rounded-lg p-5 group"
              >
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-green-700 group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  <AnswerWithLinks faq={f} />
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby */}
      {nearby.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">Nearby</h2>
            <ul className="flex flex-wrap gap-3">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/cities/${n.slug}`}
                    className="inline-block border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 hover:border-green-700 hover:text-green-800"
                  >
                    {n.name}{' '}
                    <span className="text-gray-500">({Math.round(n.distanceMiles)} mi)</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}
