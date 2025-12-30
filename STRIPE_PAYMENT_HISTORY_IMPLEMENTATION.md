# Stripe Payment History System - Complete Implementation

## 📋 Overview

This implementation provides a **production-ready Stripe payment history system** that:

- ✅ Stores all payment transactions in the database
- ✅ Displays comprehensive payment history in the UI
- ✅ Syncs automatically via webhooks
- ✅ Includes manual fallback sync mechanism
- ✅ Handles all payment states (success, failed, refunded)
- ✅ Works in Test/Sandbox mode and Live mode
- ✅ Prevents duplicate entries (idempotency)

---

## 🗄️ Database Schema

### New Table: `payments`

```sql
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES user(id),
  
  -- Stripe References
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  stripe_invoice_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Payment Details
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  payment_status TEXT NOT NULL,
  payment_method TEXT,
  payment_method_brand TEXT,
  payment_method_last4 TEXT,
  
  -- Transaction Details
  description TEXT,
  billing_reason TEXT,
  receipt_url TEXT,
  receipt_email TEXT,
  
  -- Refund Information
  refund_amount REAL DEFAULT 0,
  refunded_at TEXT,
  refund_reason TEXT,
  
  -- Relations
  invoice_id INTEGER REFERENCES invoices(id),
  subscription_id INTEGER REFERENCES subscriptions(id),
  booking_id INTEGER REFERENCES bookings(id),
  
  -- Metadata
  failure_code TEXT,
  failure_message TEXT,
  network_status TEXT,
  risk_level TEXT,
  risk_score INTEGER,
  metadata TEXT,
  stripe_event_id TEXT,
  
  -- Timestamps
  processed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**Indexes:**
- `user_id` - Fast lookup by user
- `stripe_payment_intent_id` - Unique payment intents
- `stripe_invoice_id` - Link to invoices
- `payment_status` - Filter by status
- `created_at DESC` - Recent payments first
- `stripe_event_id` - Idempotency checks

---

## 🔗 Data Flow

```
┌─────────────────┐
│  Stripe Event   │ (Payment, Invoice, Refund)
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Webhook Endpoint       │ /api/webhooks/billing
│  • Verify signature     │
│  • Extract event data   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  stripe-billing.ts      │
│  • handleWebhook()      │
│  • Route to handlers    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Payment Tracking Functions     │
│  • createOrUpdatePayment()      │
│  • recordRefund()               │
│  • Check idempotency            │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Database           │
│  • payments table   │
│  • invoices table   │
└─────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  API Endpoint           │ /api/payments/history
│  • Fetch user payments  │
│  • Combine with invoices│
└────────┬────────────────┘
         │
         ▼
┌─────────────────────┐
│  Frontend UI        │
│  • Display history  │
│  • Show details     │
│  • Manual sync btn  │
└─────────────────────┘
```

---

## 🎯 Webhook Events Handled

### Payment Events
- ✅ `payment_intent.created` - Track payment creation
- ✅ `payment_intent.succeeded` - Record successful payment
- ✅ `payment_intent.payment_failed` - Track failures

### Invoice Events
- ✅ `invoice.paid` / `invoice.payment_succeeded` - Create payment from invoice
- ✅ `invoice.payment_failed` - Record failed invoice payment
- ✅ `invoice.finalized` - Update invoice records

### Charge Events
- ✅ `charge.succeeded` - Update payment with charge details
- ✅ `charge.refunded` - Record refund information

### Subscription Events
- ✅ `checkout.session.completed` - Create initial payment
- ✅ `customer.subscription.updated` - Track renewals
- ✅ `customer.subscription.deleted` - Handle cancellations

---

## 🔒 Idempotency Strategy

### Preventing Duplicates

1. **Unique Constraint**: `stripe_payment_intent_id` is unique in database
2. **Event ID Tracking**: Store `stripe_event_id` to detect retries
3. **Upsert Logic**: Check existence before insert, update if exists

```typescript
// Check if payment exists
const existingPayment = await db
  .select()
  .from(payments)
  .where(eq(payments.stripePaymentIntentId, paymentIntent.id))
  .limit(1);

if (existingPayment.length > 0) {
  // UPDATE existing
} else {
  // INSERT new
}
```

---

## 📡 API Endpoints

### 1. Get Payment History
**Endpoint**: `GET /api/payments/history`

**Authentication**: Required (owner/admin)

**Response**:
```json
{
  "success": true,
  "payments": [
    {
      "id": "123",
      "type": "payment",
      "amount": 1999,
      "currency": "GBP",
      "status": "succeeded",
      "description": "Subscription - Premium Plan",
      "createdAt": "27/12/2025 14:30:00",
      "invoiceUrl": "https://pay.stripe.com/receipts/...",
      "paymentMethod": "card",
      "paymentMethodBrand": "visa",
      "paymentMethodLast4": "4242",
      "billingReason": "subscription_cycle",
      "refundAmount": 0
    }
  ],
  "count": 15,
  "timestamp": "27/12/2025 14:35:00"
}
```

### 2. Manual Sync from Stripe
**Endpoint**: `POST /api/payments/sync`

**Authentication**: Required (owner/admin)

**Purpose**: Fallback mechanism to fetch missing payments from Stripe

**Response**:
```json
{
  "success": true,
  "synced": 12,
  "errors": [],
  "timestamp": "27/12/2025 14:40:00"
}
```

---

## 🎨 Frontend Features

### Payment History UI (`/owner/payments`)

**Features:**
1. **Sync Button** - Manual sync from Stripe
2. **Payment Cards** showing:
   - Amount and currency
   - Status badge (succeeded, failed, refunded)
   - Payment method (Visa •••• 4242)
   - Date and time
   - Billing reason
   - Refund information (if applicable)
   - Failure messages (if failed)
   - Receipt/invoice link

3. **Status Icons**:
   - ✅ Green check - Succeeded
   - ⏳ Yellow clock - Pending
   - ❌ Red X - Failed
   - 📄 Gray receipt - Draft

4. **Empty State** - Prompts to subscribe

---

## 🛡️ Error Handling

### Webhook Failures
```typescript
try {
  await handleWebhook(event);
} catch (error) {
  logBillingAction('Webhook processing failed', {
    error: error.message,
    eventId: event.id
  });
  // Return 200 to prevent Stripe retries
  // Log error for manual investigation
}
```

### API Failures
- Return proper HTTP status codes
- Include error messages
- Log all errors with UK timestamps
- Frontend shows user-friendly messages

### Edge Cases Handled
1. **Missing userId in metadata** - Skip gracefully
2. **Duplicate webhook events** - Idempotency check
3. **Partial refunds** - Track total refund amount
4. **Failed payments** - Store failure codes/messages
5. **Subscription renewals** - Automatic tracking
6. **Test vs Live mode** - Separated by Stripe keys

---

## 🚀 Deployment Checklist

### Prerequisites
- [x] Database migration applied
- [x] STRIPE_WEBHOOK_SECRET configured
- [x] STRIPE_TEST_KEY or STRIPE_SECRET_KEY set

### Testing Steps

#### 1. Test Webhook Endpoint
```bash
curl http://localhost:3000/api/webhooks/billing
# Should return: "Stripe webhook endpoint is active"
```

#### 2. Test Payment History API
```bash
curl http://localhost:3000/api/payments/history \
  -H "Cookie: better-auth.session_token=..."
# Should return payment list
```

#### 3. Test Stripe Webhooks
Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/billing
stripe trigger payment_intent.succeeded
```

#### 4. Test Manual Sync
```bash
curl -X POST http://localhost:3000/api/payments/sync \
  -H "Cookie: better-auth.session_token=..."
# Should sync payments from Stripe
```

### Verification

✅ **Payment appears in UI** after Stripe success
✅ **Renewal payments** appear automatically
✅ **Refunds** update history correctly
✅ **No duplicate** payment records
✅ **Works in Test mode** (sandbox)

---

## 📊 Monitoring & Logs

All actions logged with UK timestamps:
```
[27/12/2025 14:30:15] Stripe Billing: Webhook received: payment_intent.succeeded
[27/12/2025 14:30:15] Stripe Billing: Creating payment record
[27/12/2025 14:30:16] Stripe Billing: Payment record created { paymentId: 123 }
```

### Key Metrics to Monitor
- Total payments processed
- Failed payment rate
- Webhook delivery success
- Sync operations performed
- Database query performance

---

## 🔧 Troubleshooting

### Payments not appearing in UI

**Check:**
1. Database has `payments` table with indexes
2. Webhooks are being received (check logs)
3. Webhook signature is valid (STRIPE_WEBHOOK_SECRET)
4. userId exists in payment metadata
5. API endpoint returns data

**Solution:**
```typescript
// Run manual sync
POST /api/payments/sync
```

### Duplicate payments

**Check:**
1. `stripe_payment_intent_id` unique constraint exists
2. Idempotency check in `createOrUpdatePayment()`

**Solution:**
Already handled - updates existing instead of creating duplicate

### Webhook signature failures

**Check:**
1. STRIPE_WEBHOOK_SECRET matches Stripe dashboard
2. Using raw body (not parsed JSON)
3. Signature header present

---

## 🎓 Usage Examples

### For Developers

**Add userId to payment metadata:**
```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1999,
  currency: 'gbp',
  metadata: {
    userId: session.user.id,
    billingReason: 'subscription_create'
  }
});
```

**Manually sync a specific payment:**
```typescript
import { syncPaymentFromStripe } from '@/lib/stripe-billing';

await syncPaymentFromStripe('pi_xxxxx', userId);
```

**Get user's payment history:**
```typescript
import { getUserPayments } from '@/lib/stripe-billing';

const payments = await getUserPayments(userId, 50);
```

---

## 🏆 Production Ready Confirmation

✅ **Database schema** - Complete with indexes
✅ **Webhook handlers** - All events covered
✅ **API endpoints** - Secure and tested
✅ **Frontend UI** - Rich payment display
✅ **Idempotency** - No duplicates
✅ **Error handling** - Graceful failures
✅ **Logging** - UK timestamps throughout
✅ **Fallback sync** - Manual recovery
✅ **Refund tracking** - Partial & full
✅ **Test mode support** - Sandbox ready
✅ **Documentation** - Complete guide

---

## 📞 Support

For issues or questions:
- Check logs: `[timestamp] Stripe Billing: ...`
- Review Stripe dashboard webhooks section
- Use manual sync button in UI
- Contact: support@escapehouse.com

---

**Last Updated**: 27/12/2025
**Version**: 1.0.0
**Status**: Production Ready ✅
