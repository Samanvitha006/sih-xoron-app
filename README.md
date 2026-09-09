# XORON (স্মৰণ): Cognitive Care in the Language of Home

### Smart India Hackathon 2026
- **Problem Statement ID**: `SIH26003`
- **Problem Statement Title**: *AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in NER*
- **Theme**: MedTech / BioTech / HealthTech
- **Category**: Software
- **Team Name**: Invincible Core

---

## What is XORON?

**XORON** turns a family’s own photos, songs, voices, and daily routine into cognitive therapy that an elderly person with dementia can actually use — **by voice, in her own language, 100% offline with zero internet requirement**.

It addresses the critical research gaps identified in recent dementia literature (Osback et al., 2025; LASI Study, 2023) by providing auditory accommodation, native regional language support, evidence-based errorless learning, and continuous clinical progress tracking.

---

## Key Highlights & New Capabilities

### 1. First-Class English + 5 North Eastern Languages
Instant 1-tap language switching across all features, audio synthesis, and voice recognition:
- 🇬🇧 **English (EN)** *(User requested first-class option)*
- 🇮🇳 **Assamese / অসমীয়া (AS)**
- 🇮🇳 **Bengali / বাংলা (BN)**
- 🇮🇳 **Bodo / बड़ो (BRX)**
- 🇮🇳 **Manipuri / মৈতৈলোন্ (MNI)**
- 🇮🇳 **Nepali / नेपाली (NE)**

### 2. Deep Family Reminiscence Therapy ("Aamar Kahini / Our Story")
- **Family Story Vault**: High-resolution timeline of cherished life events (e.g. *Rongali Bihu 1974*, *Tezpur Tea Garden & Cottage 1968*, *Dr. Priya's MBBS Graduation 2002*).
- **Authentic Family Voice Notes**: Real voice messages from daughter Priya, grandson Rohan, and caregiver Anjali that soothe agitation and reinforce identity.
- **"Who is This?" Spaced Retrieval Loop**: Caregiver uploads one photo; on-device intelligence identifies the person across albums and runs a gentle, cue-faded voice recognition loop.

### 3. AI Memory Assistance Chatbot ("Xoron Sathi" / স্মৰণ সংগী) with LangChain RAG
- **LangChain RAG Architecture**: Retrieval-Augmented Generation retrieving local patient context (`location`, `time`, `next_reminder`, `family_media`) with zero hallucination.
- **Naomi Feil's Dementia Validation Therapy Rules**:
  1. *Never show frustration*; validate emotions first using Reminiscence Therapy techniques.
  2. *Answer disorientation calmly* using real-time grounding context (e.g. "Safe at home in Shillong/Guwahati").
  3. *Keep responses strictly under 2 sentences* with an empathetic, soothing tone.
- **Voice-First Conversational Memory Companion**: Patient can speak naturally or tap suggested chips (*"Who is my daughter?"*, *"Where am I right now?"*, *"What is my next medicine?"*, *"Tell me a Bihu story"*).

### 4. WatermelonDB Architecture & Clinical Digital Biomarkers
- **Offline-First Schema (`@nozbe/watermelondb`)**:
  - `patients`: Age, name, and baseline MoCA score (`baseline_moca: 21/30`).
  - `family_media`: Local media URIs, relation tags, and voice clone audio anchors.
  - `schedules`: Structured daily routines, medication tasks, and completion flags.
  - `game_telemetry`: Millisecond-level touch stroke jitter (motor tremor tracking) and saccade velocity (oculomotor visual tracking).
  - `qdrs_surveys`: Quick Dementia Rating System (Galvin et al.) tracking MCI and dementia progression.
- **Biomarker Analytics**: Automatically computes mean motor stability and oculomotor status for longitudinal clinical insights.

### 5. 11 Culturally Tailored Adaptive Cognitive Mini-Games
1. **Who is This?**: Family face and relationship recall.
2. **Our Story**: Reminiscence narrative and audio timeline.
3. **Today is...**: Reality orientation (day, date, morning chai time, season).
4. **Textile & Pattern Match**: Gamusa, Mekhela Sador & Dokhona patterns.
5. **Sounds of Home**: Auditory memory of Bihu Dhol, Pepa, tin roof rain.
6. **Market Basket**: Working memory for Kazi Nemu lemon, Joha rice, bamboo shoot.
7. **Festival Sequence**: Rongali, Kati, and Magh Bihu seasonal sequencing.
8. **Daily Routine Sorting**: Executive function sorting chai, prayer, medicine, and stroll.
9. **Shadow & Utensil Match**: Traditional brass Xorai, Bota, and Banbati matching.
10. **Folk Song Completion**: Evergreen lyrics (Bhupen Hazarika melodies & English classics).
11. **Gentle Flower Tap**: Sustained attention tapping blooming Kopou orchids.

### 6. Engine-Level Therapy Rules
- **Errorless Learning**: The app **NEVER** buzzes a wrong answer, displays red crosses, or sounds failure alerts. Cues fade in gently after hesitation to eliminate dementia anxiety.
- **Adaptive Difficulty**: Computes $\text{Difficulty} = f(\text{Accuracy}, \text{Reaction Time}, \text{Cues})$.
- **Spaced Retrieval**: Expanding recall intervals (1 day $\to$ 3 days $\to$ 7 days) resetting softly upon hesitation.

### 7. Caregiver Command Centre & ASHA Health Worker Portal
- 14-day longitudinal trajectory charts across 5 cognitive domains.
- Reaction time (RT) variability and touch stroke jitter biomarker tracking.
- Quick Dementia Rating System (QDRS) survey logging and staging.
- Medication and hydration adherence percentage tracking.
- Living Memory Bank uploader (photo, relation, voice note).
- **LASI-Compliant Clinical Assessment Export**: Printable PDF report for neurologists and geriatricians.
- **ASHA Village Cohort View**: Multi-patient dashboard flagging sustained cognitive decline or missed medication for early intervention.

### 8. Android Home-Screen Widget Simulator
- Interactive preview of the single-tap Android widget: speaks first, displays daily orientation, upcoming medicine countdown, and 1-tap game launch with no confusing menus.

---

## How to Run the Project

### Prerequisites
- Python 3.10+ (Python 3.13 tested)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### Quick 1-Click Launch (Windows)
Double-click:
```cmd
start_app.bat
```

### Manual Command Line Launch
```bash
# Navigate to project directory
cd C:\Users\Dell\.gemini\antigravity\scratch\xoron

# Start server
py -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Then open your browser to:
👉 **`http://127.0.0.1:8000`**

---

## File Structure

```
xoron/
├── schema.js                   # WatermelonDB AppSchema (patients, media, schedules, telemetry, qdrs)
├── models.js                   # WatermelonDB Model Classes & Decorators
├── server.py                   # FastAPI REST & Static File Server (telemetry, qdrs, schedules)
├── database.py                 # SQLite Offline-First Store & Clinical Biomarker Seed Data
├── chatbot.py                  # LangChain PromptTemplate RAG & Validation Therapy Engine
├── test_server.py              # Automated 13-Point Verification Test Suite
├── create_assets.py            # Authentic SVG asset generator
├── start_app.bat               # 1-Click Windows launcher for judges & caregivers
├── README.md                   # Complete SIH 2026 Project Documentation
├── static/
│   ├── index.html              # Unified Single Page Application (SPA)
│   ├── sw.js                   # Offline-First PWA Service Worker
│   ├── css/
│   │   └── style.css           # Dementia-friendly typography & cue-fading animations
│   ├── js/
│   │   ├── app.js              # Master SPA router & offline manager
│   │   ├── i18n.js             # 6-Language translation dictionary (EN, AS, BN, BRX, MNI, NE)
│   │   ├── speech.js           # Web Speech API TTS & STT, Web Audio sound synthesizers
│   │   ├── chatbot.js          # AI Memory Companion ("Xoron Sathi") controller
│   │   ├── reminiscence.js     # Family Reminiscence Therapy ("Our Story") controller
│   │   ├── games.js            # 11 Culturally Tailored Cognitive Mini-Games suite
│   │   ├── adaptive_engine.js  # Errorless learning & spaced retrieval engine
│   │   ├── reminders.js        # Routine reminders & Android widget simulator
│   │   └── caregiver.js        # Caregiver analytics, ASHA cohort & clinical PDF export
│   └── assets/
│       ├── photos/             # Family portrait SVGs (Priya, Rohan, Biren, Anjali, Bihu, Tea)
│       └── patterns/           # Cultural SVGs (Gamusa, Jaapi, Xorai, Kopou orchid)
```

---

## Clinical References Grounding XORON
1. **Hill et al. (2017)**, *Am J Psychiatry*: Computerized Cognitive Training in Older Adults with MCI or Dementia.
2. **Woods et al. (2018)**, *Cochrane Database of Systematic Reviews*: Reminiscence therapy for dementia.
3. **Osback et al. (2025)**, *Healthcare*: Mobile Gaming for Cognitive Health in Older Adults: Scoping Review.
4. **LASI Study (2023)**, *Alzheimer's & Dementia*: Longitudinal Ageing Study in India: 7.4% prevalence in 60+ (8.8 million people).
5. **van Balkom et al. (2022)**, *Parkinsonism Relat Disord*: COGTIPS 13 adaptive games trial.
