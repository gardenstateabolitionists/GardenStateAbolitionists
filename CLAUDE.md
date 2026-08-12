# Garden State Abolitionists

Advocacy site for a New Jersey abolitionist organization, built for a client.

This codebase began as a copy of the Abolish Abortion Michigan site. Everything
Michigan-specific has been removed from the shipped app, but the lineage matters
for two reasons: some patterns here were designed around Michigan's situation,
and the parts that could not be honestly translated are parked rather than
deleted (see **Staged work** below).

## The New Jersey problem — read before writing advocacy copy

New Jersey's legal posture is close to the opposite of Michigan's. The Freedom
of Reproductive Choice Act (January 2022) codified abortion access in statute
with no gestational limit, and the legislature has been reliably hostile to
restriction. There is no New Jersey analog to Michigan's abolition-bill fight
and no equivalent of Michigan's Proposal 3.

Practically: do not write copy that assumes a live legislative campaign, a
scorecard of sponsors, or a recent ballot measure. Those framings were true in
Michigan and are not true here.

## Staged work — `staged-for-nj/`

The routes and datasets that were inseparable from Michigan live in
`staged-for-nj/`, excluded from the build via `tsconfig.json`. That folder is
reference material for rebuilding each feature against New Jersey data — it is
not dead code and should not be deleted.

Restoring any of them is a multi-part change. `staged-for-nj/README.md` lists
what each one needs; the short version is that a route cannot come back until
its dataset is real, and the sitemap entry, nav link, and (for legislators) the
`next.config.ts` district redirects must be restored in the same change.

## Identity fields are deliberately blank

`lib/content.ts` ships `orgInfo`, `socialLinks`, and `statistics` with empty
values, and every render site is gated so a blank hides its section instead of
printing a gap.

This is load-bearing, not unfinished work. These fields previously held the
other organization's real mailing address, its real Signal group invite, and
Michigan abortion figures. Rendering any of them under a New Jersey banner would
publish false information — a donor mailing a check to the address that was in
`/donate` would have sent money to a different organization.

Two of these are legal representations and must never be populated
speculatively:

- **`taxStatus`** gates every 501(c)(3) and tax-deductibility claim on the site,
  including the JSON-LD `nonprofitStatus`. Leave it blank until an IRS
  determination letter exists.
- **`mailingAddress`** gates the "Mail a Check" block and the structured-data
  postal address.

`statistics` is blank because New Jersey figures need a citable source; fill
`statisticsSource` alongside them so the homepage can attribute them.

## Package manager

pnpm, pinned via `packageManager` in `package.json`. Only `pnpm-lock.yaml`
exists — do not introduce `package-lock.json`. `pnpm-workspace.yaml` resolves
`allowBuilds` explicitly; Prisma, sharp, `@sentry/cli`, and `unrs-resolver` all
need their install scripts or the build fails.

## Prisma client generation — do not move this back to postinstall

`package.json` runs `prisma generate` as part of **`build`**, not only in
`postinstall`. That is deliberate and load-bearing.

`prisma generate` writes to `lib/generated/prisma`, which is outside
`node_modules` and gitignored. Vercel caches `node_modules` between builds, so
on a cache hit pnpm reports everything up to date and skips install entirely —
taking `postinstall` with it. The generated client is then missing from the
project directory and the build dies with:

```
Module not found: Can't resolve '@/lib/generated/prisma'
```

The symptom is confusing because the *first* deploy of a project succeeds (cold
cache, install really runs) and the *second* fails with no relevant code change.
This happened on 2026-08-06. Keep `prisma generate` in the build script.

## Vercel environment variables

`NEXT_PUBLIC_*` variables must be added with `--no-sensitive`. Production
defaults to `--sensitive`, which stops the value being inlined into the client
bundle — it becomes `undefined` in the browser with no build error. Push an
empty commit afterward to force a fresh build.

## Local dev: escape `$` in .env.local

Next.js runs `.env` values through **dotenv-expand**, so an unescaped `$` is
read as a variable reference and silently mangles the value. Two values here
are full of them:

- `ADMIN_PASSWORD_HASH` — bcrypt hashes are `$2b$10$...`
- `ADMIN_ACCESS_CODE` — if the code contains `$`

Write them as `\$` in `.env.local`. The symptom is a correct password or access
code being rejected with no useful error.

**Vercel is unaffected** — it injects variables into the runtime rather than
parsing a file, so this is a local-development-only trap. Do not "fix" it by
changing the value stored in Vercel.

## The admin rate limiter fails CLOSED

`checkRateLimitStrict` (used by the access-code gate, login, and PIN
confirmation) fails **closed**, unlike `checkRateLimit` on the public forms
which fails open. If Upstash is unreachable or its credentials are wrong,
**admin login is impossible** — and the UI reports it as "Invalid access code",
which sends you hunting for a credential problem that does not exist.

Check the server log for `Rate limit check failed (fail-closed)` before
debugging credentials. Local development therefore needs the `KV_REST_API_*`
variables in `.env.local`, not just the admin ones.

## JSX text spacing

Text like `{count} counties` broken across lines collapses to `83counties`, and
`</strong> word` at a line break drops the space. Use explicit `{' '}` and
confirm against the built HTML.

## Open States API — two traps

`scripts/refresh_legislator_data.py` pulls committee seats and sponsorship
counts monthly via `.github/workflows/refresh-legislator-data.yml`
(`OPEN_STATES_API_KEY` is set as a repo secret). Both of these bit us once:

1. **`/committees` ignores `jurisdiction=New Jersey`.** Given a plain state
   name it returns every committee in the country — 2955 of them, with a
   Tennessee senator in the first sample. Only the OCD id
   (`ocd-jurisdiction/country:us/state:nj/government`) scopes it, and that
   returns the real 50. This failure is silent and the output looks plausible,
   so it would have attributed other states' committees to New Jersey members.

2. **The free tier throttles per MINUTE**, not only the documented 500/day.
   Requests spaced under ~6.5s start returning 429. The `GAP` constant exists
   for this; lowering it makes the run fail, not finish sooner. A full refresh
   is ~240 requests and takes about half an hour of mostly sleeping.

Members are joined on `openStatesId`, stored in `data/legislators.json`. Do not
reintroduce name matching — the roll-call pass that used it needed a
hand-maintained alias list and still had two look-alike pairs (Kevin Egan vs
Joseph V. Egan, Marisa Sweeney vs Stephen M. Sweeney) that had to be excluded by
hand to avoid attributing votes to the wrong person.

**Sponsorship counts are deliberately not published**, and this was a decision,
not an omission. Open States' person-to-bill linkage is incomplete for New
Jersey: 21% of members returned 0 for the current session, and Al Abdelaziz
returned 0 across *every* session despite serving since 2018 and appearing in
the Legislature's own sponsor index. A real 0 and a missing link are
indistinguishable through the API, so publishing the number would assert
"sponsored nothing" about people for whom it is false — and if linkage is
partial, the non-zero counts may be undercounts too. The working query is
recorded in `scripts/refresh_legislator_data.py` if their coverage improves.

## Legislator photos come from the Legislature, not Open States

`scripts/scrape_member_photos.py` scrapes portraits from the NJ Legislature's
roster. Do not switch this back to the Open States `image` field: those URLs
point at `www.njleg.state.nj.us/members/memberphotos/`, a path the Legislature
retired, and **66 of the 71 return 404**. The live files are on
`pub.njleg.state.nj.us/publications/members/` and are only discoverable by
rendering the roster, which is a Next.js app — plain HTML fetching finds
nothing.

119 of 120 members have a photo. Every URL is verified to return an actual image
before being written to `data/legislators.json`, and `LegislatorPhoto` removes
itself on error, because a dead URL otherwise renders as an empty grey bubble
next to the member's name.

## Search-engine ownership

The IndexNow key in `lib/indexnow.ts` is paired with a matching
`public/<key>.txt`. They must stay in sync — the file is the ownership proof. A
fresh key was issued for this project; do not reuse another site's.

Google Search Console and Bing verification tokens are read from
`NEXT_PUBLIC_GSC_VERIFICATION` / `NEXT_PUBLIC_BING_VERIFICATION` and are unset
until this site is verified under its own domain.
