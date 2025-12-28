/**
 * API Route: Create Stripe Checkout Session
 * Handles subscription checkout with success/cancel URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, getOrCreateCustomer } from '@/lib/stripe-billing';
import { getPlanById } from '@/lib/subscription-plans';
import { nowUKFormatted } from '@/lib/date-utils';

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/subscriptions/checkout-session`);

  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, successUrl, cancelUrl } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Get plan details
    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    // Free plan doesn't need checkout
    if (plan.price === 0) {
      return NextResponse.json(
        { error: 'Free plan does not require checkout' },
        { status: 400 }
      );
    }

    // Validate Stripe Price ID
    if (!plan.stripePriceId || plan.stripePriceId.includes('REPLACE_ME') || plan.stripePriceId.includes('XXXXXX')) {
      console.error(`[${nowUKFormatted()}] Invalid Stripe Price ID for plan ${planId}:`, plan.stripePriceId);
      return NextResponse.json(
        { 
          error: 'Stripe price not configured',
          message: `Please configure STRIPE_PRICE_${plan.tier.toUpperCase()}_${plan.interval.toUpperCase()} in your .env file`,
          details: 'Visit https://dashboard.stripe.com/test/products to create products and get price IDs'
        },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateCustomer(
      session.user.id,
      session.user.email || '',
      session.user.name || 'User'
    );

    // Determine the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   request.headers.get('origin') || 
                   'http://localhost:3000';

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${baseUrl}/owner/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/owner/subscription?canceled=true`,
      metadata: {
        userId: session.user.id,
        role: 'owner',
        subscriptionPlan: plan.id,
        userName: session.user.name || '',
        userEmail: session.user.email || '',
        planId: plan.id,
        tier: plan.tier,
        timestamp: nowUKFormatted(),
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          role: 'owner',
          subscriptionPlan: plan.id,
          userName: session.user.name || '',
          userEmail: session.user.email || '',
          planId: plan.id,
          tier: plan.tier,
        },
      },
      payment_intent_data: {
        metadata: {
          userId: session.user.id,
          role: 'owner',
          subscriptionPlan: plan.id,
          planId: plan.id,
          tier: plan.tier,
          billingReason: 'subscription_checkout',
        },
      },
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
      },
    });

    console.log(`[${nowUKFormatted()}] Checkout session created: ${checkoutSession.id}`);

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error creating checkout session:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
