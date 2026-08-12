"""Regenerate data/abolitionist-churches.json from an NXR directory export.

    python scripts/sync_abolitionist_churches.py path/to/nj-churches.json

Takes only rows with abolitionStance == 'pro_abolition' in New Jersey. A church
appears on a city page because it is *publicly abolitionist*, not because it is
conservative or Reformed — the directory holds 106 New Jersey congregations and
the overwhelming majority of them do not qualify.

Each church is resolved to its MUNICIPALITY through the Census geocoder rather
than trusted to its mailing city, for the same reason the abortion facilities
are: New Jersey postal addresses name places that are not municipalities
("Somerset" is part of Franklin Township), and municipality names repeat across
counties. The Michigan original carried a hand-maintained alias table to paper
over this; geocoding removes the need for one.
"""
from __future__ import annotations

import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).parent.parent
OUT = REPO / "data" / "abolitionist-churches.json"
GEO = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress"


def geocode(addr: str) -> dict | None:
    params = {"address": addr, "benchmark": "Public_AR_Current",
              "vintage": "Current_Current", "layers": "all", "format": "json"}
    for attempt in range(6):
        try:
            req = urllib.request.Request(GEO + "?" + urllib.parse.urlencode(params),
                                         headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=90) as r:
                d = json.loads(r.read().decode())
            m = d["result"]["addressMatches"]
            if not m:
                return None
            g = m[0]["geographies"]
            pick = lambda frag: next((k for k in g if frag in k and g[k]), None)
            cs, co = pick("County Subdivision"), pick("Counties")
            return {
                "municipality": g[cs][0]["BASENAME"] if cs else None,
                "county": g[co][0]["BASENAME"] if co else None,
            }
        except Exception:
            if attempt == 5:
                return None
            time.sleep(4 * (attempt + 1))
    return None


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if not src or not src.exists():
        print("usage: sync_abolitionist_churches.py <nj-churches-export.json>")
        sys.exit(1)

    rows = json.loads(src.read_text(encoding="utf-8"))
    total = len(rows)
    picked = [c for c in rows
              if (c.get("abolitionStance") == "pro_abolition"
                  and (c.get("state") or "NJ").upper() == "NJ"
                  and c.get("approved", True))]
    print(f"{total} NJ rows scanned, {len(picked)} publicly abolitionist")

    out = []
    for c in picked:
        addr = (c.get("address") or "").strip()
        # Directory addresses are often just the street line. The geocoder
        # needs city and state, so compose them when they are missing rather
        # than handing it a fragment it cannot place.
        parts = [addr]
        if c.get("city") and c["city"].lower() not in addr.lower():
            parts.append(c["city"])
        if "nj" not in addr.lower():
            parts.append("NJ")
        if c.get("zip") and str(c["zip"]) not in addr:
            parts.append(str(c["zip"]))
        full = ", ".join(p for p in parts if p)

        loc = geocode(full) if addr else None
        if loc is None:
            print(f"  ! {c['name']}: could not resolve {full!r} — falling back to stored city")
        out.append({
            "id": str(c["id"]),
            "name": c["name"],
            "denomination": c.get("denomination"),
            "address": addr,
            "city": c.get("city"),
            # The join key. Falls back to the stored city so a geocoder outage
            # degrades to the old behaviour rather than dropping the church.
            "municipality": (loc or {}).get("municipality") or c.get("city"),
            "county": (loc or {}).get("county"),
            "state": "NJ",
            "website": c.get("website"),
            "phone": c.get("phone"),
            "email": c.get("email"),
            "pastor": c.get("leadership"),
            "notes": c.get("theologicalNotes"),
            "ministries": None,
            # Provenance, carried through so the page can say HOW we know.
            # 'evidenced' means we read it in the church's own words;
            # 'mixed' means it rests on someone else's listing and we could not
            # confirm it first-hand. Rendering those identically would be
            # exactly the collapse this project's research standard forbids.
            "stanceBasis": c.get("stanceBasis"),
            "verifyStance": "verify_stance" in (c.get("recordFlag") or ""),
            "listedBy": ("Abolitionists Rising"
                         if "added_via_ar_list" in (c.get("recordFlag") or "") else None),
            "listedByUrl": ("https://abolitionistsrising.com/state-facts/new-jersey/"
                            if "added_via_ar_list" in (c.get("recordFlag") or "") else None),
        })
        time.sleep(1.5)

    doc = {
        "note": ("Publicly-abolitionist churches (abolitionStance == 'pro_abolition') "
                 "from the NXR church directory. Regenerated by "
                 "scripts/sync_abolitionist_churches.py — do not hand-edit; fix the "
                 "directory and re-sync. Churches are joined to city pages on "
                 "`municipality`, which is geocoded, not on the mailing city."),
        "syncedAt": time.strftime("%Y-%m-%d"),
        "totalScanned": total,
        "matched": len(out),
        "churches": out,
    }
    OUT.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {OUT.name}: {len(out)} churches")
    for c in out:
        print(f"   {c['name']} — {c['municipality']}, {c['county']} County")


if __name__ == "__main__":
    main()
