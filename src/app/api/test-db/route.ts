/**
 * API Route: Test Database Connection
 * Simple endpoint to test if database is accessible and has payment data
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    console.log('[DB Test] Attempting to connect to database...');
    
    // Try to fetch payments
    const allPayments = await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(10);

    console.log(`[DB Test] Successfully fetched ${allPayments.length} payments`);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      paymentCount: allPayments.length,
      payments: allPayments.map(p => ({
        id: p.id,
        userId: p.userId,
        amount: p.amount,
        currency: p.currency,
        status: p.paymentStatus,
        plan: p.subscriptionPlan,
        createdAt: p.createdAt,
      })),
    });

  } catch (error) {
    console.error("[DB Test] Database connection failed:", error);
    return NextResponse.json(
      { 
        status: 'error',
        message: "Database connection failed", 
        error: (error as Error).message,
        stack: (error as Error).stack,
      },
      { status: 500 }
    );
  }
}
