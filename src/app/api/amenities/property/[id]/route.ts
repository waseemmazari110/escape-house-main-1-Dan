/**
 * Property Amenities API
 * 
 * GET /api/amenities/property/[id] - Get property amenities
 * POST /api/amenities/property/[id] - Update property amenities
 * 
 * Milestone 8: Amenities, Pricing, Multi-Property
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getPropertyAmenities,
  savePropertyAmenities,
  validateAmenityIds,
} from '@/lib/amenities';
import { logAuditEvent } from '@/lib/audit-logger';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/amenities/property/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    // Get property amenities
    const amenities = await getPropertyAmenities(propertyId);

    return NextResponse.json({
      success: true,
      propertyId,
      amenities,
      total: amenities.length,
    });
  } catch (error: any) {
    console.error('Get property amenities error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/amenities/property/[id]
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only owners and admins can update amenities
    const userRole = (session.user as any).role;
    if (userRole !== 'owner' && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only property owners can update amenities' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const propertyId = parseInt(id);
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    // Verify property exists and user owns it (if not admin)
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (!property || property.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (userRole !== 'admin' && property[0].ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not own this property' },
        { status: 403 }
      );
    }

    // Parse body
    const body = await req.json();
    const { amenityIds } = body;

    if (!Array.isArray(amenityIds)) {
      return NextResponse.json(
        { error: 'amenityIds must be an array' },
        { status: 400 }
      );
    }

    // Validate amenity IDs
    const validation = validateAmenityIds(amenityIds);
    if (validation.invalid.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid amenity IDs',
          invalidIds: validation.invalid,
        },
        { status: 400 }
      );
    }

    // Save amenities
    await savePropertyAmenities(propertyId, amenityIds);

    // Get updated amenities
    const updatedAmenities = await getPropertyAmenities(propertyId);

    // Log audit event
    await logAuditEvent({
      userId: session.user.id,
      action: 'property.update',
      resourceType: 'property',
      resourceId: propertyId.toString(),
      details: {
        operation: 'update-amenities',
        amenityCount: amenityIds.length,
        amenityIds,
      },
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      propertyId,
      amenities: updatedAmenities,
      total: updatedAmenities.length,
    });
  } catch (error: any) {
    console.error('Update property amenities error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
