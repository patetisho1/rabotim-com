# 🔑 Environment Variables Setup for Tests

**Дата:** $(Get-Date -Format "yyyy-MM-dd")

---

## 📋 Required Environment Variables

### For Local Development

Създай `.env.local` файл в root директорията:

```bash
# Test credentials for Playwright E2E tests
TEST_USER_EMAIL=test-user@example.com
TEST_USER_PASSWORD=TestPassword123!

# Optional: Override base URL for tests
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
```

### For CI/CD (GitHub Actions)

Настрой GitHub Secrets:
1. Отиди в **Settings** → **Secrets and variables** → **Actions**
2. Добави следните secrets:

```
TEST_USER_EMAIL=test-user@example.com
TEST_USER_PASSWORD=TestPassword123!
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000  # Optional
```

---

## ⚠️ Important Notes

1. **Test User Setup:**
   - Тестовия потребител трябва да съществува в Supabase
   - Email confirmation трябва да е потвърден (или изключено в Supabase settings)

2. **Security:**
   - ⚠️ НЕ комитвай `.env.local` в git
   - ⚠️ TEST_USER_PASSWORD трябва да е силен парола
   - ⚠️ Използвай различни credentials за staging/production

3. **Fallback Values:**
   - Ако environment variables не са настроени, тестовете ще използват:
     - `TEST_USER_EMAIL=test@example.com`
     - `TEST_USER_PASSWORD=testpassword`
   - ⚠️ Тези fallback стойности вероятно НЕ ЩЕ РАБОТЯТ в реална база данни

---

## 🧪 Test User Preparation

### Step 1: Create Test User in Supabase

1. Отвори Supabase Dashboard
2. Отиди в **Authentication** → **Users**
3. Кликни **Add user** → **Create new user**
4. Въведи:
   - Email: `test-user@example.com` (или каквото си задал)
   - Password: `TestPassword123!` (или каквото си задал)
   - ⚠️ Убеди се че email confirmation е потвърден

### Step 2: Verify Test User

Тествай локално:

```bash
# Set environment variables
export TEST_USER_EMAIL=test-user@example.com
export TEST_USER_PASSWORD=TestPassword123!

# Run auth test
npm run test:e2e -- tests/e2e/auth.spec.ts
```

### Step 3: Update GitHub Secrets

Ако тестовия потребител работи локално:
1. Отиди в GitHub → Settings → Secrets
2. Добави/обнови `TEST_USER_EMAIL` и `TEST_USER_PASSWORD`

---

## 🔍 Validation

Тестовете автоматично проверяват дали environment variables са настроени:

```typescript
// In tests/e2e/helpers/auth.ts
validateTestCredentials(email, password);
// Prints warning if using fallback values
```

---

## 📝 Example Setup Script

Създай `setup-test-user.sh` (за Unix/Mac) или `setup-test-user.ps1` (за Windows):

```bash
#!/bin/bash
# setup-test-user.sh

echo "Setting up test user for Playwright tests..."

read -p "Enter test user email: " TEST_EMAIL
read -sp "Enter test user password: " TEST_PASSWORD
echo ""

# Export for current session
export TEST_USER_EMAIL=$TEST_EMAIL
export TEST_USER_PASSWORD=$TEST_PASSWORD

# Add to .env.local
echo "TEST_USER_EMAIL=$TEST_EMAIL" >> .env.local
echo "TEST_USER_PASSWORD=$TEST_PASSWORD" >> .env.local

echo "✅ Test user configured!"
echo "⚠️  Remember to create this user in Supabase!"
```

---

## 🔗 Related Documentation

- **CI Setup:** [SETUP_CI.md](./SETUP_CI.md)
- **Test Helpers:** [helpers/](../tests/e2e/helpers/)
- **Playwright Config:** [playwright.config.ts](../playwright.config.ts)

