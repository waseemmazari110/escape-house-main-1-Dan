# Quick Reference: Role-Based Access Control

## 🔐 Role Hierarchy
```
guest → Basic access (view & book)
owner → Manage own properties
admin → Full system access
```

## 📦 Core Imports

```typescript
// Backend (API routes)
import { 
  getCurrentUserWithRole,
  requireRole,
  isAdmin,
  isOwner,
  isPropertyOwner,
  unauthorizedResponse 
} from "@/lib/auth-roles";

// Frontend (Pages/Components)
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
```

## 🛡️ Protect API Routes

### Require Specific Role
```typescript
export async function POST(request: NextRequest) {
  // Only owners and admins
  const currentUser = await requireRole(['owner', 'admin']);
  
  // Your logic here
  const body = await request.json();
  // ...
}
```

### Check Property Ownership
```typescript
export async function PUT(request: NextRequest) {
  const currentUser = await requireRole(['owner', 'admin']);
  
  // Get existing property
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId)
  });
  
  // Check ownership
  if (!isPropertyOwner(currentUser, property.ownerId)) {
    return unauthorizedResponse('You can only edit your own properties');
  }
  
  // Proceed with update
}
```

### Admin Only Endpoint
```typescript
export async function GET(request: NextRequest) {
  await requireRole(['admin']); // Throws error if not admin
  
  // Admin-only logic
  const allBookings = await db.query.bookings.findMany();
  return NextResponse.json(allBookings);
}
```

## 🔒 Protect Frontend Pages

### Wrap Entire Page
```typescript
export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>Your admin content</div>
    </ProtectedRoute>
  );
}
```

### Owner or Admin Access
```typescript
export default function OwnerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['owner', 'admin']}>
      <div>Dashboard content</div>
    </ProtectedRoute>
  );
}
```

## 🎨 Conditional UI Elements

### Show/Hide Based on Role
```typescript
function MyComponent() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'guest';
  const isAdmin = userRole === 'admin';
  const isOwner = userRole === 'owner';

  return (
    <div>
      {/* Everyone sees this */}
      <h1>Properties</h1>

      {/* Only owners and admins see this */}
      {(isOwner || isAdmin) && (
        <Button>Add Property</Button>
      )}

      {/* Only admins see this */}
      {isAdmin && (
        <Link href="/admin">Admin Panel</Link>
      )}
    </div>
  );
}
```

## 📊 Database Queries with Role Filtering

### Fetch Properties by Role
```typescript
// In API route
const currentUser = await getCurrentUserWithRole();
const conditions = [];

if (isOwner(currentUser)) {
  // Owners see only their properties
  conditions.push(eq(properties.ownerId, currentUser.id));
} else if (!isAdmin(currentUser)) {
  // Guests see only published
  conditions.push(eq(properties.isPublished, true));
}
// Admins see all (no condition)

const results = await db.query.properties.findMany({
  where: conditions.length > 0 ? and(...conditions) : undefined
});
```

## 🔧 Common Patterns

### Pattern 1: Resource Ownership Check
```typescript
async function canModifyResource(currentUser, resourceOwnerId) {
  // Admins can modify anything
  if (isAdmin(currentUser)) return true;
  
  // Owners can only modify their own
  if (isOwner(currentUser)) {
    return currentUser.id === resourceOwnerId;
  }
  
  // Guests can't modify
  return false;
}
```

### Pattern 2: List Filtering
```typescript
async function getPropertiesForUser(currentUser) {
  if (isAdmin(currentUser)) {
    // Admin sees all
    return db.query.properties.findMany();
  }
  
  if (isOwner(currentUser)) {
    // Owner sees only theirs
    return db.query.properties.findMany({
      where: eq(properties.ownerId, currentUser.id)
    });
  }
  
  // Guest sees published only
  return db.query.properties.findMany({
    where: eq(properties.isPublished, true)
  });
}
```

### Pattern 3: Conditional Actions
```typescript
function PropertyActions({ property }) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const userId = session?.user?.id;
  
  const canEdit = 
    userRole === 'admin' || 
    (userRole === 'owner' && property.ownerId === userId);
  
  const canDelete = canEdit; // Same logic
  
  return (
    <div>
      <Button>View</Button>
      {canEdit && <Button>Edit</Button>}
      {canDelete && <Button>Delete</Button>}
    </div>
  );
}
```

## 🚨 Error Handling

### API Error Responses
```typescript
try {
  const currentUser = await requireRole(['owner', 'admin']);
  // Your logic
} catch (error: any) {
  if (error.message === 'Authentication required') {
    return unauthenticatedResponse();
  }
  if (error.message?.includes('Unauthorized')) {
    return unauthorizedResponse(error.message);
  }
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

### Frontend Error Handling
```typescript
async function fetchData() {
  try {
    const response = await fetch('/api/properties');
    
    if (response.status === 401) {
      toast.error('Please sign in');
      router.push('/login');
      return;
    }
    
    if (response.status === 403) {
      toast.error('Access denied');
      return;
    }
    
    const data = await response.json();
    // Handle success
  } catch (error) {
    toast.error('An error occurred');
  }
}
```

## ⚡ Quick Commands

### Set User Role (Database)
```sql
-- Make admin
UPDATE user SET role = 'admin' WHERE email = 'admin@example.com';

-- Make owner
UPDATE user SET role = 'owner' WHERE email = 'owner@example.com';

-- Make guest
UPDATE user SET role = 'guest' WHERE email = 'guest@example.com';
```

### Assign Property to Owner
```sql
UPDATE properties 
SET owner_id = (SELECT id FROM user WHERE email = 'owner@example.com')
WHERE id = 1;
```

## 📝 Checklist for New Features

When adding a new feature:

- [ ] Add role checks in API endpoints
- [ ] Filter data by ownership (if applicable)
- [ ] Protect frontend page with `<ProtectedRoute>`
- [ ] Hide/show UI elements based on role
- [ ] Test with all three roles (guest, owner, admin)
- [ ] Handle 401/403 errors properly
- [ ] Add to navigation (if needed) with role visibility

## 🎯 Common Use Cases

### Use Case: Add New Property Form
```typescript
// Page component
export default function AddPropertyPage() {
  return (
    <ProtectedRoute allowedRoles={['owner', 'admin']}>
      <PropertyForm />
    </ProtectedRoute>
  );
}

// API endpoint
export async function POST(request: NextRequest) {
  const currentUser = await requireRole(['owner', 'admin']);
  const body = await request.json();
  
  const property = await db.insert(properties).values({
    ...body,
    ownerId: currentUser.id // Auto-assign to creator
  });
  
  return NextResponse.json(property);
}
```

### Use Case: Edit Property
```typescript
// Frontend
function EditButton({ property }) {
  const { data: session } = useSession();
  const canEdit = 
    session?.user?.role === 'admin' ||
    session?.user?.id === property.ownerId;
  
  if (!canEdit) return null;
  
  return <Button onClick={() => router.push(`/edit/${property.id}`)}>Edit</Button>;
}

// API
export async function PUT(request: NextRequest) {
  const currentUser = await requireRole(['owner', 'admin']);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, parseInt(id))
  });
  
  if (!isPropertyOwner(currentUser, property.ownerId)) {
    return unauthorizedResponse('Not authorized');
  }
  
  // Proceed with update
}
```

## 💡 Tips

1. **Always check on backend**: Frontend checks are for UX, backend for security
2. **Use TypeScript**: Helps catch role-related bugs
3. **Test thoroughly**: Try all scenarios with different roles
4. **Clear error messages**: Help users understand why access is denied
5. **Log security events**: Monitor unauthorized access attempts

## 🆘 Troubleshooting

### Issue: User can't access their route
```typescript
// Check:
1. Is user authenticated? (check session)
2. Does user have correct role in database?
3. Is ProtectedRoute configured with correct roles?
4. Check browser console for errors
```

### Issue: API returns 403
```typescript
// Check:
1. Does user have required role?
2. For owners: Does resource belong to them?
3. Is ownerId correctly set on resources?
4. Check API endpoint role requirements
```

### Issue: Navigation not showing
```typescript
// Check:
1. Is session loaded? (check isPending)
2. Is role correctly retrieved from session?
3. Are conditional checks correct in Header component?
```

---

**Remember**: Security is a priority. Always validate on the backend, never trust client-side checks alone!
