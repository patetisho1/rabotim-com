import { test, expect } from '@playwright/test'

test('home page loads and has hero CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /Публикувай обява/i })).toBeVisible()
})
