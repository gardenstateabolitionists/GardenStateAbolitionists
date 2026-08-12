import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import ContactLetter from '@/components/legislators/ContactLetter';
import LegislatorPhoto from '@/components/legislators/LegislatorPhoto';
import {
  getLegislators,
  getLegislatorBySlug,
  getLegislatorsByDistrict,
  partyLabel,
  voteStyle,
  FRCA,
  formatVoteDate,
} from '@/lib/data/legislators';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

export function generateStaticParams() {
  return getLegislators().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const l = getLegislatorBySlug(slug);
  if (!l) return { title: 'Legislator Not Found' };
  const role = l.chamber === 'Senate' ? 'Senator' : 'Assembly Member';
  return {
    title: `${l.name} — ${role}, District ${l.district}`,
    description: `Contact ${role} ${l.name} (${partyLabel(l.party)}, New Jersey Legislative District ${l.district}) and see how they voted on the Freedom of Reproductive Choice Act.`,
    alternates: { canonical: `/legislators/${l.slug}` },
    openGraph: {
      title: `${l.name} — New Jersey District ${l.district}`,
      type: 'profile',
      url: `${BASE_URL}/legislators/${l.slug}`,
    },
  };
}

export default async function LegislatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = getLegislatorBySlug(slug);
  if (!l) notFound();

  const role = l.chamber === 'Senate' ? 'Senator' : 'Assembly Member';
  const vote = voteStyle(l.frcaVote);
  const colleagues = getLegislatorsByDistrict(l.district).filter((c) => c.slug !== l.slug);

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: l.name,
    jobTitle: `${role}, New Jersey Legislative District ${l.district}`,
    url: `${BASE_URL}/legislators/${l.slug}`,
    ...(l.email ? { email: l.email } : {}),
    ...(l.photo ? { image: l.photo } : {}),
    affiliation: { '@type': 'GovernmentOrganization', name: 'New Jersey Legislature' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {l.photo && <LegislatorPhoto src={l.photo} alt={l.name} />}
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-2">{l.name}</h1>
              <p className="text-gray-300">
                {role} &middot; {partyLabel(l.party)} &middot; Legislative District {l.district}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Your Legislators', href: '/legislators' },
          { label: l.name },
        ]}
      />

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <dl className="bg-gray-50 border border-gray-200 rounded-lg p-6 grid sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
            {l.email && (
              <div>
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Email</dt>
                <dd className="text-gray-900">
                  <a href={`mailto:${l.email}`} className="text-green-800 underline hover:no-underline break-all">
                    {l.email}
                  </a>
                </dd>
              </div>
            )}
            {l.districtPhone && (
              <div>
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">District office</dt>
                <dd className="text-gray-900">
                  <a href={`tel:${l.districtPhone.replace(/[^\d]/g, '')}`} className="text-green-800 underline hover:no-underline">
                    {l.districtPhone}
                  </a>
                </dd>
              </div>
            )}
            {l.districtAddress && (
              <div className="sm:col-span-2">
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Office address</dt>
                <dd className="text-gray-900">{l.districtAddress}</dd>
              </div>
            )}
            {l.officialUrl && (
              <div className="sm:col-span-2">
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Official page</dt>
                <dd>
                  <a
                    href={l.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-800 underline hover:no-underline break-all"
                  >
                    {l.officialUrl}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <h2 className="text-2xl font-bold mb-4">Voting record</h2>
          <div className="border border-gray-200 rounded-lg p-6 mb-4">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="font-semibold text-gray-900">{FRCA.title}</span>
              <span className="text-sm text-gray-600">({FRCA.bill})</span>
              <span className={`text-sm px-3 py-1 rounded border ${vote.className}`}>{vote.label}</span>
            </div>
            <p className="text-gray-700 text-sm">
              {l.frcaVote ? (
                <>
                  {l.frcaChamber && l.frcaChamber !== l.chamber && (
                    <>
                      Cast while serving in the {l.frcaChamber}; {l.name.split(' ').slice(-1)[0]}{' '}
                      has since moved to the {l.chamber}.{' '}
                    </>
                  )}
                  Final passage on{' '}
                  {formatVoteDate(FRCA.date)}
                  , which wrote abortion access into New Jersey statute. The vote was{' '}
                  {FRCA.senate} in the Senate and {FRCA.assembly} in the Assembly.
                </>
              ) : (
                <>
                  {l.name} was <strong>not serving</strong> when this vote was taken in January
                  2022, so there is no record to report. That is not an abstention. The useful
                  thing here is to ask where they stand — the contact details are above.
                </>
              )}
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-10">
            This is the only substantive abortion vote in the recent record. New Jersey has no
            bill of abolition and no equal-protection bill, so there is nothing else to score.{' '}
            <Link href="/abolition-bills" className="text-green-800 underline hover:no-underline">
              Why that is
            </Link>
          </p>

          {l.committees.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-4">Committee assignments</h2>
              <ul className="mb-4 divide-y divide-gray-200 border border-gray-200 rounded-lg">
                {l.committees.map((c) => (
                  <li key={c.name} className="px-4 py-3 flex flex-wrap items-center gap-x-3">
                    <span className="font-semibold text-gray-900">{c.name}</span>
                    {c.role !== 'member' && (
                      <span className="text-sm px-2 py-0.5 rounded border bg-gray-100 text-gray-700 border-gray-200 capitalize">
                        {c.role}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mb-10">
                Committees are where most bills live or die, so a chair has more say over
                whether something is ever heard than a floor vote suggests. Source: Open
                States.
              </p>
            </>
          )}

          {/* Hidden entirely when the counts are unknown — a 0 here would read as
              "sponsored nothing", which is a claim we would not be making. */}
          {l.sponsorships !== null && (
            <>
              <h2 className="text-2xl font-bold mb-4">Legislative activity</h2>
              <div className="mb-4 grid sm:grid-cols-2 gap-4">
                <div className="text-center bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="text-4xl font-bold text-green-800 mb-1">{l.sponsorships}</div>
                  <div className="text-gray-600 text-sm">Bills sponsored</div>
                </div>
                {l.cosponsorships !== null && (
                  <div className="text-center bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="text-4xl font-bold text-green-800 mb-1">{l.cosponsorships}</div>
                    <div className="text-gray-600 text-sm">Bills cosponsored</div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-10">
                Current session only (2026&ndash;2027), all subjects &mdash; not a career
                total, and not a measure of whether any of it was good. It is a rough gauge
                of how active a member is, which is worth knowing before you write. Source:
                Open States.
              </p>
            </>
          )}

          <h2 className="text-2xl font-bold mb-4">Write to {l.name}</h2>
          <ContactLetter legislator={l} />

          {colleagues.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mt-12 mb-4">
                Also representing District {l.district}
              </h2>
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                {colleagues.map((c) => (
                  <li key={c.slug} className="px-4 py-3 flex flex-wrap items-center gap-x-3">
                    <Link href={`/legislators/${c.slug}`} className="font-semibold text-green-800 underline hover:no-underline">
                      {c.name}
                    </Link>
                    <span className="text-sm text-gray-600">
                      {c.chamber} &middot; {partyLabel(c.party)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
