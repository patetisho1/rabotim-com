# Push changes to staging
Write-Host "🚀 Pushing changes to staging..." -ForegroundColor Green
Write-Host ""

# Switch to staging branch
Write-Host "📌 Step 1: Switching to staging branch..." -ForegroundColor Cyan
git checkout staging
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to switch to staging branch" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Switched to staging" -ForegroundColor Green
Write-Host ""

# Add all changes
Write-Host "📌 Step 2: Adding changes..." -ForegroundColor Cyan
git add .
Write-Host "✅ Changes added" -ForegroundColor Green
Write-Host ""

# Commit changes
Write-Host "📌 Step 3: Committing changes..." -ForegroundColor Cyan
git commit -m "Add Велико Търново to Popular Locations in footer"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to commit (maybe no changes?)" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

# Push to staging
Write-Host "📌 Step 4: Pushing to GitHub staging..." -ForegroundColor Cyan
git push origin staging
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to staging" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Pushed to staging!" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 SUCCESS! Your changes are now on staging!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Wait 2-3 minutes for Vercel to deploy" -ForegroundColor White
Write-Host "2. Check staging: https://rabotim-com-git-staging-tihomirs-projects-850a4235.vercel.app/" -ForegroundColor White
Write-Host "3. Look at the footer - you should see 'Велико Търново' at the bottom of Popular Locations" -ForegroundColor White
Write-Host "4. If happy, run: .\create-pr.ps1 to push to production" -ForegroundColor White
Write-Host ""


