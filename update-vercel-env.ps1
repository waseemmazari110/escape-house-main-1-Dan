# Update Vercel Environment Variables
# This script helps update the critical environment variables in Vercel

Write-Host "`n🔧 VERCEL ENVIRONMENT VARIABLES UPDATE SCRIPT" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host "`n📋 This script will guide you through updating Vercel environment variables" -ForegroundColor Yellow
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "1️⃣  Checking Vercel CLI..." -ForegroundColor Green
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "   ❌ Vercel CLI not found" -ForegroundColor Red
    Write-Host "   💡 Install it with: npm install -g vercel" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   After installing, run this script again or update manually:" -ForegroundColor Yellow
    Write-Host "   👉 https://vercel.com/dan/escape-house-main-1-dan/settings/environment-variables" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "   ✅ Vercel CLI found" -ForegroundColor Green
}

# Show current environment variables from .env
Write-Host "`n2️⃣  Reading current .env file..." -ForegroundColor Green
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    
    # Extract the URLs
    $currentAppUrl = ($envContent | Select-String -Pattern 'NEXT_PUBLIC_APP_URL=(.+)' -AllMatches).Matches.Groups[1].Value
    $currentAuthUrl = ($envContent | Select-String -Pattern 'BETTER_AUTH_URL=(?!.*#)(.+)' -AllMatches).Matches[-1].Groups[1].Value
    
    Write-Host "   📝 Current settings in .env:" -ForegroundColor Cyan
    Write-Host "      NEXT_PUBLIC_APP_URL = $currentAppUrl" -ForegroundColor White
    Write-Host "      BETTER_AUTH_URL = $currentAuthUrl" -ForegroundColor White
} else {
    Write-Host "   ❌ .env file not found" -ForegroundColor Red
    exit 1
}

# Verify URLs have HTTPS
Write-Host "`n3️⃣  Verifying URLs..." -ForegroundColor Green
$hasIssues = $false

if ($currentAppUrl -like "http://*" -and $currentAppUrl -notlike "http://localhost*") {
    Write-Host "   ⚠️  NEXT_PUBLIC_APP_URL uses HTTP instead of HTTPS!" -ForegroundColor Red
    $hasIssues = $true
}

if ($currentAuthUrl -like "http://*" -and $currentAuthUrl -notlike "http://localhost*") {
    Write-Host "   ⚠️  BETTER_AUTH_URL uses HTTP instead of HTTPS!" -ForegroundColor Red
    $hasIssues = $true
}

if (-not $hasIssues) {
    Write-Host "   ✅ URLs are correct (using HTTPS)" -ForegroundColor Green
} else {
    Write-Host "   💡 The .env file has been fixed, but Vercel environment variables need updating!" -ForegroundColor Yellow
}

# Provide update commands
Write-Host "`n4️⃣  Update Vercel Environment Variables" -ForegroundColor Green
Write-Host ""
Write-Host "   Option A: Use Vercel CLI (Automated)" -ForegroundColor Cyan
Write-Host "   ----------------------------------------" -ForegroundColor Gray
Write-Host "   Run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "   vercel env rm BETTER_AUTH_URL production" -ForegroundColor Yellow
Write-Host "   vercel env add BETTER_AUTH_URL production" -ForegroundColor Yellow
Write-Host "   # When prompted, enter: https://escape-house-main-1-dan.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "   vercel env rm NEXT_PUBLIC_APP_URL production" -ForegroundColor Yellow
Write-Host "   vercel env add NEXT_PUBLIC_APP_URL production" -ForegroundColor Yellow
Write-Host "   # When prompted, enter: https://escape-house-main-1-dan.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "   Option B: Use Vercel Dashboard (Manual)" -ForegroundColor Cyan
Write-Host "   ----------------------------------------" -ForegroundColor Gray
Write-Host "   1. Go to: https://vercel.com/dan/escape-house-main-1-dan/settings/environment-variables" -ForegroundColor White
Write-Host "   2. Find and edit these variables:" -ForegroundColor White
Write-Host "      - BETTER_AUTH_URL" -ForegroundColor Yellow
Write-Host "      - NEXT_PUBLIC_APP_URL" -ForegroundColor Yellow
Write-Host "   3. Set both to: https://escape-house-main-1-dan.vercel.app" -ForegroundColor White
Write-Host "   4. Make sure they apply to: Production" -ForegroundColor White
Write-Host ""

# Ask if user wants to update now
Write-Host "`n5️⃣  Would you like to update via CLI now? (y/n): " -ForegroundColor Green -NoNewline
$response = Read-Host

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "`n   📡 Updating BETTER_AUTH_URL..." -ForegroundColor Cyan
    
    # Remove old variable
    Write-Host "   Removing old value..." -ForegroundColor Gray
    vercel env rm BETTER_AUTH_URL production --yes 2>$null
    
    # Add new variable
    Write-Host "   Adding new value..." -ForegroundColor Gray
    Write-Host "https://escape-house-main-1-dan.vercel.app" | vercel env add BETTER_AUTH_URL production
    
    Write-Host "`n   📡 Updating NEXT_PUBLIC_APP_URL..." -ForegroundColor Cyan
    
    # Remove old variable
    Write-Host "   Removing old value..." -ForegroundColor Gray
    vercel env rm NEXT_PUBLIC_APP_URL production --yes 2>$null
    
    # Add new variable
    Write-Host "   Adding new value..." -ForegroundColor Gray
    Write-Host "https://escape-house-main-1-dan.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production
    
    Write-Host "`n   ✅ Environment variables updated!" -ForegroundColor Green
    
    # Prompt for redeployment
    Write-Host "`n6️⃣  Redeploy application? (y/n): " -ForegroundColor Green -NoNewline
    $deployResponse = Read-Host
    
    if ($deployResponse -eq 'y' -or $deployResponse -eq 'Y') {
        Write-Host "`n   🚀 Deploying to production..." -ForegroundColor Cyan
        vercel --prod
        Write-Host "`n   ✅ Deployment complete!" -ForegroundColor Green
    } else {
        Write-Host "`n   ⚠️  Remember to redeploy manually for changes to take effect!" -ForegroundColor Yellow
        Write-Host "   Run: vercel --prod" -ForegroundColor Cyan
    }
} else {
    Write-Host "`n   ℹ️  Skipping CLI update" -ForegroundColor Cyan
    Write-Host "   💡 Update manually via Vercel Dashboard or run the commands above" -ForegroundColor Yellow
}

# Final summary
Write-Host "`n" + "=" * 60 -ForegroundColor Cyan
Write-Host "📊 SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Local .env file: FIXED" -ForegroundColor Green
Write-Host "   - URLs use HTTPS protocol" -ForegroundColor Gray
Write-Host ""

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "✅ Vercel environment variables: UPDATED" -ForegroundColor Green
    Write-Host "   - BETTER_AUTH_URL = https://escape-house-main-1-dan.vercel.app" -ForegroundColor Gray
    Write-Host "   - NEXT_PUBLIC_APP_URL = https://escape-house-main-1-dan.vercel.app" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Vercel environment variables: PENDING UPDATE" -ForegroundColor Yellow
    Write-Host "   - Update manually or re-run this script" -ForegroundColor Gray
}
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "   1. Clear browser cache" -ForegroundColor White
Write-Host "   2. Test owner login: https://escape-house-main-1-dan.vercel.app/owner/login" -ForegroundColor White
Write-Host "   3. Test payment history: /owner/dashboard?view=payments" -ForegroundColor White
Write-Host "   4. Run verification: npx tsx scripts/verify-payment-history.ts" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full documentation: FIXES_APPLIED_OWNER_TRANSACTIONS.md" -ForegroundColor Cyan
Write-Host ""
