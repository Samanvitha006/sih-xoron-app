"""
Automated Verification Script for XORON FastAPI Server & Endpoints
"""
from fastapi.testclient import TestClient
import numpy as np
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

    # 14. Edge AI SuStIn DNF Direct Inference (calculate_dnf)
    from dnf_engine import calculate_dnf, normalize_features
    test_g = [0.76, 0.80, 0.65]
    test_k = [0.62, 120.0, 0.20, 150.0]
    test_o = [270.0, 16.0]
    test_d = [78.0, 12.0]
    norm_g, norm_k, norm_o, norm_d = normalize_features(test_g, test_k, test_o, test_d)
    probs = calculate_dnf(norm_g, norm_k, norm_o, norm_d)
    assert len(probs) == 3
    assert abs(sum(probs) - 1.0) < 0.01
    print(f"[PASS] Edge AI calculate_dnf: Probabilities={list(np.round(probs, 3))}, Sum={round(float(sum(probs)), 2)}")

    # 15. GET /api/dnf/pat-ner-001
    r_dnf = client.get("/api/dnf/pat-ner-001")
    assert r_dnf.status_code == 200
    dnf_data = r_dnf.json()
    assert "classified_stage" in dnf_data
    assert "probabilities" in dnf_data
    assert "multimodal_inputs" in dnf_data
    assert "Stage B" in dnf_data["classified_stage"]
    print(f"[PASS] GET /api/dnf/pat-ner-001: Stage={dnf_data['classified_stage']} (Confidence: {dnf_data['confidence_pct']}%)")

    # 16. POST /api/dnf/predict
    r_dnf_pred = client.post("/api/dnf/predict", json={
        "game_scores": [0.92, 0.95, 0.90],
        "kinematics": [0.75, 150.0, 0.14, 90.0],
        "oculomotor": [320.0, 15.0],
        "demographics": [65.0, 16.0]
    })
    assert r_dnf_pred.status_code == 200
    pred_data = r_dnf_pred.json()
    assert pred_data["status"] == "success"
    assert "Stage A" in pred_data["classified_stage"]
    print(f"[PASS] POST /api/dnf/predict: Healthy Stage={pred_data['classified_stage']} (Confidence: {pred_data['confidence_pct']}%)")

    # 17. Cartesia Sonic Voice Synthesis & Config Endpoints
    r_cart_cfg = client.get("/api/tts/cartesia/config")
    assert r_cart_cfg.status_code == 200
    cart_cfg_data = r_cart_cfg.json()
    assert "voice_ids" in cart_cfg_data
    assert "priya" in cart_cfg_data["voice_ids"]
    assert "rohan" in cart_cfg_data["voice_ids"]
    print(f"[PASS] GET /api/tts/cartesia/config: Config retrieved (Configured={cart_cfg_data['is_configured']}, Voices={len(cart_cfg_data['voice_ids'])})")

    # Update Cartesia voice mapping
    r_cart_update = client.post("/api/tts/cartesia/config", json={
        "voice_ids": {"priya": "fb26447f-308b-471e-8b00-8e9f04284eb5"}
    })
    assert r_cart_update.status_code == 200
    assert r_cart_update.json()["status"] == "success"
    print("[PASS] POST /api/tts/cartesia/config: Voice configuration updated successfully")

    # Speak endpoint (without key returns 400 graceful fallback flag)
    r_cart_speak = client.post("/api/tts/cartesia/speak", json={
        "transcript": "Hello Aita, I love you",
        "member_id": "priya"
    })
    # If unconfigured, expect 400 fallback
    assert r_cart_speak.status_code in [200, 400]
    print(f"[PASS] POST /api/tts/cartesia/speak: Handled with status {r_cart_speak.status_code} (Graceful fallback active)")

    # 18. Strict Rate Limiting Verification
    # Check rate limit headers present
    assert "x-ratelimit-limit" in r_cart_speak.headers
    assert "x-ratelimit-remaining" in r_cart_speak.headers

    # Rate limit status endpoint
    r_rl_status = client.get("/api/ratelimit/status")
    assert r_rl_status.status_code == 200
    rl_data = r_rl_status.json()
    assert "status" in rl_data
    assert "tts" in rl_data["status"]
    print(f"[PASS] GET /api/ratelimit/status: Rate limit status retrieved for {rl_data['client_ip']}")

    # Verify 429 Too Many Requests enforcement under burst
    test_burst_ip = "192.168.99.99"
    got_429 = False
    for _ in range(6):
        r_burst = client.post(
            "/api/tts/cartesia/speak",
            json={"transcript": "Test", "member_id": "priya"},
            headers={"x-forwarded-for": test_burst_ip}
        )
        if r_burst.status_code == 429:
            got_429 = True
            assert "retry-after" in r_burst.headers
            assert "Strict rate limit exceeded" in r_burst.json()["detail"]
            print(f"[PASS] Rate Limiter Enforcement: HTTP 429 returned as expected (Retry-After: {r_burst.headers['retry-after']}s)")
            break
    assert got_429, "Rate limiter failed to trigger 429 under burst!"

    print("\nALL TESTS PASSED! XORON is fully verified and functional.")

if __name__ == "__main__":
    test_xoron_endpoints()

