import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAdsApi } from 'google-ads-api';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
for (const line of fs.readFileSync(path.join(REPO_ROOT, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});
const customer = client.Customer({
  customer_id: (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/[^0-9]/g, ''),
  login_customer_id: (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || '').replace(/[^0-9]/g, ''),
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

// Per-day metrics for the last 5 days
const rows = await customer.query(`
  SELECT campaign.name, segments.date, metrics.impressions, metrics.clicks,
         metrics.search_impression_share, metrics.search_rank_lost_impression_share
  FROM campaign
  WHERE campaign.name IN ('GSA — Petition', 'GSA — Educational', 'GSA — Donations')
    AND campaign.status != 'REMOVED'
    AND segments.date DURING LAST_7_DAYS
  ORDER BY segments.date DESC
`);

console.log('=== DAILY BREAKDOWN (last 7 days) ===');
if (rows.length === 0) {
  console.log('  (no data — no impressions any day)');
}
for (const r of rows) {
  const share = r.metrics.search_impression_share;
  const lostRank = r.metrics.search_rank_lost_impression_share;
  console.log('  ' + r.segments.date + '  ' + r.campaign.name.padEnd(20) +
    '  imp=' + String(r.metrics.impressions).padStart(4) +
    '  clk=' + String(r.metrics.clicks).padStart(3) +
    '  share=' + (share !== undefined ? (share * 100).toFixed(1) + '%' : '(no data)') +
    '  lostRank=' + (lostRank !== undefined ? (lostRank * 100).toFixed(1) + '%' : '(no data)'));
}
