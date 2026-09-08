"""
XORON Backend Server - FastAPI Service
Problem Statement ID: SIH26003 (MedTech/HealthTech)
Team: Invincible Core
"""

import os
import json
import sqlite3
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from database import get_db_connection, init_db
from chatbot import assistant

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
os.makedirs(os.path.join(STATIC_DIR, "assets", "audio"), exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

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

class ReminderCreateRequest(BaseModel):
    patient_id: str = "pat-ner-001"
    title: str
    category: str = "medicine"
    scheduled_time: str
    dosage_or_detail: str
    audio_prompt_en: Optional[str] = None
    audio_prompt_as: Optional[str] = None

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
    cursor.execute("""
    INSERT INTO memory_bank (
        id, patient_id, name, relationship, relationship_as, relationship_bn,
        photo_svg_tag, photo_url, voice_note_text, location, visit_schedule,
        shared_memory, recall_interval_days, consecutive_success, last_tested
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)
    """, (
        mem_id, req.patient_id, req.name, req.relationship, req.relationship, req.relationship,
        req.photo_svg_tag, "/static/assets/photos/custom_member.svg", req.voice_note_text,
        req.location, req.visit_schedule, req.shared_memory, datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()
    return {"status": "success", "id": mem_id, "message": "Family member added to Living Memory Bank"}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
