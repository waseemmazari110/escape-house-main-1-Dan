// API Route: Bulk CRM Sync
// POST /api/crm/sync/bulk

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, properties } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCRMService } from '@/lib/crm';

export async function POST(request: NextRequest) {
  try {
    const { syncType } = await request.json();

    if (!syncType || !['owners', 'properties', 'all'].includes(syncType)) {
      return NextResponse.json(
        { error: 'Invalid sync type. Use: owners, properties, or all' },
        { status: 400 }
      );
    }

    const results = {
      owners: { synced: 0, failed: 0, skipped: 0 },
      properties: { synced: 0, failed: 0, skipped: 0 },
    };

    const crmService = getCRMService();

    // Sync owners
    if (syncType === 'owners' || syncType === 'all') {
      const owners = await db
        .select()
        .from(user)
        .where(eq(user.role, 'owner'));

      for (const owner of owners) {
        // Skip if already synced
        if (owner.crmId && owner.crmSyncStatus === 'synced') {
          results.owners.skipped++;
          continue;
        }

        const [firstName, ...lastNameParts] = (owner.name || '').split(' ');
        const lastName = lastNameParts.join(' ') || firstName;

        const contactData = {
          firstName,
          lastName,
          email: owner.email,
          phone: owner.phone || undefined,
          companyName: owner.companyName || undefined,
          role: 'owner' as const,
          membershipStatus: (owner.membershipStatus as any) || 'pending',
          source: 'bulk_sync',
          createdAt: owner.createdAt || new Date(),
          updatedAt: owner.updatedAt || new Date(),
        };

        const result = await crmService.createContact(contactData);

        if (result.success && result.crmId) {
          await db
            .update(user)
            .set({
              crmId: result.crmId,
              crmSyncStatus: 'synced',
              crmLastSyncedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(user.id, owner.id));
          
          results.owners.synced++;
        } else {
          await db
            .update(user)
            .set({
              crmSyncStatus: 'failed',
              updatedAt: new Date(),
            })
            .where(eq(user.id, owner.id));
          
          results.owners.failed++;
        }
      }
    }

    // Sync properties
    if (syncType === 'properties' || syncType === 'all') {
      const propertiesList = await db
        .select()
        .from(properties)
        .where(eq(properties.isPublished, true));

      for (const property of propertiesList) {
        // Skip if already synced
        if (property.crmId && property.crmSyncStatus === 'synced') {
          results.properties.skipped++;
          continue;
        }

        let ownerCrmId = null;
        if (property.ownerId) {
          const [ownerData] = await db
            .select()
            .from(user)
            .where(eq(user.id, property.ownerId));
          
          ownerCrmId = ownerData?.crmId;
        }

        const propertyData = {
          ownerId: property.ownerId || 'unknown',
          ownerCrmId,
          name: property.title,
          address: property.location,
          city: property.region,
          country: 'United Kingdom',
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          maxGuests: property.sleepsMax,
          pricePerNight: property.priceFromMidweek,
          status: 'published' as const,
          createdAt: new Date(property.createdAt),
          updatedAt: new Date(property.updatedAt),
        };

        const result = await crmService.createProperty(propertyData as any);

        if (result.success && result.crmId) {
          await db
            .update(properties)
            .set({
              crmId: result.crmId,
              crmSyncStatus: 'synced',
              crmLastSyncedAt: new Date(),
              updatedAt: new Date().toISOString(),
            })
            .where(eq(properties.id, property.id));
          
          results.properties.synced++;
        } else {
          await db
            .update(properties)
            .set({
              crmSyncStatus: 'failed',
              updatedAt: new Date().toISOString(),
            })
            .where(eq(properties.id, property.id));
          
          results.properties.failed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bulk sync completed',
      results,
    });
  } catch (error: any) {
    console.error('Bulk CRM sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
