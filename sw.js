const CACHE_NAME = 'moon-v69';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './i18n.js',
  './auth.js',
  './app.js',
  './camera.js',
  './ranks.js',
  './ModdedInstagramScreen.js',
  './NativeTabPager.js',
  './ig_webview_injection.js',
  './moon_logo.png',
  './cosmic_moon_asset.png',
  './cosmic_earth_asset.png',
  './cosmic_chrome_asset.png',
  './cosmic_rose_asset.png',
  './cosmic_nebula_asset.png',
  './cosmic_ruby_asset.png',
  './cosmic_amber_asset.png',
  './cosmic_gold_asset.png',
  './cosmic_emerald_asset.png',
  './cosmic_cyan_asset.png',
  './cosmic_sapphire_asset.png',
  './marvel_coaches.png',
  './coach_spiderman.png',
  './coach_blackcat.png',
  './image_7.png',
  './startup.mp3',
  './manifest.json',
  './apple-touch-icon.png',
  './app_icon.png',
  './app_icon_192.png',
  './front_ranking_body.png',
  './back_ranking_body.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes('/api/') || new URL(event.request.url).origin !== self.location.origin) return;
  // Network-first with offline cache fallback so code updates apply immediately
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
      }
      return networkResponse;
    }).catch(() => {
      return caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// OS-Level Push / Local Notifications (fires even when screen is off or in other app)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'TRIGGER_PUSH_NOTIFICATION') {
    const title = event.data.title || 'Moon Fitness OS 🚀';
    const opts = event.data.options || {};
    self.registration.showNotification(title, {
      body: opts.body || '',
      icon: opts.icon || './moon_logo.png',
      badge: opts.badge || './apple-touch-icon.png',
      vibrate: opts.vibrate || [400, 150, 400],
      tag: opts.tag || 'moon-notification',
      renotify: true,
      requireInteraction: Boolean(opts.requireInteraction),
      data: opts.data || { url: './#workout' }
    });
    return;
  }

  if (event.data.type === 'SCHEDULE_REST_TIMER') {
    const delayMs = event.data.delayMs || 90000;
    const title = event.data.title || 'Moon Fitness - Rest Target Reached! 🔔';
    const body = event.data.body || 'Rest period complete! Step up for your next set.';
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: body,
        icon: './moon_logo.png',
        badge: './apple-touch-icon.png',
        vibrate: [500, 200, 500, 200, 500],
        tag: 'rest-timer-done',
        renotify: true,
        requireInteraction: true,
        data: { url: './#workout' }
      });
    }, delayMs);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
