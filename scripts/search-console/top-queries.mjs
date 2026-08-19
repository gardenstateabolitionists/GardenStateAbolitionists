#!/usr/bin/env node
/**
 * Report: top Search Console queries for this site over the last N days.
 *
 * Prints impressions, clicks, CTR, and average position per query
 * so you can see (a) what people search that Google actually shows
 * this site for, and (b) which of those you rank badly for (position > 10)
 * and could plausibly rank better with a page or a rewrite.
 *
 * Usage:
 *   node scripts/search-console/top-queries.mjs               # last 28 days, top 30
 *   node scripts/search-console/top-queries.mjs --days=7      # last 7 days
 *   node scripts/search-console/top-queries.mjs --limit=100   # top 100
 *   node scripts/search-console/top-queries.mjs --min-impressions=50
 */

import { scPost } from './_client.mjs';

const args = new Map();
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
  if (m) args.set(m[1], m[2] ?? 'true');
}
const DAYS = Number(args.get('days') || 28);
const LIMIT = Number(args.get('limit') || 30);
const MIN_IMP = Number(args.get('min-impressions') || 0);

const SITE = process.env.SEARCH_CONSOLE_SITE
  || 'sc-domain:gardenstateabolitionists.com';

const end = new Date().toISOString().slice(0, 10);
const startDate = new Date();
startDate.setDate(startDate.getDate() - DAYS);
const start = startDate.toISOString().slice(0, 10);

const res = await scPost(
  '/sites/' + encodeURIComponent(SITE) + '/searchAnalytics/query',
  {
    startDate: start,
    endDate: end,
    dimensions: ['query'],
    rowLimit: LIMIT * 3,
  },
);

const rows = (res.rows || [])
  .filter((r) => r.impressions >= MIN_IMP)
  .slice(0, LIMIT);

console.log('Garden State Abolitionists Search Console — top queries');
console.log('  Site:            ' + SITE);
console.log('  Window:          ' + start + ' -> ' + end + '  (' + DAYS + ' days)');
console.log('  Rows shown:      ' + rows.length);
if (MIN_IMP > 0) console.log('  Min impressions: ' + MIN_IMP);
console.log('');

if (rows.length === 0) {
  console.log('(no query data — likely the property is too new or has no impressions yet)');
  process.exit(0);
}

const nameW = Math.max(20, Math.min(80, Math.max(...rows.map((r) => r.keys[0].length))));
const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
console.log(pad('QUERY', nameW) + '  IMPR   CLICKS    CTR   POS');
console.log('-'.repeat(nameW) + '  -----  ------   -----  -----');
for (const r of rows) {
  const q = r.keys[0];
  const impressions = String(r.impressions).padStart(5);
  const clicks = String(r.clicks).padStart(6);
  const ctr = (r.ctr * 100).toFixed(1).padStart(5) + '%';
  const pos = r.position.toFixed(1).padStart(5);
  console.log(pad(q, nameW) + '  ' + impressions + '  ' + clicks + '  ' + ctr + '  ' + pos);
}

// Quick derived insight: the "low-hanging fruit" list — queries where
// The site already ranks page-2 (position 11–20) but with real impressions.
// Those are the easiest ranking wins.
const gettable = rows.filter((r) => r.position > 10 && r.position <= 20 && r.impressions >= Math.max(10, MIN_IMP));
if (gettable.length > 0) {
  console.log('\nLow-hanging fruit — ranking page 2, worth a content pass:');
  for (const r of gettable) {
    console.log('  "' + r.keys[0] + '"   position=' + r.position.toFixed(1) + '  impressions=' + r.impressions);
  }
}
