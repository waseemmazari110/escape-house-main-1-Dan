import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, verification } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    // Find valid verification code
    const verificationRecord = await db
      .select()
      .from(verification)
      .where(
        and(
          eq(verification.identifier, email),
          eq(verification.value, code),
          gt(verification.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!verificationRecord || verificationRecord.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Update user email verification status
    await db
      .update(user)
      .set({ 
        emailVerified: true,
        updatedAt: new Date()
      })
      .where(eq(user.email, email));

    // Delete used verification code
    await db
      .delete(verification)
      .where(eq(verification.id, verificationRecord[0].id));

    return NextResponse.json({ 
      success: true,
      message: 'Email verified successfully' 
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
