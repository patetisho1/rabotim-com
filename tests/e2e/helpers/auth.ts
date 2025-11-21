import { Page } from '@playwright/test';

/**
 * Helper functions for authentication testing
 */

/**
 * Validates that required environment variables are set
 */
export function validateTestCredentials(email?: string, password?: string): void {
  if (!email || !password || email === 'test@example.com' || password === 'testpassword') {
    if (process.env.CI) {
      // In CI, this is a warning that should be addressed
      console.warn('⚠️  TEST_USER_EMAIL and TEST_USER_PASSWORD should be set as GitHub Secrets');
      console.warn('⚠️  Tests using fallback credentials may fail');
    }
    // In local development, it's less critical
  }
}

/**
 * Logs in a user with the provided credentials
 * @param page Playwright page object
 * @param email User email
 * @param password User password
 * @param retries Number of retry attempts (default: 2)
 * @returns true if login successful, false otherwise
 */
export async function login(
  page: Page, 
  email: string, 
  password: string,
  retries: number = 2
): Promise<boolean> {
  validateTestCredentials(email, password);
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await page.goto('/login');
      
      // Wait for form to be visible
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });
      await page.waitForSelector('input[type="password"]', { timeout: 10000 });
      
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', password);
      await page.click('button[type="submit"]');
      
      // Wait for navigation or success message
      const navigationSuccess = await page.waitForURL(/^\/(?!login)/, { timeout: 10000 }).catch(() => false);
      
      // Check if we're still on login page (failed login)
      const isStillOnLogin = page.url().includes('/login');
      
      if (navigationSuccess && !isStillOnLogin) {
        // Wait for any toast notifications or page load to complete
        await page.waitForTimeout(2000);
        return true;
      }
      
      // Check for error message
      const errorVisible = await page.locator('text=/греш|невалид|неправил|error/i').first().isVisible({ timeout: 2000 }).catch(() => false);
      if (errorVisible && attempt < retries) {
        // Retry after a short delay
        await page.waitForTimeout(1000);
        continue;
      }
      
      if (errorVisible) {
        return false;
      }
      
      // If no clear error but still on login, return false
      if (isStillOnLogin) {
        return false;
      }
      
      // Wait for any toast notifications or page load to complete
      await page.waitForTimeout(2000);
      return true;
    } catch (error) {
      if (attempt < retries) {
        console.warn(`Login attempt ${attempt + 1} failed, retrying...`);
        await page.waitForTimeout(1000);
        continue;
      }
      throw error;
    }
  }
  
  return false;
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

/**
 * Checks if user is logged in
 * @param page Playwright page object
 * @returns true if user is logged in, false otherwise
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  // Check if we're on login page - if so, definitely not logged in
  if (page.url().includes('/login')) {
    return false;
  }
  
  // Check if user menu, profile button, or logout button is visible
  const loggedInIndicators = [
    page.locator('button:has-text("Излез")'),
    page.locator('button:has-text("Изход")'),
    page.locator('[data-testid="user-menu"]'),
    page.locator('a[href="/profile"]'),
    page.locator('button:has-text("Профил")'),
    page.locator('button[aria-label*="profile"], button[aria-label*="профил"]')
  ];
  
  for (const indicator of loggedInIndicators) {
    const isVisible = await indicator.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      return true;
    }
  }
  
  // Check if logout button exists in any menu
  const logoutButtons = await page.locator('button:has-text("Излез"), button:has-text("Изход")').all();
  if (logoutButtons.length > 0) {
    return true;
  }
  
  // If we're on a protected route and not redirected to login, probably logged in
  const protectedRoutes = ['/my-tasks', '/post-task', '/profile', '/notifications'];
  const currentPath = new URL(page.url()).pathname;
  if (protectedRoutes.some(route => currentPath.startsWith(route))) {
    // If we can access protected route, likely logged in
    return !page.url().includes('/login');
  }
  
  return false;
}

