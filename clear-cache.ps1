#!/usr/bin/env pwsh
# Clear Next.js and Node.js cache script
# This script removes all cache directories to ensure a clean build

Write-Host "🧹 Clearing Next.js and Node.js cache..." -ForegroundColor Cyan

# Clear Next.js build cache
if (Test-Path ".next") {
    Write-Host "  ✓ Removing .next directory..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ .next directory removed" -ForegroundColor Green
} else {
    Write-Host "  ℹ .next directory not found" -ForegroundColor Gray
}

# Clear Next.js cache
if (Test-Path ".next/cache") {
    Write-Host "  ✓ Removing .next/cache directory..." -ForegroundColor Yellow
    Remove-Item -Path ".next/cache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ .next/cache directory removed" -ForegroundColor Green
}

# Clear node_modules cache
if (Test-Path "node_modules/.cache") {
    Write-Host "  ✓ Removing node_modules/.cache directory..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ node_modules/.cache directory removed" -ForegroundColor Green
} else {
    Write-Host "  ℹ node_modules/.cache directory not found" -ForegroundColor Gray
}

# Clear Turbopack cache if exists
if (Test-Path ".turbo") {
    Write-Host "  ✓ Removing .turbo directory..." -ForegroundColor Yellow
    Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ .turbo directory removed" -ForegroundColor Green
}

# Clear TypeScript build info
if (Test-Path "tsconfig.tsbuildinfo") {
    Write-Host "  ✓ Removing TypeScript build info..." -ForegroundColor Yellow
    Remove-Item -Path "tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ TypeScript build info removed" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Cache cleared successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run: npm run dev or npm run build" -ForegroundColor Cyan
