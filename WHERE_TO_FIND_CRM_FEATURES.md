# CRM Features - WHERE TO FIND THEM

## 🎯 Quick Navigation

### 1. **Backend CRM Files** (Code)
**Location:** `src/lib/crm/`

Files:
```
📁 src/lib/crm/
├── 📄 index.ts                  ← Main entry point
├── 📄 types.ts                  ← Type definitions (interfaces)
├── 📄 base-service.ts           ← Abstract service class
├── 📄 treadsoft-service.ts      ← TreadSoft adapter logic
├── 📄 factory.ts                ← Service factory & initialization
└── 📄 sync-logger.ts            ← CRM operation logging
```

**View in VS Code:**
1. Open VS Code
2. Press `Ctrl + P`
3. Type: `src/lib/crm`
4. Select any file to view

---

### 2. **API Endpoints** (API Routes)
**Location:** `src/app/api/`

**CRM-Specific Routes:**
```
📁 src/app/api/
├── 📁 crm/sync/
│   ├── owner/route.ts           ← POST /api/crm/sync/owner
│   ├── property/route.ts        ← POST /api/crm/sync/property
│   └── bulk/route.ts            ← POST /api/crm/sync/bulk
│
└── 📁 owner/
    ├── complete-signup/route.ts ← Modified (auto-sync on registration)
    └── profile/route.ts         ← New (auto-sync on profile update)
```

**Test These Endpoints:**
```bash
# Open your browser or use curl/Postman

# 1. Sync a specific owner
POST http://localhost:3000/api/crm/sync/owner
Body: {"userId": "user_123"}

# 2. Sync a specific property
POST http://localhost:3000/api/crm/sync/property
Body: {"propertyId": 123}

# 3. Bulk sync all
POST http://localhost:3000/api/crm/sync/bulk
Body: {"syncType": "all"}

# 4. Check sync status
GET http://localhost:3000/api/crm/sync/owner?userId=user_123
```

---

### 3. **Database Schema** (Tables)
**Location:** `src/db/schema.ts`

**New/Extended Fields:**
```
TABLE: user
├── crm_id                    ← CRM contact ID
├── crm_sync_status           ← 'pending' | 'synced' | 'failed'
├── crm_last_synced_at        ← Last sync timestamp
└── membership_status         ← 'active' | 'pending' | 'inactive'

TABLE: properties
├── crm_id
├── crm_sync_status
└── crm_last_synced_at

TABLE: bookings
├── crm_id
├── crm_sync_status
└── crm_last_synced_at

NEW TABLE: crm_sync_logs      ← Complete sync history
├── id (auto-increment)
├── entity_type               ← 'contact', 'property', etc
├── entity_id                 ← Local ID
├── crm_id                    ← CRM ID
├── action                    ← 'create', 'update', 'delete'
├── status                    ← 'success', 'failed', 'pending'
├── request_data              ← What was sent (JSON)
├── response_data             ← What was returned (JSON)
├── error_message             ← If failed
└── created_at                ← Timestamp

NEW TABLE: enquiries          ← Lead tracking
├── id
├── user_id, property_id
├── guest_name, guest_email, guest_phone
├── subject, message
├── status                    ← 'new', 'contacted', 'qualified', etc
├── crm_id, crm_sync_status, crm_last_synced_at
└── timestamps

NEW TABLE: owner_memberships  ← Membership tiers
├── id
├── user_id
├── membership_tier           ← 'basic', 'premium', 'enterprise'
├── status, payment_status
├── crm_id, crm_sync_status, crm_last_synced_at
└── timestamps
```

**View Schema:**
1. Open: `src/db/schema.ts`
2. Search: `crm_id` to see all CRM fields
3. Or search: `crmSyncLogs`, `enquiries`, `ownerMemberships` for new tables

---

### 4. **Environment Configuration** (.env)
**Location:** `.env` (root directory)

**CRM Variables:**
```bash
# CRM Integration (TreadSoft)
CRM_ENABLED=false
CRM_PROVIDER=treadsoft
CRM_API_URL=https://api.treadsoft.com
CRM_API_KEY=demo_key
CRM_API_SECRET=demo_secret
CRM_WEBHOOK_SECRET=demo_webhook_secret
```

**View in Terminal:**
```bash
# PowerShell
Get-Content .env | Select-String -Pattern "CRM_"

# Or open file directly
code .env
```

---

### 5. **Database Migration** (SQL)
**Location:** `drizzle/0004_add_crm_integration.sql`

**What it does:**
- Adds CRM fields to existing tables
- Creates 4 new tables (crm_sync_logs, enquiries, owner_memberships)
- Creates indexes for performance

**View & Run:**
```bash
# View the migration
cat drizzle/0004_add_crm_integration.sql

# Apply to database
npm run db:push
```

---

### 6. **Console/Log Output**
**Location:** Terminal/Console where `npm run dev` is running

**What to Look For:**
```
When you register an owner, you'll see:

✓ Registration success
✓ Complete signup called
[Mock CRM] Create contact: owner@example.com
✅ Owner owner@example.com synced to CRM: mock-contact-1234567890
```

**Check Console:**
1. Look at terminal running `npm run dev`
2. Search for: `[Mock CRM]` or `✅ Owner`
3. Check for any `❌ Failed to sync` messages

---

### 7. **Documentation** (Guides)
**Location:** Root directory

**Files:**
```
📄 CRM_INTEGRATION_QUICK_START.md
   ↑ Quick reference guide
   ├─ How it works
   ├─ Configuration
   ├─ Testing instructions
   ├─ API endpoints
   └─ Next steps

📄 CRM_INTEGRATION_DOCUMENTATION.md
   ↑ Complete technical documentation
   ├─ Architecture diagrams
   ├─ API reference (detailed)
   ├─ Database schema (detailed)
   ├─ Code examples
   ├─ Troubleshooting
   └─ Production checklist
```

**View:**
```bash
# In VS Code
Ctrl + Shift + P → "Markdown Preview"

# Or in terminal
code CRM_INTEGRATION_QUICK_START.md
```

---

### 8. **Modified Files**
**Files that were updated to add CRM integration:**

```
✏️ src/app/api/owner/complete-signup/route.ts
   └─ Added auto-sync function syncOwnerToCRM()
   └─ Calls CRM when owner completes registration

✏️ src/db/schema.ts
   └─ Extended user table with crm_* fields
   └─ Extended properties table with crm_* fields
   └─ Extended bookings table with crm_* fields
   └─ Added crmSyncLogs table
   └─ Added enquiries table
   └─ Added ownerMemberships table

✏️ .env.example
   └─ Added CRM configuration examples

✏️ .env (your local file)
   └─ Added CRM variables
```

---

## 🚀 HOW TO ACCESS EACH FEATURE

### **Feature 1: Auto-Sync on Owner Registration**

**Test It:**
1. Go to: http://localhost:3000/owner/register
2. Fill in the form and submit
3. Check terminal for logs:
   ```
   [Mock CRM] Create contact: your_email@example.com
   ✅ Owner your_email@example.com synced to CRM: mock-contact-12345
   ```

**View Code:**
- `src/app/api/owner/complete-signup/route.ts` (the `syncOwnerToCRM()` function)

**In Database:**
- Query: `SELECT email, crm_id, crm_sync_status FROM user WHERE role = 'owner' LIMIT 1;`

---

### **Feature 2: Auto-Sync on Profile Update**

**Test It:**
1. Register as owner → http://localhost:3000/owner/register
2. Go to owner dashboard
3. Update your profile (name, phone, company)
4. Check terminal for:
   ```
   [Mock CRM] Update contact: your_email@example.com
   ✅ Profile updated in CRM
   ```

**View Code:**
- `src/app/api/owner/profile/route.ts` (the `syncProfileUpdateToCRM()` function)

**In Database:**
- Query: `SELECT * FROM crm_sync_logs WHERE action = 'update' ORDER BY created_at DESC;`

---

### **Feature 3: Manual Sync Endpoints**

**Test with Postman or curl:**

```bash
# 1. Sync specific owner
curl -X POST http://localhost:3000/api/crm/sync/owner \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID_HERE"}'

# Response:
# {
#   "success": true,
#   "message": "Owner synced to CRM successfully",
#   "crmId": "mock-contact-12345"
# }

# 2. Check sync status
curl http://localhost:3000/api/crm/sync/owner?userId=USER_ID_HERE

# Response:
# {
#   "userId": "USER_ID_HERE",
#   "crmId": "mock-contact-12345",
#   "syncStatus": "synced",
#   "lastSyncedAt": "2025-01-05T10:30:00.000Z"
# }

# 3. Bulk sync all owners
curl -X POST http://localhost:3000/api/crm/sync/bulk \
  -H "Content-Type: application/json" \
  -d '{"syncType":"owners"}'

# Response:
# {
#   "success": true,
#   "message": "Bulk sync completed",
#   "results": {
#     "owners": {
#       "synced": 5,
#       "failed": 0,
#       "skipped": 2
#     }
#   }
# }
```

**View Code:**
- `src/app/api/crm/sync/owner/route.ts`
- `src/app/api/crm/sync/property/route.ts`
- `src/app/api/crm/sync/bulk/route.ts`

---

### **Feature 4: CRM Sync Logs**

**View All Sync Operations:**
```sql
SELECT 
  entity_type,
  entity_id,
  crm_id,
  action,
  status,
  error_message,
  created_at
FROM crm_sync_logs
ORDER BY created_at DESC
LIMIT 20;
```

**View Failed Syncs:**
```sql
SELECT * FROM crm_sync_logs 
WHERE status = 'failed' 
ORDER BY created_at DESC;
```

**View Successful Syncs:**
```sql
SELECT * FROM crm_sync_logs 
WHERE status = 'success' 
ORDER BY created_at DESC;
```

**File Location:**
- `src/lib/crm/sync-logger.ts` (logging functions)

---

### **Feature 5: Enquiry Tracking (for CRM)**

**Table Ready For:**
- Guest enquiries
- Lead status tracking
- CRM sync capability

**View Structure:**
```
src/db/schema.ts → search for "enquiries table"

Fields: id, user_id, property_id, guest_name, guest_email, 
        subject, message, status, crm_id, crm_sync_status, etc.
```

**API Endpoint (when you implement):**
- To be implemented: POST `/api/crm/sync/enquiry`

---

### **Feature 6: Membership Tier Tracking**

**Table Ready For:**
- Owner membership levels (basic/premium/enterprise)
- Payment status tracking
- Auto-renewal management
- CRM sync capability

**View Structure:**
```
src/db/schema.ts → search for "ownerMemberships table"

Fields: id, user_id, membership_tier, status, payment_status,
        auto_renew, crm_id, crm_sync_status, etc.
```

---

## 📊 COMPLETE FILE TREE

```
escape-houses-1-main/
├── 📁 src/
│   ├── 📁 lib/
│   │   └── 📁 crm/                    ← CRM SERVICE LAYER
│   │       ├── index.ts
│   │       ├── types.ts
│   │       ├── base-service.ts
│   │       ├── treadsoft-service.ts
│   │       ├── factory.ts
│   │       └── sync-logger.ts
│   │
│   ├── 📁 app/
│   │   └── 📁 api/
│   │       ├── 📁 crm/sync/           ← CRM ENDPOINTS
│   │       │   ├── owner/route.ts
│   │       │   ├── property/route.ts
│   │       │   └── bulk/route.ts
│   │       │
│   │       └── 📁 owner/
│   │           ├── complete-signup/route.ts  ✏️ (modified)
│   │           └── profile/route.ts          ✨ (new)
│   │
│   └── 📁 db/
│       └── schema.ts                  ✏️ (extended)
│
├── 📁 drizzle/
│   └── 0004_add_crm_integration.sql  ← MIGRATION
│
├── 📄 .env                            ✏️ (updated)
├── 📄 .env.example                    ✏️ (updated)
├── 📄 CRM_INTEGRATION_QUICK_START.md  ← QUICK GUIDE
├── 📄 CRM_INTEGRATION_DOCUMENTATION.md ← FULL DOCS
└── 📄 package.json                    (unchanged)
```

---

## 🎯 STEP-BY-STEP: Where to Find Each Feature

### **Step 1: Find CRM Service Code**
1. Open VS Code
2. Press `Ctrl + K, Ctrl + O` (Open Folder)
3. Navigate to: `src/lib/crm/`
4. You'll see 6 files with CRM logic

### **Step 2: Find CRM API Routes**
1. In VS Code, press `Ctrl + P`
2. Type: `src/app/api/crm`
3. Browse the 3 endpoint files

### **Step 3: Find Database Tables**
1. Open: `src/db/schema.ts`
2. Search: `crmSyncLogs`, `enquiries`, `ownerMemberships`
3. View new tables and extended fields

### **Step 4: Find Configuration**
1. Open: `.env`
2. Scroll to bottom
3. Find `# CRM Integration (TreadSoft)` section

### **Step 5: See Auto-Sync in Action**
1. Terminal with `npm run dev` running
2. Register as owner at http://localhost:3000/owner/register
3. Watch console output for `[Mock CRM]` messages

### **Step 6: Find Documentation**
1. Open: `CRM_INTEGRATION_QUICK_START.md`
2. Or: `CRM_INTEGRATION_DOCUMENTATION.md`
3. Read sections for details

---

## 🧪 TESTING CHECKLIST

✅ **Test Auto-Sync on Registration:**
- [ ] Go to http://localhost:3000/owner/register
- [ ] Register with test email
- [ ] Check console for `[Mock CRM]` logs
- [ ] Check DB: `SELECT crm_id FROM user WHERE email = 'test@example.com';`

✅ **Test Auto-Sync on Profile Update:**
- [ ] Login as owner
- [ ] Go to profile settings
- [ ] Change name/phone
- [ ] Check console for sync message
- [ ] Query: `SELECT * FROM crm_sync_logs WHERE action = 'update' LIMIT 1;`

✅ **Test Manual Sync Endpoint:**
- [ ] Use Postman or curl
- [ ] POST to `/api/crm/sync/owner`
- [ ] Check response status

✅ **Test Sync Logs:**
- [ ] Query: `SELECT COUNT(*) as sync_count FROM crm_sync_logs;`
- [ ] Should show operations

---

## 🎉 YOU NOW KNOW WHERE EVERYTHING IS!

**Summary:**
- **Code**: `src/lib/crm/` and `src/app/api/crm/`
- **Database**: `src/db/schema.ts` and new tables
- **Config**: `.env` file
- **Docs**: `CRM_INTEGRATION_*.md` files
- **Logs**: Terminal + `crm_sync_logs` table
- **Live**: http://localhost:3000

**Next:** Update with real TreadSoft credentials and set `CRM_ENABLED=true`!
