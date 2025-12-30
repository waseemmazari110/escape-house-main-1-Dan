# Owner Plan Payment Transaction Tracking - Complete Guide

## Overview
This document explains how owner plan payments are tracked and stored, troubleshooting steps, and how to verify all transactions are properly recorded in the admin dashboard.

## ✅ How Payment Tracking Works

### Payment Flow
```
Owner Subscribes → Stripe Checkout → Webhook Events → Database Records → Admin Dashboard
```

### 1. **Checkout Session Creation**
**File**: `src/app/api/subscriptions/checkout-session/route.ts`

When an owner subscribes to a plan:
- Creates Stripe Checkout Session with metadata:
  - `userId`: User ID
  - `role`: 'owner'
  - `subscriptionPlan`: Plan ID (e.g., 'basic-monthly')
  - `planId`: Plan ID
  - `tier`: Plan tier (e.g., 'basic')
- Metadata is attached to:
  - Checkout session
  - Subscription (via `subscription_data.metadata`)

### 2. **Webhook Event Processing**
**File**: `src/lib/stripe-billing.ts`

When payment succeeds, Stripe sends webhook events:

#### Event 1: `checkout.session.completed`
- Creates subscription record in database
- Creates invoice record
- **Creates payment record** with full metadata

#### Event 2: `invoice.payment_succeeded`
- Updates invoice status to 'paid'
- **Creates/updates payment record** with enriched data
- Syncs membership status

#### Event 3: `payment_intent.succeeded`
- **Creates/updates payment record** (fallback)

### 3. **Payment Record Creation**
**Function**: `createOrUpdatePayment()`

Payment records include:
- ✓ User information (userId, role, email)
- ✓ Subscription plan details (planName, tier)
- ✓ Payment details (amount, currency, status)
- ✓ Payment method (card brand, last 4 digits)
- ✓ Stripe references (customer, payment intent, charge, invoice, subscription IDs)
- ✓ Timestamps (created, processed)

### 4. **Admin Dashboard Display**
**File**: `src/app/admin/payments/page.tsx`
**API**: `src/app/api/admin/payments/history/route.ts`

Displays all payments with:
- User details (name, email, role)
- Plan information
- Amount and currency
- Payment status
- Date and time

---

## 🔍 Troubleshooting Missing Transactions

### Check 1: Verify Payments in Database
Run the check script:
```bash
npx tsx check-payments-data.ts
```

This shows:
- Total payments count
- Payment statistics (succeeded, pending, failed)
- Payments by user role
- Recent payments
- Subscriptions without payments

### Check 2: Verify Webhook Configuration
1. Check Stripe webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/billing`
   - Events subscribed: All invoice and payment events

2. Test webhook endpoint:
```bash
curl http://localhost:3000/api/webhooks/billing
```
Should return: `{"message":"Stripe webhook endpoint is active",...}`

3. Check webhook secret:
```bash
# .env file should have:
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Check 3: Verify Subscription Records
```sql
SELECT 
  s.id,
  s.userId,
  u.name,
  s.planName,
  s.status,
  s.stripeSubscriptionId,
  COUNT(p.id) as payment_count
FROM subscriptions s
LEFT JOIN user u ON s.userId = u.id
LEFT JOIN payments p ON p.subscriptionId = s.id
GROUP BY s.id;
```

---

## 🔧 Backfill Missing Payments

If you have subscriptions but no payment records, run the backfill script:

```bash
npx tsx backfill-missing-payments.ts
```

This script:
1. Finds all subscriptions in the database
2. Fetches related payment intents from Stripe
3. Creates missing payment records
4. Shows summary of created records

**What it does:**
- ✓ Syncs payment data from Stripe
- ✓ Matches payment intents to subscriptions
- ✓ Creates complete payment records
- ✓ Skips existing payments (safe to run multiple times)

**Output:**
```
=== Backfilling Missing Payments ===

Found 5 subscriptions in database

[1/5] Processing subscription ID 1
  User: John Doe (user-id-123)
  Plan: Professional Plan (premium)
  Stripe Subscription: sub_xxxxxx
  → Fetching payment intents from Stripe...
  Found 2 related payment intent(s)
    ✓ Created payment record for pi_xxxxx (GBP 29.99)
    ✓ Created payment record for pi_yyyyy (GBP 29.99)

============================================================
BACKFILL SUMMARY
============================================================
Total Subscriptions Processed: 5
✓ Payment Records Created: 8
↩ Subscriptions Skipped (already had payments): 2
❌ Errors: 0
============================================================
```

---

## 📊 Verification Steps

### Step 1: Check Database Directly
```sql
-- Count total payments
SELECT COUNT(*) FROM payments;

-- Count payments by plan
SELECT 
  subscriptionPlan,
  COUNT(*) as count,
  SUM(amount) as total_amount,
  currency
FROM payments
WHERE paymentStatus = 'succeeded'
GROUP BY subscriptionPlan, currency;

-- Recent owner payments
SELECT 
  p.id,
  u.name as user_name,
  u.email,
  p.subscriptionPlan,
  p.amount,
  p.currency,
  p.paymentStatus,
  p.createdAt
FROM payments p
LEFT JOIN user u ON p.userId = u.id
WHERE p.userRole = 'owner'
ORDER BY p.createdAt DESC
LIMIT 10;
```

### Step 2: Check Admin Dashboard
1. Login as admin: `/admin/login`
2. Navigate to: `/admin/payments`
3. Verify:
   - ✓ All payments are visible
   - ✓ Plan names are showing
   - ✓ User details are correct
   - ✓ Amounts match Stripe

### Step 3: Check Owner Payment History
1. Login as owner: `/owner/login`
2. Navigate to: `/owner/payments`
3. Verify:
   - ✓ Owner sees their own payments
   - ✓ Plan details are correct
   - ✓ Invoice URLs work

---

## 🐛 Common Issues & Solutions

### Issue 1: No Payments Showing in Admin Dashboard
**Symptoms**: Admin dashboard shows 0 payments

**Solutions**:
1. Run check script: `npx tsx check-payments-data.ts`
2. Check if subscriptions exist: `SELECT * FROM subscriptions`
3. Run backfill: `npx tsx backfill-missing-payments.ts`
4. Verify webhook is receiving events (check logs)

### Issue 2: Payments Missing Subscription Plan
**Symptoms**: Payment records exist but `subscriptionPlan` is NULL

**Cause**: Payment intent created without metadata

**Solution**:
```sql
-- Update payments from subscription data
UPDATE payments p
SET subscriptionPlan = (
  SELECT s.planName 
  FROM subscriptions s 
  WHERE s.id = p.subscriptionId
)
WHERE p.subscriptionId IS NOT NULL 
AND p.subscriptionPlan IS NULL;
```

### Issue 3: Old Subscriptions Don't Have Payments
**Symptoms**: Recent subscriptions have payments, old ones don't

**Cause**: Webhook wasn't configured or events weren't processed

**Solution**: Run backfill script
```bash
npx tsx backfill-missing-payments.ts
```

### Issue 4: Webhook Not Processing
**Symptoms**: Payments created in Stripe but not in database

**Check**:
1. Webhook endpoint is accessible
2. Webhook secret is correct
3. Events are being sent by Stripe

**Fix**:
```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/billing

# Check webhook logs in terminal where app is running
# Should see: [DD/MM/YYYY HH:mm:ss] Webhook received at /api/webhooks/billing
```

---

## 📋 Maintenance Tasks

### Regular Checks
Run monthly to ensure data integrity:
```bash
# Check for missing payments
npx tsx check-payments-data.ts

# Backfill if needed
npx tsx backfill-missing-payments.ts
```

### Monitoring
Check these regularly:
- Webhook event processing (server logs)
- Payment success rate (admin dashboard)
- Failed payments (admin dashboard filtered by status)

---

## 🎯 Key Files Reference

### Payment Processing
- `src/lib/stripe-billing.ts` - Core payment logic
- `src/app/api/webhooks/billing/route.ts` - Webhook handler
- `src/app/api/subscriptions/checkout-session/route.ts` - Checkout creation

### Admin Display
- `src/app/admin/payments/page.tsx` - Admin payments UI
- `src/app/api/admin/payments/history/route.ts` - Admin payments API

### Owner Display
- `src/app/owner/payments/page.tsx` - Owner payments UI
- `src/app/api/owner/payment-history/route.ts` - Owner payments API

### Database
- `src/db/schema.ts` - payments table schema

### Utilities
- `check-payments-data.ts` - Payment verification script
- `backfill-missing-payments.ts` - Backfill script

---

## ✅ Success Criteria

Your payment tracking is working correctly when:

1. ✓ Every subscription has at least one payment record
2. ✓ Payment records include subscription plan information
3. ✓ Admin dashboard shows all payments
4. ✓ Owner dashboard shows only their payments
5. ✓ Payment amounts match Stripe
6. ✓ Webhook events are being processed
7. ✓ New subscriptions automatically create payments

---

## 🚀 Next Steps

After fixing payment tracking:
1. ✓ Run verification scripts
2. ✓ Check admin dashboard
3. ✓ Test new subscription flow
4. ✓ Monitor webhook processing
5. ✓ Document any custom changes

---

## 📞 Support

If issues persist:
1. Check server logs for webhook errors
2. Verify Stripe dashboard for webhook delivery
3. Run diagnostic scripts
4. Review database schema
5. Check environment variables

