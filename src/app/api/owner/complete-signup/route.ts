import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCRMService } from "@/lib/crm";
import { CRMSyncLogger } from "@/lib/crm/sync-logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, phone, propertyName, propertyAddress, companyName, role } = body;

    // Use either userId or email to find the user
    let userIdentifier;
    if (userId) {
      userIdentifier = eq(user.id, userId);
    } else if (email) {
      userIdentifier = eq(user.email, email);
    } else {
      return NextResponse.json(
        { error: "User ID or email is required" },
        { status: 400 }
      );
    }

    // Update user with additional owner information
    await db
      .update(user)
      .set({
        role: role || "owner",
        phone: phone || null,
        companyName: companyName || propertyName || null,
        updatedAt: new Date(),
      })
      .where(userIdentifier);

    // Fetch updated user data
    const [updatedUser] = await db
      .select()
      .from(user)
      .where(userIdentifier);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found after update" },
        { status: 404 }
      );
    }

    // AUTO-SYNC TO CRM (TreadSoft)
    // This runs in the background and doesn't block the response
    syncOwnerToCRM(updatedUser.id, updatedUser.name, updatedUser.email, phone, companyName || propertyName)
      .then((result) => {
        if (result.success) {
          console.log(`✅ Owner ${updatedUser.email} synced to CRM: ${result.crmId}`);
        } else {
          console.error(`❌ Failed to sync owner ${updatedUser.email} to CRM:`, result.error);
        }
      })
      .catch((error) => {
        console.error('CRM sync background task failed:', error);
      });

    return NextResponse.json({
      success: true,
      message: "Owner profile completed successfully",
    });
  } catch (error) {
    console.error("Complete signup error:", error);
    return NextResponse.json(
      { error: "Failed to complete signup" },
      { status: 500 }
    );
  }
}

// Background CRM sync function
async function syncOwnerToCRM(
  userId: string,
  name: string,
  email: string,
  phone?: string,
  companyName?: string
) {
  try {
    const crmService = getCRMService();

    // Prepare contact data
    const [firstName, ...lastNameParts] = (name || '').split(' ');
    const lastName = lastNameParts.join(' ') || firstName;

    const contactData = {
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      companyName: companyName || undefined,
      role: 'owner' as const,
      membershipStatus: 'pending' as const,
      source: 'website_registration',
      createdAt: new Date(),
      updatedAt: new Date(),
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

      return { success: true, crmId: result.crmId };
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

      return { success: false, error: result.error || 'Unknown error' };
    }
  } catch (error: any) {
    console.error('CRM sync error:', error);
    return { success: false, error: error.message };
  }
}

