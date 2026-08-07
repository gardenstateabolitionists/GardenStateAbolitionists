# Google Ad Grants — Campaign Plan for Garden State Abolitionists

Prepared for Jmark. Draft any/all sections; the account can't be built until Google mails a verification postcard, so treat this as working material — edit, cut, add.

## Account structure

Three campaigns matched to the three things AAM asks visitors to do:

| Campaign | Goal | Landing pages | Geo | Daily budget cap |
|---|---|---|---|---|
| **1. Petition** | Sign the petition | `/the-petition` | New Jersey | $329 (~$10k/mo) — Google auto-distributes |
| **2. Educational** | Read + understand abolition | `/what-we-believe/*`, `/abolition-bills/*`, `/the-gospel/*` | New Jersey | shared |
| **3. Donations** | Give / recur | `/donate` | New Jersey | shared |

The $10k/mo credit is total across all three; Google distributes based on which campaigns are converting. **Weight the Petition campaign 50-60% of budget** — it's the primary conversion.

## Ad Grants compliance rules (must maintain)

- **≥ 5% CTR** account-wide, monthly average — under it two months in a row = account suspended
- **No single-word keywords** except brand ("abolish", "new jersey" alone will fail review)
- **No overly generic keywords** ("abortion" alone will be rejected)
- **Every keyword needs Quality Score ≥ 3** — check monthly and pause anything below
- **≥ 1 conversion tracked per month** — the Google-Ads conversion events in `lib/google-ads.ts` cover this
- **Geo-targeting required** (we use New Jersey; state-level counts)
- **Log in at least monthly** — Google auto-pauses inactive accounts

## Campaign 1: Petition

**Landing page:** `/the-petition`
**Conversion action:** `petition_signed` (fires on successful sign, tagged via Google Ads gtag)

### Ad Group 1A — Branded + brand-adjacent

Match types: `[exact]`, `"phrase"`, `broad`

```
[abolish abortion new jersey]
"abolish abortion new jersey"
[aam petition]
"abolition of abortion new jersey"
"new jersey abolitionist petition"
"end abortion new jersey petition"
"abolish abortion new jersey sign"
"aam new jersey"
```

### Ad Group 1B — Sign petition (action intent)

```
"sign abortion petition new jersey"
"new jersey pro life petition"
"sign petition end abortion new jersey"
"abortion abolition petition"
"petition to abolish abortion"
"anti abortion petition new jersey"
[sign petition abolish abortion]
"stop abortion petition new jersey"
```

### Ad Group 1C — End abortion New Jersey (outcome intent)

```
"how to end abortion in new jersey"
"stop abortion in new jersey"
"new jersey abortion ban"
"end abortion new jersey"
"outlaw abortion new jersey"
"criminalize abortion new jersey"
[end abortion in new jersey]
```

**Responsive Search Ad — AG 1A/1B/1C (rotate all three)**

Headlines (≤30 chars each):
```
Abolish Abortion in New Jersey
Sign the Petition Today
Equal Protection for Preborn
New Jersey Abolitionist Petition
End Abortion, No Exceptions
Add Your Name — New Jersey
For Justice, For the Preborn
Made in God's Image
No Compromise. No Delay.
Stand for the Preborn in NJ
Sign the AAM Petition
New Jersey: Abolish Abortion
Immediate, Not Gradual
Join the Movement
Christian Abolition in NJ
```

Descriptions (≤90 chars each):
```
Add your name to the petition calling on New Jersey to abolish abortion completely.
Every preborn human bears God's image and deserves equal protection under the law.
Not regulation. Not reduction. The immediate and total abolition of abortion in NJ.
Join New Jersey abolitionists calling on the Legislature to criminalize abortion now.
```

Sitelink extensions (4 required):
- **Sign the Petition** → `/the-petition`
- **What We Believe** → `/what-we-believe`
- **Current Bills** → `/abolition-bills/current-bills`
- **Contact Us** → `/contact`

Callout extensions:
- Immediate & Total Abolition · No Exceptions · Biblical, Not Secular · Equal Protection

---

## Campaign 2: Educational

**Landing pages:** contextual — each ad group points at the most relevant `/what-we-believe/*` or `/abolition-bills/*` article.
**Conversion action:** `inquiry_submitted` OR `newsletter_subscribed` OR `petition_signed` (any of the three counts)

### Ad Group 2A — Abolitionist vs pro-life (comparison intent)

Landing: `/what-we-believe/abolitionist-not-pro-life`

```
"abolitionist vs pro life"
"difference abolitionist pro life"
"abolition vs pro life movement"
"why abolition not pro life"
"pro life movement problems"
"abolitionist christianity"
"biblical abolition abortion"
```

### Ad Group 2B — New Jersey abortion law (legal info intent)

Landing: `/abolition-bills` or `/what-we-believe/ignore-roe`

```
"new jersey abortion law 2026"
"new jersey abortion law after dobbs"
"is abortion legal in new jersey"
"new jersey abortion legislation"
"new jersey abortion bill"
"who is my new jersey state rep"
"new jersey legislature abortion"
```

### Ad Group 2C — Christian abolition (religious framing)

Landing: `/the-gospel` or `/what-we-believe/biblical-not-secular`

```
"christian view on abortion"
"biblical case against abortion"
"gospel and abortion"
"church response to abortion"
"christian abolitionism"
"how should christians end abortion"
"pastor sermon abortion"
```

### Ad Group 2D — Deep-dive (long-tail educational)

Landing: `/abolition-bills/components`

```
"what is a bill of abolition"
"components of abolition bill"
"criminalizing abortion legislation"
"no exceptions abortion law"
"how to write abortion abolition law"
```

**Responsive Search Ad — Educational**

Headlines:
```
Abolitionist, Not Pro-Life
The Biblical Case for Abolition
New Jersey Abortion Law Explained
Ignore Roe: The Case
What Is a Bill of Abolition?
Justice for the Preborn
Christian Abolition in 2026
No Exceptions: Here's Why
Learn the Difference
New Jersey Legislation Tracker
Read the Full Case
The Gospel & Abolition
```

Descriptions:
```
The pro-life movement isn't enough. Learn why total abolition is the only faithful stand.
Every human being — from fertilization — bears God's image. Read the biblical case.
New Jersey needs a real abolition bill. Learn what makes one different from a pro-life bill.
Straight answers on New Jersey's abortion law after Dobbs. Written for New Jerseyans.
```

Sitelinks:
- **What We Believe** → `/what-we-believe`
- **The Gospel** → `/the-gospel`
- **Abolition Bills** → `/abolition-bills`
- **Sign the Petition** → `/the-petition`

---

## Campaign 3: Donations

**Landing page:** `/donate`
**Conversion action:** `donate_clicked` (fires when the Zeffy CTA is clicked — we can't see the completed donation because Zeffy is off-platform)

### Ad Group 3A — Donate to pro-life / abolition

```
"donate pro life new jersey"
"support abortion abolition"
"give to end abortion"
"christian pro life donation"
"support pro life nonprofit new jersey"
"donate abolish abortion"
[support abolition new jersey]
```

### Ad Group 3B — New Jersey advocacy support

```
"new jersey pro life organization donate"
"give to new jersey abolition"
"support the preborn new jersey"
"pro life 501c3 donate new jersey"
```

**Responsive Search Ad — Donations**

Headlines:
```
Support New Jersey Abolition
100% Goes to the Mission
Fund the End of Abortion
Give Monthly, Fight Weekly
Donate to AAM Today
No Fees — Zeffy Processing
New Jersey 501(c)(3) Nonprofit
Stand With the Preborn
```

Descriptions:
```
100% of your gift funds the movement to abolish abortion in New Jersey. No processing fees.
Support education, legislative advocacy, and outreach across the state of New Jersey.
Give once or become a monthly partner. Secure processing via Zeffy — every dollar goes further.
```

Sitelinks:
- **Donate Now** → `/donate`
- **Our Mission** → `/who-we-are`
- **Legislative Work** → `/abolition-bills`
- **Contact Us** → `/contact`

Callout extensions:
- 100% to Mission · 0% Processing Fees · 501(c)(3) Nonprofit · New Jersey-Based

---

## After account creation — 4 env vars we'll need from Jmark

Once Ad Grants activates and you've created the 4 conversion actions in Google Ads UI (Petition, Inquiry, Newsletter, Donate), paste the IDs into Vercel using `--no-sensitive` (they're client-side vars, per [[Vercel env-var sensitive default]] gotcha):

```
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONV_PETITION=AW-XXXXXXXXX/aaaaaaaaaaa
NEXT_PUBLIC_GOOGLE_ADS_CONV_INQUIRY=AW-XXXXXXXXX/bbbbbbbbbbb
NEXT_PUBLIC_GOOGLE_ADS_CONV_NEWSLETTER=AW-XXXXXXXXX/ccccccccccc
NEXT_PUBLIC_GOOGLE_ADS_CONV_DONATE=AW-XXXXXXXXX/ddddddddddd
```

Code is already wired to read these — see `lib/google-ads.ts` and `components/GoogleAdsScript.tsx`. Add the vars, push an empty commit to force rebuild, and Google Ads will start seeing conversions immediately.

## Ongoing management (~30 min / week)

- **Weekly:** check search terms report → add high-CTR queries as keywords, add low-QS queries as negatives
- **Monthly:** confirm CTR ≥ 5% and at least 1 conversion; run Ad Grants compliance check
- **Quarterly:** rotate ad copy variants; retire underperformers
