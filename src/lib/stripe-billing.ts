/**
 * Stripe Billing Service - Milestone 3
 * All timestamps logged in DD/MM/YYYY HH:mm:ss UK time
 * Global Rules:
 * - Stripe = primary billing provider (test mode)
 * - Never hardcode secrets - use environment variables
 * - Validate all webhook signatures
 */

import Stripe from 'stripe';
import { db } from '@/db';
import { subscriptions, invoices, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted, todayUKFormatted, formatDateUK } from '@/lib/date-utils';

// Initialize Stripe with test key
const stripeSecretKey = process.env.STRIPE_TEST_KEY || process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key. Set STRIPE_TEST_KEY in environment variables.');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Webhook secret for signature verification
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Log billing action with UK timestamp
 */
function logBillingAction(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] Stripe Billing: ${action}`, details || '');
}

// ============================================
// CUSTOMER MANAGEMENT
// ============================================

export interface CreateCustomerParams {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, string>;
}

/**
 * Create a Stripe customer
 * @param params Customer details
 * @returns Stripe customer object
 */
export async function createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
  try {
    logBillingAction('Creating customer', { userId: params.userId, email: params.email });
    
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: {
        userId: params.userId,
        createdAt: nowUKFormatted(),
        ...params.metadata,
      },
    });

    logBillingAction('Customer created successfully', { 
      customerId: customer.id,
      email: customer.email 
    });

    return customer;

  } catch (error) {
    logBillingAction('Customer creation failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Get or create Stripe customer for user
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name: string
): Promise<string> {
  try {
    // Check if user already has a Stripe customer ID
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existingSubscription[0]?.stripeCustomerId) {
      logBillingAction('Using existing customer', { 
        customerId: existingSubscription[0].stripeCustomerId 
      });
      return existingSubscription[0].stripeCustomerId;
    }

    // Create new customer
    const customer = await createCustomer({ userId, email, name });
    return customer.id;

  } catch (error) {
    logBillingAction('Get/create customer failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Update customer details
 */
export async function updateCustomer(
  customerId: string,
  params: Partial<CreateCustomerParams>
): Promise<Stripe.Customer> {
  try {
    logBillingAction('Updating customer', { customerId });

    const customer = await stripe.customers.update(customerId, {
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: params.metadata,
    });

    logBillingAction('Customer updated successfully', { customerId });
    return customer;

  } catch (error) {
    logBillingAction('Customer update failed', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

export interface CreateSubscriptionParams {
  userId: string;
  customerId: string;
  priceId: string;
  planName: string;
  planType: 'monthly' | 'yearly';
  trialDays?: number;
  metadata?: Record<string, string>;
}

/**
 * Create a new subscription
 * @param params Subscription parameters
 * @returns Subscription details
 */
export async function createSubscription(params: CreateSubscriptionParams) {
  try {
    logBillingAction('Creating subscription', {
      userId: params.userId,
      planName: params.planName,
    });

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: params.customerId,
      items: [{ price: params.priceId }],
      trial_period_days: params.trialDays,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: params.userId,
        planName: params.planName,
        createdAt: nowUKFormatted(),
        ...params.metadata,
      },
    });

    const currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    const currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    const trialStart = stripeSubscription.trial_start 
      ? new Date(stripeSubscription.trial_start * 1000) 
      : null;
    const trialEnd = stripeSubscription.trial_end 
      ? new Date(stripeSubscription.trial_end * 1000) 
      : null;

    // Save to database with UK timestamps
    const [dbSubscription] = await db.insert(subscriptions).values({
      userId: params.userId,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: params.priceId,
      stripeCustomerId: params.customerId,
      planName: params.planName,
      planType: params.planType,
      status: stripeSubscription.status,
      currentPeriodStart: formatDateUK(currentPeriodStart),
      currentPeriodEnd: formatDateUK(currentPeriodEnd),
      trialStart: trialStart ? formatDateUK(trialStart) : null,
      trialEnd: trialEnd ? formatDateUK(trialEnd) : null,
      amount: (stripeSubscription.items.data[0].price.unit_amount || 0) / 100,
      currency: stripeSubscription.currency.toUpperCase(),
      interval: stripeSubscription.items.data[0].price.recurring?.interval || 'month',
      intervalCount: stripeSubscription.items.data[0].price.recurring?.interval_count || 1,
      cancelAtPeriodEnd: false,
      metadata: JSON.stringify(params.metadata || {}),
      createdAt: nowUKFormatted(),
      updatedAt: nowUKFormatted(),
    }).returning();

    logBillingAction('Subscription created successfully', {
      subscriptionId: stripeSubscription.id,
      status: stripeSubscription.status,
    });

    return {
      subscription: dbSubscription,
      stripeSubscription,
      clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent?.client_secret,
    };

  } catch (error) {
    logBillingAction('Subscription creation failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Update subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  updates: {
    priceId?: string;
    cancelAtPeriodEnd?: boolean;
  }
) {
  try {
    logBillingAction('Updating subscription', { subscriptionId });

    const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: updates.cancelAtPeriodEnd,
      items: updates.priceId ? [{ price: updates.priceId }] : undefined,
    });

    // Update database
    const [dbSubscription] = await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        status: stripeSubscription.status,
        updatedAt: nowUKFormatted(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
      .returning();

    logBillingAction('Subscription updated successfully', { subscriptionId });
    return { subscription: dbSubscription, stripeSubscription };

  } catch (error) {
    logBillingAction('Subscription update failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Cancel subscription
 * @param subscriptionId Stripe subscription ID
 * @param cancelAtPeriodEnd If true, cancel at period end; if false, cancel immediately
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
) {
  try {
    logBillingAction('Cancelling subscription', { 
      subscriptionId, 
      cancelAtPeriodEnd 
    });

    let stripeSubscription: Stripe.Subscription;

    if (cancelAtPeriodEnd) {
      // Cancel at period end
      stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      // Cancel immediately
      stripeSubscription = await stripe.subscriptions.cancel(subscriptionId);
    }

    // Update database with UK timestamp
    const now = nowUKFormatted();
    const [dbSubscription] = await db
      .update(subscriptions)
      .set({
        status: stripeSubscription.status,
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        cancelledAt: cancelAtPeriodEnd ? null : now,
        updatedAt: now,
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
      .returning();

    logBillingAction('Subscription cancelled successfully', {
      subscriptionId,
      cancelledAt: cancelAtPeriodEnd ? 'At period end' : now,
    });

    return { subscription: dbSubscription, stripeSubscription };

  } catch (error) {
    logBillingAction('Subscription cancellation failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Reactivate a cancelled subscription
 */
export async function reactivateSubscription(subscriptionId: string) {
  try {
    logBillingAction('Reactivating subscription', { subscriptionId });

    const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    const [dbSubscription] = await db
      .update(subscriptions)
      .set({
        status: stripeSubscription.status,
        cancelAtPeriodEnd: false,
        cancelledAt: null,
        updatedAt: nowUKFormatted(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
      .returning();

    logBillingAction('Subscription reactivated successfully', { subscriptionId });
    return { subscription: dbSubscription, stripeSubscription };

  } catch (error) {
    logBillingAction('Subscription reactivation failed', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// INVOICE MANAGEMENT
// ============================================

/**
 * Generate invoice number in format: INV-YYYY-NNNN
 */
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  
  // Get the count of invoices this year
  const existingInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.invoiceNumber, `INV-${year}-%`));
  
  const nextNumber = (existingInvoices.length + 1).toString().padStart(4, '0');
  return `INV-${year}-${nextNumber}`;
}

/**
 * Create invoice from Stripe invoice
 */
export async function createInvoiceFromStripe(
  stripeInvoice: Stripe.Invoice,
  userId: string
) {
  try {
    logBillingAction('Creating invoice from Stripe', { 
      stripeInvoiceId: stripeInvoice.id 
    });

    // Find subscription if exists
    const subscription = stripeInvoice.subscription
      ? await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, stripeInvoice.subscription as string))
          .limit(1)
      : [];

    const invoiceNumber = await generateInvoiceNumber();
    const now = nowUKFormatted();
    const invoiceDate = formatDateUK(new Date(stripeInvoice.created * 1000));
    const dueDate = stripeInvoice.due_date 
      ? formatDateUK(new Date(stripeInvoice.due_date * 1000))
      : null;
    const paidAt = stripeInvoice.status === 'paid' && stripeInvoice.status_transitions.paid_at
      ? nowUKFormatted()
      : null;

    const [invoice] = await db.insert(invoices).values({
      userId,
      subscriptionId: subscription[0]?.id || null,
      stripeInvoiceId: stripeInvoice.id,
      stripePaymentIntentId: stripeInvoice.payment_intent as string || null,
      invoiceNumber,
      status: stripeInvoice.status || 'draft',
      description: stripeInvoice.description || null,
      amountDue: (stripeInvoice.amount_due || 0) / 100,
      amountPaid: (stripeInvoice.amount_paid || 0) / 100,
      amountRemaining: (stripeInvoice.amount_remaining || 0) / 100,
      currency: stripeInvoice.currency.toUpperCase(),
      taxAmount: (stripeInvoice.tax || 0) / 100,
      subtotal: (stripeInvoice.subtotal || 0) / 100,
      total: (stripeInvoice.total || 0) / 100,
      invoiceDate,
      dueDate,
      paidAt,
      periodStart: stripeInvoice.period_start 
        ? formatDateUK(new Date(stripeInvoice.period_start * 1000))
        : null,
      periodEnd: stripeInvoice.period_end 
        ? formatDateUK(new Date(stripeInvoice.period_end * 1000))
        : null,
      billingReason: stripeInvoice.billing_reason || null,
      customerEmail: stripeInvoice.customer_email || '',
      customerName: stripeInvoice.customer_name || '',
      invoicePdf: stripeInvoice.invoice_pdf || null,
      hostedInvoiceUrl: stripeInvoice.hosted_invoice_url || null,
      metadata: JSON.stringify(stripeInvoice.metadata || {}),
      createdAt: now,
      updatedAt: now,
    }).returning();

    logBillingAction('Invoice created successfully', {
      invoiceNumber,
      stripeInvoiceId: stripeInvoice.id,
    });

    return invoice;

  } catch (error) {
    logBillingAction('Invoice creation failed', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// WEBHOOK HANDLING
// ============================================

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  try {
    if (!webhookSecret) {
      logBillingAction('Webhook verification failed', { reason: 'No webhook secret configured' });
      return null;
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    
    logBillingAction('Webhook signature verified', { 
      type: event.type,
      id: event.id 
    });

    return event;

  } catch (error) {
    logBillingAction('Webhook signature verification failed', { 
      error: (error as Error).message 
    });
    return null;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(event: Stripe.Event) {
  const timestamp = nowUKFormatted();
  
  logBillingAction(`Webhook received: ${event.type}`, { 
    eventId: event.id,
    timestamp 
  });

  try {
    switch (event.type) {
      // Customer events
      case 'customer.created':
      case 'customer.updated':
        await handleCustomerEvent(event);
        break;

      // Subscription events
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event);
        break;

      // Invoice events
      case 'invoice.created':
      case 'invoice.updated':
      case 'invoice.finalized':
        await handleInvoiceEvent(event);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event);
        break;

      // Payment events
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event);
        break;

      default:
        logBillingAction(`Unhandled webhook type: ${event.type}`, { eventId: event.id });
    }

    logBillingAction(`Webhook processed successfully: ${event.type}`, { 
      eventId: event.id,
      timestamp 
    });

    return { success: true, processed: true };

  } catch (error) {
    logBillingAction(`Webhook processing failed: ${event.type}`, {
      error: (error as Error).message,
      eventId: event.id,
    });
    throw error;
  }
}

// Webhook event handlers

async function handleCustomerEvent(event: Stripe.Event) {
  const customer = event.data.object as Stripe.Customer;
  logBillingAction('Customer event', { 
    customerId: customer.id,
    email: customer.email 
  });
}

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  if (!userId) {
    logBillingAction('Subscription update skipped', { reason: 'No userId in metadata' });
    return;
  }

  const currentPeriodStart = formatDateUK(new Date(subscription.current_period_start * 1000));
  const currentPeriodEnd = formatDateUK(new Date(subscription.current_period_end * 1000));

  await db
    .update(subscriptions)
    .set({
      status: subscription.status,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: nowUKFormatted(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

  logBillingAction('Subscription updated in database', { 
    subscriptionId: subscription.id,
    status: subscription.status 
  });
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  await db
    .update(subscriptions)
    .set({
      status: 'cancelled',
      cancelledAt: nowUKFormatted(),
      updatedAt: nowUKFormatted(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

  logBillingAction('Subscription deleted', { subscriptionId: subscription.id });
  
  // Downgrade user after cancellation
  if (userId) {
    try {
      const { downgradeAfterCancellation } = await import('@/lib/crm-sync');
      await downgradeAfterCancellation(userId);
      logBillingAction('User downgraded after cancellation', { userId });
    } catch (error) {
      logBillingAction('Failed to downgrade user', { 
        userId, 
        error: (error as Error).message 
      });
    }
  }
}

async function handleTrialWillEnd(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  logBillingAction('Trial ending soon', { 
    subscriptionId: subscription.id,
    trialEnd: subscription.trial_end 
  });
  // TODO: Send notification email
}

async function handleInvoiceEvent(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const userId = invoice.subscription 
    ? (await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription as string))
        .limit(1))[0]?.userId
    : null;

  if (userId) {
    // Check if invoice exists
    const existing = await db
      .select()
      .from(invoices)
      .where(eq(invoices.stripeInvoiceId, invoice.id))
      .limit(1);

    if (existing.length === 0) {
      await createInvoiceFromStripe(invoice, userId);
    } else {
      // Update existing invoice
      await db
        .update(invoices)
        .set({
          status: invoice.status || 'draft',
          amountPaid: (invoice.amount_paid || 0) / 100,
          amountRemaining: (invoice.amount_remaining || 0) / 100,
          updatedAt: nowUKFormatted(),
        })
        .where(eq(invoices.stripeInvoiceId, invoice.id));
    }
  }

  logBillingAction('Invoice event processed', { invoiceId: invoice.id });
}

async function handleInvoicePaid(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  await db
    .update(invoices)
    .set({
      status: 'paid',
      paidAt: nowUKFormatted(),
      amountPaid: (invoice.amount_paid || 0) / 100,
      amountRemaining: 0,
      updatedAt: nowUKFormatted(),
    })
    .where(eq(invoices.stripeInvoiceId, invoice.id));

  logBillingAction('Invoice marked as paid', { invoiceId: invoice.id });
  
  // Sync membership status after successful payment
  const userId = invoice.subscription 
    ? (await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription as string))
        .limit(1))[0]?.userId
    : null;

  if (userId) {
    try {
      const { updateMembershipAfterPayment } = await import('@/lib/crm-sync');
      await updateMembershipAfterPayment(userId, true);
      logBillingAction('Membership status synced after payment', { userId });
    } catch (error) {
      logBillingAction('Failed to sync membership after payment', { 
        userId, 
        error: (error as Error).message 
      });
    }
  }
}

async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  await db
    .update(invoices)
    .set({
      status: 'open',
      updatedAt: nowUKFormatted(),
    })
    .where(eq(invoices.stripeInvoiceId, invoice.id));

  logBillingAction('Invoice payment failed', { invoiceId: invoice.id });
  // TODO: Send notification email
}

async function handlePaymentSucceeded(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  logBillingAction('Payment succeeded', { paymentIntentId: paymentIntent.id });
}

async function handlePaymentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  logBillingAction('Payment failed', { paymentIntentId: paymentIntent.id });
  // TODO: Send notification email
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get subscription by user ID
 */
export async function getUserSubscription(userId: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result[0] || null;
}

/**
 * Get invoices for user
 */
export async function getUserInvoices(userId: string) {
  return await db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, userId));
}

/**
 * Get active subscriptions count
 */
export async function getActiveSubscriptionsCount(): Promise<number> {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.status, 'active'));

  return result.length;
}

/**
 * Get total revenue (from paid invoices)
 */
export async function getTotalRevenue(): Promise<number> {
  const paidInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.status, 'paid'));

  return paidInvoices.reduce((total, invoice) => total + (invoice.total || 0), 0);
}
