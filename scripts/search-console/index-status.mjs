#!/usr/bin/env node
/**
 * URL Inspection API — bulk index-status report for this site.
 *
 * For every URL in the live sitemap, calls Google Search Console's URL
 * Inspection endpoint and prints:
 *   - a summary table (count per coverage state)
 *   - a per-URL detail list for anything NOT in "Submitted and indexed"
 *
 * This is the same information Search Console's UI shows when you paste
 * a URL into the top search bar — but for all 333 URLs at once, and
 * fully within Google's official API. No scraping, no ToS risk.
 *
 * Quota: 2000 URLs/day per property (Google's cap). This site has a few hundred URLs, so
 * we can run this daily without pressure. Also a per-minute soft cap;
 * we pace requests at ~2/sec to stay safely under it.
 *
 * Usage:
 *   node scripts/search-console/index-status.mjs
 *   node scripts/search-console/index-status.mjs --limit=10       # sample first 10
 *   node scripts/search-console/index-status.mjs --sitemap=...    # override sitemap URL
 *   node scripts/search-console/index-status.mjs --json=out.json  # save raw JSON
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ENV_PATH = path.join(REPO_ROOT, '.env.local');
for (const line of fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const args = new Map();
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
  if (m) args.set(m[1], m[2] ?? 'true');
}
const LIMIT = Number(args.get('limit') || 0); // 0 = no limit
const SITEMAP_URL = args.get('sitemap') || 'https://www.gardenstateabolitionists.org/sitemap.xml';
const JSON_OUT = args.get('json') || null;
const SITE = process.env.SEARCH_CONSOLE_SITE || 'https://www.gardenstateabolitionists.org/';
const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN;

async function getAccessToken() {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('token refresh failed: ' + JSON.stringify(j));
  return j.access_token;
}

async function fetchSitemap(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'GSA-Index-Status/1.0' } });
  if (!res.ok) throw new Error('sitemap fetch: ' + res.status);
  return res.text();
}
function extractLocs(xml) {
  const out = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) out.push(m[1]);
  return out;
}

console.log('URL Inspection — bulk index status');
console.log('  Sitemap:  ' + SITEMAP_URL);
console.log('  Property: ' + SITE);
console.log('');

// Load sitemap
let urls = extractLocs(await fetchSitemap(SITEMAP_URL));
if (LIMIT > 0) urls = urls.slice(0, LIMIT);
console.log('URLs to inspect: ' + urls.length);
if (urls.length === 0) process.exit(0);

const token = await getAccessToken();

// Pace ~2 req/sec = 120/min, well under Google's per-minute limits
const PACE_MS = 500;
const results = [];
const errors = [];

process.stdout.write('Inspecting: ');
let i = 0;
for (const u of urls) {
  i++;
  try {
    const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectionUrl: u, siteUrl: SITE }),
    });
    if (!res.ok) {
      const t = await res.text();
      errors.push({ url: u, error: res.status + ': ' + t.slice(0, 200) });
      process.stdout.write('X');
    } else {
      const data = await res.json();
      const idx = data.inspectionResult?.indexStatusResult || {};
      results.push({
        url: u,
        verdict: idx.verdict || null,
        coverageState: idx.coverageState || null,
        indexingState: idx.indexingState || null,
        lastCrawlTime: idx.lastCrawlTime || null,
        pageFetchState: idx.pageFetchState || null,
        robotsTxtState: idx.robotsTxtState || null,
        googleCanonical: idx.googleCanonical || null,
        userCanonical: idx.userCanonical || null,
      });
      process.stdout.write('.');
    }
  } catch (e) {
    errors.push({ url: u, error: e.message || String(e) });
    process.stdout.write('!');
  }
  // Progress marker every 25
  if (i % 25 === 0) process.stdout.write(' ' + i + '/' + urls.length + ' ');
  await new Promise((r) => setTimeout(r, PACE_MS));
}
process.stdout.write('\n\n');

// Summary by coverage state
const byState = new Map();
for (const r of results) {
  const k = r.coverageState || '(no data)';
  byState.set(k, (byState.get(k) || 0) + 1);
}
console.log('=== COVERAGE STATE SUMMARY ===');
const sorted = [...byState.entries()].sort((a, b) => b[1] - a[1]);
for (const [state, n] of sorted) {
  const pct = ((n / results.length) * 100).toFixed(1);
  console.log('  ' + String(n).padStart(4) + '  (' + pct.padStart(5) + '%)  ' + state);
}
if (errors.length > 0) {
  console.log('  ' + String(errors.length).padStart(4) + '   (err)   API errors');
}

// Detail: everything that is NOT plainly indexed
const NOT_INDEXED_STATES = new Set([
  'Submitted and indexed',
  'Indexed, not submitted in sitemap',
]);
const problems = results.filter((r) => !NOT_INDEXED_STATES.has(r.coverageState));
if (problems.length > 0) {
  console.log('\n=== NOT-YET-INDEXED URLs (' + problems.length + ') ===');
  // Group by coverage state for readability
  const grouped = new Map();
  for (const r of problems) {
    const k = r.coverageState || '(no state)';
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k).push(r);
  }
  for (const [state, rows] of [...grouped.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log('\n[' + rows.length + '] ' + state);
    for (const r of rows) {
      const path = r.url.replace('https://www.gardenstateabolitionists.org', '') || '/';
      console.log('  ' + path);
      if (r.googleCanonical && r.googleCanonical !== r.url) {
        console.log('      -> Google canonical: ' + r.googleCanonical);
      }
    }
  }
}

if (errors.length > 0) {
  console.log('\n=== API ERRORS (' + errors.length + ') ===');
  for (const e of errors.slice(0, 10)) {
    console.log('  ' + e.url);
    console.log('    ' + e.error);
  }
  if (errors.length > 10) console.log('  ...and ' + (errors.length - 10) + ' more');
}

if (JSON_OUT) {
  const snapshot = {
    generatedAt: new Date().toISOString(),
    site: SITE,
    sitemap: SITEMAP_URL,
    counts: Object.fromEntries(byState),
    results,
    errors,
  };
  fs.writeFileSync(JSON_OUT, JSON.stringify(snapshot, null, 2), 'utf8');
  console.log('\nSaved JSON snapshot to ' + JSON_OUT);
}
