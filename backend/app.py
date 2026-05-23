from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from typing import Any
from urllib import error, parse, request

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from chessdotcom import Client, get_player_profile, get_player_stats


APP_NAME = "os-website-monkeytype-api"
CACHE_TTL_SECONDS = 60
MONKEYTYPE_API_BASE = "https://api.monkeytype.com"
MONKEYTYPE_HEADERS = {
    "User-Agent": "OS-WEBSITE Stats Dashboard/1.0 (+https://monkeytype.com/profile/gaxxrav)",
    "Accept": "application/json",
}

app = FastAPI(title=APP_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_cache: dict[str, tuple[float, dict[str, Any]]] = {}

Client.request_config["headers"]["User-Agent"] = (
    "OS-WEBSITE Stats Dashboard (contact: gaurav.murali3@gmail.com)"
)


def _fetch_json(url: str) -> dict[str, Any]:
    api_request = request.Request(url, headers=MONKEYTYPE_HEADERS)
    try:
        with request.urlopen(api_request, timeout=10) as response:
            payload = response.read().decode("utf-8")
    except error.HTTPError as exc:  # pragma: no cover - depends on remote API
        detail = exc.read().decode("utf-8", errors="replace") or str(exc)
        status_code = exc.code if exc.code in (400, 401, 403, 404, 429, 503) else 502
        raise HTTPException(status_code=status_code, detail=detail) from exc
    except error.URLError as exc:  # pragma: no cover - depends on remote API
        raise HTTPException(status_code=502, detail=str(exc.reason)) from exc

    try:
        parsed = json.loads(payload)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail="Monkeytype returned invalid JSON.") from exc

    if not isinstance(parsed, dict):
        raise HTTPException(status_code=502, detail="Monkeytype returned an unexpected payload.")

    return parsed


def _iso_from_millis(timestamp: Any) -> str | None:
    if timestamp in (None, ""):
        return None
    try:
        return datetime.fromtimestamp(int(timestamp) / 1000, tz=timezone.utc).isoformat()
    except (TypeError, ValueError, OSError):
        return None


def _coerce_int(value: Any) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _coerce_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _format_pb_label(category: str, key: str) -> str:
    unit = "sec" if category == "time" else "words"
    return f"{key} {unit}"


def _normalize_pb_entry(category: str, key: str, entries: Any) -> dict[str, Any] | None:
    if not isinstance(entries, list) or not entries:
        return None

    latest = entries[0] if isinstance(entries[0], dict) else None
    if latest is None:
        return None

    return {
        "category": category,
        "label": _format_pb_label(category, key),
        "wpm": _coerce_float(latest.get("wpm")),
        "raw": _coerce_float(latest.get("raw")),
        "accuracy": _coerce_float(latest.get("acc")),
        "consistency": _coerce_float(latest.get("consistency")),
        "timestamp": _iso_from_millis(latest.get("timestamp")),
        "language": latest.get("language"),
        "difficulty": latest.get("difficulty"),
        "punctuation": bool(latest.get("punctuation")),
        "numbers": bool(latest.get("numbers")),
    }


def _normalize_personal_bests(payload: Any) -> list[dict[str, Any]]:
    if not isinstance(payload, dict):
        return []

    personal_bests: list[dict[str, Any]] = []
    for category in ("time", "words", "zen"):
        entries = payload.get(category)
        if not isinstance(entries, dict):
            continue

        for key, value in entries.items():
            normalized = _normalize_pb_entry(category, str(key), value)
            if normalized:
                personal_bests.append(normalized)

    personal_bests.sort(
        key=lambda item: (
            item.get("wpm") is not None,
            item.get("wpm") or 0,
        ),
        reverse=True,
    )
    return personal_bests


def _extract_profile(profile: dict[str, Any], username: str) -> dict[str, Any]:
    typing_stats = profile.get("typingStats") if isinstance(profile.get("typingStats"), dict) else {}
    details = profile.get("details") if isinstance(profile.get("details"), dict) else {}
    social_profiles = details.get("socialProfiles") if isinstance(details.get("socialProfiles"), dict) else {}
    activity = profile.get("testActivity") if isinstance(profile.get("testActivity"), dict) else {}
    tests_by_days = activity.get("testsByDays") if isinstance(activity.get("testsByDays"), list) else []

    return {
        "username": profile.get("name") or username,
        "uid": profile.get("uid"),
        "xp": _coerce_int(profile.get("xp")),
        "isPremium": bool(profile.get("isPremium")),
        "banned": bool(profile.get("banned")),
        "joinedAt": _iso_from_millis(profile.get("addedAt")),
        "streak": _coerce_int(profile.get("streak")),
        "maxStreak": _coerce_int(profile.get("maxStreak")),
        "typingStats": {
            "completedTests": _coerce_int(typing_stats.get("completedTests")),
            "startedTests": _coerce_int(typing_stats.get("startedTests")),
            "timeTyping": _coerce_int(typing_stats.get("timeTyping")),
        },
        "activity": {
            "testsByDays": [_coerce_int(day) or 0 for day in tests_by_days],
            "lastDay": _coerce_int(activity.get("lastDay")),
        },
        "personalBests": _normalize_personal_bests(profile.get("personalBests")),
        "bio": details.get("bio"),
        "keyboard": details.get("keyboard"),
        "showActivityOnPublicProfile": bool(details.get("showActivityOnPublicProfile")),
        "socialProfiles": {
            "github": social_profiles.get("github"),
            "twitter": social_profiles.get("twitter"),
            "website": social_profiles.get("website"),
        },
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
    }


def _build_monkeytype_profile(username: str) -> dict[str, Any]:
    normalized_username = username.strip()
    if not normalized_username:
        raise HTTPException(status_code=400, detail="Username is required.")

    now = time.time()
    cached = _cache.get(normalized_username.lower())
    if cached and now - cached[0] < CACHE_TTL_SECONDS:
        return cached[1]

    encoded_username = parse.quote(normalized_username, safe="")
    api_response = _fetch_json(f"{MONKEYTYPE_API_BASE}/users/{encoded_username}/profile")
    profile = api_response.get("data")
    if not isinstance(profile, dict):
        raise HTTPException(status_code=502, detail="Monkeytype returned an unexpected profile payload.")

    payload = _extract_profile(profile, normalized_username)
    _cache[normalized_username.lower()] = (now, payload)
    return payload


def _iso_from_unix(timestamp: Any) -> str | None:
    if timestamp in (None, ""):
        return None
    try:
        return datetime.fromtimestamp(int(timestamp), tz=timezone.utc).isoformat()
    except (TypeError, ValueError, OSError):
        return None


def _extract_mode_stats(label: str, payload: dict[str, Any] | None) -> dict[str, Any]:
    if not payload:
        return {
            "label": label,
            "rating": None,
            "best": None,
            "record": None,
        }

    record = payload.get("record")
    normalized_record = None
    if isinstance(record, dict):
        normalized_record = {
            "win": int(record.get("win", 0) or 0),
            "loss": int(record.get("loss", 0) or 0),
            "draw": int(record.get("draw", 0) or 0),
        }

    return {
        "label": label,
        "rating": payload.get("last", {}).get("rating"),
        "best": payload.get("best", {}).get("rating"),
        "record": normalized_record,
    }


def _normalize_profile_payload(payload: Any) -> dict[str, Any]:
    if isinstance(payload, dict) and "player" in payload and isinstance(payload["player"], dict):
        return payload["player"]
    if isinstance(payload, dict):
        return payload
    return {}


def _normalize_stats_payload(payload: Any) -> dict[str, Any]:
    if isinstance(payload, dict) and "stats" in payload and isinstance(payload["stats"], dict):
        return payload["stats"]
    if isinstance(payload, dict):
        return payload
    return {}


def _build_chess_stats(username: str) -> dict[str, Any]:
    cache_key = f"chess:{username.lower()}"
    now = time.time()
    cached = _cache.get(cache_key)
    if cached and now - cached[0] < CACHE_TTL_SECONDS:
        return cached[1]

    try:
        profile_response = get_player_profile(username)
        stats_response = get_player_stats(username)
    except Exception as exc:  # pragma: no cover - depends on remote API
        detail = str(exc)
        status_code = 404 if "404" in detail or "Not Found" in detail else 502
        raise HTTPException(status_code=status_code, detail=detail) from exc

    profile = _normalize_profile_payload(getattr(profile_response, "json", {}))
    stats = _normalize_stats_payload(getattr(stats_response, "json", {}))

    payload = {
        "username": profile.get("username", username),
        "status": profile.get("status"),
        "followers": profile.get("followers"),
        "league": (profile.get("league") or "").title() if profile.get("league") else None,
        "joined": _iso_from_unix(profile.get("joined")),
        "lastOnline": _iso_from_unix(profile.get("last_online")),
        "stats": [
            _extract_mode_stats("Blitz", stats.get("chess_blitz")),
            _extract_mode_stats("Rapid", stats.get("chess_rapid")),
            _extract_mode_stats("Bullet", stats.get("chess_bullet")),
            _extract_mode_stats("Daily", stats.get("chess_daily")),
        ],
        "tactics": {
            "highest": (stats.get("tactics") or {}).get("highest", {}).get("rating"),
            "lowest": (stats.get("tactics") or {}).get("lowest", {}).get("rating"),
        }
        if stats.get("tactics")
        else None,
        "puzzleRush": {
            "best": (stats.get("puzzle_rush") or {}).get("best", {}).get("score"),
        }
        if stats.get("puzzle_rush")
        else None,
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
    }

    _cache[cache_key] = (now, payload)
    return payload


@app.get("/api/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/monkeytype/profile/{username}")
def monkeytype_profile(username: str) -> dict[str, Any]:
    return _build_monkeytype_profile(username)


@app.get("/api/chess/stats/{username}")
def chess_stats(username: str) -> dict[str, Any]:
    return _build_chess_stats(username)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
