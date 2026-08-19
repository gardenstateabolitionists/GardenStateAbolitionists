/**
 * Assert every hardcoded site URL agrees with the real production domain.
 *
 *   node scripts/check_site_url.mjs
 *
 * This exists because the fork inherited AAM's URLs and they drifted silently.
 * At the point this was written, 21 files each declared their own
 * `process.env.NEXT_PUBLIC_SITE_URL || '<literal>'` fallback: 20 said
 * `gardenstateabolitionists.org` -- a domain that does not resolve -- and one
 * still said `abolishabortionmichigan.com`. Nothing compared them, so the odd
 * one out survived, and the Lighthouse workflow, the Google Ads final URLs and
 * every JSON-LD block pointed at a dead domain.
 *
 * A wrong canonical URL is invisible in review and expensive in the index, so
 * it gets asserted rather than eyeballed.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const CANONICAL = 'https://www.gardenstateabolitionists.com'
const HOST = 'www.gardenstateabolitionists.com'

// The AAM domain is legitimate in exactly two places: the footer credit link,
// and the state-partners list, where Abolish Abortion Michigan is a real entry
// alongside the other state organisations. Anywhere else it is fork residue.
const AAM_ALLOWED = new Set([
  'components/Footer.tsx',
  'data/abolition-partners.json',
])

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n').filter(Boolean)

const problems = []
for (const f of files) {
  if (f.startsWith('staged-for-nj/')) continue   // parked Michigan routes, inert
  let text
  try { text = readFileSync(f, 'utf8') } catch { continue }

  // Any GSA domain that is not the canonical one: wrong TLD, or missing www.
  for (const m of text.matchAll(/https?:\/\/([a-z0-9.-]*gardenstateabolitionists\.[a-z]+)/gi)) {
    if (m[1].toLowerCase() !== HOST) problems.push(`${f}: ${m[0]} (expected ${CANONICAL})`)
  }

  // The Michigan domain must not appear outside the credit link.
  if (/abolishabortionmichigan/i.test(text) && !AAM_ALLOWED.has(f) && !f.endsWith('.md')) {
    problems.push(`${f}: references abolishabortionmichigan (fork leftover?)`)
  }
}

if (problems.length) {
  console.error(`${problems.length} wrong site URL reference(s):`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log(`OK - every site URL is ${CANONICAL} (${files.length} tracked files checked)`)
