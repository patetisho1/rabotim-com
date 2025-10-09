# ЛОКАЛЕН ГАЙД ЗА НАСТРОЙКА - RABOTIM.COM

## 📋 СИСТЕМНИ ИЗИСКВАНИЯ
```
- Windows 10/11
- Node.js 18+ (проверка: node --version)
- Git (проверка: git --version)
- PowerShell (вграден в Windows)
- Cursor IDE (или VS Code)
```

## 🔧 CURSOR IDE НАСТРОЙКИ

### Основни настройки:
```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "chat.history.enabled": true,
  "chat.history.persist": true,
  "chat.autoSave": true
}
```

### Extensions (задължителни):
- **TypeScript Importer** - автоматично импортиране
- **Prettier** - код форматиране
- **ESLint** - код проверка
- **Auto Rename Tag** - автоматично преименуване
- **Bracket Pair Colorizer** - цветни скоби

## 📁 ПРОЕКТНА СТРУКТУРА
```
rabotim-com/
├── app/
│   ├── admin/          # Админ панел
│   ├── api/            # API routes
│   ├── tasks/          # Страници за задачи
│   ├── profile/        # Потребителски профил
│   ├── login/          # Логин страница
│   ├── post-task/      # Публикуване на задача
│   └── layout.tsx      # Главен layout
├── components/         # React компоненти
│   ├── AdminDashboard.tsx
│   ├── UserManagement.tsx
│   ├── TaskManagement.tsx
│   ├── Header.tsx
│   ├── TaskCard.tsx
│   └── ...
├── hooks/             # Custom hooks
│   ├── useTasksAPI.ts
│   ├── useAuth.ts
│   └── ...
├── lib/               # Utility функции
│   ├── supabase.ts
│   └── email.ts
├── supabase/          # Database migrations
│   └── migrations/
├── types/             # TypeScript типове
├── .env.local         # Environment variables
├── package.json       # Dependencies
└── README.md
```

## 🔐 ENVIRONMENT VARIABLES (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🚀 НАЧАЛНА НАСТРОЙКА (PowerShell)

### 1. Копиране на проекта:
```powershell
# Копирай цялата папка rabotim-com на новия компютър
# След това:
cd rabotim-com
```

### 2. Инсталиране на dependencies:
```powershell
npm install
```

### 3. Създаване на .env.local:
```powershell
# Създай .env.local файл с твоите Supabase credentials
echo "NEXT_PUBLIC_SUPABASE_URL=your-url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key" >> .env.local
```

### 4. Тестване на настройката:
```powershell
npm run dev
# Отвори http://localhost:3000
```

## 🔄 ЕЖЕДНЕВЕН WORKFLOW

### Проверка на статуса:
```powershell
git status
git branch -a
```

### Работа с промени:
```powershell
# Добавяне на промени
git add .

# Commit с описателно съобщение
git commit -m "fix: описание на промяната"
git commit -m "feat: нова функционалност"
git commit -m "refactor: подобряване на кода"

# Push към staging
git push origin staging
```

### Работа с production:
```powershell
# След тестване на staging
git checkout main
git merge staging
git push origin main
```

## 🛠️ DEVELOPMENT COMMANDS

### Основни команди:
```powershell
# Стартиране на dev сървър
npm run dev

# Build за production
npm run build

# Проверка на типове
npm run type-check

# Линтинг
npm run lint

# Тестване
npm test
```

### Troubleshooting:
```powershell
# Ако npm install не работи
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install

# Ако git push не работи
git pull origin staging
git push origin staging

# Ако build фейлва
npm run build
# Провери грешките и поправи TypeScript errors
```

## 🌐 DEPLOYMENT FLOW

### Staging (автоматичен):
```powershell
git push origin staging
# Vercel автоматично deploy-ва staging средата
# URL: https://rabotim-com-git-staging-tihomirs-projects-850a4235.vercel.app
```

### Production (след тестване):
```powershell
git checkout main
git merge staging
git push origin main
# Vercel автоматично deploy-ва production средата
```

## 📝 CURSOR SHORTCUTS (важни)

### Основни:
- **Ctrl+Shift+P** - Command Palette
- **Ctrl+`** - Terminal
- **Ctrl+Shift+`** - New Terminal
- **Ctrl+S** - Save
- **Ctrl+Shift+S** - Save All
- **F5** - Refresh

### Chat:
- **Ctrl+L** - New Chat
- **Ctrl+K** - Quick Chat
- **Ctrl+I** - Inline Chat

### Git:
- **Ctrl+Shift+G** - Git Panel
- **Ctrl+Shift+P** → "Git: Commit"
- **Ctrl+Shift+P** → "Git: Push"

## 🔧 КЛЮЧОВИ ФАЙЛОВЕ ЗА ПРОВЕРКА

### Основни файлове:
- `package.json` - dependencies
- `.env.local` - environment variables
- `app/layout.tsx` - главен layout
- `app/tasks/page.tsx` - основната страница
- `hooks/useTasksAPI.ts` - API интеграция

### Админ панел:
- `app/admin/page.tsx` - админ страницата
- `app/api/admin/stats/route.ts` - статистики
- `app/api/admin/users/route.ts` - потребители
- `app/api/admin/tasks/route.ts` - задачи
- `components/AdminDashboard.tsx` - dashboard
- `components/UserManagement.tsx` - управление на потребители
- `components/TaskManagement.tsx` - управление на задачи

### Supabase:
- `lib/supabase.ts` - Supabase клиент
- `supabase/migrations/005_complete_schema.sql` - база данни schema
- `hooks/useAuth.ts` - аутентификация

## 🎯 WORKFLOW СТЪПКИ

### Всеки ден:
1. Отвори Cursor
2. Отвори проекта `rabotim-com`
3. Отвори Terminal (Ctrl+`)
4. Провери git статус: `git status`
5. Направи промени в кода
6. Commit: `git add . && git commit -m "описание"`
7. Push: `git push origin staging`
8. Провери deployment в Vercel

### За нова функционалност:
1. Създай нов branch: `git checkout -b feature/new-feature`
2. Направи промените
3. Commit: `git add . && git commit -m "feat: нова функционалност"`
4. Push: `git push origin feature/new-feature`
5. Създай Pull Request в GitHub
6. Merge в staging след одобрение

## 🚨 ЧЕСТО СРЕЩАНИ ПРОБЛЕМИ

### Build грешки:
```powershell
# TypeScript грешки
npm run type-check
# Поправи грешките в кода

# Missing dependencies
npm install
```

### Git проблеми:
```powershell
# Merge conflicts
git status
# Реши конфликтите ръчно
git add .
git commit -m "resolve merge conflicts"
```

### Environment проблеми:
```powershell
# Провери .env.local файла
Get-Content .env.local
# Увери се, че всички променливи са правилни
```

## 📊 ПРОЕКТ СТАТУС

### Завършени функционалности:
- ✅ Аутентификация (Supabase)
- ✅ Публикуване на задачи
- ✅ Преглед на задачи
- ✅ Потребителски профил
- ✅ Админ панел
- ✅ Supabase интеграция
- ✅ TypeScript типове
- ✅ Responsive design

### В процес:
- 🔄 Тестване на админ панела
- 🔄 Deployment на staging
- 🔄 Production deployment

### Следващи стъпки:
- 📋 Тестване на всички функционалности
- 📋 Deployment на production
- 📋 Добавяне на нови функции
- 📋 Оптимизация на производителността

## 🆘 ПОДДРЪЖКА

### За помощ:
1. Провери този документ
2. Провери GitHub Issues
3. Провери Cursor документация
4. Свържи се с екипа

### Полезни линкове:
- GitHub: https://github.com/patetisho1/rabotim-com
- Staging: https://rabotim-com-git-staging-tihomirs-projects-850a4235.vercel.app
- Supabase Dashboard: https://supabase.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard

---

**Последна актуализация:** 2025-01-10
**Версия:** 1.0
**Автор:** AI Assistant + Tihomir Todorov
