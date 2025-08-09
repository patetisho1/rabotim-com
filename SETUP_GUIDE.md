# 🚀 Setup Guide за Rabotim.com

## 📋 Стъпки за пълна настройка

### 1. 📊 Google Analytics Setup

1. **Създайте Google Analytics account:**
   - Идете на: https://analytics.google.com/
   - Създайте нов property за rabotim.com
   - Копирайте Measurement ID (GA4) - изглежда като `G-XXXXXXXXXX`

2. **Добавете в Vercel Environment Variables:**
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### 2. 🗄️ Supabase Database Setup

1. **Създайте Supabase project:**
   - Идете на: https://supabase.com
   - Създайте нов проект
   - Изберете регион (препоръчително EU за България)

2. **Настройте базата данни:**
   - Отидете в SQL Editor в Supabase dashboard
   - Копирайте съдържанието от `supabase/schema.sql`
   - Изпълнете SQL командите

3. **Копирайте credentials:**
   - Project URL: `https://your-project.supabase.co`
   - Anon/Public key: от Settings > API
   - Service Role key: от Settings > API (пазете в тайна!)

4. **Добавете в Vercel Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 3. 📧 Email Setup с Resend

1. **Създайте Resend account:**
   - Идете на: https://resend.com
   - Регистрирайте се и верифицирайте email
   - Създайте API key

2. **Настройте домейн (препоръчително):**
   - Добавете вашия домейн в Resend
   - Настройте DNS записите
   - Верифицирайте домейна

3. **Добавете в Vercel Environment Variables:**
   ```
   RESEND_API_KEY=re_your-api-key
   ```

### 4. ⚙️ Vercel Environment Variables

1. **Отидете в Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Изберете вашия rabotim-com проект
   - Settings > Environment Variables

2. **Добавете всички променливи:**
   ```bash
   # App Configuration
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_APP_NAME=Rabotim.com
   
   # Google Analytics
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Email
   RESEND_API_KEY=re_your-api-key
   
   # PWA
   NEXT_PUBLIC_PWA_ENABLED=true
   ```

3. **Redeploy проекта:**
   - Deployments > [последният deployment] > Redeploy

### 5. 🔧 Допълнителни настройки (по избор)

#### Stripe за плащания:
```bash
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### Hotjar за analytics:
```bash
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id
```

#### Crisp за customer support:
```bash
NEXT_PUBLIC_CRISP_ID=your-crisp-id
```

## 🧪 Тестване на функционалностите

### Database тест:
1. Регистрирайте потребител
2. Създайте задача
3. Проверете в Supabase дали данните се записват

### Email тест:
1. Регистрирайте нов потребител
2. Проверете дали получавате welcome email
3. Тествайте други email уведомления

### Analytics тест:
1. Отворете сайта
2. Проверете в Google Analytics Real-time дали се track-ват посещения

## 🚨 Важни бележки

- **Никога не споделяйте Service Role keys публично**
- **Използвайте production keys само за production environment**
- **Тествайте всички функционалности преди да пуснете сайта**
- **Правете backup на базата данни редовно**

## 📞 Поддръжка

Ако имате проблеми с настройката:
1. Проверете Vercel logs
2. Проверете Supabase logs
3. Проверете browser console за грешки
4. Уверете се че всички environment variables са настроени правилно
