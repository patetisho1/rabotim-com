import { Page } from '@playwright/test';

/**
 * Helper functions for authentication testing
 */

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  
  // Wait for form to be visible
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation or success message
  await page.waitForURL(/^\/(?!login)/, { timeout: 10000 }).catch(() => {});
  
  // Wait for any toast notifications or page load to complete
  await page.waitForTimeout(2000);
}

export async function register(page: Page, email: string, password: string, fullName: string) {
  await page.goto('/register');
  
  // Wait for form to be visible
  await page.waitForSelector('input[name="firstName"]', { timeout: 10000 });
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  
  // Split fullName into firstName and lastName
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || fullName;
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Fill registration form
  await page.fill('input[name="firstName"]', firstName);
  if (lastName) {
    await page.fill('input[name="lastName"]', lastName);
  }
  await page.fill('input[type="email"]', email);
  
  // Find password inputs (might be multiple - password and confirmPassword)
  const passwordInputs = await page.locator('input[type="password"]').all();
  if (passwordInputs.length > 0) {
    await passwordInputs[0].fill(password);
  }
  if (passwordInputs.length > 1) {
    await passwordInputs[1].fill(password);
  }
  
  // Select at least one role checkbox
  const taskGiverCheckbox = page.locator('input[name="roles.taskGiver"]');
  if (await taskGiverCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
    await taskGiverCheckbox.check();
  }
  
  // Accept terms
  const termsCheckbox = page.locator('input[type="checkbox"][name*="agree"], input[type="checkbox"][name*="terms"]').first();
  if (await termsCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
    await termsCheckbox.check();
  }
  
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
  // Check if user menu, profile button, or logout button is visible
  const loggedInIndicators = [
    page.locator('button:has-text("Излез")'),
    page.locator('button:has-text("Изход")'),
    page.locator('[data-testid="user-menu"]'),
    page.locator('a[href="/profile"]'),
    page.locator('button:has-text("Профил")')
  ];
  
  for (const indicator of loggedInIndicators) {
    if (await indicator.isVisible({ timeout: 2000 }).catch(() => false)) {
      return true;
    }
  }
  
  return false;
}

