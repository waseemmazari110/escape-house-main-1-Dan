import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // UK timestamp logging
    const now = new Date();
    const ukTime = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    console.log(`${ukTime} [INFO] [bookings] Fetching user bookings | User: ${session.user.id}`);

    // For now, return empty array
    // TODO: Implement actual booking fetching from database
    return NextResponse.json({
      bookings: [],
      message: 'Bookings retrieved successfully'
    });
  } catch (error: any) {
    const now = new Date();
    const ukTime = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    console.error(`${ukTime} [ERROR] [bookings] Failed to fetch bookings:`, error.message);

    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
