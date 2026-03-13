// public/sw.js

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-shell').then((cache) => {
            return cache.addAll([
                '/index.html',
                '/styles.css',
                '/script.js',
                // Add other app shell resources here
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (url.origin === location.origin) {
        if (request.mode === 'navigate') {
            // Network-first for navigations
            event.respondWith(
                fetch(request).catch(() => caches.match('/index.html'))
            );
        } else {
            // Stale-while-revalidate for static assets
            event.respondWith(
                caches.open('static-assets').then((cache) => {
                    return cache.match(request).then((cachedResponse) => {
                        const networkFetch = fetch(request).then((networkResponse) => {
                            cache.put(request, networkResponse.clone());
                            return networkResponse;
                        });
                        return cachedResponse || networkFetch;
                    });
                })
            );
        }
    } else {
        // Runtime cache for images/media
        event.respondWith(
            caches.open('runtime-cache').then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    return cachedResponse || fetch(request).then((response) => {
                        cache.put(request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});