# Настройка на имейла за „Забравена парола“ в Supabase

## Как работи flow-ът

1. Потребителят въвежда имейл на `/forgot-password` и получава имейл от Supabase.
2. Линкът в имейла води до Supabase, след верификация Supabase пренасочва към **нашата страница** с токена в **hash** (`#access_token=...&type=recovery`). Hash-ът се вижда само в браузъра.
3. Приложението използва страница **`/auth/recovery`**, която чете hash-а, оставя Supabase да зададе сесията и след това пренасочва към `/reset-password`, където потребителят въвежда нова парола.

## Решение

### 1. Email шаблон в Supabase

В **Supabase Dashboard** → **Authentication** → **Email Templates** → **Reset Password** линкът трябва да използва **`{{ .ConfirmationURL }}`**:

**Правилно:**

```html
<p><a href="{{ .ConfirmationURL }}">Възстанови парола</a></p>
```

**Грешно** (води до линк без redirect и потребителят влиза директно в акаунта):

```html
<p><a href="https://[project].supabase.co/auth/v1/verify?token={{ .TokenHash }}">Reset Password</a></p>
```

`{{ .ConfirmationURL }}` включва и `redirect_to`, който подаваме в кода (`redirectTo: '.../auth/recovery'`).

### 2. URL Configuration (задължително)

В **Authentication** → **URL Configuration** → **Redirect URLs** трябва да е добавен URL за **`/auth/recovery`**:

- Production: `https://rabotim-com.vercel.app/auth/recovery` (или вашият домейн)
- Staging/local: `http://localhost:3000/auth/recovery` и съответният staging URL

Без този URL Supabase няма да пренасочи към `/auth/recovery` и потребителят може да попадне на началната страница и да изглежда „влязъл“ вместо да види форма за нова парола.

### 3. Fallback в приложението

`PasswordRecoveryListener` при зареждане проверява за `type=recovery` в hash-а и при събитие `PASSWORD_RECOVERY` пренасочва към `/reset-password`. Така дори ако потребителят попадне на друга страница с hash-а, flow-ът продължава да работи.
