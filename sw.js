// Keeps the app shell (this folder's files) available so the app opens fast. The shop itself always loads live.
var CACHE = '4m-shell-v1';
var FILES = ['./', './index.html', './admin.html', './config.js', './logo.png', './icon-192.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  if (new URL(e.request.url).origin !== location.origin) return;
  // Network first, so changes to config.js show at once; the saved copy is only used offline.
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
