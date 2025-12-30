# Stripe Transactions Not Showing - Issue Analysis & Solution

## Problem Summary
Transactions made through Stripe are not appearing in the admin dashboard.

## Root Cause Analysis

### 1. Payment Tracking System (Already Implemented ✅)
The payment tracking system is **fully implemented** in the codebase:
- **File**: `src/lib/stripe-billing.ts`
- **Function**: `createOrUpdatePayment()` (line 1105)
- **Webhook Handler**: `handleWebhook()` handles Stripe events

### 2. Why Payments Aren't Showing

The `createOrUpdatePayment` function has this critical logic:

```typescript
// Get user ID from metadata if not provided
const paymentUserId = userId || paymentIntent.metadata?.userId;

if (!paymentUserId) {
  logBillingAction('Payment record skipped - no userId', {
    paymentIntentId: paymentIntent.id,
  });
  return null;  // ⚠️ Payment is NOT saved to database
}
```

**This means payments are only saved if:**
1. The webhook event includes `userId` in `paymentIntent.metadata`, OR
2. The webhook handler extracts userId from somewhere else

### 3. Current Webhook Events Tracked
The system listens for these Stripe events:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `charge.succeeded`
- `invoice.paid`

---

## Solutions

### Solution 1: Configure Stripe Webhook (Recommended for Production)

#### Step 1: Set Up Webhook in Stripe Dashboard
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/webhooks/billing
   ```
   For local testing:
   ```
   http://localhost:3000/api/webhooks/billing
   ```

4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.succeeded`
   - `invoice.paid`

5. Copy the **Signing secret** (starts with `whsec_`)

#### Step 2: Update Environment Variables
Add to your `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
```

#### Step 3: Ensure userId in Payment Metadata
When creating payments in your app, ensure you include `userId` in metadata:

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1999, // £19.99
  currency: 'gbp',
  customer: stripeCustomerId,
  metadata: {
    userId: user.id,  // ⚠️ CRITICAL: This must be included
    userName: user.name,
    userEmail: user.email,
  },
});
```

### Solution 2: Use Stripe CLI for Local Testing

```powershell
# Install Stripe CLI
# Download from: https://github.com/stripe/stripe-cli/releases

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/billing

# In another terminal, trigger test events
stripe trigger payment_intent.succeeded --add payment_intent:metadata[userId]=clm1234567890
```

### Solution 3: Insert Test Transactions Manually (Quick Testing)

#### Option A: Use the SQL Script
```powershell
# First, find a user ID
npx drizzle-kit studio

# Then edit insert-test-transactions.sql with actual user ID
# Run the SQL in Drizzle Studio
```

#### Option B: Use the API to Create Test Payment
Create a file `create-test-payment.ts`:

```typescript
import { stripe } from './src/lib/stripe-billing';
import { db } from './src/db';
import { user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function createTestPayment() {
  // Get an owner user
  const users = await db.select().from(user).where(eq(user.role, 'owner')).limit(1);
  const testUser = users[0];

  if (!testUser) {
    console.error('No users found');
    return;
  }

  // Create a test payment intent with userId in metadata
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1999, // £19.99
    currency: 'gbp',
    description: 'Premium Monthly Subscription - Test',
    metadata: {
      userId: testUser.id,  // ✅ This ensures it gets saved
      userName: testUser.name || '',
      userEmail: testUser.email || '',
    },
  });

  console.log('✅ Created payment intent:', paymentIntent.id);
  console.log('   Status:', paymentIntent.status);
  
  // Simulate successful payment (confirm it)
  const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id, {
    payment_method: 'pm_card_visa',
    return_url: 'http://localhost:3000',
  });

  console.log('✅ Confirmed payment:', confirmed.status);
}

createTestPayment();
```

Run it:
```powershell
npx tsx create-test-payment.ts
```

---

## Verification Checklist

After implementing any solution, verify:

### 1. Check Database
```sql
SELECT 
  id,
  userId,
  amount,
  currency,
  paymentStatus,
  stripePaymentIntentId,
  description,
  createdAt
FROM payments
ORDER BY createdAt DESC
LIMIT 10;
```

### 2. Check Admin Dashboard
1. Navigate to http://localhost:3000/admin/dashboard
2. Click "Transactions" tab
3. Should see payments listed with:
   - User name and email
   - Amount
   - Status (Succeeded/Pending/Failed)
   - Payment method (Visa/Mastercard)
   - Date

### 3. Check Server Logs
Look for these log messages when a payment is processed:
```
[DD/MM/YYYY HH:mm:ss] Stripe Billing: Creating/updating payment record
[DD/MM/YYYY HH:mm:ss] Stripe Billing: Payment record created/updated
```

Or if userId is missing:
```
[DD/MM/YYYY HH:mm:ss] Stripe Billing: Payment record skipped - no userId
```

---

## For Existing Stripe Payments (Already Made)

If you've already made payments through Stripe and they don't have userId in metadata, you have two options:

### Option 1: Manual Database Update
If you know which payments belong to which users:

```sql
-- Update existing payment with userId
UPDATE payments 
SET userId = 'actual_user_id_here',
    updatedAt = datetime('now')
WHERE stripePaymentIntentId = 'pi_actual_payment_intent_id';
```

### Option 2: Sync from Stripe
Create a sync script to pull payments from Stripe and match them to users by email:

```typescript
import { stripe } from './src/lib/stripe-billing';
import { db } from './src/db';
import { payments, user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function syncStripePayments() {
  // Get all payment intents from Stripe
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
  });

  for (const pi of paymentIntents.data) {
    // Get customer details
    if (pi.customer) {
      const customer = await stripe.customers.retrieve(pi.customer as string);
      
      if ('email' in customer && customer.email) {
        // Find user by email
        const users = await db.select().from(user).where(eq(user.email, customer.email)).limit(1);
        
        if (users[0]) {
          // Insert payment with userId
          await createOrUpdatePayment(pi, 'manual_sync', users[0].id);
          console.log(`✅ Synced payment ${pi.id} for user ${customer.email}`);
        }
      }
    }
  }
}
```

---

## Testing the Fix

### Quick Test (5 minutes)
1. **Start the dev server**:
   ```powershell
   npm run dev
   ```

2. **Run the SQL insert script** to create test data:
   - Open Drizzle Studio: `npx drizzle-kit studio`
   - Copy SQL from `insert-test-transactions.sql`
   - Run it in the SQL console

3. **View in admin dashboard**:
   - Navigate to http://localhost:3000/admin/dashboard
   - Click "Transactions"
   - Should see 3 test transactions

### Full Test (30 minutes)
1. **Set up Stripe webhook** (Solution 1)
2. **Create test payment** with userId in metadata
3. **Verify in dashboard** that it appears

---

## Summary

**The payment tracking system is already built and working.**  
The issue is that payments need to have `userId` in the `paymentIntent.metadata` when they're created.

**Quick Fix**: Use the SQL script to insert test transactions  
**Proper Fix**: Ensure all payment creations include userId in metadata + configure webhook

---

## Related Files
- Webhook Handler: `src/app/api/webhooks/billing/route.ts`
- Payment Service: `src/lib/stripe-billing.ts`
- Admin API: `src/app/api/admin/transactions/route.ts`
- Admin UI: `src/components/admin/Transactions.tsx`
- Test SQL: `insert-test-transactions.sql`

---

## Need Help?
If payments still aren't showing after implementing these solutions:
1. Check server logs for error messages
2. Verify webhook secret is correct
3. Ensure payments are being created with userId in metadata
4. Check Stripe Dashboard → Developers → Webhooks → Recent events
