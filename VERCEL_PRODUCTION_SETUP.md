# 🚀 VERCEL PRODUCTION - SUPABASE SETUP

## 📋 ЩЕ ТИ ТРЯБВАТ ТЕЗИ CREDENTIALS

### 1. Вземи Service Role Key от Supabase:

1. Отвори: https://supabase.com/dashboard/project/wwbxzkbilklullziiogr
2. Отиди в: **Settings** → **API**
3. Копирай: **service_role** (secret) key
4. ⚠️ ВНИМАНИЕ: Този ключ е SECRET - никога не го споделяй публично!

---

## 🔧 НАСТРОЙКА НА VERCEL PRODUCTION ENVIRONMENT

### СТЪПКА 1: Отвори Vercel Dashboard

1. Отиди на: https://vercel.com/dashboard
2. Намери проекта: **rabotim-com**
3. Кликни върху проекта

### СТЪПКА 2: Environment Variables

1. Кликни на: **Settings** (горе в менюто)
2. Кликни на: **Environment Variables** (ляво в sidebar)
3. Ще видиш съществуващи променливи

### СТЪПКА 3: Добави/Промени Production Variables

За всяка променлива по-долу:
1. Кликни **Add New** (или Edit ако съществува)
2. Избери Environment: **Production** (важно!)
3. Добави Name и Value
4. Save

---

## 📝 ПРОМЕНЛИВИ ЗА ДОБАВЯНЕ

### ⭐ ЗАДЪЛЖИТЕЛНИ (Supabase):

**1. NEXT_PUBLIC_SUPABASE_URL**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://wwbxzkbilklullziiogr.supabase.co
Environment: Production ✅
```

**2. NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0
Environment: Production ✅
```

**3. SUPABASE_SERVICE_ROLE_KEY**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Копирай от Supabase Dashboard → Settings → API → service_role]
Environment: Production ✅
```

---

### 🔐 ЗАДЪЛЖИТЕЛНИ (Auth):

**4. NEXTAUTH_SECRET**
```
Name: NEXTAUTH_SECRET
Value: [Генерирай нов секрет - виж по-долу]
Environment: Production ✅
```

**КАК ДА ГЕНЕРИРАШ NEXTAUTH_SECRET:**
```powershell
# В PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString()))

# Или онлайн:
# Отиди на: https://generate-secret.vercel.app/32
```

**5. NEXTAUTH_URL**
```
Name: NEXTAUTH_URL
Value: https://rabotim-com.vercel.app
Environment: Production ✅
```
*(Ако имаш custom domain, замени с него)*

---

### 📊 ОПЦИОНАЛНИ (Analytics & Email):

**6. NEXT_PUBLIC_GA_ID** (Google Analytics)
```
Name: NEXT_PUBLIC_GA_ID
Value: G-XXXXXXXXXX
Environment: Production ✅
```
*(Ако имаш GA setup-нат)*

**7. RESEND_API_KEY** (Email notifications)
```
Name: RESEND_API_KEY
Value: re_your-api-key
Environment: Production ✅
```
*(Ако ползваш Resend за emails)*

---

## ✅ ПРОВЕРКА СЛЕД ДОБАВЯНЕ

След като добавиш променливите:

### 1. Провери че са добавени:
- Environment Variables страницата трябва да показва всички променливи
- Всяка променлива трябва да има **Production** badge

### 2. Redeploy проекта:
```
1. В Vercel Dashboard → Deployments
2. Намери последния deployment
3. Кликни на трите точки (...)
4. Избери "Redeploy"
5. Чакай билда да завърши (2-5 минути)
```

### 3. Провери Build Logs:
```
1. Кликни на deployment-а
2. Виж "Building" logs
3. Търси за грешки свързани със Supabase
4. Билдът трябва да мине успешно ✅
```

---

## 🧪 ТЕСТВАНЕ СЛЕД DEPLOYMENT

Отвори production сайта и тествай:

1. **Homepage:** Зарежда ли се?
2. **Login/Register:** Работи ли Supabase Auth?
3. **Tasks Page:** Виждаш ли задачи от базата?
4. **Post Task:** Можеш ли да създадеш задача?
5. **Profile:** Зарежда ли се профилната страница?

Отвори **Browser Console (F12)** и провери за грешки.

---

## 🚨 ЧЕСТО СРЕЩАНИ ПРОБЛЕМИ

### Проблем: "Supabase client error"
**Решение:** Провери дали environment variables са точни (URL и Keys)

### Проблем: "Build failed"
**Решение:** Провери Build Logs за конкретната грешка

### Проблем: "Auth not working"
**Решение:** 
1. Провери NEXTAUTH_SECRET и NEXTAUTH_URL
2. Провери Supabase Auth settings

### Проблем: "Tasks not loading"
**Решение:**
1. Провери Supabase → Table Editor → tasks (има ли данни?)
2. Провери RLS policies (може да блокират достъп)

---

## 📞 СЛЕДВАЩИ СТЪПКИ

След като Supabase е настроен и билдът минава:

1. ✅ Environment variables настроени
2. ✅ Production deployment работи
3. ⏭️ Готов за Git merge (staging → main)

---

## 🎯 КРАТЪК CHECKLIST

- [ ] Взет Service Role Key от Supabase
- [ ] Генериран NEXTAUTH_SECRET
- [ ] Добавени всички 5 задължителни променливи във Vercel
- [ ] Environment: **Production** ✅ за всяка
- [ ] Redeploy направен
- [ ] Build минал успешно
- [ ] Сайтът се зарежда
- [ ] Login работи
- [ ] Tasks се показват

**Когато всички са ✅, готов си за Git merge!** 🚀

---

**Време:** ~10-15 минути  
**Последна актуализация:** 21 октомври 2025


