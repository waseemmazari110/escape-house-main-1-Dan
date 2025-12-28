"""
RBAC SYSTEM - VISUAL FLOW DIAGRAMS & DATA FLOW
"""

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 1: REQUEST FLOW - ROUTE PROTECTION
═══════════════════════════════════════════════════════════════════════════════

User Request to /admin/dashboard
        ↓
    Is authenticated?
    ├─ NO → Redirect to /auth/sign-in with returnTo=/admin/dashboard
    └─ YES ↓
         Is role in PROTECTED_ROUTES[/admin]?
         ├─ NO (role='guest') → Redirect to /properties
         ├─ NO (role='owner') → Redirect to /owner/dashboard
         └─ YES (role='admin') ↓
              Render page ✅

Source: src/middleware.ts (automatic for all routes)

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 2: REQUEST FLOW - API ENDPOINT PROTECTION
═══════════════════════════════════════════════════════════════════════════════

GET /api/admin/users
        ↓
await requireAdmin(request)
        ↓
Is there a session?
├─ NO → Return 401 Unauthorized ✗
└─ YES ↓
     Is user.role === 'admin'?
     ├─ NO → Log unauthorized attempt, Return 403 Forbidden ✗
     └─ YES ↓
          Return { authorized: true, user } ✓
             ↓
          Handler code runs with authResult.user

Source: src/lib/api-auth.ts (requireAdmin, requireAuth, etc.)

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 3: REQUEST FLOW - OWNERSHIP CHECK (Resource-Level)
═══════════════════════════════════════════════════════════════════════════════

PATCH /api/owner/properties/123 (edit a property)
        ↓
await requireAuth(request, ['owner', 'admin'])
        ↓
Is user authenticated with owner or admin role?
├─ NO → Return 403 Forbidden ✗
└─ YES ↓
     property = await getProperty(123)
     ↓
     canEditResource(user.role, property.ownerId, user.id)?
     ├─ admin role? → YES ✅
     ├─ owner role AND property.ownerId === user.id? → YES ✅
     ├─ other → NO ✗
     ├─ NO → Return 403 Forbidden ✗
     └─ YES ↓
          Update property ✓

Source: src/lib/rbac-utils.ts (canEditResource function)

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 4: REQUEST FLOW - COMPONENT PROTECTION (Frontend)
═══════════════════════════════════════════════════════════════════════════════

Render <ProtectedRoute allowedRoles={['admin']}>
        ↓
useSession() → Get user session
        ↓
Is authenticated?
├─ NO → Show loading spinner → Fetch /api/user/profile
│       ├─ NO session → Redirect to /auth/sign-in ✗
│       └─ Has session ↓
└─ YES ↓
     Is user.role in allowedRoles?
     ├─ NO → Redirect to appropriate dashboard (admin→/admin/dashboard, owner→/owner/dashboard)
     └─ YES ↓
          Render children ✅

Source: src/components/ProtectedRoute.tsx

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 5: ROLE HIERARCHY & PERMISSIONS
═══════════════════════════════════════════════════════════════════════════════

Admin (Hierarchy: 3)
├─ All permissions
├─ Can: Manage users, properties, payments, settings
├─ Can manage: Owners, Guests
└─ Permissions: ~20+ actions (users:*, properties:*, payments:*, system:*)

     ↓ Can inherit

Owner (Hierarchy: 2)
├─ Partial permissions
├─ Can: Create/edit/delete own properties, view own bookings
├─ Can manage: Guest bookings on own properties (if configured)
└─ Permissions: ~12 actions (properties:*, bookings:view_property, payments:view_own)

     ↓ Can inherit

Guest (Hierarchy: 1)
├─ Minimal permissions
├─ Can: Browse properties, create bookings, view own bookings
├─ Can manage: Nothing
└─ Permissions: ~5 actions (properties:view, bookings:create, bookings:view_own)

Code Location: src/lib/rbac-utils.ts (ROLE_HIERARCHY, ROLE_PERMISSIONS)

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 6: DATABASE & SESSION FLOW
═══════════════════════════════════════════════════════════════════════════════

User Table (SQLite)
├─ id
├─ email
├─ password (hashed)
└─ role ('guest' | 'owner' | 'admin')  ← This field!

         ↓ (Better-Auth)

Session (created on login)
├─ user: {
│   id
│   email
│   role  ← Retrieved from user table
├─ sessionToken
└─ expiresAt

         ↓ (Stored in cookies/localStorage)

Request with Session
├─ Middleware checks session.user.role
├─ API handler gets role from session
└─ Components get role from useSession()

Sources: 
  - src/db/schema.ts (user table definition)
  - src/lib/auth.ts (Better-Auth config with role in additionalFields)
  - src/lib/auth-roles.ts (Helper functions for role checks)

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 7: AUDIT LOGGING FLOW
═══════════════════════════════════════════════════════════════════════════════

User makes unauthorized request
        ↓
Middleware or API handler rejects (401/403)
        ↓
Call auditLog({
  action: 'API_UNAUTHORIZED_ACCESS' | 'API_FORBIDDEN_ACCESS',
  userId: user.id,
  ipAddress: request.ip,
  requiredRoles: ['admin'],
  userRole: 'guest',
  endpoint: '/api/admin/users',
  method: 'GET',
  timestamp: new Date()
})
        ↓
Insert into auditLog table
        ↓
Can query: SELECT * FROM auditLog WHERE action LIKE 'API_%'

Query unauthorized attempts:
  SELECT * FROM auditLog 
  WHERE action IN ('API_UNAUTHORIZED_ACCESS', 'API_FORBIDDEN_ACCESS')
  ORDER BY timestamp DESC
  LIMIT 20;

Sources:
  - src/lib/audit-logger.ts (auditLog function)
  - src/lib/api-auth.ts (calls auditLog on 401/403)

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 8: FILE STRUCTURE & DEPENDENCIES
═══════════════════════════════════════════════════════════════════════════════

User Request
    ↓
middleware.ts
├─ Reads: PROTECTED_ROUTES config
├─ Uses: getSession() from lib/auth.ts
├─ Returns: Redirect or pass through
└─ Protects: All /admin/*, /owner/*, /guest/* routes

    ↓

API Route Handler
├─ Imports: requireAdmin, requireAuth from lib/api-auth.ts
├─ Calls: await requireAuth(request, allowedRoles)
├─ Uses: canEditResource from lib/rbac-utils.ts
├─ Returns: 401/403 or normal response
└─ Calls: auditLog() from lib/audit-logger.ts

    ↓

Frontend Component
├─ Imports: ProtectedRoute from components/ProtectedRoute.tsx
├─ Uses: useUserRole() hook
├─ Imports: canEditResource from lib/rbac-utils.ts
├─ Returns: Conditional UI based on role
└─ Calls: API with role check

Dependencies Chain:
  middleware.ts
    ↓
    auth.ts (getSession)
    ↓
    auth-roles.ts (role helpers)

  api-auth.ts
    ↓
    auth-roles.ts
    ↓
    audit-logger.ts

  rbac-utils.ts
    ↓
    auth-roles.ts (UserRole type)

  components/ProtectedRoute.tsx
    ↓
    auth-client.ts

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 9: COMPLETE REQUEST FLOW (END-TO-END)
═══════════════════════════════════════════════════════════════════════════════

1. USER OPENS BROWSER
   ↓
2. Navigate to /admin/dashboard
   ↓
3. MIDDLEWARE.TS INTERCEPTS
   ├─ Check: Is user authenticated?
   │  └─ NO: Redirect to /auth/sign-in → END
   └─ YES: Check user role
      ├─ If role not in PROTECTED_ROUTES[/admin]: Redirect to dashboard → END
      └─ If role = admin: Continue to page
   ↓
4. BROWSER RENDERS ADMIN PAGE
   ↓
5. PAGE COMPONENT MOUNTS
   ├─ Imports ProtectedRoute
   ├─ Wraps content: <ProtectedRoute allowedRoles={['admin']}>
   └─ useSession() hook runs
      ├─ Check session exists
      └─ Get user.role = 'admin'
   ↓
6. COMPONENT RENDERS (because role is admin)
   ├─ Renders <PropertyCard> components
   └─ Each card imports canEditResource
      ├─ canEditResource(user.role='admin', property.ownerId=5, user.id=1)
      └─ Admin can edit any → Show edit button
   ↓
7. USER CLICKS "EDIT PROPERTY"
   ↓
8. HANDLER CALLS API
   └─ PATCH /api/owner/properties/123
      ├─ Includes session in headers
      ↓
9. API-AUTH.TS CHECKS
   └─ await requireAuth(request, ['owner', 'admin'])
      ├─ Extract session from request
      ├─ Get user.role = 'admin'
      ├─ Is 'admin' in ['owner', 'admin']? YES
      └─ Return { authorized: true, user }
   ↓
10. API HANDLER EXECUTES
    ├─ Get property from database
    ├─ Call canEditResource('admin', property.ownerId, user.id)
    ├─ Admin role → Can edit
    ├─ Update property in database
    └─ Return 200 OK with updated data
   ↓
11. FRONTEND UPDATES
    └─ Show success message
    └─ Refresh property card

═══════════════════════════════════════════════════════════════════════════════
DIAGRAM 10: UNAUTHORIZED REQUEST FLOW (SECURITY)
═══════════════════════════════════════════════════════════════════════════════

Guest User Tries to Access /admin/dashboard
        ↓
MIDDLEWARE.TS
├─ Check: Is user authenticated? YES (guest logged in)
├─ Check: Is role in PROTECTED_ROUTES[/admin]?
│  └─ Required: ['admin'], Actual: 'guest' → NO ✗
└─ Action: Redirect to /properties (guest dashboard)

Guest User Calls API: GET /api/admin/users
        ↓
API-AUTH.TS (requireAdmin)
├─ Check: Is user authenticated? YES
├─ Check: Is role 'admin'?
│  └─ Actual: 'guest' → NO ✗
├─ Action: Call auditLog({
│   action: 'API_FORBIDDEN_ACCESS',
│   userId: guest_user_id,
│   requiredRoles: ['admin'],
│   userRole: 'guest',
│   endpoint: '/api/admin/users'
│ })
└─ Response: 403 Forbidden
   {
     "error": "Forbidden: Insufficient permissions",
     "requiredRoles": ["admin"],
     "userRole": "guest"
   }

Owner Tries to Edit Another Owner's Property
        ↓
API-AUTH.TS (requireAuth with ['owner', 'admin'])
├─ Check: Is user authenticated? YES
├─ Check: Is role in ['owner', 'admin']? YES (owner role)
└─ Return: { authorized: true, user }
        ↓
API HANDLER
├─ Get property from database
│  └─ property.ownerId = 5 (owner 5 owns this)
├─ Call canEditResource('owner', 5, user.id=7)
│  └─ User 7 is owner but doesn't own property 5 → NO ✗
└─ Response: 403 Forbidden
   {
     "error": "Forbidden: Cannot edit this property"
   }
        ↓
AUDIT LOG ENTRY (if configured)
   {
     action: 'RESOURCE_UNAUTHORIZED_ACCESS',
     userId: 7,
     resourceType: 'property',
     resourceId: 123,
     resourceOwnerId: 5,
     timestamp: ...
   }

═══════════════════════════════════════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════════════════════════════════════

✅ Middleware catches unauthorized route access → Redirect
✅ API handlers catch unauthorized API calls → 403 Forbidden
✅ Components hide UI for unauthorized users
✅ Ownership checks prevent cross-user access
✅ Audit logging tracks all unauthorized attempts
✅ Extensible system for future roles and permissions
✅ Production-ready implementation

Your RBAC system has 3 protective layers:
  1. Route-level (middleware.ts)
  2. API-level (api-auth.ts)
  3. Component-level (components + rbac-utils.ts)
"""
