/**
 * XORON Reminders & Home-Screen Widget Controller
 * Features:
 *   - Reality Orientation & Spoken Routine Notifications
 *   - Zero-anxiety single tap "I Took It" acknowledgment
 *   - Android Home-Screen Widget Simulation (Slide 1 & 3)
 */

class RemindersManager {
  constructor() {
    this.reminders = [];
    this.activeReminder = null;
  }

  async loadReminders(patientId = 'pat-ner-001') {
    const fallbackReminders = [
      {
        id: "rem-001",
        title: "Morning Blood Pressure Tablet (Amlodipine)",
        category: "medicine",
        scheduled_time: "08:30",
        dosage_or_detail: "1 tablet (5mg) with warm water after morning jolpan",
        audio_prompt_en: "Good morning Aita! It is 8:30 AM. Time for your morning blood pressure tablet with warm water. Anjali has kept it ready on your table.",
        audio_prompt_as: "নমস্কাৰ আইতা! এতিয়া ৰাতিপুৱা ৮:৩০ বাজিছে। আপোনাৰ প্ৰেচাৰৰ ঔষধটো এগিলাচ কুহুমীয়া পানীৰে খোৱাৰ সময় হ'ল।"
      },
      {
        id: "rem-002",
        title: "Hydration & Warm Assam Lemongrass Tea",
        category: "hydration",
        scheduled_time: "11:00",
        dosage_or_detail: "1 cup of warm tea or 200ml water",
        audio_prompt_en: "Aita, it is 11:00 AM. Let's drink a warm cup of lemongrass tea together to stay fresh and hydrated.",
        audio_prompt_as: "আইতা, এতিয়া ১১:০০ বাজিছে। গাটো সতেজ ৰাখিবলৈ এগিলাচ কুহুমীয়া পানী বা চাহ খাই লওঁ আহক।"
      },
      {
        id: "rem-003",
        title: "Afternoon Memory Walk & Garden Visit",
        category: "routine",
        scheduled_time: "16:30",
        dosage_or_detail: "Gentle 15-minute stroll in the veranda with Anjali",
        audio_prompt_en: "Aita, the afternoon sun is gentle. Let's take our 15-minute walk in the veranda and look at the blooming orchids.",
        audio_prompt_as: "আইতা, আবেলি ৪:৩০ বাজিছে। আহক বাৰাণ্ডাত এপাক খোজ কাঢ়ি কপৌ ফুলবোৰ চাওঁগৈ।"
      },
      {
        id: "rem-004",
        title: "Night Calcium & Dinner Medicine",
        category: "medicine",
        scheduled_time: "20:30",
        dosage_or_detail: "1 Calcium tablet after light dinner of soft Joha rice",
        audio_prompt_en: "Good evening Aita. It is 8:30 PM. Time for your evening calcium tablet after your warm dinner.",
        audio_prompt_as: "শুভ সন্ধ্যা আইতা। ৰাতি ৮:৩০ বাজিছে। ভাত খাই কেলচিয়ামৰ টেবলেটটো খাই লওক।"
      }
    ];

    try {
      const resp = await fetch(`/api/reminders/${patientId}`);
      if (resp.ok) {
        this.reminders = await resp.json();
      } else {
        this.reminders = fallbackReminders;
      }
    } catch (e) {
      console.warn("Offline fallback for reminders", e);
      this.reminders = fallbackReminders;
    }
    this.renderRemindersSection();
    this.renderWidgetPreview();

  renderRemindersSection() {
    const container = document.getElementById('reminders-cards-container');
    if (!container) return;

    const lang = window.I18N ? window.I18N.currentLang : 'en';

    if (!this.reminders || this.reminders.length === 0) {
      container.innerHTML = `<div class="text-gray-500 text-sm">No reminders scheduled for today.</div>`;
      return;
    }

    let html = '';
    this.reminders.forEach((rem, idx) => {
      const isMedicine = rem.category === 'medicine';
      const prompt = rem[`audio_prompt_${lang}`] || rem.audio_prompt_en || rem.title;

      html += `
        <div class="reminder-item-card p-4 rounded-2xl bg-white border-2 border-amber-100 shadow-sm flex items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isMedicine ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}">
              ${isMedicine ? '💊' : (rem.category === 'hydration' ? '🍵' : '🚶‍♀️')}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black px-2 py-0.5 rounded bg-gray-100 text-gray-700">${rem.scheduled_time}</span>
                <h4 class="font-bold text-gray-800 text-base">${rem.title}</h4>
              </div>
              <p class="text-xs text-gray-600 mt-0.5">${rem.dosage_or_detail || ''}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <button onclick="window.reminders.triggerVoiceReminder(${idx})" class="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 transition">
              🔊
            </button>
            <button onclick="window.reminders.acknowledgeReminder('${rem.id}', ${idx})" class="btn-ack px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95">
              ✓ ${window.I18N ? window.I18N.t('btnAcknowledge') : 'I Took It'}
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  triggerVoiceReminder(index) {
    const rem = this.reminders[index];
    if (!rem) return;

    const lang = window.I18N ? window.I18N.currentLang : 'en';
    const spokenText = rem[`audio_prompt_${lang}`] || rem.audio_prompt_en || rem.title;

    if (window.speechEngine) {
      window.speechEngine.playGentleChime('reminder');
      setTimeout(() => {
        window.speechEngine.speak(spokenText);
      }, 600);
    }
  }

  async acknowledgeReminder(reminderId, index) {
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    if (window.speechEngine) {
      window.speechEngine.playGentleChime('success');
      const thankYou = lang === 'as' 
        ? "বৰ ধুনীয়া! আপুনি নিয়মমতে সময়ত ঔষধ গ্ৰহণ কৰিলে।" 
        : "Wonderful! You took your medication on time.";
      window.speechEngine.speak(thankYou);
    }

    try {
      await fetch(`/api/reminders/${reminderId}/ack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: 'pat-ner-001', status: 'taken' })
      });
    } catch (e) {
      console.warn("Offline: acknowledging reminder locally");
    }

    // Visual feedback
    const items = document.querySelectorAll('.reminder-item-card');
    if (items[index]) {
      items[index].classList.add('bg-emerald-50', 'border-emerald-300');
      const btn = items[index].querySelector('.btn-ack');
      if (btn) {
        btn.textContent = '✓ Taken';
        btn.classList.replace('bg-emerald-600', 'bg-gray-400');
        btn.disabled = true;
      }
    }
  }

  // --- Android Home-Screen Widget Simulator (Slide 1 & 3) ---
  renderWidgetPreview() {
    const widget = document.getElementById('homescreen-widget-preview');
    if (!widget) return;

    const lang = window.I18N ? window.I18N.currentLang : 'en';
    const nextRem = this.reminders[0] || { title: "Morning Tablet", scheduled_time: "08:30" };

    widget.innerHTML = `
      <div class="android-widget-card p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-lg text-gray-800">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">☀️</span>
            <span class="text-xs font-black tracking-wider uppercase text-amber-900">XORON WIDGET • 100% OFFLINE</span>
          </div>
          <span class="text-xs font-bold text-gray-500">Dispur, Guwahati</span>
        </div>

        <div class="text-2xl font-black text-amber-950 mb-1">
          ${lang === 'as' ? 'আজি মঙলবাৰ, ৮ ছেপ্টেম্বৰ' : 'Today is Tuesday, 8th Sep'}
        </div>
        <div class="text-xs text-amber-800 font-medium mb-4">
          ${lang === 'as' ? 'শান্ত ৰাতিপুৱা • কপৌ ফুলৰ দিন' : 'A peaceful morning in your hometown'}
        </div>

        <div class="p-3 bg-white rounded-2xl border border-amber-200 mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">💊</span>
            <div>
              <div class="text-xs font-bold text-gray-500">${lang === 'as' ? 'পৰৱৰ্তী নিয়ম' : 'Next Routine'} (${nextRem.scheduled_time})</div>
              <div class="font-bold text-sm text-gray-800">${nextRem.title}</div>
            </div>
          </div>
          <button onclick="window.reminders.triggerVoiceReminder(0)" class="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold">
            🔊 ${lang === 'as' ? 'শুনক' : 'Hear'}
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button onclick="window.games.startDailyGuidedSession()" class="btn-warm py-3 px-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm">
            <span>▶️</span> <span>${lang === 'as' ? 'খেল আৰম্ভ' : 'Start Games'}</span>
          </button>
          <button onclick="window.memoryChatbot.toggleChat(true)" class="py-3 px-3 rounded-2xl font-bold text-sm bg-white border-2 border-amber-300 hover:bg-amber-50 text-amber-950 flex items-center justify-center gap-2 shadow-sm">
            <span>🎙️</span> <span>${lang === 'as' ? 'সংগীক কওক' : 'Ask Sathi'}</span>
          </button>
        </div>
      </div>
    `;
  }
}

window.reminders = new RemindersManager();
