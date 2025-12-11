# Milestone 6: Quick Reference Guide

**Owner Dashboard Backend**

---

## 🎯 Key Files

```
src/lib/audit-logger.ts         → Audit logging with UK timestamps
src/lib/media-presign.ts         → S3 presigned URLs
src/lib/owner-metrics.ts         → Analytics & metrics
src/app/api/owner/properties/    → Property CRUD
src/app/api/owner/media/         → Media management
src/app/api/owner/metrics/       → Analytics API
src/app/api/owner/dashboard/     → Dashboard summary
src/lib/test-milestone6.ts       → Test suite
```

---

## 📋 Quick Commands

### Run Tests
```bash
npx tsx src/lib/test-milestone6.ts
```

### Log Audit Event
```typescript
import { logPropertyAction } from '@/lib/audit-logger';
await logPropertyAction(userId, 'property.create', propertyId, 'Property Name', details);
```

### Generate Presigned URL
```typescript
import { generatePresignedUpload } from '@/lib/media-presign';
const upload = await generatePresignedUpload({
  userId, propertyId, filename, fileType, fileSize, mediaType
});
```

### Get Dashboard Metrics
```typescript
import { getDashboardMetrics } from '@/lib/owner-metrics';
const metrics = await getDashboardMetrics(userId);
```

---

## 🔍 Audit Action Types (16)

```
property.create        property.update        property.delete
property.publish       property.unpublish
media.upload           media.delete           media.reorder
enquiry.view           enquiry.respond
subscription.create    subscription.cancel
subscription.upgrade   subscription.downgrade
settings.update        profile.update
```

---

## 🏠 Property Endpoints

### List Properties
```
GET /api/owner/properties?status=published&limit=50&offset=0
```

### Create Property
```
POST /api/owner/properties
Body: { title, location, region, bedrooms, bathrooms, price... }
```

### Get Property
```
GET /api/owner/properties/[id]
```

### Update Property
```
PUT /api/owner/properties/[id]
Body: { title, bedrooms, price, isPublished... }
```

### Delete Property
```
DELETE /api/owner/properties/[id]
```

---

## 📸 Media Endpoints

### Generate Upload URL
```
POST /api/owner/media
Body: {
  "action": "presign",
  "propertyId": "prop-123",
  "filename": "photo.jpg",
  "fileType": "image/jpeg",
  "fileSize": 2048000,
  "mediaType": "image"
}
```

### Bulk Upload (Max 20)
```
POST /api/owner/media
Body: {
  "action": "bulk-presign",
  "uploads": [{ propertyId, filename, fileType, fileSize, mediaType }, ...]
}
```

### Verify Upload
```
POST /api/owner/media
Body: { "action": "verify", "fileKey": "..." }
```

### Reorder Media
```
POST /api/owner/media
Body: { "action": "reorder", "propertyId": "...", "mediaIds": [...] }
```

### Usage Stats
```
POST /api/owner/media
Body: { "action": "usage-stats" }
```

---

## 📊 Metrics Endpoints

### Dashboard Metrics
```
GET /api/owner/metrics
```

### Property Analytics
```
GET /api/owner/metrics?propertyId=prop-123
```

### Compare Properties
```
GET /api/owner/metrics?compare=prop1,prop2,prop3
```

### Export to CSV
```
GET /api/owner/metrics?export=csv
```

### Industry Benchmarks
```
GET /api/owner/metrics?benchmarks=true
```

---

## 📱 Dashboard Summary

```
GET /api/owner/dashboard
```

Returns:
- User info & subscription status
- Quick stats (properties, enquiries, views, revenue)
- Recent properties (last 5)
- Recent activity (last 10)
- Smart alerts

---

## 🎨 Media Validation

**Images:**
- Max: 10MB
- Types: JPEG, PNG, WebP, AVIF

**Videos:**
- Max: 100MB
- Types: MP4, WebM, MOV

**Documents:**
- Max: 5MB
- Types: PDF, DOC, DOCX

---

## ⏰ UK Date Format

All timestamps: **DD/MM/YYYY HH:mm:ss**

```typescript
import { nowUKFormatted } from '@/lib/date-utils';
const timestamp = nowUKFormatted(); // "12/12/2025 01:31:15"
```

---

## 🚨 Alert Types

| Type | Trigger | Action |
|------|---------|--------|
| Warning | Property limit >= 90% | Upgrade plan |
| Info | Draft properties exist | View drafts |
| Success | New enquiries | View enquiries |
| Error | Payment failed | Update payment |
| Warning | Trial ending | Subscribe now |
| Warning | Response rate < 50% | View enquiries |

---

## 🔐 Authorization

All endpoints require:
- ✅ Valid NextAuth session
- ✅ Owner role
- ✅ Resource ownership (where applicable)

---

## 📊 Metrics Structure

```typescript
{
  overview: {
    totalProperties, publishedProperties, draftProperties,
    totalEnquiries, newEnquiriesThisMonth,
    responseRate, averageResponseTime
  },
  properties: { byStatus, byType, byRegion, mostViewed, mostEnquired },
  enquiries: { total, byStatus, byPeriod, averageResponseTime, responseRate, conversionRate },
  revenue: { estimatedMonthlyRevenue, averagePricePerNight, highestPricedProperty, lowestPricedProperty },
  performance: { topPerformers, underPerformers },
  trends: { enquiries[], views[], revenue[] },
  generatedAt: "DD/MM/YYYY HH:mm:ss"
}
```

---

## 💡 Common Workflows

### Upload Photos
```typescript
// 1. Get presigned URL
const res = await fetch('/api/owner/media', {
  method: 'POST',
  body: JSON.stringify({ action: 'presign', ... })
});
const { upload } = await res.json();

// 2. Upload to S3
await fetch(upload.uploadUrl, { method: 'PUT', body: file });

// 3. Verify
await fetch('/api/owner/media', {
  method: 'POST',
  body: JSON.stringify({ action: 'verify', fileKey: upload.fileKey })
});
```

### Create & Publish Property
```typescript
// 1. Create draft
const res = await fetch('/api/owner/properties', {
  method: 'POST',
  body: JSON.stringify({ title, location, ..., isPublished: false })
});
const { property } = await res.json();

// 2. Upload media
// ... (use presigned URLs)

// 3. Publish
await fetch(`/api/owner/properties/${property.id}`, {
  method: 'PUT',
  body: JSON.stringify({ isPublished: true })
});
```

---

## 🧪 Test Coverage

✅ Audit logging (UK timestamps, 16 action types)  
✅ Property management (CRUD, pagination)  
✅ Media presign (validation, URLs)  
✅ Metrics (dashboard, analytics, trends)  
✅ Dashboard summary (alerts, recent activity)  
✅ Integration (flows, consistency)

---

## 🔗 Related Docs

- [Milestone 6 Complete Guide](MILESTONE_6_COMPLETE.md)
- [Milestone 5: Invoices & CRM](MILESTONE_5_COMPLETE.md)
- [Subscription System](SUBSCRIPTION_SYSTEM_COMPLETE.md)

---

**Status:** Production Ready ✅  
**Last Updated:** 12/12/2025 01:31:15
