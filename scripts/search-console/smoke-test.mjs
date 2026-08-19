#!/usr/bin/env node
/**
 * Search Console API — credentials smoke test.
 *
 * Confirms the refresh token has webmasters scope, that the API
 * responds, and that our Search Console property is reachable.
 *
 * Usage:  node scripts/search-console/smoke-test.mjs
 */

import { scGet } from './_client.mjs';

console.log('Testing Search Console API credentials...\n');

let sites;
try {
  const res = await scGet('/sites');
  sites = res.siteEntry || [];
} catch (e) {
  console.error('[1/2] Site list FAILED:', e?.message || e);
  console.error('\nIf the error mentions "insufficient authentication scopes":');
  console.error('  1. Rerun scripts/google-ads/get-refresh-token.mjs (now requests');
  console.error('     both adwords + webmasters.readonly scopes).');
  console.error('  2. Then rerun this smoke test.');
  process.exit(1);
}

console.log('[1/2] Site list OK — ' + sites.length + ' property(ies) reachable:');
for (const s of sites) {
  console.log('        ' + s.siteUrl + '   (permission=' + s.permissionLevel + ')');
}

// Pick the Search Console property. Prefer the sc-domain: (Domain property) form
// if present; otherwise the first https://www.gardenstateabolitionists.com/
// URL-prefix form.
const preferred = sites.find((s) => s.siteUrl === 'sc-domain:gardenstateabolitionists.com')
  || sites.find((s) => s.siteUrl.startsWith('https://www.gardenstateabolitionists.com'))
  || sites.find((s) => /abolishabortion/i.test(s.siteUrl));

if (!preferred) {
  console.error('\n[2/2] No Search Console property found among reachable sites.');
  console.error('  Add and verify the site in Search Console UI first:');
  console.error('  https://search.google.com/search-console');
  process.exit(2);
}

console.log('\nTarget Search Console property: ' + preferred.siteUrl);

// Ping the searchAnalytics endpoint with a tiny query to confirm data flows
try {
  const end = new Date().toISOString().slice(0, 10);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const start = startDate.toISOString().slice(0, 10);
  const res = await scGet(
    '/sites/' + encodeURIComponent(preferred.siteUrl) + '/searchAnalytics/query'
      // GET-form isn't supported — the client wrapper below expects POST
      // for searchAnalytics. Falling through to the direct POST call.
      + '&_unused=1',
  );
  console.log('\n[2/2] Search analytics rows sampled:', (res && res.rows && res.rows.length) || 0);
} catch (e) {
  // Expected — /searchAnalytics/query is POST-only. Do a proper POST.
  const { scPost } = await import('./_client.mjs');
  const end = new Date().toISOString().slice(0, 10);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const start = startDate.toISOString().slice(0, 10);
  try {
    const res = await scPost(
      '/sites/' + encodeURIComponent(preferred.siteUrl) + '/searchAnalytics/query',
      { startDate: start, endDate: end, dimensions: ['query'], rowLimit: 5 },
    );
    const rows = res.rows || [];
    console.log('\n[2/2] Search analytics OK — ' + rows.length + ' sample row(s) for the last 7 days:');
    for (const r of rows) {
      console.log('        "' + r.keys[0] + '"   clicks=' + r.clicks + ' impressions=' + r.impressions);
    }
    if (rows.length === 0) {
      console.log('        (no impressions yet in the sample window)');
    }
  } catch (e2) {
    console.error('\n[2/2] Search analytics query FAILED:', e2?.message || e2);
    process.exit(3);
  }
}

console.log('\nCredentials all good. Ready to pull real reports.');
console.log('Write the target property to .env.local so scripts can pick it up:');
console.log('  SEARCH_CONSOLE_SITE=' + preferred.siteUrl);
