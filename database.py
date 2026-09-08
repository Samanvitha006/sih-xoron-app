"""
XORON Database Layer - SQLite Offline-First Store
Problem Statement: SIH26003 (MedTech/HealthTech)
Team: Invincible Core
"""

import sqlite3
import json
import os
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

    # Patients Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        preferred_name TEXT,
        age INTEGER,
        gender TEXT,
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

    # Family Memory Bank (Reminiscence Therapy & Face Recognition)
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

    # Reminiscence Story Timelines ("Our Story")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reminiscence_stories (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        title TEXT NOT NULL,
        title_as TEXT,
        year_or_era TEXT,
        category TEXT, -- Wedding, Festival, Tea Garden, Village Life, Children
        narrative TEXT,
        narrative_as TEXT,
        family_voice_prompt TEXT,
        photo_url TEXT,
        cultural_soundtrack TEXT,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    # Reminders & Daily Routine
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        title TEXT NOT NULL,
        category TEXT, -- medicine, hydration, routine, appointment
        scheduled_time TEXT NOT NULL, -- HH:MM
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

    # Cognitive Sessions & Longitudinal Tracking
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cognitive_sessions (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        game_id TEXT NOT NULL,
        game_title TEXT NOT NULL,
        domain TEXT NOT NULL, -- Memory, Attention, Visuospatial, Executive, Verbal
        accuracy REAL NOT NULL,
        reaction_time_ms INTEGER NOT NULL,
        cues_needed INTEGER DEFAULT 0,
        difficulty_level INTEGER DEFAULT 1,
        mood_state TEXT DEFAULT 'Calm and Engaged',
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    # Adherence Logs (Medication & Routine)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS adherence_logs (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        reminder_id TEXT,
        date TEXT NOT NULL,
        status TEXT NOT NULL, -- taken, delayed, missed
        acknowledged_at TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (id),
        FOREIGN KEY (reminder_id) REFERENCES reminders (id)
    )
    """)

    # Outbox Queue for Opportunistic Sync
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

    # Check if patient exists, else seed default realistic data for SIH NER context
    cursor.execute("SELECT COUNT(*) FROM patients")
    if cursor.fetchone()[0] == 0:
        seed_sample_data(cursor)
        conn.commit()

    conn.close()

def seed_sample_data(cursor):
    # Primary sample patient: Hemlata Baruah ("Aita"), 78, Dispur, Assam
    patient_id = "pat-ner-001"
    cursor.execute("""
    INSERT INTO patients (
        id, name, preferred_name, age, gender, hometown, current_residence,
        primary_language, secondary_language, dementia_stage,
        caregiver_name, caregiver_relation, caregiver_phone,
        asha_worker_name, asha_center, favorite_tea, favorite_festival, favorite_music
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?
    )
    """, (
        patient_id, "Hemlata Baruah", "Aita (আইতা)", 78, "Female", "Tezpur, Sonitpur", "Dispur, Guwahati",
        "as", "en", "Mild Cognitive Impairment",
        "Anjali Baruah", "Daughter-in-law", "+91 94350 12345",
        "Maini Saikia", "Dispur Urban Primary Health Centre", "Assam CTC with fresh ginger and lemongrass",
        "Rongali Bihu (ৰঙালী বিহু)", "Bhupen Hazarika evergreen melodies & Tokari Geet"
    ))

    # Second patient for ASHA cohort demonstration: Tenzing Tamang, 74, Digboi
    cursor.execute("""
    INSERT INTO patients (
        id, name, preferred_name, age, gender, hometown, current_residence,
        primary_language, secondary_language, dementia_stage,
        caregiver_name, caregiver_relation, caregiver_phone,
        asha_worker_name, asha_center, favorite_tea, favorite_festival, favorite_music
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?
    )
    """, (
        "pat-ner-002", "Tenzing Tamang", "Kaka (काका)", 74, "Male", "Kurseong / Digboi", "Digboi Old Town",
        "ne", "en", "Moderate Cognitive Impairment",
        "Pemba Tamang", "Son", "+91 98540 56789",
        "Sunita Basumatary", "Digboi Sub-Divisional Hospital Circle", "Butter & Cardamom spiced tea",
        "Maghe Sankranti & Losar", "Nepali Folk Flute & Maruni Songs"
    ))

    # Living Memory Bank: Family Members for Aita Hemlata
    family_members = [
        (
            "mem-001", patient_id, "Dr. Priya Baruah", "Daughter", "জীয়াৰী (Priya)", "মেয়ে (Priya)",
            "फिसायजो (Priya)", "মচানুপী (Priya)", "छोरी (Priya)",
            "daughter_doctor", "/static/assets/photos/daughter_priya.svg",
            "Aita, this is your daughter Priya. I am a doctor at GMCH Guwahati. Remember when we made sweet narikol laru together? I love you!",
            "Guwahati (GMCH Quarters)", "Visits every Sunday and calls daily at 7 PM",
            "She graduated from Gauhati Medical College. Aita stitched her first white apron.",
            3, 4, datetime.now().isoformat()
        ),
        (
            "mem-002", patient_id, "Rohan Baruah", "Grandson", "নাতি ল'ৰা (Rohan)", "নাতি (Rohan)",
            "फिसौ (Rohan)", "ইবুংগো (Rohan)", "नाति (Rohan)",
            "grandson_rohan", "/static/assets/photos/grandson_rohan.svg",
            "Aita! I am Rohan. I study engineering in Jorhat. Every vacation I come home to eat your special duck curry with black sesame!",
            "Jorhat / Guwahati", "Lives in home hostel, comes home every weekend",
            "Always sits beside Aita in the veranda in the afternoon drinking tea and asking for old tales.",
            2, 3, datetime.now().isoformat()
        ),
        (
            "mem-003", patient_id, "Late Biren Baruah", "Husband (Late)", "স্বামী (স্বৰ্গীয় বীৰেন বৰুৱা)", "স্বামী (স্বর্গীয় বীরেন)",
            "हौवा (Late Biren)", "লুপোকপা (Late Biren)", "श्रीमान (Late Biren)",
            "husband_biren", "/static/assets/photos/husband_biren.svg",
            "Your loving husband Biren. You both built your beautiful wooden veranda house in Tezpur near the Brahmaputra banks in 1968.",
            "Tezpur / Guwahati", "Cherished Memory",
            "He was a school headmaster who played the Tokari string instrument and brought sweet jolpan every Sunday morning.",
            7, 5, datetime.now().isoformat()
        ),
        (
            "mem-004", patient_id, "Anjali Baruah", "Daughter-in-law & Caregiver", "বোৱাৰী (Anjali)", "বউমা (Anjali)",
            "बिहामजो (Anjali)", "ইমৌ (Anjali)", "बुहारी (Anjali)",
            "caregiver_anjali", "/static/assets/photos/caregiver_anjali.svg",
            "Aita, I am Anjali! I am here in the kitchen making your warm ginger tea. Whenever you need me, just call out my name.",
            "Dispur, Guwahati (Lives with Aita)", "Present at home all day",
            "Prepares Aita's favorite soft Joha rice with mashed potatoes and lemon.",
            1, 6, datetime.now().isoformat()
        )
    ]

    cursor.executemany("""
    INSERT INTO memory_bank (
        id, patient_id, name, relationship, relationship_as, relationship_bn,
        relationship_brx, relationship_mni, relationship_ne,
        photo_svg_tag, photo_url, voice_note_text, location, visit_schedule,
        shared_memory, recall_interval_days, consecutive_success, last_tested
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, family_members)

    # Reminiscence Stories ("Our Story" - Aamar Kahini)
    stories = [
        (
            "story-001", patient_id, "The Grand Rongali Bihu of 1974", "১৯৭৪ চনৰ ৰঙালী বিহু",
            "1974", "Festival",
            "You wore your grandmother's woven Muga silk Mekhela Sador with red Pari border. Everyone in the courtyard danced to the sweet Pepa and Dhol beats under the big mango tree.",
            "আপুনি ৰঙা পাৰিৰ মুগাৰ মেখেলা চাদৰ পিন্ধিছিল। চোতালৰ বৰ আমজোপাৰ তলত সকলোৱে পেঁপা আৰু ঢোলৰ মাতত আনন্দ মনেৰে বিহু নাচিছিল।",
            "Aita, you taught me the first Bihu dance hand turns right here on this porch!",
            "/static/assets/photos/bihu_memory.svg",
            "Pepa and Dhol melody"
        ),
        (
            "story-002", patient_id, "Planting the Tea Garden in Sonitpur", "তেজপুৰৰ চাহ বাগিচা আৰু সেউজীয়া স্মৃতি",
            "1968", "Village Life",
            "You and Biren planted fresh gardenia bushes and three rows of tender tea bushes behind your Tezpur cottage. The smell of afternoon rain on dry Assam soil was unforgettable.",
            "তেজপুৰৰ ঘৰৰ পিছফালে আপুনি আৰু দেউতাই তগৰ ফুল আৰু চাহ গছপুলি ৰুইছিল। বৰষুণৰ পিছত মাটিৰ সুবাস মনত পৰে নে?",
            "Remember how sweet the evening tea tasted after working in the garden?",
            "/static/assets/photos/tea_memory.svg",
            "Brahmaputra breeze and bamboo flute"
        ),
        (
            "story-003", patient_id, "Dr. Priya's Graduation Day", "জীয়াৰী প্ৰিয়াৰ ডাক্তৰী ডিগ্ৰী লাভৰ দিন",
            "2002", "Children",
            "When Priya received her MBBS gold medal, you tied a hand-woven Gamusa around her neck with tears of joy. She dedicated her stethoscope to you.",
            "প্ৰিয়াই যেতিয়া গুৱাহাটী চিকিৎসা মহাবিদ্যালয়ৰ পৰা ডিগ্ৰী লৈছিল, আপুনি আনন্দৰ চকুপানীৰে ফুলাম গামোচা পিন্ধাই আশীৰ্বাদ দিছিল।",
            "Ma, my dream of serving people started because of your loving care.",
            "/static/assets/photos/graduation_memory.svg",
            "Acoustic harp and gentle chimes"
        )
    ]

    cursor.executemany("""
    INSERT INTO reminiscence_stories (
        id, patient_id, title, title_as, year_or_era, category,
        narrative, narrative_as, family_voice_prompt, photo_url, cultural_soundtrack
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, stories)

    # Reminders & Daily Routine
    reminders = [
        (
            "rem-001", patient_id, "Morning Blood Pressure Tablet (Amlodipine)", "medicine", "08:30",
            "1 tablet (5mg) with warm water after morning jolpan",
            "Good morning Aita! It is 8:30 AM. Time for your morning blood pressure tablet with warm water. Anjali has kept it ready on your table.",
            "নমস্কাৰ আইতা! এতিয়া ৰাতিপুৱা ৮:৩০ বাজিছে। আপোনাৰ প্ৰেচাৰৰ ঔষধটো এগিলাচ কুহুমীয়া পানীৰে খোৱাৰ সময় হ'ল।",
            "নমস্কার দিদিমা! এখন সকাল ৮:৩০। প্রেসারের ওষুধটি উষ্ণ জল দিয়ে খাওয়ার সময় হয়েছে।",
            "खुमब्रो खांथि! दा फुंनि ८:३० जाबाय। नोंथांनि मुलि लोंनाय समा जाबाय।",
            "য়োকখৎলবা অয়াবা! হৌজি ২ অয়ুক্কী ৮:৩০ তাবা। মখী হীদাক থকনবা মতম ওইরে।",
            "शुभ प्रभात बजै! अहिले बिहानको ८:३० भयो। मनतातो पानीसँग रक्तचापको औषधि खाने समय भयो।",
            1
        ),
        (
            "rem-002", patient_id, "Hydration & Warm Assam Lemongrass Tea", "hydration", "11:00",
            "1 cup of warm tea or 200ml water",
            "Aita, it is 11:00 AM. Let's drink a warm cup of lemongrass tea together to stay fresh and hydrated.",
            "আইতা, এতিয়া ১১:০০ বাজিছে। গাটো সতেজ ৰাখিবলৈ এগিলাচ কুহুমীয়া পানী বা চাহ খাই লওঁ আহক।",
            "দিদিমা, এখন ১১:০০ টা। শরীর সতেজ রাখতে একটু জল বা চা খেয়ে নিন।",
            "आइता, दा ११:०० जाबाय। दे लोंसे गोरबो सोहोदनो दै एबा साहा।",
            "অয়াবা, হৌজিক ১১:০০ তাবা। ঈশিং অমুক্কী থকোসি।",
            "बजै, अहिले ११:०० बज्यो। फ्रेस हुनको लागि एक कप मनतातो पानी पिउनुहोस्।",
            1
        ),
        (
            "rem-003", patient_id, "Afternoon Memory Walk & Garden Visit", "routine", "16:30",
            "Gentle 15-minute stroll in the veranda or courtyard with Anjali",
            "Aita, the afternoon sun is gentle. Let's take our 15-minute walk in the veranda and look at the blooming orchids.",
            "আইতা, আবেলি ৪:৩০ বাজিছে। আহক বাৰাণ্ডাত এপাক খোজ কাঢ়ি কপৌ ফুলবোৰ চাওঁগৈ।",
            "দিদিমা, বিকেল ৪:৩০। আসুন বারান্দায় একটু হেঁটে অর্কিড ফুলগুলো দেখি।",
            "आइता, बेलासिनि समाव बाराण्डायाव खौसे खौसे थामसे।",
            "অয়াবা, নুমিদাংৱাই ৪:৩০ তাবা। পখাত খরা খোঙচৎ চৎসি।",
            "बजै, दिउँसोको ४:३० बज्यो। ल हिँड्नुहोस् कौसीमा एकछिन टहलिन जाउँ।",
            1
        ),
        (
            "rem-004", patient_id, "Night Calcium & Dinner Medicine", "medicine", "20:30",
            "1 Calcium tablet after light dinner of soft Joha rice",
            "Good evening Aita. It is 8:30 PM. Time for your evening calcium tablet after your warm dinner.",
            "শুভ সন্ধ্যা আইতা। ৰাতি ৮:৩০ বাজিছে। ভাত খাই কেলচিয়ামৰ টেবলেটটো খাই লওক।",
            "শুভ সন্ধ্যা দিদিমা। রাত ৮:৩০। রাতের খাবারের পর ক্যালসিয়াম ওষুধটি খেয়ে নিন।",
            "हरनि समाव ८:३० जाबाय। ओंखाम जाखांनानै मुलि लोंदो।",
            "য়ুংথাংবা অয়াবা। অহিঙগী ৮:৩০ তাবা। চাক চারগা হীদাক থকোসি।",
            "शुभ रात्री बजै। रातिको ८:३० भयो। खाना खाएपछि क्याल्सियम औषधि लिनुहोस्।",
            1
        )
    ]

    cursor.executemany("""
    INSERT INTO reminders (
        id, patient_id, title, category, scheduled_time, dosage_or_detail,
        audio_prompt_en, audio_prompt_as, audio_prompt_bn, audio_prompt_brx,
        audio_prompt_mni, audio_prompt_ne, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, reminders)

    # Seed 14 days of realistic longitudinal cognitive sessions
    games = [
        ("game-01", "Who is This?", "Memory"),
        ("game-02", "Our Story Recall", "Memory"),
        ("game-03", "Today is...", "Attention"),
        ("game-04", "Textile & Pattern Match", "Visuospatial"),
        ("game-05", "Sounds of Home", "Memory"),
        ("game-06", "Market Basket", "Executive"),
        ("game-07", "Festival & Harvest Sequence", "Executive"),
        ("game-08", "Daily Routine Sorting", "Executive"),
        ("game-09", "Shadow & Utensil Match", "Visuospatial"),
        ("game-10", "Folk Lyric Completion", "Verbal"),
        ("game-11", "Gentle Flower Tap", "Attention")
    ]

    base_time = datetime.now() - timedelta(days=14)
    session_id_counter = 100

    for day in range(14):
        session_date = base_time + timedelta(days=day, hours=random.randint(9, 11), minutes=random.randint(10, 50))
        daily_games = random.sample(games, 3)
        for g_id, g_title, g_domain in daily_games:
            session_id_counter += 1
            base_acc = 0.78 + (day * 0.012) + random.uniform(-0.04, 0.05)
            base_acc = min(max(base_acc, 0.70), 0.98)
            rt = int(3200 - (day * 45) + random.randint(-180, 220))
            cues = 2 if day < 4 else (1 if day < 10 else random.choice([0, 1]))
            diff = 1 if day < 5 else (2 if day < 11 else random.choice([2, 3]))

            cursor.execute("""
            INSERT INTO cognitive_sessions (
                id, patient_id, timestamp, game_id, game_title, domain,
                accuracy, reaction_time_ms, cues_needed, difficulty_level, mood_state
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                f"sess-{session_id_counter}", patient_id, session_date.isoformat(),
                g_id, g_title, g_domain, round(base_acc, 2), rt, cues, diff,
                "Calm and Smiling" if base_acc > 0.8 else "Attentive"
            ))

    # Seed adherence logs for the last 7 days
    adherence_id = 200
    for day in range(7):
        log_date = (datetime.now() - timedelta(days=day)).strftime("%Y-%m-%d")
        for rem_id in ["rem-001", "rem-002", "rem-003", "rem-004"]:
            adherence_id += 1
            status = "taken" if random.random() < 0.92 else "delayed"
            cursor.execute("""
            INSERT INTO adherence_logs (id, patient_id, reminder_id, date, status, acknowledged_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (
                f"adh-{adherence_id}", patient_id, rem_id, log_date, status,
                datetime.now().isoformat()
            ))

if __name__ == "__main__":
    init_db()
    print(f"XORON Database initialized successfully at: {DB_PATH}")
