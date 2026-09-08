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

  // --- Game 3: "Today is..." Reality Orientation ---
  startTodayIsGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const days = [
      { text: lang === 'as' ? 'মঙলবাৰ' : (lang === 'bn' ? 'মঙ্গলবার' : 'Tuesday'), correct: true },
      { text: lang === 'as' ? 'দেওবাৰ' : (lang === 'bn' ? 'রবিবার' : 'Sunday'), correct: false },
      { text: lang === 'as' ? 'বৃহস্পতিবাৰ' : (lang === 'bn' ? 'বৃহস্পতিবার' : 'Thursday'), correct: false }
    ];
    days.sort(() => Math.random() - 0.5);

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'আজি কি বাৰ? • বাস্তৱ সময়ৰ শান্ত ধাৰণা' : 'Today is... • Reality Orientation'}
        </span>
        <div class="text-6xl my-4">☀️</div>
        <h3 id="g3-prompt" class="text-2xl font-bold text-gray-800 mb-2">
          ${lang === 'as' ? 'আজি বাৰটো কি বাৰ মনত আছেনে?' : 'Do you remember what day of the week it is today?'}
        </h3>
        <p class="text-amber-800 text-sm mb-6">${lang === 'as' ? 'বতাহজাক শান্ত, ৰাতিপুৱাৰ চাহৰ সময়' : 'A peaceful morning with gentle sunlight'}</p>

        <div id="g3-options" class="grid grid-cols-1 gap-3">
          ${days.map((d, i) => `
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
      ? "আজি বাৰটো কি বাৰ? আজি হৈছে মঙলবাৰ।"
      : "What day is today? Today is Tuesday.";
    if (window.speechEngine) window.speechEngine.speak(spokenPrompt);

    const correctIdx = days.findIndex(d => d.correct);
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Tuesday", `#g3-opt-${correctIdx}`, spokenPrompt);
    }
  }

  // --- Game 4: Textile & Pattern Match ---
  startPatternMatchGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'কাপোৰ আৰু গামোচাৰ আৰ্হি মিলোৱা' : 'Textile & Pattern Match'}
        </span>
        <div class="w-36 h-36 mx-auto my-4 p-2 bg-white rounded-2xl border-4 border-red-300 shadow-md">
          <img src="/static/assets/patterns/gamusa.svg" alt="Gamusa Pattern" class="w-full h-full object-contain">
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          ${lang === 'as' ? 'এই ফুলাম গামোচাৰ সৈতে কোনটো আৰ্হি মিলে?' : 'Which pattern matches this woven Gamusa border?'}
        </h3>

        <div id="g4-options" class="grid grid-cols-2 gap-4">
          <button id="g4-opt-0" data-correct="true" onclick="window.games.handleAnswer('game-04', 'Textile Match', 'Visuospatial', true, '#g4-opt-0')"
            class="p-4 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 shadow-sm flex flex-col items-center">
            <img src="/static/assets/patterns/gamusa.svg" class="w-20 h-20 object-contain">
            <span class="mt-2 font-bold text-gray-800">${lang === 'as' ? 'ফুলাম গামোচা' : 'Woven Gamusa'}</span>
          </button>
          <button id="g4-opt-1" data-correct="false" onclick="window.games.handleAnswer('game-04', 'Textile Match', 'Visuospatial', false, '#g4-opt-1')"
            class="p-4 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 shadow-sm flex flex-col items-center">
            <img src="/static/assets/patterns/jaapi.svg" class="w-20 h-20 object-contain">
            <span class="mt-2 font-bold text-gray-800">${lang === 'as' ? 'বাঁহৰ জাপি' : 'Bamboo Jaapi'}</span>
          </button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Gamusa", "#g4-opt-0", lang === 'as' ? "এয়া ফুলাম গামোচা।" : "This is the woven Gamusa.");
    }
  }

  // --- Game 5: Sounds of Home (Auditory Memory) ---
  startSoundsOfHomeGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
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

        <div id="g5-options" class="grid grid-cols-2 gap-4">
          <button id="g5-opt-0" data-correct="true" onclick="window.games.handleAnswer('game-05', 'Sounds of Home', 'Memory', true, '#g5-opt-0')"
            class="py-4 px-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-lg text-gray-800 hover:bg-amber-50 shadow-sm">
            🥁 ${lang === 'as' ? 'বিহুৰ ঢোল' : 'Bihu Dhol (Drum)'}
          </button>
          <button id="g5-opt-1" data-correct="false" onclick="window.games.handleAnswer('game-05', 'Sounds of Home', 'Memory', false, '#g5-opt-1')"
            class="py-4 px-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-lg text-gray-800 hover:bg-amber-50 shadow-sm">
            🌧️ ${lang === 'as' ? 'টিনৰ চালৰ বৰষুণ' : 'Rain on Tin Roof'}
          </button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    // Automatically trigger synthesized sound
    setTimeout(() => {
      if (window.speechEngine) window.speechEngine.playFolkSound('dhol');
    }, 400);

    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Dhol", "#g5-opt-0", lang === 'as' ? "এয়া বিহুৰ মৰমৰ ঢোলৰ মাত।" : "This is the rhythmic Bihu Dhol.");
    }
  }

  // --- Game 6: Market Basket (Working Memory) ---
  startMarketBasketGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'বজাৰৰ মোনা • কাৰ্যকৰী স্মৃতি' : 'Market Basket • Working Memory'}
        </span>

        <h3 class="text-xl font-bold text-gray-800 my-4">
          ${lang === 'as' ? 'মোনাত এই ৩টা বস্তু মনত ৰাখক:' : 'Remember these 3 fresh items in your basket:'}
        </h3>

        <div class="flex justify-center gap-4 my-4">
          <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <span class="text-3xl">🍋</span>
            <div class="text-xs font-bold text-gray-700 mt-1">${lang === 'as' ? 'কাজী নেমু' : 'Kazi Nemu'}</div>
          </div>
          <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <span class="text-3xl">🌾</span>
            <div class="text-xs font-bold text-gray-700 mt-1">${lang === 'as' ? 'জোহা চাউল' : 'Joha Rice'}</div>
          </div>
          <div class="p-3 bg-red-50 rounded-2xl border border-red-200 text-center">
            <span class="text-3xl">🎋</span>
            <div class="text-xs font-bold text-gray-700 mt-1">${lang === 'as' ? 'বাঁহৰ গাজ' : 'Bamboo Shoot'}</div>
          </div>
        </div>

        <p class="text-gray-600 text-sm mb-4">
          ${lang === 'as' ? 'তলৰ বিকল্পৰ পৰা আমাৰ মোনাৰ সুগন্ধি নেমুটেঙাটো বাচক:' : 'Which fresh lemon did we pack in the basket?'}
        </p>

        <div id="g6-options" class="grid grid-cols-2 gap-4">
          <button id="g6-opt-0" data-correct="true" onclick="window.games.handleAnswer('game-06', 'Market Basket', 'Executive', true, '#g6-opt-0')"
            class="py-4 px-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-lg text-gray-800 hover:bg-amber-50 shadow-sm flex items-center justify-center gap-2">
            🍋 ${lang === 'as' ? 'কাজী নেমু' : 'Kazi Nemu (Lemon)'}
          </button>
          <button id="g6-opt-1" data-correct="false" onclick="window.games.handleAnswer('game-06', 'Market Basket', 'Executive', false, '#g6-opt-1')"
            class="py-4 px-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-lg text-gray-800 hover:bg-amber-50 shadow-sm flex items-center justify-center gap-2">
            🍎 ${lang === 'as' ? 'আপেল' : 'Apple'}
          </button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Kazi Nemu", "#g6-opt-0", lang === 'as' ? "কাজী নেমু বাচক।" : "Tap Kazi Nemu lemon.");
    }
  }

  // --- Game 7: Festival & Harvest Sequence ---
  startFestivalSequenceGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'উৎসৱৰ ক্ৰম সজোৱা' : 'Festival & Season Sequence'}
        </span>
        <h3 class="text-xl font-bold text-gray-800 my-4">
          ${lang === 'as' ? 'বসন্তৰ আৰম্ভণিতে প্ৰথমে কোনটো বিহু আহে?' : 'Which joyful festival arrives first in Spring?'}
        </h3>

        <div id="g7-options" class="space-y-3">
          <button id="g7-opt-0" data-correct="true" onclick="window.games.handleAnswer('game-07', 'Festival Sequence', 'Executive', true, '#g7-opt-0')"
            class="w-full py-4 px-5 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 font-bold text-lg text-gray-800 shadow-sm flex items-center gap-3">
            <span class="text-3xl">🌸</span>
            <div class="text-left">
              <div>${lang === 'as' ? 'ৰঙালী বিহু (ব’হাগ বিহু)' : 'Rongali Bihu (Spring New Year)'}</div>
              <div class="text-xs text-emerald-700 font-semibold">${lang === 'as' ? 'বসন্তৰ নাচ-গান আৰু কপৌ ফুল' : 'Spring celebration & Kopou orchids'}</div>
            </div>
          </button>
          <button id="g7-opt-1" data-correct="false" onclick="window.games.handleAnswer('game-07', 'Festival Sequence', 'Executive', false, '#g7-opt-1')"
            class="w-full py-4 px-5 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 font-bold text-lg text-gray-800 shadow-sm flex items-center gap-3">
            <span class="text-3xl">🔥</span>
            <div class="text-left">
              <div>${lang === 'as' ? 'মাঘ বিহু (ভোগালী বিহু)' : 'Magh Bihu (Bhogali Winter Feast)'}</div>
              <div class="text-xs text-amber-700 font-semibold">${lang === 'as' ? 'মেজি আৰু পিঠা-পনা' : 'Meji bonfire and pitha feast'}</div>
            </div>
          </button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Rongali Bihu", "#g7-opt-0", lang === 'as' ? "ৰঙালী বিহু প্ৰথমে আহে।" : "Rongali Bihu arrives first in Spring.");
    }
  }

  // --- Game 8: Daily Routine Sorting ---
  startRoutineSortingGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'পুৱাৰ নিত্য নিয়ম' : 'Daily Routine Sorting'}
        </span>
        <h3 class="text-xl font-bold text-gray-800 my-4">
          ${lang === 'as' ? 'ৰাতিপুৱা উঠি আমি প্ৰথমে কি কৰোঁ?' : 'What gentle step starts our morning peacefully?'}
        </h3>

        <div id="g8-options" class="grid grid-cols-2 gap-4">
          <button id="g8-opt-0" data-correct="true" onclick="window.games.handleAnswer('game-08', 'Daily Routine', 'Executive', true, '#g8-opt-0')"
            class="p-5 rounded-2xl border-2 border-amber-200 bg-white font-bold text-lg text-gray-800 hover:bg-amber-50 shadow-sm flex flex-col items-center">
            <span class="text-4xl mb-2">☕</span>
            <span>${lang === 'as' ? 'কুহুমীয়া চাহ একাপ' : 'Warm Cup of Morning Tea'}</span>
          </button>
          <button id="g8-opt-1" data-correct="false" onclick="window.games.handleAnswer('game-08', 'Daily Routine', 'Executive', false, '#g8-opt-1')"
            class="p-5 rounded-2xl border-2 border-amber-200 bg-white font-bold text-lg text-gray-800 hover:bg-amber-50 shadow-sm flex flex-col items-center">
            <span class="text-4xl mb-2">🌙</span>
            <span>${lang === 'as' ? 'ৰাতি শুবলৈ যোৱা' : 'Going to sleep at night'}</span>
          </button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Tea", "#g8-opt-0", lang === 'as' ? "পুৱা কুহুমীয়া চাহ একাপ খাওঁ।" : "A warm cup of morning tea.");
    }
  }

  // --- Game 9: Shadow & Utensil Match ---
  startShadowUtensilGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'শৰাই আৰু পিতলৰ বাচন চিনি পোৱা' : 'Shadow & Utensil Match'}
        </span>

        <div class="w-32 h-32 mx-auto my-4 p-2 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-center justify-center">
          <img src="/static/assets/patterns/xorai.svg" alt="Xorai" class="w-24 h-24 object-contain">
        </div>

        <h3 class="text-xl font-bold text-gray-800 mb-4">
          ${lang === 'as' ? 'এই পৱিত্ৰ কাঁহ-পিতলৰ পাত্ৰটি কি?' : 'Which traditional bell-metal vessel is this?'}
        </h3>

        <div id="g9-options" class="grid grid-cols-2 gap-4">
          <button id="g9-opt-0" data-correct="true" onclick="window.games.handleAnswer('game-09', 'Utensil Match', 'Visuospatial', true, '#g9-opt-0')"
            class="py-4 px-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-lg text-gray-800 hover:bg-amber-50 shadow-sm">
            ✨ ${lang === 'as' ? 'অসমৰ শৰাই' : 'Assamese Xorai'}
          </button>
          <button id="g9-opt-1" data-correct="false" onclick="window.games.handleAnswer('game-09', 'Utensil Match', 'Visuospatial', false, '#g9-opt-1')"
            class="py-4 px-4 rounded-2xl border-2 border-amber-200 bg-white font-bold text-lg text-gray-800 hover:bg-amber-50 shadow-sm">
            🍵 ${lang === 'as' ? 'চাহৰ পিয়লা' : 'Tea Cup'}
          </button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial("Xorai", "#g9-opt-0", lang === 'as' ? "এয়া অসমৰ পৱিত্ৰ শৰাই।" : "This is the Assamese Xorai.");
    }
  }

  // --- Game 10: Folk Song & Lyric Completion ---
  startLyricCompletionGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    const promptText = lang === 'as'
      ? 'মই এটি যাযাবৰ, ধৰাৰ দিহিঙে দিপাঙে লৰি...'
      : 'You are my sunshine, my only sunshine...';
    
    const correctOption = lang === 'as'
      ? 'সুঁতি বিচাৰি পাওঁ...'
      : 'You make me happy when skies are grey...';
    
    const alternateOption = lang === 'as'
      ? 'ঘৰলৈ উভতি যাওঁ...'
      : 'Twinkle twinkle little star...';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'গানৰ ফাঁকি মিলোৱা • মৌখিক স্মৃতি' : 'Folk Song & Lyric Completion'}
        </span>
        <div class="text-5xl my-4">🎶</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2 italic">"${promptText}"</h3>
        <p class="text-amber-800 text-sm mb-6">${lang === 'as' ? 'গানৰ পিছৰ পদটো কি হ’ব বাচক:' : 'Which line comes next in this beloved melody?'}</p>

        <div id="g10-options" class="space-y-3">
          <button id="g10-opt-0" data-correct="true" onclick="window.games.handleAnswer('game-10', 'Lyric Completion', 'Verbal', true, '#g10-opt-0')"
            class="w-full py-4 px-6 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 font-bold text-lg text-gray-800 shadow-sm text-left">
            🎵 "${correctOption}"
          </button>
          <button id="g10-opt-1" data-correct="false" onclick="window.games.handleAnswer('game-10', 'Lyric Completion', 'Verbal', false, '#g10-opt-1')"
            class="w-full py-4 px-6 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50 font-bold text-lg text-gray-800 shadow-sm text-left">
            🎵 "${alternateOption}"
          </button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');

    if (window.speechEngine) {
      window.speechEngine.speak(promptText);
    }
    if (window.adaptiveEngine) {
      window.adaptiveEngine.startTrial(correctOption, "#g10-opt-0", correctOption);
    }
  }

  // --- Game 11: Gentle Flower Tap (Attention & Motor Calibration) ---
  startFlowerTapGame() {
    const modal = document.getElementById('game-modal');
    const content = document.getElementById('game-modal-content');
    const lang = window.I18N ? window.I18N.currentLang : 'en';

    content.innerHTML = `
      <div class="text-center p-4 max-w-lg mx-auto">
        <span class="bg-amber-100 text-amber-900 text-sm font-extrabold px-4 py-1.5 rounded-full">
          ${lang === 'as' ? 'কপৌ ফুলৰ আলতো পৰশ • মনোযোগ আৰু দৃষ্টি' : 'Gentle Flower Tap • Sustained Attention'}
        </span>
        <h3 class="text-xl font-bold text-gray-800 my-4">
          ${lang === 'as' ? 'ফুলি থকা কপৌ ফুলবোৰ আলফুলে চুই চাওক' : 'Gently tap the blooming Kopou orchids at your own easy pace'}
        </h3>

        <div id="flower-garden-field" class="relative h-64 bg-emerald-50 rounded-3xl border-2 border-emerald-200 overflow-hidden my-4">
          <!-- Blooming orchids scattered gently -->
          <div id="flower-1" onclick="window.games.tapFlower(1)" class="absolute top-8 left-12 w-20 h-20 cursor-pointer hover:scale-110 active:scale-95 transition-all">
            <img src="/static/assets/patterns/kopou.svg" class="w-full h-full object-contain">
          </div>
          <div id="flower-2" onclick="window.games.tapFlower(2)" class="absolute bottom-8 right-16 w-20 h-20 cursor-pointer hover:scale-110 active:scale-95 transition-all">
            <img src="/static/assets/patterns/kopou.svg" class="w-full h-full object-contain">
          </div>
          <div id="flower-3" onclick="window.games.tapFlower(3)" class="absolute top-16 right-10 w-16 h-16 cursor-pointer hover:scale-110 active:scale-95 transition-all">
            <img src="/static/assets/patterns/kopou.svg" class="w-full h-full object-contain">
          </div>
        </div>

        <div id="flower-counter" class="text-base font-bold text-emerald-800">
          ${lang === 'as' ? '০/৩ কপৌ ফুল স্পৰ্শ কৰা হ’ল' : '0/3 Orchids touched'}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    this.flowersTapped = 0;
  }

  tapFlower(id) {
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
        ? `${this.flowersTapped}/৩ কপৌ ফুল স্পৰ্শ কৰা হ’ল`
        : `${this.flowersTapped}/3 Orchids touched`;
    }

    if (this.flowersTapped >= 3) {
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

      const praise = lang === 'as'
        ? "বৰ ধুনীয়া! আপুনি বৰ সুন্দৰকৈ মনত ৰাখিছে।"
        : "Wonderful! You did that so gently and beautifully.";

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
