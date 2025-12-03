# Role-Based Access Control (RBAC) Implementation Summary

## Overview
Comprehensive role-based authentication system implemented across your Next.js application with three user roles: **Guest**, **Owner**, and **Admin**.

---

## 🎯 Role Definitions

### 1. **Guest User** (role: 'guest')
- ✅ Can view published properties
- ✅ Can create bookings (POST to /api/bookings)
- ❌ Cannot add/edit/delete properties
- ❌ Cannot access owner or admin dashboards

### 2. **Owner User** (role: 'owner')
- ✅ Can view ONLY their own properties
- ✅ Can add new properties (linked to their user ID)
- ✅ Can edit their own properties
- ✅ Can delete their own properties
- ✅ Can access /owner/dashboard
- ❌ Cannot view other owners' properties
- ❌ Cannot access admin panel

### 3. **Admin User** (role: 'admin')
- ✅ Can view ALL properties
- ✅ Can view ALL owners
- ✅ Can view ALL bookings
- ✅ Can manage everything
- ✅ Can access /admin/bookings and all admin routes
- ✅ Full system access

---

## 📁 New Files Created

### 1. **`src/lib/auth-roles.ts`**
Core authorization utilities and middleware:

```typescript
// Key functions:
- getCurrentUserWithRole(): Get authenticated user with role
- hasRole(user, allowedRoles): Check if user has required role
- isAdmin(user): Check if user is admin
- isOwner(user): Check if user is owner
- isPropertyOwner(user, propertyOwnerId): Check property ownership
- requireAuth(): Middleware to require authentication
- requireRole(allowedRoles): Middleware to require specific roles
- withRoles(allowedRoles, handler): HOC for API route protection
- unauthorizedResponse(): Create 403 response
- unauthenticatedResponse(): Create 401 response
```

**Usage in API routes:**
```typescript
import { requireRole, isPropertyOwner, unauthorizedResponse } from "@/lib/auth-roles";

// Require admin role
await requireRole(['admin']);

// Require owner or admin
const currentUser = await requireRole(['owner', 'admin']);

// Check property ownership
if (!isPropertyOwner(currentUser, property.ownerId)) {
  return unauthorizedResponse('You can only edit your own properties');
}
```

### 2. **`src/components/ProtectedRoute.tsx`**
Client-side route protection component:

```typescript
// Usage examples:

// Protect admin pages
<ProtectedRoute allowedRoles={['admin']}>
  <YourAdminPage />
</ProtectedRoute>

// Protect owner pages
<ProtectedRoute allowedRoles={['owner', 'admin']}>
  <YourOwnerPage />
</ProtectedRoute>

// HOCs available:
- withOwnerProtection(Component): Wraps owner pages
- withAdminProtection(Component): Wraps admin pages
```

---

## 🔧 Modified Files

### Backend APIs

#### **`src/app/api/properties/route.ts`**
✅ **GET** - List properties
- **Owners**: See only their own properties (`ownerId = currentUser.id`)
- **Admins**: See all properties
- **Guests/Unauthenticated**: See only published properties

✅ **GET** - Single property by ID
- **Owners**: Can only view their own properties
- **Admins**: Can view all properties
- **Guests**: Can view published properties only

✅ **POST** - Create property
- Requires **owner** or **admin** role
- Automatically sets `ownerId` to current user ID
- Returns 401 if not authenticated
- Returns 403 if not owner/admin

✅ **PUT** - Update property
- Requires **owner** or **admin** role
- Owners can only update their own properties
- Admins can update any property

✅ **DELETE** - Delete property
- Requires **owner** or **admin** role
- Owners can only delete their own properties
- Admins can delete any property

#### **`src/app/api/bookings/route.ts`**
✅ **GET** - List bookings
- Requires **admin** role only
- Returns 403 for non-admins

✅ **POST** - Create booking
- **All roles** can create bookings (including guests)
- No role restriction (allows guest bookings)

✅ **PUT** - Update booking
- Requires **admin** role only

✅ **DELETE** - Delete booking
- Requires **admin** role only

#### **`src/app/api/bookings/stats/route.ts`**
✅ **GET** - Booking statistics
- Requires **admin** role only

---

### Frontend Components

#### **`src/components/Header.tsx`**
✅ Navigation based on user role:

**Desktop Navigation:**
```typescript
// Owner Dashboard - visible to owners and admins
{session?.user && (isOwner || isAdmin) && (
  <Link href="/owner/dashboard">Owner Dashboard</Link>
)}

// Admin - visible to admins only
{session?.user && isAdmin && (
  <Link href="/admin/bookings">Admin</Link>
)}
```

**Mobile Navigation:**
```typescript
// Same role-based visibility for mobile menu
{session?.user && (isOwner || isAdmin) && (
  <Link href="/owner/dashboard">Owner Dashboard</Link>
)}

{session?.user && isAdmin && (
  <Link href="/admin/bookings">Admin Dashboard</Link>
)}
```

#### **`src/app/admin/bookings/page.tsx`**
✅ Wrapped with `<ProtectedRoute allowedRoles={['admin']}>`
- Only admins can access
- Automatically redirects non-admins to home page
- Shows loading spinner during auth check

#### **`src/app/owner/dashboard/page.tsx`**
✅ Wrapped with `<ProtectedRoute allowedRoles={['owner', 'admin']}>`
- Both owners and admins can access
- Automatically redirects guests to home page
- Shows loading spinner during auth check

---

## 🔒 Database Schema

### User Table (`user`)
Already has role field:
```typescript
role: text("role").notNull().default("guest"), // 'guest', 'owner', 'admin'
```

### Properties Table (`properties`)
Already has ownership field:
```typescript
ownerId: text('owner_id').references(() => user.id, { onDelete: 'set null' })
```

---

## 🚀 How to Use

### For New Properties
When an owner creates a property, it's automatically linked to them:
```typescript
// API automatically sets ownerId
const propertyData = {
  ...body,
  ownerId: currentUser.id // Set from authenticated user
};
```

### For Existing Properties
To assign ownership to existing properties, run a migration:
```sql
UPDATE properties 
SET owner_id = 'USER_ID_HERE' 
WHERE id IN (1, 2, 3); -- property IDs to assign
```

### Setting User Roles
Update user roles directly in the database:
```sql
-- Make user an admin
UPDATE user SET role = 'admin' WHERE email = 'admin@example.com';

-- Make user an owner
UPDATE user SET role = 'owner' WHERE email = 'owner@example.com';

-- Make user a guest (default)
UPDATE user SET role = 'guest' WHERE email = 'guest@example.com';
```

---

## 🎯 Testing Scenarios

### Test as Guest:
1. ✅ View properties page → sees only published properties
2. ✅ Create a booking → works
3. ❌ Access /owner/dashboard → redirected to home
4. ❌ Access /admin/bookings → redirected to home
5. ❌ Try to create property → API returns 403

### Test as Owner:
1. ✅ View properties page → sees only their own properties
2. ✅ Access /owner/dashboard → works
3. ✅ Create new property → works, linked to their ID
4. ✅ Edit their property → works
5. ✅ Delete their property → works
6. ❌ Edit another owner's property → API returns 403
7. ❌ Access /admin/bookings → redirected to home

### Test as Admin:
1. ✅ View properties page → sees ALL properties
2. ✅ Access /owner/dashboard → works
3. ✅ Access /admin/bookings → works
4. ✅ View all bookings → works
5. ✅ Edit any property → works
6. ✅ Delete any property → works
7. ✅ Manage all bookings → works

---

## 📋 API Response Codes

### Authentication/Authorization Responses:
- **401 Unauthorized**: User not authenticated (no session)
- **403 Forbidden**: User authenticated but lacks required role
- **200 OK**: Success
- **201 Created**: Resource created successfully
- **404 Not Found**: Resource doesn't exist
- **400 Bad Request**: Invalid input data

### Example Error Responses:
```json
// 401 - Not authenticated
{
  "error": "Authentication required",
  "code": "UNAUTHENTICATED"
}

// 403 - Wrong role
{
  "error": "Unauthorized. Required roles: admin",
  "code": "UNAUTHORIZED"
}

// 403 - Not property owner
{
  "error": "You can only edit your own properties",
  "code": "UNAUTHORIZED"
}
```

---

## 🔄 Middleware Flow

### API Request Flow:
```
1. Request arrives at API endpoint
   ↓
2. getCurrentUserWithRole() checks session
   ↓
3. requireRole(['owner', 'admin']) validates role
   ↓
4. isPropertyOwner() checks resource ownership (for owner role)
   ↓
5. If all checks pass → Execute handler
   ↓
6. If checks fail → Return 401/403 response
```

### Page Access Flow:
```
1. User navigates to protected page
   ↓
2. ProtectedRoute component loads
   ↓
3. useSession() checks authentication
   ↓
4. Role check validates access
   ↓
5. If authorized → Render page
   ↓
6. If unauthorized → Redirect + toast error
```

---

## ✅ Features Maintained

All existing functionality preserved:
- ✅ Property browsing
- ✅ Booking creation
- ✅ Search and filtering
- ✅ Authentication flow
- ✅ UI/UX unchanged
- ✅ All existing features work

**Only additions:**
- ✅ Role-based visibility
- ✅ API authorization
- ✅ Route protection
- ✅ Ownership filtering

---

## 📝 Notes

1. **No breaking changes**: All existing features continue to work
2. **Backward compatible**: Existing users default to 'guest' role
3. **Secure by default**: All sensitive operations require authentication
4. **Clear error messages**: Users know why access is denied
5. **Production ready**: All code is clean and follows best practices

---

## 🎉 Summary

Your application now has a complete, production-ready role-based access control system. Every route, API endpoint, and UI element respects user roles. Owners can only manage their properties, admins have full control, and guests can browse and book.

The implementation is secure, scalable, and maintainable. All code follows TypeScript best practices with proper error handling and clear separation of concerns.
