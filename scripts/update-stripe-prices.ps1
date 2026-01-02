# Update Stripe Price IDs on Vercel
# New pricing structure

Write-Host "Updating Stripe Price IDs on Vercel..." -ForegroundColor Cyan

# New Price IDs
$priceIds = @{
    "STRIPE_PRICE_BASIC_MONTHLY" = "price_1Sl78LIakKHMdeEkqsJIGSVE"
    "STRIPE_PRICE_BASIC_YEARLY" = "price_1Sl78oIakKHMdeEkKz8Mimoo"
    "STRIPE_PRICE_PREMIUM_MONTHLY" = "price_1Sl79LIakKHMdeEkmfiimgdY"
    "STRIPE_PRICE_PREMIUM_YEARLY" = "price_1Sl79sIakKHMdeEkKbErH5Aj"
    "STRIPE_PRICE_ENTERPRISE_MONTHLY" = "price_1Sl7A8IakKHMdeEk8dDKQz7h"
    "STRIPE_PRICE_ENTERPRISE_YEARLY" = "price_1Sl7AdIakKHMdeEkHIzZKd78"
}

# Update each environment variable for all environments
foreach ($key in $priceIds.Keys) {
    $value = $priceIds[$key]
    Write-Host "Updating $key = $value" -ForegroundColor Yellow
    
    # Update for Production, Preview, and Development
    vercel env rm $key production --yes 2>$null
    vercel env rm $key preview --yes 2>$null
    vercel env rm $key development --yes 2>$null
    
    echo $value | vercel env add $key production
    echo $value | vercel env add $key preview
    echo $value | vercel env add $key development
}

Write-Host "All Stripe price IDs updated successfully!" -ForegroundColor Green
Write-Host "Now redeploy your project on Vercel" -ForegroundColor Cyan
