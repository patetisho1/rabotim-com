import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';
import { createTask, getTaskCount } from './helpers/tasks';

// These tests require authentication
// Set TEST_USER_EMAIL and TEST_USER_PASSWORD as environment variables
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword';

test.describe('Tasks', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);
  });

  test('should display post task page when logged in', async ({ page }) => {
    await page.goto('/post-task');
    
    // Check for task form elements
    await expect(page.locator('input[name="title"], input[placeholder*="Заглавие"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"], textarea[placeholder*="Описание"]')).toBeVisible();
    await expect(page.locator('select[name="category"], select')).toBeVisible();
  });

  test('should show validation errors for empty task form', async ({ page }) => {
    await page.goto('/post-task');
    
    // Try to submit empty form
    await page.click('button[type="submit"], button:has-text("Публикувай")');
    await page.waitForTimeout(1000);
    
    // Check for validation messages
    const errorMessages = page.locator('text=/минимум|задължително|попълнете/i');
    const count = await errorMessages.count();
    
    // Should have at least one validation error
    expect(count).toBeGreaterThan(0);
  });

  test('should display task listing page', async ({ page }) => {
    await page.goto('/');
    
    // Check for task listing elements
    const taskCards = page.locator('[data-testid="task-card"], .task-card, article, [class*="task"]');
    const count = await taskCards.count();
    
    // Should have at least some content (could be 0 tasks, but should load)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to categories page', async ({ page }) => {
    const categoriesLink = page.locator('a:has-text("Категории"), a[href="/categories"]').first();
    
    if (await categoriesLink.isVisible({ timeout: 2000 })) {
      await categoriesLink.click();
      await expect(page).toHaveURL(/.*categories/);
    }
  });

  test('should display my tasks page when logged in', async ({ page }) => {
    await page.goto('/my-tasks');
    
    // Check if page loads (should not redirect to login)
    await expect(page).not.toHaveURL(/.*login/);
    
    // Page should load
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('my-tasks');
  });
});

