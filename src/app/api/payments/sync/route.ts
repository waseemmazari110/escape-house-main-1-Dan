/**
 * API Route: Sync Payments from Stripe
 * Fallback mechanism to sync payment history from Stripe
 * Owner-only endpoint for manual sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { syncAllUserPayments } from '@/lib/stripe-billing';
import { nowUKFormatted } from '@/lib/date-utils';

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/payments/sync`);

  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow owners to sync their own payments
    if (session.user.role !== 'owner' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Owner access required' },
        { status: 403 }
      );
    }

    console.log(`[${nowUKFormatted()}] Syncing payments for user ${session.user.id}`);

    // Sync all payments from Stripe
    const result = await syncAllUserPayments(session.user.id);

    console.log(`[${nowUKFormatted()}] Sync completed - ${result.synced} payments synced, ${result.errors.length} errors`);

    return NextResponse.json({
      success: true,
      synced: result.synced,
      errors: result.errors,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${nowUKFormatted()}] Payment sync error:`, errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync payments',
        message: errorMessage,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Check sync status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Payment sync endpoint is active',
      userId: session.user.id,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check sync status' },
      { status: 500 }
    );
  }
}
