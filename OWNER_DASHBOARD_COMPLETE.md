# Owner Dashboard - Core System Documentation

## Overview

The Owner Dashboard is a comprehensive property management system that enables property owners to manage their listings, media, pricing, amenities, and enquiries. The system includes role-based access control, audit logging, and validation.

---

## Table of Contents

1. [Database Models](#database-models)
2. [API Routes](#api-routes)
3. [Validation & Permissions](#validation--permissions)
4. [Authentication & Authorization](#authentication--authorization)
5. [Usage Examples](#usage-examples)
6. [Testing Guide](#testing-guide)

---

## Database Models

### Properties Table (`properties`)

Core property information with owner relationship.

**Key Fields:**
- `id` - Primary key
- `ownerId` - Foreign key to `user.id` (owner of the property)
- `title` - Property name
- `slug` - URL-friendly identifier
- `location` / `region` - Geographic information
- `sleepsMin` / `sleepsMax` - Guest capacity
- `bedrooms` / `bathrooms` - Property specs
- `priceFromMidweek` / `priceFromWeekend` - Base pricing
- `description` - Property description
- `heroImage` / `heroVideo` - Main media
- `isPublished` - Visibility status
- `featured` - Featured property flag

### Property Features Table (`propertyFeatures`)

Amenities and facilities for each property.

**Key Fields:**
- `id` - Primary key
- `propertyId` - Foreign key to `properties.id`
- `featureName` - Feature/amenity name (e.g., "WiFi", "Pool", "Hot Tub")

### Property Images Table (`propertyImages`)

Additional images for property galleries.

**Key Fields:**
- `id` - Primary key
- `propertyId` - Foreign key to `properties.id`
- `imageURL` - Image URL
- `caption` - Optional image caption
- `orderIndex` - Display order

### Seasonal Pricing Table (`seasonalPricing`)

Date-range based pricing rules.

**Key Fields:**
- `id` - Primary key
- `propertyId` - Foreign key to `properties.id`
- `name` - Rule name (e.g., "Summer Peak")
- `seasonType` - 'peak', 'high', 'mid', 'low', 'off-peak'
- `startDate` / `endDate` - Date range (DD/MM/YYYY)
- `pricePerNight` - Nightly rate
- `dayType` - 'weekday', 'weekend', 'any'
- `minimumStay` - Minimum nights required
- `priority` - Rule precedence

### Special Date Pricing Table (`specialDatePricing`)

Specific date pricing (holidays, events).

**Key Fields:**
- `id` - Primary key
- `propertyId` - Foreign key to `properties.id`
- `name` - Event name (e.g., "Christmas Week")
- `date` - Specific date (DD/MM/YYYY)
- `endDate` - Optional end date for multi-day events
- `pricePerNight` - Nightly rate
- `isAvailable` - Availability flag

### Enquiries Tables (`enquiries` & `crmEnquiries`)

Customer enquiries for properties.

**Key Fields:**
- `id` - Primary key
- `propertyId` - Related property
- `ownerId` - Related owner (CRM only)
- `status` - 'new', 'in_progress', 'resolved', 'closed'
- `priority` - 'low', 'medium', 'high', 'urgent'
- `guestName` / `guestEmail` / `guestPhone` - Contact info
- `message` - Enquiry message

---

## API Routes

### Property Management

#### List Owner's Properties
```
GET /api/owner/properties
```

**Query Parameters:**
- `status` - Filter by active/draft (optional)
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "properties": [...],
  "pagination": {
    "total": 10,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "timestamp": "17/12/2025 14:30:15"
}
```

#### Create Property
```
POST /api/owner/properties
```

**Request Body:**
```json
{
  "title": "Luxury Coastal Villa",
  "location": "Brighton",
  "region": "South East",
  "sleepsMin": 8,
  "sleepsMax": 12,
  "bedrooms": 5,
  "bathrooms": 3,
  "priceFromMidweek": 450,
  "priceFromWeekend": 650,
  "description": "Beautiful villa with sea views...",
  "heroImage": "https://example.com/image.jpg"
}
```

#### Get Single Property
```
GET /api/owner/properties/[id]
```

#### Update Property
```
PUT /api/owner/properties/[id]
```

**Request Body:** (partial updates supported)
```json
{
  "title": "Updated Title",
  "priceFromWeekend": 700,
  "isPublished": true
}
```

#### Delete Property
```
DELETE /api/owner/properties/[id]
```

---

### Property Features/Amenities

#### List Features
```
GET /api/owner/properties/[id]/features
```

**Response:**
```json
{
  "success": true,
  "propertyId": 123,
  "propertyTitle": "Luxury Villa",
  "features": [
    {
      "id": 1,
      "name": "WiFi",
      "createdAt": "17/12/2025 10:00:00"
    },
    {
      "id": 2,
      "name": "Swimming Pool",
      "createdAt": "17/12/2025 10:00:00"
    }
  ],
  "total": 2
}
```

#### Add Features (Single or Bulk)
```
POST /api/owner/properties/[id]/features
```

**Single Feature:**
```json
{
  "featureName": "Hot Tub"
}
```

**Bulk Features:**
```json
{
  "features": ["WiFi", "Pool", "Parking", "Hot Tub", "Garden"]
}
```

#### Delete Feature
```
DELETE /api/owner/properties/[id]/features?featureId=123
```

---

### Property Images

#### List Images
```
GET /api/owner/properties/[id]/images
```

**Response:**
```json
{
  "success": true,
  "propertyId": 123,
  "heroImage": "https://...",
  "images": [
    {
      "id": 1,
      "url": "https://...",
      "caption": "Living Room",
      "order": 0
    }
  ]
}
```

#### Add Images (Single or Bulk)
```
POST /api/owner/properties/[id]/images
```

**Single Image:**
```json
{
  "imageURL": "https://example.com/image.jpg",
  "caption": "Master Bedroom",
  "orderIndex": 5
}
```

**Bulk Images:**
```json
{
  "images": [
    {
      "imageURL": "https://example.com/img1.jpg",
      "caption": "Kitchen"
    },
    {
      "imageURL": "https://example.com/img2.jpg",
      "caption": "Bathroom"
    }
  ]
}
```

#### Reorder Images
```
PUT /api/owner/properties/[id]/images
```

**Request Body:**
```json
{
  "action": "reorder",
  "imageIds": [3, 1, 2, 4]
}
```

#### Update Image Caption
```
PUT /api/owner/properties/[id]/images
```

**Request Body:**
```json
{
  "imageId": 123,
  "caption": "Updated caption"
}
```

#### Delete Images
```
DELETE /api/owner/properties/[id]/images?imageId=123
DELETE /api/owner/properties/[id]/images?imageIds=1,2,3
```

---

### Pricing Management

#### Get All Pricing Rules
```
GET /api/owner/properties/[id]/pricing
```

**Response:**
```json
{
  "success": true,
  "propertyId": 123,
  "basePrice": {
    "midweek": 450,
    "weekend": 650
  },
  "seasonal": [
    {
      "id": 1,
      "name": "Summer Peak",
      "seasonType": "peak",
      "startDate": "01/06/2025",
      "endDate": "31/08/2025",
      "pricePerNight": 800,
      "minimumStay": 7,
      "dayType": "any",
      "isActive": true,
      "priority": 10
    }
  ],
  "special": [
    {
      "id": 1,
      "name": "Christmas Week",
      "date": "25/12/2025",
      "endDate": "01/01/2026",
      "pricePerNight": 1200,
      "minimumStay": 5,
      "isAvailable": true
    }
  ]
}
```

#### Create Seasonal Pricing
```
POST /api/owner/properties/[id]/pricing/seasonal
```

**Request Body:**
```json
{
  "name": "Summer Peak Season",
  "seasonType": "peak",
  "startDate": "01/06/2025",
  "endDate": "31/08/2025",
  "pricePerNight": 800,
  "minimumStay": 7,
  "dayType": "weekend",
  "priority": 10
}
```

#### Update Seasonal Pricing
```
PUT /api/owner/properties/[id]/pricing/seasonal/[ruleId]
```

#### Delete Seasonal Pricing
```
DELETE /api/owner/properties/[id]/pricing/seasonal/[ruleId]
```

#### Create Special Date Pricing
```
POST /api/owner/properties/[id]/pricing/special
```

**Request Body:**
```json
{
  "name": "New Year's Eve",
  "date": "31/12/2025",
  "endDate": "02/01/2026",
  "pricePerNight": 1500,
  "minimumStay": 3,
  "isAvailable": true
}
```

#### Update Special Date Pricing
```
PUT /api/owner/properties/[id]/pricing/special/[ruleId]
```

#### Delete Special Date Pricing
```
DELETE /api/owner/properties/[id]/pricing/special/[ruleId]
```

---

### Enquiries Management

#### List Owner's Enquiries
```
GET /api/owner/enquiries
```

**Query Parameters:**
- `status` - Filter by status (optional)
- `propertyId` - Filter by property (optional)
- `includeResolved` - Include resolved/closed (default: false)
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "enquiries": [
    {
      "id": "gen_123",
      "source": "general",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+44 1234 567890",
      "subject": "Booking Enquiry",
      "message": "I'd like to book...",
      "status": "new",
      "priority": "high",
      "propertyId": 5,
      "checkInDate": "15/01/2026",
      "checkOutDate": "22/01/2026",
      "numberOfGuests": 8,
      "createdAt": "17/12/2025 10:00:00"
    }
  ],
  "statusCounts": {
    "new": 5,
    "in_progress": 3,
    "resolved": 10,
    "closed": 2
  },
  "properties": [
    {
      "id": 5,
      "title": "Luxury Villa",
      "location": "Brighton"
    }
  ]
}
```

#### Update Enquiry / Add Notes
```
POST /api/owner/enquiries
```

**Request Body:**
```json
{
  "enquiryId": "gen_123",
  "notes": "Owner response: Available for those dates",
  "status": "in_progress"
}
```

---

### Dashboard Summary

#### Get Dashboard Overview
```
GET /api/owner/dashboard
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "Owner Name",
    "email": "owner@example.com",
    "role": "owner"
  },
  "quickStats": {
    "totalProperties": 5,
    "publishedProperties": 4,
    "totalEnquiries": 25,
    "newEnquiriesToday": 3,
    "estimatedRevenue": 45000
  },
  "recentProperties": [...],
  "recentActivity": [...],
  "alerts": [...]
}
```

---

### Statistics & Metrics

#### Get Owner Stats
```
GET /api/owner/stats
```

**Response:**
```json
{
  "totalBookings": 45,
  "bookingsGrowth": "+12.5%",
  "activeProperties": 4,
  "revenue": 125000,
  "revenueGrowth": "+8.3%",
  "upcomingCheckIns": 7
}
```

#### Get Owner Bookings
```
GET /api/owner/bookings?limit=10
```

---

## Validation & Permissions

### Validation Library

Located at: [src/lib/validations/property-validations.ts](src/lib/validations/property-validations.ts)

#### Available Schemas

1. **propertySchema** - Full property validation
2. **propertyUpdateSchema** - Partial property updates
3. **propertyFeatureSchema** - Single feature validation
4. **bulkFeaturesSchema** - Multiple features (1-50)
5. **propertyImageSchema** - Single image validation
6. **bulkImagesSchema** - Multiple images (1-30)
7. **reorderImagesSchema** - Image reordering
8. **seasonalPricingSchema** - Seasonal pricing rules
9. **specialDatePricingSchema** - Special date pricing

#### Usage Example

```typescript
import { validateSchema, propertySchema } from '@/lib/validations/property-validations';

const validation = validateSchema(propertySchema, requestData);

if (!validation.success) {
  return NextResponse.json(
    { error: 'Validation failed', errors: validation.errors },
    { status: 400 }
  );
}

// Use validation.data (type-safe)
const property = await db.insert(properties).values(validation.data);
```

#### Helper Functions

- `validateOwnership(propertyOwnerId, userId, isAdmin)` - Verify property ownership
- `canCreateProperty(currentCount, tier)` - Check subscription limits
- `validateDateRange(startDate, endDate)` - Validate date ranges

---

## Authentication & Authorization

### Role-Based Access Control

All Owner Dashboard routes require:
1. **Authentication** - Valid session with authenticated user
2. **Owner Role** - User must have role = 'owner'
3. **Ownership Verification** - User must own the property being accessed

### Auth Implementation

```typescript
const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

if ((session.user as any).role !== 'owner') {
  return NextResponse.json(
    { error: 'Access denied. Owner role required.' },
    { status: 403 }
  );
}

// Verify property ownership
const property = await db
  .select()
  .from(properties)
  .where(
    and(
      eq(properties.id, propertyId),
      eq(properties.ownerId, session.user.id)
    )
  )
  .limit(1);

if (!property || property.length === 0) {
  return NextResponse.json(
    { error: 'Property not found or access denied' },
    { status: 404 }
  );
}
```

### Audit Logging

All property operations are logged using the audit logger:

```typescript
import { logPropertyAction, captureRequestDetails } from '@/lib/audit-logger';

await logPropertyAction(
  session.user.id,
  'property.create',
  propertyId,
  propertyTitle,
  {
    ...changeDetails,
    ...captureRequestDetails(request)
  }
);
```

---

## Usage Examples

### Example 1: Create Property with Features and Images

```javascript
// 1. Create property
const propertyResponse = await fetch('/api/owner/properties', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Seaside Villa',
    location: 'Brighton',
    region: 'South East',
    sleepsMin: 8,
    sleepsMax: 10,
    bedrooms: 4,
    bathrooms: 3,
    priceFromMidweek: 400,
    priceFromWeekend: 600,
    description: 'Beautiful villa...',
    heroImage: 'https://...'
  })
});

const { property } = await propertyResponse.json();

// 2. Add features
await fetch(`/api/owner/properties/${property.id}/features`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    features: ['WiFi', 'Pool', 'Hot Tub', 'Parking', 'Sea View']
  })
});

// 3. Add images
await fetch(`/api/owner/properties/${property.id}/images`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    images: [
      { imageURL: 'https://...img1.jpg', caption: 'Living Room' },
      { imageURL: 'https://...img2.jpg', caption: 'Kitchen' },
      { imageURL: 'https://...img3.jpg', caption: 'Master Bedroom' }
    ]
  })
});
```

### Example 2: Setup Seasonal Pricing

```javascript
const propertyId = 123;

// Summer peak season
await fetch(`/api/owner/properties/${propertyId}/pricing/seasonal`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Summer Peak',
    seasonType: 'peak',
    startDate: '01/06/2025',
    endDate: '31/08/2025',
    pricePerNight: 850,
    minimumStay: 7,
    dayType: 'any',
    priority: 10
  })
});

// Christmas special pricing
await fetch(`/api/owner/properties/${propertyId}/pricing/special`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Christmas & New Year',
    date: '24/12/2025',
    endDate: '02/01/2026',
    pricePerNight: 1200,
    minimumStay: 5
  })
});
```

### Example 3: Manage Enquiries

```javascript
// Get all enquiries
const enquiriesResponse = await fetch('/api/owner/enquiries?status=new');
const { enquiries } = await enquiriesResponse.json();

// Respond to enquiry
await fetch('/api/owner/enquiries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    enquiryId: enquiries[0].id,
    notes: 'Property is available for your dates. Deposit required.',
    status: 'in_progress'
  })
});
```

---

## Testing Guide

### Manual Testing Checklist

#### Property Management
- [ ] Create a new property
- [ ] Update property details
- [ ] Publish/unpublish property
- [ ] Delete property
- [ ] Verify non-owners cannot access properties

#### Features
- [ ] Add single feature
- [ ] Add bulk features
- [ ] List all features
- [ ] Delete feature

#### Images
- [ ] Add single image
- [ ] Add bulk images
- [ ] Update image caption
- [ ] Reorder images
- [ ] Delete single image
- [ ] Delete multiple images

#### Pricing
- [ ] Create seasonal pricing rule
- [ ] Update seasonal pricing
- [ ] Delete seasonal pricing
- [ ] Create special date pricing
- [ ] Update special date pricing
- [ ] Validate date ranges

#### Enquiries
- [ ] View all enquiries
- [ ] Filter by status
- [ ] Filter by property
- [ ] Add response/notes
- [ ] Update enquiry status

### API Testing with curl

```bash
# Get auth token first, then use in subsequent requests

# List properties
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/owner/properties

# Create property
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Property","location":"London",...}' \
  http://localhost:3000/api/owner/properties

# Add features
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"features":["WiFi","Pool"]}' \
  http://localhost:3000/api/owner/properties/123/features
```

---

## Subscription Limits

Property creation is limited by subscription tier:

| Tier | Max Properties |
|------|----------------|
| Free | 1 |
| Basic | 3 |
| Premium | 10 |
| Enterprise | 100 |

Limits enforced by `canCreateProperty()` validation function.

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Error message",
  "errors": {
    "fieldName": ["Validation error 1", "Validation error 2"]
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (wrong role or not property owner)
- `404` - Not Found
- `500` - Internal Server Error

---

## Support & Troubleshooting

### Common Issues

**"Property not found or access denied"**
- Verify the property ID is correct
- Ensure the authenticated user owns the property
- Check that the property hasn't been deleted

**"Validation failed"**
- Review the `errors` object in the response
- Ensure all required fields are provided
- Check data types and formats (especially dates: DD/MM/YYYY)

**"Your plan allows up to X properties"**
- User has reached subscription limit
- Upgrade subscription to add more properties

### Audit Trail

All actions are logged with:
- User ID
- Action type
- Property ID and title
- IP address and user agent
- Timestamp (UK format)
- Change details

Access logs via audit logger or database queries on `crmActivityLog` table.

---

## Next Steps

1. **Frontend Integration** - Build React/Next.js components for dashboard
2. **Media Upload** - Implement direct uploads to Supabase/S3
3. **Calendar Integration** - Sync with external calendars (iCal)
4. **Analytics** - Enhanced performance stats and charts
5. **Notifications** - Email alerts for new enquiries
6. **Mobile App** - React Native owner dashboard app

---

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/owner/properties` | GET | List owner's properties |
| `/api/owner/properties` | POST | Create property |
| `/api/owner/properties/[id]` | GET | Get property details |
| `/api/owner/properties/[id]` | PUT | Update property |
| `/api/owner/properties/[id]` | DELETE | Delete property |
| `/api/owner/properties/[id]/features` | GET | List features |
| `/api/owner/properties/[id]/features` | POST | Add features |
| `/api/owner/properties/[id]/features` | DELETE | Delete features |
| `/api/owner/properties/[id]/images` | GET | List images |
| `/api/owner/properties/[id]/images` | POST | Add images |
| `/api/owner/properties/[id]/images` | PUT | Update/reorder images |
| `/api/owner/properties/[id]/images` | DELETE | Delete images |
| `/api/owner/properties/[id]/pricing` | GET | Get all pricing rules |
| `/api/owner/properties/[id]/pricing/seasonal` | POST | Create seasonal pricing |
| `/api/owner/properties/[id]/pricing/seasonal/[ruleId]` | PUT | Update seasonal pricing |
| `/api/owner/properties/[id]/pricing/seasonal/[ruleId]` | DELETE | Delete seasonal pricing |
| `/api/owner/properties/[id]/pricing/special` | POST | Create special pricing |
| `/api/owner/properties/[id]/pricing/special/[ruleId]` | PUT | Update special pricing |
| `/api/owner/properties/[id]/pricing/special/[ruleId]` | DELETE | Delete special pricing |
| `/api/owner/enquiries` | GET | List enquiries |
| `/api/owner/enquiries` | POST | Update enquiry |
| `/api/owner/dashboard` | GET | Dashboard summary |
| `/api/owner/stats` | GET | Statistics |
| `/api/owner/bookings` | GET | Bookings list |
| `/api/owner/media` | POST | Media operations |

---

**Documentation Version:** 1.0  
**Last Updated:** 17/12/2025  
**Author:** GitHub Copilot
