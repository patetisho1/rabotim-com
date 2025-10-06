# Facebook OAuth Setup Guide

## 1. Facebook App Configuration

### Стъпка 1: Създаване на Facebook App
1. Отидете на [Facebook Developers](https://developers.facebook.com/)
2. Натиснете "Create App"
3. Изберете "Consumer" тип
4. Попълнете App Name: "Rabotim.com"
5. Изберете "Business" категоря

### Стъпка 2: Настройка на Facebook Login
1. В левия панел изберете "Facebook Login"
2. Натиснете "Set Up"
3. Изберете "Web" платформа
4. Добавете сайт URL: `https://rabotim-com-git-staging-tihomirs-projects-850a4235.vercel.app`

### Стъпка 3: Настройка на Valid OAuth Redirect URIs
1. Отидете на Facebook Login > Settings
2. В полето "Valid OAuth Redirect URIs" добавете:
   ```
   https://wwbxzkbilklullziiogr.supabase.co/auth/v1/callback
   ```

### Стъпка 4: Вземане на App ID и App Secret
1. Отидете на Settings > Basic
2. Копирайте "App ID" и "App Secret"

## 2. Supabase Configuration

### Стъпка 1: Настройка на Facebook Provider
1. Отидете в Supabase Dashboard
2. Authentication > Providers
3. Намерете Facebook и натиснете "Enable"
4. Въведете:
   - **Client ID**: Facebook App ID
   - **Client Secret**: Facebook App Secret
5. Натиснете "Save"

### Стъпка 2: Настройка на Site URL
1. Authentication > URL Configuration
2. Site URL: `https://rabotim-com-git-staging-tihomirs-projects-850a4235.vercel.app`
3. Redirect URLs добавете:
   ```
   https://rabotim-com-git-staging-tihomirs-projects-850a4235.vercel.app/auth/callback
   ```

## 3. Environment Variables

Добавете в `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://wwbxzkbilklullziiogr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 4. Тестване

1. Отидете на login страницата
2. Натиснете "Продължи с Facebook"
3. Влезте с Facebook акаунт
4. Проверете дали се създава профил в Supabase

## 5. Често срещани проблеми

### Проблем: "App Not Setup"
- **Решение**: Уверете се, че Facebook App е публикуван
- В Facebook App Settings > Basic > App Mode изберете "Live"

### Проблем: "Invalid Redirect URI"
- **Решение**: Проверете дали redirect URI е правилно конфигуриран
- Трябва да бъде точно: `https://wwbxzkbilklullziiogr.supabase.co/auth/v1/callback`

### Проблем: "App Secret не работи"
- **Решение**: Уверете се, че App Secret е правилно копиран от Facebook
- Проверете дали няма допълнителни интервали

## 6. Debug Tips

1. Проверете конзолата за грешки
2. Проверете Network tab за неуспешни заявки
3. Проверете Supabase Auth logs
4. Уверете се, че Facebook App е в "Live" режим
