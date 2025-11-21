# 💬 Chat Context - Rabotim.com Project

**Последно обновен:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Проект:** Rabotim.com - Българска платформа за задачи и freelancing

---

## 📋 Текущо Състояние на Проекта

### ✅ Завършени Функционалности

1. **Authentication System**
   - Регистрация и login с Supabase Auth
   - Session management
   - Protected routes

2. **Task Management**
   - Публикуване на задачи (`/post-task`)
   - Разглеждане на задачи (`/tasks`)
   - Детайли на задачи (`/task/[id]`)
   - Мои задачи (`/my-tasks`)

3. **Notifications System**
   - API endpoints за нотификации
   - Notification preferences
   - Real-time notifications

4. **Messaging System**
   - Real-time messaging с Supabase Realtime
   - Conversation management
   - Message history

5. **Testing Infrastructure**
   - Playwright E2E tests
   - GitHub Actions CI/CD
   - Test helpers и документация

---

## 🔧 Технически Детайли

### Backend
- **Supabase** за database, auth, storage
- **Next.js 14** App Router
- **TypeScript** за type safety
- **Row Level Security (RLS)** policies

### Frontend
- **React** с Next.js
- **Tailwind CSS** за styling
- **Lucide Icons** за икони
- **Context API** за state management

### Testing
- **Playwright** за E2E тестове
- **GitHub Actions** за CI/CD
- Test coverage на критични flows

---

## 📦 Environment Variables

### Локална Разработка (`.env.local`)

**⚠️ ВАЖНО:** Този файл НЕ се commit-ва в git заради `.gitignore`. Създай го след clone:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wwbxzkbilklullziiogr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Test credentials (optional, за Playwright тестове)
TEST_USER_EMAIL=test-user@example.com
TEST_USER_PASSWORD=TestPassword123!

# Optional: Override base URL for tests
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
```

**Как да намериш keys:**
1. Supabase Dashboard → Settings → API
2. `NEXT_PUBLIC_SUPABASE_URL` - Project URL
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - `anon` `public` key
4. `SUPABASE_SERVICE_ROLE_KEY` - `service_role` `secret` key (⚠️ НЕ го споделяй!)

### CI/CD (GitHub Secrets)

Настрой в GitHub → Settings → Secrets and variables → Actions:
- `TEST_USER_EMAIL` - Тестов потребител за Playwright
- `TEST_USER_PASSWORD` - Парола на тестов потребител
- `PLAYWRIGHT_TEST_BASE_URL` - (Опционално) URL за staging тестове

---

## 🔧 Важни Конфигурации

### Package Versions (package.json)

**Core Dependencies:**
- `next`: `13.5.6`
- `react`: `^18`
- `@supabase/supabase-js`: `^2.54.0`
- `@supabase/ssr`: `^0.7.0`
- `typescript`: `^5`

**Key Dependencies:**
- `lucide-react`: `^0.292.0` (икони)
- `react-hot-toast`: `^2.4.1` (notifications)
- `tailwindcss`: `^3.3.0` (styling)
- `@playwright/test`: `^1.56.1` (E2E тестове)

**Важно:** Виж `package.json` за пълния списък. След clone изпълни:
```bash
npm install
```

### Next.js Configuration (next.config.js)

**Важни настройки:**
- Image optimization: Supabase Storage + Unsplash
- SWC minify enabled
- Compression enabled
- Security headers (X-Frame-Options, X-XSS-Protection)
- Webpack optimizations за production

**Supabase Image Domain:**
- `wwbxzkbilklullziiogr.supabase.co` (в next.config.js)

### Tailwind CSS Configuration (tailwind.config.js)

**Custom Colors:**
- Primary (blue): 50, 100, 500, 600, 700
- Secondary (yellow): 50, 100, 500, 600
- Success (green): 50, 100, 500, 600
- Danger (red): 50, 100, 500, 600

**Dark Mode:** `class` (enabled)

---

## 🛠️ Setup Instructions

### След Преинсталация:

#### 1. Clone проекта
```powershell
git clone https://github.com/patetisho1/rabotim-com.git
cd rabotim-com
git checkout staging
```

#### 2. Инсталирай зависимости
```powershell
npm install
```

#### 3. Създай `.env.local` файл
```powershell
# Копирай структурата от env.example
copy env.example .env.local
# Или създай ръчно с редактор
code .env.local
```

**Попълни следните стойности:**
- `NEXT_PUBLIC_SUPABASE_URL` - от Supabase Dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - от Supabase Dashboard
- `SUPABASE_SERVICE_ROLE_KEY` - от Supabase Dashboard (ако е необходимо)

#### 4. Провери конфигурациите
```powershell
# Провери дали package.json е правилен
cat package.json

# Провери next.config.js
cat next.config.js
```

#### 5. Стартирай dev server
```powershell
npm run dev
```

#### 6. Тествай локално
```powershell
# Отвори в браузър
# http://localhost:3000

# Тествай build
npm run build
```

#### 7. Настрой Cursor IDE (Опционално)

Създай `.vscode/settings.json` (ако го искаш):
```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 🎯 Последни Промени

### Test Improvements (Commit: 0531b59)
- Подобрени helper функции с retry логика
- Добавена валидация на environment variables
- Подобрена error handling в тестовете
- Създадена документация за CI/CD setup

### Build Fixes
- Добавени `export const dynamic = 'force-dynamic'` към API routes
- Оправени TypeScript errors
- Build минава успешно

---

## 📝 Важни Бележки

### За Тестовете
- Тестовете изискват `TEST_USER_EMAIL` и `TEST_USER_PASSWORD`
- Тестов потребител трябва да съществува в Supabase
- Тестовете пропускат ако login не успее

### За Build
- Build минава успешно
- Няма linter errors
- Има warnings за TypeScript `any` типове (127 места)

### За Deployment
- Vercel deployment минава успешно
- GitHub Actions workflow е настроен
- Playwright тестове се изпълняват автоматично

---

## 🔗 Полезни Линкове

- **GitHub:** https://github.com/patetisho1/rabotim-com
- **GitHub Actions:** https://github.com/patetisho1/rabotim-com/actions
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## 🚀 Следващи Стъпки

1. Разширяване на test coverage
2. Подобряване на code quality (намаляване на `any` типове)
3. Добавяне на нова функционалност според бизнес нуждите

---

## 💡 Как да Възстановиш Контекста

След преинсталация на компютъра:

1. **Clone на репозиторията:**
   ```bash
   git clone https://github.com/patetisho1/rabotim-com.git
   cd rabotim-com
   ```

2. **Прочети този файл:**
   ```bash
   cat CHAT_CONTEXT.md
   # или
   code CHAT_CONTEXT.md
   ```

3. **Стартирай AI чата и му кажи:**
   ```
   Прочети CHAT_CONTEXT.md файла и възстанови контекста на проекта.
   ```

4. **Или използвай скрипта за възстановяване:**
   ```bash
   # Windows PowerShell
   .\restore-chat-context.ps1
   ```

---

## 📌 Важни Файлове

- `CHAT_CONTEXT.md` - Този файл (контекст на проекта)
- `README.md` - Обща документация
- `TEST_IMPROVEMENTS_SUMMARY.md` - Последни тестови подобрения
- `DIAGNOSTIC_REPORT.md` - Диагностичен отчет
- `tests/SETUP_CI.md` - CI/CD setup guide

---

_Запази този файл в git за да можеш да възстановиш контекста след преинсталация._

