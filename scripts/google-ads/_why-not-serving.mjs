import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAdsApi } from 'google-ads-api';

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

// 1) Impression share — did we lose every auction, or were we not eligible?
const shareRows = await customer.query(`
  SELECT campaign.name,
         metrics.search_impression_share,
         metrics.search_budget_lost_impression_share,
         metrics.search_rank_lost_impression_share
  FROM campaign
  WHERE campaign.name IN ('GSA — Petition', 'GSA — Educational', 'GSA — Donations')
    AND campaign.status != 'REMOVED'
    AND segments.date DURING LAST_30_DAYS
`);
console.log('=== SEARCH IMPRESSION SHARE (last 30 days) ===');
if (shareRows.length === 0) console.log('  (no impression-share data yet — expected for a brand-new account)');
for (const r of shareRows) {
  console.log('  ' + r.campaign.name);
  console.log('    search impression share:      ' + r.metrics.search_impression_share);
  console.log('    lost to budget:               ' + r.metrics.search_budget_lost_impression_share);
  console.log('    lost to Ad Rank (bids/QS):    ' + r.metrics.search_rank_lost_impression_share);
}

// 2) Bidding strategy actual bid + Learning-phase status
const bidRows = await customer.query(`
  SELECT campaign.name, campaign.bidding_strategy_type,
         campaign.maximize_conversions.target_cpa_micros,
         campaign.status
  FROM campaign
  WHERE campaign.name IN ('GSA — Petition', 'GSA — Educational', 'GSA — Donations')
    AND campaign.status != 'REMOVED'
`);
console.log('\n=== BIDDING STRATEGY ===');
for (const r of bidRows) {
  console.log('  ' + r.campaign.name);
  console.log('    bidding_strategy_type: ' + r.campaign.bidding_strategy_type + '  (6=Maximize Conversions)');
  if (r.campaign.maximize_conversions && r.campaign.maximize_conversions.target_cpa_micros) {
    console.log('    target CPA micros:     ' + r.campaign.maximize_conversions.target_cpa_micros);
  } else {
    console.log('    target CPA:            (not set — pure Max Conversions)');
  }
}

// 3) Any Ad-Grants-specific "Recommendations" Google surfaces
try {
  const recs = await customer.query(`
    SELECT recommendation.type, recommendation.dismissed, recommendation.impact.base_metrics.impressions
    FROM recommendation
    WHERE recommendation.dismissed = false
    LIMIT 20
  `);
  console.log('\n=== ACTIVE RECOMMENDATIONS FROM GOOGLE (' + recs.length + ') ===');
  for (const r of recs) {
    console.log('  ' + r.recommendation.type + '  (est ' + (r.recommendation.impact?.base_metrics?.impressions || 0) + ' impressions)');
  }
  if (recs.length === 0) console.log('  (none)');
} catch (e) {
  console.log('\nRecommendations query failed: ' + (e.message || e));
}
