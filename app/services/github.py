import json
from datetime import datetime, timedelta, timezone
from time import monotonic
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


_CACHE = {}


def _cache_get(key, lifetime=300):
    cached = _CACHE.get(key)
    if cached and monotonic() - cached[0] < lifetime:
        return cached[1]
    return None


def _cache_set(key, value):
    _CACHE[key] = (monotonic(), value)
    return value


def recent_public_activity(profile_url):
    """Resume eventos públicos do GitHub sem armazenar token no navegador."""

    username = _username_from_url(profile_url)
    if not username:
        return {"username": None, "total": 0, "days": []}

    cache_key = ("events", username)
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    request = Request(
        f"https://api.github.com/users/{username}/events/public?per_page=100",
        headers={"Accept": "application/vnd.github+json", "User-Agent": "igor-mota-portfolio"},
    )
    try:
        with urlopen(request, timeout=4) as response:
            events = json.load(response)
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
        return _cache_set(cache_key, {"username": username, "total": 0, "days": []})

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
    return _cache_set(cache_key, {"username": username, "total": len(events), "days": days})


def _username_from_url(profile_url):
    if not profile_url:
        return None
    parsed = urlparse(profile_url)
    if parsed.netloc.lower() not in {"github.com", "www.github.com"}:
        return None
    return next((part for part in parsed.path.split("/") if part), None)


def repository_progress(repository="igormauriciomota/python-practice-lab"):
    """Lê commits públicos e monta os dados do gráfico de evolução."""

    cache_key = ("repository", repository)
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    request = Request(
        f"https://api.github.com/repos/{repository}/commits?per_page=100",
        headers={"Accept": "application/vnd.github+json", "User-Agent": "igor-mota-portfolio"},
    )
    try:
        with urlopen(request, timeout=5) as response:
            commits = json.load(response)
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
        return _cache_set(cache_key, {
            "repository": repository,
            "repository_url": f"https://github.com/{repository}",
            "module_count": 20,
            "commit_count": None,
            "days": [],
            "recent_commits": [],
            "source": "unavailable",
        })

    counts = {}
    recent = []
    for item in commits:
        commit = item.get("commit") or {}
        author = commit.get("author") or commit.get("committer") or {}
        date = author.get("date")
        date_key = (date or "")[:10]
        if date_key:
            counts[date_key] = counts.get(date_key, 0) + 1
        if len(recent) < 6:
            recent.append(
                {
                    "sha": (item.get("sha") or "")[:7],
                    "message": (commit.get("message") or "Commit sem mensagem").splitlines()[0],
                    "date": date,
                    "url": item.get("html_url"),
                }
            )

    today = datetime.now(timezone.utc).date()
    days = []
    for offset in range(34, -1, -1):
        date = today - timedelta(days=offset)
        key = date.isoformat()
        days.append({"date": key, "count": counts.get(key, 0)})

    return _cache_set(cache_key, {
        "repository": repository,
        "repository_url": f"https://github.com/{repository}",
        "default_branch": "main",
        "module_count": 20,
        "commit_count": len(commits),
        "commit_history_complete": len(commits) < 100,
        "latest_commit_at": recent[0]["date"] if recent else None,
        "days": days,
        "recent_commits": recent,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "source": "live",
    })
