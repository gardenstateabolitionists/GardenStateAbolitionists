#!/usr/bin/env node
/**
 * IndexNow bulk ping — push every URL in the live sitemap to Bing,
 * Yandex, DuckDuckGo, and Naver in a single API call.
 *
 * Notification-only, not required for correctness — search engines will
 * eventually find the URLs via natural crawl. IndexNow just puts them
 * into a priority queue that generally cuts discovery from days-to-weeks
 * down to minutes. Google doesn't support IndexNow (as of 2026) but the
 * cross-engine crawl activity is sometimes observed to nudge Google
 * discovery too.
 *
 * IndexNow spec: up to 10,000 URLs per POST. This site has a few hundred URLs, so one call
 * covers the whole site with headroom.
 *
 * Usage:
 *   node scripts/search-console/indexnow-bulk.mjs
 *   node scripts/search-console/indexnow-bulk.mjs --dry-run
 *   node scripts/search-console/indexnow-bulk.mjs --sitemap=https://.../sitemap.xml
 */

const args = new Map();
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
  if (m) args.set(m[1], m[2] ?? 'true');
}
const DRY_RUN = args.get('dry-run') === 'true';
const SITEMAP_URL = args.get('sitemap') || 'https://www.gardenstateabolitionists.org/sitemap.xml';

// Values duplicated from lib/indexnow.ts — kept in sync manually. If the
// key ever rotates, update both here and in lib/indexnow.ts + rename the
// public/{key}.txt file.
const INDEXNOW_KEY = 'ea19840a842f58e020f38540804ed83e';
const HOST = 'www.gardenstateabolitionists.org';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

console.log('IndexNow bulk ping');
console.log('  Sitemap:  ' + SITEMAP_URL);
console.log('  Host:     ' + HOST);
console.log('  Mode:     ' + (DRY_RUN ? 'DRY RUN' : 'LIVE'));
console.log('');

// 1) Fetch the sitemap. Follow <sitemapindex> if we get one.
async function fetchXml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'GSA-IndexNow-Bulk/1.0' } });
  if (!res.ok) throw new Error('sitemap fetch failed: ' + res.status);
  return await res.text();
}

function extractLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) locs.push(m[1]);
  return locs;
}

const rootXml = await fetchXml(SITEMAP_URL);

let urls;
if (/<sitemapindex[\s>]/i.test(rootXml)) {
  console.log('Sitemap index detected; fetching child sitemaps...');
  const children = extractLocs(rootXml);
  console.log('  ' + children.length + ' child sitemap(s)');
  urls = [];
  for (const child of children) {
    const childXml = await fetchXml(child);
    const childLocs = extractLocs(childXml);
    console.log('    ' + child + '  ->  ' + childLocs.length + ' url(s)');
    urls.push(...childLocs);
  }
} else {
  urls = extractLocs(rootXml);
}

// Dedupe + only ping URLs on our host (IndexNow rejects cross-host lists)
const uniq = [...new Set(urls)].filter((u) => {
  try {
    return new URL(u).host === HOST;
  } catch {
    return false;
  }
});
console.log('\nParsed ' + urls.length + ' url(s), ' + uniq.length + ' unique on ' + HOST);

if (uniq.length === 0) {
  console.error('No URLs to ping — aborting.');
  process.exit(1);
}
if (uniq.length > 10_000) {
  console.error('WARNING: ' + uniq.length + ' urls exceeds IndexNow batch limit of 10000. Truncating.');
  uniq.length = 10_000;
}

if (DRY_RUN) {
  console.log('\nDry run — first 5 URLs that would ping:');
  for (const u of uniq.slice(0, 5)) console.log('  ' + u);
  console.log('  ...and ' + Math.max(0, uniq.length - 5) + ' more');
  process.exit(0);
}

// 2) One POST with the whole list
const body = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: 'https://' + HOST + '/' + INDEXNOW_KEY + '.txt',
  urlList: uniq,
};

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log('\nIndexNow response: HTTP ' + res.status);
if (res.status === 200 || res.status === 202) {
  console.log('OK — ' + uniq.length + ' URLs submitted to Bing / Yandex / DuckDuckGo / Naver');
} else {
  const text = await res.text().catch(() => '');
  console.error('Bad response: ' + res.status);
  if (text) console.error(text.slice(0, 500));
  process.exit(2);
}
