# Owner Authentication and Transaction History Fixes

## Issues Fixed

### 1. Invalid Credentials for Owner After Deployment ✅

**Problem:** Owner login was failing after deployment with "invalid credentials" error.

**Root Cause:** The `.env` file had incorrect URL format - missing `https://` protocol for deployed URLs.

**Fix Applied:**
- Updated `BETTER_AUTH_URL` from `http://escape-house-main-1-dan.vercel.app` to `https://escape-house-main-1-dan.vercel.app`
- Updated `NEXT_PUBLIC_APP_URL` from `http://escape-house-main-1-dan.vercel.app` to `https://escape-house-main-1-dan.vercel.app`

**File Changed:** `.env`

```env
# BEFORE (INCORRECT)
NEXT_PUBLIC_APP_URL=http://escape-house-main-1-dan.vercel.app
BETTER_AUTH_URL=http://escape-house-main-1-dan.vercel.app

# AFTER (CORRECT)
NEXT_PUBLIC_APP_URL=https://escape-house-main-1-dan.vercel.app
BETTER_AUTH_URL=https://escape-house-main-1-dan.vercel.app
```

### 2. Transaction History Not Being Saved ✅

**Problem:** Payment transactions were not appearing in owner dashboard payment history.

**Root Cause:** Cache was not being invalidated after payment records were created/updated, causing stale data to be displayed.

**Fixes Applied:**

#### A. Added Cache Revalidation to Payment Creation
- Modified `createOrUpdatePayment()` in `src/lib/stripe-billing.ts`
- Now calls `revalidatePayment(userId)` after creating new payment records
- Ensures payment history is immediately visible

#### B. Added Cache Revalidation to Payment Updates
- Modified `createOrUpdatePayment()` in `src/lib/stripe-billing.ts`
- Now calls `revalidatePayment(userId)` after updating existing payment records
- Ensures payment status changes are immediately visible

#### C. Added Cache Revalidation to Subscription Updates
- Modified `handleSubscriptionUpdated()` in `src/lib/stripe-billing.ts`
- Now calls `revalidateSubscription(userId)` after subscription updates
- Ensures subscription-related payment history is fresh

**Files Changed:**
- `src/lib/stripe-billing.ts` (3 locations)

## Testing Instructions

### Test Owner Login After Deployment

1. **Clear browser cache and cookies**
   ```
   - Chrome: Ctrl+Shift+Delete
   - Clear all time
   - Check "Cookies" and "Cached images"
   ```

2. **Navigate to owner login**
   ```
   https://escape-house-main-1-dan.vercel.app/owner/login
   ```

3. **Login with owner credentials**
   - Email: [owner email]
   - Password: [owner password]

4. **Expected Result:**
   - ✅ Login succeeds without "invalid credentials" error
   - ✅ Redirected to `/owner/dashboard`
   - ✅ Session persists across page refreshes

### Test Transaction History

#### Method 1: Create New Subscription Payment

1. **Login as owner**
2. **Navigate to subscription page**
   ```
   /owner/subscription
   ```

3. **Subscribe to a plan**
   - Choose any plan (Basic/Premium/Enterprise)
   - Complete Stripe checkout
   - Use test card: `4242 4242 4242 4242`

4. **Check payment history**
   ```
   /owner/dashboard?view=payments
   ```

5. **Expected Result:**
   - ✅ New payment appears immediately (within 5 seconds)
   - ✅ Shows correct amount, status, and plan name
   - ✅ Receipt URL is accessible

#### Method 2: Verify Existing Payments

1. **Login as owner**
2. **Navigate to dashboard payments view**
   ```
   /owner/dashboard?view=payments
   ```

3. **Expected Result:**
   - ✅ All historical payments are displayed
   - ✅ Sorted by date (newest first)
   - ✅ Shows: amount, date, status, payment method, plan name

#### Method 3: Test Webhook Processing

1. **Make a test payment via Stripe Dashboard**
   - Go to Stripe Dashboard > Payments
   - Create a test payment
   - Use metadata: `userId: [owner-user-id]`, `role: owner`

2. **Check Stripe webhook logs**
   ```
   https://dashboard.stripe.com/test/webhooks
   ```

3. **Verify payment appears in dashboard**
   - Should appear within 5 seconds of webhook
   - Check `/owner/dashboard?view=payments`

4. **Expected Result:**
   - ✅ Webhook returns 200 OK
   - ✅ Payment record created in database
   - ✅ Payment visible in owner dashboard
   - ✅ Cache revalidated automatically

## Verification Commands

### Check Payment Records in Database

```bash
# Connect to Turso database
turso db shell db-8330e9be-5e47-4f2b-bda0-4162d899b6d9-orchids

# Query all payments for owner
SELECT 
  id, 
  userId, 
  amount, 
  currency, 
  paymentStatus, 
  subscriptionPlan,
  createdAt 
FROM payments 
WHERE userId = '[owner-user-id]'
ORDER BY createdAt DESC 
LIMIT 10;
```

### Check Webhook Logs in Production

```bash
# View webhook processing logs
vercel logs --follow

# Filter for webhook events
vercel logs --follow | grep "Webhook"

# Filter for payment events
vercel logs --follow | grep "Payment"
```

### Monitor Cache Revalidation

```bash
# Check cache revalidation logs
vercel logs --follow | grep "Cache revalidation"
vercel logs --follow | grep "revalidatePayment"
```

## How Payment History Works

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Payment Flow                              │
└─────────────────────────────────────────────────────────────┘

1. Owner completes Stripe checkout
   ↓
2. Stripe sends webhook to /api/webhooks/billing
   ↓
3. Webhook handler processes event
   ↓
4. createOrUpdatePayment() called with payment intent
   ↓
5. Payment record inserted into 'payments' table
   ↓
6. revalidatePayment(userId) called
   ↓
7. Cache tags invalidated:
   - payments
   - transactions
   - owner-payments-{userId}
   - owner-dashboard-{userId}
   ↓
8. Next fetch returns fresh data
   ↓
9. Owner sees payment in dashboard immediately
```

### Webhook Events That Create Payment Records

| Event | Description | Creates Payment Record |
|-------|-------------|----------------------|
| `checkout.session.completed` | Initial subscription payment | ✅ Yes |
| `invoice.payment_succeeded` | Recurring subscription payment | ✅ Yes |
| `payment_intent.succeeded` | One-time payment | ✅ Yes |
| `charge.succeeded` | Updates payment with charge details | Updates existing |
| `charge.refunded` | Refund processed | Updates existing |

### Cache Tags Used

| Tag | Purpose | Invalidated When |
|-----|---------|-----------------|
| `payments` | All payments globally | Any payment created/updated |
| `transactions` | All transactions (admin) | Any payment created/updated |
| `owner-payments-{userId}` | Owner's payments | Owner's payment created/updated |
| `owner-dashboard-{userId}` | Owner dashboard data | Owner's payment/subscription changed |

## Important Notes

### Environment Variables

**CRITICAL:** After deployment, ensure these are set in Vercel:

```env
BETTER_AUTH_URL=https://escape-house-main-1-dan.vercel.app
NEXT_PUBLIC_APP_URL=https://escape-house-main-1-dan.vercel.app
```

**DO NOT USE `http://` for production URLs - must be `https://`**

### Stripe Webhook Configuration

Ensure Stripe webhook endpoint is configured:

**Webhook URL:**
```
https://escape-house-main-1-dan.vercel.app/api/webhooks/billing
```

**Events to subscribe to:**
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.succeeded`
- `charge.refunded`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### Database Indexes

For optimal performance, ensure these indexes exist:

```sql
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

## Troubleshooting

### Issue: Payments Still Not Showing

**Check 1:** Verify webhook is configured correctly in Stripe
```bash
# Check webhook endpoint in Stripe Dashboard
https://dashboard.stripe.com/test/webhooks
```

**Check 2:** Verify payment has correct userId metadata
```sql
SELECT metadata FROM payments WHERE id = [payment_id];
```

**Check 3:** Clear all caches manually
```bash
# Run clear-cache script
.\clear-cache.ps1
```

**Check 4:** Check if payment record exists in database
```sql
SELECT * FROM payments WHERE userId = '[owner-user-id]' ORDER BY createdAt DESC LIMIT 5;
```

### Issue: Login Still Failing

**Check 1:** Verify environment variables in Vercel
```bash
vercel env pull .env.production
cat .env.production | grep BETTER_AUTH
```

**Check 2:** Ensure HTTPS is used (not HTTP)
```bash
# Should be https:// NOT http://
echo $BETTER_AUTH_URL
echo $NEXT_PUBLIC_APP_URL
```

**Check 3:** Check auth.ts baseURL configuration
```typescript
// Should use environment variable
baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000"
```

**Check 4:** Verify trusted origins include production URL
```typescript
trustedOrigins: [
  "http://localhost:3000",
  "https://escape-house-main-1-dan.vercel.app", // Must be present
  "https://groupescapehouses.co.uk",
]
```

## Deployment Checklist

Before deploying to production:

- [ ] Update `.env` with HTTPS URLs
- [ ] Set environment variables in Vercel dashboard
- [ ] Configure Stripe webhook endpoint
- [ ] Test webhook signature verification
- [ ] Verify cache tags are working
- [ ] Test owner login with production credentials
- [ ] Make a test payment and verify it appears
- [ ] Check admin dashboard shows all transactions
- [ ] Verify email notifications are sent
- [ ] Test refund flow updates payment records

## Success Criteria

✅ **Owner Login**
- Owner can login successfully with correct credentials
- Session persists across page refreshes
- No CORS errors in browser console
- Auth cookies are set correctly

✅ **Payment History**
- New payments appear within 5 seconds
- Historical payments are all visible
- Payment details are accurate (amount, date, status)
- Receipt URLs work correctly
- Refunds are tracked properly

✅ **Webhook Processing**
- All webhook events return 200 OK
- Payment records created for all events
- Cache invalidated after each payment
- Logs show successful processing

## Support

If issues persist after applying these fixes:

1. **Check Vercel deployment logs**
   ```bash
   vercel logs --follow
   ```

2. **Check Stripe webhook logs**
   ```
   https://dashboard.stripe.com/test/webhooks
   ```

3. **Verify database records**
   ```bash
   turso db shell [database-name]
   ```

4. **Contact developer** with:
   - Error messages from browser console
   - Webhook event IDs from Stripe
   - Payment intent IDs
   - User ID experiencing issues

---

**Applied:** January 1, 2026  
**Files Modified:** 2 (`.env`, `src/lib/stripe-billing.ts`)  
**Status:** ✅ Complete - Ready for testing
