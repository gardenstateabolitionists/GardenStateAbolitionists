// Campaign plan — translated from docs/google-ads-campaign-plan.md into
// structured data the builder script can execute. Edit here to change what
// the builder creates; the .md doc remains the human-readable narrative.
//
// Ad Grants rules encoded here:
//   - Max CPC 2.00 USD (Google rejects higher)
//   - Manual CPC bidding (Maximize Conversions requires historical data)
//   - Search network only, no partners
//   - New Jersey geo-target (looked up at runtime from the geo_target_constant table)
//   - No single-word keywords, no plain "abortion" — filtered in the builder

export const ACCOUNT = {
  currencyCode: 'USD',
  geoTargetName: 'New Jersey', // resolved to a geo_target_constant ID at runtime
};

export const CAMPAIGNS = [
  {
    name: 'GSA — Petition',
    dailyBudgetUsd: 200, // ~60% of monthly credit
    adGroups: [
      {
        name: 'Branded + brand-adjacent',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'abolish abortion new jersey',           match: 'EXACT' },
          { text: 'abolish abortion new jersey',           match: 'PHRASE' },
          { text: 'garden state abolitionists petition',                        match: 'EXACT' },
          { text: 'abolition of abortion new jersey',      match: 'PHRASE' },
          { text: 'new jersey abolitionist petition',      match: 'PHRASE' },
          { text: 'end abortion new jersey petition',      match: 'PHRASE' },
          { text: 'abolish abortion new jersey sign',      match: 'PHRASE' },
          { text: 'garden state abolitionists',                        match: 'PHRASE' },
        ],
      },
      {
        name: 'Sign petition (action intent)',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'sign abortion petition new jersey',     match: 'PHRASE' },
          { text: 'new jersey pro life petition',          match: 'PHRASE' },
          { text: 'sign petition end abortion new jersey', match: 'PHRASE' },
          { text: 'abortion abolition petition',         match: 'PHRASE' },
          { text: 'petition to abolish abortion',        match: 'PHRASE' },
          { text: 'anti abortion petition new jersey',     match: 'PHRASE' },
          { text: 'sign petition abolish abortion',      match: 'EXACT' },
          { text: 'stop abortion petition new jersey',     match: 'PHRASE' },
        ],
      },
      {
        name: 'End abortion New Jersey (outcome intent)',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'how to end abortion in new jersey',     match: 'PHRASE' },
          { text: 'stop abortion in new jersey',           match: 'PHRASE' },
          { text: 'new jersey abortion ban',               match: 'PHRASE' },
          { text: 'end abortion new jersey',               match: 'PHRASE' },
          { text: 'outlaw abortion new jersey',            match: 'PHRASE' },
          { text: 'criminalize abortion new jersey',       match: 'PHRASE' },
          { text: 'end abortion in new jersey',            match: 'EXACT' },
        ],
      },
    ],
    // One RSA reused across all three ad groups in this campaign
    responsiveSearchAd: {
      finalUrl: 'https://www.gardenstateabolitionists.com/the-petition',
      // ≤ 15 headlines, each ≤ 30 chars
      headlines: [
        'Abolish Abortion in New Jersey',
        'Sign the Petition Today',
        'Equal Protection for Preborn',
        'New Jersey Abolitionist Petition',
        'End Abortion, No Exceptions',
        'Add Your Name — New Jersey',
        'For Justice, For the Preborn',
        'Made in God’s Image',
        'No Compromise. No Delay.',
        'Stand for the Preborn in NJ',
        'Sign the GSA Petition',
        'New Jersey: Abolish Abortion',
        'Immediate, Not Gradual',
        'Join the Movement',
        'Christian Abolition in NJ',
      ],
      // ≤ 4 descriptions, each ≤ 90 chars
      descriptions: [
        'Add your name to the petition calling on New Jersey to abolish abortion completely.',
        'Every preborn human bears God’s image and deserves equal protection under the law.',
        'Not regulation. Not reduction. The immediate and total abolition of abortion in NJ.',
        'Join New Jersey abolitionists calling on the Legislature to criminalize abortion now.',
      ],
      path1: 'sign',
      path2: 'petition',
    },
  },
  {
    name: 'GSA — Educational',
    dailyBudgetUsd: 80,
    adGroups: [
      {
        name: 'Abolitionist vs pro-life',
        cpcBidUsd: 2.0,
        finalUrl: 'https://www.gardenstateabolitionists.com/what-we-believe/abolitionist-not-pro-life',
        keywords: [
          { text: 'abolitionist vs pro life',      match: 'PHRASE' },
          { text: 'difference abolitionist pro life', match: 'PHRASE' },
          { text: 'abolition vs pro life movement', match: 'PHRASE' },
          { text: 'why abolition not pro life',     match: 'PHRASE' },
          { text: 'pro life movement problems',     match: 'PHRASE' },
          { text: 'abolitionist christianity',      match: 'PHRASE' },
          { text: 'biblical abolition abortion',    match: 'PHRASE' },
        ],
      },
      {
        name: 'New Jersey abortion law',
        cpcBidUsd: 2.0,
        // Was /abolition-bills, which is parked in staged-for-nj and would 404 on
        // a paid click. Repoint when that route returns.
        finalUrl: 'https://www.gardenstateabolitionists.com/what-we-believe',
        keywords: [
          { text: 'new jersey abortion law 2026',       match: 'PHRASE' },
          { text: 'new jersey abortion law after dobbs', match: 'PHRASE' },
          { text: 'is abortion legal in new jersey',    match: 'PHRASE' },
          { text: 'new jersey abortion legislation',    match: 'PHRASE' },
          { text: 'new jersey abortion bill',           match: 'PHRASE' },
          { text: 'who is my new jersey state rep',     match: 'PHRASE' },
          { text: 'new jersey legislature abortion',    match: 'PHRASE' },
        ],
      },
      {
        name: 'Christian abolition',
        cpcBidUsd: 2.0,
        finalUrl: 'https://www.gardenstateabolitionists.com/the-gospel',
        keywords: [
          { text: 'christian view on abortion',     match: 'PHRASE' },
          { text: 'biblical case against abortion', match: 'PHRASE' },
          { text: 'gospel and abortion',            match: 'PHRASE' },
          { text: 'church response to abortion',    match: 'PHRASE' },
          { text: 'christian abolitionism',         match: 'PHRASE' },
          { text: 'how should christians end abortion', match: 'PHRASE' },
          { text: 'pastor sermon abortion',         match: 'PHRASE' },
        ],
      },
      {
        name: 'Deep-dive (long-tail educational)',
        cpcBidUsd: 2.0,
        // Was /abolition-bills/components, which is parked in staged-for-nj and
        // would 404 on a paid click. Repoint when that route returns.
        finalUrl: 'https://www.gardenstateabolitionists.com/what-we-believe/criminalization',
        keywords: [
          { text: 'what is a bill of abolition',    match: 'PHRASE' },
          { text: 'components of abolition bill',   match: 'PHRASE' },
          { text: 'criminalizing abortion legislation', match: 'PHRASE' },
          { text: 'no exceptions abortion law',     match: 'PHRASE' },
          { text: 'how to write abortion abolition law', match: 'PHRASE' },
        ],
      },
    ],
    responsiveSearchAd: {
      // finalUrl is per-ad-group here; the builder passes each ad group's finalUrl
      // through to a per-ad-group RSA (same copy, different landing page).
      headlines: [
        'Abolitionist, Not Pro-Life',
        'Biblical Case for Abolition',
        'New Jersey Abortion Law',
        'Ignore Roe: The Case',
        'What Is a Bill of Abolition?',
        'Justice for the Preborn',
        'Christian Abolition in 2026',
        'No Exceptions: Here’s Why',
        'Learn the Difference',
        'New Jersey Legislation Tracker',
        'Read the Full Case',
        'The Gospel & Abolition',
      ],
      descriptions: [
        'The pro-life movement isn’t enough. Learn why total abolition is the only faithful stand.',
        'Every human being — from fertilization — bears God’s image. Read the biblical case.',
        'New Jersey needs a real abolition bill. Learn what makes one different from a pro-life bill.',
        'Straight answers on New Jersey’s abortion law after Dobbs. Written for New Jerseyans.',
      ],
      path1: 'learn',
      path2: 'abolition',
    },
  },
  {
    name: 'GSA — Donations',
    dailyBudgetUsd: 50,
    adGroups: [
      {
        name: 'Donate to pro-life / abolition',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'donate pro life new jersey',        match: 'PHRASE' },
          { text: 'support abortion abolition',      match: 'PHRASE' },
          { text: 'give to end abortion',            match: 'PHRASE' },
          { text: 'christian pro life donation',     match: 'PHRASE' },
          { text: 'support pro life nonprofit new jersey', match: 'PHRASE' },
          { text: 'donate abolish abortion',         match: 'PHRASE' },
          { text: 'support abolition new jersey',      match: 'EXACT' },
        ],
      },
      {
        name: 'New Jersey advocacy support',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'new jersey pro life organization donate', match: 'PHRASE' },
          { text: 'give to new jersey abolition',      match: 'PHRASE' },
          { text: 'support the preborn new jersey',    match: 'PHRASE' },
          { text: 'pro life 501c3 donate new jersey',  match: 'PHRASE' },
        ],
      },
    ],
    responsiveSearchAd: {
      finalUrl: 'https://www.gardenstateabolitionists.com/donate',
      headlines: [
        'Support New Jersey Abolition',
        '100% Goes to the Mission',
        'Fund the End of Abortion',
        'Give Monthly, Fight Weekly',
        'Donate to GSA Today',
        'No Fees — Zeffy Processing',
        'New Jersey 501(c)(3) Nonprofit',
        'Stand With the Preborn',
      ],
      descriptions: [
        '100% of your gift funds the movement to abolish abortion in New Jersey. No processing fees.',
        'Support education, legislative advocacy, and outreach across the state of New Jersey.',
        'Give once or become a monthly partner. Zeffy processing — every dollar goes further.',
      ],
      path1: 'donate',
      path2: 'gsa',
    },
  },
];
