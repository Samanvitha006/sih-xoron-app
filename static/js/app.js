/**
 * XORON Master Application Controller
 * Smart India Hackathon 2026 (SIH26003)
 * Team: Invincible Core
 */

class XoronApp {
  constructor() {
    this.currentTab = 'patient';
  }

  async init() {
    console.log("Initializing XORON Dementia Cognitive Care Platform...");

    // 1. Initialize i18n
    const savedLang = localStorage.getItem('xoron_lang') || 'as';
    if (window.I18N) {
      window.I18N.setLanguage(savedLang);
    }

    // 2. Load Patient Data, Memory Bank, and Reminders
    if (window.reminiscence) {
      await window.reminiscence.loadData();
      window.reminiscence.renderStoryVault('reminiscence-vault-container');
    }

    if (window.reminders) {
      await window.reminders.loadReminders();
    }

    if (window.caregiver) {
      await window.caregiver.loadDashboard();
    }

    // 3. Attempt opportunistic sync of any offline writes
    if (window.adaptiveEngine) {
      window.adaptiveEngine.attemptSyncOutbox();
    }

    // 4. Setup Service Worker for 100% Offline PWA capability
    this.registerServiceWorker();

    console.log("XORON ready in language:", savedLang);
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

    // Update Nav buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('nav-tab-active');
      } else {
        btn.classList.remove('nav-tab-active');
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
