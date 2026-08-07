import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import InfoTip from '@/components/legislators/InfoTip';
import LegislatorFinder from '@/components/legislators/LegislatorFinder';
import LegislatorTable from './legislator-table';
import { getLegislators, grade } from '@/lib/data/legislators';
import { DATA_REFRESHED_ON } from '@/lib/data/data-freshness';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abolishabortionmichigan.com';

export const metadata: Metadata = {
  title: 'Michigan Legislator Scorecard on Abortion',
  description:
    'Every Michigan state legislator ranked by their record on abortion — votes, sponsorships, endorsements, and donations from abortion-related PACs. Search all 149 members.',
  alternates: { canonical: '/legislators' },
};

export default function LegislatorsHubPage() {
  const legislators = getLegislators();

  const passCount = legislators.filter((l) => grade(l) === 'Pass').length;
  const failCount = legislators.length - passCount;

  // ItemList schema — makes this page eligible for list-format SERPs and
  // supports the sitelinks structure Google sometimes surfaces for
  // scorecard-style pages.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: legislators.length,
    itemListElement: legislators.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/legislators/${l.slug}`,
      name: l.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-3">Michigan Legislator Scorecard</h1>
            <p className="text-gray-300 max-w-3xl">
              Where every Michigan state {legislators.length}-member Legislature stands on abortion —
              voting record, bills sponsored, endorsements from Right to Life of Michigan and
              Planned Parenthood, and donations from abortion-related PACs. Independently compiled
              from Michigan Legislature roll-call journals, Open States, and FollowTheMoney.org.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-2xl">
            <StatBox label="Pass" count={passCount} tone="green" />
            <StatBox label="Fail" count={failCount} tone="red" />
          </div>
          {passCount === 0 && (
            <p className="text-sm text-gray-300 mt-4 max-w-2xl leading-relaxed">
              <strong className="text-white">Zero legislators currently pass.</strong>{' '}
              No sitting member of the Michigan Legislature has sponsored a true equal-protection
              abolition bill without also hedging with incrementalist compromises. That&apos;s not
              a bug in the scorecard — it&apos;s an accurate reflection of where Michigan politics
              stand. See &ldquo;How we grade&rdquo; below.
            </p>
          )}
          {passCount > 0 && (
            <p className="text-xs text-gray-400 mt-3 max-w-2xl">
              &ldquo;Pass&rdquo; = has publicly sponsored a true equal-protection abolition bill and
              has NOT hedged with incrementalist compromises (pregnancy-center funding, viability
              bans, heartbeat bans). See &ldquo;How we grade&rdquo; below.
            </p>
          )}
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <LegislatorFinder />
          <Suspense fallback={<p className="text-gray-500">Loading legislators...</p>}>
            <LegislatorTable legislators={legislators} />
          </Suspense>
          <p className="text-xs text-gray-500 text-right">
            Data as of {DATA_REFRESHED_ON}.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-10 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 prose prose-gray">
          <h2 className="text-2xl font-bold mb-4">How we grade</h2>
          <p>
            Legislators are graded from Abolish Abortion Michigan&apos;s perspective. The bar is
            deliberately strict: nothing short of true abolition is a Pass.
          </p>
          <div className="not-prose space-y-4 mt-6">
            <div className="border-l-4 border-green-700 bg-white p-4 rounded-r">
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 rounded text-xs bg-green-700 text-white">
                  PASS
                </span>
                Abolitionist
              </div>
              <div className="text-gray-700 mt-2">
                Has publicly sponsored a true equal-protection abolition bill{' '}
                <strong>and</strong> has <em>not</em> hedged with incrementalist compromises
                (pregnancy-resource-center tax credits, fetal viability bans, heartbeat bans,
                etc.). Abolition of abortion means the immediate, total end of abortion —
                criminalized as homicide, no exceptions, from the moment of fertilization.{' '}
                <Link
                  href="/what-we-believe/abolitionist-not-pro-life"
                  className="text-red-700 underline"
                >
                  Learn more about the abolitionist position &rarr;
                </Link>
              </div>
            </div>
            <div className="border-l-4 border-red-600 bg-white p-4 rounded-r">
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">
                  FAIL
                </span>
                Everyone else
              </div>
              <p className="text-gray-700 mt-2">
                A Fail covers three overlapping groups:
              </p>
              <ul className="text-gray-700 mt-2 space-y-1 list-disc pl-6 marker:text-gray-400">
                <li>
                  <strong>Pro-Choice legislators</strong> who support abortion access — voted
                  for the Reproductive Health Act, or endorsed by Planned Parenthood Advocates
                  or similar. Direct opposition to abolition.
                </li>
                <li>
                  <strong>Pro-Life (Incrementalist) legislators</strong>
                  <InfoTip label="What Incrementalist means">
                    <p className="mb-2">
                      <strong>Incrementalism</strong>
                      {' '}is the mainstream pro-life strategy: reduce abortion gradually
                      through restrictions, waiting periods, viability limits, rape/incest
                      exceptions, and pregnancy-resource-center funding — but not outright
                      abolition.
                    </p>
                    <p>
                      Organizations in this camp include{' '}
                      <strong>Right to Life of Michigan</strong>, Susan B. Anthony Pro-Life
                      America, and the National Right to Life Committee.
                    </p>
                  </InfoTip>
                  {' '}who support restricting abortion but stop short of total abolition.
                  Incremental bills concede that at least some abortions may lawfully occur —
                  a position abolition rejects.
                </li>
                <li>
                  <strong>Legislators with no public record</strong> — usually sworn in too
                  recently to have any tracked votes or endorsements. Default to Fail until
                  they demonstrate otherwise.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatBox({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: 'green' | 'red';
}) {
  // green-700 (not green-600) so the white text meets WCAG AA contrast.
  const cls = {
    green: 'bg-green-700',
    red: 'bg-red-600',
  }[tone];
  return (
    <div className={`${cls} text-white rounded p-4`}>
      <div className="text-4xl font-black tabular-nums">{count}</div>
      <div className="text-sm uppercase tracking-wide mt-1 font-bold">{label}</div>
    </div>
  );
}
