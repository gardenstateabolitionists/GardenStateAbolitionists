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
  SELECT conversion_action.id, conversion_action.name, conversion_action.status,
         conversion_action.type, conversion_action.category,
         conversion_action.include_in_conversions_metric,
         conversion_action.counting_type,
         conversion_action.primary_for_goal,
         conversion_action.tag_snippets
  FROM conversion_action
  WHERE conversion_action.name LIKE 'GSA %'
    AND conversion_action.status != 'REMOVED'
`);

for (const r of rows) {
  const c = r.conversion_action;
  console.log('---');
  console.log('Name:                        ' + c.name);
  console.log('Status:                      ' + c.status + '  (2=ENABLED, 3=REMOVED, 4=HIDDEN)');
  console.log('Type:                        ' + c.type);
  console.log('Category:                    ' + c.category);
  console.log('include_in_conversions_metric: ' + c.include_in_conversions_metric);
  console.log('counting_type:               ' + c.counting_type + '  (2=ONE, 3=MANY)');
  console.log('primary_for_goal:            ' + c.primary_for_goal);
  const snippets = c.tag_snippets || [];
  console.log('tag_snippets:                ' + snippets.length + ' snippet(s)');
  for (const s of snippets) {
    const evt = (s.event_snippet || '').replace(/\s+/g, ' ').substring(0, 160);
    if (evt) console.log('  event snippet: ' + evt);
  }
}
