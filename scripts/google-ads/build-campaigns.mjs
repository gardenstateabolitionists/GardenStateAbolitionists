#!/usr/bin/env node
/**
 * Build all three Google Ads campaigns from scripts/google-ads/plan.mjs.
 *
 * Safety defaults:
 *   - Everything is created PAUSED. You enable each campaign yourself
 *     in the Ads UI after reviewing.
 *   - --dry-run prints what would be created without touching the API.
 *   - Idempotent-ish: if a campaign with the same name already exists,
 *     the script skips it and warns. It will NOT create duplicates.
 *
 * Usage:
 *   node scripts/google-ads/build-campaigns.mjs --dry-run   # preview
 *   node scripts/google-ads/build-campaigns.mjs             # create (paused)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAdsApi, enums, ResourceNames } from 'google-ads-api';
import { CAMPAIGNS, ACCOUNT } from './plan.mjs';

// ---------- env ----------
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

const DRY_RUN = process.argv.includes('--dry-run');

const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/[^0-9]/g, '');
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || '').replace(/[^0-9]/g, '');

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});
const customer = client.Customer({
  customer_id: CUSTOMER_ID,
  login_customer_id: LOGIN_CUSTOMER_ID,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

// ---------- helpers ----------
function log(...args) { console.log(...args); }
function usdToMicros(usd) { return Math.round(usd * 1_000_000); }

async function findGeoTargetId(name) {
  const rows = await customer.query(
    `SELECT geo_target_constant.id, geo_target_constant.name, geo_target_constant.country_code, geo_target_constant.target_type
     FROM geo_target_constant
     WHERE geo_target_constant.name = '${name.replace(/'/g, "\\'")}'
       AND geo_target_constant.country_code = 'US'
       AND geo_target_constant.target_type = 'State'
     LIMIT 5`,
  );
  if (rows.length === 0) throw new Error('Geo target not found: ' + name);
  return rows[0].geo_target_constant.id;
}

async function existingCampaignNames() {
  // Google keeps REMOVED campaigns visible for a while — filter them
  // out so a cleanup-then-rebuild flow doesn't skip campaigns we just
  // deleted.
  const rows = await customer.query(
    "SELECT campaign.name FROM campaign WHERE campaign.status != 'REMOVED'",
  );
  return new Set(rows.map((r) => r.campaign.name));
}

function validateAd(rsa) {
  const errs = [];
  if (rsa.headlines.length < 3 || rsa.headlines.length > 15) {
    errs.push('headlines must be 3–15 (got ' + rsa.headlines.length + ')');
  }
  for (const h of rsa.headlines) {
    if (h.length > 30) errs.push('headline too long (' + h.length + '): ' + JSON.stringify(h));
  }
  if (rsa.descriptions.length < 2 || rsa.descriptions.length > 4) {
    errs.push('descriptions must be 2–4 (got ' + rsa.descriptions.length + ')');
  }
  for (const d of rsa.descriptions) {
    if (d.length > 90) errs.push('description too long (' + d.length + '): ' + JSON.stringify(d));
  }
  return errs;
}

// ---------- build ----------
async function main() {
  log('Garden State Abolitionists Google Ads campaign builder');
  log('Target customer: ' + CUSTOMER_ID);
  log('Mode:            ' + (DRY_RUN ? 'DRY RUN (no writes)' : 'CREATE (paused-by-default)'));
  log('');

  // 1) Validate ad copy up front
  let anyValidationErrors = false;
  for (const c of CAMPAIGNS) {
    if (c.responsiveSearchAd) {
      const errs = validateAd(c.responsiveSearchAd);
      if (errs.length) {
        anyValidationErrors = true;
        log('[VALIDATION] ' + c.name + ':');
        errs.forEach((e) => log('   - ' + e));
      }
    }
  }
  if (anyValidationErrors) {
    log('\nFix validation errors above before running again.');
    process.exit(2);
  }

  // 2) Look up New Jersey geo target
  const geoTargetId = DRY_RUN ? '<lookup-skipped-in-dry-run>' : await findGeoTargetId(ACCOUNT.geoTargetName);
  log('Geo target ' + ACCOUNT.geoTargetName + ': ' + geoTargetId);
  log('');

  // 3) Skip anything already present
  const existing = DRY_RUN ? new Set() : await existingCampaignNames();
  const summary = { budgets: 0, campaigns: 0, adGroups: 0, keywords: 0, ads: 0, geoLinks: 0, skipped: [] };

  for (const c of CAMPAIGNS) {
    if (existing.has(c.name)) {
      summary.skipped.push(c.name);
      log('[SKIP] Campaign already exists: ' + c.name);
      continue;
    }

    log('[CAMPAIGN] ' + c.name + '   ($' + c.dailyBudgetUsd + '/day)');

    // 3a) Budget
    let budgetResource;
    if (DRY_RUN) {
      log('   (dry-run) would create budget: $' + c.dailyBudgetUsd + '/day');
    } else {
      const budgetOp = await customer.campaignBudgets.create([{
        name: c.name + ' — budget',
        amount_micros: usdToMicros(c.dailyBudgetUsd),
        delivery_method: enums.BudgetDeliveryMethod.STANDARD,
        explicitly_shared: false,
      }]);
      budgetResource = budgetOp.results[0].resource_name;
      summary.budgets++;
    }

    // 3b) Campaign (paused, NJ-only, manual CPC, search-only)
    let campaignResource;
    if (DRY_RUN) {
      log('   (dry-run) would create campaign (PAUSED, Search, Manual CPC)');
    } else {
      const campaignOp = await customer.campaigns.create([{
        name: c.name,
        status: enums.CampaignStatus.PAUSED,
        advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
        campaign_budget: budgetResource,
        // Ad Grants no longer allows Manual/Enhanced CPC. Maximize
        // Conversions is the default modern option — Google optimizes
        // bids automatically once conversions start coming in. Empty
        // object is the correct value here (no target_cpa specified).
        maximize_conversions: {},
        network_settings: {
          target_google_search: true,
          target_search_network: false, // Ad Grants: main Google Search only
          target_content_network: false,
          target_partner_search_network: false,
        },
        // Required as of the 2024 EU Political Ads Regulation.
        // Garden State Abolitionists is a New Jersey-only US nonprofit — no EU targeting.
        contains_eu_political_advertising:
          enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
      }]);
      campaignResource = campaignOp.results[0].resource_name;
      summary.campaigns++;
      log('   Campaign created: ' + campaignResource);

      // 3c) Geo-target New Jersey
      await customer.campaignCriteria.create([{
        campaign: campaignResource,
        location: {
          geo_target_constant: ResourceNames.geoTargetConstant(geoTargetId),
        },
      }]);
      summary.geoLinks++;
    }

    // 3d) Ad groups + keywords + ad
    for (const ag of c.adGroups) {
      const adGroupFinalUrl = ag.finalUrl || (c.responsiveSearchAd && c.responsiveSearchAd.finalUrl);
      if (!adGroupFinalUrl) {
        throw new Error('No finalUrl for ad group "' + ag.name + '" (neither ad-group-level nor campaign-level RSA)');
      }

      log('   [AG] ' + ag.name + '   (' + ag.keywords.length + ' keywords, $' + ag.cpcBidUsd + ' CPC)');

      if (DRY_RUN) {
        log('        (dry-run) would create ad group + ' + ag.keywords.length + ' keywords + 1 RSA -> ' + adGroupFinalUrl);
        summary.adGroups++;
        summary.keywords += ag.keywords.length;
        summary.ads++;
        continue;
      }

      // With Maximize Conversions, per-ad-group CPC bids aren't used —
      // Google sets bids automatically. Omitting cpc_bid_micros here.
      const agOp = await customer.adGroups.create([{
        name: ag.name,
        campaign: campaignResource,
        status: enums.AdGroupStatus.PAUSED,
        type: enums.AdGroupType.SEARCH_STANDARD,
      }]);
      const adGroupResource = agOp.results[0].resource_name;
      summary.adGroups++;

      // Keywords — pre-declare the two policies every keyword violates
      // by definition (the content IS abortion) so Google doesn't reject
      // each keyword on first submission. AdGroupCriterionOperation only
      // supports per-violation-key exemption (not ignorable_policy_topics),
      // so we spell out the ABORTION + HEALTH_IN_PERSONALIZED_ADS keys
      // for each keyword's text.
      const kwOps = ag.keywords.map((k) => ({
        ad_group: adGroupResource,
        status: enums.AdGroupCriterionStatus.ENABLED,
        keyword: {
          text: k.text,
          match_type: enums.KeywordMatchType[k.match],
        },
        exempt_policy_violation_keys: [
          { policy_name: 'ABORTION', violating_text: k.text },
          { policy_name: 'HEALTH_IN_PERSONALIZED_ADS', violating_text: k.text },
        ],
      }));
      await customer.adGroupCriteria.create(kwOps);
      summary.keywords += kwOps.length;

      // Responsive Search Ad — with the same abortion policy exemption.
      const rsa = c.responsiveSearchAd;
      await customer.adGroupAds.create([{
        ad_group: adGroupResource,
        status: enums.AdGroupAdStatus.PAUSED,
        ad: {
          final_urls: [adGroupFinalUrl],
          responsive_search_ad: {
            headlines: rsa.headlines.map((t) => ({ text: t })),
            descriptions: rsa.descriptions.map((t) => ({ text: t })),
            path1: rsa.path1 || undefined,
            path2: rsa.path2 || undefined,
          },
        },
      }], {
        validate_only: false,
        policy_validation_parameter: {
          ignorable_policy_topics: ['ABORTION', 'HEALTH_IN_PERSONALIZED_ADS'],
        },
      });
      summary.ads++;
    }
    log('');
  }

  log('---');
  log('Summary:');
  log('  Budgets created:   ' + summary.budgets);
  log('  Campaigns created: ' + summary.campaigns);
  log('  Ad groups:         ' + summary.adGroups);
  log('  Keywords:          ' + summary.keywords);
  log('  Ads (RSA):         ' + summary.ads);
  log('  Geo links:         ' + summary.geoLinks);
  if (summary.skipped.length) log('  Skipped (existed): ' + summary.skipped.join(', '));
  log('');
  if (DRY_RUN) {
    log('Dry-run complete. Nothing was written. Re-run without --dry-run to create everything paused.');
  } else {
    log('Everything created PAUSED. Enable via the Google Ads UI after reviewing.');
    log('  https://ads.google.com/aw/campaigns?ocid=&__u=&__c=' + CUSTOMER_ID);
  }
}

main().catch((e) => {
  console.error('\nBUILD FAILED:');
  console.error(e?.errors ? JSON.stringify(e.errors, null, 2) : (e?.message || e));
  process.exit(1);
});
