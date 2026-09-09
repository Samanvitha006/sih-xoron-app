"""
Automated Verification Script for XORON FastAPI Server & Endpoints
"""
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_xoron_endpoints():
    print("--- Running XORON Automated Endpoint Tests ---")

    # 1. Root / UI
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.status_code}"
    print("[PASS] Root / index.html served successfully (HTTP 200)")

    # 2. Patient Profile
    r = client.get("/api/patient/pat-ner-001")
    assert r.status_code == 200, f"Patient profile failed: {r.status_code}"
    data = r.json()
    assert "Aita" in data["preferred_name"]
    print(f"[PASS] Patient Profile retrieved: {data['name']}")

    # 3. Living Memory Bank
    r = client.get("/api/memory-bank/pat-ner-001")
    assert r.status_code == 200
    members = r.json()
    assert len(members) >= 4
    print(f"[PASS] Living Memory Bank: {len(members)} family members loaded")

    # 4. Reminiscence Stories
    r = client.get("/api/stories/pat-ner-001")
    assert r.status_code == 200
    stories = r.json()
    assert len(stories) >= 3
    print(f"[PASS] Reminiscence Story Vault: {len(stories)} timeline milestones loaded")

    # 5. Reminders
    r = client.get("/api/reminders/pat-ner-001")
    assert r.status_code == 200
    reminders = r.json()
    assert len(reminders) >= 4
    print(f"[PASS] Routine & Med Reminders: {len(reminders)} active items loaded")

    # 6. Cognitive Sessions & Longitudinal Domain Stats
    r = client.get("/api/sessions/pat-ner-001")
    assert r.status_code == 200
    sess_data = r.json()
    assert "domain_stats" in sess_data
    assert len(sess_data["sessions"]) > 0
    print(f"[PASS] Cognitive Trajectory: {len(sess_data['sessions'])} sessions loaded")

    # 7. AI Memory Assistance Chatbot (English & Assamese queries)
    # Test English query
    r_chat_en = client.post("/api/chat/ask", json={"query": "who is my daughter", "lang": "en", "patient_id": "pat-ner-001"})
    assert r_chat_en.status_code == 200
    res_en = r_chat_en.json()
    assert "Dr. Priya Baruah" in res_en["reply_text"]
    print("[PASS] AI Chatbot (English Query): Recalled Dr. Priya Baruah with voice note")

    # Test Disorientation query (Validation therapy)
    r_chat_val = client.post("/api/chat/ask", json={"query": "where am i right now", "lang": "en", "patient_id": "pat-ner-001"})
    assert r_chat_val.status_code == 200
    res_val = r_chat_val.json()
    assert "Dispur, Guwahati" in res_val["reply_text"]
    print("[PASS] AI Chatbot (Disorientation & Reassurance): Safe home grounding in Dispur, Guwahati")

    # 8. ASHA Cohort
    r_asha = client.get("/api/asha/cohort")
    assert r_asha.status_code == 200
    cohort = r_asha.json()
    assert len(cohort) >= 2
    print(f"[PASS] ASHA Health Worker Cohort: {len(cohort)} rural patients monitored")

    # 9. WatermelonDB Digital Biomarkers & Telemetry
    r_tel = client.get("/api/telemetry/pat-ner-001")
    assert r_tel.status_code == 200
    tel_data = r_tel.json()
    assert "summary" in tel_data
    assert "mean_stroke_jitter" in tel_data["summary"]
    assert "mean_saccade_velocity" in tel_data["summary"]
    print(f"[PASS] WatermelonDB Telemetry: Mean Jitter={tel_data['summary']['mean_stroke_jitter']} mm/ms, Saccade={tel_data['summary']['mean_saccade_velocity']} deg/s")

    # 10. POST Telemetry Sample
    r_post_tel = client.post("/api/telemetry", json={
        "patient_id": "pat-ner-001",
        "game_id": "game-01",
        "accuracy_score": 0.95,
        "reaction_time_ms": 2200,
        "stroke_jitter": 0.155,
        "saccade_velocity": 295.0,
        "synced_to_cloud": True
    })
    assert r_post_tel.status_code == 200
    assert r_post_tel.json()["status"] == "success"
    print("[PASS] POST Telemetry recorded successfully")

    # 11. WatermelonDB QDRS Surveys
    r_qdrs = client.get("/api/qdrs/pat-ner-001")
    assert r_qdrs.status_code == 200
    qdrs_data = r_qdrs.json()
    assert "latest_score" in qdrs_data
    assert "clinical_staging" in qdrs_data
    print(f"[PASS] WatermelonDB QDRS Survey: Score={qdrs_data['latest_score']}, Stage={qdrs_data['clinical_staging']}")

    # 12. POST QDRS Survey
    r_post_qdrs = client.post("/api/qdrs", json={
        "patient_id": "pat-ner-001",
        "score": 3.0,
        "synced_to_cloud": True
    })
    assert r_post_qdrs.status_code == 200
    assert r_post_qdrs.json()["status"] == "success"
    print("[PASS] POST QDRS Survey recorded successfully")

    # 13. WatermelonDB Schedules
    r_sched = client.get("/api/schedules/pat-ner-001")
    assert r_sched.status_code == 200
    schedules = r_sched.json()
    assert len(schedules) >= 3
    print(f"[PASS] WatermelonDB Schedules: {len(schedules)} daily schedule tasks retrieved")

    print("\nALL TESTS PASSED! XORON is fully verified and functional.")

if __name__ == "__main__":
    test_xoron_endpoints()
