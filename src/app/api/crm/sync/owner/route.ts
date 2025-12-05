// API Route: Sync Owner to CRM
// POST /api/crm/sync/owner

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCRMService } from '@/lib/crm';
import { CRMSyncLogger } from '@/lib/crm/sync-logger';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user from database
    const [userData] = await db.select().from(user).where(eq(user.id, userId));

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only sync owners
    if (userData.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only owners can be synced to CRM' },
        { status: 400 }
      );
    }

    // Check if already synced
    if (userData.crmId && userData.crmSyncStatus === 'synced') {
      return NextResponse.json({
        success: true,
        message: 'Owner already synced to CRM',
        crmId: userData.crmId,
      });
    }

    // Get CRM service
    const crmService = getCRMService();

    // Prepare contact data
    const [firstName, ...lastNameParts] = (userData.name || '').split(' ');
    const lastName = lastNameParts.join(' ') || firstName;

    const contactData = {
      firstName,
      lastName,
      email: userData.email,
      phone: userData.phone || undefined,
      companyName: userData.companyName || undefined,
      role: userData.role as 'owner',
      membershipStatus: (userData.membershipStatus as any) || 'pending',
      source: 'website',
      createdAt: userData.createdAt || new Date(),
      updatedAt: userData.updatedAt || new Date(),
    };

    // Log pending sync
    await CRMSyncLogger.logPending('contact', userId, 'create');

    // Sync to CRM
    const result = await crmService.createContact(contactData);

    if (result.success && result.crmId) {
      // Update user with CRM ID
      await db
        .update(user)
        .set({
          crmId: result.crmId,
          crmSyncStatus: 'synced',
          crmLastSyncedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      // Log success
      await CRMSyncLogger.logSuccess(
        'contact',
        userId,
        result.crmId,
        'create',
        contactData,
        result
      );

      return NextResponse.json({
        success: true,
        message: 'Owner synced to CRM successfully',
        crmId: result.crmId,
      });
    } else {
      // Update sync status to failed
      await db
        .update(user)
        .set({
          crmSyncStatus: 'failed',
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      // Log failure
      await CRMSyncLogger.logFailure(
        'contact',
        userId,
        'create',
        result.error || 'Unknown error',
        contactData
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
    console.error('Owner CRM sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const [userData] = await db.select().from(user).where(eq(user.id, userId));

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      userId: userData.id,
      crmId: userData.crmId,
      syncStatus: userData.crmSyncStatus,
      lastSyncedAt: userData.crmLastSyncedAt,
    });
  } catch (error: any) {
    console.error('Sync status check error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
