import json
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


def recent_public_activity(profile_url):
    """Resume eventos públicos do GitHub sem armazenar token no navegador."""

    username = _username_from_url(profile_url)
    if not username:
        return {"username": None, "total": 0, "days": []}

    request = Request(
        f"https://api.github.com/users/{username}/events/public?per_page=100",
        headers={"Accept": "application/vnd.github+json", "User-Agent": "igor-mota-portfolio"},
    )
    try:
        with urlopen(request, timeout=4) as response:
            events = json.load(response)
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
        return {"username": username, "total": 0, "days": []}

    counts = {}
    for event in events:
        date = (event.get("created_at") or "")[:10]
        if date:
            counts[date] = counts.get(date, 0) + 1

    today = datetime.now(timezone.utc).date()
    days = []
    for offset in range(48, -1, -1):
        date = today - timedelta(days=offset)
        key = date.isoformat()
        days.append({"date": key, "count": counts.get(key, 0)})
    return {"username": username, "total": len(events), "days": days}


def _username_from_url(profile_url):
    if not profile_url:
        return None
    parsed = urlparse(profile_url)
    if parsed.netloc.lower() not in {"github.com", "www.github.com"}:
        return None
    return next((part for part in parsed.path.split("/") if part), None)
