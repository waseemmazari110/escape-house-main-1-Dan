/**
 * Admin User Management API - Individual User Operations
 * 
 * GET    /api/admin/users/[id] - Get user details
 * DELETE /api/admin/users/[id] - Delete user (Admin only)
 * PATCH  /api/admin/users/[id] - Update user details (Admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, bookings, properties, payments, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { 
  getCurrentUserWithRole, 
  isAdmin,
  unauthorizedResponse,
  unauthenticatedResponse
} from "@/lib/auth-roles";
import { logAuditEvent } from '@/lib/audit-logger';

/**
 * GET /api/admin/users/[id]
 * Get detailed information about a specific user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Get user details
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's properties count
    const userProperties = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.ownerId, id));

    // Get user's bookings count (match by email)
    const userBookings = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(eq(bookings.guestEmail, user[0].email));

    return NextResponse.json({
      user: user[0],
      stats: {
        propertiesCount: userProperties.length,
        bookingsCount: userBookings.length,
      },
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user and all their related data (Admin only)
 * Admins can delete any owner or guest user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: userId } = await params;

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

    // Get counts before deletion for logging
    const userProperties = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.ownerId, userId));

    const userBookings = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(eq(bookings.guestEmail, targetUser.email));

    // Delete related data in correct order (respecting foreign key constraints)
    
    // 1. Delete subscriptions (if table exists)
    try {
      await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    } catch (e) {
      // Subscriptions table may not exist
      console.log('Subscriptions table not available or no subscriptions to delete');
    }

    // 2. Delete payments
    await db.delete(payments).where(eq(payments.userId, userId));

    // 3. Delete bookings where user's email matches guestEmail
    await db.delete(bookings).where(eq(bookings.guestEmail, targetUser.email));

    // 4. Delete properties owned by the user (cascading will handle related tables)
    for (const property of userProperties) {
      await db.delete(properties).where(eq(properties.id, property.id));
    }

    // 5. Finally, delete the user
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
        propertiesDeleted: userProperties.length,
        bookingsDeleted: userBookings.length,
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
      deletedData: {
        properties: userProperties.length,
        bookings: userBookings.length,
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

/**
 * PATCH /api/admin/users/[id]
 * Update user details (role, name, email verification status, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: userId } = await params;
    const body = await request.json();

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent changing own role
    if (userId === currentUser.id && body.role) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Build update object (only allow certain fields)
    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.emailVerified !== undefined) updateData.emailVerified = body.emailVerified;

    updateData.updatedAt = new Date();

    // Update user
    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    // Log the update action
    await logAuditEvent({
      userId: currentUser.id,
      action: 'user.update',
      resourceType: 'user',
      resourceId: userId,
      details: {
        updatedFields: Object.keys(updateData).filter(k => k !== 'updatedAt'),
        targetUserEmail: existingUser[0].email,
        changes: updateData,
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser[0],
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
