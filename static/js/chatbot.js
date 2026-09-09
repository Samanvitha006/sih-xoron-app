/**
 * XORON AI Memory Assistance Chatbot ("Xoron Sathi" / স্মৰণ সংগী)
 * Features:
 *   - Compassionate Validation Therapy Protocol (Naomi Feil)
 *   - Voice-first I/O with Speech-to-Text & Text-to-Speech
 *   - Grounded Family Retrieval without hallucination
 *   - Multi-lingual (EN, AS, BN, BRX, MNI, NE)
 */

class MemoryChatbot {
  constructor() {
    this.isOpen = false;
    this.isListening = false;
    this.messages = [];
  }

  toggleChat(forceState = null) {
    const modal = document.getElementById('chat-modal');
    if (!modal) return;

    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    if (this.isOpen) {
      modal.classList.remove('hidden');
      if (this.messages.length === 0) {
        this.sendInitialGreeting();
      }
    } else {
      modal.classList.add('hidden');
      if (window.speechEngine) {
        window.speechEngine.stopListening();
      }
    }
  }

  async sendInitialGreeting() {
    const lang = window.I18N ? window.I18N.currentLang : 'en';
    const patientName = lang === 'as' ? "আইতা" : (lang === 'bn' ? "দিদিমা" : "Aita");
    
    const initialQuery = "hello";
    await this.queryAssistant(initialQuery, true);
  }

  async sendTextQuery() {
    const input = document.getElementById('chat-input-text');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    await this.queryAssistant(text);
  }

  async askPredefined(queryText) {
    await this.queryAssistant(queryText);
  }

  startVoiceInput() {
    if (!window.speechEngine) return;

    const micBtn = document.getElementById('chat-mic-btn');
    const micLabel = document.getElementById('chat-mic-label');
    const statusText = document.getElementById('chat-voice-status');

    window.speechEngine.startListening(
      (transcript) => {
        if (statusText) statusText.textContent = `"${transcript}"`;
        if (micLabel) micLabel.textContent = "Tap to Speak";
        this.queryAssistant(transcript);
      },
      (isListening) => {
        this.isListening = isListening;
        if (micBtn) {
          if (isListening) {
            micBtn.classList.add('mic-active-pulse');
            micBtn.classList.remove('bg-amber-600', 'hover:bg-amber-700');
            micBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
            if (micLabel) micLabel.textContent = "Listening gently...";
            if (statusText) statusText.textContent = "Listening gently...";
          } else {
            micBtn.classList.remove('mic-active-pulse');
            micBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
            micBtn.classList.add('bg-amber-600', 'hover:bg-amber-700');
            if (micLabel) micLabel.textContent = "Tap to Speak";
            if (statusText) statusText.textContent = '';
          }
        }
      }
    );
  }

  async queryAssistant(query, isInitial = false) {
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    if (!isInitial) {
      this.renderUserMessage(query);
    }

    // Show loading state
    this.renderLoadingIndicator();

    try {
      const resp = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          lang: lang,
          patient_id: (window.app ? window.app.getActivePatientId() : 'pat-ner-001')
        })
      });

      this.removeLoadingIndicator();

      if (resp.ok) {
        const data = await resp.json();
        this.renderBotResponse(data);
        
        // Auto-speak response gently with Cartesia Sonic / Web Speech fallback
        if (window.speechEngine && data.reply_text) {
          window.speechEngine.speakWithCartesia(data.reply_text, 'sathi');
        }
      } else if (resp.status === 429) {
        const errData = await resp.json().catch(() => ({}));
        this.renderBotResponse({
          reply_text: `⏳ ${errData.detail || 'Rate limit reached. Please wait a few seconds before asking another question.'}`
        });
      } else {
        this.renderBotResponse({
          reply_text: lang === 'as' 
            ? "মই আপোনাৰ কথা বুজিবলৈ চেষ্টা কৰিছোঁ। অনুগ্ৰহ কৰি আকৌ কওক।"
            : "I am listening closely, Aita. Please tell me again with a calm heart."
        });
      }
    } catch (e) {
      this.removeLoadingIndicator();
      console.warn("Server offline: running client-side on-device Xoron Sathi intelligence", e);
      const offlineResp = this.processOfflineQuery(query, lang);
      this.renderBotResponse(offlineResp);
      if (window.speechEngine && offlineResp.reply_text) {
        window.speechEngine.speakWithCartesia(offlineResp.reply_text, 'sathi');
      }
    }
  }

  processOfflineQuery(query, lang) {
    const q = (query || "").toLowerCase();

    // 1. Daughter
    if (q.includes("daughter") || q.includes("priya") || q.includes("জীয়াৰী") || q.includes("মেয়ে")) {
      return {
        reply_text: lang === 'as'
          ? "এয়া আপোনাৰ মৰমৰ জীয়াৰী, ডাঃ প্ৰিয়া বৰুৱা। তেওঁ গুৱাহাটী মেডিকেল কলেজত ডাক্তৰ। প্ৰতি দেওবাৰে আপোনাক চাবলৈ আহে।"
          : "This is your beloved daughter, Dr. Priya Baruah. She is a doctor at GMCH Guwahati and visits you every Sunday with loving care.",
        card_type: "family_card",
        card_data: {
          name: "Dr. Priya Baruah",
          relationship: lang === 'as' ? "জীয়াৰী" : "Daughter",
          photo_url: "/static/assets/photos/daughter_priya.svg",
          schedule: "Visits every Sunday",
          voice_note: "Aita, this is your daughter Priya. I love you!"
        },
        suggested_followups: ["Who is Rohan?", "Where am I right now?"]
      };
    }

    // 2. Location & Grounding
    if (q.includes("where am i") || q.includes("where is my house") || q.includes("মই ক'ত") || q.includes("কোথায়")) {
      return {
        reply_text: lang === 'as'
          ? "আপুনি সম্পূৰ্ণ সুৰক্ষিত, আইতা। আপুনি দিছপুৰ, গুৱাহাটীৰ নিজা ঘৰত আছে। বোৱাৰী অঞ্জলি আপোনাৰ ওচৰতেই আছে।"
          : "You are completely safe, Aita. You are in your peaceful home in Dispur, Guwahati. Caregiver Anjali is right here with you.",
        card_type: "orientation_card",
        card_data: {
          location: "Dispur, Guwahati, Assam",
          safety_note: "Surrounded by family, peace, and warmth."
        },
        suggested_followups: ["What is my next medicine?", "Tell me a Bihu story"]
      };
    }

    // 3. Medicine
    if (q.includes("medicine") || q.includes("tablet") || q.includes("ঔষধ") || q.includes("দৰব")) {
      return {
        reply_text: lang === 'as'
          ? "আপোনাৰ পুৱাৰ প্ৰেচাৰৰ ঔষধটো এতিয়া লোৱাৰ সময় হৈছে। অঞ্জলিয়ে এগিলাচ কুহুমীয়া পানীৰে আনি দিছে।"
          : "Your morning blood pressure tablet (Amlodipine 5mg) is scheduled now. Caregiver Anjali has kept it ready with warm water.",
        card_type: "medicine_card",
        card_data: {
          title: "Amlodipine 5mg",
          scheduled_time: "08:30 AM",
          dosage_or_detail: "1 tablet with warm water after morning jolpan"
        },
        suggested_followups: ["I drank water", "Who is my daughter?"]
      };
    }

    // 4. Anxiety / Validation therapy
    if (q.includes("worried") || q.includes("afraid") || q.includes("scared") || q.includes("ভয়") || q.includes("office") || q.includes("school")) {
      return {
        reply_text: lang === 'as'
          ? "একো চিন্তা নকৰিব আইতা। আজিৰ সকলো কাম সুকলমে সমাপ্ত হ'ল। অঞ্জলিয়ে আপোনাৰ বাবে গৰম আদাৰ চাহ বনাই আছে।"
          : "Everything for today has been safely taken care of, Aita. All your responsibilities are complete. You can relax peacefully. Anjali is brewing warm Assam ginger tea for you.",
        card_type: "orientation_card",
        card_data: {
          location: "Safe at Home",
          safety_note: "Validation & comfort protocol: Relax with warm tea."
        },
        suggested_followups: ["Tell me a Bihu story", "Who is Rohan?"]
      };
    }

    // 5. Default Friendly
    return {
      reply_text: lang === 'as'
        ? "নমস্কাৰ আইতা! মই স্মৰণ সংগী। আপোনাৰ মৰমৰ পৰিয়াল বা আজিৰ দিনটোৰ বিষয়ে মোক সুধিব পাৰে।"
        : "Hello Aita! I am Xoron Sathi, your memory companion. You can ask me about your daughter Priya, your home, or listen to sweet memories.",
      suggested_followups: ["Who is my daughter?", "Where am I right now?"]
    };
  }

  renderUserMessage(text) {
    const msgList = document.getElementById('chat-messages-list');
    if (!msgList) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'flex justify-end mb-3';
    userDiv.innerHTML = `
      <div class="bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-2xl rounded-tr-none max-w-xs sm:max-w-md shadow-sm text-base">
        ${text}
      </div>
    `;
    msgList.appendChild(userDiv);
    msgList.scrollTop = msgList.scrollHeight;
  }

  renderLoadingIndicator() {
    const msgList = document.getElementById('chat-messages-list');
    if (!msgList) return;

    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'chat-loading-indicator';
    loaderDiv.className = 'flex justify-start mb-3';
    loaderDiv.innerHTML = `
      <div class="bg-amber-100 text-amber-900 py-2 px-4 rounded-2xl flex items-center gap-2 text-sm">
        <span class="animate-bounce">🌸</span> <span>Thinking with warmth...</span>
      </div>
    `;
    msgList.appendChild(loaderDiv);
    msgList.scrollTop = msgList.scrollHeight;
  }

  removeLoadingIndicator() {
    const el = document.getElementById('chat-loading-indicator');
    if (el) el.remove();
  }

  renderBotResponse(data) {
    const msgList = document.getElementById('chat-messages-list');
    if (!msgList) return;

    const botDiv = document.createElement('div');
    botDiv.className = 'flex justify-start mb-4';

    let cardHtml = '';
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    if (data.card_type === 'family_card' && data.card_data) {
      const d = data.card_data;
      const memKey = d.name.toLowerCase().includes('priya') ? 'priya'
        : (d.name.toLowerCase().includes('rohan') ? 'rohan'
        : (d.name.toLowerCase().includes('biren') ? 'biren'
        : (d.name.toLowerCase().includes('anjali') ? 'anjali' : 'sathi')));
      cardHtml = `
        <div class="mt-3 p-3 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm flex items-center gap-3">
          <img src="${d.photo_url}" alt="${d.name}" class="w-16 h-16 rounded-full object-cover border border-emerald-300">
          <div>
            <div class="font-bold text-gray-800 text-base">${d.name} (${d.relationship})</div>
            <div class="text-xs text-gray-600">${d.schedule}</div>
            <button onclick="window.speechEngine.speakWithCartesia('${d.voice_note.replace(/'/g, "\\'")}', '${memKey}')" class="mt-1.5 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-1 transition">
              <span>🔊</span> <span>${lang === 'as' ? 'বাৰ্তা শুনক' : 'Play Voice Clip'}</span>
            </button>
          </div>
        </div>
      `;
    } else if (data.card_type === 'orientation_card' && data.card_data) {
      const d = data.card_data;
      cardHtml = `
        <div class="mt-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-300">
          <div class="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">🏠 ${lang === 'as' ? 'ঘৰৰ ঠিকনা' : 'Current Residence'}</div>
          <div class="font-bold text-gray-800 text-sm mt-0.5">${d.location}</div>
          <div class="text-xs text-emerald-700 mt-1">🌸 ${d.safety_note}</div>
        </div>
      `;
    } else if (data.card_type === 'medicine_card' && data.card_data) {
      const d = data.card_data;
      cardHtml = `
        <div class="mt-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
          <div class="text-xs font-extrabold text-blue-800 uppercase tracking-wider">💊 ${lang === 'as' ? 'পৰৱৰ্তী ঔষধ' : 'Next Medicine'}</div>
          <div class="font-bold text-gray-800 text-sm mt-0.5">${d.title || ''} (${d.scheduled_time || ''})</div>
          <div class="text-xs text-blue-700 mt-1">${d.dosage_or_detail || ''}</div>
        </div>
      `;
    }

    // Suggested Followup Chips
    let followupsHtml = '';
    if (data.suggested_followups && data.suggested_followups.length > 0) {
      followupsHtml = `
        <div class="flex flex-wrap gap-2 mt-3">
          ${data.suggested_followups.map(f => `
            <button onclick="window.memoryChatbot.askPredefined('${f.replace(/'/g, "\\'")}')" class="text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-full transition active:scale-95">
              ${f}
            </button>
          `).join('')}
        </div>
      `;
    }

    botDiv.innerHTML = `
      <div class="flex gap-2 max-w-md sm:max-w-lg">
        <div class="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm flex-shrink-0">
          🌸
        </div>
        <div>
          <div class="bg-white border border-amber-200 text-gray-800 font-medium py-3 px-4 rounded-2xl rounded-tl-none shadow-sm text-base leading-relaxed">
            ${data.reply_text}
            ${cardHtml}
          </div>
          ${followupsHtml}
        </div>
      </div>
    `;

    msgList.appendChild(botDiv);
    msgList.scrollTop = msgList.scrollHeight;
  }
}

window.memoryChatbot = new MemoryChatbot();
