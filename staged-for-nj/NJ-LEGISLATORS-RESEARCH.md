# New Jersey legislators & abolition bills — research

## Done: the roster

`staged-for-nj/data/legislators.json` now holds all **120 current members** —
40 Senate + 80 Assembly, 40 districts, one senator and two assembly members
each. Party split 82 D / 38 R.

Parsed from the Legislature's own printable roster PDF, which is authoritative.
Counts verified (40/40, 80/80, all 40 districts, no duplicate names). Each row
carries name, chamber, district, party and district office phone.

## The problem: there is nothing to score

The Michigan original was a **scorecard** — it graded legislators on roll-call
votes on named abolition bills. New Jersey supports neither half of that.

**No abolition bill exists here.** Searching the New Jersey Legislature for an
equal-protection / preborn-homicide bill returns nothing. This is not a gap in
the research; it reflects the state. New Jersey went the other direction: the
**Freedom of Reproductive Choice Act** (S49/A6260) was signed in January 2022,
codifying abortion access in statute. There is no sponsor list to publish, no
bill number to track, and no vote to grade.

**The one real abortion vote is going stale.** S49's roll call exists (Senate
23–15–2, 10 Jan 2022) and is a genuine, citable record. But it was cast by the
2020–2021 Legislature, two election cycles ago. Cross-referencing the reported
roll call against today's roster, only about **10 of 40 current senators** appear
in it at all, and the Assembly turns over faster still.

So a scorecard keyed to that vote would show "no record" for the large majority
of members — which reads as an incomplete scorecard rather than as the accurate
statement that most of them simply were not there.

Publishing a mostly-empty grade column would also invite the obvious rebuttal:
grading people on a vote they never had the chance to cast.

## Options

1. **Contact directory, no grades.** All 120 members, searchable by district and
   town, with district phone and a prewritten letter. Honest, useful, and every
   field is already verified. The Michigan page's real utility — "find and
   contact the people who represent you" — survives intact.
2. **Directory plus a clearly-scoped FRCA record.** As above, but members who
   voted on S49 in 2022 carry that vote, explicitly labelled with its date and
   the fact that most current members were not yet serving. Needs the full
   roll call pulled (LegiScan 403s automated fetches; the Legislature's own
   site is reachable and is the better source anyway).
3. **Scorecard as in Michigan.** Not currently possible. It would need a New
   Jersey abolition bill to exist first.

## Sources

- NJ Legislature printable roster (authoritative, used for the 120 rows)
- njleg.state.nj.us — reachable, has bill and roll-call records
- legiscan.com — has the S49 roll call but returns 403 to automated fetches

## Still to do

- Decide between options 1 and 2.
- If 2: pull the complete S49 roll call from njleg and match names to the
  current roster.
- Either way: per-member email addresses and Trenton office details are not in
  the roster PDF and need a second pass.
