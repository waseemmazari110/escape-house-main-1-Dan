/**
 * Stripe Connection Test Endpoint
 * Tests if Stripe API key is valid
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stripeKey = process.env.STRIPE_TEST_KEY || process.env.STRIPE_SECRET_KEY;
    
    // Check if key exists
    if (!stripeKey) {
      return NextResponse.json({
        success: false,
        error: 'No Stripe API key found',
        hasTestKey: !!process.env.STRIPE_TEST_KEY,
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      });
    }
    
    // Check key format - show more details
    const keyInfo = {
      length: stripeKey.length,
      prefix: stripeKey.substring(0, 20) + '...',
      suffix: '...' + stripeKey.substring(stripeKey.length - 10),
      isTestKey: stripeKey.startsWith('sk_test_'),
      isLiveKey: stripeKey.startsWith('sk_live_'),
      hasLineBreaks: stripeKey.includes('\n') || stripeKey.includes('\r'),
      hasSpaces: stripeKey.includes(' '),
      charCodes: stripeKey.substring(0, 30).split('').map(c => c.charCodeAt(0)),
    };
    
    // Try to initialize Stripe and make a simple API call
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-10-29.clover',
    });
    
    // Simple API call to test connection
    const balance = await stripe.balance.retrieve();
    
    return NextResponse.json({
      success: true,
      message: 'Stripe connection successful',
      keyInfo,
      balanceCheck: 'passed',
      livemode: balance.livemode,
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.type || 'unknown',
      code: error.code || 'unknown',
      statusCode: error.statusCode || 'unknown',
    });
  }
}
