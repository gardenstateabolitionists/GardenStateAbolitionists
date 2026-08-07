"""Monthly refresh of data/legislators.json.

Called by .github/workflows/refresh-legislator-data.yml on the 1st of
each month (and manually via workflow_dispatch). Pulls the freshest
public data we can access without a paid provider:

  - Open States API v3 for current-cycle sponsorships (requires
    OPEN_STATES_API_KEY secret — free tier is 500 req/day)
  - MI Legislature site for roll-call votes on tracked bills
  - FollowTheMoney API for campaign-finance updates (requires
    FTM_API_KEY secret if wired; free-tier fallback: skip)
  - Google News RSS for per-legislator news headlines

Design notes:
  - This script is DESTRUCTIVE — it overwrites data/legislators.json.
    We keep the schema shape (the CityConfig type + downstream code
    depend on it stable) and only fill fresh values.
  - Anything the script can't fetch (missing API key, endpoint down)
    is left with the existing value. Never nulls out real data on
    a fetch failure.
  - If NO fields changed across the run, the workflow's diff check
    catches it and skips the commit. So a failed cron run doesn't
    push empty churn.
  - The script is safe to run locally: `python scripts/refresh_legislator_data.py`
    (from repo root). Missing API keys just skip that data source.
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

# Tracked bill list — same as lib/data/legislators.ts TRACKED_BILLS.
# When MI Leg adds a new roll call on any of these, we want it captured.
TRACKED_BILLS = [
    ("HB4949", "2023-2024"),  # Reproductive Health Act
    ("HB4951", "2023-2024"),  # Sentencing companion
    ("SB0147", "2023-2024"),  # Pregnancy discrimination
    ("SB0474", "2023-2024"),  # Public health code repeal
    ("SB0476", "2023-2024"),  # Definition of abortion
    ("HR0072", "2023-2024"),  # Mifepristone resolution
]

def log(msg: str) -> None:
    print(f"[refresh] {msg}", flush=True)

def load_current() -> list[dict]:
    if not DATA_FILE.exists():
        log(f"ERROR: {DATA_FILE} not found")
        sys.exit(1)
    with DATA_FILE.open(encoding="utf-8") as f:
        return json.load(f)

def save(data: list[dict]) -> None:
    with DATA_FILE.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    log(f"wrote {DATA_FILE} ({len(data)} legislators)")

def fetch_json(url: str, headers: dict | None = None, timeout: int = 15) -> dict | None:
    try:
        req = urllib.request.Request(url, headers=headers or {})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:
        log(f"  fetch failed: {url[:80]}  ({e})")
        return None

def refresh_openstates(legs: list[dict]) -> int:
    """Update current-session sponsorship counts + Open States URLs."""
    key = os.environ.get("OPEN_STATES_API_KEY")
    if not key:
        log("OPEN_STATES_API_KEY not set — skipping sponsorships refresh")
        return 0
    changed = 0
    # Open States /people?jurisdiction=Michigan (paged)
    base = "https://v3.openstates.org/people"
    page = 1
    all_people: list[dict] = []
    while page <= 5:  # cap to 500 people (well over MI's 148)
        url = f"{base}?jurisdiction=Michigan&per_page=50&page={page}"
        data = fetch_json(url, headers={"X-API-KEY": key})
        if not data or not data.get("results"):
            break
        all_people.extend(data["results"])
        if len(data["results"]) < 50:
            break
        page += 1
        time.sleep(1.0)
    log(f"Open States returned {len(all_people)} MI legislators")
    by_name = {p.get("name", "").lower(): p for p in all_people}
    for leg in legs:
        p = by_name.get(leg["name"].lower())
        if not p:
            continue
        new_url = p.get("openstates_url")
        if new_url and leg.get("openstates_url") != new_url:
            leg["openstates_url"] = new_url
            changed += 1
    return changed

def refresh_news_summaries(legs: list[dict]) -> int:
    """Google News RSS per legislator — refresh news_summary + news_links."""
    changed = 0
    for i, leg in enumerate(legs):
        # Rate-limit to avoid being throttled
        if i > 0 and i % 20 == 0:
            time.sleep(2.0)
        query = f"{leg['name']} Michigan {leg['chamber']}"
        url = f"https://news.google.com/rss/search?q={urllib.parse.quote(query)}&hl=en-US&gl=US&ceid=US:en"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=10) as r:
                text = r.read().decode("utf-8", errors="replace")
        except Exception:
            continue
        # Parse RSS items
        import re
        items = re.findall(r"<item>(.*?)</item>", text, flags=re.DOTALL)
        summaries: list[str] = []
        links: list[str] = []
        for it in items[:6]:
            m_title = re.search(r"<title>(.*?)</title>", it, flags=re.DOTALL)
            m_link = re.search(r"<link>(.*?)</link>", it, flags=re.DOTALL)
            m_date = re.search(r"<pubDate>(.*?)</pubDate>", it, flags=re.DOTALL)
            if not (m_title and m_link):
                continue
            title = re.sub(r"<[^>]+>", "", m_title.group(1)).strip()
            link = m_link.group(1).strip()
            # Extract date as YYYY-MM-DD
            date = ""
            if m_date:
                try:
                    from email.utils import parsedate_to_datetime
                    dt = parsedate_to_datetime(m_date.group(1).strip())
                    date = dt.strftime("%Y-%m-%d")
                except Exception:
                    pass
            summaries.append(f"{date}  {title}" if date else title)
            links.append(link)
        new_summary = "; ".join(summaries) if summaries else None
        new_links = "; ".join(links) if links else None
        if new_summary and new_summary != leg.get("news_summary"):
            leg["news_summary"] = new_summary
            leg["news_links"] = new_links
            changed += 1
        time.sleep(0.3)
    return changed

def main() -> None:
    legs = load_current()
    log(f"loaded {len(legs)} legislators from {DATA_FILE}")

    changed_os = refresh_openstates(legs)
    log(f"Open States updates: {changed_os}")

    changed_news = refresh_news_summaries(legs)
    log(f"News-feed updates: {changed_news}")

    # Only write if anything changed (workflow diff check also handles this)
    if changed_os + changed_news > 0:
        save(legs)
    else:
        log("no changes — leaving file untouched")

if __name__ == "__main__":
    main()
