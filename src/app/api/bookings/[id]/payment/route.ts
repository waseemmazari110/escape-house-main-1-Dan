/**
 * Booking Payment Checkout API
 * Create payment intents for booking deposits and balances
 * STEP 2.2 - Stripe Integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createBookingPaymentIntent } from '@/lib/stripe-booking-payments';
import { getCurrentUserWithRole } from '@/lib/auth-roles';

/**
 * POST /api/bookings/[id]/payment
 * Create payment intent for booking deposit or balance
 * 
 * Body: { paymentType: 'deposit' | 'balance' }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // AUTHENTICATION REQUIRED
    const currentUser = await getCurrentUserWithRole();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'You must be logged in to make a payment', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const bookingId = parseInt(params.id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { paymentType } = body;

    // Validate payment type
    if (!paymentType || (paymentType !== 'deposit' && paymentType !== 'balance')) {
      return NextResponse.json(
        { error: 'paymentType must be "deposit" or "balance"', code: 'INVALID_PAYMENT_TYPE' },
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

    // Validate booking status
    if (bookingData.bookingStatus === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot pay for a cancelled booking', code: 'BOOKING_CANCELLED' },
        { status: 400 }
      );
    }

    if (bookingData.bookingStatus === 'completed') {
      return NextResponse.json(
        { error: 'Booking is already completed', code: 'BOOKING_COMPLETED' },
        { status: 400 }
      );
    }

    // Check if payment already made
    if (paymentType === 'deposit' && bookingData.depositPaid) {
      return NextResponse.json(
        { error: 'Deposit already paid', code: 'ALREADY_PAID' },
        { status: 400 }
      );
    }

    if (paymentType === 'balance' && bookingData.balancePaid) {
      return NextResponse.json(
        { error: 'Balance already paid', code: 'ALREADY_PAID' },
        { status: 400 }
      );
    }

    // Check if deposit is paid before allowing balance payment
    if (paymentType === 'balance' && !bookingData.depositPaid) {
      return NextResponse.json(
        { error: 'Deposit must be paid before balance', code: 'DEPOSIT_REQUIRED' },
        { status: 400 }
      );
    }

    // Get payment amount
    const amount = paymentType === 'deposit' 
      ? bookingData.depositAmount 
      : bookingData.balanceAmount;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid payment amount', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await createBookingPaymentIntent({
      bookingId,
      amount,
      paymentType,
      guestEmail: bookingData.guestEmail,
      guestName: bookingData.guestName,
      guestPhone: bookingData.guestPhone,
      propertyName: bookingData.propertyName,
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
    });

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.paymentIntentId,
        clientSecret: paymentIntent.clientSecret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        customerId: paymentIntent.customerId,
      },
      bookingDetails: {
        id: bookingData.id,
        propertyName: bookingData.propertyName,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guestName: bookingData.guestName,
        paymentType,
        amountDue: amount,
      },
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings/[id]/payment
 * Get payment status and details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = parseInt(params.id);

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

    return NextResponse.json({
      bookingId,
      paymentStatus: {
        deposit: {
          amount: bookingData.depositAmount,
          paid: bookingData.depositPaid,
          paymentIntentId: bookingData.stripeDepositPaymentIntentId,
          chargeId: bookingData.stripeDepositChargeId,
        },
        balance: {
          amount: bookingData.balanceAmount,
          paid: bookingData.balancePaid,
          paymentIntentId: bookingData.stripeBalancePaymentIntentId,
          chargeId: bookingData.stripeBalanceChargeId,
        },
        total: bookingData.totalPrice,
        refundId: bookingData.stripeRefundId,
      },
      stripeCustomerId: bookingData.stripeCustomerId,
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get payment status',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
