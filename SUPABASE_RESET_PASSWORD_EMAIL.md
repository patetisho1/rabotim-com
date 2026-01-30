# Настройка на имейла за „Забравена парола“ в Supabase

## Проблем

Линкът в имейла за reset парола в момента води само към:

`https://[project].supabase.co/auth/v1/verify?token=...`

Това е **без** параметър `redirect_to`. След верификация Supabase пренасочва към **Site URL** (началната страница), затова потребителят влиза директно в акаунта вместо на страница за нова парола.

## Решение

В **Supabase Dashboard** → **Authentication** → **Email Templates** → **Reset Password** линкът в шаблона **трябва** да използва пълния confirmation URL, който включва и `redirect_to`.

### Какво да има в шаблона

Линкът в имейла трябва да е чрез **`{{ .ConfirmationURL }}`**, а не чрез ръчно сглобен URL само с token.

**Правилно** (препоръчително):

```html
<p><a href="{{ .ConfirmationURL }}">Възстанови парола</a></p>
```

**Грешно** (това води до линк без redirect_to и после редирект към началната страница):

```html
<p><a href="https://wwbxzkbilklullziiogr.supabase.co/auth/v1/verify?token={{ .TokenHash }}">Reset Password</a></p>
```

### Защо

- `{{ .ConfirmationURL }}` се генерира от Supabase и включва:
  - `token`
  - `type=recovery`
  - **`redirect_to`** – URL-ът, който подаваме в `resetPasswordForEmail(..., { redirectTo: '.../auth/reset-password-callback' })`
- Когато потребителят кликне този линк, след верификация Supabase го пренасочва към `redirect_to` (нашата страница `/auth/reset-password-callback`), откъдето вече го водим към `/reset-password`.

### URL Configuration

В **Authentication** → **URL Configuration** → **Redirect URLs** трябва да са добавени:

- `https://rabotim-com.vercel.app/auth/reset-password-callback`
- (за staging) съответният staging URL за `auth/reset-password-callback`

## Допълнително (fallback в приложението)

В приложението е добавен `PasswordRecoveryListener`: ако все пак потребителят попадне на началната страница с hash `#...type=recovery...` или получи събитието `PASSWORD_RECOVERY`, веднага се пренасочва към `/reset-password`. Така дори при грешен шаблон в имейла flow-ът работи след първото зареждане на страницата.
