# 🚀 Инструкции за настройване на нов машина

## Автоматично настройване (Препоръчително)

### Стъпка 1: Изтегли скрипта
1. Отиди в директорията на проекта
2. Скриптът `setup-new-machine.ps1` вече е готов

### Стъпка 2: Изпълни скрипта
Отвори PowerShell като Administrator и изпълни:

```powershell
# Разреши изпълнение на скриптове
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Отиди в директорията на проекта
cd C:\path\to\rabotim-com

# Изпълни setup скрипта
.\setup-new-machine.ps1
```

### Стъпка 3: Следвай инструкциите
Скриптът ще:
- ✅ Провери Node.js и Git
- ✅ Инсталира глобални пакети (Supabase CLI, Vercel CLI)
- ✅ Настрои Git конфигурация
- ✅ Инсталира VSCode extensions
- ✅ Създаде .env.local файл
- ✅ Инсталира project dependencies
- ✅ Създаде полезни скриптове
- ✅ Създаде VSCode workspace

## Ръчно настройване (Алтернатива)

Ако предпочиташ ръчно настройване:

### 1. VSCode Extensions
Инсталирай тези extensions:
```
ms-vscode.vscode-typescript-next
bradlc.vscode-tailwindcss
esbenp.prettier-vscode
ms-vscode.vscode-eslint
formulahendry.auto-rename-tag
supabase.supabase-vscode
rangav.vscode-thunder-client
eamodio.gitlens
github.copilot
github.copilot-chat
```

### 2. Environment Variables
Създай `.env.local` файл с:
```env
NEXT_PUBLIC_SUPABASE_URL=https://wbxzkbiklullziogr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=твоят-anon-key
SUPABASE_SERVICE_ROLE_KEY=твоят-service-role-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=твоят-secret
# ... други variables
```

### 3. Глобални пакети
```bash
npm install -g supabase
npm install -g vercel
```

### 4. Git настройки
```bash
git config --global user.name "Tihomir Todorov"
git config --global user.email "твоят-email@example.com"
```

## След настройване

### 1. Отвори VSCode
```bash
code .
```

### 2. Логни се в Supabase
```bash
supabase login
supabase link --project-ref wbxzkbiklullziogr
```

### 3. Стартирай проекта
```bash
npm run dev
```

## Полезни команди

- `npm run dev` - Development сървър
- `npm run build` - Build проекта
- `npm run start` - Production сървър
- `start-dev.bat` - Бързо стартиране (Windows)
- `deploy.bat` - Deployment към Vercel (Windows)

## Troubleshooting

### PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node.js не е намерен
Инсталирай от: https://nodejs.org/

### Git не е намерен
Инсталирай от: https://git-scm.com/

### Supabase CLI проблеми
```bash
npm uninstall -g supabase
npm install -g supabase
```

## Файлове създадени от скрипта

- `.env.local` - Environment variables
- `start-dev.bat` - Бързо стартиране
- `deploy.bat` - Deployment скрипт
- `rabotim-com.code-workspace` - VSCode workspace

## Поддръжка

Ако имаш проблеми:
1. Провери дали всички dependencies са инсталирани
2. Увери се че .env.local е попълнен правилно
3. Провери дали Supabase е правилно линкнат
4. Опитай `npm run build` за проверка на грешки


