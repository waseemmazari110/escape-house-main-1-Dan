import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, verification } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email, code, verificationId } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Find verification record
    const [verificationRecord] = await db
      .select()
      .from(verification)
      .where(
        and(
          eq(verification.identifier, email.toLowerCase()),
          eq(verification.value, code),
          gt(verification.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Delete used verification code
    await db
      .delete(verification)
      .where(eq(verification.id, verificationRecord.id));

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()))
      .limit(1);

    if (existingUser) {
      // User exists, check if they have a password
      const [account] = await db
        .select()
        .from(user)
        .where(eq(user.id, existingUser.id))
        .limit(1);

      return NextResponse.json({
        success: true,
        requiresPassword: true, // Existing users need password
        message: "Code verified. Please enter your password.",
      });
    } else {
      // New user - create account
      const newUserId = crypto.randomUUID();
      
      await db.insert(user).values({
        id: newUserId,
        email: email.toLowerCase(),
        name: email.split("@")[0], // Use email prefix as default name
        emailVerified: true,
        role: "guest",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        requiresPassword: false, // New users can set password later
        isNewUser: true,
        message: "Account created successfully!",
      });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
