# STEP 4: ORCHARDS WEBSITE INTEGRATION - COMPLETE ✅

## 📋 Implementation Summary

This document summarizes the complete implementation of STEP 4, which provides secure, read-only API endpoints for integrating the Orchards Escapes website with the property management system.

**Implementation Date:** 17/12/2025  
**Status:** ✅ Production Ready

---

## 🎯 Requirements Met

### Core Requirements
- ✅ **Property Listings API** - Public read-only access with filtering
- ✅ **Availability API** - Real-time availability checking with pricing
- ✅ **Read-Only Access** - No data modification endpoints
- ✅ **Rate Limiting** - Tiered rate limiting (30/100/300 req/min)
- ✅ **API Key Authentication** - Secure key-based access control
- ✅ **CORS Support** - Restricted to Orchards domains

---

## 🗂️ Files Created

### 1. Rate Limiting Middleware
**File:** `src/lib/rate-limiter.ts`

**Purpose:** Protect public APIs from abuse with tiered rate limiting

**Key Features:**
- In-memory rate limit tracking
- Three tiers: Public (30/min), Authenticated (100/min), Premium (300/min)
- API key validation
- Automatic cleanup of expired records
- Rate limit headers in responses
- Stats endpoint for monitoring

**API Key Tiers:**
```typescript
// Premium (300 req/min) - Orchards Production
orchards_live_key_2025

// Authenticated (100 req/min) - Standard keys
demo_api_key_standard

// Public (30 req/min) - No key required
```

**Usage:**
```typescript
import { rateLimit } from '@/lib/rate-limiter';

export async function GET(request: Request) {
  const rateLimitResult = await rateLimit(request);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      rateLimitResult.errorResponse,
      { status: 429, headers: rateLimitResult.headers }
    );
  }
  // ... rest of handler
}
```

---

### 2. Property Listings API
**File:** `src/app/api/orchards/properties/route.ts`

**Endpoints:**
- `GET /api/orchards/properties` - List all properties with filters
- `POST /api/orchards/properties` - Check availability for multiple properties (quick availability)

**GET Features:**
- Pagination (limit: 1-100, default: 50)
- Filtering by region, guest count, max price, featured status
- Only returns published properties
- Includes basic property info + hero image
- Total count and pagination metadata

**POST Features:**
- Check availability for specific dates
- Validates date format (DD/MM/YYYY)
- Returns quick availability status
- Used for "quick search" on listing pages

**Query Parameters:**
```typescript
limit?: number       // Max results (default: 50, max: 100)
offset?: number      // Pagination offset (default: 0)
region?: string      // e.g., "South East"
minGuests?: number   // Minimum guest capacity
maxPrice?: number    // Maximum price per night
featured?: boolean   // Featured properties only
```

**Response Format:**
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
      "sleepsMin": 8,
      "sleepsMax": 12,
      "bedrooms": 5,
      "bathrooms": 3,
      "priceFromMidweek": 450,
      "priceFromWeekend": 650,
      "description": "...",
      "heroImage": "https://...",
      "featured": true
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "timestamp": "17/12/2025 15:30:00"
}
```

---

### 3. Property Details API
**File:** `src/app/api/orchards/properties/[id]/route.ts`

**Endpoint:**
- `GET /api/orchards/properties/[id]` - Get full property details

**Features:**
- Complete property information
- All images with captions and ordering
- Feature/amenity list
- Pricing information
- Location coordinates
- House rules and check-in/out info
- Returns 404 if property not found or not published

**Response Format:**
```json
{
  "success": true,
  "property": {
    "id": 1,
    "title": "Brighton Manor",
    "slug": "brighton-manor",
    "location": "Brighton",
    "region": "South East",
    "description": "Full description...",
    
    "sleepsMin": 8,
    "sleepsMax": 12,
    "bedrooms": 5,
    "bathrooms": 3,
    
    "priceFromMidweek": 450,
    "priceFromWeekend": 650,
    
    "heroImage": "https://...",
    "heroVideo": "https://...",
    "floorplanURL": "https://...",
    
    "images": [
      {
        "id": 1,
        "url": "https://...",
        "caption": "Living Room",
        "order": 0
      }
    ],
    
    "features": ["WiFi", "Hot Tub", "Pool"],
    
    "houseRules": "No smoking...",
    "checkInOut": "Check-in: 4pm, Check-out: 10am",
    
    "mapLat": 50.8225,
    "mapLng": -0.1372,
    
    "featured": true,
    "createdAt": "15/01/2025 10:00:00",
    "updatedAt": "17/12/2025 14:30:00"
  },
  "timestamp": "17/12/2025 15:30:00"
}
```

---

### 4. Availability API
**File:** `src/app/api/orchards/availability/route.ts`

**Endpoint:**
- `POST /api/orchards/availability` - Check detailed availability with pricing

**Features:**
- Validates guest count against property capacity
- Checks blocked dates in availability calendar
- Calculates pricing with seasonal and special date rules
- Returns daily price breakdown
- Handles overlapping pricing rules with priority
- Extracts minimum stay from check-in/out text

**Request Body:**
```json
{
  "propertyId": 1,
  "checkInDate": "25/12/2025",
  "checkOutDate": "01/01/2026",
  "guests": 10
}
```

**Response Format:**
```json
{
  "success": true,
  "propertyId": 1,
  "propertyTitle": "Brighton Manor",
  "checkInDate": "25/12/2025",
  "checkOutDate": "01/01/2026",
  "guests": 10,
  
  "isAvailable": true,
  "unavailableDates": [],
  
  "pricing": {
    "numberOfNights": 7,
    "totalPrice": 5600,
    "averagePricePerNight": 800,
    "currency": "GBP",
    "dailyBreakdown": [
      {
        "date": "25/12/2025",
        "price": 1200,
        "type": "special"
      },
      {
        "date": "26/12/2025",
        "price": 1000,
        "type": "seasonal-peak"
      },
      {
        "date": "27/12/2025",
        "price": 800,
        "type": "seasonal-peak"
      }
    ]
  },
  
  "sleepsMin": 8,
  "sleepsMax": 12,
  "minimumStay": 7,
  
  "timestamp": "17/12/2025 15:35:00"
}
```

**Pricing Logic:**
1. Check **Special Date Pricing** (highest priority) - holidays, events
2. Check **Seasonal Pricing** (by priority) - peak, high, shoulder, low
3. Check **Calendar-Specific Price** - per-date overrides
4. Fall back to **Base Midweek Price**

---

## 🔧 Technical Implementation

### CORS Configuration

**Allowed Origins:**
```typescript
const ORCHARDS_ORIGINS = [
  'https://www.orchards-escapes.co.uk',
  'https://orchards-escapes.co.uk',
  'https://orchards-staging.vercel.app',
  'http://localhost:3000', // Development only
];
```

**CORS Headers:**
```
Access-Control-Allow-Origin: https://www.orchards-escapes.co.uk
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-API-Key
Access-Control-Max-Age: 86400
```

---

### Rate Limiting

**Implementation:**
- In-memory Map for rate limit tracking
- Cleanup of expired records every hour
- IP-based tracking
- API key-based tier assignment

**Headers:**
```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 285
X-RateLimit-Reset: 1734458400000
```

**429 Response:**
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Rate limit: 300 requests per minute.",
  "limit": 300,
  "remaining": 0,
  "resetTime": 1734458400000,
  "retryAfter": 45
}
```

---

### Date Handling

All dates in **DD/MM/YYYY** format (UK standard):
```typescript
function formatUKDate(date: Date): string {
  return date.toLocaleDateString('en-GB');
}

function parseUKDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}
```

---

### Security Features

1. **Read-Only Access**
   - Only GET and POST (for checks) endpoints
   - No create, update, or delete operations
   - Only published properties visible

2. **API Key Authentication**
   - Header: `X-API-Key: orchards_live_key_2025`
   - Query param: `?apiKey=orchards_live_key_2025`
   - Different tiers with different limits

3. **Input Validation**
   - Date format validation
   - Guest count validation
   - Property ID validation
   - Numeric range validation

4. **CORS Protection**
   - Restricted to approved origins
   - Prevents unauthorized website integration

5. **Rate Limiting**
   - Prevents API abuse
   - Different limits for different users
   - Automatic cleanup

---

## 📊 Database Tables Used

### Properties
```sql
properties (
  id, ownerId, title, slug, location, region,
  description, sleepsMin, sleepsMax, bedrooms, bathrooms,
  priceFromMidweek, priceFromWeekend,
  heroImage, heroVideo, floorplanURL,
  houseRules, checkInOut,
  mapLat, mapLng, featured,
  status, createdAt, updatedAt
)
```

### Property Images
```sql
propertyImages (
  id, propertyId, url, caption, orderIndex
)
```

### Property Features
```sql
propertyFeatures (
  id, propertyId, featureName
)
```

### Availability Calendar
```sql
availabilityCalendar (
  id, propertyId, date, available, price, reason
)
```

### Seasonal Pricing
```sql
seasonalPricing (
  id, propertyId, seasonType, startDate, endDate,
  midweekPrice, weekendPrice, priority
)
```

### Special Date Pricing
```sql
specialDatePricing (
  id, propertyId, date, endDate,
  midweekPrice, weekendPrice, description
)
```

---

## 🧪 Testing

### Test Commands

```bash
# 1. List properties
curl -X GET "http://localhost:3000/api/orchards/properties?limit=5" \
  -H "X-API-Key: demo_api_key_standard"

# 2. Get property details
curl -X GET "http://localhost:3000/api/orchards/properties/1" \
  -H "X-API-Key: demo_api_key_standard"

# 3. Check availability
curl -X POST "http://localhost:3000/api/orchards/availability" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: demo_api_key_standard" \
  -d '{
    "propertyId": 1,
    "checkInDate": "01/01/2026",
    "checkOutDate": "08/01/2026",
    "guests": 8
  }'

# 4. Test rate limiting (no API key)
for i in {1..35}; do
  curl -X GET "http://localhost:3000/api/orchards/properties"
done

# 5. Check rate limit stats
curl -X GET "http://localhost:3000/api/orchards/properties" \
  -I | grep "X-RateLimit"
```

### JavaScript Example

```javascript
const API_KEY = 'orchards_live_key_2025';
const BASE_URL = 'https://your-domain.com/api/orchards';

// Fetch with error handling
async function fetchWithRetry(url, options, retries = 3) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-Key': API_KEY,
        ...options?.headers
      }
    });
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      if (retries > 0) {
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        return fetchWithRetry(url, options, retries - 1);
      }
    }
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// List properties
const properties = await fetchWithRetry(
  `${BASE_URL}/properties?featured=true&limit=10`
);

// Get property
const property = await fetchWithRetry(
  `${BASE_URL}/properties/1`
);

// Check availability
const availability = await fetchWithRetry(
  `${BASE_URL}/availability`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      propertyId: 1,
      checkInDate: '25/12/2025',
      checkOutDate: '01/01/2026',
      guests: 10
    })
  }
);
```

---

## 📝 Integration Checklist

### For Orchards Development Team

- [ ] **1. Get API Key**
  - Contact system admin for production API key
  - Store in environment variables
  - Never commit to version control

- [ ] **2. Verify CORS**
  - Ensure your domain is in allowed origins
  - Test OPTIONS preflight requests
  - Verify headers in browser console

- [ ] **3. Implement Endpoints**
  - Property listings page
  - Property detail page
  - Availability checking
  - Search functionality

- [ ] **4. Error Handling**
  - Handle 429 (rate limit) with retry
  - Handle 404 (not found) with fallback
  - Handle 500 (server error) with error message
  - Show loading states

- [ ] **5. Caching**
  - Cache property listings (1 hour)
  - Cache property details (30 minutes)
  - Never cache availability (always fresh)

- [ ] **6. Performance**
  - Use pagination for lists
  - Lazy load images
  - Implement search debouncing
  - Monitor rate limit headers

- [ ] **7. Testing**
  - Test all endpoints in staging
  - Test rate limiting behavior
  - Test error scenarios
  - Test CORS from your domain

- [ ] **8. Production Deployment**
  - Update API key to production key
  - Update base URL to production
  - Verify CORS in production
  - Monitor API usage

---

## 🚀 Deployment Notes

### Environment Variables

Add to your `.env.local`:

```env
# Orchards API Configuration
ORCHARDS_API_KEY=orchards_live_key_2025
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com

# Rate Limiting
RATE_LIMIT_PUBLIC=30
RATE_LIMIT_AUTHENTICATED=100
RATE_LIMIT_PREMIUM=300

# CORS Origins (comma-separated)
CORS_ALLOWED_ORIGINS=https://www.orchards-escapes.co.uk,https://orchards-escapes.co.uk
```

### Production Checklist

- [ ] Update API key in Orchards website environment
- [ ] Verify CORS origins include production domain
- [ ] Test rate limiting with production traffic
- [ ] Set up monitoring for API usage
- [ ] Configure CDN caching (if applicable)
- [ ] Set up error alerting
- [ ] Document API key rotation process

---

## 📊 Monitoring

### Metrics to Track

1. **Rate Limit Stats**
   - Requests per minute by tier
   - Number of 429 responses
   - Most active IP addresses

2. **API Performance**
   - Response times by endpoint
   - Error rates
   - Cache hit rates

3. **Usage Patterns**
   - Most queried properties
   - Most queried date ranges
   - Peak usage times

### Monitoring Endpoints

```bash
# Get rate limit stats (future enhancement)
GET /api/orchards/stats?apiKey=admin_key

# Health check
GET /api/orchards/health
```

---

## 🔄 Future Enhancements

### Phase 2 (Optional)

1. **Redis Rate Limiting**
   - Replace in-memory with Redis
   - Shared state across instances
   - Better for horizontal scaling

2. **Webhook Notifications**
   - Notify Orchards of availability changes
   - Real-time calendar updates
   - Booking confirmations

3. **Advanced Caching**
   - CDN integration
   - Edge caching
   - Stale-while-revalidate

4. **Analytics**
   - Track API usage patterns
   - Popular properties
   - Search behavior

5. **GraphQL API**
   - Single endpoint for all queries
   - Reduce over-fetching
   - Better for complex queries

---

## 📞 Support

### For Technical Issues

**Contact:** Development Team  
**Email:** api-support@escape-houses.com  
**Documentation:** [ORCHARDS_API_DOCUMENTATION.md](ORCHARDS_API_DOCUMENTATION.md)

### API Key Management

**Contact:** System Administrator  
**Email:** admin@escape-houses.com  
**Process:** Key generation, rotation, revocation

---

## 📚 Related Documentation

- [ORCHARDS_API_DOCUMENTATION.md](ORCHARDS_API_DOCUMENTATION.md) - Full API reference
- [STEP_3_OWNER_DASHBOARD_SUMMARY.md](STEP_3_OWNER_DASHBOARD_SUMMARY.md) - Owner dashboard APIs
- [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) - System configuration
- [DEPLOYMENT_READY_CHECKLIST.md](DEPLOYMENT_READY_CHECKLIST.md) - Deployment guide

---

## ✅ Completion Status

**STEP 4 - ORCHARDS WEBSITE INTEGRATION: COMPLETE**

### What Was Delivered

✅ **Rate Limiting Middleware** (`src/lib/rate-limiter.ts`)
- Tiered rate limiting (30/100/300 req/min)
- API key authentication
- Rate limit headers
- Automatic cleanup

✅ **Property Listings API** (`src/app/api/orchards/properties/route.ts`)
- List all properties with filters
- Pagination support
- Quick availability checking
- CORS enabled

✅ **Property Details API** (`src/app/api/orchards/properties/[id]/route.ts`)
- Complete property information
- Images and features
- Location data
- CORS enabled

✅ **Availability API** (`src/app/api/orchards/availability/route.ts`)
- Real-time availability checking
- Pricing calculation
- Daily price breakdown
- Seasonal and special date pricing
- CORS enabled

✅ **Documentation**
- API documentation with examples
- Integration guide
- Testing instructions
- Security best practices

### Ready for Integration

The Orchards website development team can now:
1. Request production API key
2. Verify domain is in CORS whitelist
3. Implement API calls using documentation
4. Test in staging environment
5. Deploy to production

---

**Implementation Completed:** 17/12/2025  
**Documentation Version:** 1.0  
**Status:** ✅ **PRODUCTION READY**
