# Deploying to Vercel

The repo lives at
`gardenstateabolitionists/garden-state-abolitionists-website` (private).

## 1. Import the repo

In the Vercel dashboard → **Add New → Project** → import the repo. Vercel does
not create a project automatically when a repo is pushed; someone has to import
it once.

Framework preset should detect as **Next.js**. Leave the build settings alone —
`vercel.json` already pins them:

```json
"buildCommand": "pnpm build",
"installCommand": "pnpm install --frozen-lockfile"
```

If Vercel shows `npm install`, the `vercel.json` is not being read. Fix that
before deploying; npm resolves a different dependency tree than the committed
`pnpm-lock.yaml`.

## 2. Environment variables

**The first build fails without these three.** Prisma generates its client
during install and needs `DATABASE_URL` defined (it does not connect, but the
variable must exist).

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string, `?sslmode=require` |
| `JWT_SECRET` | ≥32 chars. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | The real site URL, e.g. `https://www.gardenstateabolitionists.org` |

Then, to make features actually work:

| Variable | Enables |
|---|---|
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_ACCESS_CODE`, `ADMIN_PIN` | Admin login at `/manage-7x9k` |
| `RESEND_API_KEY`, `RESEND_FROM` | Transactional email. Sending domain must be verified in Resend first. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limiting on forms |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Newsletter anti-spam |
| `NEXT_PUBLIC_ZEFFY_URL` | Donate buttons. Inert until set. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact page address |

See `.env.example` for the full annotated list.

### The `NEXT_PUBLIC_*` trap — read this

On Vercel, adding a Production variable **defaults to "Sensitive"**. A sensitive
variable is not inlined into the client bundle, so any `NEXT_PUBLIC_*` value set
that way becomes `undefined` in the browser — with **no build error**. The
symptom is a feature that silently never initializes (analytics that never
fires, a Turnstile widget that never renders).

Every `NEXT_PUBLIC_*` variable must be added with sensitivity **off**
(`--no-sensitive` via CLI). After changing one, push an empty commit to force a
fresh build — Vercel will otherwise serve the cached bundle.

## 3. Domain

Three places assume `gardenstateabolitionists.org`. Update all three together
when the real domain is known:

1. `NEXT_PUBLIC_SITE_URL` in Vercel
2. the apex→www redirect `has.value` in `next.config.ts`
3. the apex→www redirect in `vercel.json`

The redirect is a permanent 308 on purpose: Vercel's default apex→www redirect
is a temporary 307, which lets Google keep the non-www URL as canonical even
when the page's `rel="canonical"` says www.

## 4. Search engines — do this only after the real domain is live

`app/robots.ts` allows full indexing. Do not point search engines at a
`*.vercel.app` URL: it will be indexed as a separate site and compete with the
real domain.

Once the domain resolves:

- Verify in Google Search Console, set `NEXT_PUBLIC_GSC_VERIFICATION`
- Verify in Bing Webmaster Tools, set `NEXT_PUBLIC_BING_VERIFICATION`
- The IndexNow key is already committed as `lib/indexnow.ts` +
  `public/<key>.txt`. Both must stay in sync — the file is the ownership proof.

## 5. Do not add a database query to `/api/health`

If an uptime monitor is pointed at a route that queries Postgres, the database
never scales to zero and burns compute continuously. Point monitors at
`/api/health`, and keep that route DB-free.
