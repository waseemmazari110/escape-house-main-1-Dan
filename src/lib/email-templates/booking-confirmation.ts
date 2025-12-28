/**
 * Booking Confirmation Email Template
 * Sent to guest after booking is created/confirmed
 * 
 * STEP 2.4 - Booking Notifications
 */

interface BookingConfirmationData {
  bookingId: number;
  guestName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  balanceAmount: number;
  balanceDueDate?: string;
  specialRequests?: string;
}

export function generateBookingConfirmationHTML(data: BookingConfirmationData): string {
  const nights = Math.ceil(
    (new Date(data.checkOutDate).getTime() - new Date(data.checkInDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

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
            background: linear-gradient(135deg, #89A38F 0%, #C6A76D 100%);
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
            background: #f9f9f9;
            border-left: 4px solid #89A38F;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #374151;
          }
          .info-value {
            color: #1F2937;
            text-align: right;
          }
          .price-section {
            background: #f0fdf4;
            border: 2px solid #10b981;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 16px;
          }
          .price-total {
            font-size: 20px;
            font-weight: 700;
            color: #059669;
            padding-top: 15px;
            border-top: 2px solid #10b981;
            margin-top: 10px;
          }
          .payment-status {
            background: #10b981;
            color: white;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
            margin: 20px 0;
            font-weight: 600;
          }
          .payment-pending {
            background: #f59e0b;
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
            <h1>✅ Booking Confirmed</h1>
            <div class="status-badge">Booking #${data.bookingId}</div>
          </div>

          <!-- Content -->
          <div class="content">
            <p class="greeting">Dear ${data.guestName},</p>
            
            <p>Thank you for booking with Group Escape Houses! We're delighted to confirm your reservation.</p>

            <!-- Property Details -->
            <div class="info-section">
              <h2 style="margin-top: 0; color: #1F2937; font-size: 20px;">📍 Your Stay</h2>
              <div class="info-row">
                <span class="info-label">Property</span>
                <span class="info-value">${data.propertyName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Check-in</span>
                <span class="info-value">${new Date(data.checkInDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Check-out</span>
                <span class="info-value">${new Date(data.checkOutDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Duration</span>
                <span class="info-value">${nights} night${nights !== 1 ? 's' : ''}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Guests</span>
                <span class="info-value">${data.numberOfGuests} guest${data.numberOfGuests !== 1 ? 's' : ''}</span>
              </div>
            </div>

            ${data.specialRequests ? `
              <div class="info-section">
                <h2 style="margin-top: 0; color: #1F2937; font-size: 20px;">📝 Special Requests</h2>
                <p style="margin: 0; color: #374151;">${data.specialRequests}</p>
              </div>
            ` : ''}

            <!-- Pricing -->
            <div class="price-section">
              <h2 style="margin-top: 0; color: #059669; font-size: 20px;">💰 Payment Summary</h2>
              <div class="price-row">
                <span>Deposit (25%)</span>
                <span style="font-weight: 600;">£${data.depositAmount.toFixed(2)}</span>
              </div>
              <div class="price-row">
                <span>Balance (75%)</span>
                <span style="font-weight: 600;">£${data.balanceAmount.toFixed(2)}</span>
              </div>
              <div class="price-row price-total">
                <span>Total Amount</span>
                <span>£${data.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <!-- Payment Status -->
            ${data.depositPaid ? `
              <div class="payment-status">
                ✅ Deposit Paid - Thank you!
              </div>
              ${data.balanceDueDate ? `
                <p style="text-align: center; color: #374151;">
                  Balance of <strong>£${data.balanceAmount.toFixed(2)}</strong> due by 
                  <strong>${new Date(data.balanceDueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </p>
              ` : ''}
            ` : `
              <div class="payment-status payment-pending">
                ⏳ Deposit Payment Pending
              </div>
              <p style="text-align: center; color: #374151;">
                Please complete your deposit payment of <strong>£${data.depositAmount.toFixed(2)}</strong> to confirm your booking.
              </p>
            `}

            <!-- CTA -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}/bookings/${data.bookingId}" 
                 class="cta-button">
                View Booking Details
              </a>
            </div>

            <!-- Additional Info -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 25px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>📌 Important:</strong> You will receive check-in instructions 48 hours before your arrival. 
                If you have any questions, please don't hesitate to contact us.
              </p>
            </div>

            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
              We look forward to welcoming you to ${data.propertyName}!
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
              Booking Reference: #${data.bookingId}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateBookingConfirmationText(data: BookingConfirmationData): string {
  const nights = Math.ceil(
    (new Date(data.checkOutDate).getTime() - new Date(data.checkInDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return `
BOOKING CONFIRMED - Group Escape Houses

Booking Reference: #${data.bookingId}

Dear ${data.guestName},

Thank you for booking with Group Escape Houses! We're delighted to confirm your reservation.

YOUR STAY
---------
Property: ${data.propertyName}
Check-in: ${new Date(data.checkInDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
Check-out: ${new Date(data.checkOutDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
Duration: ${nights} night${nights !== 1 ? 's' : ''}
Guests: ${data.numberOfGuests}

${data.specialRequests ? `SPECIAL REQUESTS\n----------------\n${data.specialRequests}\n\n` : ''}

PAYMENT SUMMARY
---------------
Deposit (25%): £${data.depositAmount.toFixed(2)}
Balance (75%): £${data.balanceAmount.toFixed(2)}
Total Amount: £${data.totalPrice.toFixed(2)}

${data.depositPaid ? 
  `✅ Deposit Paid - Thank you!\n${data.balanceDueDate ? `Balance of £${data.balanceAmount.toFixed(2)} due by ${new Date(data.balanceDueDate).toLocaleDateString('en-GB')}` : ''}` :
  `⏳ Deposit Payment Pending\nPlease complete your deposit payment of £${data.depositAmount.toFixed(2)} to confirm your booking.`
}

View your booking details:
${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}/bookings/${data.bookingId}

IMPORTANT: You will receive check-in instructions 48 hours before your arrival.

We look forward to welcoming you to ${data.propertyName}!

Best regards,
The Group Escape Houses Team

---
Group Escape Houses
info@groupescapehouses.co.uk
${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}
  `.trim();
}
