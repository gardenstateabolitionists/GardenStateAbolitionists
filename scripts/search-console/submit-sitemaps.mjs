#!/usr/bin/env node
/**
 * Search Console — check sitemap registration + freshness.
 *
 * Currently read-only: our OAuth token was minted with
 * `webmasters.readonly` scope, which permits GET on /sitemaps but
 * refuses PUT. The two sitemaps were submitted via the Search Console
 * UI on 2026-08-03 and are being crawled successfully, so submitting
 * again from code was never actually needed.
 *
 * If you ever need to add a NEW sitemap via API:
 *   1. Edit scripts/google-ads/get-refresh-token.mjs — change
 *      'webmasters.readonly' to 'webmasters' in the SCOPES array.
 *   2. Rerun `node scripts/google-ads/get-refresh-token.mjs` to mint
 *      a new refresh token with the write scope.
 *   3. Extend this script with a PUT call to
 *      /sites/{siteUrl}/sitemaps/{feedpath}.
 *
 * Usage:  node scripts/search-console/submit-sitemaps.mjs
 */

import { scGet } from './_client.mjs';

const SITE = process.env.SEARCH_CONSOLE_SITE
  || 'https://www.gardenstateabolitionists.org/';

console.log('Sitemap status per Search Console');
console.log('  Property: ' + SITE);
console.log('');

const info = await scGet('/sites/' + encodeURIComponent(SITE) + '/sitemaps');
const list = info.sitemap || [];

if (list.length === 0) {
  console.log('No sitemaps registered. Submit via the Search Console UI:');
  console.log('  Search Console -> Sitemaps -> paste "sitemap.xml" -> Submit');
  console.log('  Also submit "news-sitemap.xml".');
  process.exit(0);
}

for (const sm of list) {
  const errors = sm.errors || 0;
  const warnings = sm.warnings || 0;
  const badge = errors > 0 ? '  [ERRORS]'
    : warnings > 0 ? '  [WARN]'
    : '  [OK]';
  console.log(sm.path + badge);
  console.log('  Last submitted:  ' + (sm.lastSubmitted || '?'));
  console.log('  Last downloaded: ' + (sm.lastDownloaded || 'not yet'));
  console.log('  Errors / Warnings: ' + errors + ' / ' + warnings);
  console.log('  isPending: ' + Boolean(sm.isPending));
  if (sm.contents && sm.contents.length > 0) {
    for (const c of sm.contents) {
      console.log('  ' + (c.type || 'urls') + ': submitted=' + (c.submitted || 0) + ', indexed=' + (c.indexed || 0));
    }
  }
  console.log('');
}
