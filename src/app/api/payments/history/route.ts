/**
 * API Route: Payment History
 * Get comprehensive payment history for the current user
 * Combines data from payments table and invoices table
 * Includes subscription plan name, amount, currency, status, and date/time
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { payments, invoices, subscriptions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';

export async function GET(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] GET /api/payments/history`);

  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get payments with subscription info
    const userPayments = await db
      .select({
        payment: payments,
        subscription: subscriptions,
      })
      .from(payments)
      .leftJoin(subscriptions, eq(payments.subscriptionId, subscriptions.id))
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));

    // Get invoices with subscription info as fallback
    const userInvoices = await db
      .select({
        invoice: invoices,
        subscription: subscriptions,
      })
      .from(invoices)
      .leftJoin(subscriptions, eq(invoices.subscriptionId, subscriptions.id))
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt));

    console.log(`[${nowUKFormatted()}] Found ${userPayments.length} payments and ${userInvoices.length} invoices for user ${userId}`);

    // Transform payments to unified format with subscription plan info
    const paymentsData = userPayments.map(row => ({
      id: row.payment.id.toString(),
      type: 'payment' as const,
      amount: Math.round(row.payment.amount * 100), // Convert to cents for frontend
      currency: row.payment.currency || 'GBP',
      status: row.payment.paymentStatus || 'pending',
      description: row.payment.description || `${row.subscription?.planName || 'Subscription'} Payment`,
      createdAt: row.payment.createdAt,
      invoiceUrl: row.payment.receiptUrl || undefined,
      paymentMethod: row.payment.paymentMethod,
      paymentMethodBrand: row.payment.paymentMethodBrand,
      paymentMethodLast4: row.payment.paymentMethodLast4,
      billingReason: row.payment.billingReason,
      refundAmount: row.payment.refundAmount,
      refundedAt: row.payment.refundedAt,
      failureMessage: row.payment.failureMessage,
      stripePaymentIntentId: row.payment.stripePaymentIntentId,
      stripeInvoiceId: row.payment.stripeInvoiceId,
      // Subscription details
      planName: row.subscription?.planName || null,
      planType: row.subscription?.planType || null,
      billingInterval: row.subscription?.interval || null,
    }));

    // Transform invoices to unified format (for backwards compatibility)
    // Only include invoices that don't have a corresponding payment record
    const invoicePaymentIntentIds = new Set(
      userPayments
        .filter(p => p.payment.stripeInvoiceId)
        .map(p => p.payment.stripeInvoiceId)
    );

    const invoicesData = userInvoices
      .filter(row => !invoicePaymentIntentIds.has(row.invoice.stripeInvoiceId))
      .map(row => ({
        id: row.invoice.id.toString(),
        type: 'invoice' as const,
        amount: Math.round((row.invoice.total || 0) * 100), // Convert to cents
        currency: row.invoice.currency || 'GBP',
        status: row.invoice.status || 'draft',
        description: row.invoice.description || `${row.subscription?.planName || 'Subscription'} Payment`,
        createdAt: row.invoice.createdAt,
        invoiceUrl: row.invoice.hostedInvoiceUrl || row.invoice.invoicePdf || undefined,
        billingReason: row.invoice.billingReason,
        paidAt: row.invoice.paidAt,
        stripeInvoiceId: row.invoice.stripeInvoiceId,
        invoiceNumber: row.invoice.invoiceNumber,
        // Subscription details
        planName: row.subscription?.planName || null,
        planType: row.subscription?.planType || null,
        billingInterval: row.subscription?.interval || null,
      }));

    // Combine and sort by date
    const allPayments = [...paymentsData, ...invoicesData].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Most recent first
    });

    return NextResponse.json({
      success: true,
      payments: allPayments,
      count: allPayments.length,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${nowUKFormatted()}] Payment history error:`, errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch payment history',
        message: errorMessage,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
