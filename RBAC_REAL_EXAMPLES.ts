/**
 * REAL IMPLEMENTATION EXAMPLES FOR YOUR PROJECT
 * 
 * These are concrete examples showing how to apply RBAC to your
 * existing API endpoints and pages.
 */

// ============================================================
// EXAMPLE 1: UPDATE ADMIN PAYMENTS ENDPOINT
// ============================================================

// File: src/app/api/admin/payments/history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { db } from '@/db';
import { payments } from '@/db/schema';
import { desc, limit, offset } from 'drizzle-orm';

/**
 * GET /api/admin/payments/history
 * Admin-only endpoint to view all payment history
 * Returns 403 if user is not admin
 */
export async function GET(request: NextRequest) {
  // Check authorization - admin only
  const authResult = await requireAdmin(request);
  if (!authResult.authorized) {
    return authResult.response; // 403 Forbidden
  }

  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const pageNum = parseInt(searchParams.get('page') || '0');
    const offsetVal = pageNum * pageSize;

    // Admin can view all payments
    const paymentRecords = await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(pageSize)
      .offset(offsetVal);

    const totalResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(payments);

    return NextResponse.json({
      payments: paymentRecords,
      total: totalResult[0]?.count || 0,
      page: pageNum,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// EXAMPLE 2: UPDATE OWNER PROPERTIES ENDPOINT
// ============================================================

// File: src/app/api/owner/properties/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/owner/properties
 * Owners see only their properties
 * Admins can see all (optional: add ?adminViewAll=true)
 */
export async function GET(request: NextRequest) {
  // Check authorization - owner or admin
  const authResult = await requireAuth(request, ['owner', 'admin']);
  if (!authResult.authorized) {
    return authResult.response; // 403 Forbidden
  }

  const user = authResult.user;

  try {
    let query = db.select().from(properties);

    // Owners only see their own properties
    if (user.role === 'owner') {
      query = query.where(eq(properties.ownerId, user.id));
    }
    // Admins can see all (no filter) or specific owner

    const ownerProps = await query;

    return NextResponse.json({
      properties: ownerProps,
      count: ownerProps.length,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/owner/properties
 * Create new property (owner or admin)
 */
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request, ['owner', 'admin']);
  if (!authResult.authorized) {
    return authResult.response;
  }

  const user = authResult.user;

  try {
    const body = await request.json();

    // Owners can only create for themselves
    if (user.role === 'owner') {
      body.ownerId = user.id;
    }

    // Validate required fields
    if (!body.title || !body.location) {
      return NextResponse.json(
        { error: 'Title and location required' },
        { status: 400 }
      );
    }

    const result = await db
      .insert(properties)
      .values({
        title: body.title,
        location: body.location,
        ownerId: body.ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      { message: 'Property created', property: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// EXAMPLE 3: UPDATE OWNER PROPERTIES/[ID] ENDPOINT
// ============================================================

// File: src/app/api/owner/properties/[id]/route.ts

import { canEditResource } from '@/lib/rbac-utils';

/**
 * PATCH /api/owner/properties/[id]
 * Owner can edit their own properties
 * Admin can edit any property
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(request, ['owner', 'admin']);
  if (!authResult.authorized) {
    return authResult.response;
  }

  const user = authResult.user;
  const propertyId = parseInt(params.id);

  try {
    // Fetch the property
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if user can edit this property
    if (!canEditResource(user.role, property.ownerId, user.id)) {
      return NextResponse.json(
        { error: 'Forbidden: Cannot edit this property' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Update property
    const updated = await db
      .update(properties)
      .set({
        title: body.title || property.title,
        location: body.location || property.location,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, propertyId))
      .returning();

    return NextResponse.json({
      message: 'Property updated',
      property: updated[0],
    });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/owner/properties/[id]
 * Owner can delete their own properties
 * Admin can delete any property
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(request, ['owner', 'admin']);
  if (!authResult.authorized) {
    return authResult.response;
  }

  const user = authResult.user;
  const propertyId = parseInt(params.id);

  try {
    // Fetch property to check ownership
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (!canEditResource(user.role, property.ownerId, user.id)) {
      return NextResponse.json(
        { error: 'Forbidden: Cannot delete this property' },
        { status: 403 }
      );
    }

    // Delete property
    await db.delete(properties).where(eq(properties.id, propertyId));

    return NextResponse.json({ message: 'Property deleted' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// EXAMPLE 4: PROTECT EXISTING PAGES
// ============================================================

// File: src/app/admin/dashboard/page.tsx

'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
// ... other imports ...

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

// File: src/app/owner/dashboard/page.tsx

'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
// ... other imports ...

export default function OwnerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['owner', 'admin']}>
      <OwnerDashboardContent />
    </ProtectedRoute>
  );
}

// ============================================================
// EXAMPLE 5: CONDITIONAL BUTTON RENDERING IN COMPONENTS
// ============================================================

// File: src/components/PropertyCard.tsx

'use client';

import { useUserRole } from '@/components/ProtectedRoute';
import { canEditResource } from '@/lib/rbac-utils';

interface PropertyCardProps {
  property: any;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { user, role } = useUserRole();

  const canEdit = canEditResource(role, property.ownerId, user?.id);

  return (
    <div className="property-card">
      <h3>{property.title}</h3>
      <p>{property.location}</p>

      {canEdit && (
        <div className="actions">
          <button onClick={() => editProperty(property.id)}>
            Edit
          </button>
          <button onClick={() => deleteProperty(property.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXAMPLE 6: ADMIN USERS ENDPOINT
// ============================================================

// File: src/app/api/admin/users/route.ts

import { withRoleProtection } from '@/lib/api-auth';

/**
 * GET /api/admin/users
 * Admin-only - view all users
 * Using the withRoleProtection wrapper for cleaner code
 */
export const GET = withRoleProtection(['admin'], async (request, user) => {
  try {
    const allUsers = await db.select().from(userTable);

    return NextResponse.json({
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
});

/**
 * PATCH /api/admin/users/[id]/role
 * Admin can change user roles
 */
export const PATCH = withRoleProtection(
  ['admin'],
  async (request, user) => {
    try {
      const body = await request.json();
      const { userId, newRole } = body;

      if (!['guest', 'owner', 'admin'].includes(newRole)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }

      // Update user role
      const updated = await db
        .update(userTable)
        .set({ role: newRole })
        .where(eq(userTable.id, userId))
        .returning();

      return NextResponse.json({
        message: 'User role updated',
        user: updated[0],
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
);

// ============================================================
// SUMMARY
// ============================================================

// What you've implemented:
// ✓ Middleware for route protection (middleware.ts)
// ✓ API auth utilities (lib/api-auth.ts)
// ✓ RBAC utilities & permissions (lib/rbac-utils.ts)
// ✓ Frontend protected components (components/ProtectedRoute.tsx)
// ✓ Real examples for your existing APIs

// Next steps:
// 1. Apply requireAuth/requireAdmin to all your API endpoints
// 2. Wrap your pages with <ProtectedRoute>
// 3. Add ownership checks where needed (like property edit/delete)
// 4. Test with different roles
// 5. Monitor audit logs for unauthorized attempts
// 6. Update your documentation with new role-based flows
