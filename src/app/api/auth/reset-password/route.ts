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

    // Hash password using bcrypt (same as better-auth)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find any account for this user (don't restrict by providerId)
    const userAccounts = await db
      .select()
      .from(account)
      .where(eq(account.userId, existingUser.id))
      .limit(5);

    console.log(`Found ${userAccounts.length} account(s) for user ${existingUser.id}`);
    
    if (userAccounts.length === 0) {
      console.error(`❌ No accounts found for user ${existingUser.id}`);
      return NextResponse.json(
        { error: "Account not found. Please register again." },
        { status: 404 }
      );
    }

    // Log all provider IDs to help debug
    userAccounts.forEach((acc, idx) => {
      console.log(`  Account ${idx + 1}: providerId="${acc.providerId}", accountId="${acc.accountId}"`);
    });

    // Find the email/password account (try common provider IDs)
    const emailAccount = userAccounts.find(acc => 
      acc.providerId === 'email' || 
      acc.providerId === 'credential' ||
      acc.providerId === 'emailPassword'
    );

    const targetAccount = emailAccount || userAccounts[0]; // Fallback to first account
    
    console.log(`Updating account with providerId="${targetAccount.providerId}"`);
    console.log(`New password hash: ${hashedPassword.substring(0, 30)}...`);

    // Update password in account table
    await db
      .update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(account.id, targetAccount.id));

    console.log(`✅ Password updated successfully for user: ${existingUser.email}`);
    
    // Verify the update by reading back
    const [updatedAccount] = await db
      .select()
      .from(account)
      .where(eq(account.id, targetAccount.id))
      .limit(1);
    
    console.log(`Verified: password field is ${updatedAccount?.password ? 'set' : 'null'}`);

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
