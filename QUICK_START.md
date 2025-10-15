# Quick Start - Rabotim.com Staging Testing

## 🚀 Бързи Инструкции за Тестване

### Вариант 1: Локално Тестване (препоръчано за първи тест)

#### Стъпка 1: Setup
```bash
cd rabotim-com
npm install
```

#### Стъпка 2: Environment Variables

Създайте файл `.env.local` в root директорията:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://wwbxzkbilklullziiogr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=rabotim-dev-secret-2024-random-key
NEXT_PUBLIC_PWA_ENABLED=true
```

#### Стъпка 3: Стартиране
```bash
npm run dev
```

Отворете [http://localhost:3000](http://localhost:3000)

---

### Вариант 2: Staging Deployment (за тестване от телефон)

Следвайте детайлните инструкции в **`DEPLOYMENT_STAGING.md`**

Накратко:
1. Създайте Supabase проект
2. Изпълнете `supabase/schema.sql`
3. Deploy с `vercel --prod`
4. Конфигурирайте environment variables

---

## 📋 Тестов Сценарий (5 минути)

### Test 1: Регистрация ✅

1. Отидете на `/register`
2. Регистрирайте се с:
   - Име: Тест
   - Фамилия: Потребител
   - Email: test1@example.com
   - Парола: test123
   - Роля: ✅ Даващ задачи

### Test 2: Публикуване на задача ✅

1. Login с test1@example.com
2. Кликнете "Публикувай задача" или отидете на `/post-task`
3. Попълнете:
   - Заглавие: **"Почистване на апартамент 80кв.м"**
   - Описание: **"Търся някой за генерално почистване на апартамент в София. Включва кухня, баня, 2 спални и хол."**
   - Категория: **Почистване**
   - Локация: **София**
   - Цена: **150**
   - Тип: **Фиксирана цена**
4. Кликнете "Публикувай задачата"
5. **Очакван резултат:** Redirect към детайли на задачата

### Test 3: Кандидатстване ✅

1. **Logout** от test1
2. Регистрирайте ВТОРИ акаунт:
   - Email: test2@example.com
   - Роля: ✅ Изпълнител
3. Отидете на `/tasks`
4. Намерете задачата "Почистване на апартамент"
5. Кликнете за детайли
6. В секцията "Кандидатствай", напишете:
   - **"Здравейте! Имам опит с почистване на апартаменти. Мога да завърша работата утре."**
7. Кликнете "Кандидатствай"
8. **Очакван резултат:** "Кандидатурата е изпратена успешно!"

### Test 4: Проверка на кандидатури ✅

1. **Logout** от test2
2. **Login** отново с test1@example.com
3. Отидете на детайлите на задачата
4. **Очакван резултат:** 
   - Кандидатури: **1**
   - Не можете да кандидатствате (защото е ваша задача)

### Test 5: Mobile Testing 📱

1. Отворете на телефон (или DevTools → Toggle device)
2. Регистрирайте се
3. Публикувайте задача **ОТ ТЕЛЕФОНА**
4. Проверете дали формата е responsive

---

## ✅ Success Checklist

След тестване, проверете:

- [ ] Регистрацията работи
- [ ] Login работи
- [ ] Може да се публикува задача
- [ ] Задачата се вижда в списъка `/tasks`
- [ ] Може да се кандидатства за задача
- [ ] Applications count се обновява
- [ ] Не може да кандидатстваш два пъти
- [ ] Не може да кандидатстваш за собствена задача
- [ ] Responsive на mobile

---

## 🐛 Troubleshooting

### Проблем: "Unauthorized" при публикуване на задача

**Решение:**
1. Проверете дали сте logged in
2. Изчистете browser cache и cookies
3. Login отново

### Проблем: Задачите не се зареждат

**Решение:**
1. Проверете browser console (F12) за грешки
2. Проверете дали Supabase schema е изпълнена
3. Проверете дали `.env.local` има правилни credentials

### Проблем: Build errors

**Решение:**
```bash
# Изчистете node_modules
rm -rf node_modules
rm -rf .next

# Reinstall
npm install

# Try again
npm run dev
```

---

## 📞 Следващи Стъпки

### Ако всичко работи локално:

1. **Deploy на Vercel** (вижте `DEPLOYMENT_STAGING.md`)
2. **Тествай от телефон** с реален URL
3. **Покани колега/приятел** да тества с теб

### Ако има проблеми:

1. Проверете browser console
2. Проверете `.env.local` файла
3. Проверете Supabase dashboard дали има данни

---

## 🎯 Готово!

Ако всички тестове минават успешно, **платформата е готова за реално тестване!** 🎉

Следващата стъпка е да deploy-неш на staging и да започнеш да тестваш с реални потребители.

**Документация:**
- `DEPLOYMENT_STAGING.md` - Пълни deployment инструкции
- `STAGING_READY.md` - Обобщение на функционалности
- `SETUP_SUPABASE.md` - Supabase setup детайли


