# Owner Dashboard - Quick Reference Guide

## 🚀 Quick Start

### Prerequisites
- User account with `role = 'owner'`
- At least one property linked to owner via `ownerId` field
- Valid authentication session

### Essential Endpoints

```bash
# Dashboard Overview
GET /api/owner/dashboard

# List Properties
GET /api/owner/properties

# View Statistics
GET /api/owner/stats

# View Enquiries
GET /api/owner/enquiries
```

---

## 📋 Common Operations

### 1. Create Complete Property Listing

```javascript
// Step 1: Create property
const property = await fetch('/api/owner/properties', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Luxury Villa',
    location: 'Brighton',
    region: 'South East',
    sleepsMin: 8,
    sleepsMax: 12,
    bedrooms: 5,
    bathrooms: 3,
    priceFromMidweek: 450,
    priceFromWeekend: 650,
    description: 'Beautiful villa with sea views...',
    heroImage: 'https://...'
  })
});

// Step 2: Add amenities
await fetch(`/api/owner/properties/${propertyId}/features`, {
  method: 'POST',
  body: JSON.stringify({
    features: ['WiFi', 'Pool', 'Hot Tub', 'Parking', 'BBQ', 'Garden']
  })
});

// Step 3: Add gallery images
await fetch(`/api/owner/properties/${propertyId}/images`, {
  method: 'POST',
  body: JSON.stringify({
    images: [
      { imageURL: 'url1', caption: 'Living Room' },
      { imageURL: 'url2', caption: 'Kitchen' }
    ]
  })
});

// Step 4: Setup pricing
await fetch(`/api/owner/properties/${propertyId}/pricing/seasonal`, {
  method: 'POST',
  body: JSON.stringify({
    name: 'Summer Peak',
    seasonType: 'peak',
    startDate: '01/06/2025',
    endDate: '31/08/2025',
    pricePerNight: 850,
    minimumStay: 7
  })
});
```

### 2. Update Property Status

```javascript
// Publish property
await fetch(`/api/owner/properties/${propertyId}`, {
  method: 'PUT',
  body: JSON.stringify({
    isPublished: true
  })
});

// Unpublish property
await fetch(`/api/owner/properties/${propertyId}`, {
  method: 'PUT',
  body: JSON.stringify({
    isPublished: false
  })
});
```

### 3. Manage Enquiries

```javascript
// Get new enquiries
const response = await fetch('/api/owner/enquiries?status=new');

// Respond to enquiry
await fetch('/api/owner/enquiries', {
  method: 'POST',
  body: JSON.stringify({
    enquiryId: 'gen_123',
    notes: 'Thank you for your enquiry. Property is available.',
    status: 'in_progress'
  })
});
```

---

## 🔑 API Quick Reference

### Properties

| Action | Endpoint | Method |
|--------|----------|--------|
| List all | `/api/owner/properties` | GET |
| Create | `/api/owner/properties` | POST |
| Get details | `/api/owner/properties/[id]` | GET |
| Update | `/api/owner/properties/[id]` | PUT |
| Delete | `/api/owner/properties/[id]` | DELETE |

### Features/Amenities

| Action | Endpoint | Method |
|--------|----------|--------|
| List | `/api/owner/properties/[id]/features` | GET |
| Add (bulk) | `/api/owner/properties/[id]/features` | POST |
| Delete | `/api/owner/properties/[id]/features?featureId=X` | DELETE |

### Images

| Action | Endpoint | Method |
|--------|----------|--------|
| List | `/api/owner/properties/[id]/images` | GET |
| Add (bulk) | `/api/owner/properties/[id]/images` | POST |
| Reorder | `/api/owner/properties/[id]/images` | PUT |
| Delete | `/api/owner/properties/[id]/images?imageId=X` | DELETE |

### Pricing

| Action | Endpoint | Method |
|--------|----------|--------|
| Get all | `/api/owner/properties/[id]/pricing` | GET |
| Add seasonal | `/api/owner/properties/[id]/pricing/seasonal` | POST |
| Update seasonal | `/api/owner/properties/[id]/pricing/seasonal/[ruleId]` | PUT |
| Delete seasonal | `/api/owner/properties/[id]/pricing/seasonal/[ruleId]` | DELETE |
| Add special | `/api/owner/properties/[id]/pricing/special` | POST |
| Update special | `/api/owner/properties/[id]/pricing/special/[ruleId]` | PUT |
| Delete special | `/api/owner/properties/[id]/pricing/special/[ruleId]` | DELETE |

### Enquiries

| Action | Endpoint | Method |
|--------|----------|--------|
| List | `/api/owner/enquiries` | GET |
| Update/respond | `/api/owner/enquiries` | POST |

---

## 🎨 Data Formats

### Dates
All dates use UK format: **DD/MM/YYYY**

```javascript
"startDate": "25/12/2025"
"createdAt": "17/12/2025 14:30:15"
```

### Status Values

**Property:**
- Published: `isPublished: true/false`

**Enquiries:**
- `new` - Just received
- `in_progress` - Being handled
- `resolved` - Completed successfully
- `closed` - Closed without resolution

**Priority:**
- `low`, `medium`, `high`, `urgent`

### Season Types
- `peak` - Highest demand
- `high` - High demand
- `mid` - Medium demand
- `low` - Lower demand
- `off-peak` - Lowest demand

### Day Types
- `weekday` - Monday-Thursday
- `weekend` - Friday-Sunday
- `any` - All days

---

## ✅ Validation Rules

### Property
- Title: 5-200 characters
- Description: 50-5000 characters
- Sleeps: 1-100
- Bedrooms/Bathrooms: 1-50
- Prices: 0-100,000

### Features
- Name: 2-100 characters
- Max 50 features per bulk operation

### Images
- Valid URL required
- Caption: max 200 characters
- Max 30 images per bulk operation

### Pricing
- Price: 0-100,000
- Minimum stay: 1-365 nights
- Date format: DD/MM/YYYY
- End date must be after start date

---

## 🔒 Security & Permissions

### Authentication Required
All endpoints require valid session with `role = 'owner'`

### Ownership Verification
- Owners can only access their own properties
- All property operations verify `ownerId = session.user.id`
- Admins bypass ownership checks (see all properties)

### Subscription Limits

| Plan | Max Properties |
|------|----------------|
| Free | 1 |
| Basic | 3 |
| Premium | 10 |
| Enterprise | 100 |

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "timestamp": "17/12/2025 14:30:15"
}
```

### Error Response
```json
{
  "error": "Error message",
  "errors": {
    "field": ["Error 1", "Error 2"]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🐛 Troubleshooting

### Common Errors

**"Unauthorized" (401)**
- Not logged in or session expired
- Solution: Re-authenticate

**"Access denied. Owner role required" (403)**
- User doesn't have owner role
- Solution: Upgrade account to owner

**"Property not found or access denied" (404)**
- Property doesn't exist or doesn't belong to user
- Solution: Verify property ID and ownership

**"Validation failed" (400)**
- Invalid data format
- Solution: Check `errors` object and fix fields

**"Your plan allows up to X properties"**
- Reached subscription limit
- Solution: Upgrade subscription

---

## 🔍 Querying & Filtering

### Properties
```
GET /api/owner/properties?status=active&limit=20&offset=0
```

### Enquiries
```
GET /api/owner/enquiries?status=new&propertyId=123&includeResolved=false
```

### Bookings
```
GET /api/owner/bookings?limit=10
```

---

## 📝 Best Practices

### 1. Property Creation Flow
1. Create property with basic info
2. Add all features/amenities
3. Upload and order images
4. Configure pricing rules
5. Publish when ready

### 2. Image Management
- Use hero image for main property photo
- Keep gallery images well-captioned
- Maintain logical order (exterior → interior → amenities)
- Max 30 images per property

### 3. Pricing Strategy
- Set competitive base prices
- Use seasonal pricing for peak periods
- Add special pricing for holidays/events
- Higher priority = applied first

### 4. Enquiry Management
- Check dashboard daily for new enquiries
- Respond within 24 hours
- Update status as you progress
- Add detailed notes for tracking

---

## 📦 File Locations

```
src/
├── app/api/owner/
│   ├── properties/
│   │   ├── route.ts                    # List/Create properties
│   │   └── [id]/
│   │       ├── route.ts                # Get/Update/Delete property
│   │       ├── features/route.ts       # Manage features
│   │       ├── images/route.ts         # Manage images
│   │       └── pricing/
│   │           ├── route.ts            # Get all pricing
│   │           ├── seasonal/[ruleId]/route.ts
│   │           └── special/[ruleId]/route.ts
│   ├── enquiries/route.ts              # List/Update enquiries
│   ├── dashboard/route.ts              # Dashboard summary
│   ├── stats/route.ts                  # Statistics
│   ├── bookings/route.ts               # Bookings list
│   └── media/route.ts                  # Media management
├── lib/
│   ├── validations/
│   │   └── property-validations.ts    # Validation schemas
│   ├── auth-roles.ts                  # Role-based auth
│   ├── audit-logger.ts                # Audit logging
│   └── owner-metrics.ts               # Metrics calculations
└── db/
    └── schema.ts                       # Database models
```

---

## 🚦 Testing Checklist

- [ ] Create property
- [ ] Update property
- [ ] Publish/unpublish
- [ ] Add features (single + bulk)
- [ ] Add images (single + bulk)
- [ ] Reorder images
- [ ] Create seasonal pricing
- [ ] Create special pricing
- [ ] View enquiries
- [ ] Respond to enquiry
- [ ] View dashboard stats
- [ ] View bookings
- [ ] Test ownership restrictions
- [ ] Test validation errors

---

## 📚 Additional Resources

- [Full Documentation](OWNER_DASHBOARD_COMPLETE.md)
- [Database Schema](src/db/schema.ts)
- [Validation Library](src/lib/validations/property-validations.ts)
- [Auth & Roles](src/lib/auth-roles.ts)

---

## 💡 Tips

1. **Bulk Operations** - Use bulk endpoints for adding multiple features/images at once
2. **Audit Trail** - All actions are logged for compliance and debugging
3. **Date Format** - Always use DD/MM/YYYY format for consistency
4. **Ownership** - Property operations automatically filter by owner
5. **Validation** - Check validation errors carefully - they provide specific field issues

---

**Last Updated:** 17/12/2025  
**Version:** 1.0
