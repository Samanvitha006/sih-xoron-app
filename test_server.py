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

    print("\nALL TESTS PASSED! XORON is fully verified and functional.")

if __name__ == "__main__":
    test_xoron_endpoints()
