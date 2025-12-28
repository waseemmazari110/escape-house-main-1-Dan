# Booking Notifications - Quick Reference

## 📧 Email Types

### 1. Booking Confirmation
**Sent to:** Guest  
**When:** Booking created OR payment received  
**Subject:** ✅ Booking Confirmed - {Property} (Ref: #{ID})

### 2. Booking Cancellation
**Sent to:** Guest  
**When:** Booking cancelled  
**Subject:** ❌ Booking Cancelled - {Property} (Ref: #{ID})

### 3. Owner Notification
**Sent to:** Property owner  
**When:** New booking received  
**Subject:** 🎉 New Booking for {Property} (Ref: #{ID})

---

## 🚀 Quick Start

### Send Booking Confirmation

```typescript
import { sendBookingConfirmationEmail } from '@/lib/booking-notifications';

await sendBookingConfirmationEmail({
  bookingId: 123,
  guestName: 'John Doe',
  guestEmail: 'john@example.com',
  propertyId: 5,
  propertyName: 'Luxury Cottage',
  checkInDate: '2025-03-01',
  checkOutDate: '2025-03-05',
  numberOfGuests: 8,
  totalPrice: 2000,
  depositAmount: 500,
  depositPaid: true,
  balanceAmount: 1500,
  balanceDueDate: '2025-01-15',
});
```

### Send All Notifications (Guest + Owner)

```typescript
import { sendNewBookingNotifications } from '@/lib/booking-notifications';

const result = await sendNewBookingNotifications({
  // All booking details...
});

console.log(result.guestEmailSent);  // true/false
console.log(result.ownerEmailSent);  // true/false
```

---

## 🔧 Configuration

### Environment Variables

```env
GMAIL_SMTP_APP_PASSWORD=your-gmail-app-password
NEXT_PUBLIC_APP_URL=https://groupescapehouses.co.uk
```

### Sender Email

Currently uses: `mazariwaseem110@gmail.com`

To change, update in `src/lib/gmail-smtp.ts`:
```typescript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: process.env.GMAIL_SMTP_APP_PASSWORD,
  },
});
```

---

## 🎨 Customize Templates

### Change Brand Colors

Edit files in `src/lib/email-templates/`:

**Primary gradient (confirmation):**
```css
background: linear-gradient(135deg, #89A38F 0%, #C6A76D 100%);
```

**Cancellation header:**
```css
background: #ef4444; /* Red */
```

**Owner notification header:**
```css
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
```

### Add Logo

Insert in template header:
```html
<img src="https://yourcdn.com/logo.png" 
     alt="Group Escape Houses" 
     style="max-width: 200px;">
```

---

## 🔍 Testing

### Test in Development

```bash
# Start dev server
npm run dev

# Create test booking
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{...}'

# Check console for email logs:
# ✅ Email sent successfully: message-id
```

### Manual Email Test

```typescript
// In any API route or script
import { sendBookingConfirmationEmail } from '@/lib/booking-notifications';

await sendBookingConfirmationEmail({
  bookingId: 999,
  guestEmail: 'your-test-email@example.com',
  // ... minimal required fields
});
```

---

## 📋 Automatic Triggers

| Event | Trigger Location | Email Type |
|-------|------------------|------------|
| New booking | `/api/bookings/create` | Guest confirmation + Owner notification |
| Booking cancelled | `/api/bookings/[id]/status` (cancel action) | Guest cancellation |
| Deposit paid | `/api/webhooks/booking-payments` | Guest payment confirmation |
| Balance paid | `/api/webhooks/booking-payments` | Guest payment confirmation |

---

## ⚠️ Important Notes

### Non-Blocking Emails
- Emails sent **asynchronously**
- Booking operations **never fail** due to email errors
- Failed emails logged to console

### Owner Assignment Required
Owner notifications only sent if:
```sql
-- Property has owner_id assigned
SELECT owner_id FROM properties WHERE id = 123;

-- Owner exists and has email
SELECT email FROM user WHERE id = 'owner-id';
```

### Refund Status
When sending cancellation email with refund:
```typescript
refundStatus: 'processing' | 'completed' | 'none'
```

---

## 🐛 Troubleshooting

### Email Not Sending?

**Check:**
1. Gmail SMTP password set in `.env`
2. Console logs for error messages
3. Gmail "Less secure app access" or App Password configured

**Test Gmail connection:**
```typescript
import { sendGmailEmail } from '@/lib/gmail-smtp';

await sendGmailEmail({
  to: 'test@example.com',
  subject: 'Test',
  html: '<p>Test email</p>'
});
```

### Owner Not Getting Emails?

**Check:**
1. Property has `owner_id` assigned
2. Owner user exists with valid email
3. Owner role is 'owner' or 'admin'

```sql
SELECT 
  p.id, 
  p.title, 
  p.owner_id, 
  u.email,
  u.role
FROM properties p
LEFT JOIN user u ON p.owner_id = u.id
WHERE p.id = 123;
```

### Emails Going to Spam?

**Solutions:**
1. Set up SPF/DKIM records for domain
2. Use business email provider (Google Workspace, etc.)
3. Add company domain to Gmail "Send as" verified
4. Ensure "From" email matches authenticated email

---

## 📁 File Structure

```
src/
├── lib/
│   ├── booking-notifications.ts          # Main service
│   ├── gmail-smtp.ts                      # SMTP transporter
│   └── email-templates/
│       ├── booking-confirmation.ts        # Guest confirmation
│       ├── booking-cancellation.ts        # Guest cancellation
│       └── owner-notification.ts          # Owner alert
└── app/
    └── api/
        ├── bookings/
        │   ├── create/route.ts            # ✅ Integrated
        │   └── [id]/status/route.ts       # ✅ Integrated
        └── webhooks/
            └── booking-payments/route.ts  # ✅ Integrated
```

---

## 📊 Status

✅ **STEP 2.4 COMPLETE**

- [x] Booking confirmation template
- [x] Cancellation email template
- [x] Owner notification template
- [x] Notification service functions
- [x] Integration into booking creation
- [x] Integration into cancellation
- [x] Integration into payment webhook
- [x] Non-blocking async sending
- [x] Error handling
- [x] Documentation

**Total:** ~1,450 lines added  
**Files:** 4 created, 3 modified  
**Ready:** Production ✅
