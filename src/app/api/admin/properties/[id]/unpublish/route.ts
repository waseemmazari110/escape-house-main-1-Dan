/**
 * Admin Property Unpublish API
 * 
 * POST /api/admin/properties/[id]/unpublish - Unpublish an approved property listing
 * 
 * Admin-only endpoint to unpublish property listings.
 * Unpublished properties are hidden from public view.
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
import { revalidateProperty } from '@/lib/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const timestamp = nowUKFormatted();
  const { id } = await params;
  const propertyId = parseInt(id);

  console.log(`[${timestamp}] POST /api/admin/properties/${propertyId}/unpublish`);

  try {
    // Verify admin authentication
    const currentUser = await getCurrentUserWithRole();
    
    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    if (!isAdmin(currentUser)) {
      return unauthorizedResponse('Forbidden: Admin access required');
    }

    // Validate property ID
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { 
          error: 'Invalid property ID',
          timestamp 
        },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { 
          error: 'Property not found',
          timestamp 
        },
        { status: 404 }
      );
    }

    const property = existingProperty[0];

    // Unpublish the property
    const [updatedProperty] = await db
      .update(properties)
      .set({
        isPublished: false,
        status: 'rejected', // Set to rejected so it doesn't appear in approved listings
        rejectionReason: 'Unpublished by admin',
        updatedAt: timestamp,
      })
      .where(eq(properties.id, propertyId))
      .returning();

    // Log audit event
    await logAuditEvent({
      userId: currentUser.id,
      action: 'property.unpublish',
      resourceType: 'property',
      resourceId: propertyId.toString(),
      resourceName: property.title,
      details: {
        adminId: currentUser.id,
        adminEmail: currentUser.email,
        previousStatus: property.status,
        ownerId: property.ownerId,
      },
    });

    // Revalidate cache
    revalidateProperty(propertyId.toString(), property.ownerId || '');

    console.log(`[${nowUKFormatted()}] Property unpublished successfully: ${propertyId}`);

    return NextResponse.json({
      success: true,
      message: 'Property unpublished successfully',
      property: {
        id: updatedProperty.id,
        title: updatedProperty.title,
        status: updatedProperty.status,
        isPublished: updatedProperty.isPublished,
        updatedAt: updatedProperty.updatedAt,
      },
      timestamp: nowUKFormatted(),
    });

  } catch (error: any) {
    console.error(`[${nowUKFormatted()}] Error unpublishing property:`, error);
    
    return NextResponse.json(
      { 
        error: 'Failed to unpublish property',
        details: error.message,
        timestamp: nowUKFormatted() 
      },
      { status: 500 }
    );
  }
}
