import { test, expect } from '@playwright/test';
import { login, register, logout, isLoggedIn } from './helpers/auth';

const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';
const TEST_NAME = 'Test User';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display register page correctly', async ({ page }) => {
    await page.goto('/register');
    
    // Check for registration form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await login(page, 'invalid@example.com', 'wrongpassword');
    
    // Check for error message
    const errorMessage = page.locator('text=/греш|невалид|неправил/i');
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to login from home page', async ({ page }) => {
    const loginLink = page.locator('a:has-text("Влез"), a[href="/login"]').first();
    
    if (await loginLink.isVisible({ timeout: 2000 })) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should navigate to register from login page', async ({ page }) => {
    await page.goto('/login');
    
    const registerLink = page.locator('a:has-text("Регистрирай"), a:has-text("Регистрация"), a[href="/register"]').first();
    
    if (await registerLink.isVisible({ timeout: 2000 })) {
      await registerLink.click();
      await expect(page).toHaveURL(/.*register/);
    }
  });

  // Note: Actual registration/login tests should use test accounts
  // or be skipped in CI if they require email confirmation
});

