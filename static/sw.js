/**
 * XORON Offline-First Service Worker
 * Ensures full caching of UI, audio synthesis, SVG assets, and cognitive games for rural NER.
 */

const CACHE_NAME = 'xoron-v5';
const OFFLINE_URLS = [
  '/',
  '/static/css/style.css',
  '/static/js/i18n.js',
  '/static/js/speech.js',
  '/static/js/adaptive_engine.js',
  '/static/js/reminiscence.js',
  '/static/js/chatbot.js',
  '/static/js/games.js',
  '/static/js/reminders.js',
  '/static/js/caregiver.js',
  '/static/js/app.js',
  '/static/assets/photos/daughter_priya.svg',
  '/static/assets/photos/grandson_rohan.svg',
  '/static/assets/photos/husband_biren.svg',
  '/static/assets/photos/caregiver_anjali.svg',
  '/static/assets/photos/bihu_memory.svg',
  '/static/assets/photos/tea_memory.svg',
  '/static/assets/photos/graduation_memory.svg',
  '/static/assets/patterns/xorai.svg',
  '/static/assets/patterns/jaapi.svg',
  '/static/assets/patterns/gamusa.svg',
  '/static/assets/patterns/kopou.svg',
  '/static/manifest.json',
  '/static/assets/icon-192.png',
  '/static/assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Always fetch fresh API responses
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ offline: true, error: 'Network unavailable' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
  } else {
    // Network-first for static code so updates load immediately; fallback to cache if offline
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
