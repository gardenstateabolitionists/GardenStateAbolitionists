# New Jersey abortion facilities — research in progress

Working notes for rebuilding `data/abortion-mills.json` against New Jersey.
**Nothing here is published yet.** Every row needs a verified address before it
goes on a public page that names businesses.

Target schema (from the Michigan file):
`id, name, address, city, latitude, longitude, phone, email, notes` — plus an
optional `closed` flag.

---

## Verified against the operator's own website or NJAAF

| Clinic | Address | Phone | Services | Source |
|---|---|---|---|---|
| **Cherry Hill Women's Center** | 502 Kings Highway North, Cherry Hill, NJ 08034 | (856) 667-5910 | Medication to 11.6 wks; procedural to **28 wks**. States it is the only Ambulatory Surgical Center in NJ providing to 28 weeks. | thewomenscenters.com |
| **Pilgrim Medical Center** | 393 Bloomfield Ave., Montclair, NJ 07042 | (973) 746-1500 | To **24.6 wks**; medical to 10.6, procedures 13–16 and 17+. NJ-licensed surgical centre. | pilgrimmed.com |
| **Metropolitan Medical Associates** | Englewood, NJ — *street address still needed* | (201) 567-0522 | — | NJAAF |
| **Women's Choice** | Hackensack, NJ — **conflicting**, see below | (201) 489-2266 | — | NJAAF |

**Conflict to resolve:** NJAAF lists Women's Choice in **Hackensack**; a separate
search result gave "Women's Choice Medical Center, 200 Grand Avenue, Suite 101,
**Englewood**". These may be two sites, a relocation, or a stale listing. Do not
publish until confirmed — and note Metropolitan Medical Associates is also in
Englewood, so the two may be being conflated.

## Partially identified

| Clinic | Status |
|---|---|
| **Jersey GYN** | Two NJ sites — Union (908) 686-2563 and Hudson County/Jersey City (201) 332-2002. Offers non-surgical, surgical and "sleep" abortion. Street addresses not on their site; a Staten Island number is also listed, which is out of state. |
| **Garden State Gynecology** | Offices in Morristown and Princeton. **Not yet confirmed whether they provide abortion** — appears in clinic searches but presents as a general gynaecology practice. Verify before listing. |
| **Luminosas Wellness Collective** | Hudson County, reported as opening 2026 as an all-trimester facility. **Not yet open** — if listed at all, must be flagged as pending, not operating. |

## Planned Parenthood — unresolved, needs a decision

New Jersey has **two separate PP affiliates**:
- Planned Parenthood of Metropolitan New Jersey (East Orange, Montclair, Newark ×2, Paterson)
- Planned Parenthood of Northern, Central and Southern New Jersey (the rest)

I enumerated **20 PP health centres** in NJ from their own site (19 physical +
1 "PPMNJ Virtual Health Center", which performs no procedures):

Absecon · Camden · Delran · East Orange · Elizabeth · Flemington · Hackensack ·
Hamilton Square · Montclair · Morristown · Newark (Mulberry) · Newark
(Ironbound) · Newton · Paterson · Perth Amboy · Shrewsbury · Somerset
(Franklin Twp) · Trenton · Washington · [Newark virtual]

**What I could not establish:** which of these actually perform abortion, and
which are medication-only or referral-only. Two detection methods both failed:

1. Word-matching "abortion" on the centre page — returns true for all 20,
   because it appears in site-wide navigation.
2. Checking for a per-centre `/abortion` sub-page — also returns true for all
   20, *including the virtual centre*, so that page renders from a shared
   template regardless of what the location offers.

Listing all 19 physical centres as abortion facilities would therefore be an
assumption, not a finding. Resolving it needs either per-location service data
from a curated directory (abortionfinder.org holds it but renders client-side)
or a phone/records check.

## Sources used

- NJAAF (New Jersey Abortion Access Fund) — <https://njaaf.org/find-a-clinic>
- thewomenscenters.com, pilgrimmed.com, jerseygyn.com (operator sites)
- plannedparenthood.org health-centre directory (enumeration only)
- abortionfinder.org — has the per-location service detail but is JS-rendered

## Still to do

1. Street addresses for Metropolitan Medical Associates and Jersey GYN ×2.
2. Resolve the Women's Choice Hackensack/Englewood conflict.
3. Confirm whether Garden State Gynecology provides abortion at all.
4. Decide the Planned Parenthood scope (see above).
5. Geocode every confirmed address to lat/lng for the map.
6. Cross-check each entry against a second independent source before publishing.
