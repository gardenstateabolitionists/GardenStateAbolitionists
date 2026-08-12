# Staged for New Jersey

> **`/abortion-mills` has been RESTORED and is live** (2026-08-07) with 22 New
> Jersey facilities. Everything below still applies to the remaining routes.
>
> **`/cities` has been RESTORED** (2026-08-12), along with `components/cities`,
> `lib/data/cities.ts`, `lib/actions/find-city-actions.ts` and the
> abolitionist-church loader. Those files are gone from this folder because they
> now live in the app. What did NOT come back, and why:
>
> - `data/mi-county-prop3-vote.json` — no New Jersey equivalent exists and none
>   is coming. Replaced on the page by the city's own legislators' recorded
>   Freedom of Reproductive Choice Act roll call, which names people instead of
>   aggregating a county.
> - `data/mi-county-abortion-stats.json` — New Jersey publishes no abortion
>   counts at any geography and does not report to the CDC. Replaced by
>   `data/nj-abortion-context.json`, which reports that fact and cites
>   Guttmacher's statewide estimate.
> - `data/mi-underground-railroad-history.json` — replaced by
>   `data/nj-abolition-history.json`. New Jersey's history is not Michigan's:
>   it was the last northern state to free its slaves, freed nobody living in
>   1804, renamed the enslaved "apprentices" in 1846, still held 18 people in
>   1860, and voted the Thirteenth Amendment down in March 1865.
> - `data/mi-freedom-caucus.json` — still no New Jersey equivalent.
>
> Lesson from that restore, worth reading before doing another: these files were
> moved here *before* the Michigan→New Jersey rename swept the codebase, so they
> still contain the original Michigan content. Restoring one is not just a file
> move — it needs the rename applied, the map projection re-derived for New
> Jersey (SVG bbox via `getBBox()`, geographic bbox, viewport frame **and** the
> absolute pin/stroke sizes, all of which were tuned to Michigan's much larger
> frame), and the nav/footer/sitemap entries added.

Everything here was part of the Michigan site and could not be carried over by
renaming. It is excluded from the build (`tsconfig.json` → `exclude`), so
nothing in this folder compiles, routes, or ships.

Each item is kept because the **component and page work is reusable** — what's
missing is New Jersey data behind it. Deleting this folder would mean rebuilding
UI that already exists.

## Why these could not simply be renamed

| Staged | Michigan original | What New Jersey needs |
|---|---|---|
| `app/legislators`, `lib/data/legislators.ts`, `data/legislators.json` | 148 members with roll-call votes on named Michigan bills, Right to Life endorsements, PAC totals, capitol contacts | A New Jersey roster: 80 Assembly + 40 Senate across 40 districts. The vote-record columns have no NJ equivalent yet — there are no abolition bills to score. |
| `app/abolition-bills` | Michigan bill numbers and sponsor analysis | No comparable New Jersey legislation exists. This section needs a different premise, not new bill numbers. |
| `app/abortion-mills`, `data/abortion-mills.json` | 21 Michigan facilities with coordinates | A New Jersey facility list. NJ is a destination state with substantially more providers. |
| ~~`app/cities` + `components/cities`~~ | *Restored 2026-08-12.* | — |
| `app/cities/detroit/underground-railroad`, `data/mi-underground-railroad-history.json` | Detroit UGRR history | New Jersey has its own genuine Underground Railroad history — Lawnside, Timbuctoo, Greenwich, Camden. This is a research-and-rewrite, not a find-and-replace. |
| `data/mi-county-prop3-vote.json` | County-level Proposal 3 results | **No equivalent exists.** New Jersey has held no comparable abortion ballot measure. Any replacement must be a different metric entirely. |
| `data/mi-county-abortion-stats.json` | Michigan DHHS vital records | NJ Department of Health vital statistics, 21 counties (Michigan has 83). |
| `data/mi-freedom-caucus.json` | Michigan Freedom Caucus membership | No New Jersey equivalent. |
| ~~`data/abolitionist-churches.json`~~ | *Restored 2026-08-12,* regenerated for New Jersey by `scripts/sync_abolitionist_churches.py`. All 106 New Jersey congregations in the directory were read; **one** qualifies as publicly abolitionist. The section is deliberately abolitionist-only, so it renders its empty state on nearly every city page. | — |
| `lib/actions/broadcast-lawmaker-actions.ts.txt` | Admin "Email Lawmakers" broadcast | Depends on the legislator dataset. Saved as `.txt` so it cannot compile. The partner-broadcast half stayed live in `lib/actions/broadcast-actions.ts`. |

## Restoring a route

A route is not restorable until its dataset is real. When one is ready, the same
change must also:

1. Move the route back under `app/`, its components under `components/`, its
   loader under `lib/data/`, and its JSON under `data/`.
2. Re-add the nav entry in `components/Header.tsx` (`MobileNav` inherits it via
   props — no separate edit).
3. Re-add the footer link in `components/Footer.tsx` if it had one.
4. Re-add the `app/sitemap.ts` entries, including any per-item dynamic URLs.
5. **Legislators only:** restore the `/districts/[chamber]/[N]` →
   `/legislators/[slug]` redirects in `next.config.ts`. Without them those URLs
   404 and compete with the canonical profile URLs for indexing.
6. Re-add the page to `.github/workflows/lighthouse.yml`.

Skipping step 4 or 5 produces a sitemap that advertises 404s, which is worse for
search ranking than the route being absent.
