/**
 * Booking Availability Check API
 * Real-time availability checking for calendar UI
 * STEP 2.1 - Booking Checkout Flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  checkAvailability, 
  getBlockedDates,
  getNextAvailableDate 
} from '@/lib/booking-availability';

/**
 * GET /api/bookings/availability?propertyId=123&checkInDate=2025-12-20&checkOutDate=2025-12-27
 * Check if dates are available for booking
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const propertyId = searchParams.get('propertyId');
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const action = searchParams.get('action'); // 'check', 'blocked-dates', 'next-available'

    // Validate propertyId
    if (!propertyId || isNaN(parseInt(propertyId))) {
      return NextResponse.json(
        { error: 'Valid propertyId is required', code: 'INVALID_PROPERTY_ID' },
        { status: 400 }
      );
    }

    const propId = parseInt(propertyId);

    // ============================================
    // ACTION: Get blocked dates (for calendar UI)
    // ============================================
    
    if (action === 'blocked-dates') {
      const blockedDates = await getBlockedDates(propId);
      
      return NextResponse.json({
        propertyId: propId,
        blockedDates,
        count: blockedDates.length,
      });
    }

    // ============================================
    // ACTION: Get next available date
    // ============================================
    
    if (action === 'next-available') {
      const fromDate = searchParams.get('fromDate') || undefined;
      const nextAvailable = await getNextAvailableDate(propId, fromDate);
      
      return NextResponse.json({
        propertyId: propId,
        nextAvailableDate: nextAvailable,
        fromDate: fromDate || new Date().toISOString().split('T')[0],
      });
    }

    // ============================================
    // ACTION: Check availability (default)
    // ============================================

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: 'checkInDate and checkOutDate are required', code: 'MISSING_DATES' },
        { status: 400 }
      );
    }

    // Check availability
    const availabilityResult = await checkAvailability({
      propertyId: propId,
      checkInDate,
      checkOutDate,
    });

    return NextResponse.json({
      propertyId: propId,
      checkInDate,
      checkOutDate,
      available: availabilityResult.available,
      reason: availabilityResult.reason,
      conflictingBookings: availabilityResult.conflictingBookings,
    });

  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check availability',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
