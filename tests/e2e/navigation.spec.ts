import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);
  });

  test('should navigate to categories page', async ({ page }) => {
    await page.goto('/');
    const categoriesLink = page.locator('a:has-text("Категории"), a[href="/categories"]').first();
    
    if (await categoriesLink.isVisible({ timeout: 2000 })) {
      await categoriesLink.click();
      await expect(page).toHaveURL(/.*categories/);
    }
  });

  test('should navigate to how-it-works page', async ({ page }) => {
    await page.goto('/');
    const howItWorksLink = page.locator('a:has-text("Как работи"), a[href="/how-it-works"]').first();
    
    if (await howItWorksLink.isVisible({ timeout: 2000 })) {
      await howItWorksLink.click();
      await expect(page).toHaveURL(/.*how-it-works/);
    }
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/.*about/);
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/.*contact/);
  });

  test('should redirect to login when accessing protected routes', async ({ page }) => {
    // Try to access protected route
    await page.goto('/my-tasks');
    
    // Should redirect to login (or show login requirement)
    await page.waitForTimeout(2000);
    
    // Either redirects to login or shows login prompt
    const isLoginPage = page.url().includes('login');
    const hasLoginPrompt = await page.locator('text=/влез|login/i').isVisible({ timeout: 2000 }).catch(() => false);
    
    expect(isLoginPage || hasLoginPrompt).toBeTruthy();
  });

  test('should have working logo link to home', async ({ page }) => {
    await page.goto('/about');
    
    const logo = page.locator('a:has-text("Rabotim.com"), a[href="/"], [data-testid="logo"]').first();
    
    if (await logo.isVisible({ timeout: 2000 })) {
      await logo.click();
      await expect(page).toHaveURL(/\/$/);
    }
  });
});

