const CACHE_NAME = 'broonch-v2';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/store.js',
  './js/tracker.js',
  './js/trends.js',
  './js/app.js',
  './manifest.json',
  './img/falco.png',
  './img/fox.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      // Network first for HTML, cache first for everything else
      if (e.request.mode === 'navigate') {
        return fetch(e.request).catch(() => cached);
      }
      return cached || fetch(e.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return resp;
      });
    })
  );
});
