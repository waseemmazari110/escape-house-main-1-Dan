# Phase 1 Testing Guide

## Quick Testing Steps

### 1. Image Upload System Test

**Navigate to:** `/owner/properties/new` (or edit existing property)

**Steps:**
1. Go to Step 7 (Media)
2. **Drag & Drop Test:**
   - Drag an image file onto the upload zone
   - Verify "Uploading..." shows
   - Verify image preview appears
   - Check hero badge on first image

3. **Click Upload Test:**
   - Click "Browse files" link
   - Select 2-3 images
   - Verify all upload simultaneously
   - Check loading spinners

4. **File Validation Test:**
   - Try uploading a PDF file → Should show error
   - Try uploading a 10MB image → Should show "too large" error
   - Try uploading valid JPG/PNG/WebP → Should succeed

5. **Reorder Test:**
   - Click UP arrow on second image → Should move to first
   - Click DOWN arrow on first image → Should move down
   - Verify hero badge moves with first image

6. **Delete Test:**
   - Click trash icon on an image
   - Verify image removed from preview
   - Check array updates in form data

7. **Mobile Test:**
   - Open on mobile device
   - Test drag-drop (if supported)
   - Test button sizes (min 44x44px)
   - Verify 2-column grid layout

**Expected Results:**
- ✅ Files upload to `/public/uploads/properties/`
- ✅ URLs returned: `/uploads/properties/[timestamp]-[random].jpg`
- ✅ Preview grid responsive (2 cols mobile, 3-4 desktop)
- ✅ Loading states show during upload
- ✅ Errors display for invalid files
- ✅ Form data updates with image URLs

---

### 2. Amenities Selector Test

**Navigate to:** `/owner/properties/new`

**Steps:**
1. Go to Step 4 (Amenities)
2. **Visual Check:**
   - Verify categories displayed:
     - Luxury Features
     - Outdoor Amenities  
     - Essential Facilities
     - Accessibility
   - Verify icons show for each amenity
   - Check 2-column grid on desktop

3. **Selection Test:**
   - Click "Hot Tub" → Should highlight blue
   - Click "WiFi" → Should highlight blue
   - Click "Hot Tub" again → Should deselect
   - Verify checkmark appears on selected
   - Check selected count updates

4. **Search Test:**
   - Type "pool" in search → Should show only Swimming Pool
   - Clear search → All amenities return
   - Type "xyz" → Should show "No amenities found"

5. **Category Test:**
   - Select amenities from each category
   - Verify all save correctly
   - Navigate to another step and back
   - Verify selections persist

6. **Mobile Test:**
   - Open on mobile
   - Verify 1-column layout
   - Test button touch targets
   - Check search functionality

**Expected Results:**
- ✅ Card-based selection (not checkboxes)
- ✅ Icons display correctly
- ✅ Active state: blue background + checkmark
- ✅ Search filters in real-time
- ✅ Selected count accurate
- ✅ Responsive layout

---

### 3. Property Listings Test

**Navigate to:** `/owner/properties`

**Steps:**
1. **List View:**
   - Verify properties display in grid
   - Check status badges (pending/approved/rejected)
   - Test filter buttons (All, Pending, Approved, Rejected)

2. **Create Property:**
   - Click "Add New Property"
   - Complete all 8 steps:
     1. Essentials: Fill title, type, description
     2. Location: Fill address, town
     3. Rooms: Set guests, bedrooms, bathrooms
     4. Amenities: Select 3-5 amenities (test new UI)
     5. Policies: Set check-in/out, rules
     6. Pricing: Set base price
     7. Media: Upload 3-5 images (test new upload)
     8. SEO: Fill slug
   - Click "Save Draft"
   - Verify success message
   - Check property appears in list

3. **Edit Property:**
   - Click Edit on existing property
   - Navigate to Step 7 (Media)
   - Upload additional image
   - Delete one image
   - Reorder images
   - Save
   - Verify changes persist

4. **Validation Test:**
   - Try clicking "Next" on Step 1 without title
   - Should show error: "This field is required"
   - Try skipping to Step 5 without completing Step 1
   - Should block with message

5. **Mobile Test:**
   - Test step navigation (horizontal scroll)
   - Complete form on mobile
   - Verify all inputs accessible
   - Check no zoom on input focus

**Expected Results:**
- ✅ All 8 steps accessible
- ✅ New image upload component works in Step 7
- ✅ New amenities selector works in Step 4
- ✅ Validation prevents skipping required fields
- ✅ Draft saves successfully
- ✅ Edits persist after save
- ✅ Mobile-friendly navigation

---

## Common Issues & Solutions

### Issue: Images not uploading
**Check:**
- Directory exists: `public/uploads/properties/`
- File permissions (if on Linux/Mac)
- Authentication token valid
- Network tab for API errors

**Solution:**
```bash
# Windows
New-Item -ItemType Directory -Force -Path "public\uploads\properties"

# Linux/Mac
mkdir -p public/uploads/properties
chmod 755 public/uploads/properties
```

### Issue: Amenities not displaying
**Check:**
- No console errors
- AmenitiesSelector imported correctly
- Icons from lucide-react available

### Issue: Form validation not working
**Check:**
- Required fields have values
- No TypeScript errors in console
- validateStep() function executes

### Issue: Step navigation broken
**Check:**
- isStepAccessible() logic
- Step 1 completed before advancing
- Console for validation errors

---

## Performance Checks

### Image Upload Performance
- [ ] Upload 1 image: < 2 seconds
- [ ] Upload 5 images simultaneously: < 10 seconds
- [ ] Large image (5MB): < 5 seconds
- [ ] Preview renders: < 500ms

### Form Performance
- [ ] Step navigation: Instant (<100ms)
- [ ] Validation feedback: Instant
- [ ] Draft save: < 3 seconds
- [ ] Final submit: < 5 seconds

### Mobile Performance
- [ ] No layout shifts
- [ ] Smooth scrolling
- [ ] Touch responses < 100ms
- [ ] No zoom on inputs

---

## Browser Testing

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (macOS)

### Mobile
- [ ] Safari (iOS)
- [ ] Chrome (Android)
- [ ] Mobile browsers (responsive mode)

### Features to Test in Each
- [ ] Image upload (drag-drop may not work on mobile)
- [ ] Amenities selection
- [ ] Form validation
- [ ] Step navigation
- [ ] Touch targets (mobile)

---

## Accessibility Checks

### Keyboard Navigation
- [ ] Tab through form fields
- [ ] Arrow keys in step navigation
- [ ] Enter to submit
- [ ] Escape to cancel

### Screen Reader
- [ ] Labels readable
- [ ] Error messages announced
- [ ] Button purposes clear
- [ ] Form structure logical

### Visual
- [ ] Sufficient color contrast
- [ ] Focus indicators visible
- [ ] Error states clear
- [ ] Touch targets ≥ 44x44px

---

## Security Checks

### Authentication
- [ ] Upload API requires auth
- [ ] Property API requires ownership
- [ ] Unauthorized requests rejected

### File Upload
- [ ] Only images accepted (JPG/PNG/WebP)
- [ ] File size limit enforced (5MB)
- [ ] No arbitrary file execution
- [ ] Filenames sanitized

### Data Validation
- [ ] Server-side validation
- [ ] SQL injection prevented (using ORM)
- [ ] XSS prevented (React escaping)

---

## Production Readiness

### Before Deployment
- [ ] All tests passed
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Environment variables set
- [ ] Upload directory created
- [ ] Database tables exist
- [ ] Stripe configured (if testing payments)

### Post-Deployment
- [ ] Test upload on production domain
- [ ] Verify images serve correctly
- [ ] Check HTTPS works for uploads
- [ ] Monitor error logs
- [ ] Test with real users

---

## Quick Smoke Test (5 minutes)

1. **Create Property** (2 min)
   - Navigate to /owner/properties/new
   - Fill Step 1-3 quickly
   - Upload 2 images in Step 7
   - Select 3 amenities in Step 4
   - Save draft

2. **Edit Property** (1 min)
   - Edit property just created
   - Add 1 more image
   - Reorder images
   - Save

3. **Mobile Check** (2 min)
   - Open on mobile device or responsive mode
   - Test image upload
   - Test amenities selection
   - Verify responsive layout

**If all 3 pass:** System ready for testing ✅
**If any fail:** Check error logs and common issues above

---

## Notes

- Test with real image files (not just dummy URLs)
- Test with various image sizes (small and large)
- Test network throttling (slow 3G) for upload feedback
- Clear browser cache if seeing old UI
- Check server console for API errors
