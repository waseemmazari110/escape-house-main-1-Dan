import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, users, properties } from '@/db/schema';
import { eq, count, sql } from 'drizzle-orm';
import { 
  getCurrentUserWithRole, 
  isAdmin,
  unauthorizedResponse
} from "@/lib/auth-roles";

export async function GET() {
  try {
    const currentUser = await getCurrentUserWithRole();
    
    // Must be admin
    if (!currentUser || !isAdmin(currentUser)) {
      return unauthorizedResponse('Admin access required');
    }

    // Get total bookings
    const totalBookingsResult = await db
      .select({ count: count() })
      .from(bookings);
    const totalBookings = totalBookingsResult[0]?.count || 0;

    // Get total users
    const totalUsersResult = await db
      .select({ count: count() })
      .from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get total owners
    const totalOwnersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'owner'));
    const totalOwners = totalOwnersResult[0]?.count || 0;

    // Get total guests
    const totalGuestsResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'guest'));
    const totalGuests = totalGuestsResult[0]?.count || 0;

    // Get total properties
    const totalPropertiesResult = await db
      .select({ count: count() })
      .from(properties);
    const totalProperties = totalPropertiesResult[0]?.count || 0;

    // Calculate total revenue (sum of all booking prices)
    const revenueResult = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(${bookings.totalPrice} AS DECIMAL(10,2))), 0)` 
      })
      .from(bookings)
      .where(eq(bookings.bookingStatus, 'confirmed'));
    const totalRevenue = Number(revenueResult[0]?.total || 0);

    return NextResponse.json({
      totalBookings,
      totalUsers,
      totalOwners,
      totalGuests,
      totalProperties,
      totalRevenue: Math.round(totalRevenue),
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
