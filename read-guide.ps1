# PowerShell скрипт за четене на SETUP_GUIDE_COMPLETE.md
# Използване: .\read-guide.ps1

param(
    [string]$Path = "SETUP_GUIDE_COMPLETE.md"
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "    RABOTIM.COM SETUP GUIDE READER" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Проверка дали файлът съществува
if (-not (Test-Path $Path)) {
    Write-Host "❌ Файлът $Path не е намерен!" -ForegroundColor Red
    Write-Host "Уверете се, че сте в правилната директория." -ForegroundColor Yellow
    exit 1
}

Write-Host "📖 Четене на $Path..." -ForegroundColor Cyan
Write-Host ""

# Четене на файла с цветно форматиране
$content = Get-Content $Path -Raw

# Разделяне на секции
$sections = $content -split "## "

foreach ($section in $sections) {
    if ($section.Trim() -eq "") { continue }
    
    $lines = $section -split "`n"
    $title = $lines[0]
    
    # Цветно форматиране на заглавията
    if ($title -match "^#") {
        Write-Host $title -ForegroundColor Magenta
    } elseif ($title -match "^##") {
        Write-Host $title -ForegroundColor Yellow
    } elseif ($title -match "^###") {
        Write-Host $title -ForegroundColor Cyan
    } else {
        Write-Host $title -ForegroundColor White
    }
    
    # Извеждане на съдържанието
    for ($i = 1; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        
        # Цветно форматиране на различните типове съдържание
        if ($line -match "^```") {
            Write-Host $line -ForegroundColor Gray
        } elseif ($line -match "^\s*-\s*") {
            Write-Host $line -ForegroundColor Green
        } elseif ($line -match "^\s*\d+\.\s*") {
            Write-Host $line -ForegroundColor Blue
        } elseif ($line -match "^\s*✅") {
            Write-Host $line -ForegroundColor Green
        } elseif ($line -match "^\s*🔄") {
            Write-Host $line -ForegroundColor Yellow
        } elseif ($line -match "^\s*📋") {
            Write-Host $line -ForegroundColor Cyan
        } elseif ($line -match "^\s*❌") {
            Write-Host $line -ForegroundColor Red
        } else {
            Write-Host $line -ForegroundColor White
        }
    }
    
    Write-Host ""
    
    # Пауза между секциите
    if ($title -match "^## ") {
        Write-Host "Натиснете Enter за да продължите..." -ForegroundColor Gray
        Read-Host
        Clear-Host
    }
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "    КРАЙ НА ГАЙДА" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "За да стартирате проекта:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "За Git операции:" -ForegroundColor Yellow
Write-Host "  git status" -ForegroundColor White
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'описание'" -ForegroundColor White
Write-Host "  git push origin staging" -ForegroundColor White





