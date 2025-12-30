# 🧪 Property Approval System - Testing Guide

**Quick 5-Minute Test to Verify Everything Works**

---

## 🎯 Prerequisites

- Server running on `localhost:3000` (or your dev server)
- Test accounts:
  - **Owner Account:** Email/password for owner role
  - **Admin Account:** Email/password for admin role
- Browser (Chrome/Firefox/Edge)

---

## ✅ Test 1: Owner Submits Property (Pending Status)

### Steps:
1. **Login as Owner**
   - Navigate to `/login`
   - Enter owner credentials
   - Should redirect to `/owner/dashboard`

2. **Navigate to Properties**
   - Click "Properties" in sidebar OR
   - Go directly to `/owner/properties`

3. **Add New Property**
   - Click "Add New Property" button
   - Fill in required fields:
     - Property Name: "Test Brighton Cottage"
     - Location: "Brighton"
     - Region: "South East"
     - Guests: 4
     - Bedrooms: 2
     - Bathrooms: 1
     - Base Price: £100
     - Upload at least 1 image
   - Click "Submit" or "Save"

4. **Verify Pending Status**
   - ✅ Property should appear in "My Properties" list
   - ✅ Should see **"⏱ Pending"** badge (YELLOW)
   - ✅ Should see yellow alert: "This property is awaiting admin approval"
   - ✅ Click "Pending" filter tab → Count should show (1)

### Expected Result:
```
✅ Property created with status='pending'
✅ Yellow badge visible
✅ Warning message displayed
✅ Filter tab working
```

---

## ✅ Test 2: Property NOT Visible on Frontend

### Steps:
1. **Open Incognito/Private Window** (or logout)
2. **Navigate to Public Properties Page**
   - Go to `/properties` or main properties listing
   - Browse available properties

3. **Search for Your Test Property**
   - Look for "Test Brighton Cottage"
   - Try searching by name

### Expected Result:
```
❌ Property "Test Brighton Cottage" should NOT appear
❌ Should not be in search results
❌ Should not be accessible by direct URL
✅ Only approved properties visible
```

---

## ✅ Test 3: Admin Views Pending Properties

### Steps:
1. **Logout from Owner Account**
   - Click logout in menu

2. **Login as Admin**
   - Navigate to `/login`
   - Enter admin credentials
   - Should redirect to `/admin/dashboard`

3. **Navigate to Approvals**
   - Click "Property Approvals" in sidebar OR
   - Go directly to `/admin/properties/approvals`

4. **View Pending Properties**
   - ✅ Should see **"Pending Review"** tab with count badge (1)
   - ✅ Click "Pending Review" tab
   - ✅ Should see "Test Brighton Cottage" in the list

5. **Verify Property Details**
   - ✅ Property image visible
   - ✅ Property name: "Test Brighton Cottage"
   - ✅ Location: Brighton, South East
   - ✅ Owner name and email displayed
   - ✅ Guest capacity, bedrooms, bathrooms shown
   - ✅ Pricing information displayed
   - ✅ Submission date visible

### Expected Result:
```
✅ Admin can see pending property
✅ All details displayed correctly
✅ Owner information visible
✅ Action buttons available
```

---

## ✅ Test 4: Admin Approves Property

### Steps:
1. **From Approvals Page** (as admin)
2. **Find "Test Brighton Cottage"**
3. **Click "Approve & Publish" Button**
   - Should see loading state on button
   - Should see success message/toast

4. **Verify Approval**
   - ✅ Property should disappear from "Pending" tab
   - ✅ Click "Approved" tab → Should see the property there
   - ✅ Should see green badge **"✓ Approved"**
   - ✅ Should see approval date
   - ✅ Should see approver name

### Expected Result:
```
✅ Property moved to "Approved" tab
✅ Green badge visible
✅ Approval metadata shown
```

---

## ✅ Test 5: Property NOW Visible on Frontend

### Steps:
1. **Open Incognito/Private Window** (or logout)
2. **Navigate to Public Properties Page**
   - Go to `/properties`
   - Browse available properties

3. **Search for Your Test Property**
   - Look for "Test Brighton Cottage"
   - Should now be visible!

4. **Click on Property**
   - Should open property detail page
   - All details should be visible

### Expected Result:
```
✅ Property "Test Brighton Cottage" NOW VISIBLE
✅ Can be found in search/listings
✅ Detail page accessible
✅ All information displayed
```

---

## ✅ Test 6: Owner Sees Approved Status

### Steps:
1. **Logout from Admin**
2. **Login as Owner** (same owner who submitted)
3. **Navigate to `/owner/properties`**

4. **Find "Test Brighton Cottage"**
   - ✅ Should see **"✓ Approved"** badge (GREEN)
   - ✅ Should see green success message: "This property is approved and live"
   - ✅ Click "Approved" filter tab → Should be listed there

### Expected Result:
```
✅ Owner sees green approved badge
✅ Success message displayed
✅ Filter tab shows property
```

---

## ✅ Test 7: Rejection Workflow

### Steps:
1. **Login as Owner**
2. **Submit Another Property**
   - Name: "Test London Flat"
   - Fill in other details
   - Submit

3. **Login as Admin**
4. **Navigate to `/admin/properties/approvals`**
5. **Click "Pending Review" Tab**
6. **Find "Test London Flat"**
7. **Click "Reject" Button**
   - Should see prompt for rejection reason
   - Enter: "Property images are low quality"
   - Click OK/Submit

8. **Verify Rejection**
   - ✅ Property disappears from "Pending" tab
   - ✅ Click "Rejected" tab → Property appears there
   - ✅ Should see red badge **"✗ Rejected"**
   - ✅ Should see rejection reason displayed

9. **Check Owner View**
   - Logout from admin
   - Login as owner
   - Go to `/owner/properties`
   - Find "Test London Flat"
   - ✅ Should see **"✗ Rejected"** badge (RED)
   - ✅ Should see red alert with rejection reason
   - ✅ Message: "Property images are low quality"

10. **Verify Not on Frontend**
    - Open incognito window
    - Go to `/properties`
    - ✅ "Test London Flat" should NOT be visible

### Expected Result:
```
✅ Admin can reject with reason
✅ Owner sees rejection reason
✅ Property NOT visible on frontend
✅ Red badge and alert displayed
```

---

## 📊 Complete Test Summary

After completing all tests, you should have:

| Test | What It Proves | Status |
|------|----------------|--------|
| 1 | Owner can submit → Pending status | ✅ |
| 2 | Pending properties hidden from public | ✅ |
| 3 | Admin can view pending properties | ✅ |
| 4 | Admin can approve properties | ✅ |
| 5 | Approved properties visible on frontend | ✅ |
| 6 | Owner sees approved status | ✅ |
| 7 | Rejection workflow works | ✅ |

---

## 🐛 Troubleshooting

### Issue: Property not showing in admin pending queue
**Solutions:**
- Check property was created successfully (check database)
- Verify property status is 'pending'
- Refresh the page
- Check admin authentication

### Issue: Approved property not visible on frontend
**Solutions:**
- Check `status = 'approved'` in database
- Check `isPublished = true` in database
- Clear browser cache
- Verify public-listings.ts has status filter

### Issue: Owner can't see rejection reason
**Solutions:**
- Check `rejectionReason` field in database
- Verify rejection reason was saved by admin
- Refresh owner properties page
- Check owner-properties page.tsx displays rejection

### Issue: Status badge not showing correct color
**Solutions:**
- Check CSS classes in page.tsx
- Verify badge component rendering
- Clear browser cache
- Check for JavaScript errors in console

---

## 🔍 Quick Database Checks

Use these queries to verify data:

```sql
-- Check property status
SELECT id, title, status, isPublished, rejectionReason 
FROM properties 
WHERE title LIKE '%Test%';

-- Check approval metadata
SELECT id, title, status, approvedBy, approvedAt 
FROM properties 
WHERE status = 'approved';

-- Check rejection reasons
SELECT id, title, status, rejectionReason 
FROM properties 
WHERE status = 'rejected';
```

---

## ✅ Success Criteria

**All tests passing means:**
- ✅ Complete approval workflow functional
- ✅ Status transitions working correctly
- ✅ UI displaying all status information
- ✅ Role-based access control working
- ✅ Frontend filtering working correctly
- ✅ Rejection workflow with reasons working

**SYSTEM IS PRODUCTION READY! 🎉**

---

## 📝 Test Log Template

Copy this and mark as you test:

```
Date: __________
Tester: __________

[ ] Test 1: Owner Submit → Pending
[ ] Test 2: Pending Hidden from Frontend
[ ] Test 3: Admin View Pending
[ ] Test 4: Admin Approve
[ ] Test 5: Approved Visible on Frontend
[ ] Test 6: Owner See Approved Status
[ ] Test 7: Rejection Workflow

Issues Found:
_________________________________
_________________________________

Overall Status: [ PASS / FAIL ]
```

---

**Testing Guide Version:** 1.0  
**Last Updated:** December 18, 2025  
**Status:** Ready for Testing
