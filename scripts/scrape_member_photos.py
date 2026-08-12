"""Scrape current member photos from the NJ Legislature's own roster.

    pip install playwright && playwright install chromium
    python scripts/scrape_member_photos.py

Writes nj_photos.json; the match into data/legislators.json is on
(chamber, district, surname) and every URL is verified to return an image
before being written. Run this if portraits start 404ing again.

Open States' photo URLs point at www.njleg.state.nj.us/members/memberphotos/,
which the Legislature has retired — 66 of the 71 return 404, so most detail
pages were rendering an empty bordered circle. The live photos are served from
pub.njleg.state.nj.us/publications/members/ and are only discoverable by
rendering the roster, which is a Next.js app.

Members are keyed by (chamber, district, surname). District alone is ambiguous
(each elects two assembly members) and surname alone collides, but the triple
is unique — and unlike a name match it cannot quietly put one person's face
next to another person's name.
"""
import json, re, unicodedata, os
from concurrent.futures import ThreadPoolExecutor
from playwright.sync_api import sync_playwright

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'nj_photos.json')
ROSTER = 'https://www.njleg.state.nj.us/legislative-roster'


def norm(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z]', '', s.lower())


def scrape(links):
    out = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        for url in links:
            rec = {'url': url, 'photo': None, 'name': None, 'district': None}
            try:
                pg.goto(url, wait_until='domcontentloaded', timeout=45000)
                pg.wait_for_timeout(1200)
                photo = pg.eval_on_selector_all(
                    'img',
                    "els=>els.map(e=>e.currentSrc||e.src)"
                    ".filter(s=>s.includes('/publications/members/'))")
                rec['photo'] = photo[0] if photo else None
                txt = pg.inner_text('body')
                m = re.search(r'District\s+(\d+)', txt)
                rec['district'] = int(m.group(1)) if m else None
                h = pg.query_selector('h1')
                rec['name'] = h.inner_text().strip() if h else None
            except Exception as e:
                rec['error'] = str(e)[:80]
            out.append(rec)
            print('  %-58s %s' % (url.split('/')[-1][:58],
                                  'ok' if rec['photo'] else 'no photo'), flush=True)
        b.close()
    return out


with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.goto(ROSTER, wait_until='networkidle', timeout=60000)
    pg.wait_for_timeout(3000)
    links = pg.eval_on_selector_all(
        'a', "els=>[...new Set(els.map(e=>e.href).filter(h=>/legislative-roster\\/\\d+\\//.test(h)))]")
    b.close()
print('member pages:', len(links), flush=True)

chunks = [links[i::4] for i in range(4)]
with ThreadPoolExecutor(max_workers=4) as ex:
    results = [r for part in ex.map(scrape, chunks) for r in part]

json.dump(results, open(OUT, 'w', encoding='utf-8'), indent=1)
got = sum(1 for r in results if r['photo'])
print('scraped %d pages, %d with photos' % (len(results), got))
