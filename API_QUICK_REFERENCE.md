# API Endpoints - Quick Reference Guide

## Authentication & Status Codes

### Status Codes Quick Reference

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input/validation failed |
| 401 | Unauthorized | Not authenticated (no session) |
| 403 | Forbidden | Authenticated but wrong role |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal error |

### Authentication Patterns

```typescript
// Pattern 1: withRoles (Recommended)
export const GET = withRoles(['owner', 'admin'], async (request, user) => {
  // user is guaranteed authenticated with correct role
});

// Pattern 2: Manual check
const user = await getCurrentUserWithRole();
if (!user || !isAdmin(user)) {
  return unauthorizedResponse('Admin required');
}

// Pattern 3: requireRole
const user = await requireRole(['owner', 'admin']);
// Throws if not authorized
```

---

## Standard Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "24/12/2025 16:00:00"
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "24/12/2025 16:00:00"
}
```

### List Response

```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "timestamp": "24/12/2025 16:00:00"
}
```

---

## Frontend Integration

### Using API Client

```typescript
import { GEH_API } from '@/lib/api-client';

// GET
const properties = await GEH_API.get<Property[]>('/properties');

// POST
const newProperty = await GEH_API.post<Property>('/properties', data);

// PUT
const updated = await GEH_API.put<Property>('/properties', data);

// DELETE
await GEH_API.delete('/properties/123');
```

### Error Handling

```typescript
try {
  const data = await fetch('/api/endpoint');
  
  if (response.status === 401) {
    router.push('/login');
    return;
  }
  
  if (response.status === 403) {
    toast.error('Access denied');
    return;
  }
  
  if (!response.ok) {
    const error = await response.json();
    toast.error(error.error);
    return;
  }
  
  const result = await response.json();
  // Success
} catch (error) {
  toast.error('Network error');
}
```

---

## Key Endpoints by Category

### Public (No Auth)

```typescript
GET  /api/properties              // List properties
GET  /api/properties?id=123       // Single property
POST /api/bookings                // Create booking
POST /api/enquiries               // Submit enquiry
POST /api/contact                 // Contact form
GET  /api/faqs                    // Get FAQs
```

### Authenticated (User)

```typescript
GET  /api/user/profile                      // User profile
GET  /api/subscriptions/current             // Current subscription
POST /api/subscriptions/checkout-session    // Create checkout
POST /api/subscriptions/cancel              // Cancel subscription
GET  /api/bookings/my-bookings              // User's bookings
GET  /api/invoices/[id]                     // View invoice
```

### Owner (Owner/Admin)

```typescript
GET  /api/owner/dashboard          // Owner dashboard
GET  /api/owner/stats              // Statistics
GET  /api/owner/bookings           // Owner's bookings
GET  /api/owner/properties         // Owner's properties
POST /api/owner/properties/create  // Create property
PUT  /api/owner/properties/[id]    // Update property
GET  /api/owner/enquiries          // Owner's enquiries
```

### Admin (Admin Only)

```typescript
GET  /api/admin/stats                         // Admin stats
GET  /api/admin/users                         // All users
GET  /api/admin/properties/pending            // Pending approvals
POST /api/admin/properties/[id]/approve       // Approve property
POST /api/admin/properties/[id]/reject        // Reject property
GET  /api/bookings                            // All bookings
```

---

## Validation Examples

### Email Validation

```typescript
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!EMAIL_REGEX.test(email)) {
  return NextResponse.json(
    { 
      error: 'Invalid email format', 
      code: 'VALIDATION_ERROR',
      field: 'email'
    },
    { status: 400 }
  );
}
```

### Date Validation

```typescript
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

if (!isValidDate(checkInDate)) {
  return NextResponse.json(
    { error: 'Invalid date', code: 'VALIDATION_ERROR' },
    { status: 400 }
  );
}

if (new Date(checkInDate) <= new Date()) {
  return NextResponse.json(
    { error: 'Check-in must be in future', code: 'VALIDATION_ERROR' },
    { status: 400 }
  );
}
```

### Required Fields

```typescript
const { title, location, sleepsMax } = await request.json();

if (!title || !location || !sleepsMax) {
  return NextResponse.json(
    { 
      error: 'Missing required fields',
      code: 'VALIDATION_ERROR',
      required: ['title', 'location', 'sleepsMax']
    },
    { status: 400 }
  );
}
```

---

## Common Request/Response Patterns

### Create Property

```http
POST /api/owner/properties/create
Content-Type: application/json

{
  "title": "Beach House",
  "location": "Brighton",
  "sleepsMax": 6,
  "bedrooms": 3,
  "priceFromMidweek": 150
}

Response (201):
{
  "success": true,
  "property": {
    "id": 123,
    "title": "Beach House",
    "ownerId": "user-456",
    "createdAt": "24/12/2025 16:00:00"
  },
  "timestamp": "24/12/2025 16:00:00"
}
```

### Get Owner Dashboard

```http
GET /api/owner/dashboard

Response (200):
{
  "success": true,
  "dashboard": {
    "user": { "id": "...", "name": "...", "role": "owner" },
    "subscription": {
      "tier": "premium",
      "status": "active",
      "maxProperties": 25,
      "currentProperties": 5
    },
    "quickStats": {
      "totalProperties": 5,
      "publishedProperties": 4,
      "totalEnquiries": 23
    }
  },
  "timestamp": "24/12/2025 16:00:00"
}
```

### Create Booking

```http
POST /api/bookings
Content-Type: application/json

{
  "propertyId": 123,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "checkInDate": "2025-07-01",
  "checkOutDate": "2025-07-07",
  "numberOfGuests": 4
}

Response (201):
{
  "success": true,
  "booking": {
    "id": 456,
    "bookingStatus": "pending",
    "createdAt": "24/12/2025 16:00:00"
  },
  "timestamp": "24/12/2025 16:00:00"
}
```

---

## Error Response Examples

### Authentication Error (401)

```json
{
  "error": "Authentication required",
  "code": "UNAUTHENTICATED",
  "timestamp": "24/12/2025 16:00:00"
}
```

### Authorization Error (403)

```json
{
  "error": "Unauthorized. Required roles: admin",
  "code": "UNAUTHORIZED",
  "timestamp": "24/12/2025 16:00:00"
}
```

### Validation Error (400)

```json
{
  "error": "Invalid email format",
  "code": "VALIDATION_ERROR",
  "field": "email",
  "timestamp": "24/12/2025 16:00:00"
}
```

### Not Found (404)

```json
{
  "error": "Property not found",
  "code": "NOT_FOUND",
  "timestamp": "24/12/2025 16:00:00"
}
```

### Server Error (500)

```json
{
  "error": "Internal server error",
  "message": "Database connection failed",
  "timestamp": "24/12/2025 16:00:00"
}
```

---

## Testing Commands

### Test Public Endpoint

```bash
curl http://localhost:3000/api/properties
```

### Test Protected Endpoint

```bash
# Should fail with 401
curl http://localhost:3000/api/owner/dashboard

# Should succeed with valid session
curl http://localhost:3000/api/owner/dashboard \
  -H "Cookie: better-auth.session_token=..."
```

### Test Validation

```bash
# Missing required field
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"guestName":"John"}'
# Expected: 400 with validation error
```

### Test Authorization

```bash
# Admin endpoint as guest (should fail)
curl http://localhost:3000/api/admin/stats \
  -H "Cookie: better-auth.session_token=<guest-token>"
# Expected: 403 Forbidden
```

---

## Pagination & Filtering

### Pagination Parameters

```typescript
GET /api/properties?limit=20&offset=0
GET /api/properties?page=1&limit=20

// Response includes:
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Filter Parameters

```typescript
GET /api/properties?region=Brighton
GET /api/properties?sleepsMin=4&sleepsMax=8
GET /api/bookings?status=confirmed
GET /api/bookings?startDate=2025-07-01&endDate=2025-07-31
```

### Search Parameters

```typescript
GET /api/properties?search=beach house
GET /api/admin/users?search=john@example.com
```

### Sort Parameters

```typescript
GET /api/properties?sort=title&order=asc
GET /api/bookings?sort=createdAt&order=desc
```

---

## Security Checklist

- ✅ All protected endpoints validate session
- ✅ Role-based access enforced
- ✅ Resource ownership verified
- ✅ Input validation on all inputs
- ✅ SQL injection protection (Drizzle ORM)
- ✅ XSS protection (sanitized inputs)
- ✅ CSRF protection (SameSite cookies)
- ✅ Rate limiting (middleware)
- ✅ Webhook signature verification
- ✅ Spam protection on public forms

---

## API Client Features

### Available Methods

```typescript
GEH_API.get<T>(endpoint)       // GET request
GEH_API.post<T>(endpoint, data) // POST request
GEH_API.put<T>(endpoint, data)  // PUT request
GEH_API.delete(endpoint)        // DELETE request
```

### Features

- ✅ Automatic 401 redirect to login
- ✅ Bearer token from localStorage
- ✅ JSON content-type headers
- ✅ TypeScript generic support
- ✅ Error handling built-in

---

## Troubleshooting

### Issue: Getting 401 errors

**Solution:**
- Verify user is logged in
- Check session cookie exists
- Verify token in localStorage (if using API client)

### Issue: Getting 403 errors

**Solution:**
- Check user has correct role
- Verify resource ownership for owner endpoints
- Confirm admin role for admin endpoints

### Issue: Getting 400 validation errors

**Solution:**
- Check all required fields are provided
- Verify email format is valid
- Ensure dates are in correct format
- Check numeric values are in valid range

### Issue: Response format unexpected

**Solution:**
- All responses should have `timestamp` field
- Success responses have `success: true`
- Error responses have `error` and `code` fields
- Check API documentation for exact format

---

**Last Updated:** December 24, 2025  
**Full Documentation:** API_ENDPOINTS_VALIDATION.md
