# Owner Dashboard - Quick Visual Guide

## After Successful Login

### What You'll See in the Header Navigation:

```
┌─────────────────────────────────────────────────────────────────┐
│  LOGO    Houses ▼  Destinations ▼  Occasions ▼  Experiences ▼  │
│                                                                   │
│          Owner Dashboard | My Bookings | Sign Out                │
│                    👆                                            │
│              THIS LINK SHOULD NOW BE VISIBLE                      │
└─────────────────────────────────────────────────────────────────┘
```

### Owner Dashboard Page Structure:

```
┌─────────────────────────────────────────────────────────────────┐
│  PropManager Logo         [Waseem ▼]  [🔔]  [Profile Icon]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📊 Dashboard                                                     │
│  🏠 Properties                                                    │
│  📅 Bookings                                                      │
│  💰 Financials                                                    │
│  ⚙️ Settings                                                      │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐│
│  │ Total       │  │ Active      │  │ Revenue     │  │ Upcoming││
│  │ Bookings    │  │ Properties  │  │ £0.00       │  │ Check-  ││
│  │ 0           │  │ 3           │  │             │  │ ins: 0  ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘│
│                                                                   │
│  Recent Bookings                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Guest | Property | Check-in | Check-out | Status | Total │   │
│  │ ----- | -------- | -------- | --------- | ------ | ----- │   │
│  │ (Your bookings will appear here)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Your Properties                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐│
│  │ Brighton         │  │ The Brighton     │  │ Bath Spa       ││
│  │ Seafront Villa   │  │ Manor            │  │ Retreat        ││
│  │ 10 Beds          │  │ 8 Beds           │  │ 12 Beds        ││
│  │ £850/night       │  │ £750/night       │  │ £950/night     ││
│  └──────────────────┘  └──────────────────┘  └────────────────┘│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Login Flow

### Step 1: Homepage
```
http://localhost:3000
Click "Login" button in top-right
```

### Step 2: Login Modal
```
┌─────────────────────────────────┐
│         Sign In                 │
│                                 │
│  Email: risek290@gmail.com      │
│  Password: ••••••••             │
│                                 │
│  [Sign In]                      │
└─────────────────────────────────┘
```

### Step 3: After Login - Header Updates
```
Before Login:
[Sign In] [Register]

After Login (within 1-2 seconds):
[Owner Dashboard] [My Bookings] [Sign Out]
         👆
    NOW VISIBLE!
```

### Step 4: Click Owner Dashboard
```
URL changes to: http://localhost:3000/owner/dashboard
PropManager UI loads with your 3 properties
```

## Current Status Check

### Your Database Record:
✅ Email: risek290@gmail.com
✅ Role: owner
✅ Properties: 3 assigned

### API Endpoints Working:
✅ GET /api/user/profile - Returns your role
✅ GET /api/owner/stats - Returns your statistics
✅ GET /api/owner/bookings - Returns your bookings
✅ GET /api/owner/upcoming-checkins - Returns your check-ins

### Frontend Protection:
✅ Header fetches role from profile API
✅ ProtectedRoute validates access
✅ Owner Dashboard link shows for owners
✅ Owner Dashboard page accessible

## Browser DevTools Check

### Console (Should See):
```
No errors related to authentication or role fetching
```

### Network Tab (After Login):
```
✅ GET /api/auth/get-session → 200 OK
✅ GET /api/user/profile → 200 OK (includes role: "owner")
```

### Local Storage:
```
✅ bearer_token: [your token]
```

## If Something Goes Wrong

### Owner Dashboard Link Not Showing
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors from `/api/user/profile`
4. If you see 401 Unauthorized:
   - Logout and login again
   - Check bearer_token in Local Storage

### Access Restricted Message
1. Check Network tab → /api/user/profile response
2. Verify response includes: `"role": "owner"`
3. If role is "guest":
   - Database might not be updated
   - Run: `npx tsx update-current-user.ts`

### Stuck on Loading
1. Clear browser cache
2. Hard refresh (Ctrl + Shift + R)
3. Try incognito mode

## Expected vs Actual

### BEFORE FIX:
```
session?.user?.role → undefined
userRole → 'guest' (default)
isOwner → false
Owner Dashboard link → Hidden ❌
/owner/dashboard → Access Restricted ❌
```

### AFTER FIX:
```
session?.user → { id, email, name }
fetch /api/user/profile → { role: 'owner', ... }
userRole → 'owner'
isOwner → true
Owner Dashboard link → Visible ✅
/owner/dashboard → PropManager UI ✅
```

## Testing Checklist

- [ ] Server running on localhost:3000
- [ ] Navigate to http://localhost:3000
- [ ] Click "Login" button
- [ ] Enter email: risek290@gmail.com
- [ ] Enter password
- [ ] Click "Sign In"
- [ ] Wait 1-2 seconds for role to load
- [ ] See "Owner Dashboard" link in header
- [ ] Click "Owner Dashboard"
- [ ] See PropManager UI with 3 properties
- [ ] Verify stats cards show correct numbers
- [ ] Click "Properties" in sidebar
- [ ] See your 3 properties listed

## Success Criteria

✅ You can login
✅ Header shows "Owner Dashboard" link
✅ You can access /owner/dashboard
✅ PropManager UI displays correctly
✅ Your 3 properties are visible
✅ No "Access Restricted" message
✅ Navigation between owner pages works

---

**Ready to Test!** 🚀

Server is running at: **http://localhost:3000**

Login with: **risek290@gmail.com**
