# 🚀 ГАЙД ЗА СИНХРОНИЗИРАНЕ НА STAGING И PRODUCTION

## 📋 ТЕКУЩО СЪСТОЯНИЕ

**Проблем:** Имаш незавършен merge с конфликти на `main` branch  
**Цел:** Да синхронизираш Staging и Production средите

---

## ⚠️ PRE-REQUISITES (ПРЕДИ ДА ЗАПОЧНЕШ)

### 1. **Провери текущото състояние:**
```powershell
cd "C:\Users\TihomirTodorov\Desktop\Cursor AI\rabotim-com"
git status
git branch -a
```

### 2. **Разреши незавършения merge:**

#### Опция А: Отмени merge-а (Препоръчително)
```powershell
git merge --abort
```

#### Опция Б: Разреши конфликтите ръчно
- Отвори всеки файл с конфликт
- Поправи конфликтите (избери коя версия да запазиш)
- След това:
```powershell
git add .
git commit -m "Resolve merge conflicts"
```

---

## 🔄 ПРОЦЕДУРА ЗА СИНХРОНИЗИРАНЕ

### СТЪПКА 1: Почисти локалното състояние

```powershell
# 1. Отмени незавършения merge
git merge --abort

# 2. Провери дали има uncommitted промени
git status

# 3. Ако има промени, които искаш да запазиш:
git stash save "Work in progress before sync"

# 4. Или ако не ги искаш:
git restore .
```

### СТЪПКА 2: Обнови всички branches

```powershell
# 1. Fetch последните промени от remote
git fetch origin

# 2. Виж текущия статус на всички branches
git branch -a
```

### СТЪПКА 3: Синхронизирай Staging

```powershell
# 1. Премини на staging branch
git checkout staging

# 2. Pull последните промени
git pull origin staging

# 3. Провери дали има конфликти
git status
```

### СТЪПКА 4: Подготви Production (main branch)

```powershell
# 1. Премини на main branch
git checkout main

# 2. Pull последните промени от Production
git pull origin main

# 3. Провери статуса
git status
```

### СТЪПКА 5: Синхронизирай Staging → Production

```powershell
# 1. Уверете се, че си на main branch
git checkout main

# 2. Pull промените от staging (НЕ merge!)
git pull origin staging

# 3. Провери за конфликти
git status

# 4. Ако има конфликти, разреши ги:
# - Отвори файловете с конфликти в Cursor
# - Избери коя версия да запазиш
# - След това:
git add .
git commit -m "Sync staging to production"

# 5. Push към production (main)
git push origin main
```

---

## 🗄️ SUPABASE НАСТРОЙКИ

### ЗА STAGING (вече е настроено)

**Текущи credentials в `env.example`:**
- URL: `https://wwbxzkbilklullziiogr.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### ЗА PRODUCTION (трябва да се настрои)

#### 1. Създай нов Supabase проект ИЛИ използвай същия

**Опция А: Използвай СЪЩИЯ Supabase проект (Препоръчително за начало)**
- Просто копирай същите credentials от Staging
- Environment variables във Vercel за Production:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://wwbxzkbilklullziiogr.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  SUPABASE_SERVICE_ROLE_KEY=<твоят service role key>
  ```

**Опция Б: Създай ОТДЕЛЕН Supabase проект за Production**
1. Отиди на https://supabase.com
2. Създай нов проект: "rabotim-prod"
3. Копирай новите credentials
4. Изпълни миграциите (виж по-долу)

#### 2. Настрой Environment Variables във Vercel

**За Production deployment:**
```
1. Отиди във Vercel → rabotim-com → Settings → Environment Variables
2. Създай променливи за "Production" environment:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (https://rabotim.com или production URL)
```

**За Staging deployment (вече настроено):**
```
Променливите вече са зададени за "Preview" environment
```

#### 3. Изпълни Database Migrations (Само ако използваш НОВ проект)

**Важни миграции за изпълнение:**

```sql
-- 1. supabase/migrations/002_simple_schema.sql
-- Основни таблици: profiles, tasks, applications, favorites, etc.

-- 2. supabase/migrations/005_complete_schema.sql
-- Пълна схема с всички колони и RLS политики

-- 3. supabase/migrations/005_add_task_promotion.sql
-- Промоционални функции: is_top, is_featured, is_promoted
```

**Как да изпълниш миграциите:**

1. **Чрез Supabase Dashboard:**
   ```
   1. Отвори Supabase проекта
   2. SQL Editor → New Query
   3. Копирай съдържанието на всяка миграция
   4. Run query
   5. Повтори за всички миграции
   ```

2. **Чрез Supabase CLI (по-добре):**
   ```powershell
   # Инсталирай Supabase CLI
   npm install -g supabase
   
   # Login
   supabase login
   
   # Link към проекта
   supabase link --project-ref <твоят-project-id>
   
   # Изпълни миграциите
   supabase db push
   ```

#### 4. Създай Storage Buckets

```sql
-- В Supabase Dashboard → Storage → New Bucket
-- Име: task-images
-- Public: true (за да се виждат снимките)

-- RLS Policy за upload:
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'task-images');

-- RLS Policy за view:
CREATE POLICY "Allow public to view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'task-images');
```

---

## ✅ ПРОВЕРКА СЛЕД СИНХРОНИЗИРАНЕ

### 1. **Провери Git състоянието:**
```powershell
git status
# Трябва да покаже: "Your branch is up to date with 'origin/main'"
```

### 2. **Провери че Staging и Production са синхронизирани:**
```powershell
git log staging..main
# Трябва да покаже нищо или много малко различия
```

### 3. **Провери Vercel deployments:**
```
1. Отиди във Vercel Dashboard
2. Провери последния production deployment
3. Тествай сайта на production URL
```

### 4. **Тествай функционалността:**
- [ ] Регистрация/Login работи
- [ ] Публикуване на задача работи
- [ ] Качване на снимки работи
- [ ] Кандидатстване за задача работи
- [ ] Профилна страница се зарежда
- [ ] Dark mode работи

---

## 🚨 ЧЕСТО СРЕЩАНИ ПРОБЛЕМИ

### Проблем 1: "Merge conflicts"
**Решение:**
```powershell
# Отмени merge
git merge --abort

# Или разреши конфликтите ръчно във файловете
# След това:
git add .
git commit -m "Resolve conflicts"
```

### Проблем 2: "Cannot push to main"
**Решение:**
```powershell
# Ако имаш branch protection rules:
# 1. Push към staging първо
git push origin staging

# 2. Създай Pull Request от staging → main в GitHub
# 3. Merge PR-а
```

### Проблем 3: "Supabase not configured"
**Решение:**
```
1. Провери environment variables във Vercel
2. Redeploy проекта след добавяне на променливите
3. Провери в browser console за грешки
```

### Проблем 4: "Tasks not showing"
**Решение:**
```
1. Провери Supabase Dashboard → Table Editor → tasks
2. Провери RLS policies (може да блокират достъп)
3. Провери console logs за API errors
```

---

## 📝 CHECKLIST ПРЕДИ PULL КЪМ PRODUCTION

- [ ] Всички промени на Staging са тествани
- [ ] Няма критични бъгове
- [ ] Environment variables са настроени във Vercel
- [ ] Supabase е конфигуриран (migrations, storage)
- [ ] Git статусът е чист (няма uncommitted changes)
- [ ] Няма незавършени merge conflicts
- [ ] Backup на текущата Production версия (чрез Git tag)

---

## 🎯 ПРЕПОРЪЧАН WORKFLOW ЗА БЪДЕЩЕ

```
1. Разработка → Local (npm run dev)
2. Test → Staging branch (push to staging)
3. Deploy → Production (pull from staging to main)

Workflow:
Local → Staging → Production
  ↓         ↓         ↓
Dev     Preview    Production
        (Vercel)   (Vercel)
```

---

## 📞 БЪРЗА СПРАВКА

### Основни Git команди:
```powershell
# Виж статус
git status

# Виж branches
git branch -a

# Премини на branch
git checkout <branch-name>

# Pull промени
git pull origin <branch-name>

# Push промени
git push origin <branch-name>

# Отмени merge
git merge --abort

# Виж история
git log --oneline -10
```

### Vercel deployment:
```powershell
# Deploy от CLI (опционално)
vercel --prod
```

---

**Важно:** След всяка стъпка провери дали всичко работи преди да продължиш към следващата!

**Последна актуализация:** 21 октомври 2025


