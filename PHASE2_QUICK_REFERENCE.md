# Phase 2 Validation - Quick Reference

## Overview

All Phase 2 deliverables validated and operational:
- ✅ Subscription system fully functional
- ✅ Membership status handling correct
- ✅ Access restrictions enforced
- ✅ CRM sync operational with no delays

---

## Quick Test Commands

### Run Full Test Suite

```bash
npx tsx test-phase2-validation.ts
```

**Tests:**
1. Subscription status → role sync
2. Membership data retrieval
3. CRM property sync verification
4. CRM profile existence check

---

## Manual Verification

### 1. Check Subscription Status

```typescript
// Get user's current subscription
const membership = await getMembershipData(userId);

console.log(membership.status);  // 'active', 'cancelled', 'expired', etc
console.log(membership.role);    // 'owner', 'guest', 'admin'
console.log(membership.tier);    // 'free', 'basic', 'premium', 'enterprise'
```

### 2. Verify Access Control

```bash
# Try accessing owner dashboard with expired subscription
curl -X GET http://localhost:3000/owner/dashboard \
  -b "cookies.txt" \
  --verbose

# Expected: 302 redirect or 401 Unauthorized if subscription expired
```

### 3. Check CRM Sync

```sql
-- Verify CRM profile exists
SELECT * FROM crmOwnerProfiles WHERE userId = 'user-123';

-- Check property links
SELECT * FROM crmPropertyLinks WHERE ownerId = 'user-123';

-- Review activity log
SELECT * FROM crmActivityLog WHERE userId = 'user-123' ORDER BY createdAt DESC LIMIT 10;
```

### 4. Test Webhook Processing

```bash
# Check webhook endpoint health
curl http://localhost:3000/api/webhooks/billing

# Expected: { "message": "Stripe webhook endpoint is active", "timestamp": "..." }
```

---

## Status Mappings

### Subscription Status → User Role

| Subscription Status | User Role | Access Level |
|---------------------|-----------|--------------|
| `active` | `owner` | Full access ✅ |
| `trial` | `owner` | Full access ✅ |
| `past_due` | `owner` | Full access (grace period) ✅ |
| `free` | `guest` | Limited access ⚠️ |
| `cancelled` | `guest` | No owner access ❌ |
| `expired` | `guest` | No owner access ❌ |
| `suspended` | `guest` | No owner access ❌ |

### Tier Features

| Feature | Free | Basic | Premium | Enterprise |
|---------|------|-------|---------|------------|
| Properties | 1 | 5 | 25 | ∞ |
| Photos | 10 | 20 | 50 | ∞ |
| Analytics | ❌ | ✅ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ❌ | ✅ |

---

## Key Functions

### CRM Sync Functions

```typescript
// Get membership data
const membership = await getMembershipData(userId);

// Sync membership status
const result = await syncMembershipStatus(userId);

// Update after payment
await updateMembershipAfterPayment(userId, paymentSuccess);

// Downgrade after cancellation
await downgradeAfterCancellation(userId);

// Sync properties to CRM
await syncPropertiesToCRM(ownerId);

// Check feature access
const hasAnalytics = await canAccessFeature(userId, 'analytics');

// Check property limit
const { canAdd, reason } = await canAddProperty(userId);
```

### Stripe Functions

```typescript
// Get user subscription
const subscription = await getUserSubscription(userId);

// Get invoices
const invoices = await getUserInvoices(userId);

// Cancel subscription
await cancelSubscription(subscriptionId);

// Reactivate subscription
await reactivateSubscription(subscriptionId);
```

---

## API Endpoints

### Subscription Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/subscriptions/checkout-session` | Create checkout |
| GET | `/api/subscriptions/current` | Get subscription |
| POST | `/api/subscriptions/cancel` | Cancel subscription |
| POST | `/api/subscriptions/reactivate` | Reactivate |
| GET | `/api/subscriptions/plans` | Get available plans |

### CRM Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/crm/sync` | Manual sync single user |
| POST | `/api/crm/sync/all` | Bulk sync all users (admin) |

### Webhook Endpoint

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/webhooks/billing` | Stripe webhook handler |
| GET | `/api/webhooks/billing` | Health check |

---

## Troubleshooting

### Issue: Role not updating after payment

**Solution:**
```typescript
// Manually trigger sync
await syncMembershipStatus(userId);

// Check webhook logs
// Verify webhook secret in .env matches Stripe dashboard
```

### Issue: User can access owner features with expired subscription

**Solution:**
```typescript
// 1. Check user role in database
SELECT role FROM user WHERE id = 'user-123';

// 2. Check subscription status
SELECT status FROM subscriptions WHERE userId = 'user-123';

// 3. Manually downgrade if needed
await downgradeAfterCancellation(userId);
```

### Issue: Properties not showing in CRM

**Solution:**
```typescript
// Resync properties
await syncPropertiesToCRM(ownerId);

// Verify sync completed
SELECT * FROM crmPropertyLinks WHERE ownerId = 'user-123';
```

### Issue: Webhook not processing

**Solution:**
```bash
# 1. Check webhook secret
echo $STRIPE_WEBHOOK_SECRET

# 2. Test webhook endpoint
curl http://localhost:3000/api/webhooks/billing

# 3. Use Stripe CLI to forward webhooks
stripe listen --forward-to http://localhost:3000/api/webhooks/billing

# 4. Check Stripe dashboard webhook logs
# https://dashboard.stripe.com/webhooks
```

---

## Database Queries

### Check user subscription status

```sql
SELECT 
  u.email,
  u.role,
  s.status as subscription_status,
  s.planName,
  s.currentPeriodEnd
FROM user u
LEFT JOIN subscriptions s ON u.id = s.userId
WHERE u.email = 'user@example.com';
```

### Verify CRM sync

```sql
SELECT 
  u.email,
  u.role,
  c.subscriptionTier,
  c.subscriptionStatus,
  c.accountStatus,
  c.lastPaymentDate
FROM user u
LEFT JOIN crmOwnerProfiles c ON u.id = c.userId
WHERE u.role = 'owner';
```

### Check property counts

```sql
SELECT 
  u.email,
  COUNT(p.id) as property_count,
  COUNT(c.id) as crm_link_count
FROM user u
LEFT JOIN properties p ON u.id = p.ownerId
LEFT JOIN crmPropertyLinks c ON u.id = c.ownerId
WHERE u.role = 'owner'
GROUP BY u.id, u.email;
```

### Recent CRM activity

```sql
SELECT 
  activityType,
  description,
  outcome,
  createdAt
FROM crmActivityLog
WHERE userId = 'user-123'
ORDER BY createdAt DESC
LIMIT 20;
```

---

## Validation Checklist

- [ ] Run test suite: `npx tsx test-phase2-validation.ts`
- [ ] All 4 tests pass
- [ ] Check webhook health endpoint responds
- [ ] Verify active subscriptions grant owner access
- [ ] Verify cancelled subscriptions revoke access
- [ ] Check CRM profiles exist for all owners
- [ ] Verify property counts match between DB and CRM
- [ ] Review CRM activity logs for recent sync events
- [ ] Test Stripe webhook with test event
- [ ] Confirm no sync delays in recent logs

---

## Files Reference

**Core Files:**
- `src/lib/stripe-billing.ts` - Stripe integration (750+ lines)
- `src/lib/crm-sync.ts` - CRM synchronization (940+ lines)
- `src/lib/auth-roles.ts` - Access control
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/app/api/webhooks/billing/route.ts` - Webhook handler

**Documentation:**
- `PHASE2_VALIDATION_COMPLETE.md` - Full validation report
- `PHASE2_QUICK_REFERENCE.md` - This file
- `test-phase2-validation.ts` - Test suite

**Previous Milestones:**
- `MILESTONE_3_COMPLETE.md` - Stripe billing system
- `MILESTONE_5_COMPLETE.md` - CRM sync implementation
- `SUBSCRIPTION_SYSTEM_COMPLETE.md` - Full subscription docs

---

**Last Updated:** December 24, 2025  
**Status:** ✅ All systems operational
