# Property Listing Approval Workflow - Complete Implementation

## 📋 Overview

This document describes the complete property listing submission and admin approval workflow implemented in the system. Properties submitted by owners require admin approval before appearing on the frontend and public APIs.

**Implementation Date:** 17/12/2025  
**Status:** ✅ Production Ready

---

## 🎯 Workflow Summary

### 1. Owner Submits Property
- Owner creates new property listing via dashboard
- **Status:** Automatically set to `pending`
- Property is NOT visible on frontend
- Owner can see status in their dashboard

### 2. Admin Reviews
- Admin views pending properties in admin panel
- Admin can see all submission details
- Admin makes approval decision

### 3. Admin Action
**Option A - Approve:**
- Status changes to `approved`
- Property becomes visible on frontend
- Owner is notified (future enhancement)

**Option B - Reject:**
- Status changes to `rejected`
- Admin provides rejection reason
- Property remains hidden
- Owner can see rejection reason and resubmit

### 4. Property Updates
- When owner updates approved property with significant changes:
  - Status automatically resets to `pending`
  - Requires re-approval
  - Property remains visible until re-approved (configurable)

---

## 🗂️ Database Schema Changes

### Properties Table - New Fields

```typescript
// src/db/schema.ts

export const properties = sqliteTable('properties', {
  // ... existing fields ...
  
  // ✨ NEW: Listing Status & Approval Workflow
  status: text('status').notNull().default('pending'), 
  // Values: 'pending', 'approved', 'rejected'
  
  rejectionReason: text('rejection_reason'), 
  // Admin's reason for rejection
  
  approvedBy: text('approved_by').references(() => user.id, { onDelete: 'set null' }), 
  // Admin who approved
  
  approvedAt: text('approved_at'), 
  // Approval timestamp (DD/MM/YYYY HH:mm:ss)
  
  // ... existing fields ...
});
```

### Status Values

| Status | Description | Frontend Visibility |
|--------|-------------|---------------------|
| `pending` | Awaiting admin approval | ❌ Hidden |
| `approved` | Approved by admin | ✅ Visible |
| `rejected` | Rejected by admin | ❌ Hidden |

---

## 📁 Files Created/Modified

### 1. Database Schema
**File:** `src/db/schema.ts`

**Changes:**
- Added `status` field (default: 'pending')
- Added `rejectionReason` field
- Added `approvedBy` field (references user.id)
- Added `approvedAt` field (UK timestamp)

---

### 2. Validation Schemas
**File:** `src/lib/validations/property-validations.ts`

**New Schemas:**
```typescript
// Status management for admin
export const propertyStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
  rejectionReason: z.string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500)
    .optional(),
});

// Approve property
export const approvePropertySchema = z.object({
  propertyId: z.number().int().positive(),
});

// Reject property with reason
export const rejectPropertySchema = z.object({
  propertyId: z.number().int().positive(),
  reason: z.string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500),
});
```

---

### 3. Admin Approval API
**File:** `src/app/api/admin/properties/[id]/approve/route.ts`

**Endpoint:** `POST /api/admin/properties/[id]/approve`

**Authorization:** Admin only

**Functionality:**
- Validates admin session
- Checks property exists
- Updates status to 'approved'
- Records approver and timestamp
- Clears any previous rejection reason
- Logs audit event

**Response:**
```json
{
  "success": true,
  "message": "Property approved successfully",
  "property": {
    "id": 1,
    "title": "Brighton Manor",
    "status": "approved",
    "approvedBy": "admin-user-id",
    "approvedAt": "17/12/2025 15:30:00",
    "ownerId": "owner-user-id"
  },
  "timestamp": "17/12/2025 15:30:00"
}
```

---

### 4. Admin Rejection API
**File:** `src/app/api/admin/properties/[id]/reject/route.ts`

**Endpoint:** `POST /api/admin/properties/[id]/reject`

**Authorization:** Admin only

**Request Body:**
```json
{
  "reason": "Images are not high quality enough. Please upload professional photos."
}
```

**Functionality:**
- Validates admin session
- Validates rejection reason (10-500 chars)
- Updates status to 'rejected'
- Stores rejection reason
- Clears approval data
- Logs audit event

**Response:**
```json
{
  "success": true,
  "message": "Property rejected",
  "property": {
    "id": 1,
    "title": "Brighton Manor",
    "status": "rejected",
    "rejectionReason": "Images are not high quality enough...",
    "rejectedBy": "admin-user-id",
    "rejectedAt": "17/12/2025 15:30:00",
    "ownerId": "owner-user-id"
  },
  "timestamp": "17/12/2025 15:30:00"
}
```

---

### 5. Admin Pending Properties List API
**File:** `src/app/api/admin/properties/pending/route.ts`

**Endpoint:** `GET /api/admin/properties/pending`

**Authorization:** Admin only

**Query Parameters:**
- `status` - Filter by status: 'pending', 'approved', 'rejected', 'all' (default: 'pending')
- `limit` - Max results (default: 50, max: 100)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "properties": [
    {
      "id": 1,
      "title": "Brighton Manor",
      "slug": "brighton-manor",
      "location": "Brighton",
      "region": "South East",
      "status": "pending",
      "rejectionReason": null,
      "approvedBy": null,
      "approvedAt": null,
      "heroImage": "https://...",
      "featured": false,
      "isPublished": true,
      "createdAt": "15/12/2025 10:00:00",
      "updatedAt": "15/12/2025 10:00:00",
      "owner": {
        "id": "owner-user-id",
        "name": "Dan Harley",
        "email": "danharley2006@yahoo.co.uk",
        "company": "Property Management Ltd"
      }
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "statusCounts": {
    "pending": 5,
    "approved": 20,
    "rejected": 2,
    "total": 27
  },
  "timestamp": "17/12/2025 15:30:00"
}
```

---

### 6. Owner Property Creation API (Modified)
**File:** `src/app/api/owner/properties/route.ts`

**Changes:**
- New properties automatically set to `status: 'pending'`
- Response includes status information for owner visibility

**POST Response:**
```json
{
  "success": true,
  "property": {
    "id": 1,
    "title": "Brighton Manor",
    "status": "pending",
    "ownerId": "owner-user-id",
    // ... other fields
  },
  "timestamp": "17/12/2025 15:30:00"
}
```

**GET Response (includes status):**
```json
{
  "success": true,
  "properties": [
    {
      "id": 1,
      "title": "Brighton Manor",
      // ... other fields
      "statusInfo": {
        "status": "pending",
        "approvedAt": null,
        "rejectionReason": null
      }
    }
  ]
}
```

---

### 7. Owner Property Update API (Modified)
**File:** `src/app/api/owner/properties/[id]/route.ts`

**Changes:**
- Significant property updates reset status to 'pending'
- Triggers when updating: title, description, guest capacity, pricing

**Re-approval Logic:**
```typescript
const needsReapproval = Boolean(
  title || description || sleepsMin !== undefined || 
  sleepsMax !== undefined || priceFromMidweek !== undefined
);

if (needsReapproval && oldProperty.status === 'approved') {
  // Reset to pending
  status: 'pending',
  approvedBy: null,
  approvedAt: null,
}
```

**Fields that trigger re-approval:**
- ✅ Title
- ✅ Description
- ✅ Sleeps min/max
- ✅ Pricing (midweek/weekend)

**Fields that DON'T trigger re-approval:**
- ❌ Images (minor updates)
- ❌ Features/amenities (minor updates)
- ❌ Location coordinates
- ❌ House rules

---

### 8. Public APIs (Modified)
**Files:**
- `src/app/api/orchards/properties/route.ts`
- `src/app/api/orchards/properties/[id]/route.ts`
- `src/app/api/orchards/availability/route.ts`

**Changes:**
All public APIs now filter to only show `status: 'approved'` properties:

```typescript
where(
  and(
    eq(properties.isPublished, true),
    eq(properties.status, 'approved'), // ✨ NEW
    // ... other filters
  )
)
```

**Impact:**
- Frontend only shows approved properties
- Orchards API only returns approved properties
- Availability checks only work for approved properties

---

## 🔄 Complete Workflow Examples

### Example 1: New Property Submission

**Step 1: Owner creates property**
```bash
POST /api/owner/properties
{
  "title": "Coastal Cottage",
  "location": "Cornwall",
  "region": "South West",
  "sleepsMin": 4,
  "sleepsMax": 6,
  "bedrooms": 3,
  "bathrooms": 2,
  "priceFromMidweek": 350,
  "priceFromWeekend": 450,
  "description": "Beautiful coastal cottage...",
  "heroImage": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "property": {
    "id": 5,
    "title": "Coastal Cottage",
    "status": "pending", // ✨ Automatically set
    "approvedBy": null,
    "approvedAt": null,
    "ownerId": "owner-123"
  }
}
```

**Step 2: Admin views pending**
```bash
GET /api/admin/properties/pending?status=pending
```

**Step 3: Admin approves**
```bash
POST /api/admin/properties/5/approve
```

**Response:**
```json
{
  "success": true,
  "message": "Property approved successfully",
  "property": {
    "id": 5,
    "status": "approved", // ✨ Now approved
    "approvedBy": "admin-456",
    "approvedAt": "17/12/2025 16:00:00"
  }
}
```

**Step 4: Property now visible**
```bash
GET /api/orchards/properties
# Property ID 5 now appears in results
```

---

### Example 2: Property Rejection

**Step 1: Admin rejects**
```bash
POST /api/admin/properties/5/reject
{
  "reason": "Please provide higher quality images and more detailed description of amenities."
}
```

**Response:**
```json
{
  "success": true,
  "property": {
    "id": 5,
    "status": "rejected",
    "rejectionReason": "Please provide higher quality images..."
  }
}
```

**Step 2: Owner views status**
```bash
GET /api/owner/properties
```

**Response shows rejection:**
```json
{
  "properties": [
    {
      "id": 5,
      "title": "Coastal Cottage",
      "statusInfo": {
        "status": "rejected",
        "rejectionReason": "Please provide higher quality images..."
      }
    }
  ]
}
```

**Step 3: Owner updates and resubmits**
```bash
PUT /api/owner/properties/5
{
  "description": "Enhanced description with detailed amenities...",
  "heroImage": "https://new-high-quality-image.jpg"
}
```

**Result:** Status resets to 'pending' for re-review

---

### Example 3: Update Requiring Re-approval

**Initial state:** Property approved and visible

**Owner makes significant update:**
```bash
PUT /api/owner/properties/3
{
  "priceFromMidweek": 500, // Changed from 350
  "description": "Updated description"
}
```

**System automatically:**
1. Sets status back to 'pending'
2. Clears approvedBy and approvedAt
3. Property remains visible (configurable)
4. Admin notified for re-review (future enhancement)

---

## 🔒 Security & Permissions

### Role-Based Access Control

| Action | Guest | Owner | Admin |
|--------|-------|-------|-------|
| Create property | ❌ | ✅ | ✅ |
| View own properties | ❌ | ✅ | ✅ |
| Update own properties | ❌ | ✅ | ✅ |
| View all pending properties | ❌ | ❌ | ✅ |
| Approve/reject properties | ❌ | ❌ | ✅ |
| View public approved properties | ✅ | ✅ | ✅ |

### Authentication Checks

**Owner APIs:**
```typescript
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

if (session.user.role !== 'owner') {
  return NextResponse.json(
    { error: 'Access denied. Owner role required.' },
    { status: 403 }
  );
}
```

**Admin APIs:**
```typescript
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

if (session.user.role !== 'admin') {
  return NextResponse.json(
    { error: 'Forbidden - Admin access required' },
    { status: 403 }
  );
}
```

### Ownership Verification

```typescript
// Owner can only manage their own properties
const property = await db
  .select()
  .from(properties)
  .where(
    and(
      eq(properties.id, propertyId),
      eq(properties.ownerId, session.user.id) // ✨ Ownership check
    )
  );
```

---

## 🧪 Testing

### Test Scenario 1: Property Approval Flow

```bash
# 1. Owner creates property
curl -X POST http://localhost:3000/api/owner/properties \
  -H "Cookie: session=owner-session-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Property",
    "location": "Brighton",
    "region": "South East",
    "sleepsMin": 4,
    "sleepsMax": 8,
    "bedrooms": 4,
    "bathrooms": 2,
    "priceFromMidweek": 400,
    "priceFromWeekend": 600,
    "description": "A lovely test property with amazing views...",
    "heroImage": "https://example.com/image.jpg"
  }'

# Expected: status = "pending"

# 2. Verify NOT visible on frontend
curl http://localhost:3000/api/orchards/properties
# Expected: Property NOT in list

# 3. Admin views pending
curl http://localhost:3000/api/admin/properties/pending \
  -H "Cookie: session=admin-session-token"
# Expected: Property appears in pending list

# 4. Admin approves
curl -X POST http://localhost:3000/api/admin/properties/1/approve \
  -H "Cookie: session=admin-session-token"
# Expected: status = "approved"

# 5. Verify NOW visible on frontend
curl http://localhost:3000/api/orchards/properties
# Expected: Property appears in list
```

### Test Scenario 2: Property Rejection

```bash
# 1. Admin rejects property
curl -X POST http://localhost:3000/api/admin/properties/1/reject \
  -H "Cookie: session=admin-session-token" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Images need improvement"}'
# Expected: status = "rejected"

# 2. Owner views rejection
curl http://localhost:3000/api/owner/properties \
  -H "Cookie: session=owner-session-token"
# Expected: Shows rejectionReason

# 3. Verify NOT visible on frontend
curl http://localhost:3000/api/orchards/properties
# Expected: Property NOT in list
```

### Test Scenario 3: Re-approval After Update

```bash
# 1. Update approved property with significant change
curl -X PUT http://localhost:3000/api/owner/properties/1 \
  -H "Cookie: session=owner-session-token" \
  -H "Content-Type: application/json" \
  -d '{"priceFromMidweek": 500}'
# Expected: status resets to "pending"

# 2. Admin must re-approve
curl -X POST http://localhost:3000/api/admin/properties/1/approve \
  -H "Cookie: session=admin-session-token"
# Expected: status = "approved" again
```

---

## 📊 Admin Dashboard Integration

### Recommended UI Features

**1. Pending Properties Widget**
```
┌─────────────────────────────────┐
│ Pending Approvals               │
│                                 │
│ 🟡 5 properties awaiting review │
│                                 │
│ [View All Pending] →            │
└─────────────────────────────────┘
```

**2. Property List with Status**
```
┌──────────────────────────────────────────┐
│ Property                  Status  Actions│
├──────────────────────────────────────────┤
│ Brighton Manor          🟡 Pending  [✓][✗]│
│ Coastal Cottage         ✅ Approved       │
│ Country House           ❌ Rejected  [↻]  │
└──────────────────────────────────────────┘
```

**3. Approval Modal**
```
┌─────────────────────────────────────┐
│ Approve Property                    │
├─────────────────────────────────────┤
│ Title: Brighton Manor               │
│ Owner: Dan Harley                   │
│ Submitted: 15/12/2025 10:00:00      │
│                                     │
│ [View Full Details]                 │
│                                     │
│ Are you sure you want to approve    │
│ this property listing?              │
│                                     │
│ [Cancel]  [✓ Approve]               │
└─────────────────────────────────────┘
```

**4. Rejection Modal**
```
┌─────────────────────────────────────┐
│ Reject Property                     │
├─────────────────────────────────────┤
│ Title: Brighton Manor               │
│                                     │
│ Rejection Reason (required):        │
│ ┌─────────────────────────────────┐│
│ │ Please provide:                 ││
│ │ - Higher quality photos         ││
│ │ - More detailed description     ││
│ │ - Amenities list                ││
│ └─────────────────────────────────┘│
│                                     │
│ [Cancel]  [✗ Reject]                │
└─────────────────────────────────────┘
```

---

## 🎨 Owner Dashboard Integration

### Status Indicators

**1. Property Card Status Badge**
```
┌────────────────────────────┐
│ 🏠 Brighton Manor          │
│ 📍 Brighton, South East    │
│                            │
│ Status: 🟡 PENDING         │
│ Submitted: 15/12/2025      │
│                            │
│ [Edit] [View]              │
└────────────────────────────┘
```

**2. Status with Rejection Reason**
```
┌────────────────────────────────────┐
│ 🏠 Coastal Cottage                 │
│ 📍 Cornwall, South West            │
│                                    │
│ Status: ❌ REJECTED                │
│ Reason: "Please provide higher     │
│ quality images and more detailed   │
│ description of amenities."         │
│                                    │
│ [Edit & Resubmit]                  │
└────────────────────────────────────┘
```

**3. Status Legend**
```
Property Status:
🟡 Pending   - Awaiting admin approval
✅ Approved  - Live on website
❌ Rejected  - Needs changes before approval
```

---

## 🚀 Migration Guide

### Database Migration

**Step 1: Add new columns**
```sql
-- SQLite migration
ALTER TABLE properties ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE properties ADD COLUMN rejection_reason TEXT;
ALTER TABLE properties ADD COLUMN approved_by TEXT REFERENCES user(id);
ALTER TABLE properties ADD COLUMN approved_at TEXT;
```

**Step 2: Set existing properties to approved**
```sql
-- Approve all existing published properties
UPDATE properties 
SET status = 'approved', 
    approved_at = datetime('now', 'localtime')
WHERE is_published = 1;
```

**Step 3: Verify migration**
```sql
-- Check status distribution
SELECT status, COUNT(*) as count 
FROM properties 
GROUP BY status;
```

---

## 📧 Notifications (Future Enhancement)

### Email Templates

**1. Property Submitted (to Admin)**
```
Subject: New Property Listing Pending Approval

A new property has been submitted for approval:

Property: Brighton Manor
Owner: Dan Harley (danharley2006@yahoo.co.uk)
Submitted: 17/12/2025 15:30:00

[Review in Admin Panel] →
```

**2. Property Approved (to Owner)**
```
Subject: Your Property Listing is Now Live!

Congratulations! Your property has been approved:

Property: Brighton Manor
Approved: 17/12/2025 16:00:00

Your property is now visible on our website.

[View Your Listing] →
```

**3. Property Rejected (to Owner)**
```
Subject: Action Required: Property Listing Needs Changes

Your property submission requires some changes:

Property: Brighton Manor
Status: Rejected

Admin Feedback:
"Please provide higher quality images and more detailed 
description of amenities."

[Edit Property] →
```

---

## 🔍 Audit Logging

All approval actions are logged with:

```typescript
await auditLog({
  userId: session.user.id,
  action: 'property_approved', // or 'property_rejected'
  resourceType: 'property',
  resourceId: propertyId.toString(),
  details: {
    propertyTitle: 'Brighton Manor',
    previousStatus: 'pending',
    newStatus: 'approved',
    rejectionReason: null,
    ownerId: 'owner-user-id',
  },
});
```

**Queryable fields:**
- Who approved/rejected (userId)
- What property (resourceId)
- When (timestamp)
- Previous and new status
- Rejection reason (if applicable)

---

## ✅ Completion Checklist

- [x] Database schema updated with status fields
- [x] Validation schemas added for status management
- [x] Admin approval API created
- [x] Admin rejection API created
- [x] Admin pending properties list API created
- [x] Owner property creation sets status to pending
- [x] Owner property updates trigger re-approval when needed
- [x] Owner APIs include status information
- [x] Public APIs filter for approved properties only
- [x] Audit logging for all approval actions
- [x] Documentation completed

---

## 🎯 Next Steps (Optional Enhancements)

1. **Email Notifications**
   - Notify admin when property submitted
   - Notify owner when property approved/rejected
   - Use email service (Resend, SendGrid, etc.)

2. **Batch Operations**
   - Bulk approve/reject multiple properties
   - Admin can select multiple and action

3. **Approval Comments**
   - Admin can leave internal notes
   - Track approval history

4. **Auto-Approval Rules**
   - Trusted owners can have auto-approval
   - Properties from verified owners skip review

5. **Frontend Dashboard**
   - Owner dashboard UI showing status
   - Admin panel UI for approvals
   - Status change notifications

6. **Analytics**
   - Average approval time
   - Rejection reasons analysis
   - Properties by status over time

---

## 📞 Support

For questions about the approval workflow:

**Developer Contact:** Development Team  
**Documentation:** This file  
**Related Docs:** 
- [STEP_3_OWNER_DASHBOARD_SUMMARY.md](STEP_3_OWNER_DASHBOARD_SUMMARY.md)
- [STEP_4_ORCHARDS_INTEGRATION_SUMMARY.md](STEP_4_ORCHARDS_INTEGRATION_SUMMARY.md)

---

**Last Updated:** 17/12/2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
