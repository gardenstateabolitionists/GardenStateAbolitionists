/**
 * Human-readable freshness dates for the two data-heavy public pages
 * (/legislators, /partners). Update these when the underlying dataset
 * is regenerated, not on every build — a fresh timestamp that isn't
 * backed by fresh data reads as dishonest.
 *
 * Legislator dataset: MI Legislature roll-calls, Open States, FTM,
 * RTL/PPAMI endorsement lists, Google News per-legislator queries.
 * Partner directory: hand-curated from abolition_site_tracker.xlsx
 * plus abolitionistsrising.com/states/.
 */

export const LEGISLATOR_DATA_REFRESHED_ON = 'July 22, 2026';
export const PARTNER_DATA_REFRESHED_ON = 'July 22, 2026';
export const CITY_DATA_REFRESHED_ON = 'July 26, 2026';

// Convenience alias for pages that want the latest bump date without
// caring which dataset.
export const DATA_REFRESHED_ON = LEGISLATOR_DATA_REFRESHED_ON;
