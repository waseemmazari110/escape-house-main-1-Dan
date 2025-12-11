# Milestone 5: Quick Reference Guide

**Invoices + Receipts + CRM Sync**

---

## 🎯 Key Files

```
src/lib/invoice-receipt.ts   → Invoice & receipt generation
src/lib/crm-sync.ts           → Membership synchronization
src/app/api/invoices/[id]/    → Invoice API
src/app/api/receipts/[id]/    → Receipt API
src/app/api/crm/sync/         → CRM sync API
src/lib/test-milestone5.ts    → Test suite
```

---

## 📋 Quick Commands

### Run Tests
```bash
npx tsx src/lib/test-milestone5.ts
```

### Check Membership Status
```typescript
import { getMembershipData } from '@/lib/crm-sync';
const membership = await getMembershipData('user-123');
```

### Sync User
```typescript
import { syncMembershipStatus } from '@/lib/crm-sync';
const result = await syncMembershipStatus('user-123');
```

### Generate Invoice
```typescript
import { generateInvoiceData, generateInvoiceHTML } from '@/lib/invoice-receipt';
const data = await generateInvoiceData('invoice-123');
const html = generateInvoiceHTML(data);
```

### Generate Receipt
```typescript
import { generateReceiptData, generateReceiptHTML } from '@/lib/invoice-receipt';
const data = await generateReceiptData('invoice-123');
const html = generateReceiptHTML(data);
```

---

## 🔄 Membership Status Flow

```
free → trial → active → past_due → suspended → cancelled
                ↓
              expired
```

**Role Mapping:**
- `free`, `suspended`, `cancelled`, `expired` → **guest**
- `trial`, `active`, `past_due` → **owner**
- Admin role → **admin** (manual assignment)

---

## 🎨 Receipt Format

**Required Format:** "Paid on DD/MM/YYYY at HH:mm:ss"

Example: "Paid on 14/02/2025 at 16:22:11"

```typescript
// In receipt HTML
<p>Paid on ${datePart} at ${timePart}</p>
```

---

## 📊 Subscription Tiers

| Tier | Properties | Photos | Analytics | Support | API | Domain |
|------|-----------|---------|-----------|---------|-----|--------|
| Free | 1 | 10 | ❌ | ❌ | ❌ | ❌ |
| Basic | 5 | 20 | ✅ | ❌ | ❌ | ❌ |
| Premium | 25 | 50 | ✅ | ✅ | ❌ | ❌ |
| Enterprise | ∞ | ∞ | ✅ | ✅ | ✅ | ✅ |

---

## 🔌 API Endpoints

### Get Invoice
```
GET /api/invoices/[id]?format=json|html
```

### Get Receipt
```
GET /api/receipts/[id]
```

### Get Membership
```
GET /api/crm/sync?userId=user-123
```

### Get Summary
```
GET /api/crm/sync?summary=true
```

### Sync User
```
POST /api/crm/sync
Body: { "userId": "user-123" }
```

### Sync All (Admin)
```
POST /api/crm/sync
Body: { "action": "sync_all" }
```

---

## 🪝 Webhook Events

### Invoice Paid
```typescript
invoice.payment_succeeded
→ Update invoice (status: paid, paid_at)
→ Call updateMembershipAfterPayment()
→ Upgrade user to 'owner'
```

### Subscription Deleted
```typescript
customer.subscription.deleted
→ Update subscription (status: canceled)
→ Call downgradeAfterCancellation()
→ Downgrade user to 'guest'
```

---

## 🧪 Test Checklist

✅ UK date format (DD/MM/YYYY)  
✅ Receipt timestamp ("Paid on DD/MM/YYYY at HH:mm:ss")  
✅ Invoice HTML generation  
✅ Receipt HTML generation  
✅ Membership status types (7 total)  
✅ Role mapping (guest/owner/admin)  
✅ Feature access control  
✅ Property limit enforcement  
✅ CRM sync after payment  
✅ Role downgrade after cancellation  

---

## 🔐 Authorization Rules

- **Invoice/Receipt:** Owner OR Admin
- **CRM GET:** Any user (own data)
- **CRM POST (single):** Any user
- **CRM POST (bulk):** Admin only

---

## 📱 Feature Access Control

```typescript
// Check feature access
const hasAnalytics = await canAccessFeature(userId, 'analytics');
const hasSupport = await canAccessFeature(userId, 'priority_support');
const hasAPI = await canAccessFeature(userId, 'api_access');

// Check property limit
const { canAdd, reason } = await canAddProperty(userId);
if (!canAdd) {
  return { error: reason };
}
```

---

## 🚨 Common Issues

### Issue: Receipt missing "Paid on" timestamp
**Fix:** Ensure `paid_at` is set when invoice is paid

### Issue: Role not updating after payment
**Fix:** Check webhook logs, verify CRM sync is called

### Issue: Property limit not working
**Fix:** Call `canAddProperty()` before allowing creation

### Issue: Feature access denied
**Fix:** Sync membership with `syncMembershipStatus()`

---

## 📊 CRM Sync Functions

```typescript
// Get membership data
getMembershipData(userId) → MembershipData

// Sync status and role
syncMembershipStatus(userId) → SyncResult

// Get aggregate summary
getMembershipSummary() → MembershipSummary

// Update after payment (webhook)
updateMembershipAfterPayment(userId, subId) → SyncResult

// Downgrade after cancel (webhook)
downgradeAfterCancellation(userId, subId) → SyncResult

// Check feature access
canAccessFeature(userId, feature) → boolean

// Check property limit
canAddProperty(userId) → { canAdd, reason? }

// Bulk sync (admin)
syncAllMemberships() → BulkSyncResult
```

---

## 📅 UK Date Formats

**Date:** DD/MM/YYYY  
**DateTime:** DD/MM/YYYY HH:mm:ss  
**Timezone:** Europe/London  
**Currency:** GBP (£)

```typescript
import { nowUKFormatted, formatDateTimeUK } from '@/lib/date-utils';

const now = nowUKFormatted(); // "14/02/2025 16:22:11"
const formatted = formatDateTimeUK(new Date()); // "14/02/2025 16:22:11"
```

---

## 💡 Quick Tips

1. **Always use UK date formatting** in all user-facing content
2. **Receipts must show** "Paid on DD/MM/YYYY at HH:mm:ss"
3. **CRM sync happens automatically** via webhooks
4. **Role changes are logged** for audit trail
5. **Feature checks before rendering** premium features
6. **Property limits checked** before allowing creation
7. **Bulk sync is admin-only** to prevent abuse

---

## 🔗 Related Docs

- [Milestone 5 Complete Guide](MILESTONE_5_COMPLETE.md)
- [Milestone 4: Annual Subscriptions](MILESTONE_4_COMPLETE.md)
- [Milestone 3: Billing System](MILESTONE_3_COMPLETE.md)
- [Milestone 2: Database Schema](MILESTONE_2_COMPLETE.md)

---

**Status:** Production Ready ✅  
**Last Updated:** 14/02/2025 16:22:11
