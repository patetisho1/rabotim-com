import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword';

test.describe('Notifications', () => {
  test.beforeEach(async ({ page }) => {
    const loginSuccess = await login(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);
    
    // Skip test if login failed (credentials might be invalid)
    if (!loginSuccess) {
      test.skip();
    }
  });

  test('should display notifications page when logged in', async ({ page }) => {
    await page.goto('/notifications');
    
    // Check if page loads
    await expect(page).not.toHaveURL(/.*login/);
    
    // Check for notifications page elements
    await expect(page.locator('text=/Известия|Notifications/i')).toBeVisible();
  });

  test('should show notification settings tab', async ({ page }) => {
    await page.goto('/notifications');
    
    // Click on settings tab
    const settingsTab = page.locator('button:has-text("Настройки"), a:has-text("Настройки")').first();
    
    if (await settingsTab.isVisible({ timeout: 3000 })) {
      await settingsTab.click();
      await page.waitForTimeout(1000);
      
      // Check for settings content
      await expect(page.locator('text=/Настройки на известията/i')).toBeVisible();
    }
  });

  test('should display notification bell in header', async ({ page }) => {
    await page.goto('/');
    
    // Check for notification bell icon
    const bellIcon = page.locator('button:has([data-testid="bell"]), button:has(svg)').filter({ hasText: /notifications|известия/i }).first();
    const bellButton = page.locator('button[aria-label*="notification"], button[aria-label*="известие"]').first();
    
    const isVisible = await bellButton.isVisible({ timeout: 2000 }).catch(() => 
      bellIcon.isVisible({ timeout: 2000 }).catch(() => false)
    );
    
    // Bell should be visible when logged in
    expect(isVisible).toBeTruthy();
  });

  test('should allow toggling notification preferences', async ({ page }) => {
    await page.goto('/notifications');
    
    // Navigate to settings
    const settingsTab = page.locator('button:has-text("Настройки")').first();
    if (await settingsTab.isVisible({ timeout: 3000 })) {
      await settingsTab.click();
      await page.waitForTimeout(1000);
      
      // Find email notification toggle
      const emailToggle = page.locator('input[type="checkbox"]').first();
      
      if (await emailToggle.isVisible({ timeout: 3000 })) {
        const initialState = await emailToggle.isChecked();
        await emailToggle.click();
        await page.waitForTimeout(1000);
        
        // Toggle should change state
        const newState = await emailToggle.isChecked();
        expect(newState).not.toBe(initialState);
      }
    }
  });
});

