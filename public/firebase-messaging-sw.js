// Firebase Messaging Service Worker
// This handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyCoRl6K4SUp7WH7aNS2coi45cdtFt4GhtY",
  authDomain: "rabotim-com.firebaseapp.com",
  projectId: "rabotim-com",
  storageBucket: "rabotim-com.firebasestorage.app",
  messagingSenderId: "380620198812",
  appId: "1:380620198812:web:625f80b21ace9ae87fee59"
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload)

  const notificationTitle = payload.notification?.title || 'Rabotim.com'
  const notificationOptions = {
    body: payload.notification?.body || 'Имате ново известие',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: payload.data?.tag || 'default',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Отвори'
      },
      {
        action: 'close',
        title: 'Затвори'
      }
    ],
    vibrate: [100, 50, 100],
    requireInteraction: true
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event)
  
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  // Get the URL to open
  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            url: urlToOpen
          })
          return
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

