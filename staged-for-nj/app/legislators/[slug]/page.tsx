import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContactBlock from '@/components/legislators/ContactBlock';
import FreedomCaucusBadge from '@/components/legislators/FreedomCaucusBadge';
import GradeBadge from '@/components/legislators/GradeBadge';
import InfoTip from '@/components/legislators/InfoTip';
import SponsorshipSignals from '@/components/legislators/SponsorshipSignals';
import VotingRecord from '@/components/legislators/VotingRecord';
import {
  chamberLabel,
  getAllSlugs,
  getLegislatorBySlug,
  getLegislators,
  grade,
  parseCommittees,
  parseNewsList,
  partyLabel,
} from '@/lib/data/legislators';
import { LEGISLATOR_DATA_REFRESHED_ON } from '@/lib/data/data-freshness';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abolishabortionmichigan.com';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> | Metadata {
  return params.then(({ slug }) => {
    const leg = getLegislatorBySlug(slug);
    if (!leg) return { title: 'Legislator not found' };
    const chamberWord = chamberLabel(leg.chamber);
    return {
      title: `${leg.name} — ${chamberWord}, District ${leg.district}`,
      description: `${leg.name}'s Michigan ${leg.chamber.toLowerCase()} record on abortion — stance, voting record, sponsorships, endorsements, campaign finance, and contact info.`,
      alternates: { canonical: `/legislators/${slug}` },
    };
  });
}

export default async function LegislatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legislator = getLegislatorBySlug(slug);
  if (!legislator) notFound();

  const committees = parseCommittees(legislator);
  const news = parseNewsList(legislator);
  const chamberWord = chamberLabel(legislator.chamber);

  // Person schema — helps Google present a Knowledge Panel and gives the
  // page rich-result eligibility for name searches.
  const personSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: legislator.name,
    jobTitle: `Michigan State ${chamberWord}`,
    memberOf: {
      '@type': 'GovernmentOrganization',
      name: `Michigan State ${legislator.chamber}`,
    },
    affiliation: {
      '@type': 'PoliticalParty',
      name: partyLabel(legislator.party),
    },
    url: `${BASE_URL}/legislators/${slug}`,
  };
  if (legislator.email) {
    personSchema.email = legislator.email;
  }
  if (legislator.capitol_phone) {
    personSchema.telephone = legislator.capitol_phone;
  }
  const sameAs = [legislator.official_website, legislator.openstates_url, legislator.facebook_url]
    .filter(Boolean);
  if (legislator.twitter_handle) {
    sameAs.push(`https://x.com/${legislator.twitter_handle.replace(/^@/, '')}`);
  }
  if (sameAs.length) personSchema.sameAs = sameAs;

  const districtLeanTag = legislator.district_lean
    ? `${legislator.district_lean} district`
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Back-to-scorecard link — a lightweight nav aid without the visual
          weight of a breadcrumb strip. Sits above the header so it's easy
          to find but doesn't compete with the legislator's name. */}
      <div className="bg-[#1a1a1a] pt-4 pb-2 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <Link
            href="/legislators"
            className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to scorecard
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="bg-[#1a1a1a] text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-2">{legislator.name}</h1>
              <p className="text-gray-300 text-sm md:text-base">
                {partyLabel(legislator.party)} · Michigan {legislator.chamber}, District{' '}
                {legislator.district}
                {districtLeanTag && <> · {districtLeanTag}</>}
                {legislator.tenure_class !== 'Unknown' && (
                  <> · {legislator.tenure_class}</>
                )}
              </p>
              <div className="mt-3">
                <FreedomCaucusBadge legislator={legislator} />
              </div>
            </div>
            <GradeBadge grade={grade(legislator)} className="self-start md:self-auto" />
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          <ContactBlock legislator={legislator} />

          <section>
            <h2 className="text-2xl font-bold mb-4">Voting Record</h2>
            <VotingRecord legislator={legislator} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Bill Sponsorships</h2>
            <SponsorshipSignals legislator={legislator} />
            {(legislator.bill_sponsorships_count !== null ||
              legislator.cosponsorships_count !== null) && (
              <p className="text-sm text-gray-500 mt-4">
                Overall legislative activity (all subjects, all sessions tracked):{' '}
                {legislator.bill_sponsorships_count ?? 0} primary sponsorships,{' '}
                {legislator.cosponsorships_count ?? 0} cosponsorships.
              </p>
            )}
          </section>

          {committees.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Committee Assignments</h2>
              <ul className="space-y-2">
                {committees.map((c) => (
                  <li key={c.name} className="text-gray-800">
                    <span className="font-semibold">{c.name}</span>
                    {c.role !== 'Member' && (
                      <span className="text-gray-500 text-sm"> — {c.role}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-3">Source: Open States.</p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-4">Endorsements</h2>
            <ul className="space-y-2 text-gray-800">
              <li>
                <span>Right to Life of Michigan (2024)</span>
                <InfoTip label="Right to Life of Michigan">
                  <p className="mb-2">
                    <strong>Right to Life of Michigan (RTL)</strong>
                    {' '}is Michigan&apos;s largest incrementalist pro-life organization. Founded
                    in 1970, RTL supports restricting abortion through regulations, exceptions,
                    and gradual legal change — not the immediate total abolition that Abolish
                    Abortion Michigan advocates.
                  </p>
                  <p>
                    An RTL endorsement generally indicates a candidate willing to vote for
                    pro-life restrictions and accept exceptions for rape, incest, and life of the
                    mother.
                  </p>
                </InfoTip>
                :{' '}
                {legislator.rtl_endorsed === 'Yes' ? (
                  <strong>Endorsed</strong>
                ) : (
                  <span className="text-gray-500">Not endorsed</span>
                )}
              </li>
              <li>
                <span>Planned Parenthood Advocates of Michigan</span>
                <InfoTip label="Planned Parenthood Advocates of Michigan">
                  <p className="mb-2">
                    <strong>Planned Parenthood Advocates of Michigan (PPAMI)</strong>
                    {' '}is the political-advocacy arm of Planned Parenthood in Michigan. It
                    endorses candidates who support unrestricted abortion access and Planned
                    Parenthood funding, and runs voter mobilization on their behalf.
                  </p>
                  <p>
                    Data source: Ballotpedia&apos;s tracked endorsement list. Only PPAMI&apos;s
                    &ldquo;notable&rdquo; endorsements are captured; their full slate lives on
                    their Wix-hosted site which is not machine-readable.
                  </p>
                </InfoTip>
                :{' '}
                {legislator.pp_advocates_endorsed === 'Yes' ? (
                  <strong>Endorsed</strong>
                ) : (
                  <span className="text-gray-500">Not among Ballotpedia-tracked endorsements</span>
                )}
              </li>
              <li>
                <span>Citizens for Traditional Values</span>
                <InfoTip label="Citizens for Traditional Values">
                  <p>
                    <strong>Citizens for Traditional Values (CTV)</strong>
                    {' '}is a Michigan Christian political-advocacy organization founded in 1983.
                    CTV endorses candidates aligned with conservative Christian positions on life,
                    family, and religious freedom.
                  </p>
                </InfoTip>
                :{' '}
                {legislator.ctv_endorsed === 'Yes' ? (
                  <strong>Endorsed</strong>
                ) : (
                  <span className="text-gray-500">Not endorsed</span>
                )}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Campaign Finance (Abortion-Related PACs)</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <FinanceCard label="Right to Life of Michigan PAC" amount={legislator.rtl_donations_total} />
              <FinanceCard
                label="Planned Parenthood affiliates"
                amount={legislator.ppac_donations_total}
              />
              <FinanceCard
                label="Combined abortion-related PACs"
                amount={legislator.abortion_related_pac_total}
              />
            </div>
            <div className="mt-4 text-xs text-gray-600 space-y-2">
              <p>
                <strong>Source:</strong> FollowTheMoney.org itemized contributions, 2022 + 2024
                Michigan election cycles.
              </p>
              <details className="bg-gray-50 border border-gray-200 rounded p-3">
                <summary className="cursor-pointer font-semibold text-gray-800 select-none">
                  Why is this often $0?
                </summary>
                <div className="mt-2 space-y-2">
                  <p>
                    A $0 total here does <em>not</em> mean a legislator has no support from these
                    organizations — it means no <strong>itemized direct contribution</strong>{' '}
                    is on file with the Michigan Bureau of Elections for the tracked cycles.
                    Support
                    typically flows through channels that don&apos;t show up:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Independent expenditures</strong> — Right to Life of Michigan and
                      Planned Parenthood Advocates both spend the majority of their political
                      budgets on ads for or against candidates, which are reported separately from
                      candidate contributions and are not included here.
                    </li>
                    <li>
                      <strong>Aligned PACs</strong> — Pro-choice legislators often receive support
                      through the Michigan Democratic Party, Reproductive Freedom for All,
                      EMILY&apos;s List, or similar allied committees rather than directly from
                      Planned Parenthood.
                    </li>
                    <li>
                      <strong>Safe-seat legislators</strong> — Candidates in uncompetitive
                      districts often draw little PAC money because they don&apos;t need it.
                    </li>
                    <li>
                      <strong>Cycle timing</strong> — Legislators mid-term (like state senators
                      elected in 2022 running again in 2026) show no 2024 activity because they
                      weren&apos;t on the ballot.
                    </li>
                  </ul>
                  <p>
                    A non-zero total is meaningful (an explicit check to the campaign); a zero is
                    the absence of one channel of support, not proof of no relationship.
                  </p>
                </div>
              </details>
            </div>
          </section>

          {news.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Recent News Coverage</h2>
              <ul className="space-y-3">
                {news.map((item) => (
                  <li key={item.link} className="border-l-4 border-gray-200 pl-3">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 underline hover:no-underline"
                    >
                      {item.title}
                    </a>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                Source: Google News, scoped to Michigan-local outlets and abortion-related queries.
              </p>
            </section>
          )}

          <section className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Data compiled from Michigan Legislature roll-call PDFs, Open States API, Right to Life
              of Michigan endorsement list, Ballotpedia, and FollowTheMoney.org.{' '}
              <Link href="/legislators" className="text-red-700 underline hover:no-underline">
                Back to the full scorecard
              </Link>
              .
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Dataset last refreshed {LEGISLATOR_DATA_REFRESHED_ON}.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}

function FinanceCard({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">
        {amount > 0 ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
      </p>
    </div>
  );
}

