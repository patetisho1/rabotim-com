'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import BottomNav from './BottomNav'
import CookieConsent from './CookieConsent'
import SPANavigation from './SPANavigation'
import PasswordRecoveryListener from './PasswordRecoveryListener'

const AUTH_ONLY_PATHS = ['/reset-password', '/forgot-password']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthOnlyPage = AUTH_ONLY_PATHS.some((p) => pathname?.startsWith(p))

  if (isAuthOnlyPage) {
    return <>{children}</>
  }

  return (
    <SPANavigation>
      <PasswordRecoveryListener />
      <Header />
      <main className="pb-safe">{children}</main>
      <Footer />
      <BottomNav />
      <CookieConsent />
    </SPANavigation>
  )
}
