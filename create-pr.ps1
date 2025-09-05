# PowerShell скрипт за автоматично създаване на Pull Request
Write-Host "🚀 Създаване на Pull Request..." -ForegroundColor Green

# Отваряме GitHub страницата за Pull Request
$url = "https://github.com/patetisho1/rabotim-com/compare/main...staging"
Write-Host "🔗 Отваряне на: $url" -ForegroundColor Cyan

# Отваряме в браузъра
Start-Process $url

Write-Host "✅ GitHub страницата е отворена в браузъра!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следвайте тези стъпки:" -ForegroundColor Yellow
Write-Host "1. Попълнете заглавието: 🚀 Sync staging to production - Ready for deployment" -ForegroundColor White
Write-Host "2. Поставете описанието (ще се покаже след секунда)" -ForegroundColor White
Write-Host "3. Кликнете 'Create pull request'" -ForegroundColor White
Write-Host "4. След това кликнете 'Merge pull request'" -ForegroundColor White
Write-Host ""

# Изчакваме 3 секунди
Start-Sleep -Seconds 3

Write-Host "📝 Описание за Pull Request:" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Gray
Write-Host @"
## 📋 Описание

Този Pull Request синхронизира staging средата с production.

## ✅ Завършени функционалности:
- **Публикуване на задачи** - 5-стъпков процес с валидация
- **Подаване на оферти** - Пълнофункционална форма
- **Система за съобщения** - Real-time чат
- **Админ панел** - Аналитика и статистики
- **Платежна система** - Stripe интеграция

## 🔧 Поправки:
- Поправена синтактична грешка в page.tsx
- Поправена TypeScript грешка в submit-offer

## 🧪 Тестване:
- [x] Всички функционалности тествани в staging
- [x] Build работи без грешки
- [x] TypeScript проверки преминават

## 🚀 Готов за production deployment!
"@ -ForegroundColor White
Write-Host "===============================================" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 Готово! Следвайте стъпките в браузъра." -ForegroundColor Green
