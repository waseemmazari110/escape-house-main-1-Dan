/**
 * Owner Notification Email Template
 * Sent to property owner when a new booking is created
 * 
 * STEP 2.4 - Booking Notifications
 */

interface OwnerNotificationData {
  bookingId: number;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  specialRequests?: string;
  occasion?: string;
}

export function generateOwnerNotificationHTML(data: OwnerNotificationData): string {
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
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
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
          .alert-banner {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 0 0 30px 0;
            border-radius: 4px;
          }
          .alert-banner h2 {
            margin: 0 0 10px 0;
            color: #1e40af;
            font-size: 20px;
          }
          .info-section {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .info-section h3 {
            margin: 0 0 15px 0;
            color: #1F2937;
            font-size: 18px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
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
          .contact-box {
            background: #f0fdf4;
            border: 2px solid #10b981;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .contact-item {
            margin: 10px 0;
            color: #374151;
          }
          .contact-item a {
            color: #059669;
            text-decoration: none;
            font-weight: 600;
          }
          .payment-status {
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            margin: 20px 0;
            font-weight: 600;
          }
          .payment-paid {
            background: #d1fae5;
            color: #065f46;
            border: 2px solid #10b981;
          }
          .payment-pending {
            background: #fef3c7;
            color: #92400e;
            border: 2px solid #f59e0b;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
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
            <h1>🎉 New Booking Received!</h1>
            <div class="status-badge">Booking #${data.bookingId}</div>
          </div>

          <!-- Content -->
          <div class="content">
            <!-- Alert Banner -->
            <div class="alert-banner">
              <h2>📢 Action Required</h2>
              <p style="margin: 0; color: #1e40af;">
                You have received a new booking for <strong>${data.propertyName}</strong>. 
                Please review the details below and prepare for your guest's arrival.
              </p>
            </div>

            <!-- Booking Details -->
            <div class="info-section">
              <h3>📅 Booking Details</h3>
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
                <span class="info-value">${data.numberOfGuests}</span>
              </div>
              ${data.occasion ? `
                <div class="info-row">
                  <span class="info-label">Occasion</span>
                  <span class="info-value">${data.occasion}</span>
                </div>
              ` : ''}
            </div>

            <!-- Guest Contact -->
            <div class="contact-box">
              <h3 style="margin: 0 0 15px 0; color: #059669; font-size: 18px;">👤 Guest Information</h3>
              <div class="contact-item">
                <strong>Name:</strong> ${data.guestName}
              </div>
              <div class="contact-item">
                <strong>Email:</strong> <a href="mailto:${data.guestEmail}">${data.guestEmail}</a>
              </div>
              <div class="contact-item">
                <strong>Phone:</strong> <a href="tel:${data.guestPhone}">${data.guestPhone}</a>
              </div>
            </div>

            ${data.specialRequests ? `
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px; margin: 25px 0;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px;">📝 Special Requests</h3>
                <p style="margin: 0; color: #78350f; white-space: pre-wrap;">${data.specialRequests}</p>
              </div>
            ` : ''}

            <!-- Payment Info -->
            <div class="info-section">
              <h3>💰 Payment Information</h3>
              <div class="info-row">
                <span class="info-label">Total Booking Value</span>
                <span class="info-value" style="font-size: 20px; font-weight: 700; color: #059669;">£${data.totalPrice.toFixed(2)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Deposit (25%)</span>
                <span class="info-value">£${data.depositAmount.toFixed(2)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Balance (75%)</span>
                <span class="info-value">£${(data.totalPrice - data.depositAmount).toFixed(2)}</span>
              </div>
            </div>

            <div class="payment-status ${data.depositPaid ? 'payment-paid' : 'payment-pending'}">
              ${data.depositPaid ? 
                '✅ Deposit Paid - Booking Confirmed' : 
                '⏳ Deposit Payment Pending - Awaiting Guest Payment'}
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}/owner/bookings/${data.bookingId}" 
                 class="cta-button">
                View in Owner Dashboard
              </a>
            </div>

            <!-- Next Steps -->
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #374151; font-size: 16px;">📋 Next Steps</h3>
              <ol style="color: #6B7280; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
                <li>Review the booking details and guest information</li>
                <li>Mark the dates as blocked on any external calendars</li>
                <li>Prepare the property for guest arrival</li>
                <li>Send check-in instructions 48 hours before arrival</li>
                <li>Ensure the property is clean and ready for check-in</li>
              </ol>
            </div>

            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
              This is an automated notification from your Group Escape Houses owner dashboard. 
              You can manage this booking and communicate with your guest through the owner portal.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="margin: 10px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}/owner">Owner Dashboard</a>
            </p>
            <p style="margin: 10px 0;">
              Questions? Contact support at 
              <a href="mailto:support@groupescapehouses.co.uk">support@groupescapehouses.co.uk</a>
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

export function generateOwnerNotificationText(data: OwnerNotificationData): string {
  const nights = Math.ceil(
    (new Date(data.checkOutDate).getTime() - new Date(data.checkInDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return `
NEW BOOKING RECEIVED - Group Escape Houses

Booking Reference: #${data.bookingId}

🎉 ACTION REQUIRED: You have received a new booking for ${data.propertyName}.

BOOKING DETAILS
---------------
Property: ${data.propertyName}
Check-in: ${new Date(data.checkInDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
Check-out: ${new Date(data.checkOutDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
Duration: ${nights} night${nights !== 1 ? 's' : ''}
Guests: ${data.numberOfGuests}
${data.occasion ? `Occasion: ${data.occasion}` : ''}

GUEST INFORMATION
-----------------
Name: ${data.guestName}
Email: ${data.guestEmail}
Phone: ${data.guestPhone}

${data.specialRequests ? `SPECIAL REQUESTS\n----------------\n${data.specialRequests}\n\n` : ''}

PAYMENT INFORMATION
-------------------
Total Booking Value: £${data.totalPrice.toFixed(2)}
Deposit (25%): £${data.depositAmount.toFixed(2)}
Balance (75%): £${(data.totalPrice - data.depositAmount).toFixed(2)}

${data.depositPaid ? '✅ Deposit Paid - Booking Confirmed' : '⏳ Deposit Payment Pending - Awaiting Guest Payment'}

View in Owner Dashboard:
${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}/owner/bookings/${data.bookingId}

NEXT STEPS
----------
1. Review the booking details and guest information
2. Mark the dates as blocked on any external calendars
3. Prepare the property for guest arrival
4. Send check-in instructions 48 hours before arrival
5. Ensure the property is clean and ready for check-in

---
Group Escape Houses Owner Dashboard
support@groupescapehouses.co.uk
${process.env.NEXT_PUBLIC_APP_URL || 'https://groupescapehouses.co.uk'}/owner
  `.trim();
}
