/**
 * MILESTONE 10: ORCHARDS WEBHOOK ENDPOINT
 * 
 * Handles payment status updates from Orchards
 * Verifies webhook signatures and updates payment records
 */

import { NextRequest, NextResponse } from 'next/server';
import { handlePaymentWebhook } from '@/lib/orchards-payments';

export async function POST(request: NextRequest) {
  try {
    // Get webhook signature from headers
    const signature = request.headers.get('X-Orchards-Signature') || '';
    
    // Get raw body
    const body = await request.text();
    
    // Parse JSON
    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch (error) {
      console.error('Orchards webhook: Invalid JSON:', error);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON payload',
      }, { status: 400 });
    }

    // Validate required fields
    if (!webhookData.transactionId) {
      return NextResponse.json({
        success: false,
        error: 'Missing transactionId in webhook payload',
      }, { status: 400 });
    }

    if (!webhookData.status) {
      return NextResponse.json({
        success: false,
        error: 'Missing status in webhook payload',
      }, { status: 400 });
    }

    // Handle webhook
    try {
      const result = await handlePaymentWebhook(webhookData, signature, body);

      return NextResponse.json({
        success: true,
        message: 'Webhook processed successfully',
        payment: result,
      });
    } catch (error: any) {
      console.error('Orchards webhook processing error:', error);
      
      // Return 200 even on error to prevent retries for invalid webhooks
      // But log the error for investigation
      if (error.message.includes('Invalid signature')) {
        return NextResponse.json({
          success: false,
          error: 'Invalid webhook signature',
        }, { status: 401 });
      }

      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Orchards webhook error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}

// Only POST is allowed for webhooks
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. This endpoint only accepts POST requests from Orchards.',
  }, { status: 405 });
}
