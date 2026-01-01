# 🔧 Stripe Environment Variables Fix

## Problem
The subscription checkout was failing with:
```
Subscription plan "Basic Monthly" is not yet available. Please contact support to set up this plan.
```

## Root Cause
**Environment variable naming mismatch:**
- Code expects: `STRIPE_PRICE_BASIC_MONTHLY`
- Your .env had: `STRIPE_BASIC_MONTHLY`

## ✅ Fixed Locally
Your local `.env` file has been updated with the correct variable names:

```bash
STRIPE_PRICE_BASIC_MONTHLY=price_1SkW5KIakKHMdeEkvyqwTFba
STRIPE_PRICE_BASIC_YEARLY=price_1SkW5qIakKHMdeEkEZlxCFuV
STRIPE_PRICE_PREMIUM_MONTHLY=price_1SkW6HIakKHMdeEklSTV8dDm
STRIPE_PRICE_PREMIUM_YEARLY=price_1SkW72IakKHMdeEkXBfUXWsh
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1SkW7PIakKHMdeEkojicRz1N
STRIPE_PRICE_ENTERPRISE_YEARLY=price_1SkW7sIakKHMdeEkaxfLtsjI
```

## 🚀 Required: Update Vercel Environment Variables

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/waseem-mazaris-projects/escape-houses-1-main/settings/environment-variables

2. Add/Update these 6 environment variables for **Production, Preview, and Development**:

```
STRIPE_PRICE_BASIC_MONTHLY = price_1SkW5KIakKHMdeEkvyqwTFba
STRIPE_PRICE_BASIC_YEARLY = price_1SkW5qIakKHMdeEkEZlxCFuV
STRIPE_PRICE_PREMIUM_MONTHLY = price_1SkW6HIakKHMdeEklSTV8dDm
STRIPE_PRICE_PREMIUM_YEARLY = price_1SkW72IakKHMdeEkXBfUXWsh
STRIPE_PRICE_ENTERPRISE_MONTHLY = price_1SkW7PIakKHMdeEkojicRz1N
STRIPE_PRICE_ENTERPRISE_YEARLY = price_1SkW7sIakKHMdeEkaxfLtsjI
```

3. **Delete the old variables** (if they exist):
   - `STRIPE_BASIC_MONTHLY`
   - `STRIPE_BASIC_YEARLY`
   - `STRIPE_PREMIUM_MONTHLY`
   - `STRIPE_PREMIUM_YEARLY`
   - `STRIPE_ENTERPRISE_MONTHLY`
   - `STRIPE_ENTERPRISE_YEARLY`

4. Click "Save"

5. **Redeploy**: Go to Deployments → Click the three dots on latest deployment → Redeploy

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login
vercel login

# Link project (if not already linked)
vercel link

# Set environment variables
vercel env add STRIPE_PRICE_BASIC_MONTHLY production
# Paste: price_1SkW5KIakKHMdeEkvyqwTFba

vercel env add STRIPE_PRICE_BASIC_YEARLY production
# Paste: price_1SkW5qIakKHMdeEkEZlxCFuV

vercel env add STRIPE_PRICE_PREMIUM_MONTHLY production
# Paste: price_1SkW6HIakKHMdeEklSTV8dDm

vercel env add STRIPE_PRICE_PREMIUM_YEARLY production
# Paste: price_1SkW72IakKHMdeEkXBfUXWsh

vercel env add STRIPE_PRICE_ENTERPRISE_MONTHLY production
# Paste: price_1SkW7PIakKHMdeEkojicRz1N

vercel env add STRIPE_PRICE_ENTERPRISE_YEARLY production
# Paste: price_1SkW7sIakKHMdeEkaxfLtsjI

# Redeploy
vercel --prod
```

## 🧪 Test Locally

Restart your dev server to pick up the new environment variables:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

Then test the subscription checkout at:
- http://localhost:3000/owner/subscription

## ✅ Verification Checklist

- [ ] Updated `.env` file locally with `STRIPE_PRICE_*` variables
- [ ] Restarted local dev server
- [ ] Tested subscription checkout locally
- [ ] Added `STRIPE_PRICE_*` variables to Vercel dashboard
- [ ] Deleted old `STRIPE_*` variables from Vercel (if they exist)
- [ ] Redeployed on Vercel
- [ ] Tested subscription checkout on production

## 🎯 Expected Behavior After Fix

When you select a subscription plan (e.g., "Basic Monthly"):
1. ✅ Checkout session should be created successfully
2. ✅ You should be redirected to Stripe checkout page
3. ✅ Payment can be completed
4. ✅ Subscription activates in your account

## 📝 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `STRIPE_PRICE_BASIC_MONTHLY` | Basic Monthly plan price ID | `price_1SkW5KIakKHMdeEkvyqwTFba` |
| `STRIPE_PRICE_BASIC_YEARLY` | Basic Yearly plan price ID | `price_1SkW5qIakKHMdeEkEZlxCFuV` |
| `STRIPE_PRICE_PREMIUM_MONTHLY` | Premium Monthly plan price ID | `price_1SkW6HIakKHMdeEklSTV8dDm` |
| `STRIPE_PRICE_PREMIUM_YEARLY` | Premium Yearly plan price ID | `price_1SkW72IakKHMdeEkXBfUXWsh` |
| `STRIPE_PRICE_ENTERPRISE_MONTHLY` | Enterprise Monthly plan price ID | `price_1SkW7PIakKHMdeEkojicRz1N` |
| `STRIPE_PRICE_ENTERPRISE_YEARLY` | Enterprise Yearly plan price ID | `price_1SkW7sIakKHMdeEkaxfLtsjI` |

## 🔍 How to Get Your Stripe Price IDs

If you need to find or verify your Stripe Price IDs:

1. Go to: https://dashboard.stripe.com/test/prices
2. Each price has an ID starting with `price_`
3. Click on a price to see its details
4. Copy the Price ID from the top of the page

## 💡 Why This Happened

The code in `src/lib/subscription-plans.ts` reads environment variables:

```typescript
stripePriceId: process.env.STRIPE_PRICE_BASIC_MONTHLY || '',
```

Your `.env` file had `STRIPE_BASIC_MONTHLY` instead of `STRIPE_PRICE_BASIC_MONTHLY`, causing the code to receive an empty string, which triggered the "not yet available" error.
