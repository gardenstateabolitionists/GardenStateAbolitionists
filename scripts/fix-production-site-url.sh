#!/usr/bin/env bash
# Correct NEXT_PUBLIC_SITE_URL in Vercel production and force a fresh build.
#
# WHY: the fork inherited AAM's value, so the live site served
#   <link rel="canonical" href="https://www.abolishabortionmichigan.com"/>
# on every page and a sitemap advertising 215 GSA URLs under the AAM domain.
#
# Run from the repo root AFTER `vercel login` (the CLI token for the
# garden-state-abolitionists team had expired).
set -euo pipefail

SCOPE=garden-state-abolitionists
URL=https://www.gardenstateabolitionists.com

echo "== current =="
vercel env ls production --scope "$SCOPE" | grep -i site_url || echo "  (not set)"

# Remove then re-add: `vercel env add` will not overwrite in place.
vercel env rm NEXT_PUBLIC_SITE_URL production --scope "$SCOPE" --yes 2>/dev/null || true

# --no-sensitive is REQUIRED. Production defaults to sensitive, and a sensitive
# NEXT_PUBLIC_* is never inlined into the client bundle -- it silently becomes
# undefined in the browser. printf avoids the BOM that PowerShell piping adds.
printf '%s' "$URL" | vercel env add NEXT_PUBLIC_SITE_URL production --scope "$SCOPE" --no-sensitive

echo "== readback =="
vercel env pull /tmp/gsa-env-check --environment=production --scope "$SCOPE" >/dev/null 2>&1 || true
grep NEXT_PUBLIC_SITE_URL /tmp/gsa-env-check || echo "  (pull unavailable; check the dashboard)"
rm -f /tmp/gsa-env-check

# NEXT_PUBLIC_* is inlined at BUILD time, so the env change alone changes
# nothing until a new build runs.
git commit --allow-empty -m "Rebuild with the corrected production site URL"
git push

echo
echo "Deploy triggered. When it finishes, verify:"
echo "  curl -s $URL/ | grep -o '<link rel=\"canonical\"[^>]*>'"
echo "  curl -s $URL/sitemap.xml | head -5"
