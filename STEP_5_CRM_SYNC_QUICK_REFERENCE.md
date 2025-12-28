# STEP 5 – CRM SYNC Quick Reference

## Automatic CRM Sync Triggers

| Event | File | Function Called | CRM Status | Creates Note |
|-------|------|----------------|------------|--------------|
| **Payment Success** | `webhooks/booking-payments/route.ts` | `syncSubscriptionStatusToCRM()` | active | No |
| **Payment Failure** | `webhooks/booking-payments/route.ts` | `syncSubscriptionStatusToCRM()` | suspended | Yes (high priority) |
| **Subscription Cancelled** | `subscriptions/cancel/route.ts` | `fullOwnerSyncToCRM()` | inactive | Yes (high priority) |

---

## Core Functions (src/lib/crm-sync.ts)

### syncSubscriptionStatusToCRM(userId, eventType, metadata)
```typescript
// Syncs payment/subscription events
await syncSubscriptionStatusToCRM(
  userId,
  'payment_success', // or 'payment_failure', 'subscription_cancelled', 'subscription_renewed'
  { paymentIntentId, amount, currency }
);
```

### syncPropertiesToCRM(ownerId)
```typescript
// Syncs all owner properties to CRM
await syncPropertiesToCRM(ownerId);
```

### fullOwnerSyncToCRM(userId, eventType, metadata)
```typescript
// Complete sync: status + properties + activity log
await fullOwnerSyncToCRM(
  userId,
  'subscription_cancelled',
  { subscriptionId, immediate, cancelledAt }
);
```

---

## CRM Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `crmOwnerProfiles` | Owner membership status | userId, status, lastContactDate |
| `crmPropertyLinks` | Property ownership | ownerId, propertyId, linkStatus |
| `crmActivityLog` | Activity tracking | ownerId, activityType, metadata |
| `crmNotes` | Notes & reminders | ownerId, priority, content |

---

## Quick Test

### Check if CRM sync working:
```sql
-- View recent CRM activities
SELECT * FROM crmActivityLog 
ORDER BY activityDate DESC LIMIT 10;

-- Check owner's CRM profile
SELECT * FROM crmOwnerProfiles WHERE userId = '[user_id]';

-- View high-priority notes
SELECT * FROM crmNotes WHERE priority = 'high' 
ORDER BY createdAt DESC LIMIT 10;
```

### Trigger manual sync:
```typescript
import { fullOwnerSyncToCRM } from '@/lib/crm-sync';
await fullOwnerSyncToCRM(userId, 'payment_success', {});
```

---

## Status Flow

```
Payment Success → CRM Status: active
Payment Failure → CRM Status: suspended + High Priority Note
Subscription Cancelled → CRM Status: inactive + High Priority Note
Subscription Renewed → CRM Status: active
```

---

## Error Handling
✅ All CRM sync is **non-blocking**  
✅ Webhooks/APIs succeed even if CRM sync fails  
✅ All errors logged to console  

---

## Files Modified
- **src/lib/crm-sync.ts** - Added 3 new functions (~250 lines)
- **src/app/api/webhooks/booking-payments/route.ts** - Integrated payment sync (~80 lines)
- **src/app/api/subscriptions/cancel/route.ts** - Integrated cancellation sync (~25 lines)

---

**Full Documentation**: See `STEP_5_CRM_SYNC_COMPLETE.md`
