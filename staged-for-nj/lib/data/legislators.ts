/**
 * Typed access to the enriched Michigan-legislator dataset.
 *
 * The JSON at data/legislators.json is generated from the research pipeline
 * at C:/Users/Dustina/Research/michigan-legislators/output. The set of
 * columns is stable across regenerations; anything shipped publicly stays
 * additive.
 *
 * Everything here is read-only + build-time. Static pages call
 * `getLegislators()` / `getLegislatorBySlug()` in generateStaticParams and
 * page bodies.
 */

import raw from '@/data/legislators.json';

export type Chamber = 'House' | 'Senate';
// `Abolitionist` was retired from the public site — it's a stance individuals
// self-identify with, not one we assign based on bill sponsorship. Retained
// in the internal research dataset (see michigan-legislators/output/); the
// public JSON collapses those rows into `Incrementalist (Pro-Life)`.
export type Stance = 'Incrementalist (Pro-Life)' | 'Pro-Choice' | 'Unknown';
export type VoteValue = 'Yea' | 'Nay' | 'Excused' | 'NotVoting' | null;
export type YesNo = 'Yes' | 'No' | null;
export type DistrictLean =
  | 'Safe R'
  | 'Safe D'
  | 'Lean R'
  | 'Lean D'
  | 'Tossup'
  | null;
export type TenureClass = 'Freshman' | 'Sophomore' | 'Veteran' | 'Long-term' | 'Unknown';

export interface Legislator {
  slug: string;
  name: string;
  chamber: Chamber;
  district: number;
  party: 'R' | 'D' | string;
  stance: Stance;

  // Voting record on tracked abortion bills. `null` = did not vote on this
  // bill (either not seated at the time, or bill died in committee).
  vote_HB4949: VoteValue;
  vote_HB4951: VoteValue;
  vote_HR0072: VoteValue;
  vote_SB0147: VoteValue;
  vote_SB0474: VoteValue;
  vote_SB0476: VoteValue;

  official_website: string | null;
  bill_sponsorships_count: number | null;
  cosponsorships_count: number | null;

  // Interest-group endorsements
  rtl_endorsed: YesNo;
  pp_advocates_endorsed: YesNo;
  ctv_endorsed: YesNo;

  // Abortion-adjacent PAC dollars (2022 + 2024 cycles, FTM data)
  ppac_donations_total: number;
  rtl_donations_total: number;
  abortion_related_pac_total: number;

  committees: string | null; // semicolon-joined
  email: string | null;
  capitol_phone: string | null;
  capitol_office_address: string | null;
  district_phone: string | null;
  district_office_address: string | null;
  openstates_url: string | null;

  // Bill-sponsorship signals
  sponsored_current_abolition_bill: YesNo; // 2025-HB-4670 or 4671
  sponsored_HB4683: YesNo;
  sponsored_HB4684_86: YesNo;
  sponsored_HB6270_total_ban: YesNo;
  sponsored_heartbeat_ban: YesNo;
  sponsored_HB4652: YesNo;
  sponsored_viability_ban: YesNo;
  sponsored_prc_funding: YesNo;

  twitter_handle: string | null;
  facebook_url: string | null;

  tenure_class: TenureClass;
  winner_margin: number | null;
  district_lean: DistrictLean;

  // Recent news — semicolon-joined `date  headline` strings + parallel links
  news_summary: string | null;
  news_links: string | null;
}

const LEGISLATORS = raw as Legislator[];

export function getLegislators(): Legislator[] {
  return LEGISLATORS;
}

export function getLegislatorBySlug(slug: string): Legislator | undefined {
  return LEGISLATORS.find((l) => l.slug === slug);
}

export function getLegislatorByDistrict(chamber: Chamber, district: number): Legislator | undefined {
  return LEGISLATORS.find((l) => l.chamber === chamber && l.district === district);
}

export function getAllSlugs(): string[] {
  return LEGISLATORS.map((l) => l.slug);
}

// --- Formatting helpers used by both the scorecard and profile pages ---

export function stanceBadgeClass(stance: Stance): string {
  switch (stance) {
    case 'Incrementalist (Pro-Life)':
      return 'bg-orange-500 text-white';
    case 'Pro-Choice':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}

/**
 * Public-facing label. Internal `stance` uses the researcher-facing terms;
 * the public site shows softer/clearer versions. Kept out of the raw enum
 * so downstream code stays type-safe.
 */
export function stanceLabel(stance: Stance): string {
  if (stance === 'Incrementalist (Pro-Life)') return 'Pro-Life (Incrementalist)';
  return stance;
}

// ============================================================================
// AAM abolitionist scorecard grade — pass/fail
// ============================================================================
//
// A "Pass" from AAM's abolitionist perspective means the legislator has
// demonstrated support for the total abolition of abortion — meaning they've
// publicly sponsored a true equal-protection bill AND haven't hedged with
// incrementalist bills (PRC funding, viability bans, heartbeat bans, etc.).
//
// At the moment no MI legislator meets that standard. Josh Schriver's HB 4671
// is the closest to a real abolition bill, but it still carries a life-of-
// mother exception; Schriver also cosponsored HB 4652 (PRC tax credits) in
// 2023, which is an explicit incrementalist compromise.
//
// The score is intentionally strict — the point of an abolitionist scorecard
// is to reveal that the current legislature is uniformly failing the
// abolitionist standard, not to grade on a curve.

export type Grade = 'Pass' | 'Fail';

export function grade(l: Legislator): Grade {
  const sponsoredAbolition = l.sponsored_current_abolition_bill === 'Yes';
  const hedgedIncrementalist =
    l.sponsored_HB4652 === 'Yes' ||
    l.sponsored_viability_ban === 'Yes' ||
    l.sponsored_heartbeat_ban === 'Yes' ||
    l.sponsored_prc_funding === 'Yes';
  return sponsoredAbolition && !hedgedIncrementalist ? 'Pass' : 'Fail';
}

export function gradeBadgeClass(g: Grade): string {
  // green-700 (not green-600) for WCAG AA contrast on white text
  // (~4.4:1 vs 3.0:1). red-600 already clears the bar.
  return g === 'Pass'
    ? 'bg-green-700 text-white'
    : 'bg-red-600 text-white';
}

/**
 * Per-vote pass/fail on a tracked bill from AAM's perspective.
 *   Nay on a pro-abortion-access bill = Pass (voted against abortion expansion)
 *   Yea on a pro-abortion-access bill = Fail
 *   Excused / NotVoting / no record = null (no grade)
 */
export function voteGrade(vote: VoteValue, proChoicePosition: 'Yea' | 'Nay'): Grade | null {
  if (!vote || vote === 'Excused' || vote === 'NotVoting') return null;
  return vote === proChoicePosition ? 'Fail' : 'Pass';
}

export function partyLabel(party: string): string {
  if (party === 'R') return 'Republican';
  if (party === 'D') return 'Democrat';
  return party;
}

export function chamberLabel(chamber: Chamber): string {
  return chamber === 'House' ? 'Representative' : 'Senator';
}

// Tracked abortion-related bills — kept in one place so the profile page,
// scorecard hub, and future bill pages all reference the same metadata.
export interface TrackedBill {
  key: 'HB4949' | 'HB4951' | 'HR0072' | 'SB0147' | 'SB0474' | 'SB0476';
  title: string;
  description: string;
  proChoicePosition: 'Yea' | 'Nay';
  session: '2023-2024';
}

/**
 * Canonical MI Legislature page for a tracked bill — has the bill text,
 * PDF/HTML links, sponsors, roll calls, and history.
 *
 *   key session → https://www.legislature.mi.gov/Bills/Bill?ObjectName=<year>-<HB|SB|HR>-<num>
 *
 * The `key` format is a compact "HB4949" / "SB0147" / "HR0072"; we insert
 * the dashes and the session start year to match MI Leg's URL convention.
 */
export function billOfficialUrl(bill: TrackedBill): string {
  const [year] = bill.session.split('-');
  // "HB4949" -> "HB-4949", "HR0072" -> "HR-0072"
  const prefix = bill.key.match(/^[A-Z]+/)?.[0] ?? '';
  const num = bill.key.slice(prefix.length);
  return `https://www.legislature.mi.gov/Bills/Bill?ObjectName=${year}-${prefix}-${num}`;
}

export const TRACKED_BILLS: TrackedBill[] = [
  {
    key: 'HB4949',
    title: 'HB 4949 — Reproductive Health Act',
    description:
      'Repeals pre-Roe Michigan abortion restrictions and codifies expansive abortion access. A Yea vote is the pro-abortion-access position.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'HB4951',
    title: 'HB 4951 — Sentencing guideline reflect repeal',
    description:
      'Companion to HB 4949; strikes references to repealed abortion crimes from the sentencing guidelines statute.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'SB0474',
    title: 'SB 0474 — Public health code repeal',
    description:
      'Repeals the TRAP (Targeted Regulation of Abortion Providers) laws from the Michigan public health code.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'SB0476',
    title: 'SB 0476 — Definition of abortion',
    description: 'Updates the statutory definition of abortion in the Born Alive Infant Protection Act.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'SB0147',
    title: 'SB 0147 — Pregnancy discrimination',
    description:
      'Amends the Elliott-Larsen civil rights act to remove references to nontherapeutic abortions.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'HR0072',
    title: 'HR 0072 — Condemning the mifepristone ban',
    description:
      'House resolution condemning federal restrictions on mifepristone, a common medication-abortion drug.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
];

export function parseNewsList(l: Legislator): { date: string; title: string; link: string }[] {
  if (!l.news_summary || !l.news_links) return [];
  const summaries = l.news_summary.split(';').map((s) => s.trim()).filter(Boolean);
  const links = l.news_links.split(';').map((s) => s.trim()).filter(Boolean);

  // Google News RSS returns loose matches — often a headline that mentions
  // one of our target news sites but isn't actually about this legislator.
  // Only keep headlines where the legislator's last name appears in the
  // title, or where the full "First Last" pattern shows up. Fewer, more
  // accurate headlines beats a long list of near-misses.
  const parts = l.name.trim().split(/\s+/);
  const lastName = parts[parts.length - 1].toLowerCase();
  const fullNameNormalized = l.name.toLowerCase();

  const out: { date: string; title: string; link: string }[] = [];
  for (let i = 0; i < summaries.length; i++) {
    // Summary format: "2024-02-20  Headline text" (two-space delimiter)
    const m = summaries[i].match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/);
    if (!m) continue;
    const title = m[2];
    const titleLower = title.toLowerCase();
    // Skip aggregator/index pages ("Author archives," "Page 2 of 94," etc.)
    if (/\bauthor archives|\bpage \d+ of \d+|\barchives\b/i.test(title)) continue;
    // Require the person's actual last name (or full name) in the headline.
    if (!titleLower.includes(lastName) && !titleLower.includes(fullNameNormalized)) continue;
    out.push({ date: m[1], title, link: links[i] || '' });
  }
  return out;
}

export function parseCommittees(l: Legislator): { name: string; role: string }[] {
  if (!l.committees) return [];
  return l.committees.split(';').map((c) => {
    const s = c.trim();
    const m = s.match(/^(.+?)\s*\(([^)]+)\)$/);
    if (m) return { name: m[1].trim(), role: m[2].trim() };
    return { name: s, role: 'Member' };
  });
}
