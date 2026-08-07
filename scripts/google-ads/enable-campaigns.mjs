#!/usr/bin/env node
/**
 * Flip every plan.mjs campaign from PAUSED to ENABLED.
 *
 * "Enabling" only changes the status flag; if a campaign is otherwise
 * ineligible to serve (bidding strategy, missing conversion actions,
 * disapproved ads, Ad Grants compliance issue), it stays not-serving
 * until those are fixed. Enabling is safe — no wasted spend on Grants.
 *
 * Usage:  node scripts/google-ads/enable-campaigns.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAdsApi, enums } from 'google-ads-api';
import { CAMPAIGNS } from './plan.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ENV_PATH = path.join(REPO_ROOT, '.env.local');
function loadEnvFile(p) {
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
    if (!m) continue;
    if (!(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnvFile(ENV_PATH);

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

const wantNames = new Set(CAMPAIGNS.map((c) => c.name));

const rows = await customer.query(
  "SELECT campaign.resource_name, campaign.name, campaign.status FROM campaign WHERE campaign.status != 'REMOVED'",
);
const targets = rows.filter((r) => wantNames.has(r.campaign.name));

if (targets.length === 0) {
  console.log('No plan.mjs campaigns found in the account.');
  process.exit(0);
}

console.log('Enabling ' + targets.length + ' campaign(s):');

// Also flip PAUSED ad groups + ads that live under these campaigns —
// otherwise a live campaign points at a paused ad group and still
// serves zero impressions.
const campaignResources = targets.map((r) => r.campaign.resource_name);
const inClause = campaignResources.map((r) => `'${r}'`).join(',');

const adGroupRows = await customer.query(
  `SELECT ad_group.resource_name, ad_group.name, ad_group.status
   FROM ad_group
   WHERE ad_group.status = 'PAUSED'
     AND campaign.resource_name IN (${inClause})`,
);

const adRows = await customer.query(
  `SELECT ad_group_ad.resource_name, ad_group_ad.status
   FROM ad_group_ad
   WHERE ad_group_ad.status = 'PAUSED'
     AND campaign.resource_name IN (${inClause})`,
);

// Enable campaigns
const campaignOps = targets.map((r) => ({
  update: {
    resource_name: r.campaign.resource_name,
    status: enums.CampaignStatus.ENABLED,
  },
  update_mask: { paths: ['status'] },
}));

// Enable ad groups
const adGroupOps = adGroupRows.map((r) => ({
  update: {
    resource_name: r.ad_group.resource_name,
    status: enums.AdGroupStatus.ENABLED,
  },
  update_mask: { paths: ['status'] },
}));

// Enable ads
const adOps = adRows.map((r) => ({
  update: {
    resource_name: r.ad_group_ad.resource_name,
    status: enums.AdGroupAdStatus.ENABLED,
  },
  update_mask: { paths: ['status'] },
}));

for (const r of targets) console.log('  campaign  ' + r.campaign.name);
console.log('  + ' + adGroupRows.length + ' ad group(s), ' + adRows.length + ' ad(s)');

await customer.campaigns.update(campaignOps.map((op) => ({
  resource_name: op.update.resource_name,
  status: op.update.status,
})));

if (adGroupOps.length) {
  await customer.adGroups.update(adGroupOps.map((op) => ({
    resource_name: op.update.resource_name,
    status: op.update.status,
  })));
}

if (adOps.length) {
  await customer.adGroupAds.update(adOps.map((op) => ({
    resource_name: op.update.resource_name,
    status: op.update.status,
  })));
}

console.log('\nAll targeted campaigns + ad groups + ads flipped to ENABLED.');
console.log('If any still show "not eligible" in the UI, the reason is a separate');
console.log('policy or bidding issue — the enable flag is now set, but the campaign');
console.log('will only actually serve once the eligibility issue clears.');
