# Stripe Subscription Setup Guide

## Issue: "Checkout not available" or "Failed to create checkout session"

This guide helps you configure Stripe pricing for the subscription checkout system.

## Root Cause

The subscription checkout system requires **valid Stripe Price IDs** from your Stripe account. Without these, the checkout will fail with:
- "Checkout not available"
- "Failed to create checkout session"
- HTTP 503 or 500 error in `/api/subscriptions/checkout-session`

## Step 1: Create Products & Prices in Stripe

Go to [Stripe Dashboard](https://dashboard.stripe.com) → Products

### Create Product: Basic Plan

1. Click "+ Add product"
2. Name: "Basic Monthly" | Pricing Model: "Recurring"
3. Price: £19.99 / month
4. Copy the **Price ID** (starts with `price_`)
5. Repeat for:
   - **Basic Yearly**: £79.99 / year → Price ID
   - **Premium Monthly**: £29.99 / month → Price ID
   - **Premium Yearly**: £99.99 / year → Price ID
   - **Enterprise Monthly**: £39.99 / month → Price ID
   - **Enterprise Yearly**: £119.99 / year → Price ID

## Step 2: Add to .env.local

Create/update `.env.local` in your project root with:

```env
# Stripe Subscription Prices
STRIPE_PRICE_BASIC_MONTHLY=price_1Abc123Def456  # Replace with your actual Price ID
STRIPE_PRICE_BASIC_YEARLY=price_1Abc123Def457
STRIPE_PRICE_PREMIUM_MONTHLY=price_1Abc123Def458
STRIPE_PRICE_PREMIUM_YEARLY=price_1Abc123Def459
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1Abc123Def460
STRIPE_PRICE_ENTERPRISE_YEARLY=price_1Abc123Def461

# Test Products (Optional - for development)
STRIPE_BASIC=price_1Test000Test001  # £1 test product
STRIPE_BASIC2=price_1Test000Test002 # £2 test product
```

## Step 3: Verify Configuration

1. Restart your Next.js dev server: `npm run dev`
2. Try creating a checkout session
3. Check logs for confirmation:
   - ✅ "Checkout session created: cs_test_..."
   - ❌ "Invalid or unconfigured Stripe Price ID" → Missing env vars

## Step 4: Test Checkout Flow

1. Navigate to `/owner/subscription`
2. Click "Subscribe Now" on any paid plan
3. You should be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242` (expires: any future date)

## Troubleshooting

### Issue: "Checkout not available"

**Solution**: Check that your `.env.local` file has valid Stripe Price IDs that start with `price_`.

### Issue: "Invalid plan ID"

**Solution**: Ensure you're using one of these plan IDs:
- `basic_monthly`
- `basic_yearly`
- `premium_monthly`
- `premium_yearly`
- `enterprise_monthly`
- `enterprise_yearly`
- `test_basic` (for testing)
- `test_basic2` (for testing)

### Issue: "Unauthorized" (401)

**Solution**: Ensure you're logged in before attempting checkout.

## File References

- **Subscription Plans**: [`src/lib/subscription-plans.ts`](src/lib/subscription-plans.ts)
- **Checkout Endpoint**: [`src/app/api/subscriptions/checkout-session/route.ts`](src/app/api/subscriptions/checkout-session/route.ts)
- **Subscribe Handler**: [`src/app/owner/subscription/page.tsx`](src/app/owner/subscription/page.tsx#L175)
- **Plan Card Component**: [`src/components/subscription/PlanCard.tsx`](src/components/subscription/PlanCard.tsx)

## What Happens Next

After successful checkout:
1. Stripe webhook triggers (`/api/webhooks/stripe`)
2. User subscription is created in database
3. User is redirected to `/owner/subscription?success=true`
4. Dashboard shows "Current Plan" badge

## Need Help?

- Stripe Docs: https://stripe.com/docs/billing/checkout
- Create Test Account: https://dashboard.stripe.com/account/apikeys
- Run tests locally with test cards before going live

---

**Last Updated**: 29 Dec 2025
