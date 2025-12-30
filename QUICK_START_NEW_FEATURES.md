# Quick Start Guide - New Features

## 🚀 Ready to Test!

All three features are now complete and integrated. Here's how to test them:

---

## 1. Pricing Fields Management

### Access
Navigate to: `http://localhost:3000/owner/properties/new`

### Testing Steps
1. Fill steps 1-5 (Essentials through Policies)
2. Go to **Step 6: Pricing**
3. You'll see the new pricing interface with:
   - Base Price field (£)
   - Weekend Price field (£)
   - Cleaning Fee field (£)
   - Security Deposit field (£)
   - Pricing Summary card
   - (Seasonal pricing disabled for now - can be enabled)

### Test Cases
```
✅ Enter base price: 150.00
✅ Try negative: -50 → Should show error toast
✅ Try huge value: 999999 → Should show warning
✅ Enter weekend: 200.00
✅ Check pricing summary updates automatically
✅ Save property → Verify prices saved
```

### Expected Behavior
- All prices validate on input
- Format to 2 decimal places automatically
- Summary shows all entered prices
- Toast notifications for errors
- Can't save with negative prices

---

## 2. Enquiries Viewer

### Access
Navigate to: `http://localhost:3000/owner/enquiries`

### What You'll See
- **Stats Cards:** Total, New, In Progress, Resolved
- **Filters:** Status dropdown, search bar
- **Enquiries List:** All enquiries for your properties
- **Details Modal:** Click any enquiry to see full details

### Current State
**Note:** Database likely has no enquiries yet. You'll see:
```
Empty State:
"No enquiries found"
"Enquiries will appear here when guests contact you"
```

### To Test with Real Data

**Option 1: Create Test Data via SQL**
```sql
INSERT INTO enquiries (
  first_name, last_name, email, phone, 
  subject, message, enquiry_type, status, 
  property_id, created_at
) VALUES (
  'John', 'Doe', 'john@example.com', '07700900123',
  'Weekend Booking Inquiry', 'I am interested in booking...', 
  'booking', 'new', 1, datetime('now')
);
```

**Option 2: Create Contact Form** (Future feature)
- Public form on website
- Submits to `/api/enquiries` (to be created)
- Automatically populates this viewer

### API Endpoint
```bash
# Test the API directly
curl http://localhost:3000/api/owner/enquiries

# Expected Response:
{
  "success": true,
  "enquiries": [],
  "stats": {
    "total": 0,
    "new": 0,
    "inProgress": 0,
    "resolved": 0,
    "byProperty": []
  }
}
```

---

## 3. Orchards Website API

### Access
These are **PUBLIC** endpoints (no auth required):

#### Get All Listings
```bash
curl "http://localhost:3000/api/orchards/listings"
```

#### Filter by Region
```bash
curl "http://localhost:3000/api/orchards/listings?region=Brighton"
```

#### Filter by Guest Count
```bash
curl "http://localhost:3000/api/orchards/listings?sleeps=6"
```

#### Check Availability
```bash
curl -X POST http://localhost:3000/api/orchards/listings \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "your-property-slug",
    "checkIn": "2025-07-01",
    "checkOut": "2025-07-07"
  }'
```

### Expected Response Format
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
      "sleepsMin": 2,
      "sleepsMax": 10,
      "bedrooms": 5,
      "bathrooms": 3,
      "priceFromMidweek": 150.00,
      "priceFromWeekend": 200.00,
      "description": "...",
      "heroImage": "...",
      "images": [
        {
          "id": 1,
          "url": "/uploads/properties/...",
          "caption": "Living Room",
          "order": 0
        }
      ],
      "features": [
        { "name": "Hot Tub" },
        { "name": "WiFi" }
      ],
      "availability": {
        "isAvailable": true,
        "checkedFrom": null,
        "checkedTo": null
      },
      "seasonalPricing": []
    }
  ],
  "total": 1,
  "limit": 100,
  "offset": 0,
  "timestamp": "2025-12-24T..."
}
```

### Integration with Orchards Website

The external website should:

**1. Fetch Listings on Page Load**
```javascript
async function getProperties() {
  const res = await fetch('https://yourdomain.com/api/orchards/listings?region=Brighton');
  const data = await res.json();
  return data.properties;
}
```

**2. Check Availability on Date Selection**
```javascript
async function checkAvailability(slug, checkIn, checkOut) {
  const res = await fetch('https://yourdomain.com/api/orchards/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, checkIn, checkOut })
  });
  const data = await res.json();
  return data.available;
}
```

**3. Handle Caching**
- Listings cached for 5 minutes
- Availability cached for 1 minute
- Use Cache-Control headers

---

## 🔍 Debugging

### Check Database Tables

**Are tables created?**
```bash
# In Turso CLI or Drizzle Studio
SELECT name FROM sqlite_master WHERE type='table';
```

**Expected tables:**
- properties
- propertyImages
- propertyFeatures
- enquiries
- seasonalPricing
- performanceStats
- bookings

### Check API Responses

**Enquiries API (requires auth):**
```bash
# Should return 401 if not logged in
curl http://localhost:3000/api/owner/enquiries

# Log in as owner first, then test
```

**Orchards API (public):**
```bash
# Should return 200 with empty array if no properties
curl http://localhost:3000/api/orchards/listings
```

### Common Issues

**"No enquiries found"**
- Normal if database is empty
- Create test data via SQL or contact form

**"Property not found" on availability check**
- Property must have status='approved'
- Check slug is correct
- Ensure property exists

**Pricing not saving**
- Check console for validation errors
- Verify formData updates in React DevTools
- Check API response in Network tab

---

## 📊 Current Status

### ✅ Completed
- [x] Pricing Fields Manager component
- [x] Enquiries Viewer component  
- [x] Enquiries API endpoints
- [x] Performance Stats API
- [x] Orchards Listings API
- [x] Orchards Availability API
- [x] Integration into PropertyMultiStepForm
- [x] Owner-only access control
- [x] Input validation
- [x] Error handling
- [x] Mobile responsiveness

### 🔄 Ready for Testing
- [ ] Pricing fields save/load
- [ ] Enquiries display correctly
- [ ] Stats calculate accurately
- [ ] Orchards API returns correct data
- [ ] Frontend ↔ Backend sync works

### 📋 Next Steps
1. **Test pricing** in property form
2. **Add test enquiries** to database
3. **Test Orchards API** with Postman
4. **Integrate Orchards website** (external team)
5. **Add contact form** for public enquiries
6. **Implement analytics** for performance stats

---

## 🛠 Files Reference

### New Components
- `src/components/property/PricingFieldsManager.tsx`
- `src/components/enquiries/EnquiriesViewer.tsx`

### New Pages
- `src/app/owner/enquiries/page.tsx`

### New API Routes
- `src/app/api/orchards/listings/route.ts`

### Modified Files
- `src/components/admin/PropertyMultiStepForm.tsx` (Step 6 pricing)

### Existing APIs (Already Present)
- `src/app/api/owner/enquiries/route.ts`
- `src/app/api/owner/stats/route.ts`

---

## 💡 Tips

1. **Use React DevTools** to inspect formData state
2. **Use Network Tab** to see API requests/responses
3. **Check Console** for validation errors
4. **Use Drizzle Studio** to view database (`npm run db:studio`)
5. **Clear cache** if seeing old data

---

## 📞 Need Help?

Check these documentation files:
- `FEATURES_IMPLEMENTATION_COMPLETE.md` - Full technical documentation
- `PHASE1_IMPLEMENTATION_COMPLETE.md` - Previous phase details
- `TESTING_GUIDE_PHASE1.md` - Comprehensive testing guide

All features are complete and ready for testing! 🎉
