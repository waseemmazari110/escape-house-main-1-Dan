/**
 * STRIPE WEBHOOK - QUICK REFERENCE
 * Complete implementation for subscription & booking payments
 * 
 * Location: /api/webhooks/billing
 * Handler: src/lib/stripe-billing.ts
 */

// ============================================
// WEBHOOK EVENTS HANDLED
// ============================================

const HANDLED_EVENTS = {
  // CHECKOUT FLOW
  'checkout.session.completed': {
    handler: 'handleCheckoutSessionCompleted',
    creates: 'subscription + payment record',
    notes: 'Initial subscription purchase with metadata'
  },

  // SUBSCRIPTION PAYMENTS (PRIMARY)
  'invoice.payment_succeeded': {
    handler: 'handleInvoicePaymentSucceeded', 
    creates: 'payment record',
    notes: '⭐ PRIMARY handler for recurring subscription payments'
  },
  'invoice.payment_failed': {
    handler: 'handleInvoicePaymentFailed',
    creates: 'failed payment record',
    notes: 'Track payment failures for retry logic'
  },

  // PAYMENT INTENTS
  'payment_intent.succeeded': {
    handler: 'handlePaymentSucceeded',
    creates: 'payment record',
    notes: 'Fallback for standalone payments'
  },
  'payment_intent.payment_failed': {
    handler: 'handlePaymentFailed',
    creates: 'failed payment record',
    notes: 'Track payment failures'
  },
  'payment_intent.created': {
    handler: 'handlePaymentIntentCreated',
    creates: 'initial payment record',
    notes: 'Early tracking of payment attempts'
  },

  // CHARGES (ENRICHMENT)
  'charge.succeeded': {
    handler: 'handleChargeSucceeded',
    creates: 'updates payment record',
    notes: 'Adds charge ID, receipt URL, card details, risk score'
  },
  'charge.failed': {
    handler: 'handleChargeFailed',
    creates: 'logs only',
    notes: 'Monitor failed charges'
  },
  'charge.refunded': {
    handler: 'handleChargeRefunded',
    creates: 'updates payment record',
    notes: 'Tracks refunds (full or partial)'
  }
};

// ============================================
// PAYMENT RECORD FIELDS MAPPED
// ============================================

const PAYMENT_RECORD_FIELDS = {
  // Stripe IDs
  stripeCustomerId: 'paymentIntent.customer',
  stripePaymentIntentId: 'paymentIntent.id',
  stripeChargeId: 'charge.id',
  stripeInvoiceId: 'paymentIntent.invoice',
  stripeSubscriptionId: 'metadata.subscriptionId',
  stripeSessionId: 'metadata.checkoutSessionId',

  // Context
  userId: 'metadata.userId (REQUIRED)',
  userRole: 'metadata.role || "owner"',
  subscriptionPlan: 'metadata.subscriptionPlan',

  // Payment details
  amount: 'paymentIntent.amount / 100',
  currency: 'paymentIntent.currency.toUpperCase()',
  paymentStatus: 'paymentIntent.status',
  paymentMethod: 'charge.payment_method_details.type',
  paymentMethodBrand: 'charge.payment_method_details.card.brand',
  paymentMethodLast4: 'charge.payment_method_details.card.last4',

  // Transaction
  description: 'paymentIntent.description',
  billingReason: 'metadata.billingReason',
  receiptUrl: 'charge.receipt_url',
  receiptEmail: 'paymentIntent.receipt_email',

  // Relations
  invoiceId: 'DB lookup via stripeInvoiceId',
  subscriptionId: 'DB lookup via stripeSubscriptionId',
  bookingId: 'DB lookup via metadata.bookingId (for guest bookings)',

  // Error tracking
  failureCode: 'paymentIntent.last_payment_error.code',
  failureMessage: 'paymentIntent.last_payment_error.message',
  networkStatus: 'charge.outcome.network_status',
  riskLevel: 'charge.outcome.risk_level',
  riskScore: 'charge.outcome.risk_score',

  // Metadata
  metadata: 'JSON.stringify(paymentIntent.metadata)',
  stripeEventId: 'event.id (for idempotency)',
  processedAt: 'nowUKFormatted()',
  createdAt: 'nowUKFormatted()',
  updatedAt: 'nowUKFormatted()'
};

// ============================================
// METADATA REQUIREMENTS
// ============================================

const REQUIRED_METADATA = {
  checkout_session: {
    userId: 'User ID (REQUIRED)',
    role: '"owner" (identifies payment source)',
    subscriptionPlan: 'Plan ID (e.g., "starter-monthly")',
    planId: 'Legacy plan ID',
    tier: 'Plan tier (starter, pro, premium)',
    timestamp: 'UK formatted timestamp'
  },

  subscription: {
    userId: 'User ID (REQUIRED)',
    role: '"owner"',
    subscriptionPlan: 'Plan ID',
    planId: 'Legacy plan ID',
    tier: 'Plan tier'
  },

  payment_intent: {
    userId: 'User ID (REQUIRED)',
    role: '"owner" for subscriptions',
    subscriptionPlan: 'Plan ID',
    billingReason: 'subscription_checkout | subscription_cycle',
    checkoutSessionId: 'Session ID (if from checkout)',
    subscriptionId: 'Stripe subscription ID',
    // For bookings:
    bookingId: 'Booking ID (for guest payments)',
    paymentType: 'deposit | balance'
  }
};

// ============================================
// TYPICAL PAYMENT FLOW
// ============================================

const SUBSCRIPTION_FLOW = `
1. Owner clicks "Subscribe" → /api/subscriptions/checkout-session
   → Creates Stripe checkout with metadata (userId, role, plan)

2. Owner completes payment → Stripe webhook fires

3. checkout.session.completed
   → Creates subscription record
   → Retrieves payment_intent
   → Enriches metadata
   → Creates payment record ✅

4. invoice.payment_succeeded (recurring payments)
   → Updates invoice record
   → Retrieves payment_intent  
   → Enriches metadata with invoice/subscription context
   → Creates/updates payment record ✅

5. charge.succeeded
   → Updates payment record with:
     - chargeId
     - receipt_url
     - card brand/last4
     - risk score ✅

Result: Complete payment record visible in:
- Admin dashboard (/admin/payments) - ALL payments
- Owner dashboard (/owner/dashboard?view=payments) - OWN payments
`;

const BOOKING_FLOW = `
1. Guest books property → /api/bookings/payment-intent
   → Creates payment_intent with metadata (bookingId, paymentType)

2. Guest completes payment → Stripe webhook fires

3. charge.succeeded
   → Detects metadata.bookingId
   → Logs as booking payment
   → Updates bookings table (handled by stripe-booking-payments.ts) ✅

4. payment_intent.succeeded (if userId in metadata)
   → Creates payment record
   → Links to booking via bookingId ✅

Note: Booking payments primarily update bookings table but can also
create payment records for unified admin tracking.
`;

// ============================================
// LOGGING PATTERNS
// ============================================

const LOG_EXAMPLES = `
// Success logs
[28/12/2025 12:34:56] Webhook received: invoice.payment_succeeded
[28/12/2025 12:34:56] Processing invoice.payment_succeeded {
  invoiceId: 'in_xxxxx',
  amount: 19.99,
  subscriptionId: 'sub_xxxxx'
}
[28/12/2025 12:34:57] Payment record created from invoice.payment_succeeded {
  invoiceId: 'in_xxxxx',
  paymentIntentId: 'pi_xxxxx',
  userId: 'user_xxxxx',
  amount: 19.99,
  billingReason: 'subscription_cycle'
}

// Error logs
[28/12/2025 12:34:58] No userId found for invoice - skipping payment record {
  invoiceId: 'in_xxxxx'
}

// Booking payment logs
[28/12/2025 12:35:00] Charge is for booking payment {
  chargeId: 'ch_xxxxx',
  bookingId: '123',
  paymentType: 'deposit'
}
`;

// ============================================
// TESTING COMMANDS
// ============================================

const TEST_COMMANDS = `
# 1. Run migrations
npx drizzle-kit push

# 2. Start dev server
npm run dev

# 3. Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/billing

# 4. Trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger charge.succeeded

# 5. Query payment records
sqlite3 sqlite.db "SELECT * FROM payments ORDER BY createdAt DESC LIMIT 5;"

# 6. Check specific user payments
sqlite3 sqlite.db "SELECT * FROM payments WHERE userId='user_xxxxx';"

# 7. Verify webhook signature
curl -X POST http://localhost:3000/api/webhooks/billing \\
  -H "stripe-signature: whsec_test_xxxxx" \\
  -d @test-event.json
`;

// ============================================
// COMMON ISSUES & SOLUTIONS
// ============================================

const TROUBLESHOOTING = {
  'Payment record not created': {
    check: [
      'userId in metadata?',
      'Webhook signature valid?',
      'stripeEventId duplicate?',
      'Console logs show handler execution?'
    ],
    solution: 'Ensure metadata.userId exists on payment_intent'
  },

  'Admin sees no payments': {
    check: [
      'Payments table populated?',
      'Admin role check passing?',
      'API endpoint returning data?'
    ],
    solution: 'Check /api/admin/payments/history response'
  },

  'Owner sees wrong payments': {
    check: [
      'userId filter applied?',
      'Multiple users with same email?',
      'Session authentication working?'
    ],
    solution: 'Verify WHERE userId = currentUser.id in query'
  },

  'Metadata missing on invoice': {
    check: [
      'Subscription has metadata?',
      'Checkout session passed metadata to subscription?',
      'Payment intent created with metadata?'
    ],
    solution: 'Enrich metadata in handleInvoicePaymentSucceeded'
  }
};

// ============================================
// PRODUCTION CHECKLIST
// ============================================

const PRODUCTION_CHECKLIST = [
  '✅ STRIPE_SECRET_KEY set to live key (sk_live_)',
  '✅ STRIPE_WEBHOOK_SECRET set to live webhook secret',
  '✅ Webhook endpoint registered in Stripe Dashboard',
  '✅ All required events selected in webhook settings',
  '✅ HTTPS enabled on production domain',
  '✅ Database migrations applied (payments table columns)',
  '✅ Test payment completed successfully',
  '✅ Payment visible in admin dashboard',
  '✅ Payment visible in owner dashboard',
  '✅ Webhook delivery monitored (check Stripe Dashboard)',
  '✅ Error logs reviewed (no unauthorized/signature errors)',
  '✅ Email receipts configured and sending',
  '✅ Refund flow tested',
  '✅ Failed payment handling verified'
];

export {
  HANDLED_EVENTS,
  PAYMENT_RECORD_FIELDS,
  REQUIRED_METADATA,
  SUBSCRIPTION_FLOW,
  BOOKING_FLOW,
  LOG_EXAMPLES,
  TEST_COMMANDS,
  TROUBLESHOOTING,
  PRODUCTION_CHECKLIST
};
