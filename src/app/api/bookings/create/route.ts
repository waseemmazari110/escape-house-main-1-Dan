/**
 * Booking Creation API with Full Validation
 * STEP 2.1 - Complete booking checkout flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, properties } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkAvailability } from '@/lib/booking-availability';
import { 
  calculateBookingPrice, 
  calculatePaymentDueDates,
  validateBookingWindow 
} from '@/lib/booking-pricing';
import { getCurrentUserWithRole } from '@/lib/auth-roles';
import { sendNewBookingNotifications } from '@/lib/booking-notifications';

export interface CreateBookingInput {
  propertyId: number;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  numberOfGuests: number;
  
  // Guest information
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  
  // Optional
  occasion?: string;
  specialRequests?: string;
  experiencesSelected?: string[]; // IDs of selected experiences
}

/**
 * POST /api/bookings/create
 * Complete booking creation with validation, availability check, and price calculation
 */
export async function POST(request: NextRequest) {
  try {
    // AUTHENTICATION OPTIONAL FOR GUEST BOOKINGS
    const currentUser = await getCurrentUserWithRole();
    
    // Allow both authenticated and guest bookings
    // If user is logged in, associate booking with their account

    const body: CreateBookingInput = await request.json();

    // ============================================
    // STEP 1: VALIDATE REQUIRED FIELDS
    // ============================================
    
    const requiredFields: (keyof CreateBookingInput)[] = [
      'propertyId',
      'checkInDate',
      'checkOutDate',
      'numberOfGuests',
      'guestName',
      'guestEmail',
      'guestPhone',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            error: `${field} is required`, 
            code: 'MISSING_REQUIRED_FIELD',
            field 
          },
          { status: 400 }
        );
      }
    }

    // Validate data types
    if (isNaN(body.propertyId) || body.propertyId <= 0) {
      return NextResponse.json(
        { error: 'Invalid propertyId', code: 'INVALID_PROPERTY_ID' },
        { status: 400 }
      );
    }

    if (isNaN(body.numberOfGuests) || body.numberOfGuests <= 0) {
      return NextResponse.json(
        { error: 'numberOfGuests must be greater than 0', code: 'INVALID_GUEST_COUNT' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.guestEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 2: VALIDATE BOOKING WINDOW
    // ============================================

    const windowCheck = validateBookingWindow(body.checkInDate);
    if (!windowCheck.valid) {
      return NextResponse.json(
        { 
          error: windowCheck.reason, 
          code: 'INVALID_BOOKING_WINDOW' 
        },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 3: CHECK PROPERTY EXISTS
    // ============================================

    const property = await db
      .select({
        id: properties.id,
        title: properties.title,
        location: properties.location,
        ownerId: properties.ownerId,
        isPublished: properties.isPublished,
      })
      .from(properties)
      .where(eq(properties.id, body.propertyId))
      .limit(1);

    if (property.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
        { status: 404 }
      );
    }

    const prop = property[0];

    // Check if property is published
    if (!prop.isPublished) {
      return NextResponse.json(
        { error: 'Property is not available for booking', code: 'PROPERTY_NOT_PUBLISHED' },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 4: CHECK AVAILABILITY
    // ============================================

    const availabilityCheck = await checkAvailability({
      propertyId: body.propertyId,
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
    });

    if (!availabilityCheck.available) {
      return NextResponse.json(
        { 
          error: availabilityCheck.reason || 'Property is not available for selected dates',
          code: 'NOT_AVAILABLE',
          conflictingBookings: availabilityCheck.conflictingBookings 
        },
        { status: 409 }
      );
    }

    // ============================================
    // STEP 5: CALCULATE PRICING
    // ============================================

    const priceResult = await calculateBookingPrice({
      propertyId: body.propertyId,
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      numberOfGuests: body.numberOfGuests,
    });

    // Check if pricing calculation failed
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
    const dueDates = calculatePaymentDueDates(body.checkInDate);

    // ============================================
    // STEP 6: CREATE BOOKING
    // ============================================

    const now = new Date().toISOString();

    const bookingData = {
      propertyId: body.propertyId,
      propertyName: prop.title,
      propertyLocation: prop.location,
      
      // Guest information
      guestName: body.guestName.trim(),
      guestEmail: body.guestEmail.trim().toLowerCase(),
      guestPhone: body.guestPhone.trim(),
      
      // Dates
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      numberOfGuests: body.numberOfGuests,
      
      // Pricing
      totalPrice: priceResult.totalPrice,
      depositAmount: priceResult.depositAmount,
      balanceAmount: priceResult.balanceAmount,
      depositPaid: false,
      balancePaid: false,
      
      // Status (starts as pending)
      bookingStatus: 'pending',
      
      // Optional fields
      occasion: body.occasion?.trim() || null,
      specialRequests: body.specialRequests?.trim() || null,
      experiencesSelected: body.experiencesSelected || null,
      
      // Timestamps
      createdAt: now,
      updatedAt: now,
      
      // Admin notes (empty for now)
      adminNotes: null,
    };

    const newBooking = await db
      .insert(bookings)
      .values(bookingData)
      .returning();

    // ============================================
    // STEP 7: SEND BOOKING NOTIFICATIONS
    // ============================================
    
    // Send emails asynchronously (don't block response)
    sendNewBookingNotifications({
      bookingId: newBooking[0].id,
      guestName: newBooking[0].guestName,
      guestEmail: newBooking[0].guestEmail,
      guestPhone: newBooking[0].guestPhone,
      propertyId: newBooking[0].propertyId!,
      propertyName: newBooking[0].propertyName,
      checkInDate: newBooking[0].checkInDate,
      checkOutDate: newBooking[0].checkOutDate,
      numberOfGuests: newBooking[0].numberOfGuests,
      totalPrice: newBooking[0].totalPrice!,
      depositAmount: newBooking[0].depositAmount!,
      depositPaid: newBooking[0].depositPaid!,
      balanceAmount: newBooking[0].balanceAmount!,
      balanceDueDate: dueDates.balanceDueDate,
      specialRequests: newBooking[0].specialRequests || undefined,
      occasion: newBooking[0].occasion || undefined,
    }).catch(error => {
      console.error('Failed to send booking notifications:', error);
      // Don't fail the booking if email fails
    });

    // ============================================
    // STEP 8: RETURN COMPLETE BOOKING DETAILS
    // ============================================

    return NextResponse.json(
      {
        success: true,
        booking: newBooking[0],
        pricing: {
          nights: priceResult.nights,
          pricePerNight: priceResult.pricePerNight,
          subtotal: priceResult.subtotal,
          cleaningFee: priceResult.cleaningFee,
          securityDeposit: priceResult.securityDeposit,
          totalPrice: priceResult.totalPrice,
          depositAmount: priceResult.depositAmount,
          balanceAmount: priceResult.balanceAmount,
          currency: priceResult.currency,
        },
        paymentSchedule: {
          depositDueDate: dueDates.depositDueDate,
          depositAmount: priceResult.depositAmount,
          balanceDueDate: dueDates.balanceDueDate,
          balanceAmount: priceResult.balanceAmount,
        },
        property: {
          id: prop.id,
          title: prop.title,
          location: prop.location,
        },
        nextSteps: {
          message: 'Booking created successfully',
          action: 'PAYMENT_REQUIRED',
          description: `Please complete your deposit payment of £${priceResult.depositAmount.toFixed(2)} to confirm your booking.`,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
