# PowerShell скрипт за запазване на chat контекста
# Използвай преди преинсталация на компютъра

Write-Host "💾 Запазване на Chat Контекст..." -ForegroundColor Cyan
Write-Host ""

$contextFile = "CHAT_CONTEXT.md"
$backupFile = "CHAT_CONTEXT.backup.md"

# Създаване на backup ако файлът съществува
if (Test-Path $contextFile) {
    Copy-Item $contextFile $backupFile -Force
    Write-Host "✅ Backup създаден: $backupFile" -ForegroundColor Green
}

# Обновяване на датата в CHAT_CONTEXT.md
if (Test-Path $contextFile) {
    $content = Get-Content $contextFile -Raw
    $newDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $content = $content -replace '(?m)^\*\*Последно обновен:\*\* .*', "**Последно обновен:** $newDate"
    Set-Content $contextFile $content
    Write-Host "✅ Датата е обновена в CHAT_CONTEXT.md" -ForegroundColor Green
} else {
    Write-Host "⚠️  CHAT_CONTEXT.md не е намерен. Създава се нов файл..." -ForegroundColor Yellow
    Write-Host "   Използвай CHAT_CONTEXT.md като шаблон." -ForegroundColor Yellow
}

# Git операции
Write-Host ""
$commit = Read-Host "Commit и push промените в git? (y/n)"
if ($commit -eq "y" -or $commit -eq "Y") {
    # Add файловете
    git add CHAT_CONTEXT.md
    if (Test-Path $backupFile) {
        git add $backupFile
    }
    
    # Commit
    $date = Get-Date -Format "yyyy-MM-dd"
    git commit -m "docs: Update chat context - $date"
    
    # Push
    $push = Read-Host "Push към staging? (y/n)"
    if ($push -eq "y" -or $push -eq "Y") {
        git push origin staging
        Write-Host "✅ Промените са push-нати към staging" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Промените са commit-нати, но не са push-нати" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Промените не са commit-нати. Направи го ръчно:" -ForegroundColor Yellow
    Write-Host "   git add CHAT_CONTEXT.md" -ForegroundColor White
    Write-Host "   git commit -m 'docs: Update chat context'" -ForegroundColor White
    Write-Host "   git push origin staging" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Готово!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Следващи стъпки:" -ForegroundColor Cyan
Write-Host "1. Провери че CHAT_CONTEXT.md съдържа актуална информация" -ForegroundColor White
Write-Host "2. Commit и push промените преди преинсталация" -ForegroundColor White
Write-Host "3. След преинсталация използвай restore-chat-context.ps1" -ForegroundColor White
Write-Host ""

