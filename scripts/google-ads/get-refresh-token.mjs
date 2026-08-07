#!/usr/bin/env node
/**
 * One-time helper: capture a Google OAuth refresh token for the Google
 * Ads API and append it to .env.local.
 *
 * Prereqs (already done via scripts/google-ads/parse-creds if you got
 * here through the normal flow):
 *   GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET must be set in
 *   .env.local. Client type must be "Desktop app" in Google Cloud
 *   Console — Web-app clients require pre-registered redirect URIs
 *   and will refuse the http://localhost callback.
 *
 * How it works:
 *   1. Spins up a tiny HTTP server on 127.0.0.1:3737
 *   2. Prints the Google consent URL — you open it in a browser
 *   3. Google redirects back to the local server with an auth code
 *   4. Script exchanges the code for a refresh_token
 *   5. Appends GOOGLE_ADS_REFRESH_TOKEN=... to .env.local
 *
 * Only needs to be run once. The refresh token doesn't expire unless
 * you revoke it in your Google account or the app is left unused for
 * six months.
 *
 * Usage:  node scripts/google-ads/get-refresh-token.mjs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { URL, URLSearchParams, fileURLToPath } from 'node:url';

// Use fileURLToPath so paths containing spaces (e.g. "Garden State Abolitionists") are
// properly decoded — new URL('..', import.meta.url).pathname leaves %20
// in place on Windows, which then fails to open .env.local.
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const ENV_PATH = path.join(REPO_ROOT, '.env.local');
const PORT = 3737;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
// Ask for both scopes so the single refresh token covers Ads AND
// Search Console. Regenerating the token replaces the earlier
// adwords-only one; Ads keeps working because the new token
// includes adwords in its scope set.
const SCOPES = [
  'https://www.googleapis.com/auth/adwords',
  'https://www.googleapis.com/auth/webmasters.readonly',
];

// Load .env.local into process.env (no dotenv dep needed)
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
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing GOOGLE_ADS_CLIENT_ID or GOOGLE_ADS_CLIENT_SECRET in .env.local.');
  console.error('Complete Phase 2 (create OAuth 2.0 Desktop client in Google Cloud Console) first.');
  process.exit(1);
}

// Build the consent URL
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('access_type', 'offline'); // <-- gives us a refresh_token
authUrl.searchParams.set('prompt', 'consent'); // <-- forces a fresh refresh_token even if we've consented before

console.log('\n1) Open this URL in your browser:');
console.log('\n' + authUrl.toString() + '\n');
console.log('2) Sign in with the Google account tied to your Ad Grants + Cloud project.');
console.log("3) You'll see a 'Google hasn't verified this app' warning — that's expected");
console.log('   because our OAuth consent screen is in Testing mode. Click Advanced');
console.log("   -> 'Go to Garden State Abolitionists Google Ads Integration (unsafe)'. Only you can consent");
console.log('   (you added yourself as the only test user).');
console.log('4) Approve the "Manage your AdWords campaigns" scope.');
console.log('5) You will be redirected to a local page that will close this loop.');
console.log('\nListening on ' + REDIRECT_URI + ' ...');

const server = http.createServer(async (req, res) => {
  if (!req.url) return;
  const reqUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (reqUrl.pathname !== '/callback') {
    res.writeHead(404).end('Not found');
    return;
  }

  const code = reqUrl.searchParams.get('code');
  const errParam = reqUrl.searchParams.get('error');
  if (errParam) {
    res.writeHead(400, { 'Content-Type': 'text/plain' })
      .end('Google returned an error: ' + errParam + '. Check the terminal and try again.');
    console.error('\nOAuth error from Google: ' + errParam);
    server.close();
    process.exit(1);
  }
  if (!code) {
    res.writeHead(400).end('Missing ?code param.');
    return;
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.refresh_token) {
      throw new Error('Token exchange failed: ' + JSON.stringify(tokens));
    }

    // Append to .env.local (strip any prior GOOGLE_ADS_REFRESH_TOKEN line)
    let env = '';
    try { env = fs.readFileSync(ENV_PATH, 'utf8'); } catch {}
    const filtered = env.split(/\r?\n/)
      .filter((l) => !/^\s*GOOGLE_ADS_REFRESH_TOKEN\s*=/.test(l))
      .join('\n')
      .replace(/\n+$/, '');
    fs.writeFileSync(
      ENV_PATH,
      filtered + '\nGOOGLE_ADS_REFRESH_TOKEN=' + tokens.refresh_token + '\n',
      { mode: 0o600 },
    );

    res.writeHead(200, { 'Content-Type': 'text/html' }).end(
      '<!doctype html><meta charset="utf-8"><title>Done</title>' +
      '<div style="font-family:system-ui;padding:2rem;max-width:36rem;margin:auto;">' +
      '<h1>Refresh token captured.</h1>' +
      '<p>Written to <code>.env.local</code>. You can close this tab and return to your terminal.</p>' +
      '</div>',
    );
    console.log('\nGOOGLE_ADS_REFRESH_TOKEN captured and written to .env.local.');
    console.log('You can close the browser tab. Setup complete.');
    // Give the response a beat to flush before exiting
    setTimeout(() => { server.close(); process.exit(0); }, 500);
  } catch (e) {
    res.writeHead(500).end('Token exchange failed. Check terminal.');
    console.error('\nToken exchange error:', e);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, '127.0.0.1');
