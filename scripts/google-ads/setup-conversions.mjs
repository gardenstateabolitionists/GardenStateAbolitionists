#!/usr/bin/env node
/**
 * Create the 4 conversion actions the site is already wired to fire
 * (lib/google-ads.ts fires 'petition', 'inquiry', 'newsletter', 'donate'),
 * then extract each one's AW-ID/label so we can plug them into Vercel
 * env vars.
 *
 * Idempotent: skips any conversion action whose name is already present.
 * Prints a ready-to-paste `printf | vercel env add` block at the end so
 * you can either run it directly or hand it to me.
 *
 * Usage:  node scripts/google-ads/setup-conversions.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAdsApi, enums } from 'google-ads-api';

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

// 4 conversion actions, matching the 4 action names in lib/google-ads.ts
const PLAN = [
  { key: 'petition',   name: 'GSA Petition Signed',      category: enums.ConversionActionCategory.SUBMIT_LEAD_FORM },
  { key: 'inquiry',    name: 'GSA Contact Inquiry',      category: enums.ConversionActionCategory.CONTACT },
  { key: 'newsletter', name: 'GSA Newsletter Subscribed', category: enums.ConversionActionCategory.SIGNUP },
  { key: 'donate',     name: 'GSA Donation Click',       category: enums.ConversionActionCategory.PURCHASE },
];

// 1. Pull the customer's AdWords conversion-tracking ID (the AW-XXXXX part).
const tsRows = await customer.query(
  'SELECT customer.conversion_tracking_setting.conversion_tracking_id FROM customer',
);
const conversionTrackingId = tsRows[0]?.customer?.conversion_tracking_setting?.conversion_tracking_id;
if (!conversionTrackingId) {
  console.error('Could not read customer.conversion_tracking_setting.conversion_tracking_id');
  process.exit(1);
}
console.log('AdWords conversion tracking ID: AW-' + conversionTrackingId);

// 2. See which named conversions already exist
const existing = await customer.query(
  "SELECT conversion_action.name, conversion_action.resource_name FROM conversion_action WHERE conversion_action.status != 'REMOVED'",
);
const byName = new Map(existing.map((r) => [r.conversion_action.name, r.conversion_action.resource_name]));

// 3. Create any missing
const toCreate = PLAN.filter((p) => !byName.has(p.name));
if (toCreate.length > 0) {
  console.log('\nCreating ' + toCreate.length + ' new conversion actions:');
  for (const p of toCreate) console.log('  - ' + p.name + '   (category=' + p.category + ')');
  const res = await customer.conversionActions.create(
    toCreate.map((p) => ({
      name: p.name,
      status: enums.ConversionActionStatus.ENABLED,
      type: enums.ConversionActionType.WEBPAGE,
      category: p.category,
      value_settings: {
        default_value: p.key === 'donate' ? 25 : 0,
        default_currency_code: 'USD',
        always_use_default_value: p.key !== 'donate',
      },
      counting_type: enums.ConversionActionCountingType.ONE_PER_CLICK,
      click_through_lookback_window_days: 30,
      view_through_lookback_window_days: 1,
      // include_in_conversions_metric is immutable — Google auto-sets it true.
    })),
  );
  console.log('Created:');
  for (const r of res.results) {
    console.log('  ' + r.resource_name);
    // Backfill the name->resource_name map
    const created = toCreate.shift();
    if (created) byName.set(created.name, r.resource_name);
  }
} else {
  console.log('All 4 conversion actions already exist. Skipping creation.');
}

// 4. Fetch back the tag snippets for the 4 we care about, extract each label
const wantNames = PLAN.map((p) => p.name);
const wantNamesQuoted = wantNames.map((n) => `'${n.replace(/'/g, "\\'")}'`).join(',');
const detail = await customer.query(`
  SELECT conversion_action.name, conversion_action.id, conversion_action.tag_snippets,
         conversion_action.resource_name
  FROM conversion_action
  WHERE conversion_action.name IN (${wantNamesQuoted})
    AND conversion_action.status != 'REMOVED'
`);

console.log('\n----- Conversion label extraction -----');
const labels = {};
for (const p of PLAN) {
  const row = detail.find((r) => r.conversion_action.name === p.name);
  if (!row) { console.log('  ' + p.name + ': not found'); continue; }
  // Each tag_snippet has an event_snippet — the JS with send_to: 'AW-XXX/YYY'
  const snippets = row.conversion_action.tag_snippets || [];
  let label = null;
  for (const s of snippets) {
    const m = (s.event_snippet || '').match(/send_to['"]?\s*:\s*['"]AW-\d+\/([A-Za-z0-9_-]+)['"]/);
    if (m) { label = m[1]; break; }
  }
  if (!label) {
    console.log('  ' + p.name + ': label not yet available (Google may take a few min after create). Retry in ~2 min.');
    continue;
  }
  const sendTo = 'AW-' + conversionTrackingId + '/' + label;
  labels[p.key] = sendTo;
  console.log('  ' + p.name.padEnd(30) + ' -> ' + sendTo);
}

if (Object.keys(labels).length < 4) {
  console.log('\nMissing labels — cannot generate env vars yet. Re-run in 2 min.');
  process.exit(0);
}

console.log('\n----- Vercel env vars to set (all --no-sensitive since NEXT_PUBLIC_*) -----');
const envs = {
  NEXT_PUBLIC_GOOGLE_ADS_ID: 'AW-' + conversionTrackingId,
  NEXT_PUBLIC_GOOGLE_ADS_CONV_PETITION: labels.petition,
  NEXT_PUBLIC_GOOGLE_ADS_CONV_INQUIRY: labels.inquiry,
  NEXT_PUBLIC_GOOGLE_ADS_CONV_NEWSLETTER: labels.newsletter,
  NEXT_PUBLIC_GOOGLE_ADS_CONV_DONATE: labels.donate,
};
for (const [k, v] of Object.entries(envs)) {
  console.log('  ' + k + ' = ' + v);
}

// Emit shell commands to a file the calling shell can source or exec
const shPath = path.join(REPO_ROOT, 'scripts', 'google-ads', '_apply-vercel-envs.sh');
const lines = [
  '#!/usr/bin/env bash',
  '# Auto-generated by setup-conversions.mjs. Run once from repo root:',
  '#   bash scripts/google-ads/_apply-vercel-envs.sh',
  '# Then push an empty commit to force a fresh build.',
  'set -e',
  '',
];
for (const [k, v] of Object.entries(envs)) {
  lines.push('vercel env rm ' + k + ' production -y 2>/dev/null || true');
  lines.push("printf '%s' '" + v + "' | vercel env add " + k + ' production --no-sensitive');
  lines.push('');
}
fs.writeFileSync(shPath, lines.join('\n'), { mode: 0o700 });
console.log('\nWrote ' + shPath);
console.log('Run:  bash scripts/google-ads/_apply-vercel-envs.sh');
