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

const rows = await customer.query(`
  SELECT recommendation.type, recommendation.dismissed, recommendation.resource_name
  FROM recommendation
  WHERE recommendation.dismissed = false
`);

console.log('Active recommendations: ' + rows.length);
if (rows.length === 0) {
  console.log('  (Google has no active recommendations to surface)');
  process.exit(0);
}
const byType = new Map();
for (const r of rows) {
  const t = r.recommendation.type;
  byType.set(t, (byType.get(t) || 0) + 1);
}
console.log('\nGrouped:');
for (const [t, n] of [...byType.entries()].sort((a, b) => b[1] - a[1])) {
  console.log('  ' + String(n).padStart(3) + '  ' + t);
}
