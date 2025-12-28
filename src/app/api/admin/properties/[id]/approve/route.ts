/**
 * Admin Property Approval API
 * 
 * POST /api/admin/properties/[id]/approve - Approve a property listing
 * 
 * Admin-only endpoint to approve property listings submitted by owners.
 * Once approved, the property becomes visible on the frontend and public APIs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';
import { logAuditEvent } from '@/lib/audit-logger';
import { 
  getCurrentUserWithRole, 
  isAdmin,
  unauthorizedResponse,
  unauthenticatedResponse
} from '@/lib/auth-roles';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);

    console.log('[Approve Property] Request received for property ID:', propertyId);

    if (isNaN(propertyId)) {
      console.log('[Approve Property] Invalid property ID');
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    // Authentication check
    console.log('[Approve Property] Checking authentication...');
    const currentUser = await getCurrentUserWithRole();

    if (!currentUser) {
      console.log('[Approve Property] No user session found');
      return unauthenticatedResponse('Please log in to access this resource');
    }

    console.log('[Approve Property] User authenticated:', { id: currentUser.id, role: currentUser.role });

    // Admin role check
    if (!isAdmin(currentUser)) {
      console.log('[Approve Property] User is not admin:', currentUser.role);
      return unauthorizedResponse('Admin access required');
    }

    console.log('[Approve Property] Admin check passed');

    // Fetch property
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      console.log('[Approve Property] Property not found:', propertyId);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const currentProperty = property[0];
    console.log('[Approve Property] Property found:', { id: currentProperty.id, title: currentProperty.title, status: currentProperty.status });

    // Check if already approved
    if (currentProperty.status === 'approved') {
      console.log('[Approve Property] Property already approved');
      return NextResponse.json(
        { 
          success: true,
          message: 'Property is already approved',
          property: {
            id: currentProperty.id,
            title: currentProperty.title,
            status: currentProperty.status,
            approvedAt: currentProperty.approvedAt,
            approvedBy: currentProperty.approvedBy,
          }
        },
        { status: 200 }
      );
    }

    // Update property status to approved
    const timestamp = nowUKFormatted();
    console.log('[Approve Property] Updating property status to approved...');
    
    await db
      .update(properties)
      .set({
        status: 'approved',
        approvedBy: currentUser.id,
        approvedAt: timestamp,
        rejectionReason: null, // Clear any previous rejection reason
        updatedAt: timestamp,
      })
      .where(eq(properties.id, propertyId));

    console.log('[Approve Property] Property updated successfully');

    // Audit log
    await logAuditEvent({
      userId: currentUser.id,
      action: 'property.create', // Using existing audit action type
      resourceType: 'property',
      resourceId: propertyId.toString(),
      details: {
        propertyTitle: currentProperty.title,
        previousStatus: currentProperty.status,
        newStatus: 'approved',
        ownerId: currentProperty.ownerId,
      },
    });

    const result = {
      success: true,
      message: 'Property approved successfully',
      property: {
        id: propertyId,
        title: currentProperty.title,
        status: 'approved',
        approvedBy: currentUser.id,
        approvedAt: timestamp,
        ownerId: currentProperty.ownerId,
      },
      timestamp,
    };

    console.log('[Approve Property] Success:', result);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('[Approve Property] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to approve property',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
