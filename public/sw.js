const CACHE_NAME = 'wedding-album-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
];

// Install: cache static assets including offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate for static assets, navigate → offline.html fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;
  // Skip chrome-extension and non-same-origin (unless opaque)
  if (url.protocol === 'chrome-extension:') return;

  if (request.mode === 'navigate') {
    // Network-first for navigation; fall back to offline.html
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/offline.html').then(r => r ?? caches.match('/'))
      )
    );
    return;
  }

  // Stale-while-revalidate for same-origin assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cached) => {
          const networkFetch = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cached);
          return cached || networkFetch;
        });
      })
    );
    return;
  }

  // Runtime cache for external resources (fonts, images from CDN)
  event.respondWith(
    caches.open('runtime-cache').then((cache) => {
      return cache.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => new Response('', { status: 503 }));
      });
    })
  );
});
