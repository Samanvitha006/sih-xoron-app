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
        title: "Morning Jolpan & Warm Milk",
        category: "nutrition",
        scheduled_time: "07:30",
        dosage_or_detail: "Soft flattened rice (Chira) with warm milk and jaggery",
        audio_prompt_en: "Good morning Aita! It is 7:30 AM. Time for your soothing morning jolpan and warm milk.",
        audio_prompt_as: "নমস্কাৰ আইতা! এতিয়া ৰাতিপুৱা ৭:৩০ বাজিছে। আপোনাৰ পুৱাৰ কোমল জলপান আৰু কুহুমীয়া গাখীৰ খোৱাৰ সময় হ'ল।"
      },
      {
        id: "rem-002",
        title: "Morning Blood Pressure Tablet (Amlodipine)",
        category: "medicine",
        scheduled_time: "08:30",
        dosage_or_detail: "1 tablet (5mg) with warm water after morning jolpan",
        audio_prompt_en: "Good morning Aita! It is 8:30 AM. Time for your morning blood pressure tablet with warm water. Anjali has kept it ready on your table.",
        audio_prompt_as: "নমস্কাৰ আইতা! এতিয়া ৰাতিপুৱা ৮:৩০ বাজিছে। আপোনাৰ প্ৰেচাৰৰ ঔষধটো এগিলাচ কুহুমীয়া পানীৰে খোৱাৰ সময় হ'ল।"
      },
      {
        id: "rem-003",
        title: "Hydration & Warm Assam Lemongrass Tea",
        category: "hydration",
        scheduled_time: "10:30",
        dosage_or_detail: "1 cup of fragrant lemongrass tea with holy basil",
        audio_prompt_en: "Aita, it is 10:30 AM. Let's drink a warm cup of lemongrass tea together to stay fresh and hydrated.",
        audio_prompt_as: "আইতা, এতিয়া ১০:৩০ বাজিছে। গাটো সতেজ ৰাখিবলৈ এগিলাচ কুহুমীয়া তুলসী-নেমুঘাঁহৰ চাহ খাই লওঁ আহক।"
      },
      {
        id: "rem-004",
        title: "Nutritious Midday Lunch & Multivitamin",
        category: "medicine",
        scheduled_time: "12:30",
        dosage_or_detail: "Soft Joha rice with Masor Tenga & 1 Multivitamin tablet",
        audio_prompt_en: "Aita, it is 12:30 PM. Anjali has served warm Joha rice and light fish curry, followed by your multivitamin.",
        audio_prompt_as: "আইতা, দুপৰীয়া ১২:৩০ বাজিছে। অঞ্জলিয়ে গৰম জহা চাউলৰ ভাত আৰু টেঙা মাছৰ আঞ্জা বাঢ়িছে, খোৱাৰ পিছত ভিটামিন টেবলেটটো ল'ব।"
      },
      {
        id: "rem-005",
        title: "Post-Lunch Rest & Soothing Flute Music",
        category: "routine",
        scheduled_time: "14:30",
        dosage_or_detail: "Relaxing 45-minute afternoon nap with gentle bamboo melodies",
        audio_prompt_en: "Aita, the afternoon is peaceful. Let's rest comfortably while listening to gentle flute melodies.",
        audio_prompt_as: "আইতা, এতিয়া দুপৰীয়া ২:৩০ বাজিছে। গাৰু লৈ বিছনাত অলপ জিৰণি লওক, বাঁহীৰ সুমধুৰ সুৰ বাজি আছে।"
      },
      {
        id: "rem-006",
        title: "Afternoon Veranda Walk & Kopou Orchid Viewing",
        category: "routine",
        scheduled_time: "16:30",
        dosage_or_detail: "Gentle 15-minute stroll in the veranda with caregiver Anjali",
        audio_prompt_en: "Aita, the afternoon sun is gentle. Let's take our 15-minute walk in the veranda and look at the blooming orchids.",
        audio_prompt_as: "আইতা, আবেলি ৪:৩০ বাজিছে। আহক বাৰাণ্ডাত এপাক খোজ কাঢ়ি কপৌ ফুলবোৰ চাওঁগৈ।"
      },
      {
        id: "rem-007",
        title: "Family Phone Call with Daughter Dr. Priya",
        category: "routine",
        scheduled_time: "17:30",
        dosage_or_detail: "Daily voice check-in with Dr. Priya from GMCH",
        audio_prompt_en: "Aita, it is 5:30 PM! Dr. Priya is calling from GMCH to ask about your day and share her warm love.",
        audio_prompt_as: "আইতা, আবেলি ৫:৩০ বাজিছে! চিকিৎসালয়ৰ পৰা আপোনাৰ মৰমৰ জীয়াৰী প্ৰিয়াই ফোন কৰিছে, কথা পাতক আহক।"
      },
      {
        id: "rem-008",
        title: "Evening Sandhya Diya & Devotional Borgeet",
        category: "routine",
        scheduled_time: "19:00",
        dosage_or_detail: "Lighting earthen lamp at the Tulsi altar and listening to Borgeet",
        audio_prompt_en: "Aita, dusk has arrived at 7:00 PM. Anjali is lighting the holy evening diya while Borgeet plays softly.",
        audio_prompt_as: "আইতা, গধূলি ৭:০০ বাজিছে। তুলসী তলত চাকি জ্বলোৱাৰ সময় হ'ল, বৰগীতৰ সুৰে ঘৰখন শান্ত কৰি তুলিছে।"
      },
      {
        id: "rem-009",
        title: "Dinner & Evening Calcium / Memory Care Tablet",
        category: "medicine",
        scheduled_time: "20:30",
        dosage_or_detail: "1 Calcium tablet & Donepezil after light warm dinner",
        audio_prompt_en: "Good evening Aita. It is 8:30 PM. Time for your evening calcium and memory care tablet after warm dinner.",
        audio_prompt_as: "শুভ সন্ধ্যা আইতা। ৰাতি ৮:৩০ বাজিছে। ভাত খাই কেলচিয়াম আৰু স্মৃতি যত্নৰ টেবলেটটো খাই লওক।"
      },
      {
        id: "rem-010",
        title: "Bedtime Warm Water & Reassurance with Anjali",
        category: "hydration",
        scheduled_time: "21:30",
        dosage_or_detail: "Warm glass of water and calming bedtime reassurance",
        audio_prompt_en: "Aita, it is 9:30 PM. Drink a soothing sip of warm water. You are safe at home and Anjali is right here with you.",
        audio_prompt_as: "আইতা, ৰাতি ৯:৩০ বাজিছে। এগিলাচ কুহুমীয়া পানী খাই লওক। আপুনি আপোনাৰ ঘৰত সম্পূৰ্ণ সুৰক্ষিত, অঞ্জলি আপোনাৰ কাষতেই আছে।"
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

    const live = window.I18N ? window.I18N.getRealTimeOrientation(lang) : null;
    const dayHeadline = live 
      ? (lang === 'as' ? `আজি ${live.dayName}, ${live.regionalDate} ${live.monthName}` : (lang === 'bn' ? `আজ ${live.dayName}, ${live.regionalDate} ${live.monthName}` : `Today is ${live.dayName}, ${live.dateNum}th Sep`))
      : (lang === 'as' ? 'আজি বুধবাৰ, ৯ ছেপ্টেম্বৰ' : 'Today is Wednesday, 9th Sep');
    const daySub = live 
      ? (lang === 'as' ? `${live.timePeriodText} • কপৌ ফুলৰ দিন` : (lang === 'bn' ? `${live.timePeriodText} • মনোরম পরিবেশ` : `${live.timePeriodText} in your hometown`))
      : (lang === 'as' ? 'শান্ত ৰাতিপুৱা • কপৌ ফুলৰ দিন' : 'A peaceful morning in your hometown');

    widget.innerHTML = `
      <div class="android-widget-card p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-lg text-gray-800">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">${live ? live.periodIcon : '☀️'}</span>
            <span class="text-xs font-black tracking-wider uppercase text-amber-900">XORON WIDGET • 100% OFFLINE</span>
          </div>
          <span class="text-xs font-bold text-gray-500">Dispur, Guwahati</span>
        </div>

        <div class="text-2xl font-black text-amber-950 mb-1">
          ${dayHeadline}
        </div>
        <div class="text-xs text-amber-800 font-medium mb-4">
          ${daySub}
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
