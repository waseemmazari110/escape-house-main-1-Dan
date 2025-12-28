"""
RBAC IMPLEMENTATION - COMPLETE FILE STRUCTURE & REFERENCE

Your project now has a complete role-based access control system with:
✓ Middleware for route protection
✓ API utilities for endpoint protection
✓ Permission system with granular controls
✓ Ownership checks for resource-level access
✓ Audit logging for security monitoring
✓ Comprehensive documentation and examples

═══════════════════════════════════════════════════════════════════════════════
"""

PROJECT STRUCTURE WITH RBAC FILES
═══════════════════════════════════════════════════════════════════════════════

escape-houses-1-main/
│
├── src/
│   ├── app/
│   │   ├── middleware.ts ⭐ NEW - Route-level RBAC protection
│   │   │   ├─ Protects /admin/*, /owner/*, /guest/* routes
│   │   ├─ Redirects unauthorized users
│   │   │   └─ Uses PROTECTED_ROUTES configuration
│   │   │
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── route.ts (ADD requireAdmin)
│   │   │   │   ├── users/route.ts (ADD requireAdmin)
│   │   │   │   ├── payments/route.ts (ADD requireAdmin)
│   │   │   │   └── RBAC_EXAMPLES.md ⭐ NEW - See examples here!
│   │   │   │
│   │   │   ├── owner/
│   │   │   │   ├── route.ts (ADD requireAuth(['owner','admin']))
│   │   │   │   ├── properties/
│   │   │   │   │   ├── route.ts (ADD ownership checks)
│   │   │   │   │   └── [id]/route.ts (ADD ownership checks)
│   │   │   │   ├── bookings/route.ts (ADD ownership checks)
│   │   │   │   └── payments/route.ts (ADD ownership checks)
│   │   │   │
│   │   │   ├── guest/
│   │   │   │   ├── bookings/route.ts (ADD requireAuth(['guest','owner','admin']))
│   │   │   │   └── reviews/route.ts (ADD requireAuth(['guest','owner','admin']))
│   │   │   │
│   │   │   └── public/ (no protection needed - for public browse)
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx (VERIFY ProtectedRoute wrapping)
│   │   │   ├── dashboard/page.tsx (VERIFY ProtectedRoute)
│   │   │   ├── users/page.tsx (VERIFY ProtectedRoute)
│   │   │   ├── payments/page.tsx (VERIFY ProtectedRoute)
│   │   │   └── approvals/page.tsx (VERIFY ProtectedRoute)
│   │   │
│   │   ├── owner/
│   │   │   ├── layout.tsx (VERIFY ProtectedRoute wrapping)
│   │   │   ├── dashboard/page.tsx (VERIFY ProtectedRoute)
│   │   │   ├── properties/page.tsx (VERIFY ProtectedRoute)
│   │   │   ├── bookings/page.tsx (VERIFY ProtectedRoute)
│   │   │   └── payments/page.tsx (VERIFY ProtectedRoute)
│   │   │
│   │   ├── guest/
│   │   │   ├── dashboard/page.tsx (VERIFY ProtectedRoute)
│   │   │   └── bookings/page.tsx (VERIFY ProtectedRoute)
│   │   │
│   │   └── globals.css (Already updated - uses accent tokens)
│   │
│   ├── lib/
│   │   ├── api-auth.ts ⭐ NEW - API endpoint protection
│   │   │   ├─ requireAuth(request, allowedRoles)
│   │   │   ├─ requireAdmin(request)
│   │   │   ├─ requireOwner(request)
│   │   │   ├─ requireGuest(request)
│   │   │   └─ withRoleProtection(roles, handler)
│   │   │
│   │   ├── rbac-utils.ts ⭐ NEW - RBAC permissions & helpers
│   │   │   ├─ ROLE_HIERARCHY: { guest: 1, owner: 2, admin: 3 }
│   │   │   ├─ ROLE_DESCRIPTIONS: User-friendly role names
│   │   │   ├─ ROLE_PERMISSIONS: Per-role permission Sets
│   │   │   ├─ canPerformAction(role, action)
│   │   │   ├─ canManageRole(actorRole, targetRole)
│   │   │   ├─ canViewResource(role, ownerId, userId)
│   │   │   ├─ canEditResource(role, ownerId, userId)
│   │   │   ├─ canDeleteResource(role, ownerId, userId)
│   │   │   ├─ getAccessibleRoutes(role)
│   │   │   ├─ getDashboardUrl(role)
│   │   │   └─ [10+ more utility functions]
│   │   │
│   │   ├── auth.ts (Already has role support)
│   │   ├── auth-client.ts (Already configured)
│   │   └── auth-roles.ts (Already has role helpers)
│   │
│   ├── components/
│   │   ├── ProtectedRoute.tsx (Already exists - verified)
│   │   │   ├─ useSession() hook integration
│   │   │   ├─ useUserRole() hook for role info
│   │   │   ├─ withOwnerProtection() HOC
│   │   │   └─ withAdminProtection() HOC
│   │   │
│   │   ├── PropertyCard.tsx (ADD canEditResource check)
│   │   ├── BookingCard.tsx (ADD canEditResource check)
│   │   ├── PaymentItem.tsx (ADD canViewResource check)
│   │   └── [Your other components] (ADD ownership checks as needed)
│   │
│   └── db/
│       ├── schema.ts (user table already has role field ✓)
│       └── migrations/ (if using Drizzle migrations)
│
├── RBAC_QUICK_GUIDE.txt ⭐ NEW - Quick reference
│   ├─ File overview
│   ├─ Role definitions & matrix
│   ├─ 5 quick-start examples
│   ├─ Common patterns
│   ├─ Instructions for adding roles
│   └─ Testing checklist
│
├── RBAC_REAL_EXAMPLES.ts ⭐ NEW - Real implementation examples
│   ├─ Example 1: Update admin payments endpoint
│   ├─ Example 2: Update owner properties endpoint  
│   ├─ Example 3: Update property edit/delete endpoints
│   ├─ Example 4: Protect existing pages
│   ├─ Example 5: Conditional button rendering
│   └─ Example 6: Admin users endpoint with wrapper
│
├── RBAC_FRONTEND_EXAMPLES.ts ⭐ NEW - Frontend patterns
│   ├─ Example 1: Protecting entire admin page
│   ├─ Example 2: Protecting owner pages for owner+admin
│   ├─ Example 3: Conditional navigation using RoleBasedRender
│   ├─ Example 4: useHasRole hook for permission checks
│   ├─ Example 5: Permissions-based visibility (canEditResource)
│   ├─ Example 6: Role-based API calls (switch on role)
│   ├─ Example 7: Dynamic breadcrumbs by role
│   ├─ Example 8: Protected form with permission validation
│   └─ Example 9: Layout with role-based structure
│
├── RBAC_IMPLEMENTATION_CHECKLIST.md ⭐ NEW - Integration checklist
│   ├─ Phase 1: Core Setup (✓ Done)
│   ├─ Phase 2: Update API Endpoints (YOUR TASK)
│   ├─ Phase 3: Verify Pages Have Protection
│   ├─ Phase 4: Add Ownership Checks to Components
│   ├─ Phase 5: Test Role-Based Access
│   ├─ Phase 6: Monitor Audit Logs
│   ├─ Phase 7: Update Middleware Configuration
│   ├─ Phase 8: Role Permission Customization
│   ├─ Phase 9: Optional - Extend Middleware
│   └─ Quick integration patterns & troubleshooting
│
├── package.json (no changes needed)
├── tsconfig.json (no changes needed)
└── ... (other existing files)


═══════════════════════════════════════════════════════════════════════════════
QUICK REFERENCE - WHICH FILE TO USE WHEN
═══════════════════════════════════════════════════════════════════════════════

"I want to protect an API endpoint"
→ Use src/lib/api-auth.ts
→ Quick pattern: await requireAdmin(request)
→ See detailed examples in: src/app/api/RBAC_EXAMPLES.md
→ See real examples in: RBAC_REAL_EXAMPLES.ts

"I want to protect a page from certain roles"
→ Use src/components/ProtectedRoute.tsx
→ Wrap page content: <ProtectedRoute allowedRoles={['admin']}>
→ See examples in: RBAC_FRONTEND_EXAMPLES.ts

"I want to check if user can perform an action"
→ Use src/lib/rbac-utils.ts
→ canPerformAction(role, 'properties:create')
→ canEditResource(role, resourceOwnerId, userId)
→ See examples in: RBAC_FRONTEND_EXAMPLES.ts

"I want to understand the whole system"
→ Read: RBAC_QUICK_GUIDE.txt (best overview)
→ Then: RBAC_REAL_EXAMPLES.ts (learn by example)
→ Then: RBAC_IMPLEMENTATION_CHECKLIST.md (step-by-step)

"I need to integrate RBAC into my existing code"
→ Start with: RBAC_IMPLEMENTATION_CHECKLIST.md (what to do)
→ Copy-paste from: RBAC_REAL_EXAMPLES.ts (real patterns)
→ Reference: src/lib/api-auth.ts (all available functions)

"I need to add a new permission or role"
→ Read "Adding Custom Permissions" in: RBAC_QUICK_GUIDE.txt
→ Or "Step 5: Adding New Roles" in: RBAC_QUICK_GUIDE.txt
→ Edit: src/lib/rbac-utils.ts (ROLE_PERMISSIONS, etc.)

═══════════════════════════════════════════════════════════════════════════════
CRITICAL FILES YOU MUST INTEGRATE
═══════════════════════════════════════════════════════════════════════════════

MUST DO (High Priority):
1. ✓ src/middleware.ts exists - COMPLETE (automatic route protection)
2. ⏳ Update src/app/api/admin/* endpoints with requireAdmin()
3. ⏳ Update src/app/api/owner/* endpoints with requireAuth(['owner','admin'])
4. ⏳ Wrap admin pages with <ProtectedRoute allowedRoles={['admin']}>
5. ⏳ Wrap owner pages with <ProtectedRoute allowedRoles={['owner','admin']}>

SHOULD DO (Medium Priority):
6. ⏳ Add canEditResource() checks to edit/delete buttons
7. ⏳ Add ownership checks in API endpoints (properties, bookings, etc.)
8. ⏳ Test all 3 roles (guest, owner, admin) - see testing checklist
9. ⏳ Update PROTECTED_ROUTES in middleware.ts if you have custom routes

NICE TO HAVE (Low Priority):
10. ⏳ Add custom permissions to ROLE_PERMISSIONS if needed
11. ⏳ Set up monitoring for audit logs
12. ⏳ Add rate limiting to middleware
13. ⏳ Extend for future roles

═══════════════════════════════════════════════════════════════════════════════
ROLE DEFINITIONS
═══════════════════════════════════════════════════════════════════════════════

GUEST (Hierarchy Level 1)
├─ Can: Browse properties, create bookings, view own bookings, leave reviews
├─ Cannot: Manage properties, view admin panel, change other users' roles
├─ Dashboard: /properties (browse page)
├─ Accessible Routes: /, /properties, /auth/*, /guest/bookings, /guest/reviews
└─ API Access: GET properties (public), POST bookings (own), GET bookings (own)

OWNER (Hierarchy Level 2)
├─ Can: Create/edit/delete own properties, view own bookings, view own payments
├─ Cannot: Manage other owners' properties, access admin panel, change roles
├─ Dashboard: /owner/dashboard
├─ Accessible Routes: /owner/*, /properties (browsing), /auth/*
└─ API Access: Full control of own resources, read-only for bookings on properties

ADMIN (Hierarchy Level 3)
├─ Can: Manage all users, all properties, all bookings, all payments, system settings
├─ Cannot: None (has all permissions)
├─ Dashboard: /admin/dashboard
├─ Accessible Routes: /admin/*, /owner/* (optional), /properties, /auth/*
└─ API Access: All endpoints, all resources

═══════════════════════════════════════════════════════════════════════════════
COMMON PATTERNS YOU'LL USE
═══════════════════════════════════════════════════════════════════════════════

Pattern 1: Protect an API endpoint (admin only)
─────────────────────────────────────────────
const authResult = await requireAdmin(request);
if (!authResult.authorized) return authResult.response;
// Now authResult.user has { id, email, role, ... }

Pattern 2: Protect an API endpoint (owner + admin)
──────────────────────────────────────────────────
const authResult = await requireAuth(request, ['owner', 'admin']);
if (!authResult.authorized) return authResult.response;

Pattern 3: Check resource ownership in API
───────────────────────────────────────────
import { canEditResource } from '@/lib/rbac-utils';
if (!canEditResource(user.role, property.ownerId, user.id)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

Pattern 4: Protect a page
────────────────────────
<ProtectedRoute allowedRoles={['admin']}>
  <AdminContent />
</ProtectedRoute>

Pattern 5: Conditional UI based on role
───────────────────────────────────────
const { role } = useUserRole();
{role === 'admin' && <AdminButton />}
{role === 'owner' && <OwnerButton />}

Pattern 6: Check if user can perform action
────────────────────────────────────────────
import { canPerformAction } from '@/lib/rbac-utils';
if (canPerformAction(role, 'properties:delete')) {
  // Show delete button
}

═══════════════════════════════════════════════════════════════════════════════
TESTING YOUR IMPLEMENTATION
═══════════════════════════════════════════════════════════════════════════════

Test Case 1: Guest trying to access /admin/dashboard
Expected: Redirect to /properties with appropriate message

Test Case 2: Owner trying to access /admin/dashboard  
Expected: Redirect to /owner/dashboard with appropriate message

Test Case 3: Admin accessing /admin/dashboard
Expected: Full access, no redirects

Test Case 4: Guest calling GET /api/admin/users
Expected: 403 Forbidden response

Test Case 5: Owner calling DELETE /api/owner/properties/123
Expected: 403 if they don't own property 123, 200 if they do

Test Case 6: Owner trying to edit another owner's property
Expected: 403 Forbidden (checked in canEditResource)

Test Case 7: Check audit logs after test cases
Expected: Entries for API_UNAUTHORIZED_ACCESS and API_FORBIDDEN_ACCESS

═══════════════════════════════════════════════════════════════════════════════
EXTENSIONS & CUSTOMIZATION
═══════════════════════════════════════════════════════════════════════════════

Want to add a new role (e.g., "moderator")?
1. Update src/lib/auth-roles.ts → Add 'moderator' to UserRole type
2. Update src/lib/rbac-utils.ts → Add to ROLE_HIERARCHY, ROLE_DESCRIPTIONS, ROLE_PERMISSIONS
3. Update src/middleware.ts → Add /moderator/* route protection if needed
4. Add moderator pages in src/app/moderator/
5. Update getAccessibleRoutes() and getDashboardUrl() for moderator

Want to add custom permissions?
1. Review ROLE_PERMISSIONS in src/lib/rbac-utils.ts
2. Add new action strings (e.g., 'invoices:generate')
3. Update relevant roles' permission sets
4. Use canPerformAction(role, 'invoices:generate') in components

Want to enforce additional auth rules?
1. Edit src/middleware.ts for route-level rules
2. Edit src/lib/api-auth.ts for API-level rules
3. Add custom logic in requireAuth() or new utility functions

═══════════════════════════════════════════════════════════════════════════════
SUPPORT RESOURCES
═══════════════════════════════════════════════════════════════════════════════

File                               | Best for...
───────────────────────────────────┼──────────────────────────────────────
src/middleware.ts                  | Understanding route protection
src/lib/api-auth.ts                | API endpoint protection functions
src/lib/rbac-utils.ts              | Permission checks & utilities
RBAC_QUICK_GUIDE.txt              | Quick overview & reference
RBAC_REAL_EXAMPLES.ts             | Real code you can copy-paste
RBAC_FRONTEND_EXAMPLES.ts         | Frontend integration patterns
src/app/api/RBAC_EXAMPLES.md      | API endpoint code examples
RBAC_IMPLEMENTATION_CHECKLIST.md   | Step-by-step integration guide

═══════════════════════════════════════════════════════════════════════════════
NEXT STEPS
═══════════════════════════════════════════════════════════════════════════════

1. READ: RBAC_QUICK_GUIDE.txt (5 min overview)
2. READ: RBAC_REAL_EXAMPLES.ts (see real implementation)
3. FOLLOW: RBAC_IMPLEMENTATION_CHECKLIST.md (Phase 2 onwards)
4. INTEGRATE: Start with admin API endpoints (quickest wins)
5. TEST: Use testing checklist from RBAC_QUICK_GUIDE.txt
6. MONITOR: Check audit logs for unauthorized attempts

═══════════════════════════════════════════════════════════════════════════════
"""
