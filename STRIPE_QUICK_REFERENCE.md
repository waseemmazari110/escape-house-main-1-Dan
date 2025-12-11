# Stripe Billing Quick Reference

## 🚀 Quick Setup

### 1. Add Environment Variables
```bash
# Copy template
cp stripe-env-template.txt .env

# Edit .env and add your Stripe keys from:
# https://dashboard.stripe.com/test/apikeys
```

### 2. Create Products in Stripe
```bash
# Login to Stripe CLI
stripe login

# Create product
stripe products create --name="Premium Plan" --description="Full access"

# Create monthly price (£29.99)
stripe prices create \
  --product=prod_xxx \
  --unit-amount=2999 \
  --currency=gbp \
  --recurring[interval]=month

# Create yearly price (£299.99)
stripe prices create \
  --product=prod_xxx \
  --unit-amount=29999 \
  --currency=gbp \
  --recurring[interval]=year
```

### 3. Test Webhook Locally
```bash
# Forward webhooks to your local server
stripe listen --forward-to http://localhost:3000/api/webhooks/billing

# Copy the webhook secret to .env
# STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## 📝 Common Usage

### Create Customer & Subscription
```typescript
import { createCustomer, createSubscription } from '@/lib/stripe-billing';

// 1. Create customer
const customer = await createCustomer({
  userId: user.id,
  email: user.email,
  name: user.name,
});

// 2. Create subscription
const result = await createSubscription({
  userId: user.id,
  customerId: customer.id,
  priceId: 'price_xxx', // From Stripe Dashboard
  planName: 'Premium Plan',
  planType: 'monthly',
  trialDays: 14,
});

// 3. Use client secret for payment
return result.clientSecret;
```

### Cancel Subscription
```typescript
import { getUserSubscription, cancelSubscription } from '@/lib/stripe-billing';

// Get subscription
const sub = await getUserSubscription(userId);

// Cancel at period end
await cancelSubscription(sub.stripeSubscriptionId, true);

// Or cancel immediately
await cancelSubscription(sub.stripeSubscriptionId, false);
```

### Get Billing History
```typescript
import { getUserInvoices } from '@/lib/stripe-billing';

const invoices = await getUserInvoices(userId);
// Returns: invoiceNumber, status, total, invoicePdf, etc.
```

---

## 🧪 Testing

### Test Cards
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0027 6000 3184

Use any future date and any 3-digit CVC.

### Trigger Webhooks
```bash
stripe trigger customer.subscription.created
stripe trigger invoice.paid
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.deleted
```

### Run Test Suite
```bash
npx tsx src/lib/test-billing.ts
```

---

## 🔗 Useful Links

- **Stripe Dashboard:** https://dashboard.stripe.com/test/dashboard
- **API Keys:** https://dashboard.stripe.com/test/apikeys
- **Webhooks:** https://dashboard.stripe.com/test/webhooks
- **Products:** https://dashboard.stripe.com/test/products
- **Customers:** https://dashboard.stripe.com/test/customers
- **Subscriptions:** https://dashboard.stripe.com/test/subscriptions
- **Logs:** https://dashboard.stripe.com/test/logs

---

## 📚 Full Documentation

See `MILESTONE_3_COMPLETE.md` for comprehensive documentation including:
- All function signatures
- Complete webhook event list
- Error handling
- Production deployment checklist
- Troubleshooting guide

---

## ⚡ API Endpoints

### Webhook Endpoint
- **URL:** `/api/webhooks/billing`
- **Method:** POST
- **Purpose:** Receive Stripe webhook events
- **Security:** HMAC SHA256 signature verification

### Health Check
```bash
curl http://localhost:3000/api/webhooks/billing
```

---

## 🎯 Key Functions

| Function | Purpose |
|----------|---------|
| `createCustomer()` | Create Stripe customer |
| `createSubscription()` | Start new subscription |
| `cancelSubscription()` | Cancel subscription |
| `reactivateSubscription()` | Undo cancellation |
| `getUserSubscription()` | Get user's subscription |
| `getUserInvoices()` | Get billing history |
| `handleWebhook()` | Process webhook events |

---

## ✅ What's Included

- ✅ Customer management (create, update, get)
- ✅ Subscription lifecycle (create, update, cancel, reactivate)
- ✅ Invoice generation with UK format (INV-2025-0001)
- ✅ Webhook handling (15+ event types)
- ✅ Signature verification (security)
- ✅ UK timestamp logging (DD/MM/YYYY HH:mm:ss)
- ✅ Database synchronization
- ✅ Test suite
- ✅ Error handling

---

**Milestone 3: COMPLETE** ✅
