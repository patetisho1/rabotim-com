'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

interface GoogleAnalyticsProps {
  gaId: string
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check for analytics consent
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent')
      if (consent) {
        try {
          const prefs = JSON.parse(consent)
          setHasConsent(prefs.analytics === true)
        } catch {
          setHasConsent(false)
        }
      }
    }

    checkConsent()

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent) => {
      setHasConsent(event.detail?.analytics === true)
    }

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener)
    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener)
    }
  }, [])

  // Don't load GA if no consent
  if (!hasConsent) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: document.title,
              page_location: window.location.href,
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  )
}

// Hook за tracking на събития
export const useAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      })
    }
  }

  const trackTaskPosted = (category: string, price: number) => {
    trackEvent('task_posted', 'tasks', category, price)
  }

  const trackTaskApplied = (taskId: string, category: string) => {
    trackEvent('task_applied', 'tasks', `${category}_${taskId}`)
  }

  const trackUserRegistered = (method: string) => {
    trackEvent('user_registered', 'authentication', method)
  }

  const trackRatingGiven = (rating: number, category: string) => {
    trackEvent('rating_given', 'ratings', category, rating)
  }

  return {
    trackEvent,
    trackPageView,
    trackTaskPosted,
    trackTaskApplied,
    trackUserRegistered,
    trackRatingGiven
  }
}
