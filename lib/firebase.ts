import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Get messaging instance (only in browser)
export const getMessagingInstance = async () => {
  if (typeof window === 'undefined') return null
  
  const supported = await isSupported()
  if (!supported) {
    console.log('Firebase Messaging is not supported in this browser')
    return null
  }
  
  return getMessaging(app)
}

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (typeof window === 'undefined') return null
    
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return null
    }

    // Request permission
    const permission = await Notification.requestPermission()
    
    if (permission !== 'granted') {
      console.log('Notification permission denied')
      return null
    }

    // Get messaging instance
    const messaging = await getMessagingInstance()
    if (!messaging) return null

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    })

    console.log('FCM Token:', token)
    return token

  } catch (error) {
    console.error('Error getting notification permission:', error)
    return null
  }
}

// Listen for foreground messages
export const onForegroundMessage = async (callback: (payload: any) => void) => {
  try {
    const messaging = await getMessagingInstance()
    if (!messaging) return null

    return onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload)
      callback(payload)
    })
  } catch (error) {
    console.error('Error setting up foreground message listener:', error)
    return null
  }
}

// Save FCM token to backend
export const saveFCMToken = async (userId: string, token: string) => {
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token })
    })
    
    return response.ok
  } catch (error) {
    console.error('Error saving FCM token:', error)
    return false
  }
}

export { app }

