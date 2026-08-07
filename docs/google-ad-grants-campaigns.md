# Google Ad Grants — Campaign Setup Reference

Everything Jmark needs to build the remaining 6 ad groups in one sitting.
Working from **Ad Grants account 446-631-6960** (not the standard account
532-464-6086, which should be canceled).

## Campaign shell — one campaign, 7 ad groups

- **Campaign name:** `AAM — Mission & Advocacy`
- **Campaign type:** Search
- **Bid strategy:** Maximize Clicks with max CPC bid **$2.00**
  - Ad Grants caps CPC at $2 (or unlimited if you use "Maximize
    Conversions" — but that needs conversion tracking wired first)
- **Daily budget:** $329 (the Grants cap — always use this)
- **Locations:** New Jersey (state) — target only, exclude other states
- **Languages:** English
- **Networks:** Google Search only (Grants doesn't allow Display or Search Partners)

## Ad groups — copy-paste per group

For each ad group below:
1. Create ad group with the given name
2. **Paste the Track 2 keywords** first (they clear policy without exception)
3. **Paste the Track 1 keywords** next; request exception on any flagged
   with the standard 501(c)(3) justification (see bottom of this doc)
4. Create **Ad #1** using the headlines and descriptions provided
5. Create **Ad #2** with the same set but reorder the headlines (Grants
   requires 2 ads per group)
6. Attach the 4 site-wide sitelinks

---

### Ad Group 1: Core Mission ✅ (already published)

**Landing:** `/`

Already live. Skip.

---

### Ad Group 2: Legislator Scorecard — ⚠️ BLOCKED

**Do not run yet.** This group sends traffic to `/legislators`, which is parked
in `staged-for-nj/` pending a New Jersey roster and would 404 on a paid click.
The copy also promises voting records on abolition bills; New Jersey has none,
so the copy needs rewriting, not just relinking.


**Landing:** `/legislators`

**Keywords — Track 2 (safer, paste first):**
```
New Jersey legislator pro-life scorecard
New Jersey representative voting record
New Jersey senator voting record
who represents me New Jersey
New Jersey lawmaker accountability
New Jersey house voting record
New Jersey legislator contact
find my New Jersey representative
New Jersey district lookup
```

**Keywords — Track 1 (may need exception, paste second):**
```
New Jersey legislator abortion record
New Jersey senator abortion voting
New Jersey representative abortion
who voted for abortion New Jersey
New Jersey house abortion vote
New Jersey senate abortion vote
contact New Jersey legislator abortion
New Jersey Freedom of Reproductive Choice Act
```

**Headlines (30 chars max each):**
```
New Jersey Legislator Records
Who Voted How on Abortion
New Jersey Pro-Life Scorecard
Find Your Representative
New Jersey Senate Records
See How NJ Reps Voted
Contact Your Legislator
149 Legislators Ranked
NJ Lawmaker Accountability
Search Every NJ Legislator
Free Public Scorecard
New Jersey Voting Records
```

**Descriptions (90 chars max each):**
```
Every New Jersey legislator's record on abortion — voting, sponsorships, endorsements.
Free public scorecard. Search all 149 New Jersey state house and senate members.
See how your legislators vote on preborn equal protection. Contact them in one click.
Independent research. Voting records, PAC donations, committee assignments.
```

---

### Ad Group 3: Abolition vs Pro-Life

**Landing:** `/what-we-believe/abolitionist-not-pro-life`

**Keywords — Track 2 (paste first):**
```
abolitionist versus pro-life
what is the abolitionist movement
immediate abolition versus incrementalism
equal protection unborn
pro-life incrementalism
Christian abolitionist beliefs
biblical case for abolition
```

**Keywords — Track 1 (may need exception):**
```
what is abortion abolition
immediate abolition abortion
```

**Headlines:**
```
Abolitionist vs Pro-Life
Why Not Incrementalism
Immediate vs Gradual
Equal Protection Preborn
The Abolitionist Case
Beyond Pro-Life
Total Abolition Now
Not Regulation. Abolition.
Biblical Case for Abolition
No Compromise. No Exceptions.
Christian Abolitionism
Learn the Difference
```

**Descriptions:**
```
Why New Jersey abolitionists reject incremental pro-life strategies. Read the full case.
Fifty years of incrementalism failed. Abolition is the biblical and just response.
Abolition means immediate, total, no exceptions. See why the distinction matters.
Christian abolitionists explain: why we're not pro-life in the traditional sense.
```

---

### Ad Group 4: No Exceptions

**Landing:** `/what-we-believe/no-exceptions`

**Keywords — Track 2 (paste first):**
```
no exceptions in pro-life bills
rape exception in pro-life bills
life of mother exception
Christian view on exceptions
biblical exceptions preborn protection
double effect medical ethics
```

**Keywords — Track 1 (may need exception):**
```
abortion rape exception
when is abortion justified
Christian view abortion exceptions
biblical abortion exceptions
```

**DO NOT include:** `abortion incest exception` — triggers Google's
sexual-content filter and can't be exception-approved. Drop entirely.

**Headlines:**
```
No Exceptions to Abolition
Rape Exception Answered
Life of Mother Exception
Biblical View of Exceptions
Christian Case No Exceptions
Every Preborn Life Matters
Innocent Life Cannot Be Taken
Answers to Hard Objections
The Double Effect Doctrine
Why No Exceptions
```

**Descriptions:**
```
Christian answers to the hardest objections: rape, life of mother, and more.
Every preborn life is made in the image of God. No exception justifies killing.
Read our full biblical and moral case for abolition with no exceptions.
Compassion + truth: how abolitionists respond to hard-case questions.
```

---

### Ad Group 5: State Legislation — ⚠️ DO NOT RUN AS WRITTEN, REBUILD FOR NEW JERSEY

**This ad group was inherited from the Michigan campaign and every keyword and
headline in it was false for New Jersey. It has been emptied on purpose rather
than translated, because a find-and-replace cannot make it true.**

What was here and why it had to go:

- **"Proposal 3"** — a Michigan ballot measure. New Jersey has never held a
  comparable abortion ballot measure, so the search intent does not exist.
- **A description reading "NJ Prop 3 passed. Here's how abolitionists are
  responding legislatively."** — flatly false. Running it would be false
  advertising paid for with Ad Grants money.
- **"HB 4671"** — Michigan bill numbering. New Jersey uses `A####` for Assembly
  bills and `S####` for Senate bills; there are no "HB" numbers here.
- **"Reproductive Health Act"** — Michigan's statute. New Jersey's analogous law
  is the **Freedom of Reproductive Choice Act**, signed January 2022.
- **"Justice for Babies in the Womb Act"** — not New Jersey legislation.
- **"See which lawmakers sponsor real abolition bills"** — no New Jersey
  legislator sponsors an abolition bill, because no such bill exists.

Before rebuilding this ad group, someone has to establish what New Jersey
legislative reality actually supports. The honest angle is likely education
about the Freedom of Reproductive Choice Act and what equal protection would
require, **not** a bill tracker — there is nothing to track.

Landing page also needs resolving: the original pointed at `/abolition-bills`,
which is parked in `staged-for-nj/` and would 404 on a paid click.

### Ad Group 6: Faith / Gospel

**Landing:** `/the-gospel`

**Keywords — Track 2 (paste first):**
```
Christian pro-life New Jersey
biblical view unborn
gospel and preborn
church response preborn
New Jersey pro-life church
Christian abolition movement
```

**Keywords — Track 1 (may need exception):**
```
Christian response to abortion
biblical view on abortion
gospel and abortion
church and abortion
pastor abortion sermon
```

**Headlines:**
```
Christian View of Abortion
Gospel and the Preborn
Church Response Preborn
Biblical Case for Life
Pastor Resources
New Jersey Pro-Life Church
Christian Advocacy New Jersey
Sanctity of Life Preaching
Faith and Public Witness
Preborn Made in God's Image
```

**Descriptions:**
```
New Jersey Christians equipping churches to speak up for the preborn with clarity.
The gospel demands action on abolition. Resources for pastors and congregations.
Christian abolitionists in New Jersey. Faith-rooted advocacy for the preborn.
Every preborn child bears God's image. Learn what Scripture says and how to act.
```

---

### Ad Group 7: Get Involved / Petition

**Landing:** `/the-petition`

**Keywords — Track 2 (paste first):**
```
sign abolition petition New Jersey
New Jersey preborn petition
join abolitionist movement New Jersey
New Jersey pro-life volunteer
support abolition New Jersey
New Jersey Christian advocacy petition
```

**Keywords — Track 1 (may need exception):**
```
sign abortion abolition petition
New Jersey abortion petition
end abortion New Jersey petition
```

**Headlines:**
```
Sign the Petition Today
Support Abolition New Jersey
New Jersey Preborn Petition
Join the Movement
Take Action Now
Add Your Name Today
Help End Abortion NJ
Christian Advocacy Petition
New Jersey Abolition Petition
Stand Up for the Preborn
```

**Descriptions:**
```
Add your name to New Jersey's abolitionist petition. Send a message to Trenton today.
Join thousands of New Jersey Christians calling for immediate abolition. Sign now.
Sign the petition. Contact your legislators. Volunteer. New Jersey needs abolitionists.
New Jersey constituents standing for the preborn. Sign in under 30 seconds.
```

---

## Sitelinks (attach all 6 to the campaign, site-wide)

| Sitelink text (25 char max) | Destination URL |
|---|---|
| Legislator Scorecard | `/legislators` |
| Sign the Petition | `/the-petition` |
| Who We Are | `/who-we-are` |
| Donate | `/donate` |
| Allied Groups | `/partners` |
| Contact Us | `/contact` |

Sitelink descriptions (35 chars per line, 2 lines each) for the top 4:

- **Legislator Scorecard**
  - Line 1: `See every NJ legislator's record`
  - Line 2: `Free public scorecard tool`
- **Sign the Petition**
  - Line 1: `Add your name in 30 seconds`
  - Line 2: `New Jersey abolition petition`
- **Who We Are**
  - Line 1: `New Jersey Christian abolitionists`
  - Line 2: `Our mission and beliefs`
- **Donate**
  - Line 1: `Support the abolition work`
  - Line 2: `Tax-deductible 501(c)(3)`

## Exception request boilerplate

For any keyword Google flags under "Abortion", "Health in personalized
advertising", or "Sensitive Events", click **"Request an exception"**
and paste this:

> Garden State Abolitionists is a New Jersey 501(c)(3) educational advocacy
> nonprofit (EIN 99-4483710). We do not provide, refer for, or promote
> abortion services. Our ads direct users to educational content, our
> legislator scorecard, and civic-engagement resources on
> gardenstateabolitionists.org. Content is protected political speech
> matching Google's Content Policies for advocacy organizations under
> Section 501(c)(3). Our IRS determination letter is public at
> gardenstateabolitionists.org/financial-transparency.

Reviews usually take 3-5 business days per keyword.

## Ad Grants ongoing requirements (memorize these)

1. **Every ad group needs 2+ ads.** Google requires this for optimization.
2. **Minimum 5% CTR account-wide.** Falling below for 2 consecutive months
   = account gets deactivated. Fix: tighter keywords + more specific ads.
3. **Quality Score ≥ 3** on every keyword. Google removes keywords under
   this bar automatically.
4. **Conversion tracking recommended.** Once we wire `NEXT_PUBLIC_GOOGLE_ADS_ID`
   and the conversion action IDs (petition, inquiry, donate, newsletter)
   in Vercel, the site fires conversions automatically. The
   `fireAdsConversion()` code is already in place.
5. **Site-wide manager account audits happen quarterly.** Keep the site
   compliant with the Ad Grants website policy — the fixes from July
   already handle this (EIN visible, financial transparency page live,
   no broken links, HTTPS everywhere, mobile-friendly).

## Conversion tracking — TODO when ready

Once ready to enable conversion tracking:

1. In Google Ads → Tools → Conversions → **New conversion action**
2. Create these 4:
   - **Petition Signed** (category: Sign-up)
   - **Inquiry Submitted** (category: Contact)
   - **Newsletter Signed Up** (category: Sign-up)
   - **Donation Started** (category: Purchase, or Sign-up if untracked value)
3. Grab the conversion IDs (format: `AW-XXXXXXXXX/YYYYYYYYY`)
4. Save to Vercel:

```
vercel env add NEXT_PUBLIC_GOOGLE_ADS_ID production --no-sensitive
vercel env add NEXT_PUBLIC_GOOGLE_ADS_CONV_PETITION production --no-sensitive
vercel env add NEXT_PUBLIC_GOOGLE_ADS_CONV_INQUIRY production --no-sensitive
vercel env add NEXT_PUBLIC_GOOGLE_ADS_CONV_NEWSLETTER production --no-sensitive
vercel env add NEXT_PUBLIC_GOOGLE_ADS_CONV_DONATE production --no-sensitive
git commit --allow-empty -m "chore: rebuild for Google Ads conversion IDs" && git push
```

Existing `fireAdsConversion(action)` calls in the code (already deployed)
will start firing conversions automatically the moment the env vars
land + a fresh build ships.
