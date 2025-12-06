import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, verification, account } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Find valid verification token
    const [verificationRecord] = await db
      .select()
      .from(verification)
      .where(
        and(
          eq(verification.value, token),
          gt(verification.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Find user
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, verificationRecord.identifier))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in account table (better-auth uses "email" as providerId)
    const updateResult = await db
      .update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(account.userId, existingUser.id),
          eq(account.providerId, "email")
        )
      );

    console.log(`✅ Password updated for user: ${existingUser.email}`);

    // Delete used verification token
    await db
      .delete(verification)
      .where(eq(verification.id, verificationRecord.id));

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
