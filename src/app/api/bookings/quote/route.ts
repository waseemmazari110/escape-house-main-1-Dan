/**
 * Booking Price Quote API
 * Calculate price before creating booking
 * STEP 2.1 - Booking Checkout Flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateBookingPrice, formatPrice, calculatePaymentDueDates } from '@/lib/booking-pricing';

/**
 * GET /api/bookings/quote?propertyId=123&checkInDate=2025-12-20&checkOutDate=2025-12-27&numberOfGuests=8
 * Get price quote for booking
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const propertyId = searchParams.get('propertyId');
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const numberOfGuests = searchParams.get('numberOfGuests');

    // Validate required parameters
    if (!propertyId || isNaN(parseInt(propertyId))) {
      return NextResponse.json(
        { error: 'Valid propertyId is required', code: 'INVALID_PROPERTY_ID' },
        { status: 400 }
      );
    }

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: 'checkInDate and checkOutDate are required', code: 'MISSING_DATES' },
        { status: 400 }
      );
    }

    if (!numberOfGuests || isNaN(parseInt(numberOfGuests))) {
      return NextResponse.json(
        { error: 'Valid numberOfGuests is required', code: 'INVALID_GUEST_COUNT' },
        { status: 400 }
      );
    }

    // Calculate price
    const priceResult = await calculateBookingPrice({
      propertyId: parseInt(propertyId),
      checkInDate,
      checkOutDate,
      numberOfGuests: parseInt(numberOfGuests),
    });

    // Check if calculation failed
    if ('error' in priceResult) {
      return NextResponse.json(
        { 
          error: priceResult.error,
          code: priceResult.code 
        },
        { status: 400 }
      );
    }

    // Calculate payment due dates
    const dueDates = calculatePaymentDueDates(checkInDate);

    // Return detailed price breakdown
    return NextResponse.json({
      propertyId: parseInt(propertyId),
      checkInDate,
      checkOutDate,
      numberOfGuests: parseInt(numberOfGuests),
      
      // Price breakdown
      pricing: {
        nights: priceResult.nights,
        pricePerNight: priceResult.pricePerNight,
        pricePerNightFormatted: formatPrice(priceResult.pricePerNight, priceResult.currency),
        
        nightlyBreakdown: priceResult.nightlyBreakdown.map(night => ({
          ...night,
          priceFormatted: formatPrice(night.price, priceResult.currency),
        })),
        
        subtotal: priceResult.subtotal,
        subtotalFormatted: formatPrice(priceResult.subtotal, priceResult.currency),
        
        cleaningFee: priceResult.cleaningFee,
        cleaningFeeFormatted: formatPrice(priceResult.cleaningFee || 0, priceResult.currency),
        
        securityDeposit: priceResult.securityDeposit,
        securityDepositFormatted: formatPrice(priceResult.securityDeposit || 0, priceResult.currency),
        
        serviceFee: priceResult.serviceFee,
        serviceFeeFormatted: formatPrice(priceResult.serviceFee || 0, priceResult.currency),
        
        taxes: priceResult.taxes,
        taxesFormatted: formatPrice(priceResult.taxes || 0, priceResult.currency),
        
        totalPrice: priceResult.totalPrice,
        totalPriceFormatted: formatPrice(priceResult.totalPrice, priceResult.currency),
        
        depositAmount: priceResult.depositAmount,
        depositAmountFormatted: formatPrice(priceResult.depositAmount, priceResult.currency),
        
        balanceAmount: priceResult.balanceAmount,
        balanceAmountFormatted: formatPrice(priceResult.balanceAmount, priceResult.currency),
        
        currency: priceResult.currency,
      },
      
      // Payment schedule
      paymentSchedule: {
        depositDueDate: dueDates.depositDueDate,
        depositAmount: priceResult.depositAmount,
        depositAmountFormatted: formatPrice(priceResult.depositAmount, priceResult.currency),
        depositDescription: 'Due immediately to secure booking',
        
        balanceDueDate: dueDates.balanceDueDate,
        balanceAmount: priceResult.balanceAmount,
        balanceAmountFormatted: formatPrice(priceResult.balanceAmount, priceResult.currency),
        balanceDescription: 'Due 6 weeks before check-in',
      },
      
      // Summary for display
      summary: {
        nights: priceResult.nights,
        averagePerNight: formatPrice(priceResult.pricePerNight, priceResult.currency),
        total: formatPrice(priceResult.totalPrice, priceResult.currency),
        depositRequired: formatPrice(priceResult.depositAmount, priceResult.currency),
        refundableDeposit: formatPrice(priceResult.securityDeposit || 0, priceResult.currency),
      },
    });

  } catch (error) {
    console.error('Price quote error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to calculate price',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
