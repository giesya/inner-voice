importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

const { precacheAndRoute, createHandlerBoundToURL } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate, NetworkFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

// VAPID public key
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// Precache static assets
precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/src/style.css', revision: '1' },
  { url: '/src/js/app.js', revision: '1' },
  { url: '/src/js/views/offlineView.js', revision: '1' },
  { url: '/icons/icon-72x72.png', revision: '1' },
  { url: '/icons/icon-96x96.png', revision: '1' },
  { url: '/icons/icon-128x128.png', revision: '1' },
  { url: '/icons/icon-144x144.png', revision: '1' },
  { url: '/icons/icon-152x152.png', revision: '1' },
  { url: '/icons/icon-192x192.png', revision: '1' },
  { url: '/icons/icon-384x384.png', revision: '1' },
  { url: '/icons/icon-512x512.png', revision: '1' }
]);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Cache CSS, JS, and Web Worker files with StaleWhileRevalidate strategy
registerRoute(
  ({ request }) => 
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Cache API requests with NetworkFirst strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
);

// Handle external resources (CDN)
registerRoute(
  ({ url }) => url.origin === 'https://unpkg.com' || 
               url.origin === 'https://cdnjs.cloudflare.com' ||
               url.origin === 'https://storage.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'external-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      })
    ]
  })
);

// Handle offline fallback
const offlineFallback = async () => {
  const cache = await caches.open('offline-cache');
  const cachedResponse = await cache.match('/src/js/views/offlineView.js');
  if (cachedResponse) {
    return cachedResponse;
  }
  return new Response('Offline - Please check your internet connection', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  });
};

// Handle navigation requests
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Handle fetch errors
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => offlineFallback())
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Lihat Detail',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Inner Voice', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
}); 