# 🚀 Rabotim.com - Българска Платформа за Задачи и Freelancing

## 🎯 **СТАТУС: ГОТОВ ЗА STAGING ТЕСТВАНЕ** ✅

Модерна уеб платформа за свързване на хора, които търсят помощ с хора, които предлагат услуги. 
Пълна core функционалност имплементирана и готова за реално тестване.

## 📖 Quick Links

- 🚀 **[Quick Start Guide](QUICK_START.md)** - Започни тестването за 5 минути
- 📦 **[Deployment Guide](DEPLOYMENT_STAGING.md)** - Пълни deployment инструкции
- 📋 **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Технически детайли
- ✅ **[Staging Ready](STAGING_READY.md)** - Обобщение на функционалности

## ✅ Имплементирани Функционалности (READY FOR TESTING)

### 🔐 Автентикация (100% Ready)
- ✅ **Регистрация** - Пълна форма с валидация
- ✅ **Login/Logout** - Session management с Supabase Auth
- ✅ **User Profiles** - Автоматично създаване чрез database trigger
- ✅ **Protected Routes** - Automatic redirect за неавторизирани потребители

### 📋 Управление на задачи (100% Ready)
- ✅ **Публикуване на задачи** - Пълна функционална форма (`/post-task`)
  - Categories: Ремонт, Почистване, Доставка, Обучение, Градинарство, IT услуги
  - Locations: София, Пловдив, Варна, Бургас и др.
  - Price types: Фиксирана цена или на час
  - Urgent flag, Deadline picker
- ✅ **Разглеждане на задачи** - List view със Supabase integration (`/tasks`)
- ✅ **Детайли на задача** - Пълна информация + user info (`/task/[id]`)
- ✅ **View Counter** - Автоматично броене на прегледи
- ✅ **Applications Count** - Real-time броене на кандидатури

### 🙋 Кандидатстване (100% Ready)
- ✅ **API Endpoint** - `/api/applications` (POST, GET)
- ✅ **Application Form** - Съобщение към собственика
- ✅ **Validations**:
  - Не можеш да кандидатстваш за собствена задача
  - Не можеш да кандидатстваш два пъти
- ✅ **Notifications** - Автоматично създаване на notification
- ✅ **Real-time Updates** - Instant update на applications count

### 💬 Комуникация (100% Ready)
- ✅ **Real-time Messaging** - Supabase Realtime integration
- ✅ **Chat System** - Пълна messaging функционалност
- ✅ **Conversation List** - Всички разговори с unread count
- ✅ **WebSocket Connection** - Instant message delivery
- ✅ **Mark as Read** - Автоматично маркиране

### 📱 Mobile & UI (Ready)
- ✅ **Responsive Design** - Напълно responsive за mobile/tablet/desktop
- ✅ **Touch-Friendly** - Optimized за touch екрани
- ✅ **PWA Ready** - Може да се инсталира като app
- ⚠️ **Dark Mode** - Partial support (в някои компоненти)

## 🔨 В Процес на Разработка

### ⭐ Рейтинги и отзиви (Partial)
- ⚠️ **Database Schema** - Готова
- ⚠️ **Frontend UI** - Partial implementation
- ❌ **Full Integration** - Не е завършена

### 💰 Платежна система (Not Implemented)
- ❌ **Payment Integration** - Не е имплементирана
- ❌ **Stripe/PayPal** - Future feature

### 📊 Админ панел (Partial)
- ⚠️ **Basic Admin** - Има basic structure
- ❌ **Full Analytics** - Не е завършена
- ❌ **User Management** - Не е завършена

### 📧 Email Notifications (Not Implemented)
- ❌ **Email Sending** - Не е конфигурирана
- ❌ **Email Templates** - Не са създадени

## 🛠 Tech Stack

### Frontend
- **Next.js 13.5** - React framework с App Router
- **React 18** - UI библиотека
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icons
- **React Hot Toast** - Toast notifications

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication (Email/Password)
  - Row Level Security (RLS)
  - Realtime subscriptions (WebSocket)
- **Next.js API Routes** - Server-side endpoints

### Real-time & State
- **Supabase Realtime** - WebSocket connections
- **React Hooks** - State management
- **Server Actions** - Server-side mutations

## 🚀 Quick Start (5 минути)

### Вариант 1: Локално тестване

```bash
# 1. Инсталация
cd rabotim-com
npm install

# 2. Създай .env.local (виж SETUP_SUPABASE.md)

# 3. Стартирай
npm run dev

# 4. Отвори http://localhost:3000
```

**Пълни инструкции:** [QUICK_START.md](QUICK_START.md)

### Вариант 2: Deploy на Staging

```bash
# Deploy на Vercel
vercel --prod
```

**Пълни инструкции:** [DEPLOYMENT_STAGING.md](DEPLOYMENT_STAGING.md)

## 📁 Структура на проекта

```
new-project/
├── app/                    # Next.js App Router
│   ├── admin/             # Админ панел
│   ├── login/             # Страница за вход
│   ├── register/          # Страница за регистрация
│   ├── forgot-password/   # Възстановяване на парола
│   ├── tasks/             # Списък с задачи
│   ├── task/[id]/         # Детайлна страница за задача
│   ├── post-task/         # Публикуване на задача
│   ├── profile/           # Потребителски профил
│   ├── messages/          # Система за съобщения
│   ├── notifications/     # Уведомления
│   ├── review/[userId]/   # Рейтинги и отзиви
│   ├── payment/[taskId]/  # Платежна система
│   └── layout.tsx         # Основен layout
├── components/            # React компоненти
│   ├── Header.tsx         # Навигация
│   ├── TaskCard.tsx       # Карта за задача
│   └── ...
├── public/               # Статични файлове
│   ├── manifest.json     # PWA manifest
│   ├── sw.js            # Service Worker
│   └── ...
└── ...
```

## 🧪 Тестов Сценарий (Core Flow)

### Test Case: Пълен цикъл на задача

#### 1️⃣ Регистрация на Даващ задачи
```
→ /register
→ Попълни форма (име, email, парола)
→ Избери роля: "Даващ задачи"
→ Регистрирай се
```

#### 2️⃣ Публикуване на задача
```
→ Login с първия акаунт
→ /post-task
→ Попълни форма:
   • Заглавие: "Почистване на апартамент 80кв.м"
   • Описание: "Генерално почистване в София"
   • Категория: Почистване
   • Локация: София
   • Цена: 150 лв (фиксирана)
→ Публикувай
```

#### 3️⃣ Кандидатстване (с друг акаунт)
```
→ Logout
→ Регистрирай ВТОРИ акаунт (друг email)
→ Избери роля: "Изпълнител"
→ /tasks → Намери задачата
→ Кликни за детайли
→ Напиши съобщение → Кандидатствай
```

#### 4️⃣ Комуникация
```
→ Login с първия акаунт
→ /messages
→ Виж разговора с кандидата
→ Изпрати съобщение
→ Real-time delivery!
```

**Детайлни тестови инструкции:** [QUICK_START.md](QUICK_START.md)

## 🔧 Environment Setup

Детайлни инструкции за setup: **[SETUP_SUPABASE.md](SETUP_SUPABASE.md)**

### Минимални requirements

Създайте `.env.local` файл:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## 🔒 Security & Features

### Implemented
- ✅ **Row Level Security (RLS)** - Database-level security
- ✅ **Authentication Guards** - Protected routes
- ✅ **Input Validation** - Client & server-side
- ✅ **SQL Injection Protection** - Parameterized queries
- ✅ **XSS Protection** - React auto-escaping

### Security Policies
```sql
-- Пример: Само собственикът може да update-ва задачата
CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);
```

## 🚀 Deployment & CI/CD

### Staging Deployment

```bash
# 1. Setup Supabase проект
# 2. Run database schema
# 3. Deploy на Vercel
vercel --prod

# 4. Configure environment variables на Vercel
```

**Пълни deployment инструкции:** [DEPLOYMENT_STAGING.md](DEPLOYMENT_STAGING.md)

### Production Checklist

- [ ] Supabase Production database
- [ ] Environment variables configured
- [ ] Custom domain setup
- [ ] SSL certificate (auto with Vercel)
- [ ] Email verification enabled
- [ ] Analytics configured
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

## 📚 Documentation

- 📖 **[Quick Start Guide](QUICK_START.md)** - Започни за 5 минути
- 🚀 **[Deployment Guide](DEPLOYMENT_STAGING.md)** - Пълни deployment инструкции  
- ⚙️ **[Supabase Setup](SETUP_SUPABASE.md)** - Database configuration
- 📋 **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Технически детайли
- ✅ **[Staging Ready](STAGING_READY.md)** - Feature checklist

## 🐛 Troubleshooting

### Common Issues

**Q: "Unauthorized" при публикуване на задача**
- A: Проверете дали сте logged in, изчистете cache

**Q: Задачите не се зареждат**  
- A: Проверете Supabase connection, провете RLS policies

**Q: Real-time messaging не работи**
- A: Проверете Supabase Realtime settings, проверете WebSocket connection

### Debug Commands

```bash
# TypeScript errors
npx tsc --noEmit

# Build locally
npm run build

# Check logs
vercel logs --follow
```

## 🤝 Contributing

Contributions are welcome! Ако искаш да помогнеш:

1. Fork проекта
2. Създай feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit промените (`git commit -m 'Add AmazingFeature'`)
4. Push към branch (`git push origin feature/AmazingFeature`)
5. Отвори Pull Request

## 📄 License

Този проект е лицензиран под MIT License - вижте [LICENSE](LICENSE) файла за детайли.

## 📞 Поддръжка

За въпроси и поддръжка:
- Email: support@rabotim.com
- Документация: [docs.rabotim.com](https://docs.rabotim.com)

## 🎉 Благодарности

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Lucide](https://lucide.dev/) - Icons
- [React Hot Toast](https://react-hot-toast.com/) - Notifications

---

**Rabotim.com** - Свързваме хората за по-добър свят! 🌟 #   S t a g i n g   E n v i r o n m e n t 
 
 