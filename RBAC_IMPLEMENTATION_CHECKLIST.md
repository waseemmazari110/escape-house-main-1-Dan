# RBAC INTEGRATION CHECKLIST

## 🎯 Complete Implementation Checklist for Your Project

### Phase 1: Core Setup ✅ (Already Done)
- [x] Created src/middleware.ts - Route-level protection
- [x] Created src/lib/api-auth.ts - API endpoint protection
- [x] Created src/lib/rbac-utils.ts - Permission utilities
- [x] Created documentation and examples

### Phase 2: Update API Endpoints (YOUR TASK)

#### Admin APIs
- [ ] `src/app/api/admin/payments/route.ts` → Add `requireAdmin(request)`
- [ ] `src/app/api/admin/dashboard/route.ts` → Add `requireAdmin(request)`
- [ ] `src/app/api/admin/users/route.ts` → Add `requireAdmin(request)` + role management
- [ ] `src/app/api/admin/approvals/route.ts` → Add `requireAdmin(request)`
- [ ] `src/app/api/admin/[endpoint]/route.ts` → Add `requireAdmin(request)` to all handlers

#### Owner APIs
- [ ] `src/app/api/owner/properties/route.ts` → Add `requireAuth(['owner', 'admin'])` + ownership check
- [ ] `src/app/api/owner/properties/[id]/route.ts` → Add `requireAuth(['owner', 'admin'])` + ownership check
- [ ] `src/app/api/owner/bookings/route.ts` → Add `requireAuth(['owner', 'admin'])`
- [ ] `src/app/api/owner/payments/route.ts` → Add `requireAuth(['owner', 'admin'])`
- [ ] `src/app/api/owner/[endpoint]/route.ts` → Add `requireAuth(['owner', 'admin'])` to all handlers

#### Guest APIs (if applicable)
- [ ] `src/app/api/guest/bookings/route.ts` → Add `requireAuth(['guest', 'owner', 'admin'])`
- [ ] `src/app/api/guest/reviews/route.ts` → Add `requireAuth(['guest', 'owner', 'admin'])`
- [ ] `src/app/api/guest/[endpoint]/route.ts` → Add `requireAuth(['guest', 'owner', 'admin'])` to all handlers

#### Public APIs (No protection needed)
- [ ] `src/app/api/auth/[...]/route.ts` - Keep as-is (auth endpoints)
- [ ] `src/app/api/public/properties/route.ts` - Keep as-is (public browse)
- [ ] `src/app/api/[public-endpoint]/route.ts` - Keep as-is if meant to be public

---

### Phase 3: Verify Existing Pages Have Protection

#### Admin Pages
- [ ] `src/app/admin/dashboard/page.tsx` → Verify has `<ProtectedRoute allowedRoles={['admin']}>`
- [ ] `src/app/admin/users/page.tsx` → Verify has `<ProtectedRoute allowedRoles={['admin']}>`
- [ ] `src/app/admin/payments/page.tsx` → Verify has `<ProtectedRoute allowedRoles={['admin']}>`
- [ ] `src/app/admin/approvals/page.tsx` → Verify has `<ProtectedRoute allowedRoles={['admin']}>`
- [ ] `src/app/admin/[page]/page.tsx` → Verify all pages wrapped

#### Owner Pages
- [ ] `src/app/owner/dashboard/page.tsx` → Verify has `<ProtectedRoute allowedRoles={['owner', 'admin']}>`
- [ ] `src/app/owner/properties/page.tsx` → Verify has `<ProtectedRoute allowedRoles={['owner', 'admin']}>`
- [ ] `src/app/owner/bookings/page.tsx` → Verify has `<ProtectedRoute allowedRoles={['owner', 'admin']}>`
- [ ] `src/app/owner/payments/page.tsx` → Verify has `<ProtectedRoute allowedRoles={['owner', 'admin']}>`
- [ ] `src/app/owner/[page]/page.tsx` → Verify all pages wrapped

---

### Phase 4: Add Ownership Checks to Components

Components that need `canEditResource()` checks:
- [ ] `src/components/PropertyCard.tsx` → Check if user can edit/delete
- [ ] `src/components/BookingCard.tsx` → Check if user can view/edit
- [ ] `src/components/PaymentItem.tsx` → Check if user can view/edit
- [ ] `src/components/[YourComponents]/` → Add ownership checks where needed

Pattern:
```tsx
const { user, role } = useUserRole();
const canEdit = canEditResource(role, resource.ownerId, user?.id);

return (
  <div>
    {canEdit && <button onClick={handleEdit}>Edit</button>}
  </div>
);
```

---

### Phase 5: Test Role-Based Access

#### Test as Guest User
- [ ] Login as guest
- [ ] Can access: /, /properties, /auth/sign-out
- [ ] Cannot access: /admin/*, /owner/*
- [ ] Redirects to: /properties
- [ ] API: GET /api/guest/bookings → 200 OK
- [ ] API: GET /api/admin/users → 403 Forbidden

#### Test as Owner User
- [ ] Login as owner
- [ ] Can access: /owner/*, /properties (browsing)
- [ ] Cannot access: /admin/*
- [ ] Redirects to: /owner/dashboard
- [ ] API: GET /api/owner/properties → 200 OK (own properties only)
- [ ] API: PATCH /api/owner/properties/1 → 403 if not owner
- [ ] API: GET /api/admin/users → 403 Forbidden

#### Test as Admin User
- [ ] Login as admin
- [ ] Can access: /admin/*, /owner/* (optional), /properties (browsing)
- [ ] No redirects when accessing /admin or /owner routes
- [ ] API: GET /api/admin/users → 200 OK (all users)
- [ ] API: GET /api/owner/properties → 200 OK (all properties)
- [ ] API: PATCH /api/admin/users/[id]/role → 200 OK

---

### Phase 6: Monitor Audit Logs

After implementing requireAuth() in API endpoints:
- [ ] Check audit logs in database for `API_UNAUTHORIZED_ACCESS` entries
- [ ] Verify audit entries show: userId, ipAddress, action, requiredRoles, userRole
- [ ] Set up monitoring for repeated 403 attempts (potential security issue)

Query to check logs:
```sql
SELECT * FROM auditLog 
WHERE action IN ('API_UNAUTHORIZED_ACCESS', 'API_FORBIDDEN_ACCESS')
ORDER BY createdAt DESC 
LIMIT 20;
```

---

### Phase 7: Update Middleware Configuration (If Needed)

Review `src/middleware.ts` PROTECTED_ROUTES:
- [ ] Verify all /admin/* routes are mapped to ['admin']
- [ ] Verify all /owner/* routes are mapped to ['owner', 'admin']
- [ ] Verify all /guest/* routes are mapped to ['guest', 'owner', 'admin']
- [ ] Add any new protected routes you've created
- [ ] Remove any deprecated routes

---

### Phase 8: Role Permission Customization (Optional)

If you need custom permissions beyond defaults:
- [ ] Review src/lib/rbac-utils.ts ROLE_PERMISSIONS
- [ ] Add custom actions if needed: 
  - `owner: Set<string>` add new permissions like 'invoices:generate'
  - `admin: Set<string>` add permissions like 'system:config'
- [ ] Use `canPerformAction(role, 'invoices:generate')` in components
- [ ] Document any custom permissions added

---

### Phase 9: Optional - Extend Middleware Features

If you want enhanced middleware features:
- [ ] Add rate limiting: Check IP address in middleware to limit failed auth attempts
- [ ] Add session validation: Compare session refresh time to prevent stale sessions
- [ ] Add API key support: Allow service-to-service API calls with API keys
- [ ] Add CORS by role: Different CORS policies per role

---

## 🔑 Quick Integration Examples

### Quickest API Update Pattern
```typescript
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (!authResult.authorized) return authResult.response;
  
  // Your code here, user available as: authResult.user
}
```

### Quickest Page Update Pattern
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function YourPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <YourContent />
    </ProtectedRoute>
  );
}
```

### Quickest Component Update Pattern
```tsx
import { canEditResource } from '@/lib/rbac-utils';
import { useUserRole } from '@/components/ProtectedRoute';

export function YourComponent({ resource }) {
  const { user, role } = useUserRole();
  
  if (!canEditResource(role, resource.ownerId, user?.id)) {
    return <p>No access</p>;
  }
  
  return <div>Edit form here</div>;
}
```

---

## 📊 Progress Tracking

Total items: 50+

As you complete each item, mark it with [x]

Completion percentage:
- [ ] 0-25% (Early stage)
- [ ] 25-50% (APIs mostly done)
- [ ] 50-75% (APIs done, pages next)
- [ ] 75-90% (Structure done, testing phase)
- [ ] 90-100% (Full implementation, monitoring)

---

## 🆘 Troubleshooting

### Issue: Middleware not redirecting
**Solution:** Ensure src/middleware.ts is at project root (not in src/app/)

### Issue: API returning 401 instead of 403
**Solution:** Check if session is being created properly in auth setup

### Issue: ProtectedRoute not redirecting
**Solution:** Verify useSession() hook is working, check network tab for /api/user/profile response

### Issue: Ownership checks failing
**Solution:** Verify resource.ownerId matches user.id (check database), log values in canEditResource()

### Issue: Roles not showing in user profile
**Solution:** Verify user table has role field, Better-Auth role additionalFields is configured

---

## 📝 Implementation Timeline

- Day 1: Update admin APIs (requireAdmin)
- Day 2: Update owner APIs (requireAuth + ownership)
- Day 3: Update guest APIs (if applicable)
- Day 4: Wrap pages with ProtectedRoute
- Day 5: Add ownership checks to components
- Day 6: Comprehensive testing across all roles
- Day 7: Monitor audit logs, fine-tune permissions

---

## 🚀 After Implementation

Once complete, you'll have:
- ✅ All routes protected at middleware level
- ✅ All APIs protected with role checks
- ✅ All pages protected with ProtectedRoute
- ✅ All editable resources protected with ownership checks
- ✅ Audit logging for security monitoring
- ✅ Clear 403 Forbidden responses for unauthorized access
- ✅ Automatic redirects for unauthorized route access
- ✅ Extensible system for future roles/permissions
- ✅ Production-ready RBAC implementation

---

**Need help?** Refer to:
- API Examples: `src/app/api/RBAC_EXAMPLES.md`
- Frontend Examples: `src/RBAC_FRONTEND_EXAMPLES.ts`
- Real Implementation Examples: `RBAC_REAL_EXAMPLES.ts`
- Quick Reference: `RBAC_QUICK_GUIDE.txt`
- Utility Reference: `src/lib/rbac-utils.ts` (read comments)
- API Auth Reference: `src/lib/api-auth.ts` (read comments)
