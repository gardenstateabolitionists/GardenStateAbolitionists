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

try {
  const rows = await customer.query(`
    SELECT segments.conversion_action_name, segments.date,
           metrics.all_conversions
    FROM customer
    WHERE segments.date DURING LAST_7_DAYS
  `);
  console.log('Conversions in the last 7 days:');
  if (rows.length === 0) console.log('  (none reported yet — takes 15 min–3 hrs to appear via API)');
  for (const r of rows) {
    console.log('  ' + (r.segments.date || '') + '  ' +
      String(r.segments.conversion_action_name || '(unknown)').padEnd(32) +
      '  count=' + Number(r.metrics.all_conversions).toFixed(1));
  }
} catch (e) {
  console.error('Query failed:', e?.message || e);
}
