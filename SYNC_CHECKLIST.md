# ✅ CHECKLIST ЗА СИНХРОНИЗИРАНЕ STAGING → PRODUCTION

## 📊 ТЕКУЩО СЪСТОЯНИЕ
- **Local main branch:** На commit `36465d3` (ahead 5 commits от origin/main)
- **Remote origin/main:** На commit `a659eb2` 
- **Remote origin/staging:** 89 commits напред от origin/main
- **Git статус:** Чист (само 1 untracked file: PRODUCTION_SETUP_GUIDE.md)

---

## 🚀 СТЪПКИ ЗА ИЗПЪЛНЕНИЕ

### ФАЗА 1: ПОДГОТОВКА НА LOCAL ENVIRONMENT

- [x] **1.1** Отменен незавършен merge (`git reset --hard HEAD`) ✅
- [x] **1.2** Fetch latest changes (`git fetch origin`) ✅
- [ ] **1.3** Commit новия гайд
  ```powershell
  git add PRODUCTION_SETUP_GUIDE.md SYNC_CHECKLIST.md
  git commit -m "docs: Add production setup guide and sync checklist"
  ```

### ФАЗА 2: СИНХРОНИЗИРАНЕ НА LOCAL BRANCHES

- [ ] **2.1** Синхронизирай local main с remote main
  ```powershell
  git checkout main
  git pull origin main
  ```

- [ ] **2.2** Синхронизирай local staging с remote staging
  ```powershell
  git checkout staging
  git pull origin staging
  ```

- [ ] **2.3** Провери дали има конфликти
  ```powershell
  git status
  ```

### ФАЗА 3: MERGE STAGING → MAIN (LOCALLY)

- [ ] **3.1** Върни се на main branch
  ```powershell
  git checkout main
  ```

- [ ] **3.2** Merge staging в main
  ```powershell
  git merge origin/staging
  ```

- [ ] **3.3** Ако има конфликти:
  - Отвори файловете с конфликти в Cursor
  - Разреши конфликтите (обикновено избери staging версията)
  - След това:
    ```powershell
    git add .
    git commit -m "Merge staging into main for production deployment"
    ```

- [ ] **3.4** Провери че merge-а е успешен
  ```powershell
  git log --oneline -20
  git status
  ```

### ФАЗА 4: PUSH КЪМ PRODUCTION

- [ ] **4.1** Push main към remote (GitHub)
  ```powershell
  git push origin main
  ```

- [ ] **4.2** Провери че push-а е успешен
  - Отвори GitHub: https://github.com/patetisho1/rabotim-com
  - Виж че main branch е update-нат

### ФАЗА 5: SUPABASE КОНФИГУРАЦИЯ (Production)

#### Опция А: Използвай същия Supabase проект (Препоръчително за начало)

- [ ] **5.1** Отвори Vercel Dashboard
- [ ] **5.2** Отиди в Settings → Environment Variables
- [ ] **5.3** Добави променливи за **Production** environment:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://wwbxzkbilklullziiogr.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0
  SUPABASE_SERVICE_ROLE_KEY=[твоят service role key от Supabase]
  ```

#### Опция Б: Създай отделен Supabase проект

- [ ] **5.4** Създай нов проект в Supabase: "rabotim-prod"
- [ ] **5.5** Копирай новите credentials
- [ ] **5.6** Изпълни всички migrations:
  - `supabase/migrations/002_simple_schema.sql`
  - `supabase/migrations/005_complete_schema.sql`
  - `supabase/migrations/005_add_task_promotion.sql`
- [ ] **5.7** Създай Storage bucket: `task-images` (public)
- [ ] **5.8** Добави RLS policies за storage

### ФАЗА 6: VERCEL DEPLOYMENT

- [ ] **6.1** Provери че Vercel автоматично deploy-ва main branch
- [ ] **6.2** Чакай deployment да завърши (обикновено 2-5 минути)
- [ ] **6.3** Отвори production URL и провери

### ФАЗА 7: ТЕСТВАНЕ НА PRODUCTION

- [ ] **7.1** Регистрация/Login работи
- [ ] **7.2** Публикуване на задача работи
- [ ] **7.3** Качване на снимки работи
- [ ] **7.4** Кандидатстване за задача работи
- [ ] **7.5** Профилна страница се зарежда правилно
- [ ] **7.6** My Tasks показва задачи
- [ ] **7.7** Edit/Delete на задачи работи
- [ ] **7.8** Task duplication работи
- [ ] **7.9** Task archiving работи
- [ ] **7.10** Analytics страница се зарежда
- [ ] **7.11** Promotion badges се показват
- [ ] **7.12** Dark mode работи
- [ ] **7.13** Mobile bottom navigation работи
- [ ] **7.14** Map view работи

---

## 🚨 BACKUP ПЛАН (ПРЕДИ ДА ЗАПОЧНЕШ)

### Създай Git Tag за текущата Production версия:
```powershell
git checkout main
git pull origin main
git tag -a backup-prod-before-sync-$(Get-Date -Format "yyyy-MM-dd") -m "Backup before staging sync"
git push origin --tags
```

**Ако нещо се счупи, можеш да се върнеш:**
```powershell
git checkout backup-prod-before-sync-2025-10-21
git push origin main --force
```

---

## 📝 ВАЖНИ ФАЙЛОВЕ ЗА ПРОВЕРКА СЛЕД SYNC

След merge-а, провери тези файлове за конфликти:
- `lib/supabase.ts` - Supabase configuration
- `lib/supabase-auth.ts` - Auth helpers
- `hooks/useAuth.ts` - Auth hook
- `app/api/tasks/route.ts` - Tasks API
- `app/api/tasks/[id]/route.ts` - Single task API
- `supabase/migrations/002_simple_schema.sql` - Database schema

---

## ⏱️ ОЧАКВАНО ВРЕМЕ

- Фаза 1-4 (Git sync): **10-15 минути**
- Фаза 5 (Supabase setup): **5-10 минути** (Опция А) или **30-60 минути** (Опция Б)
- Фаза 6 (Vercel deployment): **5 минути**
- Фаза 7 (Testing): **15-30 минути**

**Общо време: 35-120 минути** (в зависимост от избраната опция)

---

## 📞 БЪРЗА ПОМОЩ

### Ако се появят merge conflicts:
```powershell
# Виж кои файлове имат конфликти
git status

# За всеки файл, отвори го в Cursor и разреши конфликтите
# Обикновено избираш staging версията (<<<<<<< HEAD vs >>>>>>> origin/staging)

# След разрешаване:
git add <файл>
git commit -m "Resolve merge conflicts"
```

### Ако deployment fails:
1. Провери Vercel logs
2. Провери environment variables
3. Провери Supabase connection
4. Redeploy manually от Vercel dashboard

---

**Готов ли си да започнем? Кажи "Давай" и ще започна от Фаза 1.3!** 🚀


