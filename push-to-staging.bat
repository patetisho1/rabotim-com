@echo off
echo.
echo ================================
echo   Pushing to Staging
echo ================================
echo.

:: Disable Git pager
set GIT_PAGER=cat

:: Step 1: Switch to staging
echo [Step 1/4] Switching to staging branch...
git -c core.pager=cat checkout staging
if errorlevel 1 (
    echo ERROR: Failed to switch to staging
    pause
    exit /b 1
)
echo OK: Switched to staging
echo.

:: Step 2: Add changes
echo [Step 2/4] Adding changes...
git add .
echo OK: Changes added
echo.

:: Step 3: Commit
echo [Step 3/4] Committing...
git commit -m "Add Veliko Tarnovo to Popular Locations in footer"
if errorlevel 1 (
    echo ERROR: Failed to commit
    pause
    exit /b 1
)
echo OK: Committed
echo.

:: Step 4: Push
echo [Step 4/4] Pushing to GitHub staging...
git push origin staging
if errorlevel 1 (
    echo ERROR: Failed to push
    pause
    exit /b 1
)
echo.
echo ================================
echo   SUCCESS!
echo ================================
echo.
echo Your changes are now on staging!
echo Wait 2-3 minutes, then check:
echo https://rabotim-com-git-staging-tihomirs-projects-850a4235.vercel.app/
echo.
echo Look at the footer for "Veliko Tarnovo"
echo.
pause

