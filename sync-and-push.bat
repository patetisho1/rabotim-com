@echo off
echo ========================================
echo   SYNCING AND PUSHING TO STAGING
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Pulling latest from staging...
git pull origin staging --no-edit
echo.

echo [2/5] Adding changes...
git add .
echo.

echo [3/5] Committing...
git commit -m "Add Veliko Tarnovo to Popular Locations in footer" 2>nul
echo.

echo [4/5] Pushing to staging...
git push origin staging
echo.

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERROR OCCURRED
    echo ========================================
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Wait 2-3 minutes for Vercel to deploy
echo Then check: https://rabotim-com-git-staging-tihomirs-projects-850a4235.vercel.app/
echo Look at footer for "Велико Търново"
echo.
pause


