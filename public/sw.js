const CACHE_NAME = 'rabotim-com-v1.0.0';
const urlsToCache = [
  '/',
  '/tasks',
  '/favorites',
  '/login',
  '/register',
  '/post-task',
  '/static/css/main.css',
  '/static/js/main.js',
];

// Install event - кеширане на основните ресурси
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - стратегия "Cache First, Network Fallback"
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Връща кеширания отговор, ако съществува
        if (response) {
          return response;
        }

        // Иначе прави мрежова заявка
        return fetch(event.request).then(
          (response) => {
            // Проверява дали получихме валиден отговор
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонира отговора, защото може да се използва само веднъж
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event - изчистване на стари кешове
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync за offline функционалност
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Ново уведомление от Rabotim.com',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Отвори',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Затвори',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Rabotim.com', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync функция
function doBackgroundSync() {
  // Тук може да се добави логика за синхронизиране на данни
  console.log('Background sync executed');
  return Promise.resolve();
}
