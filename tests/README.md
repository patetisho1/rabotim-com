# E2E Tests with Playwright

This directory contains end-to-end tests for Rabotim.com using Playwright.

## Setup

Tests are already configured. Just install browsers:

```bash
npx playwright install --with-deps
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (recommended for development)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### View test report
```bash
npm run test:e2e:report
```

## Test Structure

- `e2e/` - End-to-end test files
  - `auth.spec.ts` - Authentication tests (login, register)
  - `tasks.spec.ts` - Task-related tests (create, list, apply)
  - `notifications.spec.ts` - Notification tests
  - `navigation.spec.ts` - Navigation and routing tests
  - `helpers/` - Helper functions for tests
    - `auth.ts` - Authentication helpers
    - `tasks.ts` - Task helpers

## Configuration

Tests run against `http://localhost:3000` by default. To change this, set:
```bash
PLAYWRIGHT_TEST_BASE_URL=http://your-url.com
```

## CI/CD

Tests automatically run on push to `main` or `staging` branches via GitHub Actions.

To run tests against staging/production:
1. Set `PLAYWRIGHT_TEST_BASE_URL` in GitHub Secrets
2. Set `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` for authenticated tests

## Writing New Tests

1. Create a new `.spec.ts` file in `tests/e2e/`
2. Use helper functions from `helpers/` when possible
3. Follow the existing test structure
4. Use descriptive test names

Example:
```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/my-page');
    await expect(page.locator('h1')).toHaveText('Expected Text');
  });
});
```

## AI Test Analysis

If tests fail, you can ask AI to analyze and fix them:

1. **After tests fail**, say: `тестовете се провалиха, провери ги`
2. **AI will:**
   - Read test results from `test-analysis-report.txt` or `playwright-report/`
   - Analyze the failures
   - Fix the code
   - Show you the changes
   - Ask for permission before pushing

3. **You approve:** Say "да, пушни" or just "продължи"

See `scripts/ai-test-helper.md` for detailed instructions.

