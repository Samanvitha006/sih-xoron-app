"""
XORON Strict Rate Limiter
Sliding-window token bucket implementation protecting all API endpoints against
excessive calls, Cartesia TTS quota exhaustion, and abuse.
"""
import time
import threading
from collections import defaultdict
from typing import Tuple, Dict, Any, List

class SlidingWindowRateLimiter:
    """
    Thread-safe sliding window rate limiter with tiered quotas:
      - TTS / Voice Synthesis: 10 req/min (Burst 3 / 10s)
      - Chatbot Memory Companion: 15 req/min (Burst 4 / 10s)
      - Mutating State (POST/PUT/DELETE): 30 req/min
      - General Read API: 60 req/min
    """
    def __init__(self):
        self._lock = threading.Lock()
        self._buckets = defaultdict(list)
        self._last_cleanup = time.time()

        self.rules = [
            {
                "id": "tts",
                "match": lambda path, method: path.startswith("/api/tts/cartesia/speak"),
                "window": 60,
                "limit": 10,
                "burst_window": 10,
                "burst_limit": 3,
                "description": "Cartesia Voice Synthesis"
            },
            {
                "id": "tts_config",
                "match": lambda path, method: path.startswith("/api/tts/"),
                "window": 60,
                "limit": 20,
                "burst_window": 10,
                "burst_limit": 5,
                "description": "TTS Configuration"
            },
            {
                "id": "chat",
                "match": lambda path, method: path.startswith("/api/chat/"),
                "window": 60,
                "limit": 15,
                "burst_window": 10,
                "burst_limit": 4,
                "description": "AI Memory Chatbot"
            },
            {
                "id": "dnf_predict",
                "match": lambda path, method: path == "/api/dnf/predict",
                "window": 60,
                "limit": 20,
                "burst_window": 10,
                "burst_limit": 5,
                "description": "Edge AI DNF Inference"
            },
            {
                "id": "mutating_api",
                "match": lambda path, method: method.upper() in ("POST", "PUT", "DELETE"),
                "window": 60,
                "limit": 30,
                "burst_window": 10,
                "burst_limit": 8,
                "description": "Data Logging & Updates"
            },
            {
                "id": "general_api",
                "match": lambda path, method: True,
                "window": 60,
                "limit": 60,
                "burst_window": 10,
                "burst_limit": 20,
                "description": "General REST Endpoints"
            }
        ]

    def _cleanup(self, now: float):
        if now - self._last_cleanup < 30:
            return
        self._last_cleanup = now
        stale_threshold = now - 120
        keys_to_delete = []
        for key, timestamps in self._buckets.items():
            self._buckets[key] = [t for t in timestamps if t > stale_threshold]
            if not self._buckets[key]:
                keys_to_delete.append(key)
        for key in keys_to_delete:
            del self._buckets[key]

    def get_matched_rule(self, path: str, method: str) -> Dict[str, Any]:
        for rule in self.rules:
            if rule["match"](path, method):
                return rule
        return self.rules[-1]

    def check(self, client_ip: str, path: str, method: str) -> Tuple[bool, int, int, int, str]:
        """
        Evaluates rate limit for client IP and route.
        Returns: (allowed: bool, retry_after: int, remaining: int, limit: int, description: str)
        """
        now = time.time()
        rule = self.get_matched_rule(path, method)
        bucket_key = f"{client_ip}:{rule['id']}"

        with self._lock:
            self._cleanup(now)
            timestamps = self._buckets[bucket_key]

            # 1. Burst Limit Check
            burst_window = rule.get("burst_window", 0)
            burst_limit = rule.get("burst_limit", 0)
            if burst_window > 0 and burst_limit > 0:
                recent_burst = [t for t in timestamps if t > now - burst_window]
                if len(recent_burst) >= burst_limit:
                    oldest_in_burst = recent_burst[0]
                    retry_after = max(1, int(burst_window - (now - oldest_in_burst)) + 1)
                    return False, retry_after, 0, burst_limit, f"{rule['description']} (Burst limit)"

            # 2. Sliding Window Limit Check
            window = rule["window"]
            limit = rule["limit"]
            window_timestamps = [t for t in timestamps if t > now - window]

            if len(window_timestamps) >= limit:
                oldest_in_window = window_timestamps[0]
                retry_after = max(1, int(window - (now - oldest_in_window)) + 1)
                return False, retry_after, 0, limit, rule["description"]

            # Allowed -> append timestamp
            window_timestamps.append(now)
            self._buckets[bucket_key] = window_timestamps
            remaining = max(0, limit - len(window_timestamps))
            return True, 0, remaining, limit, rule["description"]

    def get_client_status(self, client_ip: str) -> Dict[str, Any]:
        now = time.time()
        status = {}
        with self._lock:
            for rule in self.rules:
                bucket_key = f"{client_ip}:{rule['id']}"
                timestamps = [t for t in self._buckets.get(bucket_key, []) if t > now - rule["window"]]
                status[rule["id"]] = {
                    "description": rule["description"],
                    "used": len(timestamps),
                    "limit": rule["limit"],
                    "remaining": max(0, rule["limit"] - len(timestamps)),
                    "window_seconds": rule["window"]
                }
        return status

    def reset_for_ip(self, client_ip: str):
        with self._lock:
            keys_to_delete = [k for k in self._buckets if k.startswith(f"{client_ip}:")]
            for k in keys_to_delete:
                del self._buckets[k]

rate_limiter = SlidingWindowRateLimiter()
