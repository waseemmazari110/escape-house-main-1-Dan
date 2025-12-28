# Quick Start Guide - Subscription & Owner Dashboard

**Date:** December 18, 2025  
**For:** Property Owners & Administrators  

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Subscription Management](#subscription-management)
3. [Property Management](#property-management)
4. [Photo Management](#photo-management)
5. [Pricing Setup](#pricing-setup)
6. [Dashboard Analytics](#dashboard-analytics)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### 1. Register as Owner

```
1. Visit: https://escapehouses.co.uk/owner/register
2. Fill in your details
3. Verify your email
4. You'll start on the FREE plan
```

### 2. Upgrade to Paid Plan

```
1. Go to: Owner Dashboard → Subscription
2. Choose your plan (Basic, Premium, or Enterprise)
3. Enter payment details
4. Confirm subscription
5. Start adding properties immediately
```

---

## Subscription Management

### Choose Your Plan

| Plan | Properties | Photos | Price (Monthly) | Price (Yearly) |
|------|-----------|--------|----------------|---------------|
| Free | 2 | 10/property | £0 | £0 |
| Basic | 5 | 20/property | £19.99 | £199.99 (Save £39.89) |
| Premium | 25 | 50/property | £49.99 | £499.99 (Save £99.89) |
| Enterprise | Unlimited | Unlimited | £99.99 | £999.99 (Save £199.89) |

### Upgrade Process

**Via Dashboard:**
```
1. Dashboard → Subscription → View Plans
2. Select plan → Enter payment method
3. Confirm → Immediate activation
```

**Via API:**
```javascript
// Create subscription
POST /api/subscriptions/create
{
  "planId": "premium_yearly",
  "paymentMethodId": "pm_1234567890"
}
```

### Update Payment Method

**If Payment Fails:**
```
1. You'll receive email notification
2. Go to: Dashboard → Subscription → Update Payment
3. Enter new card details
4. Payment will retry immediately
```

**Important:** Payment failures follow this schedule:
- Day 3: First retry
- Day 8: Second retry
- Day 15: Third retry
- Day 22: Final retry
- Day 29: **Account suspended**

### Reactivate Suspended Account

```
1. Visit: /owner/subscription/reactivate
2. Enter new payment method
3. Submit → Immediate reactivation
4. All properties restored
```

---

## Property Management

### Create New Property

**Step 1: Basic Info**
```
Title: "Luxury Cottage in Cotswolds"
Location: "Chipping Campden, Cotswolds"
Region: "Cotswolds"
Sleeps: 2-6 guests
Bedrooms: 3
Bathrooms: 2
```

**Step 2: Pricing**
```
Midweek: £450/night
Weekend: £550/night
```

**Step 3: Description**
```
Write compelling description (500+ words recommended)
Include unique features
Mention nearby attractions
```

**Step 4: Hero Image**
```
Upload main property image
Recommended size: 1920x1080px
Format: JPG or PNG
```

**Via API:**
```javascript
POST /api/owner/properties/create
{
  "title": "Luxury Cottage in Cotswolds",
  "location": "Chipping Campden",
  "region": "Cotswolds",
  "sleepsMin": 2,
  "sleepsMax": 6,
  "bedrooms": 3,
  "bathrooms": 2,
  "priceFromMidweek": 450,
  "priceFromWeekend": 550,
  "description": "Beautiful stone cottage...",
  "heroImage": "https://your-cdn.com/hero.jpg"
}
```

### Edit Property

```
1. Dashboard → Properties → Select property
2. Click "Edit"
3. Update any fields
4. Save → Changes applied immediately
```

**Via API:**
```javascript
PUT /api/owner/properties/123
{
  "title": "Updated Title",
  "priceFromWeekend": 600
}
```

### Delete Property

```
1. Dashboard → Properties → Select property
2. Click "Delete"
3. Confirm → Property unpublished
4. Data retained but not visible to public
```

---

## Photo Management

### Upload Photos

**Recommended Specs:**
- Size: 1920x1080px (minimum)
- Format: JPG, PNG
- Max file size: 5MB
- Quality: High (80-90%)

**Process:**
```
1. Edit Property → Photos tab
2. Click "Upload Photos"
3. Select multiple files (up to plan limit)
4. Add captions (optional but recommended)
5. Save → Photos appear immediately
```

**Via API:**
```javascript
POST /api/owner/properties/123/images
{
  "images": [
    {
      "imageURL": "https://cdn.com/living-room.jpg",
      "caption": "Spacious living room with fireplace",
      "orderIndex": 0
    },
    {
      "imageURL": "https://cdn.com/bedroom.jpg",
      "caption": "Master bedroom with king bed",
      "orderIndex": 1
    }
  ]
}
```

### Reorder Photos

```
1. Edit Property → Photos
2. Drag & drop to reorder
3. Save → New order applied
```

### Delete Photos

```
1. Edit Property → Photos
2. Click X on photo
3. Confirm → Photo removed
```

---

## Pricing Setup

### Base Pricing

**Set Default Rates:**
```
Midweek (Mon-Thu): £450/night
Weekend (Fri-Sun): £550/night
```

### Seasonal Pricing

**Example: Summer Peak**
```
Name: "Summer Peak Season"
Type: Peak
Dates: 01/06/2026 - 31/08/2026
Price: £750/night
Day Type: Any
Minimum Stay: 3 nights
Priority: 1 (highest)
```

**Via API:**
```javascript
POST /api/owner/properties/123/pricing
{
  "type": "seasonal",
  "pricingData": {
    "name": "Summer Peak",
    "seasonType": "peak",
    "startDate": "01/06/2026",
    "endDate": "31/08/2026",
    "pricePerNight": 750,
    "dayType": "any",
    "minimumStay": 3,
    "priority": 1
  }
}
```

### Special Date Pricing

**Example: Christmas Week**
```
Name: "Christmas Week"
Date: 24/12/2025
End Date: 01/01/2026
Price: £950/night
Available: Yes
```

**Via API:**
```javascript
POST /api/owner/properties/123/pricing
{
  "type": "special",
  "pricingData": {
    "name": "Christmas Week",
    "date": "24/12/2025",
    "endDate": "01/01/2026",
    "pricePerNight": 950,
    "isAvailable": true
  }
}
```

### Pricing Priority

When multiple rules overlap:
```
1. Special Date Pricing (highest priority)
2. Seasonal Pricing (by priority number)
3. Base Pricing (fallback)
```

---

## Dashboard Analytics

### View Statistics

**Dashboard Overview Shows:**
- Total Properties (active, pending, approved)
- Total Bookings (confirmed, pending)
- Revenue (total, monthly)
- Average Booking Value
- Occupancy Rate
- New Enquiries
- Top Performing Property

### Detailed Analytics

**Access via:**
```
Dashboard → Analytics
```

**Available Reports:**
1. Revenue by Month (last 12 months)
2. Booking Trends (last 30 days)
3. Property Comparison
4. Occupancy Rates
5. Conversion Rates

### Export Data

**CSV Export:**
```
1. Dashboard → Analytics → Export
2. Select date range
3. Download CSV
4. Open in Excel/Google Sheets
```

**Via API:**
```javascript
GET /api/owner/analytics?includeRevenue=true&includeTrends=true&includeComparison=true
```

---

## Amenities & Features

### Add Amenities

**Common Amenities:**
```
✅ WiFi
✅ Hot Tub
✅ Swimming Pool
✅ Garden
✅ Parking (2 spaces)
✅ BBQ Area
✅ Pet Friendly
✅ Family Friendly
✅ Fireplace
✅ Central Heating
✅ Fully Equipped Kitchen
✅ Dishwasher
✅ Washing Machine
✅ Tumble Dryer
```

**Process:**
```
1. Edit Property → Amenities
2. Select from list or add custom
3. Save → Appears on property listing
```

**Via API:**
```javascript
POST /api/owner/properties/123/features
{
  "features": [
    "WiFi",
    "Hot Tub",
    "Parking",
    "Pet Friendly",
    "BBQ Area"
  ]
}
```

---

## Approval Process

### Property Approval Workflow

**Submission:**
```
1. Create property with all required fields
2. Click "Submit for Approval"
3. Status changes to "Pending"
4. Admin reviews within 24-48 hours
```

**Statuses:**
- **Pending:** Awaiting admin review
- **Approved:** Live on website
- **Rejected:** Requires changes (reason provided)

**If Rejected:**
```
1. Review rejection reason
2. Make required changes
3. Resubmit for approval
```

---

## Troubleshooting

### Payment Issues

**Problem:** Payment failed
**Solution:**
1. Check card details
2. Verify sufficient funds
3. Update payment method
4. Contact bank if declined

**Problem:** Account suspended
**Solution:**
1. Go to /owner/subscription/reactivate
2. Enter new payment method
3. Submit for immediate reactivation

### Property Issues

**Problem:** Property not showing on website
**Reasons:**
- Status is "Pending" (needs approval)
- Status is "Rejected" (needs changes)
- Property is unpublished
- Subscription expired

**Solution:**
1. Check property status
2. Ensure subscription is active
3. Verify property is published
4. Contact support if issues persist

### Photo Upload Issues

**Problem:** Photos won't upload
**Reasons:**
- File size too large (max 5MB)
- Wrong format (use JPG/PNG)
- Reached plan limit
- Internet connection issue

**Solution:**
1. Compress images
2. Check subscription limits
3. Try uploading one at a time
4. Clear browser cache

### Analytics Issues

**Problem:** Stats not updating
**Solution:**
- Refresh page
- Clear browser cache
- Stats update every 15 minutes
- Contact support if persists

---

## Support & Help

### Contact Support

**Email:** support@escapehouses.co.uk  
**Phone:** +44 (0) 20 1234 5678  
**Hours:** Mon-Fri 9am-5pm GMT  

### Documentation

- **Full API Docs:** `/API_DOCUMENTATION_COMPLETE.md`
- **Implementation Guide:** `/IMPLEMENTATION_COMPLETE_MILESTONES_4_5.md`
- **User Guide:** This file

### Common Questions

**Q: How long does approval take?**  
A: 24-48 hours for initial review

**Q: Can I change plans?**  
A: Yes, anytime. Prorated charges apply

**Q: What if I cancel?**  
A: Access continues until period end

**Q: Can I reactivate later?**  
A: Yes, with any active payment method

**Q: Are there setup fees?**  
A: No, only subscription fees

---

## Best Practices

### Property Listings
✅ Use high-quality photos (15+ recommended)  
✅ Write detailed descriptions (500+ words)  
✅ Update pricing seasonally  
✅ Respond to enquiries within 24 hours  
✅ Keep availability calendar updated  
✅ Highlight unique features  

### Photos
✅ Professional photography recommended  
✅ Show all rooms and spaces  
✅ Capture exterior and views  
✅ Use natural lighting  
✅ Add descriptive captions  

### Pricing
✅ Research competitor rates  
✅ Set seasonal adjustments  
✅ Mark special dates early  
✅ Offer midweek discounts  
✅ Consider minimum stays  

### Dashboard
✅ Check analytics weekly  
✅ Respond to enquiries promptly  
✅ Update property info regularly  
✅ Monitor booking trends  
✅ Export reports monthly  

---

## Next Steps

1. ✅ Create account
2. ✅ Choose subscription
3. ✅ Add first property
4. ✅ Upload photos
5. ✅ Set pricing
6. ✅ Submit for approval
7. ✅ Monitor dashboard
8. ✅ Respond to bookings

---

**Last Updated:** December 18, 2025  
**Version:** 1.0
