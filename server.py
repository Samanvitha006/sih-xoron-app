"""
XORON Backend Server - FastAPI Service
Problem Statement ID: SIH26003 (MedTech/HealthTech)
Team: Invincible Core
"""

import os
import json
import sqlite3
import base64
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from database import get_db_connection, init_db
from chatbot import assistant
from dnf_engine import calculate_dnf, evaluate_patient_dnf, normalize_features
from cartesia_service import cartesia_service
from rate_limiter import rate_limiter

app = FastAPI(
    title="XORON - Cognitive Care in the Language of Home",
    description="Smart India Hackathon 2026 (SIH26003) - AI Cognitive Gaming and Memory Platform for NER",
    version="1.0.0"
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Ensure static directories exist
os.makedirs(os.path.join(STATIC_DIR, "css"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "js"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "assets", "photos"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "assets", "photos", "uploads"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "assets", "audio"), exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

def get_client_ip(request: Request) -> str:
    cf_ip = request.headers.get("cf-connecting-ip")
    if cf_ip:
        return cf_ip.strip()
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "127.0.0.1"

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Strictly enforce rate limiting across all API endpoints
    if request.url.path.startswith("/api/"):
        client_ip = get_client_ip(request)
        allowed, retry_after, remaining, limit, desc = rate_limiter.check(
            client_ip=client_ip,
            path=request.url.path,
            method=request.method
        )
        if not allowed:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too Many Requests",
                    "detail": f"Strict rate limit exceeded for {desc}. Please retry in {retry_after}s.",
                    "retry_after": retry_after,
                    "limit": limit
                },
                headers={
                    "Retry-After": str(retry_after),
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(retry_after)
                }
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response

    return await call_next(request)

@app.middleware("http")
async def add_no_cache_header(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/static/js/") or request.url.path == "/" or request.url.path.endswith(".html"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

# Pydantic Request Models
class ChatQueryRequest(BaseModel):
    query: str
    lang: str = "en"
    patient_id: str = "pat-ner-001"

class SessionRecordRequest(BaseModel):
    patient_id: str = "pat-ner-001"
    game_id: str
    game_title: str
    domain: str
    accuracy: float
    reaction_time_ms: int
    cues_needed: int = 0
    difficulty_level: int = 1
    mood_state: str = "Calm"

class ReminderAckRequest(BaseModel):
    patient_id: str = "pat-ner-001"
    status: str = "taken"

class FamilyMemberCreateRequest(BaseModel):
    patient_id: str = "pat-ner-001"
    name: str
    relationship: str
    voice_note_text: str
    location: str
    visit_schedule: str
    shared_memory: str
    photo_svg_tag: Optional[str] = "custom_member"
    photo_url: Optional[str] = None
    photo_base64: Optional[str] = None

class ReminderCreateRequest(BaseModel):
    patient_id: str = "pat-ner-001"
    title: str
    category: str = "medicine"
    scheduled_time: str
    dosage_or_detail: str
    audio_prompt_en: Optional[str] = None
    audio_prompt_as: Optional[str] = None

class TelemetryRecordRequest(BaseModel):
    patient_id: str = "pat-ner-001"
    game_id: str
    accuracy_score: float
    reaction_time_ms: int
    stroke_jitter: float
    saccade_velocity: float
    synced_to_cloud: bool = True

class QdrsSurveyRequest(BaseModel):
    patient_id: str = "pat-ner-001"
    score: float
    synced_to_cloud: bool = True

class DnfPredictRequest(BaseModel):
    game_scores: List[float] # Executive, Visuospatial, Memory
    kinematics: List[float] # Pressure, stroke velocity, drag jitter, air-hesitation
    oculomotor: List[float] # Saccade velocity, blink frequency
    demographics: List[float] # Age, education modifier

class CartesiaSpeakRequest(BaseModel):
    transcript: str
    voice_id: Optional[str] = None
    member_id: Optional[str] = None
    language: str = "en"

class CartesiaConfigRequest(BaseModel):
    api_key: Optional[str] = None
    voice_ids: Optional[dict] = None

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/", response_class=HTMLResponse)
def get_root():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return "<h1>XORON App initializing...</h1>"

# 1. Patient Profile Endpoint
@app.get("/api/patient/{patient_id}")
def get_patient(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients WHERE id = ?", (patient_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Patient not found")
    return dict(row)

# 2. Living Memory Bank Endpoints
@app.get("/api/memory-bank/{patient_id}")
def get_memory_bank(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM memory_bank WHERE patient_id = ?", (patient_id,))
    members = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return members

@app.post("/api/memory-bank")
def create_memory_bank_member(req: FamilyMemberCreateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    mem_id = f"mem-{datetime.now().strftime('%m%d%H%M%S')}"
    
    photo_url = req.photo_url or "/static/assets/photos/custom_member.svg"

    # Process base64 photo upload if provided
    if req.photo_base64 and len(req.photo_base64) > 50:
        try:
            b64_data = req.photo_base64
            ext = "png"
            if "," in b64_data:
                header, b64_data = b64_data.split(",", 1)
                if "jpeg" in header or "jpg" in header:
                    ext = "jpg"
                elif "webp" in header:
                    ext = "webp"
            
            img_bytes = base64.b64decode(b64_data)
            upload_dir = os.path.join(STATIC_DIR, "assets", "photos", "uploads")
            os.makedirs(upload_dir, exist_ok=True)
            filename = f"upload_{mem_id}.{ext}"
            file_path = os.path.join(upload_dir, filename)
            with open(file_path, "wb") as f:
                f.write(img_bytes)
            photo_url = f"/static/assets/photos/uploads/{filename}"
        except Exception as e:
            print("[Upload] Error saving family member photo:", e)

    cursor.execute("""
    INSERT INTO memory_bank (
        id, patient_id, name, relationship, relationship_as, relationship_bn,
        photo_svg_tag, photo_url, voice_note_text, location, visit_schedule,
        shared_memory, recall_interval_days, consecutive_success, last_tested
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)
    """, (
        mem_id, req.patient_id, req.name, req.relationship, req.relationship, req.relationship,
        req.photo_svg_tag, photo_url, req.voice_note_text,
        req.location, req.visit_schedule, req.shared_memory, datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()
    return {
        "status": "success",
        "id": mem_id,
        "photo_url": photo_url,
        "message": "Family member added to Living Memory Bank"
    }

# 3. Reminiscence Stories Endpoints
@app.get("/api/stories/{patient_id}")
def get_stories(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reminiscence_stories WHERE patient_id = ?", (patient_id,))
    stories = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return stories

# 4. Reminders Endpoints
@app.get("/api/reminders/{patient_id}")
def get_reminders(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reminders WHERE patient_id = ? AND is_active = 1 ORDER BY scheduled_time ASC", (patient_id,))
    rems = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rems

@app.post("/api/reminders/{reminder_id}/ack")
def acknowledge_reminder(reminder_id: str, req: ReminderAckRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()
    cursor.execute("UPDATE reminders SET last_acknowledged = ? WHERE id = ?", (now_iso, reminder_id))
    
    # Log adherence
    adh_id = f"adh-{datetime.now().strftime('%m%d%H%M%S')}"
    today_str = datetime.now().strftime("%Y-%m-%d")
    cursor.execute("""
    INSERT INTO adherence_logs (id, patient_id, reminder_id, date, status, acknowledged_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (adh_id, req.patient_id, reminder_id, today_str, req.status, now_iso))
    
    conn.commit()
    conn.close()
    return {"status": "success", "reminder_id": reminder_id, "acknowledged_at": now_iso}

@app.post("/api/reminders")
def create_reminder(req: ReminderCreateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    rem_id = f"rem-{datetime.now().strftime('%m%d%H%M%S')}"
    prompt_en = req.audio_prompt_en or f"Time for your {req.title}."
    prompt_as = req.audio_prompt_as or f"আপোনাৰ {req.title} লোৱাৰ সময় হ'ল।"
    cursor.execute("""
    INSERT INTO reminders (
        id, patient_id, title, category, scheduled_time, dosage_or_detail,
        audio_prompt_en, audio_prompt_as, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    """, (
        rem_id, req.patient_id, req.title, req.category, req.scheduled_time,
        req.dosage_or_detail, prompt_en, prompt_as
    ))
    conn.commit()
    conn.close()
    return {"status": "success", "id": rem_id}

# 5. Cognitive Game Sessions & Analytics Endpoints
@app.get("/api/sessions/{patient_id}")
def get_cognitive_sessions(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM cognitive_sessions 
    WHERE patient_id = ? 
    ORDER BY timestamp ASC
    """, (patient_id,))
    sessions = [dict(r) for r in cursor.fetchall()]
    
    # Also calculate summary domain statistics for Caregiver Radar / Bar chart
    domains = ["Memory", "Attention", "Visuospatial", "Executive", "Verbal"]
    domain_stats = {}
    for d in domains:
        d_sess = [s for s in sessions if s["domain"] == d]
        if d_sess:
            avg_acc = round(sum(s["accuracy"] for s in d_sess) / len(d_sess) * 100, 1)
            avg_rt = round(sum(s["reaction_time_ms"] for s in d_sess) / len(d_sess))
        else:
            avg_acc = 85.0
            avg_rt = 2800
        domain_stats[d] = {"accuracy": avg_acc, "reaction_time_ms": avg_rt, "count": len(d_sess)}
        
    conn.close()
    return {
        "sessions": sessions,
        "domain_stats": domain_stats,
        "total_sessions": len(sessions)
    }

@app.post("/api/sessions")
def record_session(req: SessionRecordRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    sess_id = f"sess-{datetime.now().strftime('%m%d%H%M%S')}"
    cursor.execute("""
    INSERT INTO cognitive_sessions (
        id, patient_id, timestamp, game_id, game_title, domain,
        accuracy, reaction_time_ms, cues_needed, difficulty_level, mood_state
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        sess_id, req.patient_id, datetime.now().isoformat(), req.game_id,
        req.game_title, req.domain, req.accuracy, req.reaction_time_ms,
        req.cues_needed, req.difficulty_level, req.mood_state
    ))
    conn.commit()
    conn.close()
    return {"status": "success", "session_id": sess_id}

# 6. AI Memory Assistance Chatbot Endpoint
@app.post("/api/chat/ask")
def chat_with_memory_assistant(req: ChatQueryRequest):
    response = assistant.process_query(req.query, req.lang, req.patient_id)
    return response

# 7. ASHA / Community Health Worker Cohort View (Slide 5)
@app.get("/api/asha/cohort")
def get_asha_cohort():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients")
    patients = [dict(r) for r in cursor.fetchall()]
    
    cohort_list = []
    for p in patients:
        cursor.execute("""
        SELECT AVG(accuracy) as avg_acc, AVG(reaction_time_ms) as avg_rt, COUNT(*) as cnt 
        FROM cognitive_sessions WHERE patient_id = ?
        """, (p["id"],))
        stats = cursor.fetchone()
        
        cursor.execute("""
        SELECT COUNT(*) FROM adherence_logs WHERE patient_id = ? AND status = 'taken'
        """, (p["id"],))
        taken = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM adherence_logs WHERE patient_id = ?", (p["id"],))
        total_logs = cursor.fetchone()[0]
        adherence_pct = round((taken / total_logs * 100) if total_logs > 0 else 94.0)

        # Early detection alert rule (Slide 2 & 4: Alert on sustained drop)
        has_alert = False
        alert_reason = ""
        avg_acc = stats["avg_acc"] or 0.85
        if avg_acc < 0.72:
            has_alert = True
            alert_reason = "Sustained accuracy drop in Memory domain"
        elif adherence_pct < 80:
            has_alert = True
            alert_reason = "Missed evening blood pressure medication"

        cohort_list.append({
            "patient": p,
            "avg_accuracy_pct": round(avg_acc * 100, 1),
            "avg_reaction_time_ms": round(stats["avg_rt"] or 2900),
            "adherence_pct": adherence_pct,
            "has_alert": has_alert,
            "alert_reason": alert_reason
        })
    conn.close()
    return cohort_list

# 8. Opportunistic Sync Queue for Offline Sync (Slide 3)
@app.post("/api/sync/outbox")
def sync_offline_outbox(items: List[dict]):
    conn = get_db_connection()
    cursor = conn.cursor()
    synced_count = 0
    for item in items:
        # process offline queued action
        cursor.execute("""
        INSERT INTO sync_outbox (id, entity_type, payload_json, status)
        VALUES (?, ?, ?, 'synced')
        """, (f"sync-{datetime.now().strftime('%m%d%H%M%S')}-{synced_count}", item.get("type", "generic"), json.dumps(item)))
        synced_count += 1
    conn.commit()
    conn.close()
    return {"status": "success", "synced_items": synced_count}

# 9. WatermelonDB Telemetry & Digital Biomarkers Endpoints
@app.get("/api/telemetry/{patient_id}")
def get_telemetry(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM game_telemetry 
    WHERE patient_id = ? 
    ORDER BY timestamp DESC LIMIT 20
    """, (patient_id,))
    rows = [dict(r) for r in cursor.fetchall()]

    avg_jitter = round(sum(r["stroke_jitter"] for r in rows) / len(rows), 3) if rows else 0.18
    avg_saccade = round(sum(r["saccade_velocity"] for r in rows) / len(rows), 1) if rows else 280.0

    conn.close()
    return {
        "telemetry": rows,
        "summary": {
            "mean_stroke_jitter": avg_jitter,
            "mean_saccade_velocity": avg_saccade,
            "motor_stability": "Normal Steady" if avg_jitter < 0.25 else "Tremor Noted",
            "oculomotor_status": "Intact Visual Tracking" if avg_saccade > 220 else "Slow Saccades"
        }
    }

@app.post("/api/telemetry")
def record_telemetry(req: TelemetryRecordRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    tel_id = f"tel-{datetime.now().strftime('%m%d%H%M%S')}"
    cursor.execute("""
    INSERT INTO game_telemetry (
        id, patient_id, game_id, accuracy_score, reaction_time_ms,
        stroke_jitter, saccade_velocity, synced_to_cloud, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        tel_id, req.patient_id, req.game_id, req.accuracy_score,
        req.reaction_time_ms, req.stroke_jitter, req.saccade_velocity,
        1 if req.synced_to_cloud else 0, datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()
    return {"status": "success", "telemetry_id": tel_id}

# 10. WatermelonDB QDRS Surveys Endpoints (Quick Dementia Rating System)
@app.get("/api/qdrs/{patient_id}")
def get_qdrs_surveys(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM qdrs_surveys 
    WHERE patient_id = ? 
    ORDER BY date DESC
    """, (patient_id,))
    rows = [dict(r) for r in cursor.fetchall()]
    latest_score = rows[0]["score"] if rows else 3.5
    staging = "Normal Cognition" if latest_score < 2 else ("Mild Cognitive Impairment (MCI)" if latest_score <= 5 else "Dementia")
    conn.close()
    return {
        "surveys": rows,
        "latest_score": latest_score,
        "clinical_staging": staging
    }

@app.post("/api/qdrs")
def record_qdrs_survey(req: QdrsSurveyRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    import time
    surv_id = f"qdrs-{datetime.now().strftime('%m%d%H%M%S')}"
    cursor.execute("""
    INSERT INTO qdrs_surveys (id, patient_id, date, score, synced_to_cloud)
    VALUES (?, ?, ?, ?, ?)
    """, (surv_id, req.patient_id, int(time.time()), req.score, 1 if req.synced_to_cloud else 0))
    conn.commit()
    conn.close()
    return {"status": "success", "survey_id": surv_id, "score": req.score}

# 11. WatermelonDB Schedules Endpoint
@app.get("/api/schedules/{patient_id}")
def get_schedules(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schedules WHERE patient_id = ? ORDER BY scheduled_time ASC", (patient_id,))
    schedules = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return schedules

# 12. SuStIn Disease Progression & Neurodegeneration Forecasting (DNF) Endpoints
@app.get("/api/dnf/{patient_id}")
def get_patient_dnf(patient_id: str):
    try:
        return evaluate_patient_dnf(patient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/dnf/predict")
def predict_dnf(req: DnfPredictRequest):
    try:
        norm_game, norm_kin, norm_oculo, norm_demo = normalize_features(
            req.game_scores, req.kinematics, req.oculomotor, req.demographics
        )
        probs = calculate_dnf(norm_game, norm_kin, norm_oculo, norm_demo)
        p_a, p_b, p_c = float(probs[0]), float(probs[1]), float(probs[2])
        stages = [
            "Stage A (Normal / Pre-symptomatic)",
            "Stage B (Mild Cognitive Impairment - MCI)",
            "Stage C (Dementia Progression)"
        ]
        import numpy as np
        best_idx = int(np.argmax(probs))
        return {
            "status": "success",
            "probabilities": {
                "stage_a": round(p_a, 4),
                "stage_b_mci": round(p_b, 4),
                "stage_c_dementia": round(p_c, 4)
            },
            "probabilities_pct": {
                "stage_a": round(p_a * 100, 1),
                "stage_b_mci": round(p_b * 100, 1),
                "stage_c_dementia": round(p_c * 100, 1)
            },
            "classified_stage": stages[best_idx],
            "confidence_score": round(float(probs[best_idx]), 4),
            "confidence_pct": round(float(probs[best_idx]) * 100, 1),
            "edge_model": "sustin_dnf_model.tflite (Quantized On-Device)"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 13. Cartesia Sonic Voice Synthesis & Family Voice Cloning Endpoints
@app.get("/api/tts/cartesia/config")
def get_cartesia_config():
    return cartesia_service.get_status()

@app.post("/api/tts/cartesia/config")
def update_cartesia_config(req: CartesiaConfigRequest):
    status = cartesia_service.update_config(api_key=req.api_key, voice_ids=req.voice_ids)
    return {"status": "success", "config": status}

@app.post("/api/tts/cartesia/speak")
def generate_cartesia_tts(req: CartesiaSpeakRequest):
    audio_bytes = cartesia_service.generate_speech(
        transcript=req.transcript,
        voice_id=req.voice_id,
        member_id=req.member_id,
        language=req.language
    )
    if not audio_bytes:
        raise HTTPException(
            status_code=400,
            detail="Cartesia audio synthesis unavailable. API key may not be set or voice ID invalid."
        )
    return Response(content=audio_bytes, media_type="audio/wav")

# 14. Rate Limiter Status Endpoint
@app.get("/api/ratelimit/status")
def get_rate_limit_status(request: Request):
    client_ip = get_client_ip(request)
    return {
        "client_ip": client_ip,
        "status": rate_limiter.get_client_status(client_ip)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
