# PowerShell скрипт за възстановяване на chat контекста
# Използвай след преинсталация на компютъра

Write-Host "🔄 Възстановяване на Chat Контекст..." -ForegroundColor Cyan
Write-Host ""

# Проверка дали файлът съществува
if (-not (Test-Path "CHAT_CONTEXT.md")) {
    Write-Host "❌ Грешка: CHAT_CONTEXT.md не е намерен!" -ForegroundColor Red
    Write-Host "   Уверете се, че сте в правилната директория." -ForegroundColor Yellow
    exit 1
}

# Показване на съдържанието
Write-Host "📄 Съдържание на CHAT_CONTEXT.md:" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Get-Content "CHAT_CONTEXT.md" | Select-Object -First 50
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Отваряне на файла в редактор
$editor = Read-Host "Отвори файла в редактор? (y/n)"
if ($editor -eq "y" -or $editor -eq "Y") {
    if (Get-Command code -ErrorAction SilentlyContinue) {
        code CHAT_CONTEXT.md
        Write-Host "✅ Файлът е отворен в VS Code/Cursor" -ForegroundColor Green
    } elseif (Get-Command notepad -ErrorAction SilentlyContinue) {
        notepad CHAT_CONTEXT.md
        Write-Host "✅ Файлът е отворен в Notepad" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Не е намерен редактор. Отвори ръчно CHAT_CONTEXT.md" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "💡 Следващи стъпки:" -ForegroundColor Cyan
Write-Host "1. Прочети CHAT_CONTEXT.md файла" -ForegroundColor White
Write-Host "2. Отвори AI чата в Cursor" -ForegroundColor White
Write-Host "3. Кажи на AI: 'Прочети CHAT_CONTEXT.md файла и възстанови контекста на проекта'" -ForegroundColor White
Write-Host ""

Write-Host "✅ Готово!" -ForegroundColor Green

