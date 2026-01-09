import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { handleApiError, AuthenticationError, ValidationError, ErrorMessages } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwbxzkbilklullziiogr.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0',
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const limit = searchParams.get('limit')

    let query = supabase
      .from('tasks')
      .select(`
        *,
        profiles:users!tasks_user_id_fkey (
          id,
          full_name,
          avatar_url,
          verified,
          rating
        )
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    } else if (!status) {
      query = query.eq('status', 'active')
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (location && location !== 'all') {
      query = query.ilike('location', `%${location}%`)
    }

    if (priceMin) {
      query = query.gte('price', parseFloat(priceMin))
    }

    if (priceMax) {
      query = query.lte('price', parseFloat(priceMax))
    }

    // Филтър по userId (за "Моите задачи")
    if (userId) {
      query = query.eq('user_id', userId)
    }

    // Лимит на броя резултати
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      logger.error('Error fetching tasks', error, { 
        category: category || undefined, 
        location: location || undefined, 
        status: status || undefined, 
        userId: userId || undefined 
      })
      return handleApiError(error, { endpoint: 'GET /api/tasks' })
    }

    logger.info('Tasks fetched successfully', { 
      count: data?.length || 0, 
      category: category || undefined, 
      location: location || undefined, 
      status: status || undefined 
    })

    return NextResponse.json({ tasks: data || [] })
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/tasks' })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (stricter for task creation)
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.taskCreation)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = cookies()
    
    // Проверка за access token в Authorization header (fallback за cookies)
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.replace('Bearer ', '')
    
    // Създаваме Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwbxzkbilklullziiogr.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0',
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    // Проверка за автентикация
    // Първо опитваме с cookies (стандартния метод)
    let { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Ако cookies не работят и има access token, опитваме с JWT декодиране
    if ((authError || !user) && accessToken) {
      try {
        // Декодираме JWT за да получим user ID
        const tokenParts = accessToken.split('.')
        if (tokenParts.length === 3) {
          // Използваме atob за декодиране (работи и в браузър и в Node.js)
          const base64Payload = tokenParts[1]
          let payloadString: string | undefined
          try {
            // Първо опитваме с Buffer (Node.js)
            if (typeof Buffer !== 'undefined') {
              payloadString = Buffer.from(base64Payload, 'base64').toString()
            } else {
              // Fallback на atob (браузър/Edge runtime)
              payloadString = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'))
            }
            const payload = JSON.parse(payloadString)
            const userId = payload.sub
            
            if (!userId) {
              throw new Error('User ID not found in token payload')
            }
            
            // Използваме service role client за да обходим RLS и да потвърдим user
            const { getServiceRoleClient } = await import('@/lib/supabase')
            const supabaseAdmin = getServiceRoleClient()
            
            const { data: userData, error: userError } = await supabaseAdmin
              .from('users')
              .select('id, email')
              .eq('id', userId)
              .single()
            
            if (userData && !userError) {
              // Създаваме user обект от данните
              user = {
                id: userData.id,
                email: userData.email,
              } as any
              authError = null
            } else {
              // Запазваме оригиналната грешка или създаваме нова AuthError
              logger.warn('User not found in database for token user ID', new Error(userError?.message || 'User not found'), {
                userId,
                userError: userError?.message
              })
              authError = authError || {
                message: userError?.message || 'User not found',
                name: 'AuthError',
                status: 401
              } as any
            }
          } catch (parseError) {
            logger.error('Error parsing JWT payload', parseError as Error, {
              hasPayloadString: !!payloadString,
              payloadStringLength: payloadString?.length
            })
            authError = {
              message: (parseError as Error).message || 'Error parsing token',
              name: 'AuthError',
              status: 401
            } as any
          }
        } else {
          authError = {
            message: 'Invalid token format',
            name: 'AuthError',
            status: 401
          } as any
        }
      } catch (jwtError) {
        logger.error('Error decoding JWT token', jwtError as Error)
        authError = {
          message: (jwtError as Error).message || 'Error decoding token',
          name: 'AuthError',
          status: 401
        } as any
      }
    }
    
    if (authError || !user) {
      logger.error('Authentication failed in POST /api/tasks', authError as Error || new Error('No user found'), {
        hasError: !!authError,
        errorMessage: authError?.message,
        hasUser: !!user,
        hasAccessToken: !!accessToken,
        hasAuthHeader: !!authHeader
      })
      throw new AuthenticationError('Unauthorized', ErrorMessages.UNAUTHORIZED)
    }
    const body = await request.json()
    const {
      title,
      description,
      category,
      location,
      price,
      priceType,
      deadline,
      urgent = false,
      remote = false,
      conditions = '',
      images = []
    } = body

    // Валидация
    if (!title || !description || !category || !location || !price) {
      throw new ValidationError('Missing required fields', ErrorMessages.MISSING_FIELDS, { body })
    }

    const normalizedTitle = title?.toString().trim()
    const normalizedDescription = description?.toString().trim()
    const normalizedConditions = conditions?.toString().trim() || ''
    const numericPrice = Number(price)

    if (!normalizedTitle || !normalizedDescription || Number.isNaN(numericPrice)) {
      throw new ValidationError('Invalid task payload', ErrorMessages.INVALID_DATA, { body })
    }

    // Допълнителни проверки
    const MIN_TITLE_LENGTH = 10
    const MIN_DESCRIPTION_LENGTH = 50
    const MIN_PRICE_VALUE = 5
    const bannedPatterns = [
      /https?:\/\//i,
      /\bтелефон\b/i,
      /\bwhatsapp\b/i,
      /\bviber\b/i,
      /\bemail\b/i
    ]

    const issues: string[] = []

    if (normalizedTitle.length < MIN_TITLE_LENGTH) {
      issues.push(`Заглавието е твърде кратко (минимум ${MIN_TITLE_LENGTH} символа, имате ${normalizedTitle.length})`)
    }
    if (normalizedDescription.length < MIN_DESCRIPTION_LENGTH) {
      issues.push(`Описанието е твърде кратко (минимум ${MIN_DESCRIPTION_LENGTH} символа, имате ${normalizedDescription.length})`)
    }
    if (numericPrice < MIN_PRICE_VALUE) {
      issues.push('Посочената цена е подозрително ниска')
    }
    if (
      bannedPatterns.some((pattern) => pattern.test(normalizedTitle) || pattern.test(normalizedDescription) || pattern.test(normalizedConditions))
    ) {
      issues.push('Открито е съдържание, изискващо модерация')
    }

    // Използваме service role client за да обходим RLS при всички операции
    const { getServiceRoleClient } = await import('@/lib/supabase')
    const supabaseAdmin = getServiceRoleClient()

    // Проверка на историята на потребителя (използваме service role client)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('id, verified, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      const error = profileError instanceof Error ? profileError : new Error(String(profileError))
      logger.warn('Error loading user profile for moderation', error, { userId: user.id })
    }

    const { count: tasksCount } = await supabaseAdmin
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const userIsTrusted = Boolean(profile?.verified) || (tasksCount || 0) >= 5
    if (!userIsTrusted) {
      issues.push('Нов профил – изисква се първоначален преглед')
    }

    const moderationStatus = issues.length === 0 ? 'active' : 'pending'

    // Логване преди създаване на задача за диагностика
    logger.info('Creating task with service role client', {
      userId: user.id,
      title: normalizedTitle.substring(0, 50),
      category,
      location,
      price: numericPrice,
      status: moderationStatus
    })

    // Създаване на задача
    logger.info('Attempting to insert task', {
      userId: user.id,
      title: normalizedTitle.substring(0, 30),
      category,
      location,
      price: numericPrice,
      status: moderationStatus
    })

    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert({
        title: normalizedTitle,
        description: normalizedDescription,
        category,
        location,
        price: numericPrice,
        price_type: priceType,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        urgent,
        remote,
        images,
        user_id: user.id,
        status: moderationStatus,
        applications_count: 0,
        views_count: 0
      })
      .select('*')
      .single()

    if (taskError) {
      logger.error('Error creating task', taskError, { 
        userId: user.id, 
        category, 
        location,
        errorCode: (taskError as any)?.code,
        errorMessage: taskError.message,
        errorDetails: (taskError as any)?.details,
        errorHint: (taskError as any)?.hint
      })
      return handleApiError(taskError, { endpoint: 'POST /api/tasks', userId: user.id })
    }

    if (!task) {
      logger.error('Task created but no data returned', new Error('No task data returned after insert'), { userId: user.id })
      return NextResponse.json(
        { error: 'Задачата беше създадена, но не успяхме да я заредим' },
        { status: 500 }
      )
    }

    // Лог за модерация (използваме service role client)
    try {
      await supabaseAdmin.from('task_moderation_logs').insert({
        task_id: task.id,
        moderated_by: null,
        action: issues.length === 0 ? 'auto_approved' : 'auto_review',
        status_after: moderationStatus,
        issues: issues.length ? issues : null,
        notes: issues.length
          ? `Автоматична проверка откри ${issues.length} потенциални проблема`
          : 'Задачата покри всички критерии и е активирана автоматично'
      })
    } catch (logError) {
      logger.error('Error writing moderation log', logError as Error, { taskId: task.id })
    }

    logger.info('Task created successfully', {
      taskId: task.id,
      userId: user.id,
      status: moderationStatus,
      issuesCount: issues.length
    })

    return NextResponse.json({ 
      task, 
      moderation: {
        status: moderationStatus,
        issues
      } 
    }, { status: 201 })
  } catch (error: any) {
    logger.error('Exception in POST /api/tasks', error as Error, { 
      endpoint: 'POST /api/tasks',
      errorMessage: error?.message,
      errorName: error?.name,
      errorStack: error?.stack
    })
    return handleApiError(error, { endpoint: 'POST /api/tasks' })
  }
}

