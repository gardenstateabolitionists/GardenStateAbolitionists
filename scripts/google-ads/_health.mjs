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

const S = { 2: 'ENABLED', 3: 'PAUSED', 4: 'REMOVED' };
const AP = { 1: 'UNKNOWN', 2: 'DISAPPROVED', 3: 'APPROVED_LIMITED', 4: 'APPROVED', 5: 'AREA_OF_INTEREST_ONLY' };

// Campaign-level metrics (last 7 days)
const cs = await customer.query(`
  SELECT campaign.name, campaign.status, campaign.serving_status,
         metrics.impressions, metrics.clicks, metrics.ctr, metrics.cost_micros,
         metrics.conversions, metrics.average_cpc
  FROM campaign
  WHERE campaign.name IN ('GSA — Petition', 'GSA — Educational', 'GSA — Donations')
    AND campaign.status != 'REMOVED'
    AND segments.date DURING LAST_7_DAYS
`);
console.log('CAMPAIGNS (last 7 days):');
for (const r of cs) {
  console.log('  ' + r.campaign.name);
  console.log('    status:        ' + S[r.campaign.status] + '  serving=' + r.campaign.serving_status);
  console.log('    impressions:   ' + r.metrics.impressions);
  console.log('    clicks:        ' + r.metrics.clicks + '  (CTR ' + (Number(r.metrics.ctr) * 100).toFixed(2) + '%)');
  console.log('    cost:          $' + (Number(r.metrics.cost_micros) / 1_000_000).toFixed(2));
  console.log('    conversions:   ' + Number(r.metrics.conversions).toFixed(1));
}

// Ad approval status
const ads = await customer.query(`
  SELECT ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.review_status,
         campaign.name, ad_group.name
  FROM ad_group_ad
  WHERE campaign.name IN ('GSA — Petition', 'GSA — Educational', 'GSA — Donations')
    AND ad_group_ad.status != 'REMOVED'
`);
console.log('\nADS APPROVAL:');
const approved = ads.filter((r) => r.ad_group_ad.policy_summary?.approval_status === 4).length;
const limited = ads.filter((r) => r.ad_group_ad.policy_summary?.approval_status === 3).length;
const disapproved = ads.filter((r) => r.ad_group_ad.policy_summary?.approval_status === 2).length;
console.log('  ' + approved + ' approved, ' + limited + ' approved-limited, ' + disapproved + ' disapproved (of ' + ads.length + ' total)');
if (disapproved > 0) {
  console.log('  DISAPPROVED ADS:');
  for (const r of ads) {
    if (r.ad_group_ad.policy_summary?.approval_status === 2) {
      console.log('    ' + r.campaign.name + ' / ' + r.ad_group.name);
    }
  }
}

// Keyword approval — check for any disapproved
const kws = await customer.query(`
  SELECT ad_group_criterion.keyword.text, ad_group_criterion.approval_status,
         ad_group_criterion.status, campaign.name
  FROM ad_group_criterion
  WHERE campaign.name IN ('GSA — Petition', 'GSA — Educational', 'GSA — Donations')
    AND ad_group_criterion.type = 'KEYWORD'
    AND ad_group_criterion.status != 'REMOVED'
`);
// For AdGroupCriterion.approval_status: 2=APPROVED, 3=DISAPPROVED, 4=PENDING, 5=UNDER_REVIEW
const kwApproved = kws.filter((r) => r.ad_group_criterion.approval_status === 2).length;
const kwDisapproved = kws.filter((r) => r.ad_group_criterion.approval_status === 3).length;
const kwPending = kws.filter((r) => r.ad_group_criterion.approval_status === 4 || r.ad_group_criterion.approval_status === 5).length;
console.log('\nKEYWORDS APPROVAL:');
console.log('  ' + kws.length + ' total keywords');
console.log('  ' + kwApproved + ' approved, ' + kwPending + ' pending review, ' + kwDisapproved + ' disapproved');
if (kwDisapproved > 0) {
  console.log('  DISAPPROVED KEYWORDS:');
  for (const r of kws) {
    if (r.ad_group_criterion.approval_status === 3) {
      console.log('    "' + r.ad_group_criterion.keyword.text + '"  in  ' + r.campaign.name);
    }
  }
}
