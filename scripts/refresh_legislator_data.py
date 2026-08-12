"""Refresh committee seats and sponsorship counts in data/legislators.json.

Run by .github/workflows/refresh-legislator-data.yml on the 1st of each month,
and manually via workflow_dispatch. Requires OPEN_STATES_API_KEY.

    python scripts/refresh_legislator_data.py            # from repo root
    python scripts/refresh_legislator_data.py --committees-only

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
  - A failed fetch leaves the existing value alone. It never writes null over
    real data, and it never writes 0 — a 0 renders as "sponsored nothing",
    which is a claim, whereas a missing value renders as nothing at all.
  - Writes the file only if something actually changed, so a no-op run
    produces no commit.
"""
from __future__ import annotations

import argparse
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
SESSION = "222"          # 2026-2027 Regular Session — bump each new session
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


def fetch_committees(key: str) -> dict[str, list[dict]]:
    """person id -> [{name, role}], for every committee in the jurisdiction."""
    seats: dict[str, list[dict]] = {}
    page = 1
    while True:
        url = (f"{API}/committees?jurisdiction={urllib.parse.quote(JURISDICTION, safe='')}"
               f"&include=memberships&per_page=20&page={page}")
        d = get(url, key)
        if not d or "results" not in d:
            break
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
    log(f"committees: {sum(len(v) for v in seats.values())} seats across {len(seats)} people")
    return seats


def fetch_sponsorship(pid: str, key: str, primary_only: bool) -> int | None:
    url = (f"{API}/bills?jurisdiction={urllib.parse.quote(JURISDICTION, safe='')}"
           f"&session={SESSION}&sponsor={urllib.parse.quote(pid, safe='')}&per_page=1"
           + ("&sponsor_classification=primary" if primary_only else ""))
    d = get(url, key)
    if not d:
        return None
    return d.get("pagination", {}).get("total_items")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--committees-only", action="store_true",
                    help="skip the slow per-member sponsorship pass")
    args = ap.parse_args()

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
    if seats:
        for l in legs:
            new = seats.get(l["openStatesId"])
            if new is None:
                continue          # fetch gap — keep what we have
            new.sort(key=lambda c: (0 if "chair" in c["role"] else 1, c["name"]))
            if new != l.get("committees"):
                l["committees"] = new
                changed += 1
        log(f"committee updates: {changed}")

    if not args.committees_only:
        n = len(legs)
        log(f"sponsorships: {n} members, ~{n * 2 * GAP / 60:.0f} min at the rate limit")
        for i, l in enumerate(legs, 1):
            total = fetch_sponsorship(l["openStatesId"], key, False)
            time.sleep(GAP)
            primary = fetch_sponsorship(l["openStatesId"], key, True)
            time.sleep(GAP)
            if total is None or primary is None:
                continue          # never overwrite real numbers with a failure
            if l.get("sponsorships") != primary or l.get("cosponsorships") != total - primary:
                l["sponsorships"] = primary
                l["cosponsorships"] = total - primary
                changed += 1
            if i % 20 == 0:
                log(f"  {i}/{n}")

    if changed:
        DATA_FILE.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n",
                             encoding="utf-8")
        log(f"wrote {DATA_FILE.name} ({changed} field groups changed)")
    else:
        log("no changes — file untouched")


if __name__ == "__main__":
    main()
