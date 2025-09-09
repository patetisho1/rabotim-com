-- Email Configuration for Supabase Auth
-- This will be applied to enable email confirmations

-- Enable email confirmations
UPDATE auth.config 
SET 
  enable_signup = true,
  enable_email_confirmations = true,
  enable_email_change_confirmations = true,
  enable_phone_confirmations = false,
  enable_phone_change_confirmations = false
WHERE id = 1;

-- Set email template settings
INSERT INTO auth.email_templates (id, template_type, subject, content_html, content_text)
VALUES 
  (
    1,
    'confirmation',
    'Потвърдете вашия акаунт в Rabotim.com',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Потвърждение на акаунт</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Rabotim.com</h1>
            <p>Потвърдете вашия акаунт</p>
        </div>
        <div class="content">
            <h2>Здравейте!</h2>
            <p>Благодарим ви, че се регистрирахте в Rabotim.com - платформата за почасова работа в България.</p>
            <p>За да активирате вашия акаунт, моля натиснете бутона по-долу:</p>
            <a href="{{ .ConfirmationURL }}" class="button">Потвърдете акаунта</a>
            <p>Ако бутонът не работи, можете да копирате и поставите този линк в браузъра си:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;">{{ .ConfirmationURL }}</p>
            <p>Този линк е валиден за 24 часа.</p>
        </div>
        <div class="footer">
            <p>© 2024 Rabotim.com - Всички права запазени</p>
            <p>Ако не сте се регистрирали в нашия сайт, моля игнорирайте този имейл.</p>
        </div>
    </div>
</body>
</html>',
    'Здравейте!

Благодарим ви, че се регистрирахте в Rabotim.com - платформата за почасова работа в България.

За да активирате вашия акаунт, моля посетете този линк:
{{ .ConfirmationURL }}

Този линк е валиден за 24 часа.

Ако не сте се регистрирали в нашия сайт, моля игнорирайте този имейл.

© 2024 Rabotim.com - Всички права запазени'
  )
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  content_html = EXCLUDED.content_html,
  content_text = EXCLUDED.content_text;

-- Set password reset template
INSERT INTO auth.email_templates (id, template_type, subject, content_html, content_text)
VALUES 
  (
    2,
    'recovery',
    'Възстановяване на парола - Rabotim.com',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Възстановяване на парола</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Rabotim.com</h1>
            <p>Възстановяване на парола</p>
        </div>
        <div class="content">
            <h2>Здравейте!</h2>
            <p>Получихме заявка за възстановяване на паролата за вашия акаунт в Rabotim.com.</p>
            <p>За да зададете нова парола, моля натиснете бутона по-долу:</p>
            <a href="{{ .ConfirmationURL }}" class="button">Възстановете паролата</a>
            <p>Ако бутонът не работи, можете да копирате и поставите този линк в браузъра си:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;">{{ .ConfirmationURL }}</p>
            <p>Този линк е валиден за 1 час.</p>
            <p><strong>Ако не сте заявили възстановяване на парола, моля игнорирайте този имейл.</strong></p>
        </div>
        <div class="footer">
            <p>© 2024 Rabotim.com - Всички права запазени</p>
        </div>
    </div>
</body>
</html>',
    'Здравейте!

Получихме заявка за възстановяване на паролата за вашия акаунт в Rabotim.com.

За да зададете нова парола, моля посетете този линк:
{{ .ConfirmationURL }}

Този линк е валиден за 1 час.

Ако не сте заявили възстановяване на парола, моля игнорирайте този имейл.

© 2024 Rabotim.com - Всички права запазени'
  )
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  content_html = EXCLUDED.content_html,
  content_text = EXCLUDED.content_text;

