#!/bin/bash
# RBAC QUICK START - FOR THE IMPATIENT
# Read this if you want results in 30 minutes

============================================================
TL;DR - WHAT YOU HAVE
============================================================

✅ Route protection (automatic via middleware.ts)
✅ API protection functions (requireAdmin, requireAuth)
✅ Permission system (role hierarchy + action-based)
✅ Examples (4 files with real code you can copy)
✅ Documentation (5 files explaining everything)

Your job: Integrate into 5-20 API endpoints and test with 3 roles

============================================================
STEP 1: UNDERSTAND THE 3-LAYER PROTECTION (5 min)
============================================================

Layer 1: Routes (AUTOMATIC)
  /admin/* → 403 if not admin
  /owner/* → 403 if not owner/admin
  /properties → OK for everyone
  
Layer 2: APIs (YOU APPLY THIS)
  Copy 1 line: const authResult = await requireAdmin(request);
  If not authorized: return 403
  
Layer 3: Component (YOU APPLY THIS)
  Import: import { canEditResource } from '@/lib/rbac-utils';
  Check: if (!canEditResource(role, ownerId, userId)) return null;

============================================================
STEP 2: DO ONE API ENDPOINT (10 min)
============================================================

Open: src/app/api/admin/dashboard/route.ts

Copy the pattern from RBAC_REAL_EXAMPLES.ts (Example 1)

ADD 2 lines at the top:
  import { requireAdmin } from '@/lib/api-auth';
  
ADD 3 lines after function declaration:
  const authResult = await requireAdmin(request);
  if (!authResult.authorized) return authResult.response;
  
Done! That endpoint is now protected.

Test: GET http://localhost:3000/api/admin/dashboard (as guest)
Expected: 403 Forbidden response

============================================================
STEP 3: REPEAT FOR ALL ADMIN ENDPOINTS (10 min)
============================================================

Find all files: src/app/api/admin/*/route.ts

For each file:
  1. Import requireAdmin from @/lib/api-auth
  2. Add 3 lines at start of each function
  3. Save

Example endpoint list (your project may have more):
  □ src/app/api/admin/users/route.ts
  □ src/app/api/admin/payments/route.ts
  □ src/app/api/admin/dashboard/route.ts
  □ src/app/api/admin/approvals/route.ts
  (Find all by searching: src/app/api/admin/)

============================================================
STEP 4: DO ONE OWNER ENDPOINT (5 min)
============================================================

Open: src/app/api/owner/properties/route.ts

Copy pattern from RBAC_REAL_EXAMPLES.ts (Example 2)

Instead of requireAdmin, use:
  const authResult = await requireAuth(request, ['owner', 'admin']);
  if (!authResult.authorized) return authResult.response;

For edit/delete, add ownership check:
  const { canEditResource } = require('@/lib/rbac-utils');
  if (!canEditResource(user.role, resource.ownerId, user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

============================================================
STEP 5: REPEAT FOR ALL OWNER ENDPOINTS (5 min)
============================================================

Find all files: src/app/api/owner/*/route.ts

For each file:
  1. Use requireAuth with ['owner', 'admin']
  2. Add ownership checks on edit/delete
  3. Save

============================================================
STEP 6: WRAP ONE PAGE (3 min)
============================================================

Open: src/app/admin/dashboard/page.tsx

Wrap your content:
  <ProtectedRoute allowedRoles={['admin']}>
    <YourContent />
  </ProtectedRoute>

For owner pages:
  <ProtectedRoute allowedRoles={['owner', 'admin']}>
    <YourContent />
  </ProtectedRoute>

============================================================
STEP 7: TEST 3 ROLES (5 min)
============================================================

Test as GUEST:
  ✓ Can access: /properties, /auth/*
  ✗ Cannot access: /admin/dashboard, /owner/dashboard
  ✗ API 403: GET /api/admin/users, GET /api/owner/properties

Test as OWNER:
  ✓ Can access: /owner/dashboard, /properties
  ✗ Cannot access: /admin/dashboard
  ✗ API 403: GET /api/admin/users

Test as ADMIN:
  ✓ Can access: /admin/dashboard, /owner/dashboard, /properties
  ✓ API 200: GET /api/admin/users, GET /api/owner/properties

============================================================
YOU'RE DONE! (Total time: ~30 min)
============================================================

You now have:
✅ Route protection (automatic)
✅ API protection (all admin endpoints)
✅ API protection (all owner endpoints)
✅ Page protection (admin pages)
✅ Page protection (owner pages)
✅ Working RBAC system
✅ Tested with 3 roles

OPTIONAL:
  - Add canEditResource() checks to edit/delete buttons
  - Add custom permissions to ROLE_PERMISSIONS
  - Set up monitoring for audit logs
  - Add new roles when needed

============================================================
NEED MORE DETAIL? SEE THESE FILES
============================================================

Quick reference: RBAC_QUICK_GUIDE.txt
Real examples: RBAC_REAL_EXAMPLES.ts
Full checklist: RBAC_IMPLEMENTATION_CHECKLIST.md
Complete explanation: RBAC_COMPLETE_SUMMARY.md
File structure: RBAC_FILE_STRUCTURE_REFERENCE.md

============================================================
COPY-PASTE SNIPPETS
============================================================

Admin API Protection (copy-paste):
═════════════════════════════════════
import { requireAdmin } from '@/lib/api-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (!authResult.authorized) return authResult.response;
  
  // Your code here using authResult.user
  return NextResponse.json({ data: [] });
}

Owner API Protection (copy-paste):
═════════════════════════════════════
import { requireAuth } from '@/lib/api-auth';
import { canEditResource } from '@/lib/rbac-utils';

export async function PATCH(request: NextRequest) {
  const authResult = await requireAuth(request, ['owner', 'admin']);
  if (!authResult.authorized) return authResult.response;
  
  const user = authResult.user;
  const resource = await getResource(id);
  
  if (!canEditResource(user.role, resource.ownerId, user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Update resource...
}

Page Protection (copy-paste):
═════════════════════════════════════
'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>Admin content here</div>
    </ProtectedRoute>
  );
}

Component Permission Check (copy-paste):
═════════════════════════════════════
'use client';
import { useUserRole } from '@/components/ProtectedRoute';
import { canEditResource } from '@/lib/rbac-utils';

export function ResourceCard({ resource }) {
  const { user, role } = useUserRole();
  const canEdit = canEditResource(role, resource.ownerId, user?.id);
  
  return (
    <div>
      {canEdit && <button>Edit</button>}
    </div>
  );
}

============================================================
TROUBLESHOOTING IN 30 SECONDS
============================================================

Not redirecting from /admin?
  → Check middleware.ts exists at src/ root
  → Check PROTECTED_ROUTES has /admin/*

Getting 401 instead of 403?
  → You're not logged in
  → Log in with admin account first

ProtectedRoute not working?
  → Check if component is in 'use client'
  → Check <ProtectedRoute> wraps your JSX

canEditResource returning wrong value?
  → Check resource.ownerId matches user.id format (both strings/numbers?)
  → Add console.log(role, ownerId, userId) to debug

API returning error?
  → Check import { requireAdmin } is at top
  → Check the 3 lines are added after function declaration
  → Check you have const authResult = await requireAdmin(request)

============================================================
NEXT STEPS AFTER 30 MIN
============================================================

1. Add canEditResource() to edit/delete buttons (10 min)
2. Test cross-role access (find security issues) (15 min)
3. Check audit logs for unauthorized attempts (5 min)
4. Customize ROLE_PERMISSIONS for your business (10 min)
5. Set up monitoring for 403 errors (optional) (15 min)

============================================================
ESTIMATED PROJECT IMPACT
============================================================

Once complete:
  → 403 returns for unauthorized API calls ✅
  → Route redirects for unauthorized route access ✅
  → Hidden UI for users without permissions ✅
  → Audit trail of who tried to access what ✅
  → Extensible for new roles in future ✅
  → Production-ready security ✅

============================================================
