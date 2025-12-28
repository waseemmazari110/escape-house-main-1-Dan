/**
 * Admin API Route: Backfill Invoices
 * Creates invoice records for existing subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { subscriptions, invoices, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { createInvoiceFromStripe } from '@/lib/stripe-billing';
import { nowUKFormatted } from '@/lib/date-utils';

const stripeSecretKey = process.env.STRIPE_TEST_KEY || process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/admin/backfill-invoices`);

  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userRecord = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userRecord[0] || userRecord[0].role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const results = {
      processed: 0,
      created: 0,
      existing: 0,
      errors: [] as string[],
    };

    // Get all subscriptions
    const allSubscriptions = await db.select().from(subscriptions);
    console.log(`Found ${allSubscriptions.length} subscriptions to process`);

    for (const subscription of allSubscriptions) {
      try {
        results.processed++;

        // Skip if no subscription ID
        if (!subscription.stripeSubscriptionId) {
          continue;
        }

        // Get invoices from Stripe for this subscription
        const stripeInvoices = await stripe.invoices.list({
          subscription: subscription.stripeSubscriptionId,
          limit: 100,
        });

        for (const stripeInvoice of stripeInvoices.data) {
          // Check if invoice already exists
          const existingInvoice = await db
            .select()
            .from(invoices)
            .where(eq(invoices.stripeInvoiceId, stripeInvoice.id))
            .limit(1);

          if (existingInvoice.length === 0) {
            // Create the invoice
            await createInvoiceFromStripe(stripeInvoice, subscription.userId);
            results.created++;
            console.log(`Created invoice ${stripeInvoice.id} for user ${subscription.userId}`);
          } else {
            results.existing++;
          }
        }
      } catch (error) {
        const errorMsg = `Error processing subscription ${subscription.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        results.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    console.log(`[${nowUKFormatted()}] Backfill complete:`, results);

    return NextResponse.json({
      success: true,
      results,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${nowUKFormatted()}] Backfill error:`, errorMessage);

    return NextResponse.json(
      {
        error: 'Failed to backfill invoices',
        message: errorMessage,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
