'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkNotificationSupport()
    checkSubscriptionStatus()
  }, [])

  const checkNotificationSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
    }
  }

  const checkSubscriptionStatus = async () => {
    if (!isSupported) return

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error('Грешка при проверка на статуса на уведомленията:', error)
    }
  }

  const requestNotificationPermission = async () => {
    if (!isSupported) {
      toast.error('Push уведомленията не се поддържат в този браузър')
      return
    }

    setIsLoading(true)

    try {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        await subscribeToNotifications()
      } else if (permission === 'denied') {
        toast.error('Уведомленията са отказани. Можете да ги активирате в настройките на браузъра.')
      }
    } catch (error) {
      toast.error('Грешка при заявката за уведомления')
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      
      // В реален проект тук ще се използва VAPID ключ от сървъра
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BEl62iUYgUivxIkv69yViEuiBIa1l9aT67QhFbxJ5sDKeFIqwVGAH0d4EOybwZdCNFvz8OSUfBV02jCYOL48OAo'
      })

      // Запазване на subscription в localStorage (в реален проект ще се изпрати на сървъра)
      localStorage.setItem('pushSubscription', JSON.stringify(subscription))
      setIsSubscribed(true)
      toast.success('Push уведомленията са активирани!')
    } catch (error) {
      console.error('Грешка при абониране за уведомления:', error)
      toast.error('Грешка при активирането на уведомленията')
    }
  }

  const unsubscribeFromNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        localStorage.removeItem('pushSubscription')
        setIsSubscribed(false)
        toast.success('Push уведомленията са деактивирани')
      }
    } catch (error) {
      console.error('Грешка при отписване от уведомления:', error)
      toast.error('Грешка при деактивирането на уведомленията')
    }
  }

  const handleToggleNotifications = () => {
    if (isSubscribed) {
      unsubscribeFromNotifications()
    } else {
      requestNotificationPermission()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            {isSubscribed ? (
              <Bell size={20} className="text-primary-600" />
            ) : (
              <BellOff size={20} className="text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              Push уведомления
            </h3>
            <p className="text-sm text-gray-600">
              {isSubscribed 
                ? 'Получавайте уведомления за нови задачи и съобщения'
                : 'Активирайте уведомления за да не пропускате важни събития'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggleNotifications}
          disabled={isLoading}
          className={`btn ${isSubscribed ? 'btn-outline' : 'btn-primary'} text-sm`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : isSubscribed ? (
            'Деактивирай'
          ) : (
            'Активирай'
          )}
        </button>
      </div>

      {isSubscribed && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Уведомленията са активни
          </div>
        </div>
      )}
    </div>
  )
} 