/**
 * Admin Property Rejection API
 * 
 * POST /api/admin/properties/[id]/reject - Reject a property listing
 * 
 * Admin-only endpoint to reject property listings with a reason.
 * Rejected properties remain hidden from the frontend and public APIs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';
import { logAuditEvent } from '@/lib/audit-logger';
import { rejectPropertySchema } from '@/lib/validations/property-validations';
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

    console.log('[Reject Property] Request received for property ID:', propertyId);

    if (isNaN(propertyId)) {
      console.log('[Reject Property] Invalid property ID');
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    // Authentication check
    console.log('[Reject Property] Checking authentication...');
    const currentUser = await getCurrentUserWithRole();

    if (!currentUser) {
      console.log('[Reject Property] No user session found');
      return unauthenticatedResponse('Please log in to access this resource');
    }

    console.log('[Reject Property] User authenticated:', { id: currentUser.id, role: currentUser.role });

    // Admin role check
    if (!isAdmin(currentUser)) {
      console.log('[Reject Property] User is not admin:', currentUser.role);
      return unauthorizedResponse('Admin access required');
    }

    console.log('[Reject Property] Admin check passed');

    // Parse and validate request body
    const body = await request.json();
    console.log('[Reject Property] Request body:', body);
    
    const validation = rejectPropertySchema.safeParse({
      propertyId,
      reason: body.reason,
    });

    if (!validation.success) {
      console.log('[Reject Property] Validation failed:', validation.error);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { reason } = validation.data;
    console.log('[Reject Property] Rejection reason:', reason);

    // Fetch property
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      console.log('[Reject Property] Property not found:', propertyId);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const currentProperty = property[0];
    console.log('[Reject Property] Property found:', { id: currentProperty.id, title: currentProperty.title, status: currentProperty.status });

    // Update property status to rejected
    const timestamp = nowUKFormatted();
    console.log('[Reject Property] Updating property status to rejected...');
    
    await db
      .update(properties)
      .set({
        status: 'rejected',
        rejectionReason: reason,
        approvedBy: null, // Clear approval data
        approvedAt: null,
        updatedAt: timestamp,
      })
      .where(eq(properties.id, propertyId));

    console.log('[Reject Property] Property updated successfully');

    // Audit log
    await logAuditEvent({
      userId: currentUser.id,
      action: 'property.create', // Using existing audit action type
      resourceType: 'property',
      resourceId: propertyId.toString(),
      details: {
        propertyTitle: currentProperty.title,
        previousStatus: currentProperty.status,
        newStatus: 'rejected',
        rejectionReason: reason,
        ownerId: currentProperty.ownerId,
      },
    });

    const result = {
      success: true,
      message: 'Property rejected',
      property: {
        id: propertyId,
        title: currentProperty.title,
        status: 'rejected',
        rejectionReason: reason,
        rejectedBy: currentUser.id,
        rejectedAt: timestamp,
        ownerId: currentProperty.ownerId,
      },
      timestamp,
    };

    console.log('[Reject Property] Success:', result);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('[Reject Property] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to reject property',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
