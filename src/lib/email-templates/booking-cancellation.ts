/**
 * Booking Cancellation Email Template
 * Sent to guest when booking is cancelled
 * 
 * STEP 2.4 - Booking Notifications
 */

interface BookingCancellationData {
  bookingId: number;
  guestName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundStatus?: 'processing' | 'completed' | 'none';
}

export function generateBookingCancellationHTML(data: BookingCancellationData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f3f0;
            line-height: 1.6;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header { 
            background: #ef4444;
            color: white; 
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px;
            font-weight: 600;
          }
          .status-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            margin-top: 10px;
            font-size: 14px;
          }
          .content { 
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #1F2937;
            margin-bottom: 20px;
          }
          .info-section {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #fee2e2;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #991b1b;
          }
          .info-value {
            color: #7f1d1d;
            text-align: right;
          }
          .refund-section {
            background: #f0fdf4;
            border: 2px solid #10b981;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
            text-align: center;
          }
          .refund-amount {
            font-size: 32px;
            font-weight: 700;
            color: #059669;
            margin: 15px 0;
          }
          .alert-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            border-radius: 4px;
            margin: 25px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(90deg, #89A38F 0%, #C6A76D 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
            text-align: center;
          }
          .footer {
            background: #1F2937;
            color: #9CA3AF;
            padding: 30px;
            text-align: center;
            font-size: 14px;
          }
          .footer a {
            color: #C6A76D;
            text-decoration: none;
          }
          @media only screen and (max-width: 600px) {
            .container { margin: 0; border-radius: 0; }
            .content { padding: 30px 20px; }
            .header { padding: 30px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>❌ Booking Cancelled</h1>
            <div class="status-badge">Booking #${data.bookingId}</div>
          </div>

          <!-- Content -->
          <div class="content">
            <p class="greeting">Dear ${data.guestName},</p>
            
            <p>Your booking has been cancelled as requested. We're sorry to see you go, but we hope to welcome you again in the future.</p>

            <!-- Cancelled Booking Details -->
            <div class="info-section">
              <h2 style="margin-top: 0; color: #991b1b; font-size: 20px;">📋 Cancelled Booking</h2>
              <div class="info-row">
                <span class="info-label">Property</span>
                <span class="info-value">${data.propertyName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Check-in</span>
                <span class="info-value">${new Date(data.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Check-out</span>
                <span class="info-value">${new Date(data.checkOutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status</span>
                <span class="info-value" style="color: #dc2626; font-weight: 700;">CANCELLED</span>
              </div>
            </div>

            ${data.cancellationReason ? `
              <div style="background: #f9fafb; padding: 15px; border-radius: 4px; margin: 25px 0;">
                <p style="margin: 0; color: #374151; font-size: 14px;">
                  <strong>Cancellation Reason:</strong><br>
                  ${data.cancellationReason}
                </p>
              </div>
            ` : ''}

            <!-- Refund Info -->
            ${data.refundAmount && data.refundAmount > 0 ? `
              <div class="refund-section">
                <h2 style="margin-top: 0; color: #059669; font-size: 20px;">💰 Refund Information</h2>
                <p style="margin: 10px 0; color: #374151;">
                  ${data.refundStatus === 'completed' ? 'Your refund has been processed:' : 
                    data.refundStatus === 'processing' ? 'Your refund is being processed:' : 
                    'Refund amount:'}
                </p>
                <div class="refund-amount">£${data.refundAmount.toFixed(2)}</div>
                <p style="margin: 10px 0; color: #6B7280; font-size: 14px;">
                  ${data.refundStatus === 'completed' ? 
                    'The refund should appear in your account within 5-10 business days.' : 
                    data.refundStatus === 'processing' ?
                    'The refund will be returned to your original payment method within 5-10 business days.' :
                    'Refund will be processed within 5-10 business days.'}
                </p>
              </div>
            ` : `
              <div class="alert-box">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⚠️ No Refund:</strong> No refund is applicable for this cancellation based on our cancellation policy.
                </p>
              </div>
            `}

            <!-- Cancellation Policy Reminder -->
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #374151; font-size: 16px;">📋 Cancellation Policy</h3>
              <ul style="color: #6B7280; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
                <li>Cancellations made more than 6 weeks before check-in: Full refund</li>
                <li>Cancellations made 2-6 weeks before check-in: 50% refund</li>
                <li>Cancellations made less than 2 weeks before check-in: No refund</li>
              </ul>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}/properties" 
                 class="cta-button">
                Browse Other Properties
              </a>
            </div>

            <p style="color: #374151; margin-top: 30px;">
              We're sorry your plans changed. If you'd like to rebook or have any questions, please don't hesitate to contact us.
            </p>

            <p style="color: #374151; margin-top: 20px;">
              Best regards,<br>
              <strong>The Group Escape Houses Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="margin: 10px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}">Group Escape Houses</a>
            </p>
            <p style="margin: 10px 0;">
              Questions? Contact us at 
              <a href="mailto:info@groupescapehouses.co.uk">info@groupescapehouses.co.uk</a>
            </p>
            <p style="margin: 10px 0; font-size: 12px; color: #6B7280;">
              Cancelled Booking Reference: #${data.bookingId}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateBookingCancellationText(data: BookingCancellationData): string {
  return `
BOOKING CANCELLED - Group Escape Houses

Booking Reference: #${data.bookingId}

Dear ${data.guestName},

Your booking has been cancelled as requested. We're sorry to see you go, but we hope to welcome you again in the future.

CANCELLED BOOKING
-----------------
Property: ${data.propertyName}
Check-in: ${new Date(data.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Check-out: ${new Date(data.checkOutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Status: CANCELLED

${data.cancellationReason ? `Cancellation Reason:\n${data.cancellationReason}\n\n` : ''}

${data.refundAmount && data.refundAmount > 0 ? 
  `REFUND INFORMATION\n------------------\n${data.refundStatus === 'completed' ? 'Your refund has been processed' : data.refundStatus === 'processing' ? 'Your refund is being processed' : 'Refund amount'}: £${data.refundAmount.toFixed(2)}\n\nThe refund will be returned to your original payment method within 5-10 business days.\n\n` :
  `⚠️ NO REFUND: No refund is applicable for this cancellation based on our cancellation policy.\n\n`
}

CANCELLATION POLICY
-------------------
• Cancellations made more than 6 weeks before check-in: Full refund
• Cancellations made 2-6 weeks before check-in: 50% refund
• Cancellations made less than 2 weeks before check-in: No refund

Browse other properties:
${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}/properties

We're sorry your plans changed. If you'd like to rebook or have any questions, please don't hesitate to contact us.

Best regards,
The Group Escape Houses Team

---
Group Escape Houses
info@groupescapehouses.co.uk
${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}
  `.trim();
}
