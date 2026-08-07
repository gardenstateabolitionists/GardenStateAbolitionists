# Social auto-posting setup — Facebook, Instagram, Pinterest

This is the how-to for the AAM admin (Jmark) to grab the access tokens
required for the site to auto-post news articles to social. When a new
article publishes on `/news`, the site will (once tokens are set):

- Post to the **Garden State Abolitionists** Facebook Page
- Cross-post the same image + link to the linked **Instagram**
  Business account
- Cross-post to **Pinterest** if we're approved for their API

All three platforms use short-lived tokens by default. You want
**long-lived** tokens that don't expire (or last 60+ days) so the site
doesn't break every Sunday. This guide walks you through getting each
one.

Once you have the values, drop them into Vercel with `--no-sensitive`
(they're server-side but treated like public env vars for reliability).

---

## Facebook Page + Instagram (single Meta setup)

Instagram Business accounts linked to a Facebook Page share Meta's
Graph API — one long-lived token opens both doors.

### Step 1: prerequisites

- You must be **Admin** (not Editor, not Moderator) of the
  Garden State Abolitionists Facebook Page. Dustin should have added
  you already; confirm at
  [business.facebook.com](https://business.facebook.com/settings/pages).
- The Instagram account must be a **Business** account (not Personal
  or Creator) and must be **linked** to the AAM Facebook Page. Verify
  under Facebook Page → Settings → Linked accounts → Instagram.

### Step 2: get your Page ID

1. Open [business.facebook.com/settings/pages](https://business.facebook.com/settings/pages).
2. Click the AAM page.
3. Look at the URL: `.../pages/PAGE_ID/...` — that number is the Page ID.
4. Alternatively: on the Page itself, click **About** → scroll to
   **Page transparency** → copy Page ID.

Save this as env var **`FB_PAGE_ID`**.

### Step 3: get your Instagram Business Account ID

1. Open the [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
2. Set Meta App to **AAM** (create one if it doesn't exist — see
   Section "Creating a Meta app" below).
3. Query:

   ```
   GET /me/accounts?fields=id,name,instagram_business_account
   ```

4. In the response, find the row for the AAM Facebook Page. It should
   have an `instagram_business_account.id` field. Copy that number.

Save as env var **`IG_BUSINESS_ACCOUNT_ID`**.

### Step 4: get a long-lived Page Access Token

Long-lived Page tokens **do not expire** as long as you don't change
the password on the underlying user account. This is the token the
site actually uses to post.

1. In the Graph API Explorer, generate a **User Access Token** with
   these permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `pages_show_list`
   - `instagram_basic`
   - `instagram_content_publish`
   - `business_management`
2. Copy the token (starts with `EAA...`).
3. Convert it to a long-lived User token via curl:

   ```
   curl -G "https://graph.facebook.com/v20.0/oauth/access_token" \
     -d "grant_type=fb_exchange_token" \
     -d "client_id=<APP_ID>" \
     -d "client_secret=<APP_SECRET>" \
     -d "fb_exchange_token=<SHORT_LIVED_USER_TOKEN>"
   ```

   `APP_ID` and `APP_SECRET` are in your Meta App dashboard →
   Settings → Basic.

4. Now get a **never-expiring Page Access Token** from the long-lived
   user token:

   ```
   curl -G "https://graph.facebook.com/v20.0/me/accounts" \
     -d "access_token=<LONG_LIVED_USER_TOKEN>"
   ```

   Find the AAM Page in the response, copy its `access_token`.

Save this as env var **`FB_PAGE_ACCESS_TOKEN`**.

### Known Meta gotcha (from MRA):

**"New-Pages" experience Pages don't appear in `/me/accounts`.** If
step 4 returns an empty list, the AAM page has been migrated to Meta's
new Pages system and needs a workaround:

1. In [business.facebook.com](https://business.facebook.com), open
   Business Settings → Business Assets → Pages.
2. Confirm the AAM page shows there. If it does, right-click → copy Page ID.
3. Use the token from step 2 directly with the Page ID:

   ```
   curl "https://graph.facebook.com/v20.0/PAGE_ID?fields=access_token&access_token=<LONG_LIVED_USER_TOKEN>"
   ```

   That returns the Page token even for New-Pages pages.

---

## Pinterest

**Heads up:** MRA's Pinterest app was denied API access in July 2026.
Pinterest is currently gatekeeping their business API pretty tightly.
Follow the steps and don't be surprised if it takes multiple tries or
gets rejected. If denied, we can revisit later.

### Step 1: prerequisites

- Pinterest **Business** account for AAM (not personal). Convert at
  [business.pinterest.com](https://business.pinterest.com/).
- Verify the gardenstateabolitionists.org domain via
  [Ads → Claim](https://www.pinterest.com/settings/claim).

### Step 2: create a Pinterest app

1. Go to [developers.pinterest.com/apps](https://developers.pinterest.com/apps).
2. Click **Create app**.
3. Fill in:
   - **App name:** `AAM Site Auto-Post`
   - **Description:** *"Auto-posts published news articles from our own
     WordPress-alternative website to our Pinterest business
     account. All content is our own original text and images."*
   - **Website URL:** `https://www.gardenstateabolitionists.org/`
   - **Privacy policy URL:** `https://www.gardenstateabolitionists.org/privacy-policy`
4. Request scopes: `boards:read`, `pins:read`, `pins:write`.
5. Submit for review. Turnaround: 3-10 business days.

### Step 3: once approved, get an access token

1. From the app dashboard, click **Generate access token**.
2. Copy the token.

Save as env var **`PINTEREST_ACCESS_TOKEN`**.

You'll also need a board ID to post to — grab that from
`GET https://api.pinterest.com/v5/boards` after authenticating.

Save as env var **`PINTEREST_BOARD_ID`**.

---

## Creating a Meta app (if you don't have one)

If AAM doesn't already have a Meta App:

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps).
2. Click **Create App**.
3. App type: **Business**.
4. App name: `Garden State Abolitionists Site`.
5. Business Account: link to the AAM Business Manager.
6. Add these products:
   - **Facebook Login** (needed for token exchange)
   - **Instagram Graph API**
7. Under App Review → Permissions, request:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `pages_show_list`
   - `instagram_basic`
   - `instagram_content_publish`

For live use with tokens that don't expire, your app needs to be in
**Live** mode (not Development). Meta requires App Review for that —
they'll ask for a screencast of the auto-posting flow. That's a
15-minute recording.

---

## Setting the env vars in Vercel

Once you have any subset of the values above, drop them into Vercel:

```
cd "C:/Users/Dustina/Websites/AAM Website"

printf '%s' '<PAGE_ID>' | vercel env add FB_PAGE_ID production --no-sensitive
printf '%s' '<PAGE_TOKEN>' | vercel env add FB_PAGE_ACCESS_TOKEN production --no-sensitive
printf '%s' '<IG_ID>' | vercel env add IG_BUSINESS_ACCOUNT_ID production --no-sensitive
printf '%s' '<PINTEREST_TOKEN>' | vercel env add PINTEREST_ACCESS_TOKEN production --no-sensitive
printf '%s' '<PINTEREST_BOARD>' | vercel env add PINTEREST_BOARD_ID production --no-sensitive

git commit --allow-empty -m "chore: rebuild for social auto-post env vars"
git push origin main
```

Note: `--no-sensitive` is required so the site can actually read the
values. Vercel defaults to `--sensitive` which hides them from the
runtime.

---

## What the code does with these tokens

When a news article publishes (from `/manage-7x9k/news`), the server
action `postNewsToSocial(article)` fires in the background. It:

1. Checks which token env vars are set. Missing = skipped, no error.
2. Posts to FB with the article title, excerpt, image, and a link back
   to `/news/[slug]?utm_source=facebook&utm_medium=share`.
3. Posts the same image + caption to IG. IG doesn't support links in
   captions but the `bio.link` on our profile can point at `/news`.
4. Posts to Pinterest — pin image = the article's hero image, pin
   description = the excerpt, pin link = the article URL.

All three are wrapped in try/catch so any single failure doesn't break
article publishing. Failures log to Sentry with the article slug so
they're diagnosable.

Verified working pattern: this is the same infrastructure MRA has been
running since July 2026 — code lives in `lib/social/*.ts`.
