'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabaseAuth } from '@/lib/supabase-auth'

/**
 * При клик на линка за reset парола от имейла Supabase може да пренасочи към Site URL с hash (#access_token&type=recovery)
 * вместо към /auth/reset-password-callback. Този компонент при зареждане проверява hash за type=recovery
 * и при събитие PASSWORD_RECOVERY пренасочва винаги към /reset-password.
 */
export default function PasswordRecoveryListener() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Ако сме на началната (или друга) страница и в hash има type=recovery → пренасочваме към reset-password
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      router.replace('/reset-password')
      return
    }

    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && pathname !== '/reset-password') {
        router.replace('/reset-password')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, pathname])

  return null
}
