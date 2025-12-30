/**
 * Stripe Booking Payment Webhook Handler
 * Handle payment success, failure, and refund events
 * STEP 2.2 - Stripe Integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { 
  stripe, 
  confirmBookingPayment, 
  handlePaymentFailure 
} from '@/lib/stripe-booking-payments';
import { sendPaymentConfirmationEmail } from '@/lib/booking-notifications';
import { syncSubscriptionStatusToCRM } from '@/lib/crm-sync';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Log webhook event
 */
function logWebhookEvent(message: string, details?: any) {
  const timestamp = new Date().toLocaleString('en-GB', { 
    timeZone: 'Europe/London',
    hour12: false 
  });
  console.log(`[${timestamp}] Booking Payment Webhook: ${message}`, details || '');
}

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event | null {
  try {
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return null;
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

/**
 * Handle webhook events
 */
async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  logWebhookEvent('Processing event', { type: event.type, id: event.id });

  switch (event.type) {
    // ============================================
    // PAYMENT INTENT SUCCEEDED
    // ============================================
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    // ============================================
    // PAYMENT INTENT FAILED
    // ============================================
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    // ============================================
    // CHARGE SUCCEEDED (Backup confirmation)
    // ============================================
    case 'charge.succeeded':
      await handleChargeSucceeded(event.data.object as Stripe.Charge);
      break;

    // ============================================
    // CHARGE FAILED
    // ============================================
    case 'charge.failed':
      await handleChargeFailed(event.data.object as Stripe.Charge);
      break;

    // ============================================
    // CHARGE REFUNDED
    // ============================================
    case 'charge.refunded':
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;

    default:
      logWebhookEvent('Unhandled event type', { type: event.type });
  }
}

/**
 * Handle payment_intent.succeeded event
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    logWebhookEvent('Payment intent succeeded', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });

    // Check if this is a booking payment
    if (!paymentIntent.metadata.bookingId) {
      logWebhookEvent('Not a booking payment, skipping', {
        paymentIntentId: paymentIntent.id,
      });
      return;
    }

    // Confirm payment and update booking
    const result = await confirmBookingPayment(paymentIntent.id);

    if (result.success) {
      logWebhookEvent('Booking payment confirmed', {
        bookingId: result.bookingId,
        paymentType: result.paymentType,
      });
      
      // TODO: Add CRM sync after fetching property to get ownerId
      // const booking = await db.select().from(bookings).where(eq(bookings.id, result.bookingId!));
      // Join with properties table to get ownerId if needed
      
      // Send payment confirmation email
      try {
        const booking = await db
          .select()
          .from(bookings)
          .where(eq(bookings.id, result.bookingId!))
          .limit(1);
        
        if (booking.length > 0) {
          const b = booking[0];
          
          await sendPaymentConfirmationEmail({
            bookingId: b.id,
            guestName: b.guestName,
            guestEmail: b.guestEmail,
            propertyId: b.propertyId!,
            propertyName: b.propertyName,
            checkInDate: b.checkInDate,
            checkOutDate: b.checkOutDate,
            numberOfGuests: b.numberOfGuests,
            totalPrice: b.totalPrice!,
            depositAmount: b.depositAmount!,
            depositPaid: b.depositPaid!,
            balanceAmount: b.balanceAmount!,
            paymentType: result.paymentType as 'deposit' | 'balance',
          });
          
          logWebhookEvent('Payment confirmation email sent', {
            bookingId: result.bookingId,
            guestEmail: b.guestEmail,
          });
        }
      } catch (emailError) {
        logWebhookEvent('Failed to send payment confirmation email', {
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
          bookingId: result.bookingId,
        });
        // Don't fail the webhook if email fails
      }
    } else {
      logWebhookEvent('Payment confirmation failed', {
        paymentIntentId: paymentIntent.id,
      });
    }

  } catch (error) {
    logWebhookEvent('Error handling payment_intent.succeeded', {
      error: (error as Error).message,
      paymentIntentId: paymentIntent.id,
    });
    throw error;
  }
}

/**
 * Handle payment_intent.payment_failed event
 */
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    logWebhookEvent('Payment intent failed', {
      paymentIntentId: paymentIntent.id,
      lastPaymentError: paymentIntent.last_payment_error?.message,
    });

    // Check if this is a booking payment
    if (!paymentIntent.metadata.bookingId) {
      return;
    }

    // Handle payment failure
    await handlePaymentFailure(
      paymentIntent.id,
      paymentIntent.last_payment_error?.message
    );

    logWebhookEvent('Payment failure recorded', {
      bookingId: paymentIntent.metadata.bookingId,
    });
    
    // TODO: Add CRM sync after fetching property to get ownerId

  } catch (error) {
    logWebhookEvent('Error handling payment_intent.payment_failed', {
      error: (error as Error).message,
      paymentIntentId: paymentIntent.id,
    });
    throw error;
  }
}

/**
 * Handle charge.succeeded event (backup confirmation)
 */
async function handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
  try {
    logWebhookEvent('Charge succeeded', {
      chargeId: charge.id,
      amount: charge.amount / 100,
      paymentIntentId: charge.payment_intent,
    });

    // If we have a payment intent, the payment_intent.succeeded event will handle it
    // This is a backup handler
    if (charge.payment_intent && typeof charge.payment_intent === 'string') {
      const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent);
      
      if (paymentIntent.metadata.bookingId) {
        await confirmBookingPayment(paymentIntent.id);
        logWebhookEvent('Booking payment confirmed via charge event', {
          bookingId: paymentIntent.metadata.bookingId,
        });
      }
    }

  } catch (error) {
    logWebhookEvent('Error handling charge.succeeded', {
      error: (error as Error).message,
      chargeId: charge.id,
    });
    // Don't throw - this is a backup handler
  }
}

/**
 * Handle charge.failed event
 */
async function handleChargeFailed(charge: Stripe.Charge): Promise<void> {
  try {
    logWebhookEvent('Charge failed', {
      chargeId: charge.id,
      failureMessage: charge.failure_message,
      paymentIntentId: charge.payment_intent,
    });

    if (charge.payment_intent && typeof charge.payment_intent === 'string') {
      const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent);
      
      if (paymentIntent.metadata.bookingId) {
        await handlePaymentFailure(paymentIntent.id, charge.failure_message || undefined);
        logWebhookEvent('Charge failure recorded', {
          bookingId: paymentIntent.metadata.bookingId,
        });
      }
    }

  } catch (error) {
    logWebhookEvent('Error handling charge.failed', {
      error: (error as Error).message,
      chargeId: charge.id,
    });
  }
}

/**
 * Handle charge.refunded event
 */
async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  try {
    logWebhookEvent('Charge refunded', {
      chargeId: charge.id,
      amountRefunded: charge.amount_refunded / 100,
      refunds: charge.refunds?.data.length || 0,
    });

    // The refund is already recorded when created via our API
    // This webhook is for confirmation/logging purposes

  } catch (error) {
    logWebhookEvent('Error handling charge.refunded', {
      error: (error as Error).message,
      chargeId: charge.id,
    });
  }
}

/**
 * POST /api/webhooks/booking-payments
 * Stripe webhook handler for booking payments
 */
export async function POST(request: NextRequest) {
  logWebhookEvent('Webhook received');

  try {
    // Get the raw body
    const body = await request.text();
    
    // Get the Stripe signature from headers
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      logWebhookEvent('Webhook rejected: Missing signature');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature);

    if (!event) {
      logWebhookEvent('Webhook rejected: Invalid signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Handle the webhook event
    await handleWebhookEvent(event);

    logWebhookEvent('Webhook processed successfully', { 
      type: event.type,
      id: event.id 
    });

    return NextResponse.json({ 
      received: true,
      eventType: event.type,
      eventId: event.id,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logWebhookEvent('Webhook error', { error: errorMessage });

    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/booking-payments
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: 'Booking payment webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
