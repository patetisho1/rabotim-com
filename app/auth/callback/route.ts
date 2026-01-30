import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextUrl = requestUrl.searchParams.get('next') // за password reset: ?next=/reset-password
  const type = requestUrl.searchParams.get('type') // recovery = password reset

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  // При password reset (recovery) или явно next=/reset-password → страница за нова парола
  if (type === 'recovery' || nextUrl === '/reset-password') {
    return NextResponse.redirect(`${requestUrl.origin}/reset-password`)
  }
  if (nextUrl && nextUrl.startsWith('/')) {
    return NextResponse.redirect(`${requestUrl.origin}${nextUrl}`)
  }

  return NextResponse.redirect(`${requestUrl.origin}/`)
}
