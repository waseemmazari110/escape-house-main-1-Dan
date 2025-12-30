/**
 * EXAMPLE: PROTECTED ADMIN API ENDPOINT
 * 
 * Location: src/app/api/admin/stats/route.ts
 * 
 * This is an example of how to protect an API endpoint to admin only.
 * Returns 403 Forbidden if user is not admin.
 * Includes audit logging for unauthorized access attempts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

/**
 * GET /api/admin/stats
 * 
 * Returns admin statistics (total users, properties, revenue, etc.)
 * Only accessible to admin role.
 */
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await requireAdmin(request);
  if (!authResult.authorized) {
    return authResult.response;
  }

  const user = authResult.user;

  try {
    // Admin logic here
    // e.g., fetch statistics from database
    const stats = {
      totalUsers: 150,
      totalProperties: 45,
      totalRevenue: 125000,
      totalBookings: 320,
      pendingApprovals: 5,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ================================================
// EXAMPLE 2: PROTECTED OWNER API ENDPOINT
// ================================================

/**
 * Location: src/app/api/owner/payment-history/route.ts
 * 
 * This is an example of how to protect an endpoint to owner + admin.
 * Owners can only see their own payments.
 * Admins can see all payments.
 */

export async function getOwnerPayments(request: NextRequest) {
  // Require owner or admin role
  const { requireAuth } = await import('@/lib/api-auth');
  const authResult = await requireAuth(request, ['owner', 'admin']);
  
  if (!authResult.authorized) {
    return authResult.response;
  }

  const user = authResult.user;

  try {
    // Get owner ID from query params or body
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId') || user.id;

    // Check authorization: owners can only see their own, admins can see all
    if (user.role === 'owner' && ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: Cannot access other user payments' },
        { status: 403 }
      );
    }

    // Fetch payments from database
    // ... database query here ...

    return NextResponse.json({
      payments: [],
      total: 0,
      owner: ownerId,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ================================================
// EXAMPLE 3: PROTECTED GUEST ENDPOINT
// ================================================

/**
 * Location: src/app/api/bookings/my-bookings/route.ts
 * 
 * Any authenticated user (guest, owner, or admin) can access their own bookings.
 */

export async function getMyBookings(request: NextRequest) {
  const { requireGuest } = await import('@/lib/api-auth');
  const authResult = await requireGuest(request);
  
  if (!authResult.authorized) {
    return authResult.response;
  }

  const user = authResult.user;

  try {
    // Fetch user's own bookings
    // Users can only see their own bookings
    // SELECT * FROM bookings WHERE userId = current_user_id

    return NextResponse.json({
      bookings: [],
      count: 0,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ================================================
// EXAMPLE 4: USING withRoleProtection WRAPPER
// ================================================

/**
 * Location: src/app/api/admin/users/route.ts
 * 
 * Using the withRoleProtection higher-order function
 * for cleaner code when you have multiple handlers.
 */

import { withRoleProtection } from '@/lib/api-auth';

export const GET = withRoleProtection(['admin'], async (request, user) => {
  // Handler code here - auth is already verified
  // user is guaranteed to have admin role
  
  try {
    // Admin-only logic
    const users = [
      // ... fetch users ...
    ];

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const POST = withRoleProtection(['admin'], async (request, user) => {
  // Create new user (admin only)
  try {
    const data = await request.json();
    
    // Validation...
    
    // ... create user in database ...

    return NextResponse.json(
      { message: 'User created', userId: 'xxx' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
