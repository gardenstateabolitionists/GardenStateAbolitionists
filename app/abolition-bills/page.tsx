import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import { FRCA, formatVoteDate, getFrcaVoters, getLegislators } from '@/lib/data/legislators';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.com';

export const metadata: Metadata = {
  title: 'Abolition Bills — Where New Jersey Actually Stands',
  description:
    'New Jersey has no bill of abolition and no equal-protection bill. Here is what one would have to say, what the Freedom of Reproductive Choice Act did instead, and why the difference matters.',
  alternates: { canonical: '/abolition-bills' },
  openGraph: {
    title: 'Abolition Bills — Where New Jersey Actually Stands',
    description: 'What an abolition bill requires, and what New Jersey law says today.',
    type: 'website',
    url: `${BASE_URL}/abolition-bills`,
  },
};

/** The five components, in brief. The full treatment at
 *  /abolition-bills/components is Free the States' text, so these are
 *  short-form restatements of the same five — keep them in step. */
const COMPONENTS = [
  'Outlaws abortion from the moment of fertilization',
  'Contains no exceptions',
  'Criminalizes abortion itself and establishes equal justice',
  'Does not submit to unconstitutional court rulings',
  'Repeals or supersedes every statute that permits abortion',
];

export default function AbolitionBillsPage() {
  const all = getLegislators();
  const voters = getFrcaVoters();
  const votedAgainst = voters.filter((l) => l.frcaVote === 'No').length;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Abolition Bills — Where New Jersey Actually Stands',
    url: `${BASE_URL}/abolition-bills`,
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
            <span className="font-light">Abolition</span>{' '}
            <span className="font-black">BILLS</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Where New Jersey actually stands
          </p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Abolition Bills' }]} />

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Lead with the true state of things rather than an empty bill tracker. */}
          <div className="border-l-4 border-green-700 bg-gray-50 p-6 rounded-r mb-10">
            <h2 className="text-2xl font-bold mb-3">There is no bill to track</h2>
            <p className="text-gray-700 mb-4">
              We would rather say that plainly than run an empty bill tracker.{' '}
              <strong>
                No bill of abolition, and no equal-protection bill, has been introduced in the
                New Jersey Legislature.
              </strong>{' '}
              Not one that stalled in committee, and not one that failed on the floor. There is
              nothing to list.
            </p>
            <p className="text-gray-700">
              New Jersey moved in the opposite direction. In January 2022 the Legislature
              passed the <strong>{FRCA.title}</strong> ({FRCA.bill}), writing abortion access
              into statute rather than restricting it. That is the ground this state actually
              stands on, and pretending otherwise helps no one.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4">What the law says today</h2>
          <p className="text-gray-700 mb-4">
            The {FRCA.title} establishes a statutory right to abortion in New Jersey. It passed{' '}
            {FRCA.senate} in the Senate and {FRCA.assembly} in the Assembly on{' '}
            {formatVoteDate(FRCA.date)}
            , and was signed the same month.
          </p>
          <p className="text-gray-700 mb-4">
            Because it is statute rather than a court ruling, it can be amended or repealed by
            the same body that passed it. That is the whole reason a legislature is worth
            talking to — and the reason a directory of who represents you is more use here than
            a scorecard of votes that were never taken.
          </p>
          <p className="text-gray-700 mb-10">
            Of the {all.length} members serving today, {voters.length} were present for that
            vote and {votedAgainst} of them voted against it.{' '}
            <Link href="/legislators" className="text-green-800 underline hover:no-underline">
              See how your own representatives voted &rarr;
            </Link>
          </p>

          <h2 className="text-2xl font-bold mb-4">What a real abolition bill has to contain</h2>
          <p className="text-gray-700 mb-6">
            Not every bill described as pro-life is a bill of abolition. Most regulate abortion;
            a bill of abolition ends it, by extending to the preborn the protection the law
            already gives everyone else. Five things distinguish the two.
          </p>
          <ol className="space-y-2 mb-6">
            {COMPONENTS.map((title, i) => (
              <li key={title} className="border-l-4 border-green-700 bg-gray-50 p-4 rounded-r">
                <p className="font-bold text-gray-900">
                  {i + 1}. {title}
                </p>
              </li>
            ))}
          </ol>
          <p className="text-gray-700 mb-10">
            <Link
              href="/abolition-bills/components"
              className="text-green-800 underline hover:no-underline"
            >
              What each of these means, in full &rarr;
            </Link>
          </p>

          <div className="border-l-4 border-green-700 bg-gray-50 p-6 rounded-r">
            <h3 className="text-xl font-bold mb-2">Why we are not waiting for a bill</h3>
            <p className="text-gray-700 mb-3">
              A bill arrives when there are enough people who want one to make it worth a
              legislator&apos;s while. That work is upstream of the legislature: churches
              persuaded, neighbors convinced, representatives asked plainly where they stand
              and held to the answer.
            </p>
            <p className="text-gray-700">
              <Link href="/what-we-believe/criminalization" className="text-green-800 underline hover:no-underline">
                Read why equal protection means criminalization
              </Link>{' '}
              &middot;{' '}
              <Link href="/norman-statement" className="text-green-800 underline hover:no-underline">
                The Norman Statement
              </Link>{' '}
              &middot;{' '}
              <Link href="/the-petition" className="text-green-800 underline hover:no-underline">
                Sign the petition
              </Link>
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
