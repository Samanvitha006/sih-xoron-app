"""
XORON Database Layer - SQLite Offline-First Store
Mirrored with @nozbe/watermelondb Schema:
- patients (with baseline_moca)
- family_media (file_uri, relation_tag, voice_clone_uri)
- schedules (scheduled_time, task_type, is_completed)
- game_telemetry (accuracy_score, reaction_time_ms, stroke_jitter, saccade_velocity, synced_to_cloud)
- qdrs_surveys (date, score, synced_to_cloud)
"""

import sqlite3
import json
import os
import time
from datetime import datetime, timedelta
import random

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "xoron.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Patients Table (with WatermelonDB baseline_moca)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        preferred_name TEXT,
        age INTEGER,
        gender TEXT,
        baseline_moca REAL DEFAULT 21.0, -- Montreal Cognitive Assessment baseline
        hometown TEXT,
        current_residence TEXT,
        primary_language TEXT DEFAULT 'as',
        secondary_language TEXT DEFAULT 'en',
        dementia_stage TEXT DEFAULT 'Early Mild Cognitive Impairment',
        caregiver_name TEXT,
        caregiver_relation TEXT,
        caregiver_phone TEXT,
        asha_worker_name TEXT,
        asha_center TEXT,
        favorite_tea TEXT,
        favorite_festival TEXT,
        favorite_music TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Family Media (WatermelonDB Table: family_media)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS family_media (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        file_uri TEXT NOT NULL,
        relation_tag TEXT NOT NULL,
        voice_clone_uri TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    # 3. Schedules (WatermelonDB Table: schedules)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        task_type TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    # 4. Game Telemetry (WatermelonDB Table: game_telemetry)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS game_telemetry (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        game_id TEXT NOT NULL,
        accuracy_score REAL NOT NULL,
        reaction_time_ms INTEGER NOT NULL,
        stroke_jitter REAL NOT NULL, -- Motor tremor/micro-jitter biomarker
        saccade_velocity REAL NOT NULL, -- Oculomotor visual search speed
        synced_to_cloud INTEGER DEFAULT 1,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    # 5. QDRS Surveys (WatermelonDB Table: qdrs_surveys)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS qdrs_surveys (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        date INTEGER NOT NULL, -- Timestamp
        score REAL NOT NULL, -- Quick Dementia Rating System score (0-30)
        synced_to_cloud INTEGER DEFAULT 1,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    # Existing helper tables for UI richness & legacy storage
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS memory_bank (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        name TEXT NOT NULL,
        relationship TEXT NOT NULL,
        relationship_as TEXT,
        relationship_bn TEXT,
        relationship_brx TEXT,
        relationship_mni TEXT,
        relationship_ne TEXT,
        photo_svg_tag TEXT,
        photo_url TEXT,
        voice_note_text TEXT,
        location TEXT,
        visit_schedule TEXT,
        shared_memory TEXT,
        recall_interval_days INTEGER DEFAULT 1,
        consecutive_success INTEGER DEFAULT 0,
        last_tested TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reminiscence_stories (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        title TEXT NOT NULL,
        title_as TEXT,
        year_or_era TEXT,
        category TEXT,
        narrative TEXT,
        narrative_as TEXT,
        family_voice_prompt TEXT,
        photo_url TEXT,
        cultural_soundtrack TEXT,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        title TEXT NOT NULL,
        category TEXT,
        scheduled_time TEXT NOT NULL,
        dosage_or_detail TEXT,
        audio_prompt_en TEXT,
        audio_prompt_as TEXT,
        audio_prompt_bn TEXT,
        audio_prompt_brx TEXT,
        audio_prompt_mni TEXT,
        audio_prompt_ne TEXT,
        is_active INTEGER DEFAULT 1,
        last_acknowledged TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cognitive_sessions (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        game_id TEXT NOT NULL,
        game_title TEXT NOT NULL,
        domain TEXT NOT NULL,
        accuracy REAL NOT NULL,
        reaction_time_ms INTEGER NOT NULL,
        cues_needed INTEGER DEFAULT 0,
        difficulty_level INTEGER DEFAULT 1,
        mood_state TEXT DEFAULT 'Calm and Engaged',
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS adherence_logs (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        reminder_id TEXT,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        acknowledged_at TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (id),
        FOREIGN KEY (reminder_id) REFERENCES reminders (id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sync_outbox (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    # Seed or migrate default data
    cursor.execute("SELECT COUNT(*) FROM patients")
    if cursor.fetchone()[0] == 0:
        seed_sample_data(cursor)
        conn.commit()
    else:
        # Check if baseline_moca column exists in patients
        cursor.execute("PRAGMA table_info(patients)")
        columns = [c[1] for c in cursor.fetchall()]
        if 'baseline_moca' not in columns:
            cursor.execute("ALTER TABLE patients ADD COLUMN baseline_moca REAL DEFAULT 21.0")
            conn.commit()

        # Check if telemetry exists, else seed telemetry & surveys
        cursor.execute("SELECT COUNT(*) FROM game_telemetry")
        if cursor.fetchone()[0] == 0:
            seed_telemetry_and_surveys(cursor, "pat-ner-001")
            conn.commit()

        # Check if comprehensive 10 placeholder reminders are seeded
        cursor.execute("SELECT COUNT(*) FROM reminders")
        if cursor.fetchone()[0] < 8:
            seed_reminders(cursor, "pat-ner-001")
            conn.commit()

        # Ensure reminiscence and memory bank photo URLs use high-definition photographic assets
        cursor.execute("UPDATE reminiscence_stories SET photo_url = '/static/assets/photos/bihu_memory.jpg' WHERE id = 'story-001'")
        cursor.execute("UPDATE reminiscence_stories SET photo_url = '/static/assets/photos/tea_memory.jpg' WHERE id = 'story-002'")
        cursor.execute("UPDATE reminiscence_stories SET photo_url = '/static/assets/photos/graduation_memory.jpg' WHERE id = 'story-003'")
        cursor.execute("UPDATE memory_bank SET photo_url = '/static/assets/photos/daughter_priya.jpg' WHERE id = 'mem-001'")
        cursor.execute("UPDATE memory_bank SET photo_url = '/static/assets/photos/grandson_rohan.jpg' WHERE id = 'mem-002'")
        cursor.execute("UPDATE memory_bank SET photo_url = '/static/assets/photos/husband_biren.jpg' WHERE id = 'mem-003'")
        cursor.execute("UPDATE memory_bank SET photo_url = '/static/assets/photos/caregiver_anjali.jpg' WHERE id = 'mem-004'")
        cursor.execute("UPDATE family_media SET file_uri = '/static/assets/photos/tea_memory.jpg' WHERE id = 'fm-006'")
        cursor.execute("UPDATE family_media SET file_uri = '/static/assets/photos/daughter_priya.jpg' WHERE id = 'fm-001'")
        cursor.execute("UPDATE family_media SET file_uri = '/static/assets/photos/grandson_rohan.jpg' WHERE id = 'fm-002'")
        cursor.execute("UPDATE family_media SET file_uri = '/static/assets/photos/husband_biren.jpg' WHERE id = 'fm-003'")
        cursor.execute("UPDATE family_media SET file_uri = '/static/assets/photos/caregiver_anjali.jpg' WHERE id = 'fm-004'")
        conn.commit()

    conn.close()

def seed_sample_data(cursor):
    patient_id = "pat-ner-001"
    cursor.execute("""
    INSERT INTO patients (
        id, name, preferred_name, age, gender, baseline_moca,
        hometown, current_residence, primary_language, secondary_language,
        dementia_stage, caregiver_name, caregiver_relation, caregiver_phone,
        asha_worker_name, asha_center, favorite_tea, favorite_festival, favorite_music
    ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?
    )
    """, (
        patient_id, "Hemlata Baruah", "Aita (আইতা)", 78, "Female", 21.0,
        "Tezpur, Sonitpur", "Dispur, Guwahati", "as", "en",
        "Early Mild Cognitive Impairment", "Anjali Baruah", "Daughter-in-law", "+91 94350 12345",
        "Maini Saikia", "Dispur Urban Primary Health Centre", "Assam CTC with fresh ginger and lemongrass",
        "Rongali Bihu (ৰঙালী বিহু)", "Bhupen Hazarika evergreen melodies & Tokari Geet"
    ))

    # Second patient for ASHA view
    cursor.execute("""
    INSERT INTO patients (
        id, name, preferred_name, age, gender, baseline_moca,
        hometown, current_residence, primary_language, secondary_language,
        dementia_stage, caregiver_name, caregiver_relation, caregiver_phone,
        asha_worker_name, asha_center, favorite_tea, favorite_festival, favorite_music
    ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?
    )
    """, (
        "pat-ner-002", "Tenzing Tamang", "Kaka (काका)", 74, "Male", 17.5,
        "Kurseong / Digboi", "Digboi Old Town", "ne", "en",
        "Moderate Cognitive Impairment", "Pemba Tamang", "Son", "+91 98540 56789",
        "Sunita Basumatary", "Digboi Hospital Circle", "Butter & Cardamom spiced tea",
        "Maghe Sankranti", "Nepali Folk Flute"
    ))

    # Family Memory Bank
    family_members = [
        ("mem-001", patient_id, "Dr. Priya Baruah", "Daughter", "জীয়াৰী (Priya)", "মেয়ে (Priya)",
         "फिसायजो (Priya)", "মচানুপী (Priya)", "छोरी (Priya)", "daughter_doctor", "/static/assets/photos/daughter_priya.svg",
         "Aita, this is your daughter Priya. I am a doctor at GMCH Guwahati. Remember when we made sweet narikol laru together? I love you!",
         "Guwahati (GMCH Quarters)", "Visits every Sunday and calls daily at 7 PM", "Graduated from GMCH.", 3, 4, datetime.now().isoformat()),
        ("mem-002", patient_id, "Rohan Baruah", "Grandson", "নাতি ল'ৰা (Rohan)", "নাতি (Rohan)",
         "फिसौ (Rohan)", "ইবুংগো (Rohan)", "नाति (Rohan)", "grandson_rohan", "/static/assets/photos/grandson_rohan.svg",
         "Aita! I am Rohan. I study engineering in Jorhat. Every vacation I come home to eat your special duck curry with black sesame!",
         "Jorhat / Guwahati", "Comes home every weekend", "Veranda tea companion.", 2, 3, datetime.now().isoformat()),
        ("mem-003", patient_id, "Late Biren Baruah", "Husband (Late)", "স্বামী (স্বৰ্গীয় বীৰেন বৰুৱা)", "স্বামী (স্বর্গীয় বীরেন)",
         "हौवा (Late Biren)", "লুপোকপা (Late Biren)", "श्रीमान (Late Biren)", "husband_biren", "/static/assets/photos/husband_biren.svg",
         "Your loving husband Biren. You both built your beautiful wooden veranda house in Tezpur near the Brahmaputra banks in 1968.",
         "Tezpur / Dispur", "Cherished Memory", "School headmaster who played Tokari.", 7, 5, datetime.now().isoformat()),
        ("mem-004", patient_id, "Anjali Baruah", "Daughter-in-law & Caregiver", "বোৱাৰী (Anjali)", "বউমা (Anjali)",
         "बिहामजो (Anjali)", "ইমৌ (Anjali)", "बुहारी (Anjali)", "caregiver_anjali", "/static/assets/photos/caregiver_anjali.svg",
         "Aita, I am Anjali! I am here in the kitchen making your warm ginger tea. Whenever you need me, just call out my name.",
         "Dispur, Guwahati", "Present at home all day", "Soft Joha rice preparer.", 1, 6, datetime.now().isoformat())
    ]
    cursor.executemany("""
    INSERT INTO memory_bank (
        id, patient_id, name, relationship, relationship_as, relationship_bn,
        relationship_brx, relationship_mni, relationship_ne,
        photo_svg_tag, photo_url, voice_note_text, location, visit_schedule,
        shared_memory, recall_interval_days, consecutive_success, last_tested
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, family_members)

    # Seed Reminiscence Stories
    stories = [
        ("story-001", patient_id, "The Grand Rongali Bihu of 1974", "১৯৭৪ চনৰ ৰঙালী বিহু", "1974", "Festival",
         "You wore your grandmother's woven Muga silk Mekhela Sador with red Pari border. Everyone in the courtyard danced to the sweet Pepa and Dhol beats.",
         "আপুনি ৰঙা পাৰিৰ মুগাৰ মেখেলা চাদৰ পিন্ধিছিল। চোতালৰ বৰ আমজোপাৰ তলত সকলোৱে পেঁপা আৰু ঢোলৰ মাতত আনন্দ মনেৰে বিহু নাচিছিল।",
         "Aita, you taught me the first Bihu dance!", "/static/assets/photos/bihu_memory.svg", "Pepa and Dhol melody"),
        ("story-002", patient_id, "Planting the Tea Garden in Sonitpur", "তেজপুৰৰ চাহ বাগিচা আৰু সেউজীয়া স্মৃতি", "1968", "Village Life",
         "You and Biren planted fresh gardenia bushes and three rows of tender tea bushes behind your Tezpur cottage.",
         "তেজপুৰৰ ঘৰৰ পিছফালে আপুনি আৰু দেউতাই তগৰ ফুল আৰু চাহ গছপুলি ৰুইছিল। বৰষুণৰ পিছত মাটিৰ সুবাস মনত পৰে নে?",
         "Remember how sweet the evening tea tasted?", "/static/assets/photos/tea_memory.jpg", "Brahmaputra breeze and bamboo flute"),
        ("story-003", patient_id, "Dr. Priya's Graduation Day", "জীয়াৰী প্ৰিয়াৰ ডাক্তৰী ডিগ্ৰী লাভৰ দিন", "2002", "Children",
         "When Priya received her MBBS gold medal, you tied a hand-woven Gamusa around her neck with tears of joy.",
         "প্ৰিয়াই যেতিয়া গুৱাহাটী চিকিৎসা মহাবিদ্যালয়ৰ পৰা ডিগ্ৰী লৈছিল, আপুনি আনন্দৰ চকুপানীৰে ফুলাম গামোচা পিন্ধাই আশীৰ্বাদ দিছিল।",
         "Ma, my dream of serving people started because of you.", "/static/assets/photos/graduation_memory.svg", "Acoustic harp and gentle chimes")
    ]
    cursor.executemany("""
    INSERT INTO reminiscence_stories (
        id, patient_id, title, title_as, year_or_era, category,
        narrative, narrative_as, family_voice_prompt, photo_url, cultural_soundtrack
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, stories)

    # Seed 10 Comprehensive Clinical Placeholder Reminders
    seed_reminders(cursor, patient_id)

    # Seed WatermelonDB Tables: family_media & schedules & telemetry & surveys
    seed_telemetry_and_surveys(cursor, patient_id)

def seed_reminders(cursor, patient_id="pat-ner-001"):
    reminders = [
        ("rem-001", patient_id, "Morning Jolpan & Warm Milk", "nutrition", "07:30", "Soft flattened rice (Chira) with warm milk and jaggery",
         "Good morning Aita! It is 7:30 AM. Time for your soothing morning jolpan and warm milk.",
         "নমস্কাৰ আইতা! এতিয়া ৰাতিপুৱা ৭:৩০ বাজিছে। আপোনাৰ পুৱাৰ কোমল জলপান আৰু কুহুমীয়া গাখীৰ খোৱাৰ সময় হ'ল।",
         "সুপ্রভাত দিদিমা! সকাল ৭:৩০। আপনার নরম জলখাবার ও গরম দুধ খাওয়ার সময় হয়েছে।", "फुंनि ७:३० जाबाय।", "অয়ুক্কী ৭:৩০ তাবা মতম।", "शुभ प्रभात! बिहान ७:३० भयो। नास्ता र दूध लिनुहोस्।", 1),

        ("rem-002", patient_id, "Morning Blood Pressure Tablet (Amlodipine)", "medicine", "08:30", "1 tablet (5mg) with warm water after morning jolpan",
         "Good morning Aita! It is 8:30 AM. Time for your morning blood pressure tablet with warm water.",
         "নমস্কাৰ আইতা! এতিয়া ৰাতিপুৱা ৮:৩০ বাজিছে। আপোনাৰ প্ৰেচাৰৰ ঔষধটো এগিলাচ কুহুমীয়া পানীৰে খোৱাৰ সময় হ'ল।",
         "নমস্কার দিদিমা! সকাল ৮:৩০। প্রেসারের ওষুধটি উষ্ণ জল দিয়ে খাওয়ার সময় হয়েছে।", "फुंनि ८:३० जाबाय।", "হীদাক থকনবা মতম।", "८:३० भयो। मनतातो पानीसँग औषधि लिनुहोस्।", 1),

        ("rem-003", patient_id, "Hydration & Warm Assam Lemongrass Tea", "hydration", "10:30", "1 cup of fragrant lemongrass tea with holy basil",
         "Aita, it is 10:30 AM. Let's drink a warm cup of lemongrass tea together to stay fresh and hydrated.",
         "আইতা, এতিয়া ১০:৩০ বাজিছে। গাটো সতেজ ৰাখিবলৈ এগিলাচ কুহুমীয়া তুলসী-নেমুঘাঁহৰ চাহ খাই লওঁ আহক।",
         "দিদিমা, সকাল ১০:৩০। একটু গরম লেমনগ্রাস চা খেয়ে শরীর চনমনে করে নিন।", "दै लोंदो।", "ঈশিং থকোসি।", "एक कप मनतातो पानी पिउनुहोस्।", 1),

        ("rem-004", patient_id, "Nutritious Midday Lunch & Multivitamin", "medicine", "12:30", "Soft Joha rice with Masor Tenga & 1 Multivitamin tablet",
         "Aita, it is 12:30 PM. Caregiver Anjali has served warm Joha rice and light fish curry, followed by your multivitamin.",
         "আইতা, দুপৰীয়া ১২:৩০ বাজিছে। অঞ্জলিয়ে গৰম জহা চাউলৰ ভাত আৰু টেঙা মাছৰ আঞ্জা বাঢ়িছে, খোৱাৰ পিছত ভিটামিন টেবলেটটো ল'ব।",
         "দিদিমা, দুপুর ১২:৩০। গরম ভাত খেয়ে ভিটামিন ট্যাবলেটটি খেয়ে নিন।", "मुलि लोंदो।", "চাক চারগা হীদাক থকোসি।", "दिउँसोको खाना र भिटामिन औषधि लिनुहोस्।", 1),

        ("rem-005", patient_id, "Post-Lunch Rest & Soothing Flute Music", "routine", "14:30", "Relaxing 45-minute afternoon nap with gentle bamboo melodies",
         "Aita, the afternoon is peaceful. Let's rest comfortably while listening to gentle flute melodies.",
         "আইতা, এতিয়া দুপৰীয়া ২:৩০ বাজিছে। গাৰু লৈ বিছনাত অলপ জিৰণি লওক, বাঁহীৰ সুমধুৰ সুৰ বাজি আছে।",
         "দিদিমা, দুপুর ২:৩০। একটু বিছানায় বিশ্রাম নিন আর সুন্দর বাঁশির সুর শুনুন।", "जिरायनो सम।", "পোথাবা মতম।", "एकछिन ओछ्यानमा विश्राम लिनुहोस्।", 1),

        ("rem-006", patient_id, "Afternoon Veranda Walk & Kopou Orchid Viewing", "routine", "16:30", "Gentle 15-minute stroll in the veranda with caregiver Anjali",
         "Aita, the afternoon sun is gentle. Let's take our 15-minute walk in the veranda and look at the blooming orchids.",
         "আইতা, আবেলি ৪:৩০ বাজিছে। আহক বাৰাণ্ডাত এপাক খোজ কাঢ়ি কপৌ ফুলবোৰ চাওঁগৈ।",
         "দিদিমা, বিকেল ৪:৩০। চলুন বারান্দায় একটু হেঁটে তাজা বাতাস আর ফুলগুলো দেখে আসি।", "बाराण्डायाव थामसे।", "পখাত চৎসি।", "कौसीतिर एकछिन टहलिन जाउँ।", 1),

        ("rem-007", patient_id, "Family Phone Call with Daughter Dr. Priya", "routine", "17:30", "Daily video/voice check-in with Dr. Priya from GMCH",
         "Aita, it is 5:30 PM! Dr. Priya is calling from GMCH to ask about your day and share her warm love.",
         "আইতা, আবেলি ৫:৩০ বাজিছে! চিকিৎসালয়ৰ পৰা আপোনাৰ মৰমৰ জীয়াৰী প্ৰিয়াই ফোন কৰিছে, কথা পাতক আহক।",
         "দিদিমা, বিকেল ৫:৩০! আপনার মেয়ে প্রিয়া ফোন করেছে কথা বলার জন্য।", "अनजाथाव फिसानि कल।", "মচানুপীগী কোল।", "छोरी प्रियाको फोन आएको छ।", 1),

        ("rem-008", patient_id, "Evening Sandhya Diya & Devotional Borgeet", "routine", "19:00", "Lighting earthen lamp at the Tulsi altar and listening to Borgeet",
         "Aita, dusk has arrived at 7:00 PM. Anjali is lighting the holy evening diya while Borgeet plays softly.",
         "আইতা, গধূলি ৭:০০ বাজিছে। তুলসী তলত চাকি জ্বলোৱাৰ সময় হ'ল, বৰগীতৰ সুৰে ঘৰখন শান্ত কৰি তুলিছে।",
         "দিদিমা, সন্ধ্যা ৭:০০। তুলসীতলায় প্রদীপ জ্বালানোর সময় হয়েছে।", "हरनि बाथि।", "থা থাবা মতম।", "साँझको बत्ती बाल्ने समय भयो।", 1),

        ("rem-009", patient_id, "Dinner & Evening Calcium / Memory Care Tablet", "medicine", "20:30", "1 Calcium tablet & Donepezil after light warm dinner",
         "Good evening Aita. It is 8:30 PM. Time for your evening calcium and memory care tablet after warm dinner.",
         "শুভ সন্ধ্যা আইতা। ৰাতি ৮:৩০ বাজিছে। ভাত খাই কেলচিয়াম আৰু স্মৃতি যত্নৰ টেবলেটটো খাই লওক।",
         "দিদিমা, রাত ৮:৩০। রাতের খাবারের পর ক্যালসিয়াম ওষুধটি খেয়ে নিন।", "हरनि मुलि लोंदो।", "চাক চারগা হীদাক থকোসি।", "रातिको खानापछि औषधि लिनुहोस्।", 1),

        ("rem-010", patient_id, "Bedtime Warm Water & Reassurance with Anjali", "hydration", "21:30", "Warm glass of water and calming bedtime reassurance",
         "Aita, it is 9:30 PM. Drink a soothing sip of warm water. You are safe at home and Anjali is right here with you.",
         "আইতা, ৰাতি ৯:৩০ বাজিছে। এগিলাচ কুহুমীয়া পানী খাই লওক। আপুনি আপোনাৰ ঘৰত সম্পূৰ্ণ সুৰক্ষিত, অঞ্জলি আপোনাৰ কাষতেই আছে।",
         "দিদিমা, রাত ৯:৩০। একটু উষ্ণ জল খেয়ে শুয়ে পড়ুন। আপনি নিরাপদে আছেন, অঞ্জলি পাশেই আছে।", "उन्दुनायनि सम जाबाय।", "তুম্বা মতম ওইরে।", "राति मनतातो पानी पिएर आनन्दसँग सुत्नुहोस्।", 1)
    ]
    cursor.executemany("""
    INSERT OR REPLACE INTO reminders (
        id, patient_id, title, category, scheduled_time, dosage_or_detail,
        audio_prompt_en, audio_prompt_as, audio_prompt_bn, audio_prompt_brx,
        audio_prompt_mni, audio_prompt_ne, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, reminders)

def seed_telemetry_and_surveys(cursor, patient_id):
    # 1. Seed WatermelonDB family_media table
    media_items = [
        ("fm-001", patient_id, "/static/assets/photos/daughter_priya.svg", "Daughter (Dr. Priya)", "/static/assets/audio/daughter_voice.wav"),
        ("fm-002", patient_id, "/static/assets/photos/grandson_rohan.svg", "Grandson (Rohan)", "/static/assets/audio/rohan_voice.wav"),
        ("fm-003", patient_id, "/static/assets/photos/husband_biren.svg", "Husband (Late Biren)", None),
        ("fm-004", patient_id, "/static/assets/photos/caregiver_anjali.svg", "Caregiver (Anjali)", "/static/assets/audio/anjali_voice.wav"),
        ("fm-005", patient_id, "/static/assets/photos/bihu_memory.svg", "Rongali Bihu 1974", None),
        ("fm-006", patient_id, "/static/assets/photos/tea_memory.jpg", "Sonitpur Tea Garden", None)
    ]
    cursor.executemany("""
    INSERT OR REPLACE INTO family_media (id, patient_id, file_uri, relation_tag, voice_clone_uri)
    VALUES (?, ?, ?, ?, ?)
    """, media_items)

    # 2. Seed WatermelonDB schedules table
    schedules = [
        ("sch-001", patient_id, "07:30", "Morning Jolpan & Warm Milk", 1),
        ("sch-002", patient_id, "08:30", "Take Blood Pressure Tablet (Amlodipine)", 1),
        ("sch-003", patient_id, "10:30", "Hydration & Lemongrass Tea", 1),
        ("sch-004", patient_id, "12:30", "Nutritious Lunch & Multivitamin", 1),
        ("sch-005", patient_id, "14:30", "Post-Lunch Rest & Flute Melodies", 0),
        ("sch-006", patient_id, "16:30", "Veranda Stroll & Kopou Orchid Viewing", 0),
        ("sch-007", patient_id, "17:30", "Family Call with Dr. Priya", 0),
        ("sch-008", patient_id, "19:00", "Evening Sandhya Diya & Borgeet", 0),
        ("sch-009", patient_id, "20:30", "Evening Calcium & Night Medicine", 0),
        ("sch-010", patient_id, "21:30", "Bedtime Warm Water & Reassurance", 0)
    ]
    cursor.executemany("""
    INSERT OR REPLACE INTO schedules (id, patient_id, scheduled_time, task_type, is_completed)
    VALUES (?, ?, ?, ?, ?)
    """, schedules)

    # 3. Seed WatermelonDB game_telemetry (Stroke Jitter & Saccade Velocity)
    # stroke_jitter: 0.12 - 0.25 mm/ms (motor steadiness)
    # saccade_velocity: 240 - 320 deg/s (oculomotor visual tracking)
    base_time = datetime.now() - timedelta(days=14)
    telemetry_items = []
    games = ["game-01", "game-03", "game-04", "game-05", "game-06", "game-11"]
    tel_counter = 100

    for day in range(14):
        t_date = base_time + timedelta(days=day, hours=10)
        for g in random.sample(games, 2):
            tel_counter += 1
            acc = round(0.80 + (day * 0.012) + random.uniform(-0.03, 0.03), 2)
            rt = int(3200 - (day * 40) + random.randint(-100, 100))
            # Healthy steady jitter around 0.15 - 0.20
            jitter = round(0.22 - (day * 0.003) + random.uniform(-0.02, 0.02), 3)
            # Saccade velocity improves slightly with familiarization: 250 -> 290 deg/s
            saccade = round(250 + (day * 2.8) + random.uniform(-10, 10), 1)

            telemetry_items.append((
                f"tel-{tel_counter}", patient_id, g, acc, rt,
                jitter, saccade, 1, t_date.isoformat()
            ))

    cursor.executemany("""
    INSERT OR REPLACE INTO game_telemetry (
        id, patient_id, game_id, accuracy_score, reaction_time_ms,
        stroke_jitter, saccade_velocity, synced_to_cloud, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, telemetry_items)

    # 4. Seed WatermelonDB qdrs_surveys (Quick Dementia Rating System)
    # Baseline score 4.0 -> slightly improved/stabilized at 3.5 (Mild MCI stage)
    surveys = [
        ("qdrs-001", patient_id, int(time.time() - 14 * 86400), 4.0, 1),
        ("qdrs-002", patient_id, int(time.time() - 7 * 86400), 3.5, 1),
        ("qdrs-003", patient_id, int(time.time()), 3.5, 1)
    ]
    cursor.executemany("""
    INSERT OR REPLACE INTO qdrs_surveys (id, patient_id, date, score, synced_to_cloud)
    VALUES (?, ?, ?, ?, ?)
    """, surveys)

if __name__ == "__main__":
    init_db()
    print(f"XORON Database with WatermelonDB tables initialized at: {DB_PATH}")
