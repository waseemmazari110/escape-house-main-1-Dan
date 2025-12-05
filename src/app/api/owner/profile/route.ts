// API Route: Update Owner Profile with CRM Sync
// PUT /api/owner/profile

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getCRMService } from '@/lib/crm';
import { CRMSyncLogger } from '@/lib/crm/sync-logger';

export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, phone, companyName, membershipStatus } = body;

    // Fetch current user data
    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user in database
    await db
      .update(user)
      .set({
        name: name || currentUser.name,
        phone: phone || currentUser.phone,
        companyName: companyName || currentUser.companyName,
        membershipStatus: membershipStatus || currentUser.membershipStatus,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    // Fetch updated user
    const [updatedUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    // Sync to CRM if user is an owner and has CRM ID (update)
    if (updatedUser.role === 'owner') {
      syncProfileUpdateToCRM(updatedUser)
        .then((result) => {
          if (result.success) {
            console.log(`✅ Profile updated in CRM for ${updatedUser.email}`);
          } else {
            console.error(`❌ Failed to sync profile update to CRM:`, result.error);
          }
        })
        .catch((error) => {
          console.error('CRM profile sync failed:', error);
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        companyName: updatedUser.companyName,
        role: updatedUser.role,
        membershipStatus: updatedUser.membershipStatus,
        crmSyncStatus: updatedUser.crmSyncStatus,
      },
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      companyName: userData.companyName,
      role: userData.role,
      membershipStatus: userData.membershipStatus,
      crmId: userData.crmId,
      crmSyncStatus: userData.crmSyncStatus,
      crmLastSyncedAt: userData.crmLastSyncedAt,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Background CRM sync function for profile updates
async function syncProfileUpdateToCRM(userData: any) {
  try {
    const crmService = getCRMService();

    const [firstName, ...lastNameParts] = (userData.name || '').split(' ');
    const lastName = lastNameParts.join(' ') || firstName;

    const contactUpdate = {
      firstName,
      lastName,
      email: userData.email,
      phone: userData.phone,
      companyName: userData.companyName,
      role: userData.role,
      membershipStatus: userData.membershipStatus || 'pending',
    };

    // If user has CRM ID, update existing record
    if (userData.crmId) {
      await CRMSyncLogger.logPending('contact', userData.id, 'update');

      const result = await crmService.updateContact(userData.crmId, contactUpdate);

      if (result.success) {
        await db
          .update(user)
          .set({
            crmSyncStatus: 'synced',
            crmLastSyncedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(user.id, userData.id));

        await CRMSyncLogger.logSuccess(
          'contact',
          userData.id,
          userData.crmId,
          'update',
          contactUpdate,
          result
        );

        return { success: true };
      } else {
        await db
          .update(user)
          .set({
            crmSyncStatus: 'failed',
            updatedAt: new Date(),
          })
          .where(eq(user.id, userData.id));

        await CRMSyncLogger.logFailure(
          'contact',
          userData.id,
          'update',
          result.error || 'Unknown error',
          contactUpdate
        );

        return { success: false, error: result.error };
      }
    } else {
      // Create new CRM record if no CRM ID exists
      const fullContactData = {
        ...contactUpdate,
        createdAt: userData.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await CRMSyncLogger.logPending('contact', userData.id, 'create');

      const result = await crmService.createContact(fullContactData);

      if (result.success && result.crmId) {
        await db
          .update(user)
          .set({
            crmId: result.crmId,
            crmSyncStatus: 'synced',
            crmLastSyncedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(user.id, userData.id));

        await CRMSyncLogger.logSuccess(
          'contact',
          userData.id,
          result.crmId,
          'create',
          fullContactData,
          result
        );

        return { success: true, crmId: result.crmId };
      } else {
        await db
          .update(user)
          .set({
            crmSyncStatus: 'failed',
            updatedAt: new Date(),
          })
          .where(eq(user.id, userData.id));

        await CRMSyncLogger.logFailure(
          'contact',
          userData.id,
          'create',
          result.error || 'Unknown error',
          fullContactData
        );

        return { success: false, error: result.error };
      }
    }
  } catch (error: any) {
    console.error('CRM profile sync error:', error);
    return { success: false, error: error.message };
  }
}
