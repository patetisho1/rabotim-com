import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email'
import { logger } from '@/lib/logger'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.sendEmail)
  if (rateLimitResult.limited) {
    return rateLimitResult.response!
  }

  try {
    const body = await request.json()
    const { type, ...data } = body

    let result

    switch (type) {
      case 'welcome':
        result = await emailService.sendWelcomeEmail(data.to, data.name)
        break
      
      case 'new_task':
        result = await emailService.sendNewTaskNotification(
          data.to,
          data.recipientName,
          data.taskTitle,
          data.taskCategory,
          data.taskLocation
        )
        break
      
      case 'task_application':
        result = await emailService.sendTaskApplicationNotification(
          data.to,
          data.taskOwner,
          data.applicantName,
          data.taskTitle
        )
        break
      
      case 'application_accepted':
        result = await emailService.sendApplicationAcceptedEmail(
          data.to,
          data.applicantName,
          data.taskTitle,
          data.taskOwnerName,
          data.taskId
        )
        break
      
      case 'application_rejected':
        result = await emailService.sendApplicationRejectedEmail(
          data.to,
          data.applicantName,
          data.taskTitle,
          data.reason
        )
        break
      
      case 'new_message':
        result = await emailService.sendNewMessageEmail(
          data.to,
          data.recipientName,
          data.senderName,
          data.messagePreview
        )
        break
      
      case 'task_completed':
        result = await emailService.sendTaskCompletionNotification(
          data.to,
          data.clientName,
          data.freelancerName,
          data.taskTitle
        )
        break
      
      case 'new_rating':
        result = await emailService.sendNewRatingNotification(
          data.to,
          data.recipientName,
          data.ratingGiver,
          data.rating,
          data.taskTitle
        )
        break
      
      case 'password_reset':
        result = await emailService.sendPasswordResetEmail(
          data.to,
          data.name,
          data.resetUrl
        )
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data })
    } else {
      const errorMessage = typeof result.error === 'string' ? result.error : 'Временна грешка при изпращане.'
      logger.warn('Email not sent', new Error(errorMessage), { emailType: type as string })
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 503 }
      )
    }
  } catch (error) {
    logger.error('Email API error', error as Error, { endpoint: 'POST /api/send-email' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
