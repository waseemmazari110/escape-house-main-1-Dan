/**
 * Booking Status Management API
 * Handle status transitions and payment updates
 * STEP 2.1 - Booking Checkout Flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  updateBookingStatus, 
  confirmBooking, 
  completeBooking, 
  cancelBooking,
  updatePaymentStatus,
  getAvailableActions,
  getStatusInfo,
  type BookingStatus 
} from '@/lib/booking-status';
import { requireRole } from '@/lib/auth-roles';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendBookingCancellationEmail } from '@/lib/booking-notifications';

/**
 * GET /api/bookings/[id]/status
 * Get booking status information and available actions
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

    const currentStatus = booking[0].bookingStatus as BookingStatus;
    const statusInfo = getStatusInfo(currentStatus);
    const availableActions = getAvailableActions(currentStatus);

    return NextResponse.json({
      bookingId,
      currentStatus,
      statusInfo,
      availableActions,
      paymentStatus: {
        depositPaid: booking[0].depositPaid,
        depositAmount: booking[0].depositAmount,
        balancePaid: booking[0].balancePaid,
        balanceAmount: booking[0].balanceAmount,
      },
    });

  } catch (error) {
    console.error('Get status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get booking status',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/bookings/[id]/status
 * Update booking status
 * 
 * Body: { action: 'confirm' | 'complete' | 'cancel', adminNotes?: string, cancelReason?: string }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require owner or admin role
    await requireRole(['owner', 'admin']);

    const bookingId = parseInt(params.id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, adminNotes, cancelReason } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'action is required', code: 'MISSING_ACTION' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'confirm':
        result = await confirmBooking(bookingId, adminNotes);
        break;

      case 'complete':
        result = await completeBooking(bookingId, adminNotes);
        break;

      case 'cancel':
        result = await cancelBooking(bookingId, cancelReason || adminNotes);
        
        // Send cancellation email if cancellation successful
        if (result.success) {
          // Get booking details for email
          const cancelledBooking = await db
            .select()
            .from(bookings)
            .where(eq(bookings.id, bookingId))
            .limit(1);
          
          if (cancelledBooking.length > 0) {
            const booking = cancelledBooking[0];
            
            sendBookingCancellationEmail({
              bookingId,
              guestName: booking.guestName,
              guestEmail: booking.guestEmail,
              propertyName: booking.propertyName,
              checkInDate: booking.checkInDate,
              checkOutDate: booking.checkOutDate,
              cancellationReason: cancelReason || adminNotes,
            }).catch(error => {
              console.error('Failed to send cancellation email:', error);
              // Don't fail the cancellation if email fails
            });
          }
        }
        break;

      default:
        return NextResponse.json(
          { error: `Invalid action: ${action}`, code: 'INVALID_ACTION' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, code: 'STATUS_UPDATE_FAILED' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      bookingId,
      newStatus: result.newStatus,
      message: result.message,
    });

  } catch (error: any) {
    console.error('Update status error:', error);
    
    // Handle auth errors
    if (error.message?.includes('Unauthorized') || error.message?.includes('required')) {
      return NextResponse.json(
        { error: error.message, code: 'UNAUTHORIZED' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to update booking status',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/bookings/[id]/status
 * Update payment status
 * 
 * Body: { paymentType: 'deposit' | 'balance', isPaid: boolean }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require owner or admin role
    await requireRole(['owner', 'admin']);

    const bookingId = parseInt(params.id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { paymentType, isPaid } = body;

    if (!paymentType || typeof isPaid !== 'boolean') {
      return NextResponse.json(
        { error: 'paymentType and isPaid are required', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    if (paymentType !== 'deposit' && paymentType !== 'balance') {
      return NextResponse.json(
        { error: 'paymentType must be "deposit" or "balance"', code: 'INVALID_PAYMENT_TYPE' },
        { status: 400 }
      );
    }

    const result = await updatePaymentStatus(bookingId, paymentType, isPaid);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, code: 'PAYMENT_UPDATE_FAILED' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      bookingId,
      paymentType,
      isPaid,
      message: `${paymentType === 'deposit' ? 'Deposit' : 'Balance'} marked as ${isPaid ? 'paid' : 'unpaid'}`,
    });

  } catch (error: any) {
    console.error('Update payment status error:', error);
    
    // Handle auth errors
    if (error.message?.includes('Unauthorized') || error.message?.includes('required')) {
      return NextResponse.json(
        { error: error.message, code: 'UNAUTHORIZED' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to update payment status',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
