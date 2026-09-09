/**
 * XORON Family Reminiscence Therapy ("Aamar Kahini" / আমাৰ কাহিনী)
 * Centered on Cochrane Review (Woods et al. 2018) Evidence:
 *   - Personal family photos, authentic family voice notes & local cultural milestones
 *   - "Who is This?" Spaced Retrieval loop
 *   - Narrative story timeline with multi-sensory audio accompaniment
 */

class ReminiscenceTherapy {
  constructor() {
    this.familyMembers = [];
    this.stories = [];
    this.currentMemberIndex = 0;
  }

  async loadData(patientId = 'pat-ner-001') {
    const fallbackMembers = [
      {
        id: "mem-001",
        name: "Dr. Priya Baruah",
        relationship: "Daughter",
        relationship_as: "জীয়াৰী (Priya)",
        relationship_bn: "মেয়ে (Priya)",
        photo_url: "/static/assets/photos/daughter_priya.svg",
        voice_note_text: "Aita, this is your daughter Priya. I am a doctor at GMCH Guwahati. Remember when we made sweet narikol laru together? I love you!",
        location: "Guwahati (GMCH Quarters)",
        visit_schedule: "Visits every Sunday and calls daily at 7 PM",
        shared_memory: "She graduated from Gauhati Medical College. Aita stitched her first white apron."
      },
      {
        id: "mem-002",
        name: "Rohan Baruah",
        relationship: "Grandson",
        relationship_as: "নাতি ল'ৰা (Rohan)",
        relationship_bn: "নাতি (Rohan)",
        photo_url: "/static/assets/photos/grandson_rohan.svg",
        voice_note_text: "Aita! I am Rohan. I study engineering in Jorhat. Every vacation I come home to eat your special duck curry with black sesame!",
        location: "Jorhat / Guwahati",
        visit_schedule: "Lives in home hostel, comes home every weekend",
        shared_memory: "Always sits beside Aita in the veranda drinking tea."
      },
      {
        id: "mem-003",
        name: "Late Biren Baruah",
        relationship: "Husband (Late)",
        relationship_as: "স্বামী (স্বৰ্গীয় বীৰেন)",
        relationship_bn: "স্বামী (স্বর্গীয় বীরেন)",
        photo_url: "/static/assets/photos/husband_biren.svg",
        voice_note_text: "Your loving husband Biren. You both built your beautiful wooden veranda house in Tezpur in 1968.",
        location: "Tezpur / Dispur",
        visit_schedule: "Cherished Memory",
        shared_memory: "He was a school headmaster who played the Tokari string instrument."
      },
      {
        id: "mem-004",
        name: "Anjali Baruah",
        relationship: "Caregiver & Daughter-in-law",
        relationship_as: "বোৱাৰী (Anjali)",
        relationship_bn: "বউমা (Anjali)",
        photo_url: "/static/assets/photos/caregiver_anjali.svg",
        voice_note_text: "Aita, I am Anjali! I am here in the kitchen making your warm ginger tea.",
        location: "Dispur, Guwahati (Lives with Aita)",
        visit_schedule: "Present at home all day",
        shared_memory: "Prepares Aita's favorite soft Joha rice with lemon."
      }
    ];

    const fallbackStories = [
      {
        id: "story-001",
        title: "The Grand Rongali Bihu of 1974",
        title_as: "১৯৭৪ চনৰ ৰঙালী বিহু",
        year_or_era: "1974",
        category: "Festival",
        narrative: "You wore your grandmother's woven Muga silk Mekhela Sador with red Pari border. Everyone danced to the sweet Pepa and Dhol beats under the big mango tree.",
        narrative_as: "আপুনি ৰঙা পাৰিৰ মুগাৰ মেখেলা চাদৰ পিন্ধিছিল। চোতালৰ বৰ আমজোপাৰ তলত সকলোৱে পেঁপা আৰু ঢোলৰ মাতত আনন্দ মনেৰে বিহু নাচিছিল।",
        photo_url: "/static/assets/photos/bihu_memory.svg",
        cultural_soundtrack: "Pepa and Dhol melody"
      },
      {
        id: "story-002",
        title: "Planting the Tea Garden in Sonitpur",
        title_as: "তেজপুৰৰ চাহ বাগিচা আৰু সেউজীয়া স্মৃতি",
        year_or_era: "1968",
        category: "Village Life",
        narrative: "You and Biren planted fresh gardenia bushes and three rows of tender tea bushes behind your Tezpur cottage. The smell of afternoon rain on dry Assam soil was unforgettable.",
        narrative_as: "তেজপুৰৰ ঘৰৰ পিছফালে আপুনি আৰু দেউতাই তগৰ ফুল আৰু চাহ গছপুলি ৰুইছিল। বৰষুণৰ পিছত মাটিৰ সুবাস মনত পৰে নে?",
        photo_url: "/static/assets/photos/tea_memory.svg",
        cultural_soundtrack: "Brahmaputra breeze and bamboo flute"
      },
      {
        id: "story-003",
        title: "Dr. Priya's Graduation Day",
        title_as: "জীয়াৰী প্ৰিয়াৰ ডাক্তৰী ডিগ্ৰী লাভৰ দিন",
        year_or_era: "2002",
        category: "Children",
        narrative: "When Priya received her MBBS gold medal, you tied a hand-woven Gamusa around her neck with tears of joy. She dedicated her stethoscope to you.",
        narrative_as: "প্ৰিয়াই যেতিয়া গুৱাহাটী চিকিৎসা মহাবিদ্যালয়ৰ পৰা ডিগ্ৰী লৈছিল, আপুনি আনন্দৰ চকুপানীৰে ফুলাম গামোচা পিন্ধাই আশীৰ্বাদ দিছিল।",
        photo_url: "/static/assets/photos/graduation_memory.svg",
        cultural_soundtrack: "Acoustic harp and gentle chimes"
      }
    ];

    try {
      const [mResp, sResp] = await Promise.all([
        fetch(`/api/memory-bank/${patientId}`),
        fetch(`/api/stories/${patientId}`)
      ]);
      if (mResp.ok) this.familyMembers = await mResp.json();
      else this.familyMembers = fallbackMembers;

      if (sResp.ok) this.stories = await sResp.json();
      else this.stories = fallbackStories;
    } catch (e) {
      console.warn("Using offline fallback reminiscence data", e);
      this.familyMembers = fallbackMembers;
      this.stories = fallbackStories;
    }
  }

  renderStoryVault(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!this.stories || this.stories.length === 0) {
      container.innerHTML = `<div class="p-6 text-center text-gray-500">Loading cherished memories...</div>`;
      return;
    }

    const lang = window.I18N ? window.I18N.currentLang : 'en';

    let html = `
      <div class="reminiscence-header mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 class="text-2xl font-bold text-amber-900 flex items-center gap-2">
              <span class="text-3xl">🌸</span> ${window.I18N ? window.I18N.t('reminiscenceTitle') : 'Our Story - Family Reminiscence Vault'}
            </h2>
            <p class="text-amber-800 text-sm mt-1">
              ${window.I18N ? window.I18N.t('reminiscenceSubtitle') : 'Cherished memories, family voices, and timeless moments'}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.reminiscence.startWhoIsThisGame()" class="btn-warm px-5 py-3 rounded-2xl font-bold flex items-center gap-2 text-base shadow-sm">
              <span>🖼️</span> <span>${window.I18N ? window.I18N.t('btnWhoIsThis') : 'Who is This?'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Family Members Quick Access Ribbons -->
      <div class="mb-8">
        <h3 class="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span>👨‍👩‍👧‍👦</span> <span>${lang === 'as' ? 'আপোনাৰ মৰমৰ পৰিয়াল' : (lang === 'bn' ? 'আপনার প্রিয় পরিবার' : 'Your Loving Family Members')}</span>
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    `;

    this.familyMembers.forEach((member, idx) => {
      const rel = member[`relationship_${lang}`] || member.relationship;
      html += `
        <div onclick="window.reminiscence.playMemberVoice(${idx})" class="family-card p-3 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-400 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-amber-200 bg-amber-50">
            <img src="${member.photo_url}" alt="${member.name}" class="w-full h-full object-cover">
          </div>
          <div class="font-bold text-gray-800 text-base leading-snug">${member.name}</div>
          <div class="text-xs font-semibold text-emerald-700 mt-0.5">${rel}</div>
          <div class="mt-2 text-xs text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
            <span>🔊</span> <span>${lang === 'as' ? 'মাত শুনক' : (lang === 'bn' ? 'কথা শুনুন' : 'Hear Voice')}</span>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>

      <!-- Reminiscence Story Timelines -->
      <div>
        <h3 class="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span>📖</span> <span>${lang === 'as' ? 'আমাৰ জীৱনৰ সোণালী স্মৃতি' : (lang === 'bn' ? 'জীবনের সোনালী স্মৃতি' : 'Golden Milestones & Story Timeline')}</span>
        </h3>
        <div class="space-y-6">
    `;

    this.stories.forEach((story, idx) => {
      const title = (lang === 'as' && story.title_as) ? story.title_as : story.title;
      const narrative = (lang === 'as' && story.narrative_as) ? story.narrative_as : story.narrative;

      html += `
        <div class="story-card bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center">
          <div class="w-full md:w-56 h-44 rounded-2xl overflow-hidden flex-shrink-0 bg-amber-50 border border-amber-200">
            <img src="${story.photo_url}" alt="${title}" class="w-full h-full object-cover">
          </div>
          <div class="flex-grow">
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full">${story.year_or_era}</span>
              <span class="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">${story.category}</span>
            </div>
            <h4 class="text-xl font-bold text-gray-800 mt-1 mb-2">${title}</h4>
            <p class="text-gray-700 text-base leading-relaxed mb-4">${narrative}</p>
            
            <div class="flex flex-wrap items-center gap-3">
              <button onclick="window.reminiscence.narrateStory(${idx})" class="btn-voice-pill px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition">
                <span>🔊</span> <span>${lang === 'as' ? 'গল্পটো শুনক' : (lang === 'bn' ? 'গল্পটি শুনুন' : 'Narrate Story')}</span>
              </button>
              <div class="text-xs text-gray-500 italic flex items-center gap-1">
                <span>🎵</span> ${story.cultural_soundtrack}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  playMemberVoice(index) {
    const member = this.familyMembers[index];
    if (!member) return;

    const lang = window.I18N ? window.I18N.currentLang : 'en';
    const rel = member[`relationship_${lang}`] || member.relationship;

    // Trigger gentle chime, then speak authentic family voice note
    if (window.speechEngine) {
      window.speechEngine.playGentleChime('success');
      const announcement = lang === 'as'
        ? `এয়া আপোনাৰ মৰমৰ ${rel}, ${member.name}। ${member.voice_note_text}`
        : `This is your loving ${rel}, ${member.name}. ${member.voice_note_text}`;
      
      const memberKey = member.name.toLowerCase().includes('priya') ? 'priya'
        : (member.name.toLowerCase().includes('rohan') ? 'rohan'
        : (member.name.toLowerCase().includes('biren') ? 'biren'
        : (member.name.toLowerCase().includes('anjali') ? 'anjali' : null)));

      setTimeout(() => {
        window.speechEngine.speakWithCartesia(announcement, memberKey);
      }, 400);
    }
  }

  narrateStory(index) {
    const story = this.stories[index];
    if (!story) return;

    const lang = window.I18N ? window.I18N.currentLang : 'en';
    const textToSpeak = (lang === 'as' && story.narrative_as) ? story.narrative_as : story.narrative;

    if (window.speechEngine) {
      window.speechEngine.playGentleChime('hint');
      setTimeout(() => {
        window.speechEngine.speakWithCartesia(textToSpeak, 'sathi');
      }, 500);
    }
  }

  // --- "Who is This?" Living Memory Game (Slide 2) ---
  startWhoIsThisGame() {
    if (!this.familyMembers || this.familyMembers.length === 0) return;

    this.currentMemberIndex = 0;
    this.presentWhoIsThisTrial();
  }

  presentWhoIsThisTrial() {
    const member = this.familyMembers[this.currentMemberIndex];
    if (!member) {
      // Completed all members
      if (window.adaptiveEngine) {
        window.adaptiveEngine.saveSession('game-01', 'Who is This?', 'Memory', 1.0, 3100, 0);
      }
      alert(window.I18N ? window.I18N.t('feedbackComplete') : "Wonderful! You recognized your loving family members.");
      return;
    }

    const modal = document.getElementById('game-modal');
    const modalContent = document.getElementById('game-modal-content');
    if (!modal || !modalContent) return;

    const lang = window.I18N ? window.I18N.currentLang : 'en';
    const correctRel = member[`relationship_${lang}`] || member.relationship;

    // Generate 2 distractors from other members
    const otherMembers = this.familyMembers.filter((_, i) => i !== this.currentMemberIndex);
    const distractor1 = otherMembers[0] ? (otherMembers[0][`relationship_${lang}`] || otherMembers[0].relationship) : (lang === 'as' ? "ভতিজা" : "Nephew");
    const distractor2 = otherMembers[1] ? (otherMembers[1][`relationship_${lang}`] || otherMembers[1].relationship) : (lang === 'as' ? "বান্ধৱী" : "Friend");

    const options = [
      { text: `${member.name} (${correctRel})`, isCorrect: true },
      { text: distractor1, isCorrect: false }
    ];
    if (options.length === 2 && distractor2) {
      options.push({ text: distractor2, isCorrect: false });
    }
    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    modalContent.innerHTML = `
      <div class="text-center p-4 max-w-xl mx-auto">
        <div class="inline-block bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full mb-3">
          ${lang === 'as' ? 'কোনে এইজন? • পাৰিবাৰিক মুখ চিনি পোৱা' : 'Who is This? • Family Memory Recall'}
        </div>
        
        <div class="relative w-48 h-48 mx-auto my-3 rounded-3xl overflow-hidden border-4 border-amber-300 shadow-md bg-amber-50">
          <img src="${member.photo_url}" alt="${member.name}" class="w-full h-full object-cover">
        </div>

        <h3 id="whoisthis-prompt" class="text-xl font-bold text-gray-800 my-3">
          ${lang === 'as' ? 'এই চিনাকি হাঁহিটি কাৰ চিনি পাইছেনে?' : 'Do you recognize this warm, familiar face?'}
        </h3>

        <div id="whoisthis-options" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          ${options.map((opt, i) => `
            <button id="who-opt-${i}" data-correct="${opt.isCorrect}" onclick="window.reminiscence.handleWhoAnswer(${opt.isCorrect}, '#who-opt-${i}')"
              class="game-opt-btn py-4 px-5 rounded-2xl text-lg font-bold border-2 border-amber-200 bg-white hover:bg-amber-50 text-gray-800 shadow-sm transition active:scale-95">
              ${opt.text}
            </button>
          `).join('')}
        </div>

        <div class="mt-6 flex items-center justify-between">
          <button onclick="window.reminiscence.speakWhoPrompt()" class="btn-voice-pill px-4 py-2 rounded-xl text-sm font-bold bg-amber-100 text-amber-900 flex items-center gap-2">
            <span>🔊</span> <span>${lang === 'as' ? 'কথাৰে শুনক' : 'Hear Voice Hint'}</span>
          </button>
          <button onclick="document.getElementById('game-modal').classList.add('hidden')" class="text-gray-500 hover:text-gray-700 text-sm font-semibold">
            ${lang === 'as' ? 'বন্ধ কৰক' : 'Close'}
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    // Start Errorless Learning cue tracking
    const correctBtnIndex = options.findIndex(o => o.isCorrect);
    const spokenHint = lang === 'as' 
      ? `এয়া আপোনাৰ মৰমৰ ${correctRel}, ${member.name}।`
      : `This is your beloved ${correctRel}, ${member.name}.`;

    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial(
        member.name,
        `#who-opt-${correctBtnIndex}`,
        spokenHint,
        (cueLevel) => {
          const promptEl = document.getElementById('whoisthis-prompt');
          if (promptEl && cueLevel === 1) {
            promptEl.innerHTML = `<span class="text-amber-800 font-bold">${spokenHint}</span>`;
          }
        }
      );
    }
  }

  handleWhoAnswer(isCorrect, elementSelector) {
    const member = this.familyMembers[this.currentMemberIndex];
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    if (isCorrect) {
      if (window.adaptiveEngine) {
        window.adaptiveEngine.recordTrialAnswer(true, elementSelector);
      }
      if (window.speechEngine) {
        window.speechEngine.playGentleChime('success');
      }

      const el = document.querySelector(elementSelector);
      if (el) {
        el.classList.add('bg-emerald-100', 'border-emerald-400', 'text-emerald-950');
      }

      // Play family member's loving voice note
      setTimeout(() => {
        if (window.speechEngine) {
          const congrats = lang === 'as' 
            ? `বৰ ধুনীয়া! এয়া আপোনাৰ ${member.name}। শুনাচোন কি কৈছে: "${member.voice_note_text}"`
            : `Wonderful! This is your ${member.name}. Listen to her message: "${member.voice_note_text}"`;
          window.speechEngine.speak(congrats, null, () => {
            this.currentMemberIndex++;
            setTimeout(() => this.presentWhoIsThisTrial(), 1500);
          });
        }
      }, 400);

    } else {
      // Errorless Learning: Zero buzzers! Gently highlight the right choice
      if (window.speechEngine) {
        window.speechEngine.playGentleChime('hint');
      }
      const allBtns = document.querySelectorAll('#whoisthis-options button');
      allBtns.forEach(btn => {
        if (btn.getAttribute('data-correct') === 'true') {
          btn.classList.add('cue-pulse-target', 'bg-amber-100');
        }
      });
      const promptEl = document.getElementById('whoisthis-prompt');
      if (promptEl) {
        promptEl.textContent = lang === 'as' 
          ? `একো চিন্তা নাই, আহক এইটো মন কৰোঁ: এয়া আপোনাৰ ${member.name}।`
          : `Let's look together: This is your ${member.name}. Tap here!`;
      }
    }
  }

  speakWhoPrompt() {
    const member = this.familyMembers[this.currentMemberIndex];
    if (!member) return;
    const lang = window.I18N ? window.I18N.currentLang : 'en';
    const rel = member[`relationship_${lang}`] || member.relationship;
    const text = lang === 'as' 
      ? `এই ফটোখন ভালকৈ চাওক। এয়া আপোনাৰ ${rel}।`
      : `Look gently at this photo. This is your loving ${rel}.`;
    if (window.speechEngine) {
      window.speechEngine.speak(text);
    }
  }
}

window.reminiscence = new ReminiscenceTherapy();
