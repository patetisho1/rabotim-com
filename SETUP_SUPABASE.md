# Supabase Setup Instructions

## За Local Development

Създайте `.env.local` файл в root директорията на проекта със следното съдържание:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Rabotim.com

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=https://wwbxzkbilklullziiogr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=rabotim-dev-secret-key-2024

# PWA Settings
NEXT_PUBLIC_PWA_ENABLED=true
```

## За Staging/Production

За staging и production среди, създайте `.env.production` с production credentials:

```env
NEXT_PUBLIC_APP_URL=https://your-staging-url.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

## Supabase Database Setup

Вече имате готова schema в `supabase/schema.sql`. Трябва да я стартирате в Supabase SQL Editor:

1. Отворете Supabase Dashboard
2. Идете на SQL Editor
3. Копирайте съдържанието на `supabase/schema.sql`
4. Стартирайте query-то

## Важни triggers

Проектът използва следните автоматични функции:
- Автоматично създаване на user profile при регистрация
- Автоматично обновяване на rating при нови отзиви
- Автоматично преброяване на applications за задачи

Вижте `supabase/schema.sql` за детайли.







