import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, verification, account, session as sessionTable } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { scryptAsync } from "@noble/hashes/scrypt.js";
import { bytesToHex } from "@noble/hashes/utils.js";

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

    // Verify the token exists and is valid
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

    // Find user by email from verification
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

    console.log(`Resetting password for user: ${existingUser.email}`);

    // Find the existing credential account
    const [existingAccount] = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, existingUser.id),
          eq(account.providerId, "credential")
        )
      )
      .limit(1);

    if (!existingAccount) {
      return NextResponse.json(
        { error: "No credential account found" },
        { status: 404 }
      );
    }

    console.log(`Found existing account: ${existingAccount.accountId}`);

    // Hash password using scrypt EXACTLY as better-auth does internally
    // Better-auth uses scryptAsync with these exact parameters:
    const config = {
      N: 16384, // CPU/memory cost
      r: 16,    // Block size
      p: 1,     // Parallelization
      dkLen: 64 // Derived key length
    };
    
    // Generate random salt (16 bytes)
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    const saltHex = bytesToHex(saltBytes);
    
    // Hash password with scrypt
    const keyBytes = await scryptAsync(
      password.normalize("NFKC"), 
      saltHex, 
      {
        N: config.N,
        p: config.p,
        r: config.r,
        dkLen: config.dkLen,
        maxmem: 128 * config.N * config.r * 2
      }
    );
    
    // Format: salt:key (both hex-encoded, separated by colon)
    const keyHex = bytesToHex(keyBytes);
    const hashedPassword = `${saltHex}:${keyHex}`;
    
    console.log(`New password hash (scrypt): ${hashedPassword.substring(0, 50)}...`);

    // Update the existing account with the new password hash
    await db
      .update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(account.id, existingAccount.id));
    
    console.log(`✅ Updated account password using better-auth's scrypt format`);

    // Clear all sessions
    await db
      .delete(sessionTable)
      .where(eq(sessionTable.userId, existingUser.id));
    console.log(`✅ Cleared all sessions`);

    // Delete used verification token
    await db
      .delete(verification)
      .where(eq(verification.id, verificationRecord.id));

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. Please try logging in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
