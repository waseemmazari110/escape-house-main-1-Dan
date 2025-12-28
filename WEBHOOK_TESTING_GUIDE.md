# LOCAL WEBHOOK TESTING GUIDE

## Option 1: Use Stripe CLI (Recommended for Local Testing)

### Step 1: Install Stripe CLI
Download from: https://stripe.com/docs/stripe-cli

### Step 2: Authenticate
```bash
stripe login
```
Follow the browser prompt to authorize

### Step 3: Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3001/api/webhooks/billing
```

You'll see output like:
```
> Ready! Your webhook signing secret is: whsec_test_xxx
```

**IMPORTANT**: Copy this secret and update your `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_test_xxx
```

### Step 4: Test Webhook
In another terminal, trigger a test event:
```bash
stripe trigger charge.succeeded
```

You should see in your server logs:
```
[timestamp] Stripe Billing: Webhook received: charge.succeeded
```

---

## Option 2: Manual Payment Testing

### What Happens Automatically:
1. You make a payment via checkout session
2. Stripe processes it immediately
3. Stripe sends webhook event to your endpoint
4. Payment is saved to database
5. Show up in both dashboards

### Test Card Numbers:
- **Visa**: `4242 4242 4242 4242` - Always succeeds
- **Visa (decline)**: `4000 0000 0000 0002` - Always fails
- **Mastercard**: `5555 5555 5555 4444` - Always succeeds

### Expiry & CVC:
- Expiry: Any future date (12/25, 01/26, etc.)
- CVC: Any 3 digits (123, 456, etc.)

---

## Option 3: Manual Database Verification

### Check if Payment Was Saved:
```bash
npx tsx -e "
import { config } from 'dotenv';
config();
import { db } from '@/db';
import { payments } from '@/db/schema';

const recent = await db.select().from(payments).limit(1);
console.log('Latest payment:', recent[0]);
process.exit(0);
"
```

### View All Payments:
```bash
npx tsx -e "
import { config } from 'dotenv';
config();
import { db } from '@/db';
import { payments } from '@/db/schema';

const all = await db.select().from(payments);
console.log('Total payments:', all.length);
all.forEach(p => console.log(p.id, p.amount, p.paymentStatus));
process.exit(0);
"
```

---

## Debugging Webhook Issues

### Check Server Logs for:
```
[timestamp] Stripe Billing: Webhook received: {event_type}
[timestamp] Stripe Billing: Webhook processed successfully: {event_type}
```

### If You See "Webhook rejected: Invalid signature":
1. Check webhook secret in `.env`
2. Make sure it matches Stripe CLI output
3. Restart dev server after updating `.env`

### If You See "Payment record skipped - no userId":
1. Payment intent metadata missing userId
2. Check checkout session is including metadata
3. File: `src/app/api/subscriptions/checkout-session/route.ts`
4. Look for: `metadata: { userId, ... }`

---

## Common Webhook Events

When you make a payment, you'll see these events:

```
1. payment_intent.created
   └─ Payment intent created but not confirmed yet

2. charge.succeeded
   └─ Charge processed successfully

3. payment_intent.succeeded
   └─ Payment completed, saved to database

4. invoice.paid (if subscription)
   └─ Invoice marked as paid

5. customer.subscription.created (if subscription)
   └─ Subscription activated
```

All these trigger webhook handlers that save/update payment data.

---

## Verify Payment in Admin Dashboard

After payment and webhook:

1. Go to `http://localhost:3001/admin/dashboard`
2. Click **Transactions** tab
3. You should see:
   - Amount (£1 or £2)
   - Status: "succeeded"
   - Customer email
   - Payment method (Visa/Mastercard)
   - Exact timestamp

If not visible:
1. Click "Refresh" button
2. Check browser console for errors
3. Check server logs for database errors
4. Try manual sync: `http://localhost:3001/owner/payments` → "Sync from Stripe"

---

## Test Payment Checklist

- [ ] Dev server running on localhost:3001
- [ ] Stripe CLI forwarding to webhook endpoint
- [ ] Make test payment with 4242 card
- [ ] Payment succeeds in Stripe dashboard
- [ ] See webhook events in Stripe CLI output
- [ ] See webhook logs in dev server terminal
- [ ] Payment appears in admin dashboard
- [ ] Payment appears in owner payment history
- [ ] Payment status shows "succeeded"
- [ ] Amount and method details correct

---

## Webhook Endpoint Details

- **URL**: `http://localhost:3001/api/webhooks/billing`
- **Method**: POST
- **Authentication**: Stripe signature verification
- **Response**: `{ received: true, eventType: "...", timestamp: "..." }`
- **Handler**: `src/lib/stripe-billing.ts` handleWebhook()

---

## Still Having Issues?

### Enable Debug Logging:
Add to `src/lib/stripe-billing.ts`:
```typescript
// Uncomment for verbose logging
console.log('[WEBHOOK]', event.type, event.data);
```

### Check Database Permissions:
```bash
npx tsx check-table-exists.ts
```
Should show: "✅ payments table EXISTS"

### Test Stripe API Connection:
```bash
npx tsx -e "
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_TEST_KEY!);
const account = await stripe.account.retrieve();
console.log('✅ Stripe API connected:', account.display_name);
process.exit(0);
"
```

---

Generated: December 28, 2025
Ready for: Local Testing & Development
