import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, verification } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { sendOtpEmail } from "@/lib/gmail-smtp";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await db.insert(verification).values({
      id: verificationId,
      identifier: email.toLowerCase(),
      value: otpCode,
      expiresAt,
    });

    // Send OTP via Gmail SMTP
    try {
      await sendOtpEmail(email, otpCode);
      
      console.log(`✅ OTP email sent to ${email}`);
      
      return NextResponse.json({
        success: true,
        verificationId,
        message: "Verification code sent to your email",
      });
    } catch (emailError) {
      console.error("❌ Email sending error:", emailError);
      console.log(`📧 OTP Code for ${email}: ${otpCode} (fallback)`);
      
      return NextResponse.json({
        success: true,
        verificationId,
        message: "Verification code logged to console (email error)",
      });
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
