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

## Search-engine ownership

The IndexNow key in `lib/indexnow.ts` is paired with a matching
`public/<key>.txt`. They must stay in sync — the file is the ownership proof. A
fresh key was issued for this project; do not reuse another site's.

Google Search Console and Bing verification tokens are read from
`NEXT_PUBLIC_GSC_VERIFICATION` / `NEXT_PUBLIC_BING_VERIFICATION` and are unset
until this site is verified under its own domain.
