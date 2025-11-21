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
```bash
NEXT_PUBLIC_SUPABASE_URL=https://wwbxzkbilklullziiogr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Test credentials (optional)
TEST_USER_EMAIL=test-user@example.com
TEST_USER_PASSWORD=TestPassword123!
```

### CI/CD (GitHub Secrets)
- `TEST_USER_EMAIL` - Тестов потребител за Playwright
- `TEST_USER_PASSWORD` - Парола на тестов потребител
- `PLAYWRIGHT_TEST_BASE_URL` - (Опционално) URL за staging тестове

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

