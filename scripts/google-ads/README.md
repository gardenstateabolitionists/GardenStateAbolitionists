# Google Ads scripts

Programmatic management of the Garden State Abolitionists Ad Grants Google Ads account. See
`docs/google-ads-campaign-plan.md` for the narrative campaign plan and
`plan.mjs` in this folder for the machine-readable version the
builder executes.

## Files

| File | What it does |
|---|---|
| `get-refresh-token.mjs` | One-time OAuth helper — spins up a local server, opens Google consent flow, writes `GOOGLE_ADS_REFRESH_TOKEN` to `.env.local`. Only run once. |
| `smoke-test.mjs` | Validates all 6 credentials work by listing accessible customers and querying the target account. Run this after any credential change. |
| `plan.mjs` | Campaign definitions (data only, no side effects). Edit here to change what the builder creates. |
| `build-campaigns.mjs` | Reads `plan.mjs` and creates all 3 campaigns + ad groups + keywords + ads in the account, **paused by default**. Supports `--dry-run`. Idempotent — skips campaigns whose name already exists. |
| `enable-campaigns.mjs` | Flips every plan campaign + its ad groups + ads from PAUSED to ENABLED. |
| `reset-plan-campaigns.mjs` | Deletes every plan campaign (and its budget). Safe: only touches campaigns whose names match `plan.mjs`. Use before a clean rebuild. |
| `nuclear-reset.mjs` | Aggressive cleanup for when `reset` leaves orphans behind. Removes every non-REMOVED ad/adgroup/campaign matching a plan name — including children of already-removed parents where possible. |
| `status.mjs` | Read-only health check — prints every plan campaign, ad group, and ad with its current status. Use to verify state without opening the Google Ads UI. |
| `list-conversions.mjs` | Read-only — lists every conversion action on the account with id, name, and status. Use when wiring `NEXT_PUBLIC_GOOGLE_ADS_CONV_*` env vars. |

## Env vars (all in `.env.local`, never committed)

```
GOOGLE_ADS_CUSTOMER_ID        # Ad Grants child account, 10 digits, no dashes
GOOGLE_ADS_LOGIN_CUSTOMER_ID  # MCC parent account, 10 digits, no dashes
GOOGLE_ADS_DEVELOPER_TOKEN    # From the MCC's API Center
GOOGLE_ADS_CLIENT_ID          # OAuth 2.0 Desktop client, from Google Cloud Console
GOOGLE_ADS_CLIENT_SECRET      # From the same OAuth client
GOOGLE_ADS_REFRESH_TOKEN      # Written by get-refresh-token.mjs
```

## Typical run flow (first-time build)

```bash
# 1. Preview — no API writes
node scripts/google-ads/build-campaigns.mjs --dry-run

# 2. Create (everything lands paused)
node scripts/google-ads/build-campaigns.mjs

# 3. Review in the Google Ads UI:
#    - Are the keywords right?
#    - Do the ads pass Google's review?
#    - Are the landing pages the ones you want?
# When happy, enable each campaign in the UI.
```

## Safety guarantees

- **Nothing goes live automatically.** Every campaign, ad group, and ad is created with `status: PAUSED`. You must flip switches in the UI.
- **No duplicates.** The builder queries existing campaign names and skips any that already exist. To recreate a campaign, delete it in the UI first.
- **No secret spend.** Ad Grants gives a $10K/mo credit, not a real bill. Even if a campaign got enabled unintentionally, the account cannot overspend the credit.

## Ad Grants compliance rules baked in

- Manual CPC bidding at ≤ $2.00 (Grants max)
- New Jersey geo-target on every campaign
- Search network only (partners disabled)
- Standard budget delivery
- Every keyword ≥ 2 words (no single-word or overly-generic terms)

If Google Ads later rejects any keyword for Grants-specific reasons, edit `plan.mjs` and re-run — the builder is idempotent on already-created campaigns and will only add what's missing.
