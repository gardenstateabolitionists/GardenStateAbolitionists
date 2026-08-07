#!/usr/bin/env node
/**
 * Google Ads API — credentials smoke test.
 *
 * Confirms that all 6 env vars are set, that the developer token +
 * OAuth refresh token exchange works, and that the API can see the
 * customer accounts you have access to. If this succeeds, we're
 * safe to move on to the campaign builder — anything auth-related
 * has been validated end-to-end.
 *
 * Reads from .env.local. Prints nothing sensitive — customer IDs
 * are treated as identifiers, not secrets.
 *
 * Usage:  node scripts/google-ads/smoke-test.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAdsApi } from 'google-ads-api';

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const ENV_PATH = path.join(REPO_ROOT, '.env.local');

function loadEnvFile(p) {
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
    if (!m) continue;
    if (!(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnvFile(ENV_PATH);

const required = [
  'GOOGLE_ADS_CUSTOMER_ID',
  'GOOGLE_ADS_DEVELOPER_TOKEN',
  'GOOGLE_ADS_CLIENT_ID',
  'GOOGLE_ADS_CLIENT_SECRET',
  'GOOGLE_ADS_REFRESH_TOKEN',
  'GOOGLE_ADS_LOGIN_CUSTOMER_ID',
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error('Missing env vars in .env.local:');
  for (const k of missing) console.error('  - ' + k);
  process.exit(1);
}

// Normalize customer IDs — the API refuses IDs containing dashes.
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/[^0-9]/g, '');
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || '').replace(/[^0-9]/g, '');

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

console.log('Testing Google Ads API credentials...');
console.log('  Login (MCC) customer:  ' + LOGIN_CUSTOMER_ID);
console.log('  Target customer:       ' + CUSTOMER_ID);

// 1) Can we list customers reachable from the refresh token?
try {
  const reachable = await client.listAccessibleCustomers(
    process.env.GOOGLE_ADS_REFRESH_TOKEN,
  );
  console.log('\n[1/2] listAccessibleCustomers OK — ' + reachable.resource_names.length + ' account(s) reachable:');
  for (const rn of reachable.resource_names) {
    console.log('        ' + rn);
  }
} catch (e) {
  console.error('\n[1/2] listAccessibleCustomers FAILED:', e?.message || e);
  process.exit(2);
}

// 2) Can we run a simple query against the target customer?
try {
  const customer = client.Customer({
    customer_id: CUSTOMER_ID,
    login_customer_id: LOGIN_CUSTOMER_ID,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });
  const rows = await customer.query(
    "SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone FROM customer LIMIT 1",
  );
  if (rows.length === 0) {
    console.log('\n[2/2] Query OK but no rows returned (unexpected).');
  } else {
    const c = rows[0].customer;
    console.log('\n[2/2] Query OK — target account is:');
    console.log('        Name:     ' + c.descriptive_name);
    console.log('        ID:       ' + c.id);
    console.log('        Currency: ' + c.currency_code);
    console.log('        TZ:       ' + c.time_zone);
  }
} catch (e) {
  console.error('\n[2/2] Query FAILED:', e?.message || e);
  process.exit(3);
}

console.log('\nCredentials all good. Ready to build campaigns.');
