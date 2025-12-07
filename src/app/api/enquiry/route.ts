import { NextRequest, NextResponse } from "next/server";
import { checkForSpam, type SpamCheckData } from "@/lib/spam-protection";
import { sendEnquiryEmail } from "@/lib/email";
import { getCurrentUserWithRole, unauthenticatedResponse } from "@/lib/auth-roles";

export async function POST(request: NextRequest) {
  try {
    // AUTHENTICATION REQUIRED: Only logged-in users can submit enquiries
    const currentUser = await getCurrentUserWithRole();
    
    if (!currentUser) {
      return unauthenticatedResponse('You must be logged in to submit an enquiry');
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      checkin,
      checkout,
      groupSize,
      occasion,
      addons,
      message,
      propertyTitle,
      propertySlug,
      honeypot,
      timestamp,
      challenge,
      userInteraction
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !checkin || !checkout || !groupSize) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Run comprehensive spam check
    const spamCheckData: SpamCheckData = {
      email,
      honeypot,
      timestamp,
      challenge,
      userInteraction
    };

    const spamCheck = await checkForSpam(request, spamCheckData);

    if (spamCheck.isSpam) {
      console.log(`🚫 Enquiry form spam blocked: ${spamCheck.reason}`);
      return NextResponse.json(
        { error: spamCheck.reason || 'Submission rejected' },
        { status: 429 }
      );
    }

    // Send email notification
    try {
      await sendEnquiryEmail({
        name,
        email,
        phone,
        checkin,
        checkout,
        groupSize,
        occasion,
        addons,
        message,
        propertyTitle,
        propertySlug
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue even if email fails - don't block the user
    }

    console.log('✅ Property enquiry submission:', {
      name,
      email,
      phone,
      property: propertyTitle || propertySlug,
      checkin,
      checkout,
      groupSize,
      occasion,
      addonsCount: addons?.length || 0,
      hasMessage: !!message
    });

    return NextResponse.json(
      { 
        message: 'Enquiry sent successfully! Our team will get back to you within 24 hours.',
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Enquiry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}