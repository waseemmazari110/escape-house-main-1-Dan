/**
 * Stripe Webhook Endpoint - /api/webhooks/billing
 * Milestone 3 - Billing System
 * 
 * Handles all Stripe webhook events with signature verification
 * All timestamps logged in DD/MM/YYYY HH:mm:ss UK time
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature, handleWebhook } from '@/lib/stripe-billing';
import { nowUKFormatted } from '@/lib/date-utils';

/**
 * POST /api/webhooks/billing
 * Stripe webhook handler
 */
export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] Webhook received at /api/webhooks/billing`);

  try {
    // Get the raw body
    const body = await request.text();
    
    // Get the Stripe signature from headers
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.log(`[${nowUKFormatted()}] Webhook rejected: Missing stripe-signature header`);
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature);

    if (!event) {
      console.log(`[${nowUKFormatted()}] Webhook rejected: Invalid signature`);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Handle the webhook event
    await handleWebhook(event);

    console.log(`[${nowUKFormatted()}] Webhook processed successfully: ${event.type}`);

    return NextResponse.json({ 
      received: true,
      eventType: event.type,
      timestamp: nowUKFormatted() 
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${nowUKFormatted()}] Webhook error:`, errorMessage);

    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        message: errorMessage,
        timestamp: nowUKFormatted() 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/billing
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: 'Stripe webhook endpoint is active',
    timestamp: nowUKFormatted(),
  });
}
