/**
 * Typed access to the New Jersey Legislature roster.
 *
 * This deliberately does NOT reproduce the Michigan scorecard model this site
 * was derived from. That page graded members on roll-call votes on named
 * abolition bills; New Jersey has no abolition bill for anyone to have voted
 * on, so there is nothing to grade. What exists instead is one substantive
 * abortion vote — the Freedom of Reproductive Choice Act — and a roster people
 * can use to contact whoever represents them.
 */
import raw from '@/data/legislators.json';

export type Chamber = 'Senate' | 'Assembly';

/**
 * A member's vote on the final passage of S49.
 *
 * `null` means the member WAS NOT SERVING for that vote — 61 of the 120 current
 * members were elected afterwards. It is not an abstention, and rendering it as
 * one would misrepresent them. `'Abstain'` and `'Not Voting'` are real, recorded
 * positions and are distinct from `null`.
 */
export type FrcaVote = 'Yes' | 'No' | 'Not Voting' | 'Abstain' | null;

export interface Legislator {
  slug: string;
  name: string;
  chamber: Chamber;
  district: number;
  party: 'R' | 'D' | string;
  districtPhone: string | null;
  frcaVote: FrcaVote;
}

interface FrcaMeta {
  bill: string;
  title: string;
  date: string;
  senate: string;
  assembly: string;
  source: string;
}

const DATA = raw as unknown as {
  note: string;
  frcaVote: FrcaMeta;
  legislators: Legislator[];
};

/** Metadata for the one abortion vote we publish, so the page can cite it. */
export const FRCA = DATA.frcaVote;

export function getLegislators(): Legislator[] {
  return DATA.legislators;
}

export function getLegislatorBySlug(slug: string): Legislator | undefined {
  return DATA.legislators.find((l) => l.slug === slug);
}

/** Every district has exactly one senator and two assembly members. */
export function getLegislatorsByDistrict(district: number): Legislator[] {
  return DATA.legislators.filter((l) => l.district === district);
}

export function getDistricts(): number[] {
  return [...new Set(DATA.legislators.map((l) => l.district))].sort((a, b) => a - b);
}

/** Only members who actually cast a vote on S49 — excludes those not serving. */
export function getFrcaVoters(): Legislator[] {
  return DATA.legislators.filter((l) => l.frcaVote !== null);
}

export function partyLabel(p: string): string {
  return p === 'R' ? 'Republican' : p === 'D' ? 'Democrat' : p;
}

/** Tailwind classes for a vote badge. Kept here so the list and the
 *  district view cannot drift apart. */
export function voteStyle(v: FrcaVote): { label: string; className: string } {
  switch (v) {
    case 'Yes':
      return { label: 'Voted for', className: 'bg-red-100 text-red-800 border-red-200' };
    case 'No':
      return { label: 'Voted against', className: 'bg-green-100 text-green-800 border-green-200' };
    case 'Abstain':
      return { label: 'Abstained', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'Not Voting':
      return { label: 'Did not vote', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    default:
      return { label: 'Not serving in 2022', className: 'bg-gray-100 text-gray-600 border-gray-200' };
  }
}
