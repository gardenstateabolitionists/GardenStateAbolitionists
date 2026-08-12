"""Refresh committee seats in data/legislators.json.

Run by .github/workflows/refresh-legislator-data.yml on the 1st of each month,
and manually via workflow_dispatch. Requires OPEN_STATES_API_KEY.

    python scripts/refresh_legislator_data.py            # from repo root

SPONSORSHIP COUNTS ARE DELIBERATELY NOT FETCHED. Open States' person-to-bill
linkage is incomplete for New Jersey: 21% of members returned 0 for the current
session, and Al Abdelaziz returned 0 across every session despite serving since
2018 and appearing in the Legislature's own sponsor index. Since a real 0 and a
missing link are indistinguishable through the API, publishing the number would
assert "sponsored nothing" about people for whom it is false. If Open States
fixes its NJ coverage, the query is
/bills?jurisdiction=<ocd>&session=<n>&sponsor=<pid>&per_page=1, reading
pagination.total_items, with &sponsor_classification=primary for the split.

Two hard-won details about the Open States v3 API are encoded here. Both cost
real debugging time, so please do not "simplify" them away:

1.  The /committees endpoint IGNORES `jurisdiction=New Jersey`. Passed a plain
    state name it happily returns every committee in the country — 2955 of
    them, the first sample member being a Tennessee senator. Only the OCD id
    scopes it. Attributing another state's committees to New Jersey
    legislators is a silent, plausible-looking corruption, so JURISDICTION
    below is the OCD id and must stay that way.

2.  The free tier throttles per MINUTE as well as the documented 500/day.
    Requests closer together than ~6.5s start returning 429. GAP exists for
    that reason; lowering it does not make the run faster, it makes it fail.

Safety properties:

  - Joins on `openStatesId`, never on name. An earlier pass that matched
    members by name needed a hand-maintained alias list and still had two
    look-alike pairs to exclude by hand.
  - A failed fetch leaves the existing value alone, so a bad run degrades to
    stale data rather than to wrong data.
  - Writes the file only if something actually changed, so a no-op run
    produces no commit.
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
DATA_FILE = REPO_ROOT / "data" / "legislators.json"

JURISDICTION = "ocd-jurisdiction/country:us/state:nj/government"
GAP = 6.5                # see note 2 above
API = "https://v3.openstates.org"


def log(msg: str) -> None:
    print(f"[refresh] {msg}", flush=True)


def api_key() -> str:
    key = os.environ.get("OPEN_STATES_API_KEY")
    if not key:
        log("ERROR: OPEN_STATES_API_KEY is not set")
        sys.exit(1)
    return key


def get(url: str, key: str, attempts: int = 4) -> dict | None:
    for attempt in range(attempts):
        try:
            req = urllib.request.Request(url, headers={"X-API-KEY": key})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            if attempt == attempts - 1:
                log(f"  fetch failed: {url[:90]} ({e})")
                return None
            # A 429 means the per-minute window is full; only waiting past the
            # window helps, so back off beyond it rather than retrying sooner.
            time.sleep(65 if "429" in str(e) else 5 * (attempt + 1))
    return None


# Sanity floor. NJ has ~50 committees and ~360 seats across all 120 members.
# Anything far below that means we did not really get the whole picture.
MIN_SEATS = 250
MIN_PEOPLE = 110


def fetch_committees(key: str) -> dict[str, list[dict]] | None:
    """person id -> [{name, role}], or None if the pull was not complete.

    Returning None on ANY failed page is the important part. A member's seats
    are spread across pages, so a run that dies partway through does not just
    miss people — it produces short, entirely plausible-looking lists for the
    people it did see. That is worse than fetching nothing, and it is not
    hypothetical: a 429 mid-pagination once cut 366 seats down to 155 and the
    truncated version was written straight over the good data.
    """
    seats: dict[str, list[dict]] = {}
    page = 1
    while True:
        url = (f"{API}/committees?jurisdiction={urllib.parse.quote(JURISDICTION, safe='')}"
               f"&include=memberships&per_page=20&page={page}")
        d = get(url, key)
        if not d or "results" not in d:
            log(f"  ABORT: committee page {page} failed — refusing to write a partial pull")
            return None
        for c in d["results"]:
            for m in c.get("memberships") or []:
                pid = (m.get("person") or {}).get("id")
                if pid:
                    seats.setdefault(pid, []).append(
                        {"name": c["name"], "role": (m.get("role") or "member").lower()}
                    )
        if page >= d.get("pagination", {}).get("max_page", 1):
            break
        page += 1
        time.sleep(GAP)

    total = sum(len(v) for v in seats.values())
    log(f"committees: {total} seats across {len(seats)} people")
    if total < MIN_SEATS or len(seats) < MIN_PEOPLE:
        log(f"  ABORT: expected >={MIN_SEATS} seats across >={MIN_PEOPLE} people")
        return None
    return seats


def main() -> None:
    key = api_key()
    doc = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    legs = doc["legislators"]
    log(f"loaded {len(legs)} legislators")

    missing = [l["name"] for l in legs if not l.get("openStatesId")]
    if missing:
        log(f"ERROR: {len(missing)} without openStatesId, e.g. {missing[:3]}")
        sys.exit(1)

    changed = 0

    seats = fetch_committees(key)
    if seats is None:
        log("committees: skipped, existing data left untouched")
    else:
        for l in legs:
            new = seats.get(l["openStatesId"])
            if new is None:
                continue          # genuinely holds no seat this session
            new.sort(key=lambda c: (0 if "chair" in c["role"] else 1, c["name"]))
            if new != l.get("committees"):
                l["committees"] = new
                changed += 1
        log(f"committee updates: {changed}")

    if changed:
        DATA_FILE.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n",
                             encoding="utf-8")
        log(f"wrote {DATA_FILE.name} ({changed} field groups changed)")
    else:
        log("no changes — file untouched")


if __name__ == "__main__":
    main()
