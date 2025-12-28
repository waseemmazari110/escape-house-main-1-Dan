# Milestone 7: Quick Reference Guide

**Photo/Media Upload System**

---

## 🎯 Key Files

```
src/lib/media-upload-handler.ts  → Presigned URLs, validation
src/lib/media-storage.ts          → Database operations
src/lib/thumbnail-generator.ts    → Thumbnail generation
src/app/api/upload/route.ts       → Upload API
src/app/api/media/route.ts        → Media list/batch
src/app/api/media/[id]/route.ts   → Single media CRUD
src/lib/test-milestone7.ts        → Test suite
```

---

## 📋 Quick Commands

### Run Tests
```bash
npx tsx src/lib/test-milestone7.ts
```

---

## 📸 Media Types & Limits

| Type | Formats | Max Size | Thumbnails |
|------|---------|----------|------------|
| Image | JPEG, PNG, WebP, AVIF, GIF | 10 MB | ✅ |
| Video | MP4, WebM, MOV, AVI | 500 MB | ✅ |
| Document | PDF, DOC, DOCX, XLS, XLSX | 20 MB | ✅ |
| Audio | MP3, WAV, OGG, M4A | 50 MB | ❌ |

---

## 🚀 Upload Flow

### 1. Initiate Upload
```typescript
POST /api/upload
{
  "action": "initiate",
  "fileName": "beach-house.jpg",
  "fileType": "image/jpeg",
  "fileSize": 2048000,
  "mediaType": "image",
  "entityType": "property",
  "entityId": "prop-123"
}
```

### 2. Upload to S3
```typescript
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'image/jpeg' }
});
```

### 3. Complete Upload
```typescript
POST /api/upload
{
  "action": "complete",
  "uploadId": "upl_AbCd1234",
  "fileKey": "uploads/properties/user123/...",
  "title": "Property Photo",
  "altText": "Beach house exterior"
}
```

---

## 📊 API Endpoints

### Upload API
```
POST /api/upload
Actions: initiate, complete, bulk-initiate, bulk-complete, list, delete, stats
```

### Media List
```
GET /api/media?fileType=image&folder=properties&limit=50
```

### Single Media
```
GET    /api/media/[id]  - Get media
PUT    /api/media/[id]  - Update metadata
DELETE /api/media/[id]  - Delete media
```

### Batch Operations
```
POST /api/media
Actions: stats, batch-delete
```

---

## 🎨 Thumbnail Sizes

- **Small:** 150x150px (WebP, 80% quality)
- **Medium:** 300x300px (WebP, 80% quality)
- **Large:** 600x600px (WebP, 80% quality)

Naming: `original-name-thumb-medium.webp`

---

## 🔐 Security Features

✅ Filename sanitization (prevents path traversal)  
✅ File size validation  
✅ Mime type validation  
✅ Presigned URL expiry (1 hour)  
✅ User authentication required  
✅ Resource ownership verification

---

## 💾 Storage Format

```
uploads/
  └── {folder}/
      └── {userId}/
          └── {timestamp}-{sanitized-filename}.ext
```

Example:
```
uploads/properties/user123/1702896000000-beach-house.jpg
```

---

## 🔍 Query Filters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `fileType` | Filter by type | `image`, `video`, `document`, `audio` |
| `folder` | Filter by folder | `properties`, `experiences` |
| `entityType` | Filter by entity | `property`, `experience` |
| `entityId` | Filter by entity ID | `prop-123` |
| `search` | Search filename/tags | `beach` |
| `limit` | Results per page | `50` (max 100) |
| `offset` | Pagination offset | `0`, `50`, `100` |
| `sortBy` | Sort field | `createdAt`, `fileName`, `fileSize` |
| `sortOrder` | Sort direction | `asc`, `desc` |

---

## 📝 Metadata Fields

```typescript
{
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document' | 'audio';
  mimeType: string;
  fileSize: number; // bytes
  width?: number; // images/videos
  height?: number; // images/videos
  duration?: number; // videos/audio (seconds)
  title?: string;
  altText?: string;
  caption?: string;
  description?: string;
  thumbnailUrl?: string;
  entityType?: string; // 'property', 'experience', etc
  entityId?: string;
  folder: string; // default: 'general'
  tags?: string[];
  isPublic: boolean;
  metadata?: Record<string, any>; // EXIF, etc
  storageProvider: string; // 's3'
  storageKey: string;
  uploadedBy: string;
  createdAt: string; // DD/MM/YYYY HH:mm:ss
  updatedAt: string; // DD/MM/YYYY HH:mm:ss
}
```

---

## 💡 Common Operations

### Upload Single Image
```typescript
const file = event.target.files[0];
const { upload } = await initiate(file);
await uploadToS3(upload.uploadUrl, file);
const { media } = await complete(upload);
```

### Bulk Upload
```typescript
const files = Array.from(event.target.files);
const { uploads } = await bulkInitiate(files);
await Promise.all(uploads.map((u, i) => uploadToS3(u.uploadUrl, files[i])));
await bulkComplete(uploads);
```

### Link to Property
```typescript
{
  entityType: 'property',
  entityId: propertyId,
  folder: 'properties',
  tags: ['hero', 'featured']
}
```

### Update Metadata
```typescript
await fetch(`/api/media/${mediaId}`, {
  method: 'PUT',
  body: JSON.stringify({
    altText: 'Updated alt text',
    tags: ['featured'],
    isPublic: true
  })
});
```

### Delete Media
```typescript
await fetch(`/api/media/${mediaId}`, { method: 'DELETE' });
```

### Batch Delete
```typescript
await fetch('/api/media', {
  method: 'POST',
  body: JSON.stringify({
    action: 'batch-delete',
    mediaIds: [1, 2, 3, 4, 5]
  })
});
```

---

## 🌍 Environment Variables

```env
AWS_REGION=eu-west-2
AWS_S3_BUCKET=escape-houses-media
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
CDN_URL=https://cdn.example.com  # Optional
```

---

## ⏰ UK Date Format

All timestamps: **DD/MM/YYYY HH:mm:ss**

```typescript
import { nowUKFormatted } from '@/lib/date-utils';
const timestamp = nowUKFormatted(); // "12/12/2025 15:45:00"
```

---

## 🧪 Test Coverage

✅ 61 tests, 100% pass rate

- Upload validation (12 tests)
- Filename sanitization (4 tests)
- File key generation (3 tests)
- Presigned URL structure (2 tests)
- Thumbnail support (4 tests)
- UK timestamp format (6 tests)
- Media type config (5 tests)
- Bulk upload validation (3 tests)
- Metadata structure (10 tests)
- Error handling (3 tests)
- Storage key format (5 tests)
- Mime type validation (4 tests)

---

## 🚨 Error Messages

| Error | Reason |
|-------|--------|
| File too large | Exceeds max size for type |
| Unsupported file type | Invalid mime type |
| Invalid filename | Empty or malformed |
| Unauthorized | Not logged in |
| Forbidden | Not owner/admin |
| Media not found | Invalid ID |
| Upload expired | Presigned URL timeout |

---

## 📊 Response Formats

### Success
```json
{
  "success": true,
  "media": { ... }
}
```

### Error
```json
{
  "error": "Error message here"
}
```

---

## 🔗 Related Docs

- [Milestone 7 Complete Guide](MILESTONE_7_COMPLETE.md)
- [Milestone 6: Owner Dashboard](MILESTONE_6_COMPLETE.md)
- [Database Schema](src/db/schema.ts)

---

**Status:** Production Ready ✅  
**Last Updated:** 12/12/2025 15:45:00
