import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, verification } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '@/lib/gmail-smtp';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
    
    if (!existingUser || existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
    await db.insert(verification).values({
      id: crypto.randomUUID(),
      identifier: email,
      value: verificationToken,
      expiresAt,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
      
      console.log(`✅ Verification email sent to ${email}`);
      
      return NextResponse.json({
        message: 'Verification email sent successfully',
        success: true
      });
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
