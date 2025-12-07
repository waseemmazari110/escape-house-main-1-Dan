import nodemailer from 'nodemailer';

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'groupescapehouses.co.uk',
    pass: process.env.GMAIL_SMTP_APP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error: Error | null) => {
  if (error) {
    console.error('Gmail SMTP configuration error:', error);
  } else {
    console.log('Gmail SMTP server is ready to send emails');
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using Gmail SMTP
 */
export async function sendGmailEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: '"Group Escape Houses" <groupescapehouses.co.uk>',
      to,
      subject,
      html,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}

/**
 * Send verification email with link
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; background-color: #89A38F; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      Group Escape Houses
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 24px;">
                      Verify Your Email Address
                    </h2>
                    
                    <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                      Thank you for registering with Group Escape Houses! Please verify your email address by clicking the button below.
                    </p>
                    
                    <!-- CTA Button -->
                    <table role="presentation" style="margin: 30px 0;">
                      <tr>
                        <td style="border-radius: 8px; background-color: #89A38F;">
                          <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 10px 0 0 0; color: #89A38F; font-size: 14px; word-break: break-all;">
                      ${verificationUrl}
                    </p>
                    
                    <p style="margin: 30px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                      This verification link will expire in 24 hours.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #F9FAFB; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                      If you didn't create an account, you can safely ignore this email.
                    </p>
                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                      © 2025 Group Escape Houses. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendGmailEmail({
    to: email,
    subject: 'Verify Your Email - Group Escape Houses',
    html,
  });
}

/**
 * Send OTP code email
 */
export async function sendOtpEmail(email: string, code: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; background-color: #89A38F; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      Group Escape Houses
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 24px;">
                      Your Sign-In Code
                    </h2>
                    
                    <p style="margin: 0 0 30px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                      Use the code below to sign in to your account:
                    </p>
                    
                    <!-- OTP Code -->
                    <div style="background-color: #F9FAFB; border: 2px solid #89A38F; border-radius: 12px; padding: 30px; margin: 30px 0;">
                      <p style="margin: 0; color: #89A38F; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${code}
                      </p>
                    </div>
                    
                    <p style="margin: 30px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                      This code will expire in <strong>10 minutes</strong>.
                    </p>
                    
                    <p style="margin: 20px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                      If you didn't request this code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #F9FAFB; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                      Need help? Contact us at <a href="mailto:mazariwaseem110@gmail.com" style="color: #89A38F; text-decoration: none;">mazariwaseem110@gmail.com</a>
                    </p>
                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                      © 2025 Group Escape Houses. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendGmailEmail({
    to: email,
    subject: 'Your Sign-In Code - Group Escape Houses',
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; background-color: #89A38F; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      Group Escape Houses
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 24px;">
                      Reset Your Password
                    </h2>
                    
                    <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                      We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    
                    <!-- CTA Button -->
                    <table role="presentation" style="margin: 30px 0;">
                      <tr>
                        <td style="border-radius: 8px; background-color: #89A38F;">
                          <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 10px 0 0 0; color: #89A38F; font-size: 14px; word-break: break-all;">
                      ${resetUrl}
                    </p>
                    
                    <p style="margin: 30px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                      This password reset link will expire in 1 hour.
                    </p>
                    
                    <p style="margin: 20px 0 0 0; color: #DC2626; font-size: 14px; line-height: 1.6;">
                      <strong>⚠️ If you didn't request a password reset, please ignore this email or contact support if you have concerns.</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #F9FAFB; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                      Need help? Contact us at <a href="mailto:groupescapehouses.co.uk" style="color: #89A38F; text-decoration: none;">groupescapehouses.co.uk</a>
                    </p>
                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                      © 2025 Group Escape Houses. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendGmailEmail({
    to: email,
    subject: 'Reset Your Password - Group Escape Houses',
    html,
  });
}
