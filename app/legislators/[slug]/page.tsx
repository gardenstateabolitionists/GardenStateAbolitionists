import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import ContactLetter from '@/components/legislators/ContactLetter';
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
            {l.photo && (
              // Portraits come from the Open States CDN and are not in our
              // next.config remotePatterns, so a plain <img> is correct here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={l.photo}
                alt={l.name}
                width={112}
                height={112}
                className="w-28 h-28 rounded-full object-cover border-2 border-green-700 bg-gray-800"
              />
            )}
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
