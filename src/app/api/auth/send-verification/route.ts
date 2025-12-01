import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, verification } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store verification code
    await db.insert(verification).values({
      id: `verification_${Date.now()}_${Math.random()}`,
      identifier: email,
      value: verificationCode,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send verification email
    try {
      await resend.emails.send({
        from: 'Escape Houses <noreply@escapehouse.co.uk>',
        to: email,
        subject: 'Verify your email address',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify your email address</h2>
            <p>Thank you for signing up! Your verification code is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
              ${verificationCode}
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue even if email fails - code is stored in DB
    }

    return NextResponse.json({ 
      success: true,
      message: 'Verification code sent to your email' 
    });

  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
