# Subscription & Billing System + Owner Dashboard - API Documentation

**Project:** Escape Houses Property Management Platform  
**Date:** December 2025  
**Version:** 1.0  

---

## Table of Contents

1. [Subscription & Billing APIs](#subscription--billing-apis)
2. [Owner Dashboard APIs](#owner-dashboard-apis)
3. [Property Management APIs](#property-management-apis)
4. [Analytics APIs](#analytics-apis)
5. [Webhook Endpoints](#webhook-endpoints)
6. [Authentication](#authentication)

---

## Subscription & Billing APIs

### 1. Create Subscription

**Endpoint:** `POST /api/subscriptions/create`  
**Auth Required:** Yes (Owner role)  
**Description:** Create a new subscription for an owner

**Request Body:**
```json
{
  "planId": "basic_monthly",
  "paymentMethodId": "pm_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": 123,
    "planName": "basic",
    "status": "active",
    "currentPeriodEnd": "18/12/2026 23:59:59"
  },
  "message": "Subscription created successfully"
}
```

---

### 2. Get Current Subscription

**Endpoint:** `GET /api/subscriptions/current`  
**Auth Required:** Yes  
**Description:** Get user's active subscription details

**Response:**
```json
{
  "subscription": {
    "id": 123,
    "planName": "premium",
    "planType": "yearly",
    "status": "active",
    "amount": 499.99,
    "currency": "GBP",
    "currentPeriodStart": "18/12/2025",
    "currentPeriodEnd": "18/12/2026"
  },
  "invoices": [
    {
      "id": 456,
      "invoiceNumber": "INV-2025-001",
      "status": "paid",
      "total": 499.99,
      "paidAt": "18/12/2025 10:30:00"
    }
  ]
}
```

---

### 3. Cancel Subscription

**Endpoint:** `POST /api/subscriptions/cancel`  
**Auth Required:** Yes (Owner role)  
**Description:** Cancel active subscription (effective at period end)

**Request Body:**
```json
{
  "reason": "No longer needed",
  "feedback": "Great service, will return later"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription cancelled - access until 18/12/2026"
}
```

---

### 4. Reactivate Subscription

**Endpoint:** `POST /api/subscriptions/reactivate`  
**Auth Required:** Yes  
**Description:** Reactivate a suspended subscription

**Request Body:**
```json
{
  "paymentMethodId": "pm_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": { /* subscription object */ },
  "message": "Subscription reactivated successfully"
}
```

---

### 5. Update Payment Method

**Endpoint:** `POST /api/subscriptions/update-payment-method`  
**Auth Required:** Yes  
**Description:** Update payment method for active subscription

**Request Body:**
```json
{
  "paymentMethodId": "pm_0987654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment method updated successfully"
}
```

---

### 6. Get Available Plans

**Endpoint:** `GET /api/subscriptions/plans`  
**Auth Required:** No  
**Description:** Get all available subscription plans

**Response:**
```json
{
  "plans": [
    {
      "id": "basic_monthly",
      "name": "Basic Monthly",
      "tier": "basic",
      "interval": "monthly",
      "price": 19.99,
      "currency": "GBP",
      "maxProperties": 5,
      "maxPhotos": 20,
      "features": ["Up to 5 properties", "20 photos per property", "Email support"]
    }
  ]
}
```

---

## Owner Dashboard APIs

### 1. Get Dashboard Stats

**Endpoint:** `GET /api/owner/dashboard/stats`  
**Auth Required:** Yes (Owner role)  
**Description:** Get comprehensive dashboard statistics

**Response:**
```json
{
  "stats": {
    "totalProperties": 5,
    "activeProperties": 3,
    "pendingApproval": 2,
    "totalBookings": 45,
    "confirmedBookings": 40,
    "totalRevenue": 12500.00,
    "monthRevenue": 2300.00,
    "averageBookingValue": 312.50,
    "occupancyRate": 68.5,
    "totalEnquiries": 78,
    "newEnquiries": 12
  }
}
```

---

## Property Management APIs

### 1. Create Property

**Endpoint:** `POST /api/owner/properties/create`  
**Auth Required:** Yes (Owner role)  
**Description:** Create new property listing

**Request Body:**
```json
{
  "title": "Luxury Cottage in Cotswolds",
  "location": "Chipping Campden, Cotswolds",
  "region": "Cotswolds",
  "sleepsMin": 2,
  "sleepsMax": 6,
  "bedrooms": 3,
  "bathrooms": 2,
  "priceFromMidweek": 450.00,
  "priceFromWeekend": 550.00,
  "description": "Beautiful stone cottage...",
  "heroImage": "https://...",
  "houseRules": "No smoking, No pets",
  "checkInOut": "Check-in: 4PM | Check-out: 10AM"
}
```

**Response:**
```json
{
  "success": true,
  "property": {
    "id": 123,
    "title": "Luxury Cottage in Cotswolds",
    "slug": "luxury-cottage-in-cotswolds",
    "status": "pending"
  },
  "message": "Property created successfully - pending approval"
}
```

---

### 2. Update Property

**Endpoint:** `PUT /api/owner/properties/[id]`  
**Auth Required:** Yes (Owner role)  
**Description:** Update existing property

**Request Body:** (Same as create, all fields optional)

**Response:**
```json
{
  "success": true,
  "property": { /* updated property object */ },
  "message": "Property updated successfully"
}
```

---

### 3. Get Property Details

**Endpoint:** `GET /api/owner/properties/[id]`  
**Auth Required:** Yes (Owner role)  
**Description:** Get complete property details including images and features

**Response:**
```json
{
  "success": true,
  "property": {
    "id": 123,
    "title": "Luxury Cottage",
    "images": [
      {
        "id": 1,
        "imageURL": "https://...",
        "caption": "Living room",
        "orderIndex": 0
      }
    ],
    "features": ["WiFi", "Hot Tub", "Garden", "Parking"]
  }
}
```

---

### 4. Delete Property

**Endpoint:** `DELETE /api/owner/properties/[id]`  
**Auth Required:** Yes (Owner role)  
**Description:** Soft delete property (unpublish)

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

### 5. Get Owner Properties

**Endpoint:** `GET /api/owner/properties`  
**Auth Required:** Yes (Owner role)  
**Description:** Get all properties for logged-in owner

**Response:**
```json
{
  "success": true,
  "properties": [
    {
      "id": 123,
      "title": "Luxury Cottage",
      "status": "approved",
      "isPublished": true,
      "imageCount": 15,
      "featureCount": 8
    }
  ]
}
```

---

### 6. Add Property Images

**Endpoint:** `POST /api/owner/properties/[id]/images`  
**Auth Required:** Yes (Owner role)  
**Description:** Add images to property

**Request Body:**
```json
{
  "images": [
    {
      "imageURL": "https://...",
      "caption": "Master bedroom",
      "orderIndex": 0
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 image(s) added successfully"
}
```

---

### 7. Update Property Features

**Endpoint:** `POST /api/owner/properties/[id]/features`  
**Auth Required:** Yes (Owner role)  
**Description:** Set property amenities/features

**Request Body:**
```json
{
  "features": [
    "WiFi",
    "Hot Tub",
    "Garden",
    "Parking",
    "Pet Friendly",
    "BBQ Area"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Features updated successfully",
  "count": 6
}
```

---

### 8. Add Pricing Rules

**Endpoint:** `POST /api/owner/properties/[id]/pricing`  
**Auth Required:** Yes (Owner role)  
**Description:** Add seasonal or special date pricing

**Request Body (Seasonal):**
```json
{
  "type": "seasonal",
  "pricingData": {
    "name": "Summer Peak",
    "seasonType": "peak",
    "startDate": "01/06/2026",
    "endDate": "31/08/2026",
    "pricePerNight": 750.00,
    "dayType": "any",
    "minimumStay": 3,
    "priority": 1
  }
}
```

**Request Body (Special Date):**
```json
{
  "type": "special",
  "pricingData": {
    "name": "New Year's Eve",
    "date": "31/12/2025",
    "endDate": "02/01/2026",
    "pricePerNight": 950.00,
    "isAvailable": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "pricing": { /* pricing object */ },
  "message": "seasonal pricing added successfully"
}
```

---

## Analytics APIs

### 1. Get Owner Analytics

**Endpoint:** `GET /api/owner/analytics`  
**Auth Required:** Yes (Owner role)  
**Description:** Get comprehensive analytics with optional detailed data

**Query Parameters:**
- `includeRevenue=true` - Include monthly revenue breakdown
- `includeTrends=true` - Include 30-day booking trends
- `includeComparison=true` - Include property comparison data

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalProperties": 5,
    "totalBookings": 45,
    "totalRevenue": 12500.00,
    "occupancyRate": 68.5,
    "topPerformingProperty": {
      "propertyName": "Luxury Cottage",
      "revenue": 5200.00,
      "totalBookings": 18
    }
  },
  "revenueByMonth": [
    {
      "month": "2025-12",
      "revenue": 2300.00,
      "bookings": 8
    }
  ],
  "bookingTrends": [
    {
      "date": "18/12/2025",
      "bookings": 2,
      "revenue": 650.00
    }
  ],
  "propertyComparison": [
    {
      "propertyName": "Luxury Cottage",
      "revenue": 5200.00,
      "totalBookings": 18,
      "occupancyRate": 75.3
    }
  ]
}
```

---

## Webhook Endpoints

### 1. Stripe Billing Webhook

**Endpoint:** `POST /api/webhooks/billing`  
**Auth Required:** No (Stripe signature required)  
**Description:** Handle Stripe payment events

**Supported Events:**
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed (triggers retry)
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled

---

## Authentication

All owner-specific endpoints require:

**Headers:**
```
Authorization: Bearer <session_token>
```

**Session includes:**
- `user.id` - User ID
- `user.role` - User role (guest/owner/admin)
- `user.email` - User email

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (wrong role)
- `404` - Not Found
- `500` - Internal Server Error

---

## Payment Failure Workflow

### Automatic Retry Schedule

1. **Day 0:** Payment fails
2. **Day 3:** First retry attempt
3. **Day 8:** Second retry attempt (3+5)
4. **Day 15:** Third retry attempt (3+5+7)
5. **Day 22:** Final retry attempt (3+5+7+7)
6. **Day 29:** Account suspended after grace period (22+7)

### Email Notifications

- Payment failure notification (each attempt)
- Suspension warning email
- Account suspended email
- Reactivation success email

---

## Subscription Plan Limits

| Plan | Properties | Photos/Property | Price (Monthly) | Price (Yearly) |
|------|-----------|----------------|----------------|---------------|
| Free | 2 | 10 | £0 | £0 |
| Basic | 5 | 20 | £19.99 | £199.99 |
| Premium | 25 | 50 | £49.99 | £499.99 |
| Enterprise | Unlimited | Unlimited | £99.99 | £999.99 |

**Annual Discount:** 16.6% savings on all yearly plans

---

## Testing

### Test Cards (Stripe)

**Success:**
```
Card: 4242 4242 4242 4242
Exp: Any future date
CVC: Any 3 digits
```

**Decline:**
```
Card: 4000 0000 0000 0002
```

**Requires Authentication:**
```
Card: 4000 0027 6000 3184
```

---

## Rate Limiting

All API endpoints are rate-limited:
- **Authenticated:** 100 requests/minute
- **Unauthenticated:** 20 requests/minute

---

## Support

For API support:
- Email: support@escapehouses.co.uk
- Documentation: https://docs.escapehouses.co.uk
- Status Page: https://status.escapehouses.co.uk

---

**Last Updated:** December 18, 2025  
**API Version:** 1.0
