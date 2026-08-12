"""Add a geocoded `municipality` (and county, district) to every facility.

    python scripts/resolve_facility_municipalities.py [--apply]

Why this exists: the city pages need to know which facilities sit inside a
municipality, and the mailing city on an address does NOT answer that in New
Jersey.

  - "Somerset, NJ" is a neighbourhood of FRANKLIN TOWNSHIP.
  - "Hamilton Square, NJ" is part of HAMILTON TOWNSHIP.
  - "Washington, NJ 07882" is Washington BOROUGH in WARREN county — while
    Washington TOWNSHIP, Gloucester County is a different municipality sixty
    miles south and in a different legislative district.

Matching on the printed city name put a Warren County clinic on a Gloucester
County city page. Every facility is therefore geocoded, by address and — where
the address will not parse — by its stored coordinates.

Additive only: no existing field is modified, so /abortion-mills is unaffected.
"""
from __future__ import annotations

import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).parent.parent
DATA = REPO / "data" / "abortion-mills.json"
APPLY = "--apply" in sys.argv

BY_ADDR = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress"
BY_COORD = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates"
COMMON = {"benchmark": "Public_AR_Current", "vintage": "Current_Current",
          "layers": "all", "format": "json"}


def _fetch(url: str, params: dict) -> dict | None:
    for attempt in range(6):
        try:
            req = urllib.request.Request(url + "?" + urllib.parse.urlencode(params),
                                         headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=90) as r:
                return json.loads(r.read().decode())
        except Exception:
            if attempt == 5:
                return None
            time.sleep(4 * (attempt + 1))
    return None


def _read(geos: dict) -> dict:
    pick = lambda frag: next((k for k in geos if frag in k and geos[k]), None)
    cs, co, ld = pick("County Subdivision"), pick("Counties"), pick("Upper")
    return {
        "municipality": geos[cs][0]["BASENAME"] if cs else None,
        "county": geos[co][0]["BASENAME"] if co else None,
        "district": int(geos[ld][0]["BASENAME"]) if ld else None,
    }


def resolve(m: dict) -> dict | None:
    d = _fetch(BY_ADDR, {**COMMON, "address": m["address"]})
    matches = (d or {}).get("result", {}).get("addressMatches") or []
    if matches:
        return _read(matches[0]["geographies"])
    # Long suite lines and PO boxes defeat the address parser; the stored
    # coordinates place the building directly.
    if m.get("latitude") is not None and m.get("longitude") is not None:
        d = _fetch(BY_COORD, {**COMMON, "x": m["longitude"], "y": m["latitude"]})
        geos = (d or {}).get("result", {}).get("geographies")
        if geos:
            return {**_read(geos), "resolvedBy": "coordinates"}
    return None


def main() -> None:
    doc = json.loads(DATA.read_text(encoding="utf-8"))
    mills = doc["mills"] if isinstance(doc, dict) and "mills" in doc else doc

    changed = 0
    for m in mills:
        loc = resolve(m)
        if not loc:
            print(f"  UNRESOLVED  {m['city']:16} {m['name'][:44]}")
            continue
        note = ""
        if loc["municipality"] and loc["municipality"].lower() != (m["city"] or "").lower():
            note = f"   <-- mailing city '{m['city']}' is not the municipality"
        for k in ("municipality", "county", "district"):
            if m.get(k) != loc[k]:
                m[k] = loc[k]
                changed += 1
        print(f"  {m['city']:16} -> {str(loc['municipality']):16} "
              f"{str(loc['county']):11} LD {str(loc['district']):>3}{note}")
        time.sleep(1.5)

    print(f"\n{changed} field values set across {len(mills)} facilities")
    if APPLY:
        DATA.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {DATA.name}")
    else:
        print("DRY RUN — pass --apply to write")


if __name__ == "__main__":
    main()
