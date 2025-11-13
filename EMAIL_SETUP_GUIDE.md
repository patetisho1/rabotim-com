# 📧 Email Setup Guide - Конфигуриране на SMTP за Supabase

## 🔍 Проблем

При регистрация системата казва, че ще получите имейл за потвърждение, но имейлът не се изпраща, защото SMTP не е конфигуриран в Supabase cloud проекта.

## ✅ Решение

### Вариант 1: Конфигуриране на SMTP в Supabase (За потвърждаващи имейли)

1. **Влезте в Supabase Dashboard:**
   - Отидете на: https://supabase.com/dashboard
   - Изберете вашия проект

2. **Отидете в Authentication > Email Templates:**
   - В лявото меню: Authentication → Email Templates
   - Тук можете да видите и редактирате email templates

3. **Конфигурирайте SMTP:**
   - Отидете в: Authentication → Settings → SMTP Settings
   - Или в: Project Settings → Auth → SMTP Settings

4. **Добавете SMTP настройки:**
   
   **Опция A: Resend (Препоръчително за production)**
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 465 (SSL) или 587 (TLS)
   SMTP User: resend
   SMTP Password: [Вашият Resend API Key - re_...]
   Sender Email: noreply@yourdomain.com (или onboarding@resend.dev за тестване)
   Sender Name: Rabotim.com
   ```

   **Опция B: SendGrid**
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP User: apikey
   SMTP Password: [Вашият SendGrid API Key]
   Sender Email: noreply@yourdomain.com
   Sender Name: Rabotim.com
   ```

   **Опция C: Gmail (Само за development - не препоръчително за production)**
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: your-email@gmail.com
   SMTP Password: [App Password от Gmail]
   Sender Email: your-email@gmail.com
   Sender Name: Rabotim.com
   ```

5. **Включете Email Confirmations (ако искате да изисквате потвърждение):**
   - Отидете в: Authentication → Settings → Auth Settings
   - Намерете "Enable email confirmations"
   - Включете го, ако искате потребителите да потвърждават имейла си преди влизане

### Вариант 2: Използване на Resend за Welcome Emails (Текущо решение)

Кодът вече е настроен да изпраща welcome emails чрез Resend API, ако е конфигуриран:
- Проверява се за `RESEND_API_KEY` environment variable
- Ако е наличен, изпраща се welcome email след успешна регистрация
- Не блокира регистрацията, ако Resend не е конфигуриран

**За да активирате Resend:**
1. Създайте акаунт в: https://resend.com
2. Създайте API key
3. Добавете в Vercel Environment Variables:
   ```
   RESEND_API_KEY=re_your-api-key-here
   ```
4. Redeploy проекта

## 🔧 Текуща логика на регистрацията

След направените промени, регистрацията работи така:

1. **Ако `email_confirmed_at` е null, но има `session`:**
   - Потребителят се логва автоматично
   - Изпраща се welcome email (ако Resend е конфигуриран)
   - Пренасочва се към homepage

2. **Ако `email_confirmed_at` е null и няма `session`:**
   - Показва се предупреждение, че имейл може да не е изпратен
   - Потребителят е пренасочен към login страницата
   - Може да влезе директно с имейл/парола (ако confirmations са изключени)

3. **Ако `email_confirmed_at` е настроен:**
   - Потребителят е потвърден
   - Изпраща се welcome email (ако Resend е конфигуриран)
   - Пренасочва се към homepage

## 📝 Проверка на настройките

За да проверите текущите настройки в Supabase:

1. **Проверете Email Confirmations:**
   ```sql
   SELECT * FROM auth.config WHERE id = 1;
   ```
   Проверете `enable_email_confirmations` - ако е `false`, потвърждението не е задължително.

2. **Проверете SMTP конфигурация:**
   - В Dashboard: Project Settings → Auth → SMTP Settings
   - Ако не е конфигурирано, ще видите "Not configured"

## 🚀 Препоръки

1. **За Development:**
   - Използвайте Resend с onboarding@resend.dev (работи веднага)
   - Или използвайте Supabase Inbucket (за local development)

2. **За Production:**
   - Конфигурирайте Resend с вашия домейн
   - Или използвайте SendGrid/друг SMTP provider
   - Включете email confirmations за по-добра сигурност

3. **За Production с домейн:**
   - Добавете вашия домейн в Resend/SendGrid
   - Настройте DNS записи (SPF, DKIM, DMARC)
   - Верифицирайте домейна

## 🔗 Полезни линкове

- [Supabase Email Auth Docs](https://supabase.com/docs/guides/auth/auth-email)
- [Resend Setup Guide](https://resend.com/docs/send-with-supabase)
- [SendGrid Setup Guide](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)

