/**
 * API Route: Admin Transactions
 * Get all payment transactions for admin dashboard
 * Shows payments from all users (owners paying for subscriptions)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payments, user, subscriptions, invoices } from "@/db/schema";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import { 
  getCurrentUserWithRole, 
  isAdmin,
  unauthorizedResponse,
  unauthenticatedResponse
} from "@/lib/auth-roles";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const currentUser = await getCurrentUserWithRole();

    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    // Verify admin role
    if (!isAdmin(currentUser)) {
      return unauthorizedResponse('Admin access required');
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query conditions
    let conditions = [];
    
    // Filter by payment status
    if (status !== 'all') {
      conditions.push(eq(payments.paymentStatus, status));
    }

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(payments.description, `%${search}%`),
          like(payments.stripePaymentIntentId, `%${search}%`),
          like(payments.receiptEmail, `%${search}%`)
        )
      );
    }

    // Fetch transactions with user and subscription details
    const transactions = await db
      .select({
        payment: payments,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        subscription: subscriptions,
      })
      .from(payments)
      .leftJoin(user, eq(payments.userId, user.id))
      .leftJoin(subscriptions, eq(payments.subscriptionId, subscriptions.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(payments.createdAt))
      .limit(limit)
      .offset(offset);

    // Get status counts
    const statusCounts = await db
      .select({
        status: payments.paymentStatus,
        count: sql<number>`count(*)`.as('count'),
      })
      .from(payments)
      .groupBy(payments.paymentStatus);

    // Calculate total counts
    const counts = {
      all: 0,
      succeeded: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
      canceled: 0,
    };

    statusCounts.forEach((item: any) => {
      counts.all += parseInt(item.count) || 0;
      if (item.status in counts) {
        counts[item.status as keyof typeof counts] = parseInt(item.count) || 0;
      }
    });

    // Calculate total revenue (only succeeded payments)
    const revenueResult = await db
      .select({
        total: sql<number>`SUM(${payments.amount})`.as('total'),
      })
      .from(payments)
      .where(eq(payments.paymentStatus, 'succeeded'));

    const totalRevenue = revenueResult[0]?.total || 0;

    // Format response
    const formattedTransactions = transactions.map((row) => ({
      id: row.payment.id,
      amount: row.payment.amount,
      currency: row.payment.currency,
      status: row.payment.paymentStatus,
      paymentMethod: row.payment.paymentMethod || 'card',
      paymentMethodBrand: row.payment.paymentMethodBrand || 'unknown',
      paymentMethodLast4: row.payment.paymentMethodLast4 || '****',
      description: row.payment.description || 'Subscription payment',
      customer: {
        name: row.user?.name || 'Unknown',
        email: row.user?.email || row.payment.receiptEmail || 'N/A',
        role: row.user?.role || 'guest',
      },
      subscription: row.subscription ? {
        planName: row.subscription.planName,
        status: row.subscription.status,
      } : null,
      stripePaymentIntentId: row.payment.stripePaymentIntentId,
      stripeChargeId: row.payment.stripeChargeId,
      receiptUrl: row.payment.receiptUrl,
      refundAmount: row.payment.refundAmount,
      refundedAt: row.payment.refundedAt,
      billingReason: row.payment.billingReason,
      createdAt: row.payment.createdAt,
      processedAt: row.payment.processedAt,
    }));

    return NextResponse.json({
      transactions: formattedTransactions,
      statusCounts: counts,
      totalRevenue,
      pagination: {
        total: counts.all,
        limit,
        offset,
        hasMore: offset + limit < counts.all,
      },
    });

  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
