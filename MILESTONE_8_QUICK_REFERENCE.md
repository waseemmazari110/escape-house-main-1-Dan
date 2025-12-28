# Milestone 8: Quick Reference Guide

**UK Date Format:** DD/MM/YYYY – DD/MM/YYYY  
**Status:** Production Ready ✅

---

## 🚀 Quick Start

### List All Amenities
```javascript
GET /api/amenities?action=list
```

### Get Property Amenities
```javascript
GET /api/amenities/property/123
```

### Calculate Price Quote
```javascript
GET /api/pricing/calculate?action=calculate&propertyId=123&checkInDate=01/07/2025&checkOutDate=08/07/2025
```

### View Portfolio
```javascript
GET /api/properties/portfolio?action=portfolio
```

---

## 🏠 Amenities (70+)

### Categories (11)
1. **Essentials** - WiFi, Heating, AC, Hot Water, Towels, Linens
2. **Kitchen** - Full Kitchen, Fridge, Microwave, Dishwasher, Coffee Maker, Oven, Stove
3. **Bathroom** - Hair Dryer, Shampoo, Bathtub, Shower
4. **Bedroom** - King/Queen/Single Beds, Wardrobe
5. **Entertainment** - TV, Streaming, Sound System, Games
6. **Outdoor** - Garden, Balcony, Patio, BBQ, Hot Tub 🌟, Pool 🌟
7. **Family** - Baby Crib, High Chair, Toys, Playground
8. **Safety** - Smoke Alarm, CO Alarm, Fire Extinguisher, First Aid, Security
9. **Accessibility** - Wheelchair, Step-Free, Grab Bars
10. **Parking** - Free/Paid Parking, EV Charger 🌟, Garage 🌟
11. **Other** - Washer, Dryer, Iron, Workspace, Pet Friendly

🌟 = Premium

### Update Property Amenities
```javascript
POST /api/amenities/property/123
{
  "amenityIds": ["wifi", "hot-tub", "pool", "ev-charger"]
}
```

---

## 💰 Pricing

### Season Types (5)
- **Peak** (Jul-Aug) - Highest rates
- **High** (Jun, Sep) - High demand
- **Mid** (Apr-May) - Moderate
- **Low** (Oct-Nov) - Lower
- **Off-Peak** (Dec-Mar) - Lowest

### Day Types (3)
- `weekday` - Mon-Thu
- `weekend` - Fri-Sun
- `any` - All days

### Create Seasonal Pricing
```javascript
POST /api/pricing/calculate
{
  "action": "create-seasonal",
  "propertyId": 123,
  "name": "Summer Peak Season",
  "seasonType": "peak",
  "startDate": "01/07/2025",
  "endDate": "31/08/2025",
  "pricePerNight": 250,
  "minimumStay": 7,
  "dayType": "any",
  "priority": 10
}
```

### Create Special Date
```javascript
POST /api/pricing/calculate
{
  "action": "create-special-date",
  "propertyId": 123,
  "name": "Christmas Week",
  "date": "25/12/2025",
  "endDate": "01/01/2026",
  "pricePerNight": 400,
  "minimumStay": 3
}
```

### Get Availability Calendar
```javascript
GET /api/pricing/calculate?action=availability&propertyId=123&startDate=01/07/2025&endDate=31/07/2025
```

---

## 🏢 Multi-Property

### Portfolio Overview
```javascript
GET /api/properties/portfolio?action=portfolio
```

### Performance Metrics
```javascript
GET /api/properties/portfolio?action=performance
```

### Compare Properties
```javascript
GET /api/properties/portfolio?action=compare&propertyIds=1,2,3
```

### Cross-Property Availability
```javascript
GET /api/properties/portfolio?action=cross-availability&propertyIds=1,2&startDate=01/07/2025&endDate=31/07/2025
```

---

## 🔄 Bulk Operations

### Publish Multiple
```javascript
POST /api/properties/portfolio
{
  "action": "bulk",
  "operation": "publish",
  "propertyIds": [1, 2, 3, 4, 5]
}
```

### Unpublish Multiple
```javascript
{
  "action": "bulk",
  "operation": "unpublish",
  "propertyIds": [1, 2, 3]
}
```

### Update Pricing (Bulk)
```javascript
{
  "action": "bulk",
  "operation": "update-pricing",
  "propertyIds": [1, 2, 3],
  "params": {
    "priceFromMidweek": 250,
    "priceFromWeekend": 300
  }
}
```

### Update Amenities (Bulk)
```javascript
{
  "action": "bulk",
  "operation": "update-amenities",
  "propertyIds": [1, 2, 3],
  "params": {
    "amenityIds": ["wifi", "hot-tub", "pool"]
  }
}
```

### Delete Multiple
```javascript
{
  "action": "bulk",
  "operation": "delete",
  "propertyIds": [1, 2, 3]
}
```

---

## 🧪 Testing

### Run All Tests
```bash
npx tsx src/lib/test-milestone8.ts
```

### Test Categories
- ✅ Amenities (10 tests)
- ✅ UK Dates (5 tests)
- ✅ Seasonal Pricing (8 tests)
- ✅ Portfolio (6 tests)
- ✅ Bulk Operations (4 tests)
- ✅ Comparison (5 tests)
- ✅ Seasons (5 tests)
- ✅ Day Types (3 tests)

**Total:** 50+ tests

---

## 📊 UK Date Examples

### Date Ranges
```
"01/07/2025 – 31/08/2025"  (Summer)
"25/12/2025 – 01/01/2026"  (Christmas)
"18/04/2025 – 21/04/2025"  (Easter)
```

### Timestamps
```
"12/12/2025 14:30:00"  (Created)
"12/12/2025 15:45:30"  (Updated)
```

---

## 🔐 Authorization

### Endpoints Requiring Owner Role
- POST `/api/amenities/property/[id]`
- POST `/api/pricing/calculate` (create actions)
- GET `/api/properties/portfolio` (all actions)
- POST `/api/properties/portfolio` (bulk operations)

### Verification
- Users can only modify their own properties
- Admins can modify all properties
- Ownership checked on all update operations

---

## 📁 File Locations

```
src/lib/amenities.ts               - Amenities management
src/lib/seasonal-pricing.ts        - Pricing with UK dates
src/lib/multi-property.ts          - Portfolio management
src/app/api/amenities/route.ts     - Amenities list API
src/app/api/amenities/property/[id]/route.ts - Property amenities
src/app/api/pricing/calculate/route.ts - Price calculator
src/app/api/properties/portfolio/route.ts - Portfolio API
src/lib/test-milestone8.ts         - Test suite
```

---

## 💡 Common Use Cases

### 1. Set Up Summer Pricing
```javascript
// Create peak season (Jul-Aug)
POST /api/pricing/calculate
{
  "action": "create-seasonal",
  "propertyId": 123,
  "name": "Summer Peak",
  "seasonType": "peak",
  "startDate": "01/07/2025",
  "endDate": "31/08/2025",
  "pricePerNight": 300,
  "minimumStay": 7
}

// Create special date (Bank Holiday)
POST /api/pricing/calculate
{
  "action": "create-special-date",
  "propertyId": 123,
  "name": "August Bank Holiday",
  "date": "25/08/2025",
  "endDate": "26/08/2025",
  "pricePerNight": 350,
  "minimumStay": 3
}
```

### 2. Add Premium Amenities
```javascript
POST /api/amenities/property/123
{
  "amenityIds": [
    "wifi", "heating", "ac",
    "hot-tub", "pool", "ev-charger",
    "garden", "bbq", "parking"
  ]
}
```

### 3. Publish Portfolio
```javascript
// Get all draft properties
GET /api/properties/portfolio?action=portfolio

// Publish all at once
POST /api/properties/portfolio
{
  "action": "bulk",
  "operation": "publish",
  "propertyIds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
```

### 4. Update Seasonal Prices
```javascript
// Update pricing across portfolio
POST /api/properties/portfolio
{
  "action": "bulk",
  "operation": "update-pricing",
  "propertyIds": [1, 2, 3, 4, 5],
  "params": {
    "priceFromMidweek": 200,
    "priceFromWeekend": 250
  }
}
```

---

## 🎯 Next Steps

1. Run test suite: `npx tsx src/lib/test-milestone8.ts`
2. Review complete documentation: `MILESTONE_8_COMPLETE.md`
3. Test API endpoints in Postman/Thunder Client
4. Configure seasonal pricing for properties
5. Add amenities to properties
6. Set up multi-property portfolio

---

**Full Documentation:** [MILESTONE_8_COMPLETE.md](MILESTONE_8_COMPLETE.md)  
**Test Suite:** `src/lib/test-milestone8.ts`  
**Status:** ✅ Production Ready
