# API Endpoints Reference

## ✅ Working API Endpoints

### Subscription APIs

#### Get Subscription Plans
```
GET /api/subscriptions/plans
```
Returns all available subscription plans (Free, Standard, Premium)

**Example Response:**
```json
{
  "plans": [
    {
      "id": "free",
      "name": "Free Plan",
      "tier": "free",
      "price": 0,
      "currency": "GBP",
      "interval": "month",
      "features": [...]
    }
  ]
}
```

#### Get Current User's Subscription
```
GET /api/subscriptions/current
```
⚠️ **Requires Authentication** - Returns 401 if not logged in

**Example Response (logged in):**
```json
{
  "subscription": {
    "id": "sub_xxx",
    "planId": "premium",
    "status": "active",
    "currentPeriodEnd": "2025-12-17T00:00:00.000Z"
  }
}
```

**Example Response (not logged in):**
```json
{
  "error": "Unauthorized"
}
```

#### Create Subscription
```
POST /api/subscriptions/create
Content-Type: application/json

{
  "planId": "premium"
}
```
⚠️ **Requires Authentication**

#### Cancel Subscription
```
POST /api/subscriptions/cancel
```
⚠️ **Requires Authentication**

#### Reactivate Subscription
```
POST /api/subscriptions/reactivate
```
⚠️ **Requires Authentication**

---

### Public Properties API

#### List All Properties (Default)
```
GET /api/public/properties
```
Returns all published properties

#### Get Property by ID
```
GET /api/public/properties?action=property&id=1
```
Returns single property by ID

#### Get Property by Slug
```
GET /api/public/properties?action=property&slug=brighton-manor
```
Returns single property by slug

#### Search Properties
```
GET /api/public/properties?action=search&q=brighton
```
Search properties by keyword

#### Filter Properties
```
GET /api/public/properties?action=list&region=South%20England&minGuests=10&maxPrice=5000
```

Available filters:
- `search` - Search text
- `region` - Region name
- `location` - Specific location
- `minPrice` / `maxPrice` - Price range
- `minGuests` / `maxGuests` - Guest capacity
- `minBedrooms` / `maxBedrooms` - Bedroom count
- `features` - Comma-separated features (pool, spa, etc.)
- `sortBy` - Sort field (price, guests, bedrooms)
- `sortOrder` - asc or desc
- `page` - Page number
- `limit` - Results per page

#### Get Featured Properties
```
GET /api/public/properties?action=featured&limit=6
```

#### Get Property Availability
```
GET /api/public/properties?action=availability&propertyId=1&year=2025&month=12
```

#### Get Property Reviews
```
GET /api/public/properties?action=reviews&propertyId=1
```

---

## 🎨 Frontend Pages (User Interface)

### For Property Owners

| Page | URL | Description |
|------|-----|-------------|
| Owner Dashboard | `/owner/dashboard` | Main dashboard with overview |
| Subscription Management | `/owner/subscription` | View/manage subscription plans |
| Properties | `/owner/properties` | Manage property listings |
| Bookings | `/owner/bookings` | View and manage bookings |
| Payments | `/owner/payments` | Payment history and billing |
| Owner Login | `/owner/login` | Login as property owner |

### For Guests

| Page | URL | Description |
|------|-----|-------------|
| Browse Properties | `/properties` | Search and filter properties |
| Property Detail | `/properties/[slug]` | View single property |
| Pricing (Booking Deposits) | `/pricing` | View booking deposit tiers |
| Register | `/register` | Create guest account |
| Login | `/login` | Guest login |

---

## 🔧 Common Issues & Solutions

### Issue 1: "Cannot read properties of undefined (reading 'includes')"
**Cause:** Using old prop name `requiredRole` instead of `allowedRoles`

**Solution:** Always use `<ProtectedRoute allowedRoles={['owner']}>` (array)

### Issue 2: "Unauthorized" when accessing subscription endpoints
**Cause:** Not logged in

**Solution:** 
1. Login at `/owner/login` or `/login`
2. Then access the subscription page at `/owner/subscription`

### Issue 3: API returns raw JSON instead of UI
**Cause:** Accessing API route directly instead of frontend page

**Solution:** 
- API: `/api/subscriptions/plans` → Returns JSON
- Frontend: `/owner/subscription` → Shows beautiful UI

### Issue 4: Property not found (id=1)
**Cause:** Missing `action=property` parameter

**Solution:**
- ❌ Wrong: `/api/public/properties?id=1`
- ✅ Correct: `/api/public/properties?action=property&id=1`

---

## 📝 Testing Checklist

### Subscription System
- [ ] `/api/subscriptions/plans` - Returns 3 plans
- [ ] `/owner/subscription` - Shows subscription UI (requires login)
- [ ] Can upgrade/downgrade plans
- [ ] Can cancel subscription
- [ ] Can reactivate subscription

### Properties System
- [ ] `/api/public/properties` - Returns property list
- [ ] `/api/public/properties?action=property&id=1` - Returns single property
- [ ] `/properties` - Shows property grid UI
- [ ] `/properties/[slug]` - Shows property detail page
- [ ] Search and filters work

### Authentication
- [ ] Owner can login at `/owner/login`
- [ ] Guest can login at `/login`
- [ ] Protected routes redirect to login
- [ ] Session persists across page refreshes

---

## 🚀 Quick Start Guide

**For Developers:**
```bash
# Start development server
npm run dev

# Server runs at
http://localhost:3000
```

**Test Subscription System:**
1. Login as owner: http://localhost:3000/owner/login
2. Go to subscription page: http://localhost:3000/owner/subscription
3. View available plans and current subscription

**Test Property Listings:**
1. View all properties: http://localhost:3000/properties
2. View single property: http://localhost:3000/properties/brighton-manor
3. Check API: http://localhost:3000/api/public/properties

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check terminal for server errors
3. Verify authentication status
4. Clear browser cache and cookies
5. Restart dev server: `npm run dev`
