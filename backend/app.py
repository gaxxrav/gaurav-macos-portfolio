from __future__ import annotations

import os
import time
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from chessdotcom import Client, get_player_profile, get_player_stats


APP_NAME = "os-website-chess-api"
CACHE_TTL_SECONDS = 60

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

Client.request_config["headers"]["User-Agent"] = os.getenv(
    "CHESSCOM_USER_AGENT",
    "OS-WEBSITE Chess Stats Dashboard (contact: gaurav.murali3@gmail.com)",
)

_cache: dict[str, tuple[float, dict[str, Any]]] = {}


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
    now = time.time()
    cached = _cache.get(username)
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
        } if stats.get("tactics") else None,
        "puzzleRush": {
            "best": (stats.get("puzzle_rush") or {}).get("best", {}).get("score"),
        } if stats.get("puzzle_rush") else None,
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
    }

    _cache[username] = (now, payload)
    return payload


@app.get("/api/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/chess/stats/{username}")
def chess_stats(username: str) -> dict[str, Any]:
    return _build_chess_stats(username)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
