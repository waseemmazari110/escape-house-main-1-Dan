// API Route: Sync Property to CRM
// POST /api/crm/sync/property

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCRMService } from '@/lib/crm';
import { CRMSyncLogger } from '@/lib/crm/sync-logger';

export async function POST(request: NextRequest) {
  try {
    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Fetch property from database
    const [propertyData] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));

    if (!propertyData) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if already synced
    if (propertyData.crmId && propertyData.crmSyncStatus === 'synced') {
      return NextResponse.json({
        success: true,
        message: 'Property already synced to CRM',
        crmId: propertyData.crmId,
      });
    }

    // Get owner's CRM ID if available
    let ownerCrmId = null;
    if (propertyData.ownerId) {
      const [ownerData] = await db
        .select()
        .from(user)
        .where(eq(user.id, propertyData.ownerId));
      
      ownerCrmId = ownerData?.crmId;
    }

    // Get CRM service
    const crmService = getCRMService();

    // Prepare property data
    const propertyPayload = {
      ownerId: propertyData.ownerId || 'unknown',
      ownerCrmId,
      name: propertyData.title,
      address: propertyData.location,
      city: propertyData.region,
      country: 'United Kingdom',
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      maxGuests: propertyData.sleepsMax,
      pricePerNight: propertyData.priceFromMidweek,
      status: propertyData.isPublished ? 'published' : 'draft',
      customFields: {
        slug: propertyData.slug,
        featured: propertyData.featured,
        heroImage: propertyData.heroImage,
      },
      createdAt: new Date(propertyData.createdAt),
      updatedAt: new Date(propertyData.updatedAt),
    };

    // Log pending sync
    await CRMSyncLogger.logPending('property', propertyId.toString(), 'create');

    // Sync to CRM
    const result = await crmService.createProperty(propertyPayload as any);

    if (result.success && result.crmId) {
      // Update property with CRM ID
      await db
        .update(properties)
        .set({
          crmId: result.crmId,
          crmSyncStatus: 'synced',
          crmLastSyncedAt: new Date(),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(properties.id, propertyId));

      // Log success
      await CRMSyncLogger.logSuccess(
        'property',
        propertyId.toString(),
        result.crmId,
        'create',
        propertyPayload,
        result
      );

      return NextResponse.json({
        success: true,
        message: 'Property synced to CRM successfully',
        crmId: result.crmId,
      });
    } else {
      // Update sync status to failed
      await db
        .update(properties)
        .set({
          crmSyncStatus: 'failed',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(properties.id, propertyId));

      // Log failure
      await CRMSyncLogger.logFailure(
        'property',
        propertyId.toString(),
        'create',
        result.error || 'Unknown error',
        propertyPayload
      );

      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to sync to CRM',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Property CRM sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
