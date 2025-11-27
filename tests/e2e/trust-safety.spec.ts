import { test, expect } from '@playwright/test'

test.describe('Trust & Safety APIs', () => {

  test.describe('Reports API', () => {
    
    test('should require all mandatory fields', async ({ request }) => {
      const response = await request.post('/api/reports', {
        data: {
          reporter_id: 'test-user-id'
          // Missing required fields
        }
      })
      
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('задължителни')
    })

    test('should validate reported_type', async ({ request }) => {
      const response = await request.post('/api/reports', {
        data: {
          reporter_id: 'test-user-id',
          reported_type: 'invalid_type',
          reported_id: 'test-id',
          reason: 'spam'
        }
      })
      
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('reported_type')
    })

    test('should validate reason', async ({ request }) => {
      const response = await request.post('/api/reports', {
        data: {
          reporter_id: 'test-user-id',
          reported_type: 'task',
          reported_id: 'test-id',
          reason: 'invalid_reason'
        }
      })
      
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('причина')
    })

    test('should accept valid report data', async ({ request }) => {
      const response = await request.post('/api/reports', {
        data: {
          reporter_id: 'test-user-id',
          reported_type: 'task',
          reported_id: 'test-task-id',
          reason: 'spam',
          description: 'Test report'
        }
      })
      
      // Should not return server error
      expect(response.status()).toBeLessThan(500)
      
      const body = await response.json()
      expect(body).toBeDefined()
    })

    test('should return empty reports list', async ({ request }) => {
      const response = await request.get('/api/reports')
      
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.reports).toBeDefined()
      expect(Array.isArray(body.reports)).toBe(true)
    })
  })

  test.describe('Blocks API', () => {
    
    test('should require blocker_id and blocked_id', async ({ request }) => {
      const response = await request.post('/api/blocks', {
        data: {
          blocker_id: 'test-user-id'
          // Missing blocked_id
        }
      })
      
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('задължителни')
    })

    test('should prevent blocking self', async ({ request }) => {
      const response = await request.post('/api/blocks', {
        data: {
          blocker_id: 'same-user-id',
          blocked_id: 'same-user-id'
        }
      })
      
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('себе си')
    })

    test('should accept valid block data', async ({ request }) => {
      const response = await request.post('/api/blocks', {
        data: {
          blocker_id: 'test-user-id',
          blocked_id: 'other-user-id'
        }
      })
      
      // Should not return server error
      expect(response.status()).toBeLessThan(500)
      
      const body = await response.json()
      expect(body).toBeDefined()
    })

    test('should require user_id for GET', async ({ request }) => {
      const response = await request.get('/api/blocks')
      
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('user_id')
    })

    test('should return empty blocks list for user', async ({ request }) => {
      const response = await request.get('/api/blocks?user_id=test-user-id')
      
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.blocks).toBeDefined()
      expect(Array.isArray(body.blocks)).toBe(true)
    })
  })

})

