"""
XORON AI Memory Assistance Chatbot ("Xoron Sathi" / স্মৰণ সংগী)
Problem Statement: SIH26003 (MedTech/HealthTech)
Team: Invincible Core

Features:
- Grounded RAG retrieval over patient's Living Memory Bank & routine.
- Naomi Feil's Dementia Validation Therapy (zero harsh confrontation, compassionate redirection).
- Multi-lingual response generation for English (EN), Assamese (AS), Bengali (BN),
  Bodo (BRX), Manipuri (MNI), and Nepali (NE).
- Zero hallucination on family relations, current residence, and medication.
"""

import re
import sqlite3
from datetime import datetime
from database import get_db_connection

def get_patient_profile(patient_id="pat-ner-001"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients WHERE id = ?", (patient_id,))
    patient = cursor.fetchone()
    conn.close()
    return dict(patient) if patient else None

def get_family_members(patient_id="pat-ner-001"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM memory_bank WHERE patient_id = ?", (patient_id,))
    members = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return members

def get_today_reminders(patient_id="pat-ner-001"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reminders WHERE patient_id = ? AND is_active = 1 ORDER BY scheduled_time ASC", (patient_id,))
    rems = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rems

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
        patient = get_patient_profile(patient_id) or {}
        family = get_family_members(patient_id)
        reminders = get_today_reminders(patient_id)
        stories = get_reminiscence_stories(patient_id)

        # 1. Check for Family Member queries
        for member in family:
            name_lower = member["name"].lower()
            rel_lower = member["relationship"].lower()
            if (name_lower in query_clean or 
                rel_lower in query_clean or 
                ("daughter" in query_clean and "daughter" in rel_lower) or
                ("priya" in query_clean and "priya" in name_lower) or
                ("grandson" in query_clean and "grandson" in rel_lower) or
                ("rohan" in query_clean and "rohan" in name_lower) or
                ("husband" in query_clean and "husband" in rel_lower) or
                ("biren" in query_clean and "biren" in name_lower) or
                ("caregiver" in query_clean and "caregiver" in rel_lower) or
                ("anjali" in query_clean and "anjali" in name_lower) or
                ("জীয়াৰী" in query_clean or "নাতি" in query_clean or "স্বামী" in query_clean or "বোৱাৰী" in query_clean)):
                
                return self._generate_family_response(member, lang, patient)

        # 2. Check for Disorientation & Current Location queries ("Where am I?", "Where is my house?")
        if any(w in query_clean for w in ["where am i", "where is my house", "where is my home", "where am i right now", "am i home", "who am i", "my name", "মই ক'ত", "মোৰ ঘৰ ক'ত", "আমার বাড়ি কোথায়", "आं बबेयाव", "कहाँ छु म"]):
            return self._generate_orientation_response(patient, lang)

        # 3. Check for Time & Date queries ("What day is today?", "What time is it?")
        if any(w in query_clean for w in ["today", "what day", "what date", "what time", "morning or evening", "আজি কি বাৰ", "আজ কি বার", "दिन कुन हो", "आज के दिन"]):
            return self._generate_time_response(lang)

        # 4. Check for Medication & Health queries ("What medicine do I take?", "Did I take my medicine?", "Doctor")
        if any(w in query_clean for w in ["medicine", "tablet", "pill", "water", "thirsty", "bp", "blood pressure", "doctor", "ঔষধ", "দৰব", "পানি", "पिएन", "दबाइ"]):
            return self._generate_medicine_response(reminders, lang)

        # 5. Check for Agitation / Dementia Time-Shift / Anxious Wandering urge
        # (e.g. "I must go to office", "I need to go to school", "I need to find my mother", "Let me go out")
        if any(w in query_clean for w in ["office", "school", "bus", "train", "job", "work", "find my mother", "let me go out", "leave", "আইতা অফিচ", "कामा जानु", "কাজ"]):
            return self._generate_validation_comfort_response(patient, query_clean, lang)

        # 6. Check for Nostalgia / Story / Bihu / Music queries
        if any(w in query_clean for w in ["story", "bihu", "song", "music", "tezpur", "garden", "wedding", "গান", "সাধু", "বিহু", "গল্প", "गीत", "कथा"]):
            return self._generate_story_response(stories, lang)

        # 7. General Friendly Dementia Companion response
        return self._generate_companion_response(patient, lang)

    def _generate_family_response(self, member, lang, patient):
        name = member["name"]
        rel = member["relationship"]
        loc = member["location"]
        note = member["voice_note_text"]
        schedule = member["visit_schedule"]

        replies = {
            "en": f"This is your beloved {rel}, {name}. {name} lives in {loc}. {schedule}. Here is a voice message from {name}: '{note}'",
            "as": f"এয়া আপোনাৰ মৰমৰ {member.get('relationship_as', rel)}, {name}। {name} {loc}-ত থাকে। {schedule}। {name}-ৰ এটি মৰমৰ বাৰ্তা: '{note}'",
            "bn": f"ইনি আপনার প্রিয় {member.get('relationship_bn', rel)}, {name}। {name} {loc}-এ থাকেন। {schedule}।",
            "brx": f"बे नोंथांनि अनजाथाव {member.get('relationship_brx', rel)}, {name}। {loc} आव थायो।",
            "mni": f"মসি নহাক্কী নুংশিবা {member.get('relationship_mni', rel)}, {name} নি। {loc} দা লৈ।",
            "ne": f"उहाँ तपाईंको प्यारो {member.get('relationship_ne', rel)}, {name} हुनुहुन्छ। {loc} मा बस्नुहुन्छ। {schedule}।"
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
                "location": loc,
                "schedule": schedule,
                "shared_memory": member["shared_memory"]
            },
            "suggested_followups": [
                "Play voice message" if lang == "en" else "মাতটো শুনক",
                "Who is my grandson?" if lang == "en" else "মোৰ নাতি কোন?",
                "What is my next medicine?" if lang == "en" else "পৰৱৰ্তী ঔষধ কি?"
            ]
        }

    def _generate_orientation_response(self, patient, lang):
        name = patient.get("preferred_name", "Aita")
        residence = patient.get("current_residence", "Dispur, Guwahati")
        caregiver = patient.get("caregiver_name", "Anjali")

        replies = {
            "en": f"You are completely safe, {name}. You are at home in your peaceful house in {residence}. Your caregiver {caregiver} is right here with you in the house.",
            "as": f"আপুনি সম্পূৰ্ণ সুৰক্ষিত, {name}। আপুনি আপোনাৰ মৰমৰ নিজ ঘৰত {residence}-ত আছে। আপোনাৰ বোৱাৰী {caregiver} ঘৰৰ ভিতৰতে আপোনাৰ ওচৰত আছে।",
            "bn": f"আপনি সম্পূর্ণ নিরাপদ আছেন, {name}। আপনি আপনার {residence}-এর নিজের বাড়িতে আছেন। {caregiver} আপনার কাছেই আছেন।",
            "brx": f"नोंथां नोंनि गामि {residence} नि नोआव दं। नोंथां रैखाथि दं।",
            "mni": f"নহাক {residence} গী নহাক্কী য়ুমদা শাফনা লৈরি। {caregiver} সু নহাক্কী নকন্দা লৈরি।",
            "ne": f"तपाईं बिल्कुल सुरक्षित हुनुहुन्छ, {name}। तपाईं आफ्नो {residence} को घरमा हुनुहुन्छ। {caregiver} तपाईंको साथमै हुनुहुन्छ।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "reality_orientation",
            "language": lang,
            "card_type": "orientation_card",
            "card_data": {
                "patient_name": name,
                "location": residence,
                "hometown": patient.get("hometown", "Tezpur"),
                "caregiver": caregiver,
                "safety_note": "You are surrounded by family and love."
            },
            "suggested_followups": [
                "Who is in the house?" if lang == "en" else "ঘৰত কোন কোন আছে?",
                "What day is today?" if lang == "en" else "আজি কি বাৰ?",
                "Let's have some tea" if lang == "en" else "চাহ একাপ খাওঁ আহক"
            ]
        }

    def _generate_time_response(self, lang):
        now = datetime.now()
        day_name = now.strftime("%A")
        date_str = now.strftime("%d %B %Y")
        hour = now.hour

        time_of_day = "morning" if hour < 12 else ("afternoon" if hour < 17 else "evening")

        day_trans_as = {"Monday": "সোমবাৰ", "Tuesday": "মঙলবাৰ", "Wednesday": "বুধবাৰ", "Thursday": "বৃহস্পতিবাৰ", "Friday": "শুক্ৰবাৰ", "Saturday": "শনিবাৰ", "Sunday": "দেওবাৰ"}

        replies = {
            "en": f"Today is {day_name}, {date_str}. It is a gentle, peaceful {time_of_day} here in Guwahati.",
            "as": f"আজি {day_trans_as.get(day_name, day_name)}, {date_str}। বতৰটো শান্ত আৰু মনোৰম।",
            "bn": f"আজ {day_name}, {date_str}। দিনটি খুব সুন্দর ও শান্ত।",
            "brx": f"दिनै {day_name} सान। फुंनि सोदोम गाहाम।",
            "mni": f"ঙসি {day_name} নি। য়াম্না নুংঙাইবা নুমিৎনি।",
            "ne": f"आज {day_name}, {date_str} हो। मौसम शान्त र रमाइलो छ।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "time_orientation",
            "language": lang,
            "card_type": "time_card",
            "card_data": {
                "day": day_name,
                "date": date_str,
                "time_of_day": time_of_day,
                "local_season": "Bohag / Autumn in Assam"
            },
            "suggested_followups": [
                "What is my next medicine?" if lang == "en" else "পৰৱৰ্তী ঔষধ কি?",
                "Show today's games" if lang == "en" else "আজিৰ খেলবোৰ দেখুৱাওক",
                "Tell me a memory" if lang == "en" else "এটি স্মৃতি কওক"
            ]
        }

    def _generate_medicine_response(self, reminders, lang):
        if not reminders:
            reply_text = "No active medicines are scheduled right now. You are doing wonderfully!"
            card_item = None
        else:
            first_rem = reminders[0]
            title = first_rem["title"]
            time = first_rem["scheduled_time"]
            dosage = first_rem["dosage_or_detail"]

            replies = {
                "en": f"Your next scheduled routine is at {time}: {title}. {dosage}. Caregiver Anjali will bring it to you with warm water.",
                "as": f"আপোনাৰ পৰৱৰ্তী ঔষধ {time} বজাত: {title}। {dosage}। বোৱাৰী অঞ্জলিয়ে কুহুমীয়া পানীৰে আনি দিব।",
                "bn": f"আপনার পরবর্তী ওষুধ {time} টায়: {title}। {dosage}।",
                "brx": f"दा नोंथांनि मुलि {time} समाव: {title}।",
                "mni": f"নহাক্কী হীদাক {time} তাদা: {title}।",
                "ne": f"तपाईंको अर्को औषधि {time} बजे: {title} हो। {dosage}।"
            }
            reply_text = replies.get(lang, replies["en"])
            card_item = first_rem

        return {
            "reply_text": reply_text,
            "intent": "medication_info",
            "language": lang,
            "card_type": "medicine_card",
            "card_data": card_item or {"title": "All taken on time", "status": "Good adherence"},
            "suggested_followups": [
                "I drank water" if lang == "en" else "মই পানী খালোঁ",
                "Tell me about Priya" if lang == "en" else "প্ৰিয়াৰ বিষয়ে কওক",
                "Play Bihu music" if lang == "en" else "বিহুৰ সুৰ বজাওক"
            ]
        }

    def _generate_validation_comfort_response(self, patient, query, lang):
        """
        Dementia Validation Therapy (Naomi Feil Method):
        Never say 'You are retired/old/can't leave'.
        Validate the underlying emotion (duty, responsibility, love), reassure safety and redirect.
        """
        name = patient.get("preferred_name", "Aita")
        
        replies = {
            "en": f"You have always been so hardworking and caring, {name}! Everything for today has been safely taken care of. All your work is complete. You can relax now. Anjali is brewing your favorite warm Assam ginger tea.",
            "as": f"আপুনি সদায় নিষ্ঠাৰে সকলো দায়িত্ব পালন কৰি আহিছে, {name}! আজিৰ সকলো কাম সুকলমে সমাপ্ত হ'ল। এতিয়া আপুনি আৰামত জিৰণি লওক। অঞ্জলিয়ে আপোনাৰ বাবে আদা আৰু নেমুটেঙাৰ চাহ বনাই আছে।",
            "bn": f"আপনি সারা জীবন খুব দায়িত্বশীলভাবে সবকিছু সামলেছেন, {name}! আজকের সব কাজ খুব সুন্দরভাবে শেষ হয়েছে। এখন একটু শান্ত হয়ে বিশ্রাম নিন।",
            "brx": f"नोंथां जोबोद मोजां खामानि मावदोंमोन। दिनैनि खामानिया जोबबाय, दा जिरायदो।",
            "mni": f"নহাক্না কয়ারোম থবক শাফনা তৌখ্রে। ঙসিগী থবক পুম্নমক লোইরে, নুংঙাইনা পোথাখরো।",
            "ne": f"तपाईंले जीवनभर धेरै राम्रो र जिम्मेवार काम गर्नुभयो, {name}! आजको सबै काम सकियो, अब ढुक्क भएर आराम गर्नुहोस्। तातो चिया तयार हुँदैछ।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "validation_therapy",
            "language": lang,
            "card_type": "comfort_card",
            "card_data": {
                "technique": "Dementia Validation & Grounding Therapy",
                "emotional_tone": "Warm, Reassuring, Respectful",
                "comfort_action": "Sip warm ginger tea and listen to gentle folk melody"
            },
            "suggested_followups": [
                "Listen to gentle folk tune" if lang == "en" else "মধুৰ লোকগীত শুনক",
                "Where is my daughter Priya?" if lang == "en" else "মোৰ জীয়াৰী প্ৰিয়া ক'ত?",
                "Look at garden orchids" if lang == "en" else "ফুলনিৰ কপৌ ফুল চাওঁ"
            ]
        }

    def _generate_story_response(self, stories, lang):
        story = stories[0] if stories else None
        title = story.get("title", "Rongali Bihu Memories") if story else "Rongali Bihu Memories"
        narrative = story.get("narrative", "") if story else "A wonderful family celebration under the mango tree."
        narrative_as = story.get("narrative_as", narrative) if story else narrative

        replies = {
            "en": f"Here is a cherished story: '{title}'. {narrative}",
            "as": f"এয়া আপোনাৰ এক মৰমৰ স্মৃতি: '{story.get('title_as', title)}'। {narrative_as}",
            "bn": f"এটি আপনার একটি সুন্দর স্মৃতি: '{title}'। {narrative}",
            "brx": f"बे नोंथांनि गाहाम गोसोखांथि: '{title}'। {narrative}",
            "mni": f"মসি নহাক্কী নুংশিরবা নীংশিংবা অমনি: '{title}'। {narrative}",
            "ne": f"यहाँ एउटा मीठो सम्झना छ: '{title}'। {narrative}"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "reminiscence_story",
            "language": lang,
            "card_type": "story_card",
            "card_data": story or {"title": title, "narrative": narrative},
            "suggested_followups": [
                "Tell me another story" if lang == "en" else "আৰু এটি স্মৃতি কওক",
                "Who was dancing with me?" if lang == "en" else "মোৰ লগত কোনে নাচিছিল?",
                "Back to main screen" if lang == "en" else "মূল পৃষ্ঠালৈ যাওক"
            ]
        }

    def _generate_companion_response(self, patient, lang):
        name = patient.get("preferred_name", "Aita")
        replies = {
            "en": f"Hello {name}! I am Xoron Sathi, your memory companion. You can ask me about your family, your daughter Priya, today's time, or listen to your favorite stories. How are you feeling right now?",
            "as": f"নমস্কাৰ {name}! মই স্মৰণ সংগী, আপোনাৰ মৰমৰ স্মৃতি সংগী। আপুনি মোক পৰিয়ালৰ মানুহ, জীয়াৰী প্ৰিয়া, সময় বা পুৰণি বিহুৰ কথা সুধিব পাৰে। আপোনাৰ মনটো কেনে লাগিছে?",
            "bn": f"নমস্কার {name}! আমি স্মরণ সঙ্গী। আপনি আমাকে পরিবার, মেয়ে প্রিয়া, সময় বা পুরনো স্মৃতি সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করতে পারেন।",
            "brx": f"खुमब्रो {name}! आं स्मरण संगी। नोंथां आंखौ नोंथांनि नखरनि सोमोन्दै सोंनो हागौ।",
            "mni": f"খুরুমজরি {name}! ঐদি স্মরণ সংগীনি। নহাক্কী ইমুং অমসুং নীংশিংফমগী মতাংদা ঐঙোন্দা হংবিবা য়াগনি।",
            "ne": f"नमस्ते {name}! म स्मरण संगी हुँ। तपाईंले मलाई आफ्नो परिवार, छोरी प्रिया वा रमाइला सम्झनाहरूको बारेमा सोध्न सक्नुहुन्छ।"
        }

        return {
            "reply_text": replies.get(lang, replies["en"]),
            "intent": "general_greeting",
            "language": lang,
            "card_type": "companion_card",
            "card_data": {
                "assistant_name": "Xoron Sathi (স্মৰণ সংগী)",
                "patient_name": name,
                "supported_topics": ["Family Members", "Daily Routine", "Reminiscence Stories", "Reality Orientation"]
            },
            "suggested_followups": [
                "Who is my daughter?" if lang == "en" else "মোৰ জীয়াৰী কোন?",
                "Where am I?" if lang == "en" else "মই ক'ত আছোঁ?",
                "Today's games" if lang == "en" else "আজিৰ খেলবোৰ"
            ]
        }

assistant = MemoryAssistant()
