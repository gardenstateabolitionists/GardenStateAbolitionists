# Search Console scripts

Programmatic reporting from Google Search Console. Uses the same Google
Cloud project and OAuth client as `scripts/google-ads/` — the refresh
token in `.env.local` (`GOOGLE_ADS_REFRESH_TOKEN`) now covers both
`adwords` and `webmasters.readonly` scopes after the get-refresh-token
rerun.

## One-time setup (done)

1. Enable the Search Console API on the Cloud project:
   https://console.cloud.google.com/apis/library/searchconsole.googleapis.com
2. Verify the property in the Search Console UI (must be done for this
   site has been receiving crawl reports for months).
3. Rerun `node scripts/google-ads/get-refresh-token.mjs` — the scope
   list now includes `webmasters.readonly`, so the new refresh token
   covers both Ads and Search Console. This replaces the earlier
   Ads-only token; Ads scripts keep working because the new token
   still includes the `adwords` scope.

## Files

| File | What it does |
|---|---|
| `_client.mjs` | Shared REST wrapper. Reads OAuth creds from `.env.local`, refreshes the access token, exposes `scGet(path)` and `scPost(path, body)`. |
| `smoke-test.mjs` | Confirms creds work end-to-end. Lists reachable properties and pulls a 5-row sample from the searchAnalytics endpoint. |
| `top-queries.mjs` | Report — top N queries over the last N days with impressions, clicks, CTR, and average position. Highlights page-2 (position 11-20) queries as "low-hanging fruit". |

## Usage

```bash
# Smoke test after setup
node scripts/search-console/smoke-test.mjs

# Top 30 queries over the last 28 days
node scripts/search-console/top-queries.mjs

# Top 100 queries over the last 7 days, filtered to real signal
node scripts/search-console/top-queries.mjs --days=7 --limit=100 --min-impressions=10
```

## The target property

By default the scripts hit `sc-domain:gardenstateabolitionists.org` (the
Domain property in Search Console — covers all subdomains and both
http/https). If the Search Console setup is instead a URL-prefix
property (`https://www.gardenstateabolitionists.org/`), set:

```
SEARCH_CONSOLE_SITE=https://www.gardenstateabolitionists.org/
```

in `.env.local`. The smoke test prints the correct value to paste.

## Rate limits

Search Console API is generous — 1200 queries/minute is the ceiling.
Nothing in these scripts risks hitting it.

## What to add next

Ideas we haven't built yet — say the word and I'll add:
- `top-pages.mjs` — same shape as top-queries but by URL
- `weekly-digest.mjs` — one-shot digest with week-over-week delta, ships
  to admin email
- `find-canonical-issues.mjs` — queries the URL Inspection API for a
  batch of URLs to detect indexing status (the "Alternate canonical"
  report from earlier, but per-URL)
- `crawl-errors.mjs` — pulls Coverage-report-equivalent data
