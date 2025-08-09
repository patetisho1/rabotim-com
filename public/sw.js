// Service Worker for Push Notifications
const CACHE_NAME = 'rabotim-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event)
  
  let notificationData = {
    title: 'Rabotim.com',
    body: 'Имате ново известие',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'rabotim-notification',
    data: {
      url: '/notifications'
    }
  }

  // Try to parse notification data from the push message
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        ...notificationData,
        ...data
      }
    } catch (error) {
      console.log('Could not parse push data:', error)
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    data: notificationData.data,
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Отвори',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Затвори',
        icon: '/favicon.ico'
      }
    ],
    vibrate: [200, 100, 200],
    sound: '/notification.mp3'
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  // Default action or 'open' action
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url.includes('/notifications') && 'focus' in client) {
            return client.focus()
          }
        }
        
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/notifications')
        }
      })
  )
})

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background sync tasks
      console.log('Performing background sync...')
    )
  }
})

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim())
}) 