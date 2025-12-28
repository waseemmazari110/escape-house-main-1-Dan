/**
 * API Route: Owner Payment Sync
 * Sync payments from Stripe webhook data to database
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { 
  getCurrentUserWithRole,
  unauthenticatedResponse
} from "@/lib/auth-roles";
import { stripe } from "@/lib/stripe-billing";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const currentUser = await getCurrentUserWithRole();

    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    // Get recent payment intents from Stripe for this user
    // (We can't directly query by metadata, so we'll get all and filter)
    const paymentIntents = await stripe.paymentIntents.list({ 
      limit: 100,
      expand: ['data.charges']
    });

    let syncedCount = 0;

    // Process each payment intent
    for (const intent of paymentIntents.data) {
      // Check if this is for the current user
      const userId = intent.metadata?.userId;
      if (!userId || userId !== currentUser.id) {
        continue;
      }

      // Check if payment already exists
      const existing = await db
        .select()
        .from(payments)
        .where(eq(payments.stripePaymentIntentId, intent.id));

      if (existing.length === 0 && intent.status === 'succeeded') {
        // Create payment record
        const charge = (intent.charges as any)?.data?.[0];
        
        try {
          await db.insert(payments).values({
            userId: currentUser.id,
            stripeCustomerId: intent.customer as string || null,
            stripePaymentIntentId: intent.id,
            stripeChargeId: charge?.id || null,
            stripeInvoiceId: intent.invoice as string || null,
            amount: intent.amount / 100,
            currency: intent.currency.toUpperCase(),
            paymentStatus: intent.status,
            paymentMethod: charge?.payment_method_details?.type || null,
            paymentMethodBrand: (charge?.payment_method_details as any)?.card?.brand || null,
            paymentMethodLast4: (charge?.payment_method_details as any)?.card?.last4 || null,
            description: intent.description || 'Subscription payment',
            receiptUrl: charge?.receipt_url || null,
            receiptEmail: intent.receipt_email || null,
            failureCode: (intent as any).last_payment_error?.code || null,
            failureMessage: (intent as any).last_payment_error?.message || null,
            metadata: JSON.stringify(intent.metadata || {}),
            stripeEventId: 'manual_sync',
            processedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          
          syncedCount++;
        } catch (error) {
          console.error('Error inserting payment:', error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      message: `Successfully synced ${syncedCount} payments from Stripe`
    });

  } catch (error) {
    console.error("Error syncing payments:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to sync payments", 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
