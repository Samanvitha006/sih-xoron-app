/**
 * XORON 11 Culturally Tailored Adaptive Cognitive Games
 * Rooted in North Eastern Heritage, Textiles, Sounds, and Daily Routine.
 * Errorless Learning Principles (Zero Buzzers, Progressive Cue-Fading).
 */

class CognitiveGamesSuite {
  constructor() {
    this.activeGameId = null;
  }

  openGame(gameId) {
    this.activeGameId = gameId;
    switch (gameId) {
      case 'game-01':
        window.reminiscence.startWhoIsThisGame();
        break;
      case 'game-02':
        // Reminiscence story vault
        window.app.switchTab('reminiscence');
        break;
      case 'game-03':
        this.startTodayIsGame();
        break;
      case 'game-04':
        this.startPatternMatchGame();
        break;
      case 'game-05':
        this.startSoundsOfHomeGame();
        break;
      case 'game-06':
        this.startMarketBasketGame();
        break;
      case 'game-07':
        this.startFestivalSequenceGame();
        break;
      case 'game-08':
        this.startRoutineSortingGame();
        break;
      case 'game-09':
        this.startShadowUtensilGame();
        break;
      case 'game-10':
        this.startLyricCompletionGame();
        break;
      case 'game-11':
        this.startFlowerTapGame();
        break;
      default:
        console.warn("Unknown game:", gameId);
    }
  }

  // --- Game 3: "Today is..." Real-Time Reality Orientation ---
  startTodayIsGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const diffCfg = window.adaptiveEngine ? window.adaptiveEngine.getDifficultyConfig() : { choiceCount: 2 };
    const numChoices = Math.min(4, Math.max(2, diffCfg.choiceCount));

    // Real-Time System Clock: Actual Day of Week & Time of Day Period
    const live = window.I18N ? window.I18N.getRealTimeOrientation(lang) : null;
    const now = new Date();
    const dayOfWeek = live ? live.dayOfWeek : now.getDay();
    const todayName = live ? live.dayName : (now.getDay() === 3 ? (lang === 'as' ? 'বুধবাৰ' : (lang === 'bn' ? 'বুধবার' : 'Wednesday')) : 'Wednesday');
    const periodDesc = live ? live.timePeriodText : 'A peaceful morning with gentle sunlight and warm chai';
    const periodIcon = live ? live.periodIcon : '☀️';

    const dayDict = [
      { en: 'Sunday', as: 'দেওবাৰ', bn: 'রবিবার' },
      { en: 'Monday', as: 'সোমবাৰ', bn: 'সোমবার' },
      { en: 'Tuesday', as: 'মঙলবাৰ', bn: 'মঙ্গলবার' },
      { en: 'Wednesday', as: 'বুধবাৰ', bn: 'বুধবার' },
      { en: 'Thursday', as: 'বৃহস্পতিবাৰ', bn: 'বৃহস্পতিবার' },
      { en: 'Friday', as: 'শুক্ৰবাৰ', bn: 'শুক্রবার' },
      { en: 'Saturday', as: 'শনিবাৰ', bn: 'শনিবার' }
    ];

    // Pick distractors from other days of the week
    const otherDays = dayDict.filter((_, idx) => idx !== dayOfWeek);
    otherDays.sort(() => Math.random() - 0.5);

    const options = [
      { text: todayName, correct: true }
    ];

    for (let i = 0; i < numChoices - 1 && i < otherDays.length; i++) {
      const d = otherDays[i];
      const dName = lang === 'as' ? d.as : (lang === 'bn' ? d.bn : d.en);
      options.push({ text: dName, correct: false });
    }
    options.sort(() => Math.random() - 0.5);

    const diffHeader = window.adaptiveEngine ? window.adaptiveEngine.renderDifficultyHeader() : '';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        ${diffHeader}
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'আজি কি বাৰ? • বাস্তৱ সময়ৰ শান্ত ধাৰণা' : 'Today is... • Real-Time Reality Orientation'}
        </span>
        <div class="text-6xl my-4">${periodIcon}</div>
        <h3 id="g3-prompt" class="text-2xl font-bold text-gray-800 mb-2">
          ${lang === 'as' ? 'আজি বাৰটো কি বাৰ মনত আছেনে?' : 'Do you remember what day of the week it is today?'}
        </h3>
        <p class="text-amber-800 text-sm mb-6">${periodDesc}</p>

        <div id="g3-options" class="grid grid-cols-1 gap-3">
          ${options.map((d, i) => `
            <button id="g3-opt-${i}" data-correct="${d.correct}" onclick="window.games.handleAnswer('game-03', 'Today is...', 'Attention', ${d.correct}, '#g3-opt-${i}')"
              class="py-4 px-6 rounded-2xl text-xl font-bold border-2 border-amber-200 bg-white hover:bg-amber-50 text-gray-800 shadow-sm transition active:scale-95">
              ${d.text}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    const spokenPrompt = lang === 'as' 
      ? `আজি বাৰটো কি বাৰ? আজি হৈছে ${todayName}।`
      : `What day is today? Today is ${todayName}.`;
    if (window.speechEngine) window.speechEngine.speak(spokenPrompt);

    const correctIdx = options.findIndex(d => d.correct);
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial(todayName, `#g3-opt-${correctIdx}`, spokenPrompt);
    }
  }

  // --- Game 4: Textile & Pattern Match (Scales with Difficulty) ---
  startPatternMatchGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const diffCfg = window.adaptiveEngine ? window.adaptiveEngine.getDifficultyConfig() : { choiceCount: 2 };
    const numChoices = Math.min(4, Math.max(2, diffCfg.choiceCount));

    const patternPool = [
      { text: lang === 'as' ? 'ফুলাম গামোচা' : 'Woven Gamusa', svg: '/static/assets/patterns/gamusa.svg', correct: true },
      { text: lang === 'as' ? 'বাঁহৰ জাপি' : 'Bamboo Jaapi', svg: '/static/assets/patterns/jaapi.svg', correct: false },
      { text: lang === 'as' ? 'মেখেলা চাদৰৰ পাৰি' : 'Mekhela Sador Border', svg: '/static/assets/patterns/xorai.svg', correct: false },
      { text: lang === 'as' ? 'কপৌ ফুলৰ আৰ্হি' : 'Kopou Orchid Pattern', svg: '/static/assets/patterns/kopou.svg', correct: false }
    ];

    const options = [patternPool[0]];
    for (let i = 1; i < numChoices; i++) {
      options.push(patternPool[i]);
    }
    options.sort(() => Math.random() - 0.5);

    const diffHeader = window.adaptiveEngine ? window.adaptiveEngine.renderDifficultyHeader() : '';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        ${diffHeader}
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'কাপোৰ আৰু গামোচাৰ আৰ্হি মিলোৱা' : 'Textile & Pattern Match'}
        </span>
        <div class="w-36 h-36 mx-auto my-4 p-2 bg-white rounded-2xl border-4 border-red-300 shadow-md">
          <img src="/static/assets/patterns/gamusa.svg" alt="Gamusa Pattern" class="w-full h-full object-contain">
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          ${lang === 'as' ? 'এই ফুলাম গামোচাৰ সৈতে কোনটো আৰ্হি মিলে?' : 'Which pattern matches this woven Gamusa border?'}
        </h3>

        <div id="g4-options" class="grid ${numChoices > 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-4">
          ${options.map((opt, i) => `
            <button id="g4-opt-${i}" data-correct="${opt.correct}" onclick="window.games.handleAnswer('game-04', 'Textile Match', 'Visuospatial', ${opt.correct}, '#g4-opt-${i}')"
              class="p-4 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 shadow-sm flex flex-col items-center">
              <img src="${opt.svg}" class="w-20 h-20 object-contain">
              <span class="mt-2 font-bold text-sm text-gray-800">${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    const correctIdx = options.findIndex(o => o.correct);
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Gamusa", `#g4-opt-${correctIdx}`, lang === 'as' ? "এয়া ফুলাম গামোচা।" : "This is the woven Gamusa.");
    }
  }

  // --- Game 5: Sounds of Home (Auditory Memory) ---
  startSoundsOfHomeGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const diffCfg = window.adaptiveEngine ? window.adaptiveEngine.getDifficultyConfig() : { choiceCount: 2 };
    const numChoices = Math.min(4, Math.max(2, diffCfg.choiceCount));

    const soundPool = [
      { text: lang === 'as' ? 'বিহুৰ ঢোল' : 'Bihu Dhol (Drum)', icon: '🥁', correct: true },
      { text: lang === 'as' ? 'টিনৰ চালৰ বৰষুণ' : 'Rain on Tin Roof', icon: '🌧️', correct: false },
      { text: lang === 'as' ? 'ম’হৰ শিঙৰ পেঁপা' : 'Buffalo Horn Pepa', icon: '🎺', correct: false },
      { text: lang === 'as' ? 'পুৱাৰ চৰাইৰ মাত' : 'Morning Songbird Chirp', icon: '🐦', correct: false }
    ];

    const options = [soundPool[0]];
    for (let i = 1; i < numChoices; i++) {
      options.push(soundPool[i]);
    }
    options.sort(() => Math.random() - 0.5);

    const diffHeader = window.adaptiveEngine ? window.adaptiveEngine.renderDifficultyHeader() : '';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        ${diffHeader}
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'ঘৰৰ চিনাকি সুৰ • শ্ৰৱণ স্মৃতি' : 'Sounds of Home • Auditory Memory'}
        </span>

        <div class="my-6 p-6 bg-amber-50 rounded-3xl border-2 border-amber-300">
          <div class="text-5xl mb-2">🥁</div>
          <button onclick="window.speechEngine.playFolkSound('dhol')" class="btn-voice-pill px-6 py-3 rounded-2xl font-bold bg-amber-600 text-white shadow-md hover:bg-amber-700 active:scale-95 transition">
            <span>▶️</span> <span>${lang === 'as' ? 'সুৰটো পুনৰ শুনক (ঢোলৰ মাত)' : 'Play Sound Again'}</span>
          </button>
        </div>

        <h3 class="text-xl font-bold text-gray-800 mb-4">
          ${lang === 'as' ? 'এই মাতটো কিহৰ চিনি পাইছেনে?' : 'What comforting sound is this?'}
        </h3>

        <div id="g5-options" class="grid ${numChoices > 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-4">
          ${options.map((opt, i) => `
            <button id="g5-opt-${i}" data-correct="${opt.correct}" onclick="window.games.handleAnswer('game-05', 'Sounds of Home', 'Memory', ${opt.correct}, '#g5-opt-${i}')"
              class="py-4 px-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-base text-gray-800 hover:bg-amber-50 shadow-sm flex items-center justify-center gap-2">
              <span>${opt.icon}</span> <span>${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    setTimeout(() => {
      if (window.speechEngine) window.speechEngine.playFolkSound('dhol');
    }, 400);

    const correctIdx = options.findIndex(o => o.correct);
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Dhol", `#g5-opt-${correctIdx}`, lang === 'as' ? "এয়া বিহুৰ মৰমৰ ঢোলৰ মাত।" : "This is the rhythmic Bihu Dhol.");
    }
  }

  // --- Game 6: Market Basket (Working Memory Scaled with Difficulty) ---
  startMarketBasketGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const diffCfg = window.adaptiveEngine ? window.adaptiveEngine.getDifficultyConfig() : { choiceCount: 2 };
    const numItems = Math.min(4, Math.max(2, diffCfg.choiceCount));

    const marketPool = [
      { name: lang === 'as' ? 'কাজী নেমু' : 'Kazi Nemu (Lemon)', icon: '🍋', bg: 'bg-emerald-50 border-emerald-200' },
      { name: lang === 'as' ? 'জোহা চাউল' : 'Joha Rice', icon: '🌾', bg: 'bg-amber-50 border-amber-200' },
      { name: lang === 'as' ? 'বাঁহৰ গাজ' : 'Bamboo Shoot', icon: '🎋', bg: 'bg-red-50 border-red-200' },
      { name: lang === 'as' ? 'ভোট জলকীয়া' : 'Bhut Jolokia Chilli', icon: '🌶️', bg: 'bg-orange-50 border-orange-200' }
    ];

    const basketItems = marketPool.slice(0, numItems);

    const distractorPool = [
      { name: lang === 'as' ? 'আপেল' : 'Apple', icon: '🍎' },
      { name: lang === 'as' ? 'আনাৰস' : 'Pineapple', icon: '🍍' },
      { name: lang === 'as' ? 'নাৰিকল' : 'Coconut', icon: '🥥' }
    ];

    const options = [
      { text: basketItems[0].name, icon: basketItems[0].icon, correct: true }
    ];
    for (let i = 0; i < numItems - 1 && i < distractorPool.length; i++) {
      options.push({ text: distractorPool[i].name, icon: distractorPool[i].icon, correct: false });
    }
    options.sort(() => Math.random() - 0.5);

    const diffHeader = window.adaptiveEngine ? window.adaptiveEngine.renderDifficultyHeader() : '';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        ${diffHeader}
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'বজাৰৰ মোনা • কাৰ্যকৰী স্মৃতি' : 'Market Basket • Working Memory'}
        </span>

        <h3 class="text-xl font-bold text-gray-800 my-4">
          ${lang === 'as' ? `মোনাত এই ${numItems}টা বস্তু মনত ৰাখক:` : `Remember these ${numItems} fresh items in your basket:`}
        </h3>

        <div class="flex flex-wrap justify-center gap-3 my-4">
          ${basketItems.map(item => `
            <div class="p-3 ${item.bg} rounded-2xl border text-center min-w-[80px]">
              <span class="text-3xl">${item.icon}</span>
              <div class="text-xs font-bold text-gray-700 mt-1">${item.name}</div>
            </div>
          `).join('')}
        </div>

        <p class="text-gray-600 text-sm mb-4">
          ${lang === 'as' ? 'তলৰ বিকল্পৰ পৰা আমাৰ মোনাৰ সুগন্ধি নেমুটেঙাটো বাচক:' : 'Which fresh lemon did we pack in the basket?'}
        </p>

        <div id="g6-options" class="grid ${numItems > 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-4">
          ${options.map((opt, i) => `
            <button id="g6-opt-${i}" data-correct="${opt.correct}" onclick="window.games.handleAnswer('game-06', 'Market Basket', 'Executive', ${opt.correct}, '#g6-opt-${i}')"
              class="py-4 px-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-base text-gray-800 hover:bg-amber-50 shadow-sm flex items-center justify-center gap-2">
              <span>${opt.icon}</span> <span>${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    const correctIdx = options.findIndex(o => o.correct);
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Kazi Nemu", `#g6-opt-${correctIdx}`, lang === 'as' ? "কাজী নেমু বাচক。" : "Tap Kazi Nemu lemon.");
    }
  }

  // --- Game 7: Festival & Harvest Sequence ---
  startFestivalSequenceGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const diffCfg = window.adaptiveEngine ? window.adaptiveEngine.getDifficultyConfig() : { choiceCount: 2 };
    const numChoices = Math.min(4, Math.max(2, diffCfg.choiceCount));

    const festivalPool = [
      { title: lang === 'as' ? 'ৰঙালী বিহু (ব’হাগ বিহু)' : 'Rongali Bihu (Spring New Year)', sub: lang === 'as' ? 'বসন্তৰ নাচ-গান আৰু কপৌ ফুল' : 'Spring celebration & Kopou orchids', icon: '🌸', correct: true },
      { title: lang === 'as' ? 'মাঘ বিহু (ভোগালী বিহু)' : 'Magh Bihu (Winter Feast)', sub: lang === 'as' ? 'মেজি আৰু পিঠা-পনা' : 'Meji bonfire & pitha feast', icon: '🔥', correct: false },
      { title: lang === 'as' ? 'কঙালী বিহু (কাতি বিহু)' : 'Kati Bihu (Autumn Light)', sub: lang === 'as' ? 'তুলসী তলৰ চাকি' : 'Tulsi earthen lamp', icon: '🪔', correct: false },
      { title: lang === 'as' ? 'শাৰদীয় দুৰ্গোৎসৱ' : 'Autumn Festival', sub: lang === 'as' ? 'শাৰদীয় আনন্দ' : 'Seasonal festive gatherings', icon: '✨', correct: false }
    ];

    const options = [festivalPool[0]];
    for (let i = 1; i < numChoices; i++) {
      options.push(festivalPool[i]);
    }
    options.sort(() => Math.random() - 0.5);

    const diffHeader = window.adaptiveEngine ? window.adaptiveEngine.renderDifficultyHeader() : '';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        ${diffHeader}
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'উৎসৱৰ ক্ৰম সজোৱা' : 'Festival & Season Sequence'}
        </span>
        <h3 class="text-xl font-bold text-gray-800 my-4">
          ${lang === 'as' ? 'বসন্তৰ আৰম্ভণিতে প্ৰথমে কোনটো বিহু আহে?' : 'Which joyful festival arrives first in Spring?'}
        </h3>

        <div id="g7-options" class="space-y-3">
          ${options.map((opt, i) => `
            <button id="g7-opt-${i}" data-correct="${opt.correct}" onclick="window.games.handleAnswer('game-07', 'Festival Sequence', 'Executive', ${opt.correct}, '#g7-opt-${i}')"
              class="w-full py-4 px-5 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 font-bold text-base text-gray-800 shadow-sm flex items-center gap-3 text-left">
              <span class="text-3xl">${opt.icon}</span>
              <div>
                <div>${opt.title}</div>
                <div class="text-xs text-emerald-700 font-semibold">${opt.sub}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    const correctIdx = options.findIndex(o => o.correct);
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Rongali Bihu", `#g7-opt-${correctIdx}`, lang === 'as' ? "ৰঙালী বিহু প্ৰথমে আহে।" : "Rongali Bihu arrives first in Spring.");
    }
  }

  // --- Game 8: Daily Routine Sorting (Real-Time Patient Reminders & Schedules) ---
  async startRoutineSortingGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const diffCfg = window.adaptiveEngine ? window.adaptiveEngine.getDifficultyConfig() : { choiceCount: 2 };
    const numChoices = Math.min(4, Math.max(2, diffCfg.choiceCount));

    // Fetch real-time schedule from patient database
    let liveTask = {
      title: lang === 'as' ? "কুহুমীয়া চাহ একাপ খোৱা" : "Warm Cup of Morning Tea",
      icon: "☕",
      time: "08:30 AM"
    };

    try {
      const resp = await fetch('/api/reminders/pat-ner-001');
      if (resp.ok) {
        const rems = await resp.json();
        if (rems && rems.length > 0) {
          const now = new Date();
          const curH = now.getHours();
          const target = rems.find(r => {
            const h = parseInt(r.scheduled_time.split(':')[0], 10);
            return h >= curH;
          }) || rems[0];

          liveTask = {
            title: `${target.scheduled_time} - ${target.title}`,
            icon: target.category === 'medicine' ? '💊' : (target.title.toLowerCase().includes('tea') ? '☕' : '🌸'),
            time: target.scheduled_time
          };
        }
      }
    } catch (e) {
      console.warn("Using default routine task", e);
    }

    const distractorPool = [
      { text: lang === 'as' ? 'ৰাতিপুৱা শুবলৈ যোৱা' : 'Going to sleep at night', icon: '🌙' },
      { text: lang === 'as' ? 'বিদ্যালয়লৈ গৈ পৰীক্ষা দিয়া' : 'Going to school for an exam', icon: '🎒' },
      { text: lang === 'as' ? 'বজাৰলৈ গৈ গধুৰ মোনা বোকা' : 'Carrying heavy market bags', icon: '🛍️' }
    ];

    const options = [
      { text: liveTask.title, icon: liveTask.icon, correct: true }
    ];

    for (let i = 0; i < numChoices - 1 && i < distractorPool.length; i++) {
      options.push({ text: distractorPool[i].text, icon: distractorPool[i].icon, correct: false });
    }
    options.sort(() => Math.random() - 0.5);

    const diffHeader = window.adaptiveEngine ? window.adaptiveEngine.renderDifficultyHeader() : '';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        ${diffHeader}
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'বাস্তৱ সূচীৰ নিত্য নিয়ম' : 'Daily Routine • Real Patient Schedule'}
        </span>
        <h3 class="text-xl font-bold text-gray-800 my-4">
          ${lang === 'as' ? 'আমাৰ আজিৰ দিনটোৰ চিনাকি কামটো কি?' : 'What scheduled task is part of your calm daily routine?'}
        </h3>

        <div id="g8-options" class="grid ${numChoices > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'} gap-4">
          ${options.map((opt, i) => `
            <button id="g8-opt-${i}" data-correct="${opt.correct}" onclick="window.games.handleAnswer('game-08', 'Daily Routine', 'Executive', ${opt.correct}, '#g8-opt-${i}')"
              class="p-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-base text-gray-800 hover:bg-amber-50 shadow-sm flex flex-col items-center text-center">
              <span class="text-3xl mb-1.5">${opt.icon}</span>
              <span>${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    const spokenPrompt = lang === 'as' 
      ? `আজিৰ নিয়মটো হৈছে ${liveTask.title}。`
      : `Your scheduled routine is ${liveTask.title}.`;
    if (window.speechEngine) window.speechEngine.speak(spokenPrompt);

    const correctIdx = options.findIndex(o => o.correct);
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial(liveTask.title, `#g8-opt-${correctIdx}`, spokenPrompt);
    }
  }

  // --- Game 9: Shadow & Utensil Match ---
  startShadowUtensilGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const diffCfg = window.adaptiveEngine ? window.adaptiveEngine.getDifficultyConfig() : { choiceCount: 2 };
    const numChoices = Math.min(4, Math.max(2, diffCfg.choiceCount));

    const utensilPool = [
      { text: lang === 'as' ? 'অসমৰ শৰাই' : 'Assamese Xorai', icon: '✨', correct: true },
      { text: lang === 'as' ? 'চাহৰ পিয়লা' : 'Tea Cup', icon: '🍵', correct: false },
      { text: lang === 'as' ? 'পিতলৰ বঁটা' : 'Brass Bota Plate', icon: '🪙', correct: false },
      { text: lang === 'as' ? 'বাঁহৰ খৰাহী' : 'Bamboo Basket', icon: '🧺', correct: false }
    ];

    const options = [utensilPool[0]];
    for (let i = 1; i < numChoices; i++) {
      options.push(utensilPool[i]);
    }
    options.sort(() => Math.random() - 0.5);

    const diffHeader = window.adaptiveEngine ? window.adaptiveEngine.renderDifficultyHeader() : '';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        ${diffHeader}
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'শৰাই আৰু পিতলৰ বাচন চিনি পোৱা' : 'Shadow & Utensil Match'}
        </span>

        <div class="w-32 h-32 mx-auto my-4 p-2 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-center justify-center">
          <img src="/static/assets/patterns/xorai.svg" alt="Xorai" class="w-24 h-24 object-contain">
        </div>

        <h3 class="text-xl font-bold text-gray-800 mb-4">
          ${lang === 'as' ? 'এই পৱিত্ৰ কাঁহ-পিতলৰ পাত্ৰটি কি?' : 'Which traditional bell-metal vessel is this?'}
        </h3>

        <div id="g9-options" class="grid ${numChoices > 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-4">
          ${options.map((opt, i) => `
            <button id="g9-opt-${i}" data-correct="${opt.correct}" onclick="window.games.handleAnswer('game-09', 'Utensil Match', 'Visuospatial', ${opt.correct}, '#g9-opt-${i}')"
              class="py-4 px-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-base text-gray-800 hover:bg-amber-50 shadow-sm flex items-center justify-center gap-1.5">
              <span>${opt.icon}</span> <span>${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    const correctIdx = options.findIndex(o => o.correct);
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Xorai", `#g9-opt-${correctIdx}`, lang === 'as' ? "এয়া অসমৰ পৱিত্ৰ শৰাই।" : "This is the Assamese Xorai.");
    }
  }

  // --- Game 10: Folk Song & Lyric Completion ---
  startLyricCompletionGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const diffCfg = window.adaptiveEngine ? window.adaptiveEngine.getDifficultyConfig() : { choiceCount: 2 };
    const numChoices = Math.min(4, Math.max(2, diffCfg.choiceCount));

    const promptText = lang === 'as'
      ? 'মই এটি যাযাবৰ, ধৰাৰ দিহিঙে দিপাঙে লৰি...'
      : 'You are my sunshine, my only sunshine...';

    const lyricPool = [
      { text: lang === 'as' ? 'সুঁতি বিচাৰি পাওঁ...' : 'You make me happy when skies are grey...', correct: true },
      { text: lang === 'as' ? 'ঘৰলৈ উভতি যাওঁ...' : 'Twinkle twinkle little star...', correct: false },
      { text: lang === 'as' ? 'নৈৰ পাৰতে ৰওঁ...' : 'Row row row your boat gently down the stream...', correct: false },
      { text: lang === 'as' ? 'দূৰলৈ গুচি যাওঁ...' : 'Over the rainbow so high in the sky...', correct: false }
    ];

    const options = [lyricPool[0]];
    for (let i = 1; i < numChoices; i++) {
      options.push(lyricPool[i]);
    }
    options.sort(() => Math.random() - 0.5);

    const diffHeader = window.adaptiveEngine ? window.adaptiveEngine.renderDifficultyHeader() : '';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        ${diffHeader}
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'গানৰ ফাঁকি মিলোৱা • মৌখিক স্মৃতি' : 'Folk Song & Lyric Completion'}
        </span>
        <div class="text-5xl my-4">🎶</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2 italic">"${promptText}"</h3>
        <p class="text-amber-800 text-sm mb-6">${lang === 'as' ? 'গানৰ পিছৰ পদটো কি হ’ব বাচক:' : 'Which line comes next in this beloved melody?'}</p>

        <div id="g10-options" class="space-y-3">
          ${options.map((opt, i) => `
            <button id="g10-opt-${i}" data-correct="${opt.correct}" onclick="window.games.handleAnswer('game-10', 'Lyric Completion', 'Verbal', ${opt.correct}, '#g10-opt-${i}')"
              class="w-full py-4 px-6 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 font-bold text-base text-gray-800 shadow-sm text-left">
              🎵 "${opt.text}"
            </button>
          `).join('')}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    if (window.speechEngine) {
      window.speechEngine.speak(promptText);
    }
    const correctIdx = options.findIndex(o => o.correct);
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial(lyricPool[0].text, `#g10-opt-${correctIdx}`, lyricPool[0].text);
    }
  }

  // --- Game 11: Gentle Flower Tap (Attention & Motor Calibration) ---
  startFlowerTapGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const diffCfg = window.adaptiveEngine ? window.adaptiveEngine.getDifficultyConfig() : { choiceCount: 2 };
    // Level 1: 3 flowers, Level 2: 5 flowers, Level 3: 7 flowers
    const targetCount = diffCfg.level === 1 ? 3 : (diffCfg.level === 2 ? 5 : 7);

    const positions = [
      { top: '2rem', left: '2rem' },
      { bottom: '2rem', right: '3rem' },
      { top: '3.5rem', right: '2rem' },
      { bottom: '3rem', left: '4rem' },
      { top: '5rem', left: '45%' },
      { bottom: '5rem', right: '40%' },
      { top: '1.5rem', left: '75%' }
    ];

    const activeFlowers = positions.slice(0, targetCount);
    const diffHeader = window.adaptiveEngine ? window.adaptiveEngine.renderDifficultyHeader() : '';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        ${diffHeader}
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'কপৌ ফুলৰ আলতো পৰশ • মনোযোগ আৰু দৃষ্টি' : 'Gentle Flower Tap • Sustained Attention'}
        </span>
        <h3 class="text-xl font-bold text-gray-800 my-4">
          ${lang === 'as' ? 'ফুলি থকা কপৌ ফুলবোৰ আলফুলে চুই চাওক' : 'Gently tap the blooming Kopou orchids at your own easy pace'}
        </h3>

        <div id="flower-garden-field" class="relative h-64 bg-emerald-50 rounded-3xl border-2 border-emerald-200 overflow-hidden my-4">
          ${activeFlowers.map((pos, idx) => `
            <div id="flower-${idx + 1}" onclick="window.games.tapFlower(${idx + 1}, ${targetCount})"
              style="top: ${pos.top}; left: ${pos.left};"
              class="absolute w-16 h-16 cursor-pointer hover:scale-110 active:scale-95 transition-all">
              <img src="/static/assets/patterns/kopou.svg" class="w-full h-full object-contain">
            </div>
          `).join('')}
        </div>

        <div id="flower-counter" class="text-base font-bold text-emerald-800">
          ${lang === 'as' ? `০/${targetCount} কপৌ ফুল স্পৰ্শ কৰা হ’ল` : `0/${targetCount} Orchids touched`}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    this.flowersTapped = 0;
  }

  tapFlower(id, totalCount = 3) {
    const el = document.getElementById(`flower-${id}`);
    if (!el || el.classList.contains('tapped')) return;

    el.classList.add('tapped', 'opacity-40', 'scale-90');
    this.flowersTapped = (this.flowersTapped || 0) + 1;

    if (window.speechEngine) {
      window.speechEngine.playGentleChime('success');
    }

    const lang = window.I18N ? window.I18N.currentLang : 'en';
    const counter = document.getElementById('flower-counter');
    if (counter) {
      counter.textContent = lang === 'as'
        ? `${this.flowersTapped}/${totalCount} কপৌ ফুল স্পৰ্শ কৰা হ’ল`
        : `${this.flowersTapped}/${totalCount} Orchids touched`;
    }

    if (this.flowersTapped >= totalCount) {
      setTimeout(() => {
        this.handleAnswer('game-11', 'Gentle Flower Tap', 'Attention', true, null);
      }, 500);
    }
  }

  // --- Universal Errorless Learning Answer Handler ---
  handleAnswer(gameId, gameTitle, domain, isCorrect, elementSelector) {
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    if (isCorrect) {
      if (window.adaptiveEngine) {
        window.adaptiveEngine.recordTrialAnswer(true, elementSelector);
      }
      if (window.speechEngine) {
        window.speechEngine.playGentleChime('success');
      }

      if (elementSelector) {
        const el = document.querySelector(elementSelector);
        if (el) el.classList.add('bg-emerald-100', 'border-emerald-400', 'text-emerald-950');
      }

      let praise = lang === 'as'
        ? "বৰ ধুনীয়া! আপুনি বৰ সুন্দৰকৈ মনত ৰাখিছে।"
        : "Wonderful! You did that so gently and beautifully.";

      if (gameId === 'game-03') {
        const live = window.I18N ? window.I18N.getRealTimeOrientation(lang) : null;
        if (lang === 'as') {
          praise = `হয়, ঠিক কৈছে! আজি হৈছে ${live ? live.dayName : 'বুধবাৰ'}। বৰ সুন্দৰকৈ মনত ৰাখিছে আইতা!`;
        } else if (lang === 'bn') {
          praise = `হ্যাঁ, একদম ঠিক! আজ ${live ? live.dayName : 'বুধবার'}। খুব সুন্দর মনে রেখেছেন দিদিমা!`;
        } else {
          praise = `Yes, exactly! Today is ${live ? live.dayName : 'Wednesday'}. Wonderful focus, Aita!`;
        }
      }

      if (window.speechEngine) {
        window.speechEngine.speak(praise, null, () => {
          if (window.adaptiveEngine) {
            window.adaptiveEngine.saveSession(gameId, gameTitle, domain, 1.0, 2900, 0);
          }
          setTimeout(() => {
            const modal = document.getElementById('game-modal');
            if (modal) modal.classList.add('hidden');
          }, 800);
        });
      }
    } else {
      // Errorless Learning: ZERO buzzers, gently highlight intended choice
      if (window.speechEngine) {
        window.speechEngine.playGentleChime('hint');
      }
      const modal = document.getElementById('game-modal-content');
      const correctBtn = modal.querySelector('button[data-correct="true"]');
      if (correctBtn) {
        correctBtn.classList.add('cue-pulse-target', 'bg-amber-100');
      }
      const hint = lang === 'as'
        ? "একো চিন্তা নাই, আহক এইটো মন কৰোঁ..."
        : "Take your time. Notice this gentle highlight...";
      if (window.speechEngine) {
        window.speechEngine.speak(hint);
      }
    }
  }

  // Guided Daily 3-Game Micro-Session (Slide 2 & 6: ~10-15 mins)
  startDailyGuidedSession() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'আজিৰ সুকোমল ৩টা খেল' : 'Today\'s 3 Gentle Mini-Games'}
        </span>
        <div class="text-5xl my-4">🌸</div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">
          ${lang === 'as' ? 'আইতা, আহক আজিৰ খেল খেলি অলপ আনন্দ লওঁ' : 'Aita, let\'s enjoy today\'s peaceful 10-minute session'}
        </h3>
        <p class="text-gray-600 text-base mb-6">
          ${lang === 'as' 
            ? '১. কোনে এইজন (পৰিয়াল) • ২. বজাৰৰ মোনা • ৩. কপৌ ফুলৰ পৰশ' 
            : '1. Who is This? (Family) • 2. Market Basket • 3. Gentle Flower Tap'}
        </p>
        <button onclick="window.games.openGame('game-01')" class="btn-warm px-8 py-4 rounded-2xl font-bold text-xl shadow-md w-full">
          ▶️ ${lang === 'as' ? 'প্ৰথম খেল আৰম্ভ কৰক' : 'Start Session'}
        </button>
      </div>
    `;
    modal.classList.remove('hidden');

    const greeting = lang === 'as' 
      ? "নমস্কাৰ আইতা! আহক আজিৰ ৩টা খেল খেলি আনন্দ মনেৰে সময় কটাওঁ।"
      : "Welcome home, Aita! Let's enjoy today's peaceful 3-game session together.";
    if (window.speechEngine) window.speechEngine.speak(greeting);
  }
}

window.games = new CognitiveGamesSuite();
