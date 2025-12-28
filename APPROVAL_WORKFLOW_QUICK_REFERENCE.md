# Property Approval Workflow - Quick Reference

## 📋 Quick Overview

Properties submitted by owners require admin approval before appearing on the frontend.

**Status Flow:** `pending` → `approved` ✅ or `rejected` ❌

---

## 🔌 API Endpoints

### Admin Endpoints

```bash
# List pending properties
GET /api/admin/properties/pending?status=pending&limit=50

# Approve property
POST /api/admin/properties/[id]/approve

# Reject property
POST /api/admin/properties/[id]/reject
Body: { "reason": "Rejection reason here" }
```

### Owner Endpoints (Modified)

```bash
# Create property (auto-sets status=pending)
POST /api/owner/properties

# Get properties with status info
GET /api/owner/properties

# Update property (may reset to pending)
PUT /api/owner/properties/[id]
```

### Public Endpoints (Modified)

```bash
# All now filter for status='approved' only
GET /api/orchards/properties
GET /api/orchards/properties/[id]
POST /api/orchards/availability
```

---

## 📊 Database Fields

```typescript
properties {
  status: 'pending' | 'approved' | 'rejected',  // Default: 'pending'
  rejectionReason: string | null,
  approvedBy: string | null,  // Admin user ID
  approvedAt: string | null,  // UK timestamp
}
```

---

## 🔄 Workflow Examples

### Example 1: Approve Property

```bash
POST /api/admin/properties/1/approve
Authorization: Admin session required

Response:
{
  "success": true,
  "property": {
    "id": 1,
    "status": "approved",
    "approvedBy": "admin-user-id",
    "approvedAt": "17/12/2025 15:30:00"
  }
}
```

### Example 2: Reject Property

```bash
POST /api/admin/properties/1/reject
Content-Type: application/json
Authorization: Admin session required

{
  "reason": "Please provide higher quality images"
}

Response:
{
  "success": true,
  "property": {
    "id": 1,
    "status": "rejected",
    "rejectionReason": "Please provide higher quality images"
  }
}
```

### Example 3: Owner Views Status

```bash
GET /api/owner/properties
Authorization: Owner session required

Response:
{
  "properties": [
    {
      "id": 1,
      "title": "Brighton Manor",
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

## 🎯 Re-approval Logic

### Updates that trigger re-approval:
- ✅ Title changes
- ✅ Description changes
- ✅ Guest capacity changes (sleepsMin/Max)
- ✅ Pricing changes

### Updates that DON'T trigger re-approval:
- ❌ Image updates
- ❌ Feature/amenity updates
- ❌ House rules
- ❌ Location coordinates

---

## 🔒 Permissions

| Action | Guest | Owner | Admin |
|--------|-------|-------|-------|
| Submit property | ❌ | ✅ | ✅ |
| View status | ❌ | ✅ (own) | ✅ (all) |
| Approve/Reject | ❌ | ❌ | ✅ |
| View approved | ✅ | ✅ | ✅ |

---

## 🧪 Quick Test

```bash
# 1. Create property as owner
POST /api/owner/properties
# Expected: status = "pending"

# 2. Verify NOT visible
GET /api/orchards/properties
# Expected: Property NOT in list

# 3. Admin approves
POST /api/admin/properties/1/approve

# 4. Verify NOW visible
GET /api/orchards/properties
# Expected: Property appears
```

---

## 📝 Status Indicators

**UI Status Badges:**
- 🟡 `pending` - Awaiting admin review
- ✅ `approved` - Live on website
- ❌ `rejected` - Needs changes

---

## 🔄 Migration

```sql
-- Add columns to existing database
ALTER TABLE properties ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE properties ADD COLUMN rejection_reason TEXT;
ALTER TABLE properties ADD COLUMN approved_by TEXT;
ALTER TABLE properties ADD COLUMN approved_at TEXT;

-- Approve all existing published properties
UPDATE properties 
SET status = 'approved', approved_at = datetime('now')
WHERE is_published = 1;
```

---

## 📚 Full Documentation

See [PROPERTY_APPROVAL_WORKFLOW.md](PROPERTY_APPROVAL_WORKFLOW.md) for complete details.

---

**Last Updated:** 17/12/2025  
**Status:** ✅ Production Ready
