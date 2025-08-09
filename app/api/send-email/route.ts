import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email'

export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
