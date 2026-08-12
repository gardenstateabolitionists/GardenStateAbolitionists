import history from '@/data/nj-abolition-history.json';
import abortionContext from '@/data/nj-abortion-context.json';
import { getLegislatorsByDistrict, type Legislator, type FrcaVote } from '@/lib/data/legislators';

/**
 * Per-county and statewide context for the city pages.
 *
 * This replaces Michigan's `mi-county-context.ts`, which supplied three things
 * New Jersey cannot:
 *
 * - **County abortion counts.** Michigan publishes induced-abortion counts by
 *   county of residence. New Jersey publishes none, at any geography, and is
 *   one of four jurisdictions that declines to report to the CDC at all. So
 *   there is no county figure, and the page says that instead of substituting
 *   an estimate that would look official.
 *
 * - **A county ballot-measure result.** Michigan's Proposal 3 has no New
 *   Jersey equivalent; no comparable abortion measure has ever been on the
 *   ballot here. What New Jersey has that Michigan does not is a recorded
 *   legislative vote — so the box shows the city's own legislators and how
 *   each of them voted on the Freedom of Reproductive Choice Act. It names
 *   people rather than aggregating a county, which is strictly better.
 *
 * - **County Underground Railroad history.** Michigan's angle was Detroit as
 *   the northern terminus. New Jersey's history runs the other way: it was the
 *   last northern state to free its slaves, and it did so gradually. See
 *   `data/nj-abolition-history.json`.
 */

export interface CountyHistory {
  headline: string;
  paragraph: string;
  source: string;
  sourceUrl: string;
}

export interface TimelineEntry {
  year: number;
  event: string;
  detail: string;
  source: string;
  sourceUrl: string;
}

/** County-specific history, or null where the county has not been researched yet. */
export function getCountyHistory(county: string): CountyHistory | null {
  const byCounty = (history as { byCounty: Record<string, CountyHistory> }).byCounty;
  return byCounty[county] ?? null;
}

export function getStatewideHistory() {
  return (history as {
    statewide: {
      headline: string;
      thesis: string;
      timeline: TimelineEntry[];
      application: string;
    };
  }).statewide;
}

export function getAbortionContext() {
  return abortionContext as {
    statewide: {
      count: number;
      year: number;
      label: string;
      source: string;
      sourceUrl: string;
      caveat: string;
    };
    reportingGap: {
      headline: string;
      detail: string;
      quote: string;
      source: string;
      sourceUrl: string;
      otherNonReporting: string[];
      verifiedOn: string;
    };
  };
}

export interface FrcaRollCall {
  members: Legislator[];
  yes: number;
  no: number;
  /** Abstained or recorded as not voting — present for the vote, but not counted either way. */
  other: number;
  /** Serving now, but not in January 2022, so they have no vote on this bill. */
  noRecord: number;
  /** True when at least one representative of this city has a recorded vote. */
  hasAnyRecord: boolean;
}

/**
 * The FRCA roll call for the people who represent a given city.
 *
 * `noRecord` is deliberately separate from a "no" and from an abstention. 48 of
 * the 120 sitting members were not in office in January 2022, and reporting
 * that as anything other than "no recorded vote" would assert something about
 * them that is not true. This is the same rule that kept sponsorship counts off
 * the site.
 */
export function getFrcaRollCall(districts: number[]): FrcaRollCall {
  const members = districts.flatMap((d) => getLegislatorsByDistrict(d));
  const count = (v: FrcaVote) => members.filter((m) => m.frcaVote === v).length;
  const yes = count('Yes');
  const no = count('No');
  const other = count('Abstain') + count('Not Voting');
  const noRecord = members.filter((m) => !m.frcaVote).length;
  return { members, yes, no, other, noRecord, hasAnyRecord: yes + no + other > 0 };
}
