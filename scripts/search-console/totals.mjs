import { scPost, scGet } from './_client.mjs';

// List all sites (including different verification forms)
const list = await scGet('/sites');
console.log('All reachable properties:');
for (const s of list.siteEntry || []) console.log('  ' + s.permissionLevel + '  ' + s.siteUrl);

const site = process.env.SEARCH_CONSOLE_SITE || 'https://www.gardenstateabolitionists.com/';
console.log('\nTargeting: ' + site);

// Try progressively wider windows to find any data at all
for (const days of [7, 28, 90, 180, 480]) {
  const end = new Date().toISOString().slice(0, 10);
  const startD = new Date();
  startD.setDate(startD.getDate() - days);
  const start = startD.toISOString().slice(0, 10);
  const res = await scPost(
    '/sites/' + encodeURIComponent(site) + '/searchAnalytics/query',
    { startDate: start, endDate: end, rowLimit: 1 },
  );
  const totals = res.rows && res.rows[0];
  console.log('  last ' + String(days).padStart(3) + ' days   ' +
    (totals
      ? 'impressions=' + totals.impressions + ', clicks=' + totals.clicks + ', avg pos=' + totals.position.toFixed(1)
      : '(no data)'));
}
