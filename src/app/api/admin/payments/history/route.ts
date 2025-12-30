/**
 * API Route: Admin Payment History
 * Get all payment history across all users (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { payments, subscriptions, user } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';
import { getCurrentUserWithRole, isAdmin, unauthenticatedResponse, unauthorizedResponse } from '@/lib/auth-roles';

export async function GET(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] GET /api/admin/payments/history`);

  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUserWithRole();
    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    if (!isAdmin(currentUser)) {
      return unauthorizedResponse('Forbidden: Admin access required');
    }

    // Pull all payments from DB with user + subscription context
    const allPayments = await db
      .select({
        payment: payments,
        subscription: subscriptions,
        user: user,
      })
      .from(payments)
      .leftJoin(subscriptions, eq(payments.subscriptionId, subscriptions.id))
      .leftJoin(user, eq(payments.userId, user.id))
      .orderBy(desc(payments.createdAt));

    console.log(`[${nowUKFormatted()}] Found ${allPayments.length} total payments`);

    const formattedPayments = allPayments.map((row) => ({
      id: row.payment.id.toString(),
      amount: Math.round((row.payment.amount || 0) * 100), // return minor units for UI formatting
      currency: row.payment.currency || 'GBP',
      status: row.payment.paymentStatus,
      description:
        row.payment.description ||
        `${row.subscription?.planName || 'Subscription'} - ${row.payment.billingReason || 'subscription'}`,
      createdAt: row.payment.createdAt,
      invoiceUrl: row.payment.receiptUrl || undefined,
      // User details
      userId: row.payment.userId,
      userName: row.user?.name || 'Unknown',
      userEmail: row.user?.email || row.payment.receiptEmail || '',
      userRole: row.user?.role || row.payment.userRole || 'owner',
      // Subscription details
      planName: row.subscription?.planName || row.payment.subscriptionPlan || null,
      planType: row.subscription?.planType || null,
      billingInterval: row.subscription?.interval || null,
    }));

    const totalPaid = formattedPayments.filter((p) => p.status === 'succeeded' || p.status === 'paid').length;
    const totalPending = formattedPayments.filter((p) => p.status !== 'succeeded' && p.status !== 'paid').length;
    const totalAmount = formattedPayments
      .filter((p) => p.status === 'succeeded' || p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0) / 100;

    return NextResponse.json({
      payments: formattedPayments,
      summary: {
        total: formattedPayments.length,
        totalPaid,
        totalPending,
        totalAmount,
      },
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${nowUKFormatted()}] Admin payment history error:`, errorMessage);

    return NextResponse.json(
      {
        error: 'Failed to fetch admin payment history',
        message: errorMessage,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
