# Milestone 9: Quick Reference Guide

**UK Timestamp Format:** DD/MM/YYYY HH:mm:ss  
**Example:** "Received: 03/11/2025 09:33:10"  
**Status:** Production Ready ✅

---

## 🚀 Quick Start

### Submit Public Enquiry (No Auth)
```javascript
POST /api/enquiries
{
  "action": "create-public",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "subject": "Booking Enquiry",
  "message": "I would like to book...",
  "enquiryType": "booking",
  "checkInDate": "01/07/2025",
  "checkOutDate": "08/07/2025"
}
```

### Get Urgent Enquiries (Admin)
```javascript
GET /api/enquiries?action=urgent&limit=10
```

### Get Property Performance (Owner/Admin)
```javascript
GET /api/performance-stats?action=property&propertyId=123&period=monthly
```

### Compare Performance (Owner/Admin)
```javascript
GET /api/performance-stats?action=compare&entityType=property&entityId=123&period=monthly
```

---

## 📝 Enquiries

### Types (5)
- `general` - General enquiries
- `booking` - Booking requests
- `property` - Property questions
- `partnership` - Partnership opportunities
- `support` - Technical support

### Statuses (5)
- `new` - Just received
- `in_progress` - Being handled
- `resolved` - Successfully resolved
- `closed` - Closed/archived
- `spam` - Marked as spam

### Priorities (4)
- `low` - Can wait
- `medium` - Standard
- `high` - Needs attention
- `urgent` - Immediate action

### Sources (4)
- `website` - Website form
- `email` - Direct email
- `phone` - Phone enquiry
- `social` - Social media

---

## 📊 Performance Metrics (40+)

### Traffic (4)
- Page views
- Unique visitors
- Avg session duration
- Bounce rate

### Enquiries (6)
- Total enquiries
- New / In-progress / Resolved
- Avg response time
- Conversion rate

### Bookings (7)
- Total / Confirmed / Cancelled / Pending
- Total revenue
- Avg booking value
- Occupancy rate

### Guests (3)
- Total guests
- Returning guests
- Avg guests per booking

### Ratings (7)
- Total reviews
- Avg rating (0-5)
- 5/4/3/2/1-star counts

### Financial (4)
- Deposits paid
- Balances paid
- Pending payments
- Refunds issued

### Marketing (5)
- Emails sent/opened/clicked
- Open rate
- Click rate

---

## 🔌 API Endpoints

### Enquiries (`/api/enquiries`)

#### GET Actions
```javascript
?action=list              // List all (with filters)
?action=get&id=123        // Get by ID
?action=stats             // Get statistics
?action=count-by-status   // Count by status
?action=unassigned        // Unassigned enquiries
?action=urgent            // Urgent enquiries
?action=recent            // Recent enquiries
?action=search&q=beach    // Search enquiries
```

#### POST Actions
```javascript
{ "action": "create-public" }     // Public enquiry
{ "action": "create" }            // Admin create
{ "action": "update" }            // Update enquiry
{ "action": "assign" }            // Assign to user
{ "action": "respond" }           // Mark responded
{ "action": "resolve" }           // Resolve
{ "action": "close" }             // Close
{ "action": "mark-spam" }         // Mark spam
{ "action": "delete" }            // Delete
{ "action": "generate-response" } // Generate template
```

### Performance Stats (`/api/performance-stats`)

#### GET Actions
```javascript
?action=list              // List all stats
?action=latest            // Latest stats
?action=property          // Property stats (live)
?action=owner             // Owner stats (live)
?action=platform          // Platform stats (admin)
?action=compare           // Compare periods
?action=time-series       // Time-series data
```

#### POST Actions
```javascript
{ "action": "save" }               // Save manually
{ "action": "calculate-property" } // Calculate property
{ "action": "calculate-owner" }    // Calculate owner
{ "action": "calculate-platform" } // Calculate platform
{ "action": "calculate-all" }      // Calculate all
```

---

## 📧 Response Templates (4)

### booking_received
```
Dear {firstName},
Thank you for your enquiry about {propertyName}...
Received: {receivedAt}
```

### booking_confirmed
```
Dear {firstName},
Your booking at {propertyName} has been confirmed.
Check-in: {checkInDate}
Check-out: {checkOutDate}
```

### general_response
```
Dear {firstName},
Thank you for contacting Escape Houses...
Enquiry received: {receivedAt}
```

### property_info
```
Dear {firstName},
Thank you for your interest in {propertyName}...
```

---

## 💡 Common Use Cases

### 1. Handle Booking Enquiry
```javascript
// Guest submits (public)
POST /api/enquiries
{
  "action": "create-public",
  "firstName": "John",
  "email": "john@example.com",
  "subject": "Summer Booking",
  "enquiryType": "booking",
  "checkInDate": "01/07/2025",
  "checkOutDate": "08/07/2025"
}
// → Created: 03/11/2025 09:33:10

// Admin assigns
POST /api/enquiries
{
  "action": "assign",
  "enquiryId": 123,
  "assignedTo": "user-456"
}

// Staff responds
POST /api/enquiries
{
  "action": "respond",
  "enquiryId": 123,
  "respondedBy": "user-456",
  "responseTemplate": "booking_received"
}
// → Responded: 03/11/2025 10:15:00

// Resolve
POST /api/enquiries
{ "action": "resolve", "enquiryId": 123 }
// → Resolved: 03/11/2025 14:30:00
```

### 2. Monthly Performance Review
```javascript
// Get owner stats
GET /api/performance-stats?action=owner&ownerId=user-123&period=monthly

// Compare with previous month
GET /api/performance-stats?action=compare&entityType=owner&entityId=user-123&period=monthly

// Get 12-month trend
GET /api/performance-stats?action=time-series&entityType=owner&entityId=user-123&period=monthly&points=12
```

### 3. Dashboard Analytics
```javascript
// Property performance
const propertyStats = await fetch(
  '/api/performance-stats?action=property&propertyId=123&period=monthly'
).then(r => r.json());

console.log(`Bookings: ${propertyStats.metrics.confirmedBookings}`);
console.log(`Revenue: £${propertyStats.metrics.totalRevenue}`);
console.log(`Conversion: ${propertyStats.metrics.conversionRate}%`);
```

### 4. Enquiry Dashboard
```javascript
// Get urgent enquiries
const urgent = await fetch('/api/enquiries?action=urgent&limit=10')
  .then(r => r.json());

// Get stats
const stats = await fetch('/api/enquiries?action=stats')
  .then(r => r.json());

console.log(`New: ${stats.stats.new}`);
console.log(`In Progress: ${stats.stats.inProgress}`);
console.log(`Conversion: ${stats.stats.conversionRate}%`);
```

---

## 🧪 Testing

### Run Test Suite
```bash
npx tsx src/lib/test-milestone9.ts
```

### Test Categories (10)
- ✅ UK Timestamp Format
- ✅ Enquiry Types & Statuses
- ✅ Enquiry Data Structure
- ✅ Response Templates
- ✅ Performance Metrics Structure
- ✅ Entity Types & Periods
- ✅ Stats Calculation
- ✅ Performance Comparison
- ✅ Time-Series Data
- ✅ API Endpoints

---

## 🔐 Authorization

### Public Endpoints
- POST `/api/enquiries` (action: `create-public`)

### Admin/Owner Endpoints
- All other enquiry endpoints: **Admin only**
- Property stats: **Owner can view own**
- Owner stats: **Owner can view own**
- Platform stats: **Admin only**

---

## 📁 File Locations

```
src/lib/enquiries.ts                      - Enquiry management
src/lib/performance-stats.ts              - Stats tracking
src/app/api/enquiries/route.ts            - Enquiry API
src/app/api/performance-stats/route.ts    - Stats API
src/lib/test-milestone9.ts                - Test suite
src/db/schema.ts                          - Database schema
```

---

## 📊 UK Timestamp Examples

```
Created: 03/11/2025 09:33:10
Updated: 03/11/2025 10:15:22
Responded: 03/11/2025 11:45:00
Resolved: 03/11/2025 14:30:55

Period: 01/12/2025 – 31/12/2025
Calculated: 01/01/2026 00:15:30
```

---

## 🎯 Next Steps

1. Run test suite: `npx tsx src/lib/test-milestone9.ts`
2. Review complete documentation: `MILESTONE_9_COMPLETE.md`
3. Test API endpoints in Postman/Thunder Client
4. Configure automated stats calculation (cron job)
5. Set up email notifications for urgent enquiries
6. Create admin dashboard for enquiry management

---

**Full Documentation:** [MILESTONE_9_COMPLETE.md](MILESTONE_9_COMPLETE.md)  
**Test Suite:** `src/lib/test-milestone9.ts`  
**Status:** ✅ Production Ready  
**UK Timestamps:** DD/MM/YYYY HH:mm:ss throughout
