# Publishing Control, Payment Validation & Role-Based Access - Complete ✅

**Date:** January 10, 2026  
**Status:** Production Ready  

---

## 🎯 Overview

This document outlines the **strict publishing control**, **Stripe webhook payment validation**, and **role-based access control** implemented in the system.

---

## 🔒 1. Publishing Control (Admin Only)

### Requirements ✅
- ✅ Admin approval required to push listings live
- ✅ Admin can remove or unpublish listings
- ✅ **NO auto-publish** under any circumstances
- ✅ All listings default to `pending` status

### Implementation

#### Database Schema
```typescript
// src/db/schema.ts
export const properties = sqliteTable('properties', {
  status: text('status').notNull().default('pending'), // NEVER auto-approved
  isPublished: integer('is_published').default(false),
  approvedBy: text('approved_by'),
  approvedAt: text('approved_at'),
  rejectionReason: text('rejection_reason'),
  // ...
});
```

#### Admin Approval Flow
```
Property Submitted
      ↓
status: 'pending' (ALWAYS)
      ↓
Admin Reviews
      ↓
┌─────────┴──────────┐
↓                    ↓
APPROVE          REJECT
↓                    ↓
status: 'approved'   status: 'rejected'
isPublished: true    isPublished: false
```

#### Admin Unpublish Flow
```
Approved Property
      ↓
Admin clicks "Unpublish"
      ↓
status: 'rejected'
isPublished: false
      ↓
Removed from public website
```

### API Endpoints

**Approve Property:**
```typescript
POST /api/admin/properties/[id]/approve
Authorization: Admin only
```

**Reject Property:**
```typescript
POST /api/admin/properties/[id]/reject
Authorization: Admin only
Body: { reason: "Rejection reason" }
```

**Unpublish Property:** (NEW ✅)
```typescript
POST /api/admin/properties/[id]/unpublish
Authorization: Admin only
Effect: Sets status='rejected', isPublished=false
```

### No Auto-Publish Guarantee

**Code Verification:**
```typescript
// src/app/api/owner/properties/route.ts - Line 147
const newProperty = await db.insert(properties).values({
  // ...
  status: 'pending', // ✅ HARDCODED - Cannot be overridden
  isPublished: false, // ✅ HARDCODED - Cannot be overridden
  // ...
});
```

**Result:** There is **no code path** that auto-publishes. All listings require explicit admin approval.

---

## 💳 2. Payment Validation (Stripe Webhooks)

### Requirements ✅
- ✅ Use Stripe webhooks to confirm payments
- ✅ Successful payments → membership active
- ✅ Failed/cancelled payments → block listing approval
- ✅ Prevent listing submission if membership inactive

### Webhook Event Handlers

#### Payment Succeeded
```typescript
// src/lib/stripe-billing.ts - handlePaymentSucceeded()
payment_intent.succeeded → Creates payment record → Status: 'succeeded'
```

#### Payment Failed
```typescript
// src/lib/stripe-billing.ts - handlePaymentFailed()
payment_intent.payment_failed → Creates payment record → Status: 'failed'
→ Blocks future listing submissions
```

#### Subscription Cancelled
```typescript
// src/lib/stripe-billing.ts - handleSubscriptionDeleted()
customer.subscription.deleted → Updates subscription → Status: 'cancelled'
→ Downgrades user role
→ Blocks listing submissions
```

#### Invoice Payment Failed
```typescript
// src/lib/stripe-billing.ts - handleInvoicePaymentFailed()
invoice.payment_failed → Subscription → Status: 'past_due'
→ Blocks listing submissions
```

### Payment Verification Logic

**File:** `src/lib/payment-verification.ts`

**Enhanced Function:** `verifyUserPayment(userId)`

**Checks Performed:**
1. ✅ Subscription exists
2. ✅ Subscription status is `active` or `trialing` (NOT cancelled, past_due, expired, suspended)
3. ✅ Latest payment has `status: 'succeeded'`
4. ✅ No recent failed payments

**Blocked Statuses:**
```typescript
const blockedStatuses = [
  'cancelled',
  'past_due',
  'expired',
  'suspended',
  'incomplete',
  'incomplete_expired'
];
```

### Listing Submission Protection

**File:** `src/app/api/owner/properties/route.ts`

```typescript
// Line 108 - PAYMENT VERIFICATION ENFORCED
const paymentCheck = await canCreateProperty(session.user.id);
if (!paymentCheck.allowed) {
  return NextResponse.json(
    { 
      error: 'Payment required', 
      message: paymentCheck.reason,
      requiresPayment: true 
    },
    { status: 402 } // 402 Payment Required
  );
}
```

**Result:** Cannot submit listings without:
- Active subscription (`status: 'active'` or `'trialing'`)
- Confirmed payment (`paymentStatus: 'succeeded'`)
- No recent failed payments

### Webhook Flow Example

```
Owner Subscribes
      ↓
Stripe Processes Payment
      ↓
Webhook: payment_intent.succeeded
      ↓
createOrUpdatePayment() → paymentStatus: 'succeeded'
      ↓
Owner Can Now Submit Listings ✅

---

Owner Payment Fails
      ↓
Stripe Payment Fails
      ↓
Webhook: payment_intent.payment_failed
      ↓
createOrUpdatePayment() → paymentStatus: 'failed'
      ↓
verifyUserPayment() → Returns: hasActivePlan: false ❌
      ↓
Listing Submission Blocked ❌
```

---

## 👥 3. Role-Based Access Control

### Requirements ✅
- ✅ **Admin:** Full access to memberships, payments, and approvals
- ✅ **Owner:** Can manage their listings only
- ✅ **Public:** Read-only access to approved listings

### Role Definitions

**File:** `src/lib/auth-roles.ts`

```typescript
export type UserRole = 'admin' | 'owner' | 'guest';

// Role checking functions
export function isAdmin(user: UserWithRole | null): boolean;
export function isOwner(user: UserWithRole | null): boolean;
export function isGuest(user: UserWithRole | null): boolean;
```

### Access Matrix

| Feature | Admin | Owner | Guest/Public |
|---------|-------|-------|--------------|
| **Memberships Dashboard** | ✅ Full Access | ❌ No Access | ❌ No Access |
| **Payment History (All)** | ✅ Full Access | ❌ No Access | ❌ No Access |
| **Payment History (Own)** | ✅ Yes | ✅ Yes | ❌ No Access |
| **Approve/Reject Listings** | ✅ Yes | ❌ No | ❌ No |
| **Unpublish Listings** | ✅ Yes | ❌ No | ❌ No |
| **Create Listings** | ✅ Yes (bypass payment) | ✅ Yes (requires payment) | ❌ No |
| **Edit Own Listings** | ✅ Yes | ✅ Yes | ❌ No |
| **Edit Other's Listings** | ✅ Yes | ❌ No | ❌ No |
| **View All Listings** | ✅ Yes (all statuses) | ⚠️ Own only | ❌ Approved only |
| **View Pending Listings** | ✅ Yes | ⚠️ Own only | ❌ No |
| **View Approved Listings** | ✅ Yes | ✅ Yes | ✅ Yes |
| **User Management** | ✅ Full CRUD | ❌ No Access | ❌ No Access |

### Admin-Only Features

#### 1. Membership Tracking
```
/admin/dashboard → Memberships Tab
- View all member sign-ups
- See payment status
- Export membership data
- Search and filter
```

#### 2. Property Approvals
```
/admin/dashboard → Approvals Tab
- Review pending listings
- Approve listings
- Reject with reason
- Unpublish approved listings
```

#### 3. Payment Transactions
```
/admin/dashboard → Transactions Tab
- View all payment transactions
- Filter by status
- View owner details
```

#### 4. User Management
```
/admin/dashboard → Users Tab
- View all users
- Change roles
- Delete users
- View activity
```

### Owner Restrictions

**What Owners CAN Do:**
- ✅ Create listings (with active paid subscription)
- ✅ Edit their own listings
- ✅ View their own listings (all statuses)
- ✅ View their payment history
- ✅ Manage subscription

**What Owners CANNOT Do:**
- ❌ Approve their own listings
- ❌ Publish listings without admin approval
- ❌ View other owners' listings
- ❌ Access admin dashboard
- ❌ View membership data
- ❌ Unpublish listings
- ❌ Change user roles

### Public/Guest Restrictions

**What Public CAN Do:**
- ✅ View approved listings only
- ✅ Browse properties
- ✅ View property details (approved only)

**What Public CANNOT Do:**
- ❌ View pending listings
- ❌ View rejected listings
- ❌ Create listings
- ❌ Access owner dashboard
- ❌ Access admin dashboard
- ❌ View payment information

### API Role Enforcement

**Pattern Used Throughout:**
```typescript
// 1. Get current user with role
const currentUser = await getCurrentUserWithRole();

// 2. Check authentication
if (!currentUser) {
  return unauthenticatedResponse('Please log in');
}

// 3. Check authorization
if (!isAdmin(currentUser)) {
  return unauthorizedResponse('Admin access required');
}

// 4. Proceed with action
```

**Examples:**

**Admin Membership API:**
```typescript
// src/app/api/admin/memberships/route.ts
if (!isAdmin(currentUser)) {
  return unauthorizedResponse('Forbidden: Admin access required');
}
```

**Owner Properties API:**
```typescript
// src/app/api/owner/properties/route.ts
const userRole = (session.user as any).role;
if (userRole !== 'owner' && userRole !== 'admin') {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 });
}

// Payment check for owners (admins bypass)
if (!isAdmin(currentUser)) {
  const paymentCheck = await canCreateProperty(session.user.id);
  if (!paymentCheck.allowed) {
    return paymentRequiredResponse(...);
  }
}
```

**Public Properties API:**
```typescript
// src/app/api/orchards/properties/route.ts
// Public can only see approved + published
.where(
  and(
    eq(properties.isPublished, true),
    eq(properties.status, 'approved')
  )
)
```

---

## 🔐 Security Features

### 1. Authentication Layer
- Session-based authentication (better-auth)
- Secure cookie storage
- Session expiry
- CSRF protection

### 2. Authorization Layer
- Role-based access control (RBAC)
- Resource ownership validation
- Admin privilege checks
- Route protection

### 3. Payment Security
- Stripe webhook signature verification
- Idempotent payment processing
- Failed payment blocking
- Subscription status validation

### 4. Data Protection
- User can only see own data (except admins)
- Public can only see approved listings
- Private fields hidden from public APIs
- Audit logging for admin actions

---

## 📊 Key Files Reference

### Publishing Control
- `src/app/api/admin/properties/[id]/approve/route.ts` - Approve endpoint
- `src/app/api/admin/properties/[id]/reject/route.ts` - Reject endpoint
- `src/app/api/admin/properties/[id]/unpublish/route.ts` - Unpublish endpoint (NEW ✅)
- `src/components/admin/PropertyApprovals.tsx` - Admin UI with unpublish button

### Payment Validation
- `src/lib/stripe-billing.ts` - Webhook handlers
- `src/lib/payment-verification.ts` - Payment validation logic (ENHANCED ✅)
- `src/app/api/webhooks/billing/route.ts` - Webhook entry point
- `src/app/api/owner/properties/route.ts` - Enforces payment before listing

### Role-Based Access
- `src/lib/auth-roles.ts` - Role checking utilities
- `src/app/api/admin/*` - Admin-only endpoints
- `src/app/api/owner/*` - Owner endpoints (with payment check)
- `src/app/api/properties/route.ts` - Public endpoints (filtered)

---

## 🧪 Testing Scenarios

### Test 1: Publishing Control
```bash
# 1. Owner creates listing
POST /api/owner/properties
Expected: status='pending', isPublished=false

# 2. Verify not public
GET /api/properties
Expected: Property NOT in results

# 3. Admin approves
POST /api/admin/properties/[id]/approve
Expected: status='approved', isPublished=true

# 4. Verify now public
GET /api/properties
Expected: Property IN results

# 5. Admin unpublishes
POST /api/admin/properties/[id]/unpublish
Expected: status='rejected', isPublished=false

# 6. Verify removed from public
GET /api/properties
Expected: Property NOT in results
```

### Test 2: Payment Validation
```bash
# 1. Create owner without payment
# 2. Try to create listing
POST /api/owner/properties
Expected: 402 Payment Required

# 3. Complete Stripe payment
# 4. Webhook fires: payment_intent.succeeded
# 5. Try to create listing again
POST /api/owner/properties
Expected: 201 Created (status='pending')

# 6. Simulate payment failure
# 7. Webhook fires: payment_intent.payment_failed
# 8. Try to create another listing
POST /api/owner/properties
Expected: 402 Payment Required (blocked)
```

### Test 3: Role-Based Access
```bash
# As Guest:
GET /api/properties → ✅ Only approved listings
GET /api/admin/memberships → ❌ 401 Unauthorized
POST /api/owner/properties → ❌ 403 Forbidden

# As Owner:
GET /api/owner/properties → ✅ Own listings only
POST /api/owner/properties → ✅ (if payment confirmed)
POST /api/admin/properties/[id]/approve → ❌ 403 Forbidden
GET /api/admin/memberships → ❌ 403 Forbidden

# As Admin:
GET /api/admin/memberships → ✅ All memberships
POST /api/admin/properties/[id]/approve → ✅ Can approve
POST /api/admin/properties/[id]/unpublish → ✅ Can unpublish
POST /api/owner/properties → ✅ (bypasses payment check)
```

---

## ✅ Compliance Checklist

### Publishing Control
- [x] Admin approval required to publish
- [x] Admin can unpublish listings
- [x] No auto-publish mechanism exists
- [x] Default status is always 'pending'
- [x] Audit logging for all publishing actions

### Payment Validation
- [x] Stripe webhooks configured
- [x] Payment succeeded events tracked
- [x] Payment failed events block submissions
- [x] Subscription status checked before listing
- [x] Cancelled/past_due subscriptions blocked

### Role-Based Access
- [x] Admin has full access to all features
- [x] Owners restricted to own listings
- [x] Public sees only approved listings
- [x] Authentication required for protected routes
- [x] Authorization enforced at API level

---

## 🚀 Production Deployment Notes

1. **Stripe Webhooks:** Ensure webhook endpoint is publicly accessible and signature verification is enabled
2. **Environment Variables:** Set `STRIPE_WEBHOOK_SECRET` in production
3. **Admin Creation:** Create initial admin user via direct database access or setup script
4. **Payment Testing:** Test webhook events in Stripe test mode before production
5. **Audit Logging:** Monitor audit logs for suspicious admin actions

---

## 📞 Support Information

### Common Admin Tasks

**Unpublish a Property:**
```
1. Navigate to /admin/dashboard
2. Click "Approvals" tab
3. Filter by "Approved"
4. Click "Unpublish" on the property
5. Confirm action
```

**Check Payment Status:**
```
1. Navigate to /admin/dashboard
2. Click "Memberships" tab
3. Search for user by email
4. View "Payment" column for status
```

**Manually Approve After Payment:**
```
1. Verify payment in Memberships tab (Status: Paid)
2. Go to Approvals tab
3. Find property in "Pending" filter
4. Click "Approve"
```

---

**Documentation Date:** January 10, 2026  
**Version:** 2.0  
**Status:** Production Ready ✅
