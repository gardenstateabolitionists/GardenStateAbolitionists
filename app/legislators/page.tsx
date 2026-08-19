import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import DistrictFinder from '@/components/legislators/DistrictFinder';
import {
  getLegislators,
  getDistricts,
  getFrcaVoters,
  FRCA,
  formatVoteDate,
} from '@/lib/data/legislators';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.com';

export const metadata: Metadata = {
  title: 'Your New Jersey Legislators — Find and Contact Them',
  description:
    'Every member of the New Jersey Legislature: 40 senators and 80 assembly members across 40 districts, with district phone numbers and how each voted on the Freedom of Reproductive Choice Act.',
  alternates: { canonical: '/legislators' },
  openGraph: {
    title: 'Your New Jersey Legislators',
    description: 'Find the people who represent you, and how they voted on abortion.',
    type: 'website',
    url: `${BASE_URL}/legislators`,
  },
};

export default function LegislatorsPage() {
  const all = getLegislators();
  const districts = getDistricts();
  const voters = getFrcaVoters();

  const senate = all.filter((l) => l.chamber === 'Senate');
  const assembly = all.filter((l) => l.chamber === 'Assembly');
  const votedFor = voters.filter((l) => l.frcaVote === 'Yes').length;
  const votedAgainst = voters.filter((l) => l.frcaVote === 'No').length;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Your New Jersey Legislators',
    url: `${BASE_URL}/legislators`,
    about: { '@type': 'Place', name: 'New Jersey' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Your</span>{' '}
            <span className="font-black">LEGISLATORS</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Find the people who represent you
          </p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Your New Jersey Legislators' }]} />

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* The honest framing of what this vote is and is not. Deliberately
              placed ahead of the directory so the caveat is read before the
              vote labels are scanned, rather than after. */}
          <div className="mb-12 border-l-4 border-green-700 bg-gray-50 p-6 rounded-r">
            <h2 className="text-2xl font-bold mb-3">About the vote shown</h2>
            <p className="text-gray-700 mb-4">
              New Jersey has no bill of abolition, and no equal-protection bill, so there is
              no abolition record to publish. The one substantive abortion vote in recent
              memory is the{' '}
              <strong>{FRCA.title}</strong> ({FRCA.bill}), which passed on{' '}
              {formatVoteDate(FRCA.date)}{' '}
              and wrote abortion access into New Jersey statute. Final passage was{' '}
              {FRCA.senate} in the Senate and {FRCA.assembly} in the Assembly.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>
                Only {voters.length} of the {all.length} people serving today cast that vote.
              </strong>{' '}
              Of those, {votedFor} voted for it and {votedAgainst} against. The other{' '}
              {all.length - voters.length} were elected afterwards and are marked{' '}
              <em>not serving in 2022</em> — that is not an abstention, and it is not a mark
              against them.
            </p>
            <p className="text-gray-700">
              This is a contact directory first. A voting record four years old tells you
              something about the members who were there; it tells you nothing about the
              rest. For them, the useful thing is to ask where they stand — and the phone
              number to do it is in the directory below.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Roll call from the New Jersey Legislature&apos;s own records.{' '}
              <a
                href={FRCA.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-800 underline hover:no-underline"
              >
                View the bill and vote
              </a>
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { value: senate.length, label: 'State senators' },
              { value: assembly.length, label: 'Assembly members' },
              { value: districts.length, label: 'Legislative districts' },
            ].map((s) => (
              <div key={s.label} className="text-center bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="text-4xl font-bold text-green-800 mb-1">{s.value}</div>
                <div className="text-gray-600 text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">Find your district</h2>
          <p className="text-gray-700 mb-6">
            New Jersey has {districts.length} legislative districts. Each one elects{' '}
            <strong>one senator and two assembly members</strong> — so you have three
            representatives, not one. Search by district number or by name.
          </p>
          <DistrictFinder legislators={all} />
        </div>
      </section>

      <CTABanner />
    </>
  );
}
