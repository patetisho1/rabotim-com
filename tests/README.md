# E2E Tests with Playwright

This directory contains end-to-end tests for Rabotim.com using Playwright.

## 📚 Documentation

- **[Environment Setup](./ENVIRONMENT_SETUP.md)** - Как да настроиш environment variables
- **[CI/CD Setup](./SETUP_CI.md)** - Как да настроиш GitHub Actions
- **[Test Analysis](./TEST_ANALYSIS.md)** - Анализ на тестовете и подобрения

## Setup

Tests are already configured. Just install browsers:

```bash
npx playwright install --with-deps
```

### Environment Variables

⚠️ **Важно:** Тестовете изискват environment variables за да работят.

**Локално:**
Създай `.env.local` файл:
```bash
TEST_USER_EMAIL=test-user@example.com
TEST_USER_PASSWORD=TestPassword123!
```

**CI/CD (GitHub Actions):**
Настрой GitHub Secrets (виж [SETUP_CI.md](./SETUP_CI.md))

За подробни инструкции виж [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md).

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

### Setup for CI/CD

**Задължително:**
1. ⚠️ Настрой `TEST_USER_EMAIL` в GitHub Secrets
2. ⚠️ Настрой `TEST_USER_PASSWORD` в GitHub Secrets
3. ⚠️ Създай тестови потребител в Supabase

**Опционално:**
- `PLAYWRIGHT_TEST_BASE_URL` - за тестване на staging/production

За подробни инструкции виж [SETUP_CI.md](./SETUP_CI.md).

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

