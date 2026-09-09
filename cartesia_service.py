"""
XORON Cartesia Sonic TTS Service
Ultra-low-latency voice synthesis & familial voice cloning for elderly dementia patients.
"""
import os
import json
from typing import Optional, Dict

CONFIG_FILE = os.path.join(os.path.dirname(__file__), "cartesia_config.json")

# Default Voice IDs (customizable per family member)
DEFAULT_VOICE_IDS = {
    "priya": os.environ.get("CARTESIA_VOICE_PRIYA", "fb26447f-308b-471e-8b00-8e9f04284eb5"),  # Caring Indian female doctor
    "rohan": os.environ.get("CARTESIA_VOICE_ROHAN", "2ee87190-8f84-4925-97da-e52547f9462c"),  # Young energetic grandson
    "anjali": os.environ.get("CARTESIA_VOICE_ANJALI", "79a125e8-cd45-4c13-8a67-188112f4dd22"), # Gentle calm caregiver
    "biren": os.environ.get("CARTESIA_VOICE_BIREN", "a0e99841-438c-4a64-b679-ae501e7d6091"),   # Deep nostalgic grandfather
    "sathi": os.environ.get("CARTESIA_VOICE_SATHI", "79a125e8-cd45-4c13-8a67-188112f4dd22"),   # Soothing AI companion
}

class CartesiaService:
    def __init__(self):
        self.api_key = os.environ.get("CARTESIA_API_KEY", "")
        self.voice_ids = DEFAULT_VOICE_IDS.copy()
        self.load_config()
        self._client = None
        if self.api_key:
            self._init_client()

    def _init_client(self):
        try:
            from cartesia import Cartesia
            self._client = Cartesia(api_key=self.api_key)
            print("[Cartesia] Client initialized with active API key.")
        except Exception as e:
            print("[Cartesia] Failed to initialize Cartesia client:", e)
            self._client = None

    def load_config(self):
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if "api_key" in data and data["api_key"]:
                        self.api_key = data["api_key"]
                    if "voice_ids" in data and isinstance(data["voice_ids"], dict):
                        self.voice_ids.update(data["voice_ids"])
            except Exception as e:
                print("[Cartesia] Error reading config file:", e)

    def save_config(self):
        try:
            with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump({
                    "api_key": self.api_key,
                    "voice_ids": self.voice_ids
                }, f, indent=2)
        except Exception as e:
            print("[Cartesia] Error saving config file:", e)

    def update_config(self, api_key: Optional[str] = None, voice_ids: Optional[Dict[str, str]] = None):
        if api_key is not None:
            self.api_key = api_key.strip()
            self._init_client()
        if voice_ids and isinstance(voice_ids, dict):
            self.voice_ids.update(voice_ids)
        self.save_config()
        return self.get_status()

    def get_status(self):
        return {
            "is_configured": bool(self.api_key and len(self.api_key) > 5),
            "has_client": self._client is not None,
            "voice_ids": self.voice_ids,
            "supported_models": ["sonic-3.6", "sonic-multilingual"]
        }

    def generate_speech(
        self,
        transcript: str,
        voice_id: Optional[str] = None,
        member_id: Optional[str] = None,
        language: str = "en"
    ) -> Optional[bytes]:
        """
        Synthesizes audio using Cartesia Sonic-3.6 / Multilingual REST API.
        Returns WAV audio bytes if successful, or None if client/key is unconfigured.
        """
        if not self._client or not self.api_key:
            return None

        # Resolve voice ID
        resolved_voice_id = voice_id
        if not resolved_voice_id and member_id:
            resolved_voice_id = self.voice_ids.get(member_id.lower())
        if not resolved_voice_id:
            resolved_voice_id = self.voice_ids.get("sathi", "79a125e8-cd45-4c13-8a67-188112f4dd22")

        try:
            # Map language to Cartesia supported language codes
            lang_code = "en"
            if language.startswith("hi"):
                lang_code = "hi"
            elif language.startswith("bn") or language.startswith("as"):
                lang_code = "bn" # Regional Indic fallback

            # Call Cartesia SDK
            chunks = self._client.tts.bytes(
                model_id="sonic-3.6",
                transcript=transcript,
                voice={"mode": "id", "id": resolved_voice_id},
                output_format={
                    "container": "wav",
                    "encoding": "pcm_s16le",
                    "sample_rate": 44100
                },
                language=lang_code
            )
            return b"".join(chunks)
        except Exception as e:
            print(f"[Cartesia] TTS Generation error for voice {resolved_voice_id}:", e)
            return None

cartesia_service = CartesiaService()
