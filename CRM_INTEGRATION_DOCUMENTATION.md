# CRM Integration Technical Documentation
## TreadSoft CRM Integration for Group Escape Houses

**Version:** 1.0.0  
**Last Updated:** January 5, 2025  
**Author:** Development Team

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Setup & Configuration](#setup--configuration)
5. [API Routes](#api-routes)
6. [Database Schema](#database-schema)
7. [CRM Service Layer](#crm-service-layer)
8. [Usage Examples](#usage-examples)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The CRM integration system automatically synchronizes owner data, property listings, enquiries, and bookings with the TreadSoft CRM platform. This integration ensures that all customer relationship management data is kept up-to-date across both systems.

### Key Benefits

- ✅ **Automatic Sync**: Owner records are automatically created in CRM upon registration
- ✅ **Real-time Updates**: Profile changes sync immediately to CRM
- ✅ **Bidirectional Support**: Ready for future two-way synchronization
- ✅ **Error Handling**: Comprehensive logging and retry mechanisms
- ✅ **Flexible Architecture**: Easy to switch between CRM providers

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
├─────────────────────────────────────────────────────────────┤
│  Registration Flow         │  Profile Updates                │
│  ├─ Owner Signup           │  ├─ Edit Profile                │
│  └─ Complete Registration  │  └─ Update Membership           │
│      ↓                     │      ↓                          │
│  [AUTO CRM SYNC]           │  [AUTO CRM SYNC]                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   CRM Service Layer                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Base Service │  │   TreadSoft  │  │  Mock Service│      │
│  │   (Abstract) │→ │    Adapter   │  │  (Testing)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   TreadSoft CRM API                          │
├─────────────────────────────────────────────────────────────┤
│  • Contacts (Owners/Guests)                                  │
│  • Properties (Listings)                                     │
│  • Enquiries (Leads)                                         │
│  • Bookings (Reservations)                                   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Owner Registration**:
   ```
   User Signup → Complete Registration API → Background CRM Sync → Database Update
   ```

2. **Profile Updates**:
   ```
   Edit Profile → Update API → Background CRM Sync → Database Update
   ```

3. **Property Sync**:
   ```
   Create Property → Sync API → CRM Property Creation → Link CRM ID
   ```

---

## Features

### ✅ Implemented Features

#### 1. Auto-Create CRM Records on Owner Signup
- Owner registers on website
- System automatically creates contact in TreadSoft CRM
- CRM ID stored in database for future reference
- Background sync doesn't block user experience

#### 2. Sync Owner Profile Fields
- Bidirectional field mapping:
  - Name (First Name + Last Name)
  - Email
  - Phone
  - Company Name
  - Role
  - Membership Status
- Real-time sync on profile updates
- Sync status tracking (pending/synced/failed)

#### 3. Prepared Sync Structures
- **Properties**: Title, location, bedrooms, price, status
- **Enquiries**: Contact info, subject, message, status
- **Bookings**: Dates, guests, price, payment status
- **Memberships**: Tier, status, payment tracking

---

## Setup & Configuration

### 1. Environment Variables

Add these variables to your `.env` file:

```bash
# CRM Integration (TreadSoft)
CRM_ENABLED=true
CRM_PROVIDER=treadsoft
CRM_API_URL=https://api.treadsoft.com
CRM_API_KEY=your_treadsoft_api_key
CRM_API_SECRET=your_treadsoft_api_secret
CRM_WEBHOOK_SECRET=your_treadsoft_webhook_secret
```

### 2. Database Migration

Run the migration to add CRM fields:

```bash
# If using Turso/LibSQL
npm run db:push

# Or manually run the migration file
drizzle/0004_add_crm_integration.sql
```

### 3. Testing Mode

For development/testing without TreadSoft credentials:

```bash
CRM_ENABLED=false
```

This will use the Mock CRM Service that logs operations to console.

---

## API Routes

### 1. Sync Owner to CRM

**Endpoint:** `POST /api/crm/sync/owner`

**Purpose:** Manually sync an existing owner to CRM

**Request:**
```json
{
  "userId": "user_123abc"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Owner synced to CRM successfully",
  "crmId": "crm_contact_456def"
}
```

**Response (Already Synced):**
```json
{
  "success": true,
  "message": "Owner already synced to CRM",
  "crmId": "crm_contact_456def"
}
```

---

### 2. Sync Property to CRM

**Endpoint:** `POST /api/crm/sync/property`

**Purpose:** Sync a property listing to CRM

**Request:**
```json
{
  "propertyId": 123
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property synced to CRM successfully",
  "crmId": "crm_property_789ghi"
}
```

---

### 3. Bulk Sync

**Endpoint:** `POST /api/crm/sync/bulk`

**Purpose:** Sync multiple records at once

**Request:**
```json
{
  "syncType": "all"  // Options: "owners", "properties", "all"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk sync completed",
  "results": {
    "owners": {
      "synced": 15,
      "failed": 2,
      "skipped": 5
    },
    "properties": {
      "synced": 30,
      "failed": 1,
      "skipped": 10
    }
  }
}
```

---

### 4. Check Sync Status

**Endpoint:** `GET /api/crm/sync/owner?userId=user_123abc`

**Purpose:** Check CRM sync status for a user

**Response:**
```json
{
  "userId": "user_123abc",
  "crmId": "crm_contact_456def",
  "syncStatus": "synced",
  "lastSyncedAt": "2025-01-05T10:30:00.000Z"
}
```

---

### 5. Update Owner Profile (with Auto-Sync)

**Endpoint:** `PUT /api/owner/profile`

**Purpose:** Update owner profile (auto-syncs to CRM)

**Request:**
```json
{
  "name": "John Smith",
  "phone": "+44 7700 900123",
  "companyName": "Smith Properties Ltd",
  "membershipStatus": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_123abc",
    "name": "John Smith",
    "email": "john@example.com",
    "crmSyncStatus": "synced"
  }
}
```

---

## Database Schema

### User Table (Extended)

```sql
ALTER TABLE user ADD COLUMN crm_id TEXT;
ALTER TABLE user ADD COLUMN crm_sync_status TEXT DEFAULT 'pending';
ALTER TABLE user ADD COLUMN crm_last_synced_at INTEGER;
ALTER TABLE user ADD COLUMN membership_status TEXT DEFAULT 'pending';
```

**Fields:**
- `crm_id`: ID in TreadSoft CRM
- `crm_sync_status`: 'pending' | 'synced' | 'failed'
- `crm_last_synced_at`: Timestamp of last successful sync
- `membership_status`: 'active' | 'pending' | 'inactive'

### Properties Table (Extended)

```sql
ALTER TABLE properties ADD COLUMN crm_id TEXT;
ALTER TABLE properties ADD COLUMN crm_sync_status TEXT DEFAULT 'pending';
ALTER TABLE properties ADD COLUMN crm_last_synced_at INTEGER;
```

### Bookings Table (Extended)

```sql
ALTER TABLE bookings ADD COLUMN crm_id TEXT;
ALTER TABLE bookings ADD COLUMN crm_sync_status TEXT DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN crm_last_synced_at INTEGER;
```

### CRM Sync Logs Table (New)

```sql
CREATE TABLE crm_sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,  -- 'contact', 'property', 'enquiry', 'booking'
  entity_id TEXT NOT NULL,
  crm_id TEXT,
  action TEXT NOT NULL,       -- 'create', 'update', 'delete'
  status TEXT NOT NULL,       -- 'success', 'failed', 'pending'
  request_data TEXT,          -- JSON
  response_data TEXT,         -- JSON
  error_message TEXT,
  created_at TEXT NOT NULL
);
```

### Enquiries Table (New)

```sql
CREATE TABLE enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT REFERENCES user(id),
  property_id INTEGER REFERENCES properties(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT DEFAULT 'website',
  crm_id TEXT,
  crm_sync_status TEXT DEFAULT 'pending',
  crm_last_synced_at INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### Owner Memberships Table (New)

```sql
CREATE TABLE owner_memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES user(id),
  membership_tier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  start_date TEXT NOT NULL,
  end_date TEXT,
  auto_renew INTEGER DEFAULT 1,
  payment_status TEXT DEFAULT 'pending',
  crm_id TEXT,
  crm_sync_status TEXT DEFAULT 'pending',
  crm_last_synced_at INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

---

## CRM Service Layer

### File Structure

```
src/lib/crm/
├── index.ts              # Main export file
├── types.ts              # TypeScript interfaces
├── base-service.ts       # Abstract base class
├── treadsoft-service.ts  # TreadSoft adapter
├── factory.ts            # Service factory
└── sync-logger.ts        # Logging utility
```

### Usage in Code

```typescript
import { getCRMService } from '@/lib/crm';

// Get CRM service instance
const crmService = getCRMService();

// Create contact
const result = await crmService.createContact({
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@example.com',
  phone: '+44 7700 900123',
  role: 'owner',
  membershipStatus: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
});

if (result.success) {
  console.log('CRM ID:', result.crmId);
}
```

---

## Usage Examples

### Example 1: Manual Owner Sync

```typescript
// From client-side or API route
const response = await fetch('/api/crm/sync/owner', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'user_123' }),
});

const data = await response.json();
console.log('Sync result:', data);
```

### Example 2: Property Sync After Creation

```typescript
// After creating a property
const propertyId = 123;

await fetch('/api/crm/sync/property', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ propertyId }),
});
```

### Example 3: Check Sync Status

```typescript
const userId = 'user_123';
const response = await fetch(`/api/crm/sync/owner?userId=${userId}`);
const status = await response.json();

console.log('Sync status:', status.syncStatus);
console.log('CRM ID:', status.crmId);
```

---

## Testing

### 1. Test with Mock CRM Service

Set in `.env`:
```bash
CRM_ENABLED=false
```

All CRM operations will be logged to console without making actual API calls.

### 2. Test Owner Registration Flow

1. Register a new owner at `/owner/register`
2. Check console logs for CRM sync messages
3. Verify CRM ID in database:
   ```sql
   SELECT id, email, crm_id, crm_sync_status FROM user WHERE role = 'owner';
   ```

### 3. Test Profile Updates

1. Update owner profile at `/owner/settings`
2. Check sync logs:
   ```sql
   SELECT * FROM crm_sync_logs ORDER BY created_at DESC LIMIT 10;
   ```

### 4. Test Bulk Sync

```bash
curl -X POST http://localhost:3000/api/crm/sync/bulk \
  -H "Content-Type: application/json" \
  -d '{"syncType": "all"}'
```

---

## Troubleshooting

### Issue: Owner not syncing to CRM

**Check:**
1. Is `CRM_ENABLED=true` in `.env`?
2. Are API credentials correct?
3. Check sync logs table for errors:
   ```sql
   SELECT * FROM crm_sync_logs WHERE status = 'failed' ORDER BY created_at DESC;
   ```

**Fix:**
- Verify TreadSoft API credentials
- Check API endpoint URL
- Manually trigger sync: `POST /api/crm/sync/owner`

---

### Issue: Sync status shows "failed"

**Check:**
1. Review error message in sync logs
2. Verify TreadSoft API is accessible
3. Check network connectivity

**Fix:**
- Re-trigger sync after fixing issue
- Update credentials if expired
- Contact TreadSoft support if API is down

---

### Issue: Duplicate records in CRM

**Check:**
1. User has `crm_id` in database?
2. Multiple sync requests sent?

**Fix:**
- System prevents duplicates if `crm_id` exists
- If duplicate created manually, update database with correct CRM ID

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Set production TreadSoft API credentials
- [ ] Set `CRM_ENABLED=true`
- [ ] Run database migration
- [ ] Test with staging environment first
- [ ] Monitor sync logs for first 24 hours
- [ ] Set up error alerts

### Environment Variables (Production)

```bash
CRM_ENABLED=true
CRM_PROVIDER=treadsoft
CRM_API_URL=https://api.treadsoft.com
CRM_API_KEY=prod_key_here
CRM_API_SECRET=prod_secret_here
CRM_WEBHOOK_SECRET=prod_webhook_secret_here
```

---

## Support & Maintenance

### Monitoring

Check sync health regularly:

```sql
-- Failed syncs in last 24 hours
SELECT COUNT(*) FROM crm_sync_logs 
WHERE status = 'failed' 
AND created_at > datetime('now', '-1 day');

-- Successful syncs by type
SELECT entity_type, COUNT(*) as count 
FROM crm_sync_logs 
WHERE status = 'success' 
GROUP BY entity_type;
```

### Maintenance Tasks

1. **Weekly**: Review failed sync logs
2. **Monthly**: Archive old sync logs (keep last 90 days)
3. **Quarterly**: Audit CRM data consistency

---

## Future Enhancements

### Planned Features

- [ ] Webhook receiver for CRM → App sync (bidirectional)
- [ ] Automatic retry mechanism for failed syncs
- [ ] Batch sync optimization
- [ ] Real-time sync status dashboard
- [ ] CRM data import tool
- [ ] Multiple CRM provider support (Salesforce, HubSpot)

---

## Contact

**Development Team**: [Your Team Email]  
**TreadSoft Support**: [TreadSoft Support Link]  
**Documentation Version**: 1.0.0  
**Last Updated**: January 5, 2025
