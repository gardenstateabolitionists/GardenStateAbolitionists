'use client';

import type { Partner } from '@/lib/data/partners';
import { US_MAP_VIEWBOX, US_STATE_PATHS } from '@/lib/data/us-map-paths';

/**
 * Real geographic SVG US map — each state is a proper path from the
 * VictorCazanave/svg-maps dataset (MIT). States are clickable and colored
 * by partner status:
 *   Red   = us (New Jersey)
 *   Green = active partner coalition, clickable → jumps to state entry
 *   Gray  = no partner yet
 *
 * Client component so we can intercept clicks and scroll the target
 * entry to the CENTER of the viewport, not the top. Default browser
 * anchor navigation puts the target flush to the top, which — depending
 * on the entry's height — often leaves the org info either half above
 * the fold or awkwardly clipped by the sticky header. scrollIntoView
 * with block:'center' plus smooth behavior lands it in the middle.
 *
 * The SVG is 100% inline so it works without any JS for the initial
 * paint; the JS is only for the smooth-center scroll enhancement.
 */

const STATE_NAME_TO_ABBREV: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO',
  Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH',
  Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function colorFor(state: { id: string; name: string }, partner: Partner | undefined): string {
  if (state.name === 'New Jersey') return '#15803d'; // green-700 — us
  if (partner) return '#16a34a'; // green-600 — active partner
  return '#d1d5db'; // gray-300 — no partner
}

export default function UsStatesMap({
  partnersByState,
}: {
  partnersByState: Map<string, Partner>;
}) {
  // Build abbrev → partner map for O(1) lookup during render
  const partnerByAbbrev = new Map<string, Partner>();
  for (const [stateName, partner] of partnersByState) {
    const abbrev = STATE_NAME_TO_ABBREV[stateName];
    if (abbrev) partnerByAbbrev.set(abbrev, partner);
  }

  function scrollToStateEntry(e: React.MouseEvent, targetId: string) {
    // Intercept the anchor click so we can scroll to CENTER instead of
    // the browser default (target flush to top of viewport). Only fires
    // on primary click without modifier keys — cmd/ctrl/shift/middle
    // click still opens in a new tab as expected.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const el = document.getElementById(targetId);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Update the URL fragment so the page state is shareable/back-navigable
    // without triggering another default scroll.
    if (window.history.replaceState) {
      window.history.replaceState(null, '', `#${targetId}`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <svg
        viewBox={US_MAP_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Map of US states with abolitionist partner coverage"
      >
        {US_STATE_PATHS.map((state) => {
          const partner = partnerByAbbrev.get(state.id);
          const isUs = state.name === 'New Jersey';
          const fill = colorFor(state, partner);
          const title = isUs
            ? 'Garden State Abolitionists (us)'
            : partner
              ? `${state.name} — ${partner.name} (click to view)`
              : `${state.name} — no partner yet`;
          const anchor = partner ? `#${slugify(state.name)}` : undefined;

          const path = (
            <path
              d={state.d}
              fill={fill}
              stroke="#ffffff"
              strokeWidth={1}
              className={
                partner && !isUs
                  ? 'cursor-pointer hover:opacity-80 transition-opacity'
                  : ''
              }
            >
              <title>{title}</title>
            </path>
          );

          if (anchor) {
            const targetId = slugify(state.name);
            return (
              <a
                key={state.id}
                href={anchor}
                aria-label={title}
                onClick={(e) => scrollToStateEntry(e, targetId)}
                // Visible focus ring for keyboard nav — makes the states
                // properly keyboard-navigable instead of just clickable.
                className="focus:outline-none [&:focus>path]:stroke-black [&:focus>path]:stroke-2"
              >
                {path}
              </a>
            );
          }
          return <g key={state.id} aria-label={title}>{path}</g>;
        })}
      </svg>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-green-700 rounded" /> Garden State Abolitionists
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-green-600 rounded" /> Active partner coalition
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-gray-300 rounded" /> No partner yet
        </span>
      </div>
    </div>
  );
}
