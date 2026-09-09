/**
 * XORON Speech & Audio Engine
 * Features:
 *  - Dementia-calibrated Web Speech API TTS (relaxed 0.85x rate, warm tone)
 *  - Speech-to-Text (STT) with visual wave feedback
 *  - Pure Web Audio API Sound Synthesizer (gentle chimes, folk instruments, ambient rain)
 */

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.audioCtx = null;
    this.initAudioContext();
    this.initRecognition();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  speak(text, lang = null, onEndCallback = null) {
    if (!this.synth) return;
    this.synth.cancel(); // Stop any pending speech

    const activeLang = lang || (window.I18N ? window.I18N.currentLang : 'en');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.4; // Gentle pacing for elderly comprehension (calibrated with VoiceCompanion Tts 0.4x)
    utterance.pitch = 1.0;

    // Map language codes to available browser voices
    const langMap = {
      'en': 'en-IN',
      'as': 'bn-IN', // Assamese fallback to bn-IN if direct as-IN voice is absent
      'bn': 'bn-IN',
      'brx': 'hi-IN',
      'mni': 'bn-IN',
      'ne': 'ne-NP'
    };

    utterance.lang = langMap[activeLang] || 'en-IN';

    // Pick best matching voice
    const voices = this.synth.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2))) ||
                  voices.find(v => v.lang.includes('IN')) ||
                  voices[0];
    if (voice) {
      utterance.voice = voice;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
    }

    this.synth.speak(utterance);
  }

  startListening(onResult, onStatusChange) {
    if (!this.recognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    const activeLang = window.I18N ? window.I18N.currentLang : 'en';
    const langMap = {
      'en': 'en-IN',
      'as': 'bn-IN',
      'bn': 'bn-IN',
      'brx': 'hi-IN',
      'mni': 'bn-IN',
      'ne': 'ne-NP'
    };
    this.recognition.lang = langMap[activeLang] || 'en-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStatusChange) onStatusChange(true);
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e);
      this.isListening = false;
      if (onStatusChange) onStatusChange(false);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onStatusChange) onStatusChange(false);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Could not start recognition", e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // --- Web Audio API Synthesizers ---
  // Pure mathematical sound generation - no external audio files needed!

  playGentleChime(type = 'success') {
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'success') {
      // Warm Major Third chord (C5 -> E5)
      osc1.frequency.setValueAtTime(523.25, now);
      osc2.frequency.setValueAtTime(659.25, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    } else if (type === 'reminder') {
      // Gentle Tibetan singing bell tone (440Hz + 880Hz octave chime)
      osc1.frequency.setValueAtTime(440.0, now);
      osc2.frequency.setValueAtTime(880.0, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    } else if (type === 'hint') {
      // Soft gentle shimmer (G4 -> C5)
      osc1.frequency.setValueAtTime(392.0, now);
      osc2.frequency.setValueAtTime(523.25, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    }

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.0);
    osc2.stop(now + 2.0);
  }

  playFolkSound(name) {
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (name === 'dhol') {
      // Assamese Bihu Dhol drum beat simulation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.35);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);

      // Repeat second beat
      setTimeout(() => {
        if (!this.audioCtx) return;
        const now2 = this.audioCtx.currentTime;
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(180, now2);
        osc2.frequency.exponentialRampToValueAtTime(60, now2 + 0.25);
        gain2.gain.setValueAtTime(0.35, now2);
        gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.3);
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        osc2.start(now2);
        osc2.stop(now2 + 0.35);
      }, 250);

    } else if (name === 'pepa' || name === 'flute') {
      // Buffalo Horn Pepa / Bamboo Flute melodic sweep
      const notes = [440, 493.88, 587.33, 659.25];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.audioCtx) return;
          const t = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.45);
        }, idx * 220);
      });

    } else if (name === 'rain') {
      // Monsoon rain on tin roof white noise simulation
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 2.0);
    }
  }
}

window.speechEngine = new SpeechEngine();
