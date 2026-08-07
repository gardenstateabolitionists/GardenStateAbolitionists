#!/usr/bin/env node
/**
 * Hard reset for GSA plan campaigns: removes every non-REMOVED ad,
 * ad group, campaign, and budget whose CAMPAIGN NAME matches an entry
 * in plan.mjs — including orphaned children of already-removed
 * campaigns from failed earlier builds. Safe: never touches anything
 * outside the plan campaign names.
 *
 * Usage:  node scripts/google-ads/nuclear-reset.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAdsApi } from 'google-ads-api';
import { CAMPAIGNS } from './plan.mjs';

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

const wantNames = new Set(CAMPAIGNS.map((c) => c.name));
const inList = [...wantNames].map((n) => `'${n.replace(/'/g, "\\'")}'`).join(',');

// 1) Find all non-REMOVED ads under any campaign with a plan-matching name
const ads = await customer.query(
  `SELECT ad_group_ad.resource_name, campaign.name
   FROM ad_group_ad
   WHERE ad_group_ad.status != 'REMOVED'
     AND campaign.name IN (${inList})`,
);
if (ads.length) {
  console.log('Removing ' + ads.length + ' ad(s)');
  await customer.adGroupAds.remove(ads.map((r) => r.ad_group_ad.resource_name));
}

// 2) Ad groups
const ags = await customer.query(
  `SELECT ad_group.resource_name, campaign.name
   FROM ad_group
   WHERE ad_group.status != 'REMOVED'
     AND campaign.name IN (${inList})`,
);
if (ags.length) {
  console.log('Removing ' + ags.length + ' ad group(s)');
  await customer.adGroups.remove(ags.map((r) => r.ad_group.resource_name));
}

// 3) Campaigns
const cs = await customer.query(
  `SELECT campaign.resource_name, campaign_budget.resource_name, campaign.name
   FROM campaign
   WHERE campaign.status != 'REMOVED'
     AND campaign.name IN (${inList})`,
);
if (cs.length) {
  console.log('Removing ' + cs.length + ' campaign(s)');
  await customer.campaigns.remove(cs.map((r) => r.campaign.resource_name));
  const budgets = [...new Set(cs.map((r) => r.campaign_budget?.resource_name).filter(Boolean))];
  if (budgets.length) {
    console.log('Removing ' + budgets.length + ' budget(s)');
    await customer.campaignBudgets.remove(budgets);
  }
}

console.log('Nuclear reset complete.');
