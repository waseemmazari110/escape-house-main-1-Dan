$files = @(
'src\app\house-styles\party-houses\page.tsx',
'src\app\house-styles\luxury-houses\page.tsx',
'src\app\house-styles\stately-houses\page.tsx',
'src\app\house-styles\unusual-and-quirky\page.tsx',
'src\app\features\indoor-swimming-pool\page.tsx',
'src\app\features\tennis-court\page.tsx',
'src\app\house-styles-and-features\page.tsx',
'src\app\features\cinema-room\page.tsx',
'src\app\features\fishing-lake\page.tsx',
'src\app\house-styles\luxury-cottages-with-sea-views\page.tsx',
'src\app\house-styles\large-holiday-homes\page.tsx',
'src\app\house-styles\large-cottages\page.tsx',
'src\app\house-styles\country-houses\page.tsx',
'src\app\features\ev-charging\page.tsx',
'src\app\features\ground-floor-bedroom\page.tsx',
'src\app\house-styles\luxury-dog-friendly-cottages\page.tsx',
'src\app\house-styles\castles\page.tsx',
'src\components\admin\PropertyMultiStepForm.tsx',
'src\app\features\games-room\page.tsx',
'src\components\ui\breadcrumb.tsx',
'src\app\features\hot-tub\page.tsx',
'src\app\features\swimming-pool\page.tsx',
'src\components\autumn\checkout-dialog.tsx',
'src\app\features\direct-beach-access\page.tsx',
'src\app\house-styles\manor-houses\page.tsx',
'src\app\house-styles\family-holidays\page.tsx',
'src\components\ui\menubar.tsx',
'src\components\ui\dropdown-menu.tsx',
'src\components\ui\context-menu.tsx',
'src\app\destinations\[slug]\page.tsx',
'src\components\ui\select.tsx',
'src\components\ui\navigation-menu.tsx',
'src\components\ui\accordion.tsx',
'src\components\Header.tsx',
'src\components\FAQSection.tsx',
'src\components\FAQAccordion.tsx',
'src\app\occasions\weekend-breaks\page.tsx',
'src\app\occasions\weddings\page.tsx',
'src\app\occasions\special-celebrations\page.tsx',
'src\app\occasions\new-year\page.tsx',
'src\app\occasions\easter\page.tsx',
'src\app\occasions\hen-party-houses\page.tsx',
'src\app\occasions\christmas\page.tsx'
)

foreach ($f in $files) { 
    if (Test-Path $f) { 
        $content = Get-Content -LiteralPath $f -Raw
        $content = $content -replace '(\bChevronRight)([,\s}])','${1}Icon${2}' 
        $content = $content -replace '(\bChevronLeft)([,\s}])','${1}Icon${2}' 
        $content = $content -replace '(\bChevronDown)([,\s}])','${1}Icon${2}'
        Set-Content -LiteralPath $f -Value $content -NoNewline
        Write-Host "Fixed: $f"
    } else {
        Write-Host "Not found: $f" -ForegroundColor Yellow
    }
}

Write-Host "`nAll done!" -ForegroundColor Green
