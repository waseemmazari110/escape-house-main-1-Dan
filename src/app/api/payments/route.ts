/**
 * MILESTONE 10: PAYMENTS API
 * 
 * API endpoints for payment management
 * GET: Retrieve payment information
 * POST: Create payments, process refunds, cancel payments
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  createDepositPayment,
  createBalancePayment,
  createFullPayment,
  getPaymentByTransactionId,
  getBookingPayments,
  createRefund,
  cancelPayment,
  syncPaymentStatus,
  type OrchardsPaymentConfig,
} from '@/lib/orchards-payments';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';

// ============================================
// GET - Retrieve Payment Information
// ============================================

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'get';

    switch (action) {
      case 'get': {
        const transactionId = searchParams.get('transactionId');
        if (!transactionId) {
          return NextResponse.json({
            success: false,
            error: 'Transaction ID required',
          }, { status: 400 });
        }

        const payment = await getPaymentByTransactionId(transactionId);
        if (!payment) {
          return NextResponse.json({
            success: false,
            error: 'Payment not found',
          }, { status: 404 });
        }

        // Check authorization - admins only for now
        if (session.user.role !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized to view this payment',
          }, { status: 403 });
        }

        return NextResponse.json({
          success: true,
          payment,
        });
      }

      case 'by-booking': {
        const bookingId = searchParams.get('bookingId');
        if (!bookingId) {
          return NextResponse.json({
            success: false,
            error: 'Booking ID required',
          }, { status: 400 });
        }

        // Check authorization - admins only for now
        if (session.user.role !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized to view this booking',
          }, { status: 403 });
        }

        const payments = await getBookingPayments(parseInt(bookingId));

        return NextResponse.json({
          success: true,
          bookingId: parseInt(bookingId),
          payments,
          total: payments.length,
        });
      }

      case 'sync': {
        const transactionId = searchParams.get('transactionId');
        if (!transactionId) {
          return NextResponse.json({
            success: false,
            error: 'Transaction ID required',
          }, { status: 400 });
        }

        // Check authorization
        if (session.user.role !== 'admin' && session.user.role !== 'owner') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized',
          }, { status: 403 });
        }

        const payment = await syncPaymentStatus(transactionId);

        return NextResponse.json({
          success: true,
          payment,
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Payments GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}

// ============================================
// POST - Create Payments, Refunds, Cancellations
// ============================================

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action;

    switch (action) {
      case 'create-deposit': {
        const { bookingId, config } = body;

        if (!bookingId) {
          return NextResponse.json({
            success: false,
            error: 'Booking ID required',
          }, { status: 400 });
        }

        if (!config || !config.apiKey || !config.apiSecret || !config.merchantId) {
          return NextResponse.json({
            success: false,
            error: 'Orchards payment configuration required (apiKey, apiSecret, merchantId)',
          }, { status: 400 });
        }

        // Get booking
        const [booking] = await db
          .select()
          .from(bookings)
          .where(eq(bookings.id, bookingId))
          .limit(1);

        if (!booking) {
          return NextResponse.json({
            success: false,
            error: 'Booking not found',
          }, { status: 404 });
        }

        // Check authorization - admins only for now
        if (session.user.role !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized to create payment for this booking',
          }, { status: 403 });
        }

        const result = await createDepositPayment(
          bookingId,
          booking.depositAmount || 0,
          booking.guestEmail,
          booking.guestName
        );

        return NextResponse.json({
          success: true,
          transactionId: result.transactionId,
          paymentUrl: result.paymentUrl,
        });
      }

      case 'create-balance': {
        const { bookingId, config } = body;

        if (!bookingId) {
          return NextResponse.json({
            success: false,
            error: 'Booking ID required',
          }, { status: 400 });
        }

        if (!config || !config.apiKey || !config.apiSecret || !config.merchantId) {
          return NextResponse.json({
            success: false,
            error: 'Orchards payment configuration required',
          }, { status: 400 });
        }

        // Get booking
        const [booking] = await db
          .select()
          .from(bookings)
          .where(eq(bookings.id, bookingId))
          .limit(1);

        if (!booking) {
          return NextResponse.json({
            success: false,
            error: 'Booking not found',
          }, { status: 404 });
        }

        // Check authorization - admins only for now
        if (session.user.role !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized',
          }, { status: 403 });
        }

        const result = await createBalancePayment(
          bookingId,
          booking.balanceAmount || 0,
          booking.guestEmail,
          booking.guestName
        );

        return NextResponse.json({
          success: true,
          transactionId: result.transactionId,
          paymentUrl: result.paymentUrl,
        });
      }

      case 'create-full': {
        const { bookingId, config } = body;

        if (!bookingId) {
          return NextResponse.json({
            success: false,
            error: 'Booking ID required',
          }, { status: 400 });
        }

        if (!config || !config.apiKey || !config.apiSecret || !config.merchantId) {
          return NextResponse.json({
            success: false,
            error: 'Orchards payment configuration required',
          }, { status: 400 });
        }

        // Get booking
        const [booking] = await db
          .select()
          .from(bookings)
          .where(eq(bookings.id, bookingId))
          .limit(1);

        if (!booking) {
          return NextResponse.json({
            success: false,
            error: 'Booking not found',
          }, { status: 404 });
        }

        // Check authorization - admins only for now
        if (session.user.role !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized',
          }, { status: 403 });
        }

        const result = await createFullPayment(
          bookingId,
          booking.totalPrice || 0,
          booking.guestEmail,
          booking.guestName
        );

        return NextResponse.json({
          success: true,
          transactionId: result.transactionId,
          paymentUrl: result.paymentUrl,
        });
      }

      case 'refund': {
        const { transactionId, amount, reason, config } = body;

        if (!transactionId) {
          return NextResponse.json({
            success: false,
            error: 'Transaction ID required',
          }, { status: 400 });
        }

        if (!config || !config.apiKey || !config.apiSecret || !config.merchantId) {
          return NextResponse.json({
            success: false,
            error: 'Orchards payment configuration required',
          }, { status: 400 });
        }

        // Only admin and owners can process refunds
        if (session.user.role !== 'admin' && session.user.role !== 'owner') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized',
          }, { status: 403 });
        }

        const payment = await getPaymentByTransactionId(transactionId);
        if (!payment) {
          return NextResponse.json({
            success: false,
            error: 'Payment not found',
          }, { status: 404 });
        }

        // Only admins can process refunds for now
        if (session.user.role !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized',
          }, { status: 403 });
        }

        const refund = await createRefund(
          transactionId,
          amount,
          reason || 'Refund requested'
        );

        return NextResponse.json({
          success: true,
          refund,
        });
      }

      case 'cancel': {
        const { transactionId } = body;

        if (!transactionId) {
          return NextResponse.json({
            success: false,
            error: 'Transaction ID required',
          }, { status: 400 });
        }

        // Only admin and owners can cancel payments
        if (session.user.role !== 'admin' && session.user.role !== 'owner') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized',
          }, { status: 403 });
        }

        const payment = await getPaymentByTransactionId(transactionId);
        if (!payment) {
          return NextResponse.json({
            success: false,
            error: 'Payment not found',
          }, { status: 404 });
        }

        // Only admins can cancel payments for now
        if (session.user.role !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized',
          }, { status: 403 });
        }

        const cancelled = await cancelPayment(transactionId);

        return NextResponse.json({
          success: true,
          payment: cancelled,
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Payments POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
