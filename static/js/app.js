/**
 * XORON Master Application Controller
 * Smart India Hackathon 2026 (SIH26003)
 * Team: Invincible Core
 */

class XoronApp {
  constructor() {
    this.currentTab = 'patient';
    this.activePatient = null;
    this.patientList = [];
  }

  getActivePatientId() {
    return this.activePatient?.id || localStorage.getItem('xoron_patient_id') || 'pat-ner-001';
  }

  getActivePatient() {
    return this.activePatient;
  }

  async init() {
    console.log("Initializing XORON Dementia Cognitive Care Platform...");

    // 1. Initialize i18n
    const savedLang = localStorage.getItem('xoron_lang') || 'as';
    if (window.I18N) {
      window.I18N.setLanguage(savedLang);
    }

    // 2. Fetch and initialize active patient profile
    await this.initActivePatient();

    // 3. Load Patient Data, Memory Bank, and Reminders for active patient
    const activePatId = this.getActivePatientId();

    if (window.reminiscence) {
      await window.reminiscence.loadData(activePatId);
      window.reminiscence.renderStoryVault('reminiscence-vault-container');
    }

    if (window.reminders) {
      await window.reminders.loadReminders(activePatId);
    }

    if (window.caregiver) {
      await window.caregiver.loadDashboard(activePatId);
    }

    // 4. Preload patient profiles for login view
    this.fetchPatientProfiles();

    // 5. Attempt opportunistic sync of any offline writes
    if (window.adaptiveEngine) {
      window.adaptiveEngine.attemptSyncOutbox();
    }

    // 6. Setup Service Worker for 100% Offline PWA capability
    this.registerServiceWorker();

    console.log("XORON ready in language:", savedLang, "for patient:", this.activePatient?.name || activePatId);
  }

  async initActivePatient() {
    const patId = this.getActivePatientId();
    try {
      const resp = await fetch(`/api/patient/${patId}`);
      if (resp.ok) {
        this.activePatient = await resp.json();
        this.updatePatientUI();
      }
    } catch (e) {
      console.warn("Could not fetch active patient profile, using local fallback", e);
      this.activePatient = {
        id: "pat-ner-001",
        name: "Hemlata Baruah",
        preferred_name: "Aita (আইতা)",
        current_residence: "Dispur, Guwahati",
        primary_language: "as",
        caregiver_name: "Anjali Baruah",
        caregiver_phone: "+91 94350 12345"
      };
      this.updatePatientUI();
    }
  }

  updatePatientUI() {
    if (!this.activePatient) return;
    const pat = this.activePatient;

    // Update Header Pill
    const navName = document.getElementById('nav-patient-name');
    const navRes = document.getElementById('nav-patient-residence');
    if (navName) navName.textContent = `${pat.name} (${pat.preferred_name || 'Patient'})`;
    if (navRes) navRes.innerHTML = `<span>${pat.current_residence || 'Guwahati'}</span> • <span class="text-amber-900 underline">Switch ▾</span>`;

    // Update Welcome Headline & Reality Orientation Banner on Patient Dashboard
    const welcomeEl = document.querySelector('[data-i18n="welcomeAita"]');
    if (welcomeEl) {
      const pref = pat.preferred_name || pat.name.split(' ')[0];
      const lang = window.I18N?.currentLanguage || 'en';
      if (lang === 'as') {
        welcomeEl.textContent = `স্বাগতম, ${pref}!`;
      } else if (lang === 'ne') {
        welcomeEl.textContent = `स्वागत छ, ${pref}!`;
      } else if (lang === 'bn') {
        welcomeEl.textContent = `স্বাগতম, ${pref}!`;
      } else {
        welcomeEl.textContent = `Welcome home, ${pref}!`;
      }
    }

    const orientationSub = document.querySelector('[data-i18n="subtitleOrientation"]');
    if (orientationSub) {
      const now = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const dateNum = now.getDate();
      orientationSub.textContent = `Today is ${dayName}, ${dateNum} ${monthName} • Peaceful Day in ${pat.current_residence || 'Dispur, Guwahati'}`;
    }
  }

  async fetchPatientProfiles() {
    const grid = document.getElementById('login-profiles-grid');
    if (!grid) return;

    try {
      const resp = await fetch('/api/patients');
      if (resp.ok) {
        this.patientList = await resp.json();
        this.renderLoginProfiles(this.patientList);
      }
    } catch (e) {
      console.warn("Error fetching patients", e);
      // Fallback default list
      this.patientList = [
        {
          id: "pat-ner-001",
          name: "Hemlata Baruah",
          preferred_name: "Aita (আইতা)",
          age: 78,
          gender: "Female",
          current_residence: "Dispur, Guwahati",
          primary_language: "as",
          caregiver_name: "Anjali Baruah",
          caregiver_phone: "+91 94350 12345",
          dementia_stage: "Early Mild Cognitive Impairment"
        },
        {
          id: "pat-ner-002",
          name: "Tenzing Tamang",
          preferred_name: "Kaka (काका)",
          age: 74,
          gender: "Male",
          current_residence: "Digboi Old Town",
          primary_language: "ne",
          caregiver_name: "Pemba Tamang",
          caregiver_phone: "+91 98540 56789",
          dementia_stage: "Moderate Cognitive Impairment"
        }
      ];
      this.renderLoginProfiles(this.patientList);
    }
  }

  renderLoginProfiles(patients) {
    const grid = document.getElementById('login-profiles-grid');
    if (!grid) return;

    const activeId = this.getActivePatientId();

    const langLabels = {
      'as': 'অসমীয়া (Assamese)',
      'bn': 'বাংলা (Bengali)',
      'brx': 'बड़ो (Bodo)',
      'mni': 'মৈতৈলোন্ (Manipuri)',
      'ne': 'नेपाली (Nepali)',
      'en': 'English'
    };

    grid.innerHTML = patients.map(p => {
      const isActive = p.id === activeId;
      const langName = langLabels[p.primary_language] || p.primary_language;
      const avatarIcon = p.gender === 'Male' ? '👴' : '👵';
      const borderClass = isActive ? 'border-amber-500 ring-4 ring-amber-100 bg-amber-50/50' : 'border-gray-200 hover:border-amber-400 bg-white';

      return `
        <div class="p-6 rounded-3xl border-2 ${borderClass} shadow-sm hover:shadow-md transition flex flex-col justify-between relative group">
          ${isActive ? `
            <div class="absolute -top-3 right-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[11px] font-black px-3 py-1 rounded-full shadow">
              ACTIVE PATIENT
            </div>
          ` : ''}

          <div>
            <div class="flex items-start gap-4 mb-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                ${avatarIcon}
              </div>
              <div class="flex-grow">
                <h3 class="text-xl font-black text-gray-900 leading-snug">${p.name}</h3>
                <div class="text-sm font-bold text-amber-900">${p.preferred_name || ''}</div>
                <div class="text-xs text-gray-600 mt-1 flex items-center gap-1">
                  <span>📍</span> <span>${p.current_residence || 'Assam'}</span>
                </div>
              </div>
            </div>

            <div class="space-y-2 text-xs text-gray-700 pt-3 border-t border-amber-100/60">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-500">Primary Language:</span>
                <span class="font-bold text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded-md">${langName}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-500">Caregiver:</span>
                <span class="font-semibold text-gray-900">${p.caregiver_name || 'Family Caregiver'}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-500">Contact:</span>
                <span class="font-mono text-gray-800">${p.caregiver_phone || 'Confidential'}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4">
            <button onclick="window.app.loginAsPatient('${p.id}')"
              class="w-full py-3.5 px-4 rounded-2xl ${isActive ? 'bg-amber-800 text-white font-black' : 'btn-warm'} text-sm font-bold shadow transition flex items-center justify-center gap-2 active:scale-95">
              <span>${isActive ? '✓ Currently Selected' : '👉 Enter as ' + (p.preferred_name ? p.preferred_name.split(' ')[0] : p.name.split(' ')[0])}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  async loginAsPatient(patientId) {
    try {
      const resp = await fetch('/api/patient/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId })
      });

      if (resp.ok) {
        const data = await resp.json();
        this.activePatient = data.patient;
        localStorage.setItem('xoron_patient_id', this.activePatient.id);

        // Switch to patient's native language if supported
        if (this.activePatient.primary_language) {
          this.changeLanguage(this.activePatient.primary_language);
        }

        // Update UI greetings & badges
        this.updatePatientUI();

        // Refresh all dynamic modules for this patient
        if (window.reminiscence) {
          await window.reminiscence.loadData(this.activePatient.id);
          window.reminiscence.renderStoryVault('reminiscence-vault-container');
        }
        if (window.reminders) {
          await window.reminders.loadReminders(this.activePatient.id);
        }
        if (window.caregiver) {
          await window.caregiver.loadDashboard(this.activePatient.id);
        }

        // Audio welcome chime & voice greeting
        if (window.speechEngine) {
          window.speechEngine.playGentleChime('success');
          const pref = this.activePatient.preferred_name || this.activePatient.name;
          setTimeout(() => {
            window.speechEngine.speak(`Welcome back, ${pref}. We are so glad to see you!`);
          }, 400);
        }

        // Re-render profile cards so active tag updates
        this.renderLoginProfiles(this.patientList);

        // Switch to Patient App view
        this.switchTab('patient');
      } else {
        alert("Failed to log in as patient.");
      }
    } catch (e) {
      console.error("Login error:", e);
      alert("Error logging in: " + e.message);
    }
  }

  async handlePatientRegister(e) {
    e.preventDefault();

    const name = document.getElementById('reg-patient-name').value.trim();
    const preferred = document.getElementById('reg-patient-preferred').value.trim();
    const residence = document.getElementById('reg-patient-residence').value.trim();
    const hometown = document.getElementById('reg-patient-hometown').value.trim();
    const language = document.getElementById('reg-patient-language').value;
    const age = parseInt(document.getElementById('reg-patient-age').value, 10) || 75;
    const gender = document.getElementById('reg-patient-gender').value;
    const caregiver = document.getElementById('reg-patient-caregiver').value.trim();
    const phone = document.getElementById('reg-patient-phone').value.trim();
    const tea = document.getElementById('reg-patient-tea').value.trim();

    if (!name || !preferred || !residence || !caregiver || !phone) {
      alert("Please fill in all required fields marked with an asterisk (*).");
      return;
    }

    try {
      const resp = await fetch('/api/patient/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          preferred_name: preferred,
          residence: residence,
          hometown: hometown || residence,
          primary_language: language,
          age: age,
          gender: gender,
          caregiver_name: caregiver,
          caregiver_phone: phone,
          favorite_tea: tea || "Warm Assam Tea"
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        alert(`🎉 Welcome to XORON, ${preferred}! Patient profile created successfully.`);
        await this.fetchPatientProfiles();
        await this.loginAsPatient(data.patient.id);
      } else {
        const err = await resp.json();
        alert("Registration failed: " + (err.detail || "Unknown error"));
      }
    } catch (err) {
      console.error("Registration error", err);
      alert("Error creating patient profile: " + err.message);
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Hide all view containers
    document.querySelectorAll('.view-container').forEach(el => {
      el.classList.add('hidden');
    });

    // Show target view
    const target = document.getElementById(`view-${tabId}`);
    if (target) {
      target.classList.remove('hidden');
    }

    // Update Nav buttons (Desktop)
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('nav-tab-active');
      } else {
        btn.classList.remove('nav-tab-active');
      }
    });

    // Update Mobile & Tablet Bottom Navigation Buttons
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === tabId;
      const icon = btn.querySelector('span:first-child');
      if (isTarget) {
        btn.classList.remove('text-gray-500');
        btn.classList.add('text-amber-900', 'font-black');
        if (icon) icon.classList.add('scale-110');
      } else {
        btn.classList.remove('text-amber-900', 'font-black');
        btn.classList.add('text-gray-500');
        if (icon) icon.classList.remove('scale-110');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  changeLanguage(langCode) {
    if (window.I18N && window.I18N.setLanguage(langCode)) {
      // Re-render components with newly selected language
      if (window.reminiscence) {
        window.reminiscence.renderStoryVault('reminiscence-vault-container');
      }
      if (window.reminders) {
        window.reminders.renderRemindersSection();
        window.reminders.renderWidgetPreview();
      }

      // Gentle audio greeting in the new language
      const greetings = {
        'en': 'Welcome to XORON. Language switched to English.',
        'as': 'স্মৰণলৈ স্বাগতম। অসমীয়া ভাষা নিৰ্বাচিত হ’ল।',
        'bn': 'স্মরণে স্বাগতম। বাংলা ভাষা নির্বাচিত হলো।',
        'brx': 'स्मरणआव बरायबाय। बड़ो राव बासिबाय।',
        'mni': 'স্মরণদা তরানিংবা ওকচরি। মৈতৈলোন্ খনরে।',
        'ne': 'स्मरणमा स्वागत छ। नेपाली भाषा छानियो।'
      };

      if (window.speechEngine) {
        window.speechEngine.playGentleChime('success');
        setTimeout(() => {
          window.speechEngine.speak(greetings[langCode] || greetings['en']);
        }, 300);
      }
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js').then(reg => {
          console.log("XORON Offline Service Worker active:", reg.scope);
          // Check for immediate updates
          reg.update();
        }).catch(err => {
          console.log("Service Worker registration skipped:", err);
        });
      });
    }
  }

  promptInstallMobileApp() {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the XORON Mobile App install prompt');
        }
        window.deferredPrompt = null;
      });
    } else {
      alert("📲 How to Install XORON on Mobile:\n\n• On Android (Chrome/Edge): Tap the 3 dots (⋮) in the top-right -> Tap 'Install app' or 'Add to Home screen'.\n• On iPhone (Safari): Tap the Share button (↑) -> Tap 'Add to Home Screen'.\n\nOnce installed, XORON launches full-screen as a standalone native app!");
    }
  }

  toggleMobileFrame() {
    const main = document.querySelector('main');
    const body = document.body;
    const btnText = document.getElementById('mobile-frame-btn-text');
    if (!main) return;

    if (body.classList.contains('phone-mockup-active')) {
      body.classList.remove('phone-mockup-active');
      main.classList.remove('mobile-bezel-frame');
      if (btnText) btnText.textContent = "Phone Frame View";
    } else {
      body.classList.add('phone-mockup-active');
      main.classList.add('mobile-bezel-frame');
      if (btnText) btnText.textContent = "Exit Phone Frame";
      main.scrollTop = 0;
    }
  }
}

window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  const installBtn = document.getElementById('btn-install-app');
  if (installBtn) {
    installBtn.classList.add('animate-pulse');
  }
});

window.app = new XoronApp();
window.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
