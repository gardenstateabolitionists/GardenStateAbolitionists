-- Add auto_post_to_social column to news_articles / NewsArticle.
-- Safe migration: NOT NULL with default TRUE means every existing row
-- gets the value TRUE automatically. No data loss risk.
--
-- Apply against Neon prod via one of:
--   1) psql "$DATABASE_URL" -f prisma/migrations/add-auto-post-to-social.sql
--   2) Neon SQL Editor: paste the ALTER TABLE line
--   3) `npx prisma db execute --file prisma/migrations/add-auto-post-to-social.sql`
--
-- DO NOT use `prisma migrate dev` — that uses a shadow DB and has
-- historically wiped MRA prod (2026-07-09 incident). `db execute` and
-- direct psql are safe for pure ALTERs.

ALTER TABLE "NewsArticle"
  ADD COLUMN IF NOT EXISTS "auto_post_to_social" BOOLEAN NOT NULL DEFAULT TRUE;
