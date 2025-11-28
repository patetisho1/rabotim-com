import { test, expect } from '@playwright/test'

test.describe('Seed Data API', () => {
  
  test('should have seed API endpoint available', async ({ request }) => {
    // In development, seed endpoint should be accessible
    const response = await request.post('/api/seed')
    
    // Should return 200 or indicate data already exists
    expect(response.status()).toBeLessThan(500)
    
    const body = await response.json()
    expect(body).toHaveProperty('success')
  })

  test('should handle seed request gracefully', async ({ request }) => {
    // Seed endpoint should handle various scenarios
    const response = await request.post('/api/seed')
    
    // Should not return server error
    expect(response.status()).toBeLessThan(500)
    
    const body = await response.json()
    
    // Should have either success or error info
    expect(body).toBeDefined()
    // If success, check message; if error, that's also valid (e.g., no users)
    if (body.success) {
      expect(body.message).toBeDefined()
    }
  })

})

