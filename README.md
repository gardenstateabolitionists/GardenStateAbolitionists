# Garden State Abolitionists

Advocacy site for a New Jersey abolitionist organization. Next.js 16 (App
Router) · Prisma/Postgres · Resend · PostHog · Sentry · Tailwind 4.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in the values
pnpm dev
```

pnpm is required and pinned via `packageManager`. Do not add a
`package-lock.json` — Vercel picks its package manager by lockfile detection,
and two lockfiles produce a dependency tree that differs from what deploys.

## Before this site goes live

The site is built and builds clean, but several fields ship **deliberately
blank** so that nothing false is published. Each one hides its own section until
filled, so the site is presentable in the meantime — but these are the launch
blockers.

In `lib/content.ts`:

| Field | Gates | Notes |
|---|---|---|
| `socialLinks` | Footer / contact / media icons, JSON-LD `sameAs` | Facebook, X, Instagram, Signal group |
| `orgInfo.contactEmail` | `/contact`, structured data | Or set `NEXT_PUBLIC_CONTACT_EMAIL` |
| `orgInfo.mailingAddress` | "Mail a Check" on `/donate`, postal address in JSON-LD | **Do not guess.** This tells donors where to send money. |
| `orgInfo.taxStatus` | Every 501(c)(3) and tax-deductibility claim sitewide | Leave blank until the IRS determination letter exists |
| `orgInfo.founded` | `/financial-transparency` | |
| `statistics` + `statisticsSource` | Homepage counter row | New Jersey figures with a citable source |

Also required:

- **Logo.** `public/images/aa-logo.webp` and `.png` are still the source
  organization's mark and must be replaced with the client's before launch.
  Referenced from the header, mobile nav, footer, homepage hero, and both
  OpenGraph image routes.
- **`NEXT_PUBLIC_ZEFFY_URL`** — the donation form slug is assigned by Zeffy and
  cannot be guessed. Donate CTAs stay inert until it is set.
- **Domain** — `NEXT_PUBLIC_SITE_URL`, the apex→www redirect in
  `next.config.ts`, and `vercel.json` all currently assume
  `gardenstateabolitionists.org`. Update all three if the real domain differs.

## Known inherited issues

`pnpm lint` reports 15 `react-hooks/set-state-in-effect` errors in the admin
dashboard components. These came from the upstream codebase unchanged and are
not caused by anything in this port. They do not block `pnpm build`. Worth
fixing, but they are pre-existing behavior, so fix them deliberately rather than
as part of a rebrand.

## Staged work

`staged-for-nj/` holds the routes and datasets that were inseparable from
Michigan — legislators, abolition bills, abortion facilities, city pages, county
statistics. It is excluded from both the build and lint. See
`staged-for-nj/README.md` for what each needs and the checklist for restoring a
route without leaving 404s in the sitemap.

## Project conventions

See `CLAUDE.md` — in particular the New Jersey legal context (which differs
sharply from Michigan's and constrains what advocacy copy can truthfully say),
and the JSX spacing rule.
