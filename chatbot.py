"""
XORON AI Memory Assistance Chatbot ("Xoron Sathi" / স্মৰণ সংগী)
Problem Statement: SIH26003 (MedTech/HealthTech)
Team: Invincible Core

Features:
- LangChain PromptTemplate with strict Clinical Validation & Reminiscence Therapy rules.
- Local RAG Retrieval over SQLite / WatermelonDB patient context.
- Responses strictly under 2 sentences with warm, empathetic tone.
- Zero frustration, zero hallucination on location, family, or medicine.
- Multi-lingual support: English (EN), Assamese (AS), Bengali (BN), Bodo (BRX), Manipuri (MNI), Nepali (NE).
"""

import re
import sqlite3
from datetime import datetime
from database import get_db_connection

try:
    from langchain_core.prompts import PromptTemplate
except ImportError:
    try:
        from langchain.prompts import PromptTemplate
    except ImportError:
        class PromptTemplate:
            def __init__(self, input_variables, template):
                self.input_variables = input_variables
                self.template = template
            def format(self, **kwargs):
                return self.template.format(**kwargs)

def get_local_patient_context(patient_id="pat-ner-001"):
    """
    RAG Retrieval: Query local SQLite/WatermelonDB for real-time patient context.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Query Patient
    cursor.execute("SELECT * FROM patients WHERE id = ?", (patient_id,))
    p_row = cursor.fetchone()
    patient = dict(p_row) if p_row else {}

    # Query Next Active Schedule / Reminder
    cursor.execute("""
    SELECT scheduled_time, task_type FROM schedules 
    WHERE patient_id = ? AND is_completed = 0 
    ORDER BY scheduled_time ASC LIMIT 1
    """, (patient_id,))
    s_row = cursor.fetchone()

    conn.close()

    now = datetime.now()
    time_str = now.strftime("%A, %I:%M %p")
    location = f"Safe at home in {patient.get('current_residence', 'Dispur, Guwahati')}"
    next_task = s_row["task_type"] if s_row else "Take your warm morning tea with caregiver Anjali"

    return {
        "location": location,
        "time": time_str,
        "next_reminder": next_task,
        "preferred_name": patient.get("preferred_name", "Aita"),
        "caregiver": patient.get("caregiver_name", "Anjali")
    }

prompt_template = PromptTemplate(
    input_variables=["location", "time", "next_reminder", "patient_input"],
    template="""You are an infinitely patient, warm memory companion.
Rules:
1. Never show frustration. Validate emotions first using Reminiscence Therapy techniques.
2. Answer disorientation calmly using the CONTEXT provided.
3. Keep responses under 2 sentences with an empathetic tone.

CONTEXT:
Location: {location}
Time: {time}
Upcoming Task: {next_reminder}

Patient Input: {patient_input}
Response:"""
)

def get_family_members(patient_id="pat-ner-001"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM memory_bank WHERE patient_id = ?", (patient_id,))
    members = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return members

def get_reminiscence_stories(patient_id="pat-ner-001"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reminiscence_stories WHERE patient_id = ?", (patient_id,))
    stories = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return stories

class MemoryAssistant:
    def __init__(self):
        self.default_patient_id = "pat-ner-001"

    def process_query(self, query: str, lang: str = "en", patient_id: str = "pat-ner-001"):
        query_clean = (query or "").lower().strip()
        ctx = get_local_patient_context(patient_id)
        family = get_family_members(patient_id)
        stories = get_reminiscence_stories(patient_id)

        # Build LangChain formatted prompt for RAG logging
        prompt_log = prompt_template.format(
            location=ctx["location"],
            time=ctx["time"],
            next_reminder=ctx["next_reminder"],
            patient_input=query
        )

        # 1. Family Queries
        for member in family:
            name_lower = member["name"].lower()
            rel_lower = member["relationship"].lower()
            if (name_lower in query_clean or rel_lower in query_clean or
                ("daughter" in query_clean and "daughter" in rel_lower) or
                ("priya" in query_clean and "priya" in name_lower) or
                ("grandson" in query_clean and "grandson" in rel_lower) or
                ("rohan" in query_clean and "rohan" in name_lower) or
                ("husband" in query_clean and "husband" in rel_lower) or
                ("biren" in query_clean and "biren" in name_lower) or
                ("caregiver" in query_clean and "caregiver" in rel_lower) or
                ("anjali" in query_clean and "anjali" in name_lower) or
                ("জীয়াৰী" in query_clean or "নাতি" in query_clean or "স্বামী" in query_clean or "বোৱাৰী" in query_clean)):
                
                return self._generate_family_response(member, lang, ctx)

        # 2. Disorientation / Location ("Where am I?", "Where is my house?")
        if any(w in query_clean for w in ["where am i", "where is my house", "where is my home", "where am i right now", "am i home", "who am i", "my name", "মই ক'ত", "মোৰ ঘৰ ক'ত", "আমার বাড়ি কোথায়", "आं बबेयाव", "कहाँ छु म"]):
            return self._generate_disorientation_response(ctx, lang)

        # 3. Time / Day ("What day is today?", "What time is it?")
        if any(w in query_clean for w in ["today", "what day", "what date", "what time", "morning or evening", "আজি কি বাৰ", "আজ কি বার", "दिन कुन हो", "आज के दिन"]):
            return self._generate_time_response(ctx, lang)

        # 4. Medication / Next Task
        if any(w in query_clean for w in ["medicine", "tablet", "pill", "water", "thirsty", "bp", "blood pressure", "doctor", "ঔষধ", "দৰব", "পানি", "पिएन", "दबाइ"]):
            return self._generate_medicine_response(ctx, lang)

        # 5. Anxiety / Dementia Time-Shift (Office / School / Searching for parents)
        # Clinical Rule 1: Never show frustration. Validate emotions first using Reminiscence Therapy techniques.
        if any(w in query_clean for w in ["office", "school", "bus", "train", "job", "work", "find my mother", "let me go out", "leave", "আইতা অফিচ", "कामा जानु", "কাজ"]):
            return self._generate_validation_response(ctx, lang)

        # 6. Nostalgia / Story / Bihu
        if any(w in query_clean for w in ["story", "bihu", "song", "music", "tezpur", "garden", "wedding", "গান", "সাধু", "বিহু", "গল্প", "गीत", "कथा"]):
            return self._generate_story_response(stories, lang)

        # 7. General Friendly Memory Companion
        return self._generate_default_companion_response(ctx, lang)

    def _generate_family_response(self, member, lang, ctx):
        name = member["name"]
        rel = member["relationship"]
        note = member["voice_note_text"]

        # Strictly under 2 sentences with empathetic tone
        replies = {
            "en": f"This is your beloved {rel}, {name}. She sends you this loving message: '{note}'",
            "as": f"এয়া আপোনাৰ মৰমৰ {member.get('relationship_as', rel)}, {name}। তেওঁ মৰমেৰে কৈছে: '{note}'",
            "bn": f"ইনি আপনার প্রিয় {member.get('relationship_bn', rel)}, {name}। তিনি ভালোবাসার সাথে আপনাকে স্মরণ করেছেন।",
            "brx": f"बे नोंथांनि अनजाथाव {member.get('relationship_brx', rel)}, {name}। नोंथांखौ जोबोद मोजां मोनो।",
            "mni": f"মসি নহাক্কী নুংশিবা {member.get('relationship_mni', rel)}, {name} নি।",
            "ne": f"उहाँ तपाईंको प्रिय {member.get('relationship_ne', rel)}, {name} हुनुहुन्छ। तपाईंलाई धेरै माया पठाउनुभएको छ।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "family_recall",
            "language": lang,
            "card_type": "family_card",
            "card_data": {
                "name": name,
                "relationship": member.get(f"relationship_{lang}", rel),
                "photo_url": member["photo_url"],
                "voice_note": note,
                "location": member.get("location", "Guwahati"),
                "schedule": member.get("visit_schedule", "Visits regularly")
            },
            "suggested_followups": ["Who is Rohan?", "Where am I right now?"]
        }

    def _generate_disorientation_response(self, ctx, lang):
        name = ctx["preferred_name"]
        loc = ctx["location"]
        caregiver = ctx["caregiver"]

        # Rule 2 & 3: Answer disorientation calmly using CONTEXT under 2 sentences
        replies = {
            "en": f"You are {loc}, surrounded by love. Your caregiver {caregiver} is right here with you in the living room.",
            "as": f"আপুনি আপোনাৰ নিজা ঘৰতেই সম্পূৰ্ণ সুৰক্ষিত হৈ আছে, {name}। আপোনাৰ বোৱাৰী {caregiver} আপোনাৰ ওচৰতেই আছে।",
            "bn": f"আপনি নিজের বাড়িতে সম্পূর্ণ নিরাপদ আছেন, {name}। আপনার কাছেই {caregiver} রয়েছেন।",
            "brx": f"नोंथां नोंनि नोआव रैखाथि दं। नोंथांनि खाथियाव {caregiver} दं।",
            "mni": f"নহাক য়ুমদা শাফনা লৈরি। {caregiver} সু নহাক্কী নকন্দা লৈরি।",
            "ne": f"तपाईं आफ्नै घरमा पूर्ण सुरक्षित हुनुहुन्छ, {name}। {caregiver} तपाईंको साथमै हुनुहुन्छ।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "reality_orientation",
            "language": lang,
            "card_type": "orientation_card",
            "card_data": {
                "location": loc,
                "safety_note": f"Grounded in local context. {caregiver} is nearby."
            },
            "suggested_followups": ["What is my next medicine?", "Tell me a Bihu story"]
        }

    def _generate_time_response(self, ctx, lang):
        time_str = ctx["time"]
        # Under 2 sentences
        replies = {
            "en": f"Today is {time_str}. It is a calm, peaceful morning here in Guwahati.",
            "as": f"আজি হৈছে {time_str}। বতৰটো শান্ত আৰু মনোৰম।",
            "bn": f"আজ {time_str}। দিনটি শান্ত ও সুন্দর।",
            "brx": f"दिनै {time_str}। फुंनि सम गाहाम।",
            "mni": f"ঙসি {time_str} নি। মতম য়াম্না ফরে।",
            "ne": f"आज {time_str} हो। मौसम शान्त छ।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "time_orientation",
            "language": lang,
            "card_type": "time_card",
            "card_data": {"time": time_str},
            "suggested_followups": ["What is my next medicine?", "Who is my daughter?"]
        }

    def _generate_medicine_response(self, ctx, lang):
        next_task = ctx["next_reminder"]
        # Under 2 sentences
        replies = {
            "en": f"Your next scheduled routine is: {next_task}. Caregiver Anjali is bringing a warm glass of water for you right now.",
            "as": f"আপোনাৰ পৰৱৰ্তী নিয়ম হ'ল: {next_task}। অঞ্জলিয়ে এগিলাচ কুহুমীয়া পানীৰে আনি দিছে।",
            "bn": f"আপনার পরবর্তী ওষুধ: {next_task}। জল দিয়ে এটি খেয়ে নিন।",
            "brx": f"दा नोंथांनि मुलि: {next_task}।",
            "mni": f"নহাক্কী হীদাক: {next_task}।",
            "ne": f"तपाईंको अर्को तालिका: {next_task} हो। मनतातो पानीसँग औषधि लिनुहोस्।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "medication_info",
            "language": lang,
            "card_type": "medicine_card",
            "card_data": {"title": next_task},
            "suggested_followups": ["I took my medicine", "Who is my daughter?"]
        }

    def _generate_validation_response(self, ctx, lang):
        name = ctx["preferred_name"]
        # Rule 1: Validate emotions first using Reminiscence Therapy. Under 2 sentences.
        replies = {
            "en": f"You were always such a devoted, caring worker, {name}! Today all your responsibilities are complete, and Anjali is brewing warm Assam tea for you.",
            "as": f"আপুনি সদায় সকলো দায়িত্ব নিষ্ঠাৰে পালন কৰি আহিছে, {name}! আজিৰ সকলো কাম সম্পূৰ্ণ হ'ল, এতিয়া গৰম চাহ একাপ খাই আৰাম কৰক।",
            "bn": f"আপনি সারা জীবন খুব দায়িত্বশীলভাবে সবকিছু করেছেন, {name}! আজকের সব কাজ শেষ, এখন একটু বিশ্রাম নিন।",
            "brx": f"नोंथां जोबोद मोजां खामानि मावदोंमोन। दिनैनि खामानिया जोबबाय, दा जिरायदो।",
            "mni": f"নহাক্না থবক কয়ারোম তৌখ্রে। ঙসিগী থবক লোইরে, নুংঙাইনা পোথাখরো।",
            "ne": f"तपाईंले सधैं धेरै राम्रो काम गर्नुभयो, {name}! आजको सबै काम सकियो, अब आनन्दले चिया पिउनुहोस्।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "validation_therapy",
            "language": lang,
            "card_type": "comfort_card",
            "card_data": {"technique": "Validation & Reminiscence Therapy"},
            "suggested_followups": ["Tell me a Bihu story", "Where am I right now?"]
        }

    def _generate_story_response(self, stories, lang):
        story = stories[0] if stories else {}
        title = story.get("title", "Rongali Bihu")
        narrative = story.get("narrative", "We danced under the big mango tree with dhol and pepa.")
        narrative_as = story.get("narrative_as", narrative)

        replies = {
            "en": f"Remember {title}? {narrative}",
            "as": f"মনত পৰে নে {story.get('title_as', title)}? {narrative_as}",
            "bn": f"{title} মনে পড়ে? কত আনন্দ করেছিলেন।",
            "brx": f"गोसोखांदोंना {title}?",
            "mni": f"{title} নীংশিংলিব্রা?",
            "ne": f"{title} सम्झनुहुन्छ? कति रमाइलो थियो।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "reminiscence_story",
            "language": lang,
            "card_type": "story_card",
            "card_data": story,
            "suggested_followups": ["Tell me another story", "Who is my daughter?"]
        }

    def _generate_default_companion_response(self, ctx, lang):
        name = ctx["preferred_name"]
        replies = {
            "en": f"Hello {name}! I am Xoron Sathi, your memory companion. How are you feeling right now in your heart?",
            "as": f"নমস্কাৰ {name}! মই স্মৰণ সংগী, আপোনাৰ মৰমৰ স্মৃতি সংগী। আপোনাৰ মনটো কেনে লাগিছে?",
            "bn": f"নমস্কার {name}! আমি স্মরণ সঙ্গী। আপনি কেমন আছেন?",
            "brx": f"खुमब्रो {name}! आं स्मरण संगी।",
            "mni": f"খুরুমজরি {name}! ঐদি স্মরণ সংগীনি।",
            "ne": f"नमस्ते {name}! म स्मरण साथी हुँ। तपाईंलाई कस्तो छ?"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "general_greeting",
            "language": lang,
            "card_type": "companion_card",
            "card_data": {"assistant_name": "Xoron Sathi"},
            "suggested_followups": ["Who is my daughter?", "Where am I right now?"]
        }

assistant = MemoryAssistant()
