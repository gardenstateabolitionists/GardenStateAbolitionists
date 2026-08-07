#!/usr/bin/env node
/**
 * Attach a Target CPA to the Maximize Conversions bidding strategy on
 * all GSA plan campaigns. This gives the algorithm a bid signal
 * immediately instead of waiting for conversion history to accumulate
 * — a documented workaround for the Ad Grants cold-start problem
 * where new Maximize-Conversions campaigns bid so low they win 0 auctions.
 *
 * Usage:
 *   node scripts/google-ads/set-target-cpa.mjs               # $15 default
 *   node scripts/google-ads/set-target-cpa.mjs --cpa=20      # $20
 *   node scripts/google-ads/set-target-cpa.mjs --dry-run
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

const args = new Map();
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
  if (m) args.set(m[1], m[2] ?? 'true');
}
const CPA_USD = Number(args.get('cpa') || 15);
const DRY_RUN = args.get('dry-run') === 'true';
const CPA_MICROS = Math.round(CPA_USD * 1_000_000);

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
const wantList = [...wantNames].map((n) => `'${n.replace(/'/g, "\\'")}'`).join(',');
const rows = await customer.query(
  `SELECT campaign.resource_name, campaign.name, campaign.bidding_strategy_type,
          campaign.maximize_conversions.target_cpa_micros,
          campaign.target_cpa.target_cpa_micros
   FROM campaign
   WHERE campaign.name IN (${wantList})
     AND campaign.status != 'REMOVED'`,
);

console.log('Setting Target CPA = $' + CPA_USD + ' on ' + rows.length + ' campaign(s).');
console.log('Mode: ' + (DRY_RUN ? 'DRY RUN' : 'LIVE'));
console.log('');

// Bidding-strategy-type enum values we accept:
//   6  = MAXIMIZE_CONVERSIONS (write target via campaign.maximize_conversions.target_cpa_micros)
//   10 = TARGET_CPA           (write target via campaign.target_cpa.target_cpa_micros)
// Anything else = someone changed the strategy in the UI; skip and warn.
const STRATEGY_MC = 6;
const STRATEGY_TCPA = 10;

for (const r of rows) {
  const isMC = r.campaign.bidding_strategy_type === STRATEGY_MC;
  const isTCPA = r.campaign.bidding_strategy_type === STRATEGY_TCPA;
  const currentMicros = isMC
    ? Number(r.campaign.maximize_conversions?.target_cpa_micros || 0)
    : Number(r.campaign.target_cpa?.target_cpa_micros || 0);
  const currentDollars = currentMicros / 1_000_000;
  const stratLabel = isMC ? 'Maximize Conversions' : isTCPA ? 'Target CPA' : 'OTHER (' + r.campaign.bidding_strategy_type + ')';
  console.log('  ' + r.campaign.name);
  console.log('    bidding_strategy_type: ' + stratLabel);
  console.log('    current target CPA:    $' + currentDollars);
  console.log('    -> new target CPA:     $' + CPA_USD);
}

if (DRY_RUN) {
  console.log('\nDry run — no changes made.');
  process.exit(0);
}

const eligible = rows.filter((r) => r.campaign.bidding_strategy_type === STRATEGY_MC || r.campaign.bidding_strategy_type === STRATEGY_TCPA);
if (eligible.length !== rows.length) {
  console.log('\nSkipping ' + (rows.length - eligible.length) + ' campaign(s) with unexpected bidding strategy.');
}
if (eligible.length === 0) {
  console.log('Nothing to update.');
  process.exit(0);
}

// Always write via maximize_conversions.target_cpa_micros — even for
// campaigns whose bidding_strategy_type reports as TARGET_CPA (10),
// which is a derived reporting value. The underlying strategy object
// on these campaigns is maximize_conversions; the "Target CPA" label
// just reflects the presence of a non-zero target_cpa_micros inside
// it. Writing to campaign.target_cpa directly gets rejected as
// "operation not allowed for the given context".
const updates = eligible.map((r) => ({
  resource_name: r.campaign.resource_name,
  maximize_conversions: { target_cpa_micros: CPA_MICROS },
}));

const res = await customer.campaigns.update(updates);
console.log('\nUpdated ' + res.results.length + ' campaign(s).');
console.log('Google should start bidding meaningfully within 24-48 hrs; first impressions typically show up next day.');
console.log('Run `node scripts/google-ads/_health.mjs` tomorrow to check.');
