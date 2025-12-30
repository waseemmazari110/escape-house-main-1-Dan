# ORCHARDS WEBSITE INTEGRATION - API Documentation

## 🌐 Overview

This document describes the secure, read-only API endpoints for integrating the Orchards Escapes website with the property management system. The integration provides real-time access to property listings and availability information.

---

## 🔑 Authentication

### API Key

All requests should include an API key for enhanced rate limits and priority access.

**Methods to include API key:**

1. **HTTP Header (Recommended):**
   ```
   X-API-Key: orchards_live_key_2025
   ```

2. **Query Parameter:**
   ```
   ?apiKey=orchards_live_key_2025
   ```

### Production API Key

Contact the system administrator to obtain your production API key.

**Demo/Testing Key:** `demo_api_key_standard`

---

## 🚦 Rate Limiting

Different tiers have different rate limits:

| Tier | Rate Limit | API Key Required |
|------|------------|------------------|
| **Public** | 30 requests/minute | No |
| **Authenticated** | 100 requests/minute | Yes (standard key) |
| **Premium** (Orchards) | 300 requests/minute | Yes (premium key) |

### Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 285
X-RateLimit-Reset: 1734458400000
```

When rate limit is exceeded:
- **Status Code:** 429 (Too Many Requests)
- **Header:** `Retry-After: 60` (seconds)

---

## 🌍 CORS Support

The API supports Cross-Origin Resource Sharing (CORS) for the following origins:

- `https://www.orchards-escapes.co.uk`
- `https://orchards-escapes.co.uk`
- `https://orchards-staging.vercel.app` (staging)
- `http://localhost:3000` (development only)

---

## 📍 API Endpoints

### Base URL

```
Production: https://your-domain.com/api/orchards
Development: http://localhost:3000/api/orchards
```

---

## 1. List Properties

Get a list of all available properties with optional filtering.

### Endpoint
```
GET /api/orchards/properties
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Max results (default: 50, max: 100) |
| `offset` | integer | No | Pagination offset (default: 0) |
| `region` | string | No | Filter by region (e.g., "South East") |
| `minGuests` | integer | No | Minimum guest capacity |
| `maxPrice` | number | No | Maximum price per night |
| `featured` | boolean | No | Show only featured properties |

### Example Request

```bash
curl -X GET "https://your-domain.com/api/orchards/properties?region=South%20East&minGuests=8&featured=true" \
  -H "X-API-Key: orchards_live_key_2025"
```

### Example Response

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
      "description": "Stunning Victorian manor...",
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

## 2. Get Property Details

Get complete details for a specific property including images and features.

### Endpoint
```
GET /api/orchards/properties/[id]
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Property ID |

### Example Request

```bash
curl -X GET "https://your-domain.com/api/orchards/properties/1" \
  -H "X-API-Key: orchards_live_key_2025"
```

### Example Response

```json
{
  "success": true,
  "property": {
    "id": 1,
    "title": "Brighton Manor",
    "slug": "brighton-manor",
    "location": "Brighton",
    "region": "South East",
    "description": "Stunning Victorian manor house...",
    
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
      },
      {
        "id": 2,
        "url": "https://...",
        "caption": "Kitchen",
        "order": 1
      }
    ],
    
    "features": [
      "WiFi",
      "Hot Tub",
      "Pool",
      "Parking",
      "BBQ"
    ],
    
    "houseRules": "No smoking...",
    "checkInOut": "Check-in: 4pm, Check-out: 10am. Minimum 7 nights.",
    
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

## 3. Check Availability

Check if a property is available for specific dates and get pricing.

### Endpoint
```
POST /api/orchards/availability
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `propertyId` | integer | Yes | Property ID |
| `checkInDate` | string | Yes | Check-in date (DD/MM/YYYY) |
| `checkOutDate` | string | Yes | Check-out date (DD/MM/YYYY) |
| `guests` | integer | No | Number of guests |

### Example Request

```bash
curl -X POST "https://your-domain.com/api/orchards/availability" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: orchards_live_key_2025" \
  -d '{
    "propertyId": 1,
    "checkInDate": "25/12/2025",
    "checkOutDate": "01/01/2026",
    "guests": 10
  }'
```

### Example Response - Available

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

### Example Response - Not Available

```json
{
  "success": true,
  "propertyId": 1,
  "propertyTitle": "Brighton Manor",
  "checkInDate": "25/12/2025",
  "checkOutDate": "01/01/2026",
  "guests": 10,
  
  "isAvailable": false,
  "unavailableDates": [
    {
      "date": "27/12/2025",
      "reason": "Already booked"
    },
    {
      "date": "28/12/2025",
      "reason": "Already booked"
    }
  ],
  
  "pricing": {
    "numberOfNights": 7,
    "totalPrice": 5600,
    "averagePricePerNight": 800,
    "currency": "GBP",
    "dailyBreakdown": [...]
  },
  
  "sleepsMin": 8,
  "sleepsMax": 12,
  "minimumStay": 7,
  
  "timestamp": "17/12/2025 15:35:00"
}
```

---

## 🔒 Security Features

### 1. Read-Only Access
- All endpoints are **GET** or **POST** (for availability checks only)
- No create, update, or delete operations available
- Only published properties are accessible

### 2. Rate Limiting
- IP-based rate limiting prevents abuse
- Premium tier for Orchards website (300 req/min)
- Automatic cleanup of expired rate limit records

### 3. API Key Validation
- Secure API key authentication
- Keys can be revoked or regenerated
- Different tiers for different access levels

### 4. CORS Protection
- Restricted to approved origins only
- Prevents unauthorized website integration
- Development mode includes localhost

### 5. Input Validation
- All inputs are validated
- Date format validation (DD/MM/YYYY)
- Guest count validation against property capacity
- Property ID validation

---

## 📊 Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "message": "propertyId, checkInDate (DD/MM/YYYY), and checkOutDate (DD/MM/YYYY) are required",
  "example": {
    "propertyId": 1,
    "checkInDate": "25/12/2025",
    "checkOutDate": "01/01/2026",
    "guests": 8
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid API key",
  "message": "The provided API key is invalid or expired."
}
```

### 404 Not Found
```json
{
  "error": "Property not found or not available"
}
```

### 429 Too Many Requests
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

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch properties",
  "message": "Internal server error details..."
}
```

---

## 🧪 Testing

### Test with curl

```bash
# List properties
curl -X GET "http://localhost:3000/api/orchards/properties?limit=5" \
  -H "X-API-Key: demo_api_key_standard"

# Get property details
curl -X GET "http://localhost:3000/api/orchards/properties/1" \
  -H "X-API-Key: demo_api_key_standard"

# Check availability
curl -X POST "http://localhost:3000/api/orchards/availability" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: demo_api_key_standard" \
  -d '{
    "propertyId": 1,
    "checkInDate": "01/01/2026",
    "checkOutDate": "08/01/2026",
    "guests": 8
  }'
```

### Test with JavaScript

```javascript
const API_KEY = 'orchards_live_key_2025';
const BASE_URL = 'https://your-domain.com/api/orchards';

// List properties
async function listProperties() {
  const response = await fetch(`${BASE_URL}/properties?featured=true`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  const data = await response.json();
  console.log(data);
}

// Get property details
async function getProperty(id) {
  const response = await fetch(`${BASE_URL}/properties/${id}`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  const data = await response.json();
  console.log(data);
}

// Check availability
async function checkAvailability(propertyId, checkIn, checkOut, guests) {
  const response = await fetch(`${BASE_URL}/availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify({
      propertyId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests
    })
  });
  const data = await response.json();
  console.log(data);
}

// Usage
listProperties();
getProperty(1);
checkAvailability(1, '25/12/2025', '01/01/2026', 10);
```

---

## 🚀 Integration Steps

### 1. Obtain API Key
Contact the system administrator to get your production API key.

### 2. Whitelist Your Domain
Ensure your domain is in the CORS allowed origins list.

### 3. Implement API Calls
Use the endpoints above to fetch property data and check availability.

### 4. Handle Rate Limits
Implement retry logic for 429 responses using the `Retry-After` header.

### 5. Cache Responses
Cache property details locally to reduce API calls. Recommended cache duration: 1 hour.

### 6. Error Handling
Implement proper error handling for all possible error responses.

---

## 📝 Best Practices

### 1. Caching
- Cache property listings for 1 hour
- Cache property details for 30 minutes
- Always check availability in real-time (no caching)

### 2. Error Handling
```javascript
async function fetchProperties() {
  try {
    const response = await fetch(url, { headers });
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return fetchProperties(); // Retry
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    // Show fallback UI
  }
}
```

### 3. Performance
- Use pagination for large property lists
- Implement lazy loading for images
- Batch availability checks when possible
- Monitor rate limit headers

### 4. Security
- Store API key securely (environment variables)
- Never expose API key in client-side code
- Make API calls from your backend/server

---

## 📞 Support

For technical support or to request a production API key:

**Email:** api-support@escape-houses.com  
**Documentation:** See [STEP_4_ORCHARDS_INTEGRATION_SUMMARY.md](STEP_4_ORCHARDS_INTEGRATION_SUMMARY.md)

---

## 🔄 Changelog

### Version 1.0 (17/12/2025)
- Initial release
- Property listings endpoint
- Property details endpoint
- Availability checking endpoint
- Rate limiting implementation
- CORS support
- API key authentication

---

**Last Updated:** 17/12/2025  
**API Version:** 1.0  
**Status:** ✅ Production Ready
