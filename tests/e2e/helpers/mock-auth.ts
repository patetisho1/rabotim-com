import { Page, BrowserContext } from '@playwright/test';

/**
 * Mock Authentication Helper for E2E Tests
 * 
 * This module provides functions to simulate authenticated state
 * without making actual API calls to Supabase.
 */

// Mock user data
export const MOCK_USER = {
  id: 'e2e-test-user-00000000-0000-0000-0000-000000000001',
  email: 'e2e-test@rabotim.com',
  full_name: 'E2E Test User',
  avatar_url: null,
  phone: '+359888123456',
  role: 'authenticated',
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Supabase project reference (from your Supabase URL)
const SUPABASE_PROJECT_REF = 'wwbxzkbilklullziiogr';
const STORAGE_KEY = `sb-${SUPABASE_PROJECT_REF}-auth-token`;

/**
 * Creates a mock Supabase session object
 */
function createMockSession() {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 3600; // 1 hour
  
  return {
    access_token: `mock-access-token-${Date.now()}`,
    refresh_token: `mock-refresh-token-${Date.now()}`,
    expires_in: expiresIn,
    expires_at: now + expiresIn,
    token_type: 'bearer',
    user: {
      id: MOCK_USER.id,
      aud: MOCK_USER.aud,
      role: MOCK_USER.role,
      email: MOCK_USER.email,
      email_confirmed_at: MOCK_USER.created_at,
      phone: MOCK_USER.phone,
      confirmed_at: MOCK_USER.created_at,
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'email',
        providers: ['email']
      },
      user_metadata: {
        full_name: MOCK_USER.full_name,
        avatar_url: MOCK_USER.avatar_url
      },
      identities: [],
      created_at: MOCK_USER.created_at,
      updated_at: MOCK_USER.updated_at
    }
  };
}

/**
 * Injects mock authentication state into the page's localStorage
 * Call this BEFORE navigating to any page
 * 
 * @param page - Playwright page object
 */
export async function injectMockAuth(page: Page): Promise<void> {
  const mockSession = createMockSession();
  
  // Add script that will run before page loads
  await page.addInitScript((data) => {
    const { storageKey, session } = data;
    localStorage.setItem(storageKey, JSON.stringify(session));
  }, { storageKey: STORAGE_KEY, session: mockSession });
}

/**
 * Sets up mock authentication for a browser context
 * This affects all pages opened in this context
 * 
 * @param context - Playwright browser context
 */
export async function setupMockAuthContext(context: BrowserContext): Promise<void> {
  const mockSession = createMockSession();
  
  // Add init script to context - will run on every new page
  await context.addInitScript((data) => {
    const { storageKey, session } = data;
    localStorage.setItem(storageKey, JSON.stringify(session));
  }, { storageKey: STORAGE_KEY, session: mockSession });
}

/**
 * Clears mock authentication state
 * 
 * @param page - Playwright page object
 */
export async function clearMockAuth(page: Page): Promise<void> {
  await page.evaluate((storageKey) => {
    localStorage.removeItem(storageKey);
  }, STORAGE_KEY);
}

/**
 * Sets up API route mocking for Supabase auth endpoints
 * This intercepts actual API calls and returns mock responses
 * 
 * @param page - Playwright page object
 */
export async function mockSupabaseAuthAPI(page: Page): Promise<void> {
  const mockSession = createMockSession();
  
  // Mock the auth session endpoint
  await page.route('**/auth/v1/token**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession)
    });
  });
  
  // Mock the user endpoint
  await page.route('**/auth/v1/user**', async route => {
    const method = route.request().method();
    
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSession.user)
      });
    } else {
      await route.continue();
    }
  });
  
  // Mock session refresh
  await page.route('**/auth/v1/token?grant_type=refresh_token**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession)
    });
  });
}

/**
 * Complete mock auth setup - combines localStorage injection and API mocking
 * Use this for most test scenarios
 * 
 * @param page - Playwright page object
 */
export async function setupMockAuth(page: Page): Promise<void> {
  await injectMockAuth(page);
  await mockSupabaseAuthAPI(page);
}

/**
 * Navigates to a page with mock authentication already set up
 * 
 * @param page - Playwright page object
 * @param url - URL to navigate to
 */
export async function gotoWithMockAuth(page: Page, url: string): Promise<void> {
  await setupMockAuth(page);
  await page.goto(url);
}

/**
 * Checks if mock auth is properly set up in the page
 * 
 * @param page - Playwright page object
 * @returns true if mock auth is present
 */
export async function hasMockAuth(page: Page): Promise<boolean> {
  return await page.evaluate((storageKey) => {
    const session = localStorage.getItem(storageKey);
    return session !== null;
  }, STORAGE_KEY);
}

/**
 * Gets the current mock user data
 */
export function getMockUser() {
  return { ...MOCK_USER };
}

/**
 * Creates a custom mock user with specific properties
 * 
 * @param overrides - Properties to override in the mock user
 */
export function createCustomMockUser(overrides: Partial<typeof MOCK_USER>) {
  return { ...MOCK_USER, ...overrides };
}

/**
 * Dismisses the cookie consent banner if present
 * Sets localStorage to prevent it from showing again
 * 
 * @param page - Playwright page object
 */
export async function dismissCookieConsent(page: Page): Promise<void> {
  // Set cookie consent in localStorage before any page load
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false
    }));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  });
}

/**
 * Complete mock auth setup with cookie consent dismissed
 * Use this for most test scenarios to avoid cookie banner blocking
 * 
 * @param page - Playwright page object
 */
export async function setupMockAuthWithCookies(page: Page): Promise<void> {
  await dismissCookieConsent(page);
  await injectMockAuth(page);
  await mockSupabaseAuthAPI(page);
}

