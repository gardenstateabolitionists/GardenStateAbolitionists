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

# The words a sentence actually resumes with after an interpolated value.
# "…{city.formalName} that have taken…" collapsing to "Newark citythat" is the
# real failure; anything else risks flagging ordinary English.
FOLLOWING_WORD = (
    r"(?=(?:that|the|is|are|was|were|in|on|and|with|for|to|has|have|had|which|"
    r"where|when|by|from|of|a|an|its|it|this|these|those|sits|holds|counted|"
    r"county|township|city|residents|elects|because|but|not|so|at|as|after|"
    r"before|while|than|or|until|since|and|held|grew)\b)"
)


# Values that get interpolated into prose. If one is welded to a following
# word, a space was eaten.
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
                # A collapsed space shows up as a dynamic value welded to the
                # next WORD, so look for an actual following word rather than
                # any letter. Matching any letter produced false positives on
                # both sides: "Franklin Townships" (a plural) and "Morristown"
                # (which merely starts with the county name "Morris").
                for m in re.finditer(re.escape(v) + FOLLOWING_WORD, text):
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
    # Default to EVERY city, not a slice. This once defaulted to the first six
    # and still printed "OK — no collapsed spacing", so a pass over 6 of 62 pages
    # read exactly like a pass over all of them. Pass slugs explicitly to narrow.
    sys.exit(main(sys.argv[1:] or [c["slug"] for c in CITIES]))
