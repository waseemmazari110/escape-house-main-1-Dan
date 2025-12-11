# Milestone 4: Annual Subscription Workflow - Quick Reference

## 🚀 Quick Start

### 1. Setup Stripe Products

```bash
# Create products in Stripe Dashboard or via CLI
stripe products create --name="Basic Plan" --description="Up to 5 properties"
stripe prices create --product=prod_xxx --unit-amount=1999 --currency=gbp --recurring[interval]=month
stripe prices create --product=prod_xxx --unit-amount=19999 --currency=gbp --recurring[interval]=year
```

### 2. Add Environment Variables

```env
STRIPE_PRICE_BASIC_MONTHLY=price_xxx
STRIPE_PRICE_BASIC_YEARLY=price_xxx
STRIPE_PRICE_PREMIUM_MONTHLY=price_xxx
STRIPE_PRICE_PREMIUM_YEARLY=price_xxx
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxx
STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxx
```

---

## 💰 Pricing Overview

| Plan | Monthly | Yearly | Savings | Features |
|------|---------|--------|---------|----------|
| Basic | £19.99 | £199.99 | £39.89 | 5 properties, 20 photos |
| Premium | £49.99 | £499.99 | £99.89 | 25 properties, featured listings |
| Enterprise | £99.99 | £999.99 | £199.89 | Unlimited everything |

**All annual plans save 16.6%!**

---

## 📝 Common Usage

### Get Available Plans

```typescript
import { SUBSCRIPTION_PLANS, getPlanById } from '@/lib/subscription-plans';

// Get specific plan
const plan = getPlanById('premium_yearly');
console.log(`${plan.name}: £${plan.price}/year`);

// Get all plans
const allPlans = Object.values(SUBSCRIPTION_PLANS);

// Filter by tier
import { getPlansByTier } from '@/lib/subscription-plans';
const premiumPlans = getPlansByTier('premium');
```

### Create Subscription

```typescript
import { createSubscription, getOrCreateCustomer } from '@/lib/stripe-billing';

const customerId = await getOrCreateCustomer(userId, email, name);

const result = await createSubscription({
  userId,
  customerId,
  priceId: 'price_xxx',
  planName: 'Premium Yearly',
  planType: 'yearly',
  trialDays: 14,
});

console.log('Client Secret:', result.clientSecret);
```

### Check Subscription Status

```typescript
import { getCurrentBillingCycle } from '@/lib/billing-cycle';
import { getRetryPolicy } from '@/lib/payment-retry';

const billingCycle = await getCurrentBillingCycle(subscriptionId);
console.log(`Days until renewal: ${billingCycle.daysUntilRenewal}`);
console.log(`Next billing: ${billingCycle.nextBillingDate}`);

const retryPolicy = await getRetryPolicy(subscriptionId);
if (retryPolicy) {
  console.log(`Retry ${retryPolicy.currentAttempt}/${retryPolicy.maxAttempts}`);
}
```

### Handle Payment Failure

```typescript
import { initializeRetryPolicy, processRetryAttempt } from '@/lib/payment-retry';

// Initialize retry policy when payment fails
await initializeRetryPolicy(subscriptionId, userId, 'Card declined');

// Process retry (called by cron job)
const result = await processRetryAttempt(subscriptionId, 1);
```

---

## 🔄 Payment Retry Timeline

| Day | Event | Status |
|-----|-------|--------|
| 0 | Payment fails | `past_due` |
| 3 | Retry attempt 1 | `past_due` |
| 8 | Retry attempt 2 | `past_due` |
| 15 | Retry attempt 3 | `past_due` |
| 22 | Retry attempt 4 (final) | `past_due` |
| 25 | Account suspended | `suspended` |
| 32 | Permanent closure | `cancelled` |

---

## 🔌 API Endpoints

### Create Subscription
```bash
POST /api/subscriptions/create
Body: { "planId": "premium_yearly", "trialDays": 14 }
```

### Get Current Subscription
```bash
GET /api/subscriptions/current
```

### Cancel Subscription
```bash
POST /api/subscriptions/cancel
Body: { "immediate": false }
```

### Reactivate Subscription
```bash
POST /api/subscriptions/reactivate
```

### Get Available Plans
```bash
GET /api/subscriptions/plans
GET /api/subscriptions/plans?tier=premium
GET /api/subscriptions/plans?interval=yearly
```

---

## 🧪 Testing

### Run Test Suite
```bash
npx tsx src/lib/test-milestone4.ts
```

### Test with Stripe CLI
```bash
# Forward webhooks
stripe listen --forward-to http://localhost:3000/api/webhooks/billing

# Test events
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed
```

---

## ⏰ Cron Jobs

### Daily Tasks (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/cron/process-renewals",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/send-renewal-reminders",
      "schedule": "0 10 * * *"
    },
    {
      "path": "/api/cron/process-retries",
      "schedule": "0 14 * * *"
    }
  ]
}
```

---

## 📊 Key Functions

| Function | Purpose |
|----------|---------|
| `getPlanById()` | Get plan details |
| `calculateAnnualSavings()` | Calculate yearly savings |
| `createSubscription()` | Start new subscription |
| `cancelSubscription()` | Cancel subscription |
| `getCurrentBillingCycle()` | Get billing info |
| `initializeRetryPolicy()` | Start retry process |
| `processRetryAttempt()` | Process payment retry |
| `suspendAccount()` | Suspend after failures |
| `reactivateSuspendedAccount()` | Restore access |

---

## ✅ What's Included

- ✅ 6 subscription plans (3 tiers × 2 intervals)
- ✅ 16.6% annual discount
- ✅ 4-attempt retry policy
- ✅ 25-day suspension timeline
- ✅ Billing cycle management
- ✅ 5 API endpoints
- ✅ Prorated billing
- ✅ UK timestamps throughout
- ✅ Comprehensive tests
- ✅ Full documentation

---

## 📚 Full Documentation

See `MILESTONE_4_COMPLETE.md` for:
- Complete API reference
- Detailed examples
- Configuration guide
- Monitoring & analytics
- Production checklist

---

**Milestone 4: COMPLETE** ✅
**Generated:** 12/12/2025 (UK Time)
