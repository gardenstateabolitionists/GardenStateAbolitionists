"""Catch collapsed JSX spacing on the rendered pages.

`{value} word` broken across a line silently loses its space, producing
"Newark citythat". It is invisible in review and obvious to a reader, so it gets
checked against the built HTML rather than the source — see the project's
CLAUDE.md note on JSX text spacing.
"""
import json
import re
import sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
CITIES = json.load(open(r"C:\Users\Dustina\Websites\Garden State Abolitionists"
                        r"\data\nj-cities.json", encoding="utf-8"))["cities"]

# Values that get interpolated into prose. If one is immediately followed by a
# letter, a space was eaten.
def dynamic_values(c):
    return [c["name"], c["formalName"], c["county"], c["populationLabel"],
            str(c["population"]), *[str(d) for d in c["districts"]]]


def main(slugs):
    bad = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_context().new_page()
        for slug in slugs:
            c = next(x for x in CITIES if x["slug"] == slug)
            page.goto(f"{BASE}/cities/{slug}", wait_until="domcontentloaded", timeout=45000)
            page.wait_for_timeout(700)
            text = page.evaluate("document.body.innerText")
            for v in dynamic_values(c):
                if not v:
                    continue
                # A dynamic value glued straight onto a following word.
                # `(?!s\b)` spares legitimate plurals — "four Franklin Townships
                # in New Jersey" is prose, not a collapsed space.
                for m in re.finditer(re.escape(v) + r"(?!s\b)(?=[A-Za-z])", text):
                    frag = text[max(0, m.start() - 45): m.end() + 30].replace("\n", " ")
                    bad.append((slug, v, frag))
            # Generic: a word ending then a capital mid-sentence with no space.
            for m in re.finditer(r"[a-z]{3,}(?:city|township|borough|County)[a-z]{2,}", text):
                bad.append((slug, "generic", m.group(0)))
        # index page
        page.goto(f"{BASE}/cities", wait_until="domcontentloaded", timeout=45000)
        page.wait_for_timeout(700)
        t = page.evaluate("document.body.innerText")
        for m in re.finditer(r"[a-z]{3,}(?:city|township|borough|County)[a-z]{2,}", t):
            bad.append(("cities", "generic", m.group(0)))
        b.close()

    if not bad:
        print(f"OK — no collapsed spacing across {len(slugs)} city pages + index")
        return 0
    print(f"{len(bad)} spacing defects:")
    for slug, v, frag in bad:
        print(f"  [{slug}] {v!r} -> ...{frag}...")
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or [c["slug"] for c in CITIES][:6]))
