import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, bookings, properties, payments } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { 
  getCurrentUserWithRole, 
  isAdmin,
  unauthorizedResponse,
  unauthenticatedResponse
} from "@/lib/auth-roles";
import { logAuditEvent } from '@/lib/audit-logger';

/**
 * GET /api/admin/users
 * List all users (Admin only)
 */
export async function GET() {
  try {
    const currentUser = await getCurrentUserWithRole();
    
    // Must be admin
    if (!currentUser || !isAdmin(currentUser)) {
      return unauthorizedResponse('Admin access required');
    }

    // Get all users with their details
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({
      users: allUsers,
      total: allUsers.length,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users?id=<userId>
 * Delete a user and all their related data (Admin only)
 * Admins can delete any owner or guest user
 */
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserWithRole();
    
    // Must be authenticated
    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    // Must be admin
    if (!isAdmin(currentUser)) {
      return unauthorizedResponse('Admin access required');
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userToDelete = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userToDelete.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const targetUser = userToDelete[0];

    // Prevent admin from deleting themselves
    if (targetUser.id === currentUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account', code: 'CANNOT_DELETE_SELF' },
        { status: 400 }
      );
    }

    // Prevent deleting other admins (optional safety check)
    if ((targetUser.role as any) === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete other admin accounts', code: 'CANNOT_DELETE_ADMIN' },
        { status: 403 }
      );
    }

    // Delete related data in correct order (respecting foreign key constraints)
    // 1. Delete bookings where user's email matches guestEmail
    await db.delete(bookings).where(eq(bookings.guestEmail, targetUser.email));

    // 2. Get properties owned by the user
    const userProperties = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.ownerId, userId));

    // 3. Delete payments made by the user
    await db.delete(payments).where(eq(payments.userId, userId));

    // 4. Finally, delete the user
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    // Log the deletion action
    await logAuditEvent({
      userId: currentUser.id,
      action: 'user.delete',
      resourceType: 'user',
      resourceId: userId,
      details: {
        deletedUserEmail: targetUser.email,
        deletedUserRole: targetUser.role,
        deletedUserName: targetUser.name,
        propertiesCount: userProperties.length,
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: deletedUser[0].id,
        email: deletedUser[0].email,
        name: deletedUser[0].name,
        role: deletedUser[0].role,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
