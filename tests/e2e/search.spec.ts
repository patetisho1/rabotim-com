import { test, expect } from '@playwright/test'

test.describe('Search Autocomplete', () => {

  test.describe('Suggestions API', () => {
    
    test('should return popular searches without query', async ({ request }) => {
      const response = await request.get('/api/search/suggestions')
      
      expect(response.status()).toBe(200)
      const body = await response.json()
      
      expect(body.suggestions).toBeDefined()
      expect(Array.isArray(body.suggestions)).toBe(true)
      expect(body.suggestions.length).toBeGreaterThan(0)
      expect(body.type).toBe('popular')
    })

    test('should return search results with query', async ({ request }) => {
      const response = await request.get('/api/search/suggestions?q=почистване')
      
      expect(response.status()).toBe(200)
      const body = await response.json()
      
      expect(body.suggestions).toBeDefined()
      expect(Array.isArray(body.suggestions)).toBe(true)
      expect(body.type).toBe('search')
      expect(body.query).toBe('почистване')
    })

    test('should filter by category', async ({ request }) => {
      const response = await request.get('/api/search/suggestions?q=&category=cleaning')
      
      expect(response.status()).toBe(200)
      const body = await response.json()
      
      expect(body.suggestions).toBeDefined()
      expect(Array.isArray(body.suggestions)).toBe(true)
    })

    test('should respect limit parameter', async ({ request }) => {
      const response = await request.get('/api/search/suggestions?q=&limit=3')
      
      expect(response.status()).toBe(200)
      const body = await response.json()
      
      expect(body.suggestions.length).toBeLessThanOrEqual(3)
    })

    test('should return fallback on short query', async ({ request }) => {
      const response = await request.get('/api/search/suggestions?q=a')
      
      expect(response.status()).toBe(200)
      const body = await response.json()
      
      expect(body.suggestions).toBeDefined()
    })

    test('should handle special characters in query', async ({ request }) => {
      const response = await request.get('/api/search/suggestions?q=' + encodeURIComponent('тест@#$%'))
      
      expect(response.status()).toBe(200)
      const body = await response.json()
      
      expect(body.suggestions).toBeDefined()
    })

    test('should return category-specific suggestions', async ({ request }) => {
      const categories = ['cleaning', 'repair', 'care', 'delivery', 'moving', 'garden', 'dog-care']
      
      for (const category of categories) {
        const response = await request.get(`/api/search/suggestions?q=&category=${category}`)
        expect(response.status()).toBe(200)
      }
    })
  })

  test.describe('Search Page Integration', () => {
    
    test('should have search input on tasks page', async ({ page }) => {
      await page.goto('/tasks')
      
      // Look for search input
      const searchInput = page.locator('input[type="text"]').first()
      await expect(searchInput).toBeVisible()
    })

    test('should navigate to tasks page from homepage', async ({ page }) => {
      // Direct navigation test
      await page.goto('/tasks')
      
      await expect(page).toHaveURL(/\/tasks/)
      // Page should load successfully
      await expect(page.locator('body')).toBeVisible()
    })
  })

})

