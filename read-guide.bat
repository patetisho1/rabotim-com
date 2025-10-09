@echo off
echo ========================================
echo    RABOTIM.COM SETUP GUIDE READER
echo ========================================
echo.

REM Проверка дали PowerShell е наличен
powershell -Command "Get-ExecutionPolicy" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PowerShell не е наличен!
    echo Моля инсталирайте PowerShell или използвайте Git Bash
    pause
    exit /b 1
)

REM Проверка дали файлът съществува
if not exist "SETUP_GUIDE_COMPLETE.md" (
    echo ❌ Файлът SETUP_GUIDE_COMPLETE.md не е намерен!
    echo Уверете се, че сте в правилната директория.
    pause
    exit /b 1
)

echo 📖 Стартиране на PowerShell скрипта...
echo.

REM Изпълнение на PowerShell скрипта
powershell -ExecutionPolicy Bypass -File "read-guide.ps1"

echo.
echo Натиснете Enter за да затворите...
pause >nul
