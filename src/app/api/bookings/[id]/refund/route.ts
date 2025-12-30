/**
 * Booking Refund API
 * Handle refunds for cancelled bookings
 * STEP 2.2 - Stripe Integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createBookingRefund } from '@/lib/stripe-booking-payments';
import { requireRole } from '@/lib/auth-roles';

/**
 * POST /api/bookings/[id]/refund
 * Create refund for booking payment (owner/admin only)
 * 
 * Body: { 
 *   amount?: number, // Optional partial refund amount (in GBP)
 *   reason?: string 
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require owner or admin role
    await requireRole(['owner', 'admin']);

    const { id } = await params;
    const bookingId = parseInt(id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { amount, reason } = body;

    // Get booking
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    // Validate booking can be refunded
    if (!bookingData.depositPaid && !bookingData.balancePaid) {
      return NextResponse.json(
        { error: 'No payments to refund', code: 'NO_PAYMENTS' },
        { status: 400 }
      );
    }

    // Check if already refunded
    if (bookingData.stripeRefundId) {
      return NextResponse.json(
        { error: 'Booking has already been refunded', code: 'ALREADY_REFUNDED' },
        { status: 400 }
      );
    }

    // Determine which charge to refund (balance first if paid, otherwise deposit)
    let chargeId: string | null = null;
    let maxRefundAmount = 0;

    if (bookingData.balancePaid && bookingData.stripeBalanceChargeId) {
      chargeId = bookingData.stripeBalanceChargeId;
      maxRefundAmount = (bookingData.balanceAmount || 0) + (bookingData.depositAmount || 0);
    } else if (bookingData.depositPaid && bookingData.stripeDepositChargeId) {
      chargeId = bookingData.stripeDepositChargeId;
      maxRefundAmount = bookingData.depositAmount || 0;
    }

    if (!chargeId) {
      return NextResponse.json(
        { error: 'No charge ID found for refund', code: 'NO_CHARGE_ID' },
        { status: 400 }
      );
    }

    // Validate refund amount if provided
    if (amount !== undefined) {
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json(
          { error: 'Invalid refund amount', code: 'INVALID_AMOUNT' },
          { status: 400 }
        );
      }

      if (amount > maxRefundAmount) {
        return NextResponse.json(
          { 
            error: `Refund amount cannot exceed £${maxRefundAmount.toFixed(2)}`,
            code: 'AMOUNT_EXCEEDS_PAYMENT' 
          },
          { status: 400 }
        );
      }
    }

    // Create refund
    const refundResult = await createBookingRefund({
      bookingId,
      chargeId,
      amount: amount || undefined, // undefined = full refund
      reason: reason || 'Booking cancellation',
    });

    // Auto-cancel booking if full refund
    if (!amount || amount >= maxRefundAmount) {
      await db
        .update(bookings)
        .set({
          bookingStatus: 'cancelled',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(bookings.id, bookingId));
    }

    return NextResponse.json({
      success: true,
      refund: {
        refundId: refundResult.refundId,
        amount: refundResult.amount,
        status: refundResult.status,
        currency: 'GBP',
      },
      booking: {
        id: bookingId,
        status: !amount || amount >= maxRefundAmount ? 'cancelled' : bookingData.bookingStatus,
      },
      message: `Refund of £${refundResult.amount.toFixed(2)} processed successfully`,
    });

  } catch (error: any) {
    console.error('Refund creation error:', error);
    
    // Handle auth errors
    if (error.message?.includes('Unauthorized') || error.message?.includes('required')) {
      return NextResponse.json(
        { error: error.message, code: 'UNAUTHORIZED' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to process refund',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings/[id]/refund
 * Get refund status for booking
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Get booking
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    // Calculate refundable amount
    let refundableAmount = 0;
    if (bookingData.balancePaid) {
      refundableAmount = (bookingData.balanceAmount || 0) + (bookingData.depositAmount || 0);
    } else if (bookingData.depositPaid) {
      refundableAmount = bookingData.depositAmount || 0;
    }

    return NextResponse.json({
      bookingId,
      refundStatus: {
        hasRefund: !!bookingData.stripeRefundId,
        refundId: bookingData.stripeRefundId,
        refundableAmount,
        currency: 'GBP',
      },
      paymentStatus: {
        depositPaid: bookingData.depositPaid,
        depositAmount: bookingData.depositAmount,
        balancePaid: bookingData.balancePaid,
        balanceAmount: bookingData.balanceAmount,
        totalPaid: (bookingData.depositPaid ? bookingData.depositAmount || 0 : 0) +
                   (bookingData.balancePaid ? bookingData.balanceAmount || 0 : 0),
      },
      bookingStatus: bookingData.bookingStatus,
    });

  } catch (error) {
    console.error('Get refund status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get refund status',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
