// Shared helper for the search-console scripts.
//
// Reads OAuth creds from .env.local, exchanges the refresh token for a
// short-lived access token, and exposes a fetch() wrapper that hits the
// Search Console REST API (v1) with proper auth headers.
//
// No googleapis client dependency — the SC API is a simple REST surface
// and pulling in googleapis for it doubles the install cost.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN;

// Reused: same OAuth client + refresh token as Google Ads. The token
// carries both scopes (adwords + webmasters.readonly) after the
// get-refresh-token.mjs rerun.
if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  throw new Error(
    'Missing GOOGLE_ADS_CLIENT_ID / _CLIENT_SECRET / _REFRESH_TOKEN in .env.local. ' +
      'Rerun scripts/google-ads/get-refresh-token.mjs to regenerate a token that covers ' +
      'both Ads and Search Console scopes.',
  );
}

let cachedToken = null;
let cachedExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedExpiry - 60_000) return cachedToken;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error('Token refresh failed: ' + JSON.stringify(data));
  }
  cachedToken = data.access_token;
  cachedExpiry = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

/** GET wrapper for the Search Console REST API. */
export async function scGet(pathAndQuery) {
  const token = await getAccessToken();
  const url = 'https://searchconsole.googleapis.com/webmasters/v3' + pathAndQuery;
  const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
  const text = await res.text();
  if (!res.ok) throw new Error('SC GET ' + pathAndQuery + ' failed: ' + res.status + ' ' + text);
  return text ? JSON.parse(text) : null;
}

/** POST wrapper. */
export async function scPost(pathAndQuery, body) {
  const token = await getAccessToken();
  const url = 'https://searchconsole.googleapis.com/webmasters/v3' + pathAndQuery;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error('SC POST ' + pathAndQuery + ' failed: ' + res.status + ' ' + text);
  return text ? JSON.parse(text) : null;
}
