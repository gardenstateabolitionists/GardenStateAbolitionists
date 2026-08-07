#!/usr/bin/env node
/**
 * Utility: delete any campaigns matching the names in plan.mjs, along
 * with their budgets. Use this to clean up after a partial build so the
 * builder can re-run from a clean slate.
 *
 * SAFE: only touches campaigns whose names exactly match the plan.
 * Nothing else in the account is affected.
 *
 * Usage: node scripts/google-ads/reset-plan-campaigns.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAdsApi } from 'google-ads-api';
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

// Skip already-REMOVED campaigns — Google keeps them visible for a
// while, and trying to remove them again is a hard error.
const rows = await customer.query(
  "SELECT campaign.resource_name, campaign.name, campaign.status, campaign_budget.resource_name FROM campaign WHERE campaign.status != 'REMOVED'",
);
const doomed = rows.filter((r) => wantNames.has(r.campaign.name));

if (doomed.length === 0) {
  console.log('No plan.mjs campaigns present in the account. Nothing to clean.');
  process.exit(0);
}

console.log('Deleting ' + doomed.length + ' campaign(s) from the plan:');
for (const r of doomed) console.log('  - ' + r.campaign.name);

const campaignResourceNames = doomed.map((r) => r.campaign.resource_name);
const budgetResourceNames = [
  ...new Set(
    doomed
      .map((r) => r.campaign_budget && r.campaign_budget.resource_name)
      .filter(Boolean),
  ),
];

// Delete campaigns first (budgets can't be deleted while a campaign
// still references them), then their budgets.
await customer.campaigns.remove(campaignResourceNames);
if (budgetResourceNames.length) await customer.campaignBudgets.remove(budgetResourceNames);

console.log('Done. Ready for a clean re-run.');
