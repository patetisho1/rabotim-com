# PowerShell скрипт за автоматично настройване на нов машина
# Изпълни с: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# След това: .\setup-new-machine.ps1

Write-Host "🚀 Започвам автоматично настройване на development среда..." -ForegroundColor Green

# 1. Проверка на Node.js
Write-Host "`n📦 Проверявам Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion, npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js не е инсталиран! Моля инсталирай го от https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# 2. Проверка на Git
Write-Host "`n🔧 Проверявам Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git не е инсталиран! Моля инсталирай го от https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# 3. Инсталиране на глобални пакети
Write-Host "`n📦 Инсталирам глобални пакети..." -ForegroundColor Yellow
npm install -g supabase
npm install -g vercel
Write-Host "✅ Глобални пакети инсталирани" -ForegroundColor Green

# 4. Настройване на Git (попитай за данните)
Write-Host "`n🔧 Настройвам Git..." -ForegroundColor Yellow
$userName = Read-Host "Въведи Git username (Tihomir Todorov)"
$userEmail = Read-Host "Въведи Git email"

git config --global user.name $userName
git config --global user.email $userEmail
git config --global init.defaultBranch main
git config --global pull.rebase false

Write-Host "✅ Git настроен" -ForegroundColor Green

# 5. Инсталиране на VSCode Extensions
Write-Host "`n🎨 Инсталирам VSCode Extensions..." -ForegroundColor Yellow

$extensions = @(
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json",
    "github.copilot",
    "github.copilot-chat",
    "supabase.supabase-vscode",
    "rangav.vscode-thunder-client",
    "ms-vscode.vscode-git-graph",
    "eamodio.gitlens"
)

foreach ($extension in $extensions) {
    Write-Host "Инсталирам $extension..." -ForegroundColor Cyan
    code --install-extension $extension
}

Write-Host "✅ VSCode Extensions инсталирани" -ForegroundColor Green

# 6. Създаване на .env.local файл
Write-Host "`n🔐 Създавам .env.local файл..." -ForegroundColor Yellow

$envContent = @"
# Environment Variables за Vercel
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Rabotim.com

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://wbxzkbiklullziogr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend Email
RESEND_API_KEY=re_your-api-key

# PWA Settings
NEXT_PUBLIC_PWA_ENABLED=true
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ .env.local файл създаден (моля попълни реалните стойности)" -ForegroundColor Green

# 7. Инсталиране на dependencies
Write-Host "`n📦 Инсталирам project dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies инсталирани" -ForegroundColor Green

# 8. Създаване на полезни скриптове
Write-Host "`n🛠️ Създавам полезни скриптове..." -ForegroundColor Yellow

# Скрипт за бързо стартиране
$startScript = @"
@echo off
echo 🚀 Стартирам development сървър...
npm run dev
"@
$startScript | Out-File -FilePath "start-dev.bat" -Encoding ASCII

# Скрипт за deployment
$deployScript = @"
@echo off
echo 🚀 Deploying към Vercel...
vercel --prod
"@
$deployScript | Out-File -FilePath "deploy.bat" -Encoding ASCII

Write-Host "✅ Полезни скриптове създадени" -ForegroundColor Green

# 9. Създаване на VS Code workspace файл
Write-Host "`n🎨 Създавам VSCode workspace..." -ForegroundColor Yellow

$workspaceContent = @"
{
    "folders": [
        {
            "path": "."
        }
    ],
    "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true
        },
        "emmet.includeLanguages": {
            "javascript": "javascriptreact",
            "typescript": "typescriptreact"
        },
        "tailwindCSS.includeLanguages": {
            "javascript": "javascript",
            "html": "HTML"
        },
        "files.associations": {
            "*.css": "tailwindcss"
        },
        "typescript.preferences.importModuleSpecifier": "relative",
        "editor.tabSize": 2,
        "editor.insertSpaces": true,
        "files.eol": "\n",
        "files.insertFinalNewline": true,
        "files.trimTrailingWhitespace": true
    },
    "extensions": {
        "recommendations": [
            "ms-vscode.vscode-typescript-next",
            "bradlc.vscode-tailwindcss",
            "esbenp.prettier-vscode",
            "ms-vscode.vscode-eslint",
            "supabase.supabase-vscode"
        ]
    }
}
"@

$workspaceContent | Out-File -FilePath "rabotim-com.code-workspace" -Encoding UTF8
Write-Host "✅ VSCode workspace създаден" -ForegroundColor Green

# 10. Финален тест
Write-Host "`n🧪 Тествам setup-а..." -ForegroundColor Yellow

try {
    npm run build
    Write-Host "✅ Build успешен!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Build неуспешен, но това е нормално ако нямаш попълнени environment variables" -ForegroundColor Yellow
}

Write-Host "`n🎉 Setup завършен успешно!" -ForegroundColor Green
Write-Host "`n📋 Следващи стъпки:" -ForegroundColor Cyan
Write-Host "1. Отвори VSCode с: code ." -ForegroundColor White
Write-Host "2. Попълни .env.local с реалните стойности" -ForegroundColor White
Write-Host "3. Логни се в Supabase: supabase login" -ForegroundColor White
Write-Host "4. Линкни проекта: supabase link --project-ref wbxzkbiklullziogr" -ForegroundColor White
Write-Host "5. Стартирай development сървър: npm run dev" -ForegroundColor White

Write-Host "`n💡 Полезни команди:" -ForegroundColor Cyan
Write-Host "• npm run dev - стартиране на dev сървър" -ForegroundColor White
Write-Host "• npm run build - build на проекта" -ForegroundColor White
Write-Host "• npm run start - стартиране на production build" -ForegroundColor White
Write-Host "• start-dev.bat - бързо стартиране на dev сървър" -ForegroundColor White
Write-Host "• deploy.bat - deployment към Vercel" -ForegroundColor White


