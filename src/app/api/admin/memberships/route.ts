/**
 * Admin Memberships API
 * GET /api/admin/memberships - Get all membership sign-ups with payment info
 * 
 * Returns comprehensive membership tracking data for admin dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, subscriptions, payments } from "@/db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import {
  getCurrentUserWithRole,
  isAdmin,
  unauthorizedResponse,
  unauthenticatedResponse,
} from "@/lib/auth-roles";
import { nowUKFormatted } from "@/lib/date-utils";

export async function GET(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] GET /api/admin/memberships`);

  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUserWithRole();
    if (!currentUser) {
      return unauthenticatedResponse("Please log in to access this resource");
    }

    if (!isAdmin(currentUser)) {
      return unauthorizedResponse("Forbidden: Admin access required");
    }

    // Get all users with owner role (paid members)
    const allMembers = await db
      .select({
        user: user,
        subscription: subscriptions,
      })
      .from(user)
      .leftJoin(subscriptions, eq(user.id, subscriptions.userId))
      .where(eq(user.role, "owner"))
      .orderBy(desc(user.createdAt));

    console.log(`[${nowUKFormatted()}] Found ${allMembers.length} members`);

    // Get latest payment status for each member
    const membersWithPayments = await Promise.all(
      allMembers.map(async (member) => {
        if (!member.subscription) {
          return {
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
            planName: "No Plan",
            status: "inactive",
            amount: 0,
            currency: "GBP",
            signupDate: formatDate(member.user.createdAt),
            currentPeriodEnd: "-",
            paymentStatus: "none",
          };
        }

        // Get latest payment for this subscription
        const latestPayment = await db
          .select()
          .from(payments)
          .where(
            and(
              eq(payments.userId, member.user.id),
              eq(payments.subscriptionId, member.subscription.id)
            )
          )
          .orderBy(desc(payments.createdAt))
          .limit(1);

        return {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          planName: member.subscription.planName,
          status: member.subscription.status,
          amount: member.subscription.amount,
          currency: member.subscription.currency,
          signupDate: member.subscription.createdAt,
          currentPeriodEnd: member.subscription.currentPeriodEnd,
          paymentStatus: latestPayment[0]?.paymentStatus || "pending",
        };
      })
    );

    // Calculate summary statistics
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfMonthUK = formatDateForComparison(firstDayOfMonth);

    const summary = {
      totalMembers: membersWithPayments.length,
      activeMembers: membersWithPayments.filter(
        (m) => m.status === "active" || m.status === "trialing"
      ).length,
      totalRevenue: membersWithPayments.reduce(
        (sum, m) => sum + (m.paymentStatus === "succeeded" ? m.amount : 0),
        0
      ),
      newThisMonth: membersWithPayments.filter((m) => {
        const signupDate = m.signupDate.split(" ")[0]; // Get just the date part
        return compareDates(signupDate, firstDayOfMonthUK) >= 0;
      }).length,
    };

    console.log(`[${nowUKFormatted()}] Summary:`, summary);

    return NextResponse.json({
      success: true,
      members: membersWithPayments,
      summary,
      timestamp: nowUKFormatted(),
    });
  } catch (error: any) {
    console.error(`[${nowUKFormatted()}] Error:`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch membership data",
        details: error.message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}

// Helper function to format date
function formatDate(date: Date | number | string): string {
  if (typeof date === "string") return date;
  
  const d = typeof date === "number" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Helper to format date for comparison (DD/MM/YYYY)
function formatDateForComparison(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper to compare UK format dates (DD/MM/YYYY)
function compareDates(date1: string, date2: string): number {
  const [d1, m1, y1] = date1.split("/").map(Number);
  const [d2, m2, y2] = date2.split("/").map(Number);
  
  const dt1 = new Date(y1, m1 - 1, d1);
  const dt2 = new Date(y2, m2 - 1, d2);
  
  return dt1.getTime() - dt2.getTime();
}
