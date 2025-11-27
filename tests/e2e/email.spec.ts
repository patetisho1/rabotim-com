import { test, expect } from '@playwright/test'

test.describe('Email System', () => {
  
  test('should have email API endpoint available', async ({ request }) => {
    // Test that the API endpoint exists and responds
    const response = await request.post('/api/send-email', {
      data: {
        type: 'welcome',
        to: 'test@example.com',
        name: 'Test User'
      }
    })
    
    // Should return 200 even if email service is not configured
    // (graceful degradation)
    expect(response.status()).toBeLessThan(500)
    
    const body = await response.json()
    // Should have success field
    expect(body).toHaveProperty('success')
  })

  test('should reject invalid email type', async ({ request }) => {
    const response = await request.post('/api/send-email', {
      data: {
        type: 'invalid_type',
        to: 'test@example.com'
      }
    })
    
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Invalid email type')
  })

  test('should handle application accepted email type', async ({ request }) => {
    const response = await request.post('/api/send-email', {
      data: {
        type: 'application_accepted',
        to: 'test@example.com',
        applicantName: 'Иван Петров',
        taskTitle: 'Тестова задача',
        taskOwnerName: 'Мария Георгиева',
        taskId: 'test-task-id'
      }
    })
    
    expect(response.status()).toBeLessThan(500)
  })

  test('should handle application rejected email type', async ({ request }) => {
    const response = await request.post('/api/send-email', {
      data: {
        type: 'application_rejected',
        to: 'test@example.com',
        applicantName: 'Иван Петров',
        taskTitle: 'Тестова задача',
        reason: 'Избрахме друг кандидат'
      }
    })
    
    expect(response.status()).toBeLessThan(500)
  })

  test('should handle new message email type', async ({ request }) => {
    const response = await request.post('/api/send-email', {
      data: {
        type: 'new_message',
        to: 'test@example.com',
        recipientName: 'Иван',
        senderName: 'Мария',
        messagePreview: 'Здравейте, интересувам се от задачата...'
      }
    })
    
    expect(response.status()).toBeLessThan(500)
  })

  test('should handle task application email type', async ({ request }) => {
    const response = await request.post('/api/send-email', {
      data: {
        type: 'task_application',
        to: 'test@example.com',
        taskOwner: 'Собственик',
        applicantName: 'Кандидат',
        taskTitle: 'Почистване на апартамент'
      }
    })
    
    expect(response.status()).toBeLessThan(500)
  })

})

