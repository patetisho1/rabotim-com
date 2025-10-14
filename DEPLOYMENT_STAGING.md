# Deployment на Rabotim.com за Staging Тестване

## Преглед

Този гайд съдържа всички стъпки за deployment на Rabotim.com за реално staging тестване с пълна функционалност.

## Предварителни изисквания

1. **Supabase Account** - [https://supabase.com](https://supabase.com)
2. **Vercel Account** (за deployment) - [https://vercel.com](https://vercel.com)
3. **Node.js** 18+ и npm/yarn

## Стъпка 1: Supabase Setup

### 1.1 Създаване на Supabase проект

1. Отидете на [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Кликнете "New Project"
3. Изберете организация и задайте име: `rabotim-staging`
4. Изберете силна database парола
5. Изберете регион (препоръчително: Europe West (Ireland) за България)
6. Кликнете "Create new project"

### 1.2 Конфигурация на Database

1. Отворете SQL Editor в Supabase Dashboard
2. Копирайте цялото съдържание от `supabase/schema.sql`
3. Изпълнете query-то
4. Проверете дали всички таблици са създадени успешно:
   - users
   - tasks
   - task_applications
   - ratings
   - messages
   - notifications

### 1.3 Активиране на Realtime

1. Отидете на Database → Replication
2. Активирайте Realtime за следните таблици:
   - `messages` (за live chat)
   - `notifications` (за живи нотификации)
   - `task_applications` (за live updates на кандидатури)

### 1.4 Вземане на API Keys

1. Отидете на Settings → API
2. Копирайте:
   - `Project URL` (URL на вашия Supabase проект)
   - `anon public` key (публичен API ключ)
   - `service_role` key (за admin операции - НЕ го публикувайте)

## Стъпка 2: Local Setup и Тестване

### 2.1 Environment Variables

Създайте `.env.local` файл в root директорията:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Rabotim.com

# Supabase Configuration (замените с вашите credentials)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-secret-here

# PWA Settings
NEXT_PUBLIC_PWA_ENABLED=true
```

**Важно:** Генерирайте силен NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2.2 Инсталиране на зависимости

```bash
cd rabotim-com
npm install
```

### 2.3 Локално тестване

```bash
npm run dev
```

Отворете [http://localhost:3000](http://localhost:3000) и тествайте:

1. ✅ Регистрация на нов потребител
2. ✅ Login/Logout
3. ✅ Публикуване на задача
4. ✅ Разглеждане на задачи
5. ✅ Кандидатстване за задача (с друг акаунт)

## Стъпка 3: Deployment на Vercel (Staging)

### 3.1 Инсталиране на Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Login в Vercel

```bash
vercel login
```

### 3.3 Deployment

```bash
# От root директорията на rabotim-com
vercel --prod
```

Следвайте инструкциите:
- Setup and deploy? **Y**
- Which scope? Изберете вашия account
- Link to existing project? **N** (за първи път)
- Project name? `rabotim-staging`
- In which directory? `./` (current directory)
- Override settings? **N**

### 3.4 Конфигуриране на Environment Variables на Vercel

1. Отидете на [Vercel Dashboard](https://vercel.com/dashboard)
2. Изберете проекта `rabotim-staging`
3. Отидете на Settings → Environment Variables
4. Добавете всички променливи от `.env.local`:

```
NEXT_PUBLIC_APP_URL=https://rabotim-staging.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_URL=https://rabotim-staging.vercel.app
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_PWA_ENABLED=true
```

5. Кликнете "Save"
6. Redeploy проекта за да вземе новите променливи

### 3.5 Конфигуриране на Supabase Authentication URLs

1. Отидете на Supabase Dashboard → Authentication → URL Configuration
2. Добавете следните URLs:

**Site URL:**
```
https://rabotim-staging.vercel.app
```

**Redirect URLs:**
```
https://rabotim-staging.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

## Стъпка 4: Тестване на Staging

### 4.1 Desktop Тестване

Отворете `https://rabotim-staging.vercel.app` и тествайте full flow:

#### Test Case 1: Регистрация и Login
1. Кликнете "Регистрация"
2. Попълнете форма с реален имейл
3. Изберете роля: "Даващ задачи"
4. Проверете имейла за verification link
5. Потвърдете регистрацията
6. Login с новия акаунт

#### Test Case 2: Публикуване на задача
1. Login като даващ задачи
2. Кликнете "Публикувай задача"
3. Попълнете форма:
   - Заглавие: "Почистване на апартамент"
   - Описание: "Нуждая се от генерално почистване на апартамент 80кв.м"
   - Категория: Почистване
   - Локация: София
   - Цена: 150 лв
   - Тип: Фиксирана цена
4. Публикувайте задачата
5. Проверете дали се появява в списъка със задачи

#### Test Case 3: Кандидатстване
1. Logout
2. Регистрирайте ВТОРИ акаунт (с друг имейл)
3. Изберете роля: "Изпълнител"
4. Login с втория акаунт
5. Отидете на "Задачи"
6. Намерете публикуваната задача
7. Кликнете за детайли
8. Напишете съобщение и кандидатствайте
9. Проверете дали се появява "Вече сте кандидатствали"

#### Test Case 4: Messaging (TODO - зависи от имплементация)
1. Logout от втория акаунт
2. Login с първия акаунт (публикувал задачата)
3. Отидете на "Съобщения"
4. Трябва да видите кандидата
5. Изпратете съобщение
6. Login с втория акаунт
7. Проверете дали получава съобщението в real-time

### 4.2 Mobile Тестване

#### iOS Safari / Android Chrome
1. Отворете `https://rabotim-staging.vercel.app` на телефона
2. Тествайте същите flows като на desktop
3. Проверете дали формите са responsive
4. Тествайте публикуване на задача от мобилен
5. Тествайте кандидатстване от мобилен

#### PWA Инсталация (опционално)
1. Safari (iOS): Share → Add to Home Screen
2. Chrome (Android): Menu → Install App
3. Отворете приложението от home screen
4. Проверете дали работи като native app

## Стъпка 5: Мониторинг и Debug

### 5.1 Vercel Logs

```bash
vercel logs --follow
```

Или отидете на Vercel Dashboard → Deployments → [Latest] → Runtime Logs

### 5.2 Supabase Logs

1. Supabase Dashboard → Logs → Database
2. Следете за грешки при INSERT/UPDATE/DELETE операции

### 5.3 Browser Developer Tools

- Console за JavaScript грешки
- Network tab за API request/response
- Application → Local Storage за проверка на auth state

## Стъпка 6: Известни Issues и Solutions

### Issue 1: Authentication не работи

**Симптом:** След login пренасочва обратно към login

**Solution:**
1. Проверете NEXTAUTH_URL и NEXTAUTH_SECRET в Vercel environment variables
2. Проверете Supabase Redirect URLs
3. Изчистете browser cookies и localStorage

### Issue 2: Задачите не се показват

**Симптом:** Празен списък със задачи

**Solution:**
1. Проверете Supabase Database дали има records в `tasks` таблица
2. Проверете Row Level Security policies (RLS)
3. Проверете Vercel Runtime Logs за грешки

### Issue 3: Messaging не работи в real-time

**Симптом:** Трябва да refresh-нем за да видим нови съобщения

**Solution:**
1. Проверете дали Realtime е активиран за `messages` таблица
2. Проверете browser console за WebSocket грешки
3. Проверете Supabase Realtime logs

## Стъпка 7: Debugging и Support

### Полезни команди

```bash
# Check build локално
npm run build

# Analyse bundle size
npm run analyze

# Проверка на TypeScript errors
npx tsc --noEmit
```

### Supabase SQL Queries за Debug

```sql
-- Проверка на users
SELECT COUNT(*) FROM public.users;

-- Проверка на tasks
SELECT COUNT(*) FROM public.tasks;

-- Проверка на applications
SELECT * FROM public.task_applications ORDER BY created_at DESC LIMIT 10;

-- Проверка на messages
SELECT COUNT(*) FROM public.messages;
```

## Контакти и Help

Ако срещнете проблеми:

1. Проверете Vercel deployment logs
2. Проверете Supabase database logs
3. Проверете browser console за грешки
4. Погледнете този документ отново за troubleshooting

---

## Checklist за успешен deployment ✅

- [ ] Supabase проект създаден
- [ ] Database schema изпълнена
- [ ] Realtime активиран
- [ ] Environment variables конфигурирани
- [ ] Deployed на Vercel
- [ ] Supabase Auth URLs конфигурирани
- [ ] Регистрация работи
- [ ] Login работи
- [ ] Публикуване на задачи работи
- [ ] Кандидатстване работи
- [ ] Тествано на мобилен телефон
- [ ] Messaging тествано (ако е имплементирано)

**Успех! 🎉**

Сега имате напълно функционален staging environment на Rabotim.com готов за реално тестване!

