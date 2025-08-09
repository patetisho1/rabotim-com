# OAuth настройка за Google и Facebook

## 🔧 Настройка на Google OAuth

### 1. Създаване на Google Cloud проект

1. Отидете на [Google Cloud Console](https://console.cloud.google.com/)
2. Създайте нов проект или изберете съществуващ
3. Активирайте Google+ API:
   - Отидете на "APIs & Services" > "Library"
   - Търсете "Google+ API" или "Google Identity"
   - Кликнете "Enable"

### 2. Създаване на OAuth 2.0 credentials

1. Отидете на "APIs & Services" > "Credentials"
2. Кликнете "Create Credentials" > "OAuth 2.0 Client IDs"
3. Изберете Application type: "Web application"
4. Добавете име: "Rabotim.com OAuth"
5. Добавете Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://rabotim-com.vercel.app/api/auth/callback/google
   ```
6. Кликнете "Create"
7. Копирайте Client ID и Client Secret

### 3. Добавяне в environment variables

Добавете в `.env.local` или Vercel environment variables:
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

---

## 📘 Настройка на Facebook OAuth

### 1. Създаване на Facebook App

1. Отидете на [Facebook for Developers](https://developers.facebook.com/)
2. Кликнете "My Apps" > "Create App"
3. Изберете "Consumer" или "Business"
4. Попълнете:
   - App name: "Rabotim.com"
   - App contact email: your-email@example.com
   - Purpose: Business

### 2. Настройка на Facebook Login

1. В Dashboard-а на вашето приложение
2. Кликнете "Add Product" > "Facebook Login" > "Set Up"
3. Изберете "Web"
4. В "Valid OAuth Redirect URIs" добавете:
   ```
   http://localhost:3000/api/auth/callback/facebook
   https://rabotim-com.vercel.app/api/auth/callback/facebook
   ```

### 3. Получаване на App ID и App Secret

1. Отидете на "Settings" > "Basic"
2. Копирайте:
   - App ID (това е вашият Client ID)
   - App Secret (кликнете "Show" за да го видите)

### 4. Добавяне в environment variables

Добавете в `.env.local` или Vercel environment variables:
```
FACEBOOK_CLIENT_ID=your_app_id_here
FACEBOOK_CLIENT_SECRET=your_app_secret_here
```

---

## 🔐 NextAuth Secret

Генерирайте секретен ключ за NextAuth:

```bash
openssl rand -base64 32
```

Или използвайте онлайн генератор: https://generate-secret.vercel.app/32

Добавете го в environment variables:
```
NEXTAUTH_SECRET=your_generated_secret_here
```

---

## 🌐 URL настройки

### За локално развитие (.env.local):
```
NEXTAUTH_URL=http://localhost:3000
```

### За production (Vercel):
```
NEXTAUTH_URL=https://rabotim-com.vercel.app
```

---

## ✅ Пълен .env.local файл

Създайте `.env.local` файл в root директорията:

```
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Други променливи...
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🚀 Настройка във Vercel

1. Отидете в проекта ви във Vercel Dashboard
2. Settings > Environment Variables
3. Добавете всички променливи една по една
4. Важно: `NEXTAUTH_URL` трябва да бъде production URL-то ви

---

## 🧪 Тестване

1. Стартирайте локално: `npm run dev`
2. Отидете на `/login`
3. Кликнете "Продължи с Google" или "Продължи с Facebook"
4. Трябва да бъдете пренасочени към OAuth страницата
5. След потвърждение трябва да бъдете върнати в сайта като влезли потребители

---

## ❗ Важни забележки

### За Google:
- Уверете се, че Google+ API е активен
- Redirect URIs трябва да са точно такива каквито са зададени
- За production не забравяйте да добавите домейна ви

### За Facebook:
- App трябва да бъде във "Live" mode за production
- За тестване може да остане в "Development" mode
- Добавете Test Users ако е необходимо

### Общи:
- Никога не commit-вайте .env.local файлове в Git
- Използвайте различни OAuth apps за development и production
- Проверете redirect URIs внимателно
