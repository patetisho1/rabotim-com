'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseAuth } from '@/lib/supabase-auth'

/**
 * Страница само за линка от имейла за забравена парола.
 * Supabase препраща тук с hash (#access_token=...&type=recovery).
 * Hash-ът се вижда само в браузъра – тук го обработваме и пренасочваме към /reset-password.
 */
export default function AuthRecoveryPage() {
  const router = useRouter()
  const redirected = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || redirected.current) return

    const hash = window.location.hash || ''
    const isRecovery = hash.includes('type=recovery')

    if (!isRecovery) {
      router.replace('/')
      redirected.current = true
      return
    }

    const doRedirect = () => {
      if (redirected.current) return
      redirected.current = true
      router.replace('/reset-password')
    }

    // Изчакваме PASSWORD_RECOVERY от Supabase – тогава сесията е зададена и можем да отидем на /reset-password
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        doRedirect()
      }
    })

    // Ако за 1.5 s няма събитие, пренасочваме все пак (някои браузъри/конфиги могат да се различават)
    const fallback = setTimeout(doRedirect, 1500)

    return () => {
      subscription.unsubscribe()
      clearTimeout(fallback)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mb-4" />
      <p className="text-gray-600">Пренасочване към страницата за нова парола...</p>
    </div>
  )
}
