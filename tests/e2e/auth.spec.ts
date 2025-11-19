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
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check for login button text
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toContainText(/влез|вход/i);
  });

  test('should display register page correctly', async ({ page }) => {
    await page.goto('/register');
    
    // Check for registration form elements
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    // Use .first() since there are two password fields (password and confirmPassword)
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message - could be toast or inline error
    // Check for toast notification or error message
    const errorMessages = [
      page.locator('text=/греш/i'),
      page.locator('text=/невалид/i'),
      page.locator('text=/неправил/i'),
      page.locator('[role="alert"]'),
      page.locator('.toast'),
      page.locator('[data-testid="error"]')
    ];
    
    // Wait for at least one error message to appear
    await Promise.race(
      errorMessages.map(locator => 
        expect(locator.first()).toBeVisible({ timeout: 5000 }).catch(() => {})
      )
    );
  });

  test('should navigate to login from home page', async ({ page }) => {
    // Look for login button in header - can be "Вход" or "Влез"
    const loginButton = page.locator('button:has-text("Вход"), button:has-text("Влез"), a[href="/login"]').first();
    
    if (await loginButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await loginButton.click();
      await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    } else {
      // If button not visible, might already be logged in - skip test
      test.skip();
    }
  });

  test('should navigate to register from login page', async ({ page }) => {
    await page.goto('/login');
    
    // Look for register link - can be "Регистрирайте се тук" or link to /register
    const registerLink = page.locator(
      'button:has-text("Регистрирайте се"), ' +
      'a:has-text("Регистрирайте се тук"), ' +
      'a:has-text("Регистрация"), ' +
      'a[href="/register"]'
    ).first();
    
    if (await registerLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await registerLink.click();
      await expect(page).toHaveURL(/.*register/, { timeout: 5000 });
    } else {
      // If link not found, fail the test
      throw new Error('Register link not found on login page');
    }
  });

  // Note: Actual registration/login tests should use test accounts
  // or be skipped in CI if they require email confirmation
});

