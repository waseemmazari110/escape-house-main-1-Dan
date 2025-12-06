import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, verification } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/gmail-smtp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Store verification token
    await db.insert(verification).values({
      id: crypto.randomUUID(),
      identifier: email,
      value: resetToken,
      expiresAt,
    });

    // Send password reset email
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    try {
      await sendPasswordResetEmail(email, resetLink);
      console.log("✅ Password reset email sent to:", email);
    } catch (emailError) {
      console.error("❌ Failed to send password reset email:", emailError);
      console.log("Password reset link (fallback):", resetLink);
      // Still return success to prevent email enumeration
    }

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
