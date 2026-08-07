import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAdsApi } from 'google-ads-api';

const REPO_ROOT = 'C:/Users/Dustina/Websites/Garden State Abolitionists';
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

const cs = await customer.query(
  "SELECT campaign.name, campaign.status, campaign.bidding_strategy_type FROM campaign WHERE campaign.status != 'REMOVED' ORDER BY campaign.name",
);
console.log('CAMPAIGNS:');
for (const r of cs) console.log('  [' + r.campaign.status + ']  ' + r.campaign.name + '  bidding=' + r.campaign.bidding_strategy_type);

const ags = await customer.query(
  "SELECT ad_group.name, ad_group.status, campaign.name FROM ad_group WHERE ad_group.status != 'REMOVED' ORDER BY campaign.name, ad_group.name",
);
console.log('\nAD GROUPS:');
for (const r of ags) console.log('  [' + r.ad_group.status + ']  ' + r.campaign.name + ' / ' + r.ad_group.name);

const ads = await customer.query(
  "SELECT ad_group_ad.status, ad_group_ad.policy_summary.approval_status, ad_group.name, campaign.name FROM ad_group_ad WHERE ad_group_ad.status != 'REMOVED'",
);
console.log('\nADS:');
for (const r of ads) console.log('  [' + r.ad_group_ad.status + ' / ' + (r.ad_group_ad.policy_summary?.approval_status || '?') + ']  ' + r.campaign.name + ' / ' + r.ad_group.name);
