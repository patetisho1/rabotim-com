import { Page } from '@playwright/test';

/**
 * Helper functions for authentication testing
 */

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation or success message
  await page.waitForURL(/^\/(?!login)/, { timeout: 10000 }).catch(() => {});
  
  // Wait for any toast notifications to appear
  await page.waitForTimeout(2000);
}

export async function register(page: Page, email: string, password: string, fullName: string) {
  await page.goto('/register');
  await page.fill('input[name="fullName"], input[placeholder*="име"], input[type="text"]', fullName);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation or success message
  await page.waitForTimeout(3000);
}

export async function logout(page: Page) {
  // Try to find logout button in header or profile menu
  const logoutButton = page.locator('button:has-text("Излез"), button:has-text("Изход"), a:has-text("Излез")').first();
  
  if (await logoutButton.isVisible({ timeout: 2000 })) {
    await logoutButton.click();
    await page.waitForURL(/^\/(login|)$/, { timeout: 5000 }).catch(() => {});
  }
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  // Check if user menu or profile button is visible
  const userMenu = page.locator('button:has-text("Излез"), [data-testid="user-menu"], a[href="/profile"]').first();
  return await userMenu.isVisible({ timeout: 2000 }).catch(() => false);
}

