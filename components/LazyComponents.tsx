import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import LoadingSpinner from './LoadingSpinner'

// Lazy loading за тежки компоненти
export const LazyAnalyticsDashboard = dynamic(() => import('./AnalyticsDashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

export const LazyPaymentSystem = dynamic(() => import('./PaymentSystem'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

export const LazyGoogleMap = dynamic(() => import('./GoogleMap'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

export const LazyChatInterface = dynamic(() => import('./ChatInterface'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

export const LazyModerationSystem = dynamic(() => import('./ModerationSystem'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

export const LazyBoostSystem = dynamic(() => import('./BoostSystem'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

export const LazyBiddingSystem = dynamic(() => import('./BiddingSystem'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

// Wrapper компонент за Suspense
export function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  )
}
