# 🧪 VERIFICATION & TESTING GUIDE

**Comprehensive Testing and Verification Documentation**  
**Version:** 1.0.0  
**Last Updated:** December 17, 2025  
**Status:** ✅ Production Ready

---

## 📋 TABLE OF CONTENTS

1. [Testing Environment Setup](#testing-environment-setup)
2. [Authentication System Testing](#authentication-system-testing)
3. [Property Management Testing](#property-management-testing)
4. [Booking System Testing](#booking-system-testing)
5. [Payment Integration Testing](#payment-integration-testing)
6. [Webhook Testing](#webhook-testing)
7. [CRM System Testing](#crm-system-testing)
8. [Email System Testing](#email-system-testing)
9. [API Endpoint Reference](#api-endpoint-reference)
10. [Database Verification](#database-verification)
11. [Common Issues & Solutions](#common-issues--solutions)

---

## 🔧 TESTING ENVIRONMENT SETUP

### Prerequisites

```bash
# Required environment variables
TURSO_DATABASE_URL=libsql://[your-database-url]
TURSO_AUTH_TOKEN=[your-auth-token]

# Authentication
BETTER_AUTH_SECRET=[32+ character secret]
BETTER_AUTH_URL=http://localhost:3000

# Email
RESEND_API_KEY=[your-resend-key]
EMAIL_FROM=noreply@yourdomain.com

# Payment Providers
STRIPE_SECRET_KEY=sk_test_[your-key]
STRIPE_PUBLISHABLE_KEY=pk_test_[your-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-secret]

# Orchards Integration
ORCHARDS_API_KEY=[your-orchards-key]
ORCHARDS_MERCHANT_ID=[your-merchant-id]
ORCHARDS_WEBHOOK_SECRET=[your-webhook-secret]

# Optional
OPENAI_API_KEY=[for chatbot]
TWILIO_ACCOUNT_SID=[for WhatsApp]
TWILIO_AUTH_TOKEN=[for WhatsApp]
```

### Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Clear cache
npm run clear-cache

# 3. Start development server
npm run dev

# 4. Verify server is running
# Open http://localhost:3000
```

### Database Verification

```bash
# Check database connection
node -e "import('@/db').then(({db}) => console.log('✅ Database connected'))"
```

---

## 🔐 AUTHENTICATION SYSTEM TESTING

### 1. User Registration (Guest)

#### UI Test
1. Navigate to `/register`
2. Fill in registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: SecurePass123!
3. Submit form
4. Check for verification email

#### API Test
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### Database Verification
```sql
-- Check user table
SELECT id, name, email, role, emailVerified FROM user WHERE email = 'test@example.com';

-- Expected result:
-- role = 'guest'
-- emailVerified = false

-- Check session table
SELECT id, userId, expiresAt FROM session WHERE userId = '[user-id]';
```

#### Success Criteria
- ✅ User record created in `user` table
- ✅ Session record created in `session` table
- ✅ Role set to `guest`
- ✅ Verification email sent
- ✅ User redirected to dashboard

---

### 2. Email Verification

#### UI Test
1. Check email inbox for verification email
2. Click verification link
3. Verify redirect to login page
4. Login with credentials

#### API Test
```bash
# Get verification token from database
curl http://localhost:3000/api/auth/verify-email?token=[verification-token]
```

#### Database Verification
```sql
-- Check emailVerified flag
SELECT email, emailVerified FROM user WHERE email = 'test@example.com';

-- Expected: emailVerified = true

-- Check verification table (should be cleaned up)
SELECT * FROM verification WHERE identifier = 'test@example.com';
-- Expected: No records or expired records
```

---

### 3. Login System

#### UI Test
1. Navigate to `/login`
2. Enter credentials
3. Verify redirect to appropriate dashboard based on role

#### API Test
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### Session Verification
```sql
-- Check active session
SELECT token, userId, expiresAt FROM session 
WHERE userId = '[user-id]' 
ORDER BY createdAt DESC LIMIT 1;
```

---

### 4. Role-Based Access Control (RBAC)

#### Test Admin Access
```bash
# Should succeed for admin
curl http://localhost:3000/api/admin/users \
  -H "Cookie: session=[admin-session-token]"

# Should fail for guest
curl http://localhost:3000/api/admin/users \
  -H "Cookie: session=[guest-session-token]"
# Expected: 403 Forbidden
```

#### Test Owner Access
```bash
# Owner accessing their own properties
curl http://localhost:3000/api/properties/owner \
  -H "Cookie: session=[owner-session-token]"

# Owner accessing another owner's property (should fail)
curl http://localhost:3000/api/properties/999 \
  -H "Cookie: session=[owner-session-token]"
# Expected: 403 Forbidden (if property doesn't belong to them)
```

#### Database Role Check
```sql
-- View all user roles
SELECT id, name, email, role FROM user;

-- Update role (admin only operation)
UPDATE user SET role = 'owner' WHERE email = 'newowner@example.com';
```

---

## 🏠 PROPERTY MANAGEMENT TESTING

### 1. Create Property (Owner)

#### UI Test
1. Login as owner
2. Navigate to `/owner/properties/new`
3. Fill property details:
   - Title: "Luxury Cottage"
   - Location: "Lake District"
   - Region: "North West"
   - Sleeps: 4-6
   - Bedrooms: 3
   - Bathrooms: 2
   - Price: £150/night
4. Upload hero image
5. Add features and amenities
6. Submit

#### API Test
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[owner-session-token]" \
  -d '{
    "title": "Luxury Cottage",
    "location": "Lake District",
    "region": "North West",
    "sleepsMin": 4,
    "sleepsMax": 6,
    "bedrooms": 3,
    "bathrooms": 2,
    "priceFromMidweek": 150,
    "priceFromWeekend": 180,
    "description": "Beautiful cottage with stunning views",
    "heroImage": "/uploads/hero-image.jpg"
  }'
```

#### Database Verification
```sql
-- Check property created
SELECT id, title, ownerId, status, isPublished 
FROM properties 
WHERE title = 'Luxury Cottage';

-- Expected:
-- status = 'pending' (awaiting approval)
-- isPublished = true
-- ownerId = [owner's user id]

-- Check property features
SELECT pf.featureName 
FROM property_features pf
JOIN properties p ON p.id = pf.propertyId
WHERE p.title = 'Luxury Cottage';
```

#### Success Criteria
- ✅ Property created with `pending` status
- ✅ Owner linked correctly
- ✅ Features saved
- ✅ Owner receives confirmation email
- ✅ Admin notified for approval

---

### 2. Property Approval Workflow (Admin)

#### UI Test (Admin)
1. Login as admin
2. Navigate to `/admin/properties/pending`
3. Review property "Luxury Cottage"
4. Click "Approve" or "Reject"
5. If rejecting, provide reason

#### API Test - Approve
```bash
curl -X PUT http://localhost:3000/api/properties/[property-id] \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[admin-session-token]" \
  -d '{
    "status": "approved"
  }'
```

#### API Test - Reject
```bash
curl -X PUT http://localhost:3000/api/properties/[property-id] \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[admin-session-token]" \
  -d '{
    "status": "rejected",
    "rejectionReason": "Images need to be higher quality"
  }'
```

#### Database Verification
```sql
-- Check approval status
SELECT id, title, status, approvedBy, approvedAt, rejectionReason
FROM properties 
WHERE id = [property-id];

-- For approved:
-- status = 'approved'
-- approvedBy = [admin-user-id]
-- approvedAt = [timestamp]

-- For rejected:
-- status = 'rejected'
-- rejectionReason = [reason text]
```

#### Email Verification
- ✅ Owner receives approval/rejection email
- ✅ Email contains appropriate details
- ✅ For rejection, reason is included

---

### 3. Public Property Search

#### UI Test
1. Navigate to `/properties` (public page)
2. Use search filters:
   - Region: "North West"
   - Min Guests: 4
   - Check-in: 25/12/2025
   - Check-out: 31/12/2025
3. Verify results show only approved, available properties

#### API Test
```bash
curl -X GET "http://localhost:3000/api/public/properties?region=North%20West&minGuests=4&checkInDate=25/12/2025&checkOutDate=31/12/2025"
```

#### Expected Response
```json
{
  "success": true,
  "properties": [
    {
      "id": 1,
      "title": "Luxury Cottage",
      "location": "Lake District",
      "region": "North West",
      "sleepsMin": 4,
      "sleepsMax": 6,
      "priceFromMidweek": 150,
      "heroImage": "/uploads/hero-image.jpg",
      "averageRating": 4.8,
      "totalReviews": 12,
      "features": ["WiFi", "Parking", "Hot Tub"],
      "isAvailable": true
    }
  ],
  "total": 1
}
```

#### Database Verification
```sql
-- Check only approved properties are visible
SELECT id, title, status 
FROM properties 
WHERE region = 'North West' AND status = 'approved';

-- Check availability for date range
SELECT date, status, isAvailable
FROM availability_calendar
WHERE propertyId = 1 
AND date BETWEEN '25/12/2025' AND '31/12/2025';
```

---

## 📅 BOOKING SYSTEM TESTING

### 1. Create Booking

#### UI Test
1. Navigate to property page
2. Select dates: 25/12/2025 - 31/12/2025
3. Enter guest details:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +44 7700 900000
   - Guests: 4
4. Review pricing breakdown
5. Submit booking

#### API Test
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": 1,
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+44 7700 900000",
    "checkInDate": "25/12/2025",
    "checkOutDate": "31/12/2025",
    "numberOfGuests": 4,
    "occasion": "Christmas holiday"
  }'
```

#### Expected Response
```json
{
  "success": true,
  "booking": {
    "id": 123,
    "bookingStatus": "pending",
    "totalPrice": 900,
    "depositAmount": 270,
    "balanceAmount": 630,
    "depositPaid": false,
    "balancePaid": false,
    "depositPaymentUrl": "https://payment.gateway.com/pay/dep_xxx"
  }
}
```

#### Database Verification
```sql
-- Check booking created
SELECT * FROM bookings WHERE id = 123;

-- Expected fields:
-- bookingStatus = 'pending'
-- depositPaid = false
-- balancePaid = false
-- totalPrice = 900
-- depositAmount = 270 (30% of total)
-- balanceAmount = 630

-- Check calendar updated
SELECT date, status, bookingId 
FROM availability_calendar
WHERE propertyId = 1 
AND date BETWEEN '25/12/2025' AND '31/12/2025';

-- Expected: status = 'booked', bookingId = 123
```

#### Success Criteria
- ✅ Booking created with `pending` status
- ✅ Pricing calculated correctly
- ✅ Calendar dates marked as booked
- ✅ Guest receives confirmation email
- ✅ Owner notified of new booking
- ✅ Payment link generated

---

### 2. Booking Status Management

#### Check Available Actions
```bash
curl http://localhost:3000/api/bookings/123/status \
  -H "Cookie: session=[session-token]"
```

#### Expected Response
```json
{
  "bookingId": 123,
  "currentStatus": "pending",
  "statusInfo": {
    "label": "Pending Deposit",
    "description": "Awaiting deposit payment",
    "color": "yellow"
  },
  "availableActions": ["cancel"],
  "paymentStatus": {
    "depositPaid": false,
    "depositAmount": 270,
    "balancePaid": false,
    "balanceAmount": 630
  }
}
```

#### Update Booking Status (Owner/Admin)
```bash
# Confirm booking
curl -X PUT http://localhost:3000/api/bookings/123/status \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[owner-session-token]" \
  -d '{
    "action": "confirm",
    "adminNotes": "Booking confirmed, keys ready"
  }'

# Complete booking (after checkout)
curl -X PUT http://localhost:3000/api/bookings/123/status \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[owner-session-token]" \
  -d '{
    "action": "complete"
  }'

# Cancel booking
curl -X PUT http://localhost:3000/api/bookings/123/status \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[owner-session-token]" \
  -d '{
    "action": "cancel",
    "cancelReason": "Guest requested cancellation"
  }'
```

#### Database Verification
```sql
-- Check status transitions
SELECT id, bookingStatus, adminNotes, updatedAt 
FROM bookings 
WHERE id = 123;

-- Status flow:
-- pending → deposit_paid → confirmed → completed
-- OR pending → cancelled
```

---

## 💳 PAYMENT INTEGRATION TESTING

### 1. Stripe Deposit Payment

#### UI Test
1. Complete booking creation
2. Click "Pay Deposit" button
3. Enter Stripe test card: `4242 4242 4242 4242`
4. Expiry: any future date
5. CVC: any 3 digits
6. Complete payment

#### Stripe Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
Requires Authentication: 4000 0025 0000 3155
```

#### API Test - Create Payment Intent
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create-deposit",
    "bookingId": 123
  }'
```

#### Expected Response
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "amount": 27000,
  "currency": "gbp"
}
```

#### Database Verification - After Payment
```sql
-- Check booking updated
SELECT 
  id,
  depositPaid,
  stripeDepositPaymentIntentId,
  stripeDepositChargeId,
  bookingStatus
FROM bookings 
WHERE id = 123;

-- Expected after successful payment:
-- depositPaid = true
-- stripeDepositPaymentIntentId = 'pi_xxx'
-- stripeDepositChargeId = 'ch_xxx'
-- bookingStatus = 'deposit_paid'
```

#### Success Criteria
- ✅ Payment processed successfully
- ✅ `depositPaid` flag set to `true`
- ✅ Stripe IDs stored in database
- ✅ Booking status updated to `deposit_paid`
- ✅ Guest receives payment confirmation email
- ✅ Owner notified of deposit received

---

### 2. Orchards Payment Integration

#### Create Orchards Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create-orchards-payment",
    "bookingId": 123,
    "paymentType": "deposit"
  }'
```

#### Expected Response
```json
{
  "success": true,
  "paymentUrl": "https://orchards.io/pay/xxx",
  "transactionId": "orch_xxx",
  "amount": 270,
  "currency": "GBP"
}
```

#### Database Verification
```sql
-- Check Orchards payment record
SELECT * FROM orchards_payments WHERE bookingId = 123;

-- Expected fields:
-- orchardsTransactionId = 'orch_xxx'
-- orchardsPaymentUrl = 'https://orchards.io/pay/xxx'
-- paymentType = 'deposit'
-- status = 'pending'
-- amount = 270
```

#### Manual Payment Test
1. Open payment URL in browser
2. Complete payment using test card
3. Wait for webhook notification
4. Verify database updates

---

### 3. Balance Payment

#### Create Balance Payment (after deposit paid)
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create-balance",
    "bookingId": 123
  }'
```

#### Database Verification - After Balance Paid
```sql
-- Check both payments completed
SELECT 
  id,
  depositPaid,
  balancePaid,
  depositAmount,
  balanceAmount,
  bookingStatus
FROM bookings 
WHERE id = 123;

-- Expected:
-- depositPaid = true
-- balancePaid = true
-- bookingStatus = 'confirmed'
```

---

### 4. Refund Processing

#### Create Refund (Admin/Owner)
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[owner-session-token]" \
  -d '{
    "action": "refund",
    "bookingId": 123,
    "amount": 270,
    "reason": "Property unavailable"
  }'
```

#### Database Verification
```sql
-- Check refund recorded
SELECT 
  id,
  stripeRefundId,
  bookingStatus
FROM bookings 
WHERE id = 123;

-- For Stripe refunds:
-- stripeRefundId = 're_xxx'
-- bookingStatus = 'refunded'

-- For Orchards refunds:
SELECT * FROM orchards_payments 
WHERE bookingId = 123 AND status = 'refunded';
```

#### Success Criteria
- ✅ Refund processed successfully
- ✅ Amount refunded to customer
- ✅ Booking status updated
- ✅ Customer receives refund email
- ✅ Owner notified of refund

---

## 🔗 WEBHOOK TESTING

### 1. Stripe Webhook Testing (Local)

#### Install Stripe CLI
```bash
# Download from https://stripe.com/docs/stripe-cli
stripe login
```

#### Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3000/api/webhooks/booking-payments
```

#### Get Webhook Secret
```bash
# Copy the webhook signing secret displayed
# Add to .env.local:
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

#### Test Webhook Events
```bash
# Test successful payment
stripe trigger payment_intent.succeeded

# Test failed payment
stripe trigger payment_intent.payment_failed

# Test refund
stripe trigger charge.refunded
```

#### Monitor Webhook Processing
```bash
# Check terminal output for:
[timestamp] Booking Payment Webhook: Processing event
[timestamp] Booking Payment Webhook: Payment confirmed
```

#### Database Verification
```sql
-- Check booking updated by webhook
SELECT id, depositPaid, bookingStatus, updatedAt
FROM bookings
ORDER BY updatedAt DESC LIMIT 5;
```

---

### 2. Orchards Webhook Testing

#### Setup Webhook URL
1. Configure in Orchards dashboard:
   - URL: `https://yourdomain.com/api/webhooks/orchards`
   - Events: `payment.completed`, `payment.failed`, `payment.refunded`
   - Secret: Add to `.env.local` as `ORCHARDS_WEBHOOK_SECRET`

#### Test with Postman/cURL
```bash
# Simulate payment completed webhook
curl -X POST http://localhost:3000/api/webhooks/orchards \
  -H "Content-Type: application/json" \
  -H "X-Orchards-Signature: [calculated-signature]" \
  -d '{
    "event": "payment.completed",
    "transactionId": "orch_test_123",
    "status": "completed",
    "amount": 270,
    "currency": "GBP",
    "timestamp": "2025-12-17T10:30:00Z"
  }'
```

#### Webhook Signature Verification
```javascript
// Test signature calculation (Node.js)
const crypto = require('crypto');

const payload = JSON.stringify(webhookData);
const secret = process.env.ORCHARDS_WEBHOOK_SECRET;
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

console.log('X-Orchards-Signature:', signature);
```

#### Database Verification
```sql
-- Check Orchards payment updated
SELECT 
  id,
  orchardsTransactionId,
  status,
  paidAt,
  updatedAt
FROM orchards_payments
WHERE orchardsTransactionId = 'orch_test_123';

-- Expected:
-- status = 'completed'
-- paidAt = [timestamp]

-- Check corresponding booking
SELECT id, depositPaid, bookingStatus
FROM bookings
WHERE id = (
  SELECT bookingId FROM orchards_payments 
  WHERE orchardsTransactionId = 'orch_test_123'
);
```

---

### 3. Webhook Error Handling

#### Test Invalid Signature
```bash
curl -X POST http://localhost:3000/api/webhooks/orchards \
  -H "Content-Type: application/json" \
  -H "X-Orchards-Signature: invalid_signature" \
  -d '{
    "event": "payment.completed",
    "transactionId": "orch_test_123"
  }'
```

#### Expected Response
```json
{
  "success": false,
  "error": "Invalid webhook signature"
}
```

#### Test Missing Fields
```bash
curl -X POST http://localhost:3000/api/webhooks/orchards \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.completed"
  }'
```

#### Expected Response
```json
{
  "success": false,
  "error": "Missing transactionId in webhook payload"
}
```

---

## 📧 EMAIL SYSTEM TESTING

### 1. Email Configuration

#### Verify Resend Setup
```bash
# Test Resend API
curl https://api.resend.com/emails \
  -H "Authorization: Bearer ${RESEND_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@yourdomain.com",
    "to": "your-email@example.com",
    "subject": "Test Email",
    "html": "<p>Testing email delivery</p>"
  }'
```

### 2. Booking Confirmation Email

#### Trigger Email
Create a booking through UI or API (see Booking System Testing)

#### Verify Email Content
- ✅ From: noreply@yourdomain.com
- ✅ To: Guest email
- ✅ Subject: "Booking Confirmation - [Property Name]"
- ✅ Contains:
  - Booking reference number
  - Property details
  - Check-in/out dates (DD/MM/YYYY format)
  - Guest details
  - Pricing breakdown
  - Payment link (if deposit unpaid)
  - Contact information

#### Test Email Manually
```bash
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "booking-confirmation",
    "bookingId": 123
  }'
```

### 3. Payment Confirmation Email

#### Trigger Email
Complete a payment (deposit or balance)

#### Verify Email Content
- ✅ Subject: "Payment Received - £270.00"
- ✅ Contains:
  - Payment amount
  - Payment type (Deposit/Balance)
  - Booking details
  - Remaining balance (if applicable)
  - Receipt/invoice

### 4. Owner Notification Emails

#### New Booking Notification
- ✅ Sent to property owner
- ✅ Subject: "New Booking Received - [Property Name]"
- ✅ Contains:
  - Guest details
  - Booking dates
  - Number of guests
  - Special requests
  - Payment status
  - Link to owner dashboard

#### Payment Received Notification
- ✅ Sent to property owner
- ✅ Contains payment details
- ✅ Updated booking status

---

## 🗂️ CRM SYSTEM TESTING

### 1. Owner Profile Management

#### Create Owner Profile
```bash
curl -X POST http://localhost:3000/api/crm/owners \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[admin-session-token]" \
  -d '{
    "userId": "user-123",
    "businessName": "Luxury Retreats Ltd",
    "businessType": "company",
    "phone": "+44 7700 900000",
    "address": "123 Main St",
    "city": "London",
    "postalCode": "SW1A 1AA",
    "taxId": "GB123456789",
    "status": "active"
  }'
```

#### Database Verification
```sql
-- Check owner profile created
SELECT * FROM crm_owner_profiles WHERE userId = 'user-123';

-- Expected:
-- businessName = 'Luxury Retreats Ltd'
-- status = 'active'
```

### 2. Enquiry Management

#### Create Enquiry
```bash
curl -X POST http://localhost:3000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+44 7700 900001",
    "subject": "Booking Enquiry",
    "message": "Looking to book for Christmas",
    "enquiryType": "booking",
    "checkInDate": "25/12/2025",
    "checkOutDate": "31/12/2025",
    "numberOfGuests": 6
  }'
```

#### Database Verification
```sql
-- Check enquiry created
SELECT * FROM enquiries ORDER BY createdAt DESC LIMIT 1;

-- Expected:
-- status = 'new'
-- enquiryType = 'booking'
-- checkInDate = '25/12/2025'
```

#### Update Enquiry Status
```bash
curl -X PUT http://localhost:3000/api/enquiries/[id] \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[admin-session-token]" \
  -d '{
    "status": "contacted",
    "assignedTo": "admin-user-id",
    "notes": "Called and discussed options"
  }'
```

### 3. Activity Logging

#### Log Activity
```bash
curl -X POST http://localhost:3000/api/crm/activity \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[admin-session-token]" \
  -d '{
    "entityType": "enquiry",
    "entityId": "123",
    "activityType": "phone_call",
    "title": "Follow-up call",
    "description": "Discussed availability and pricing",
    "outcome": "Interested in booking",
    "performedBy": "admin-user-id"
  }'
```

#### Database Verification
```sql
-- Check activity logged
SELECT * FROM crm_activity_log 
WHERE entityType = 'enquiry' AND entityId = '123'
ORDER BY createdAt DESC;
```

---

## 🌐 API ENDPOINT REFERENCE

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/verify-email` | Verify email | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |

### Property Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/public/properties` | Get public listings | No | - |
| GET | `/api/properties/[id]` | Get property details | No | - |
| POST | `/api/properties` | Create property | Yes | Owner/Admin |
| PUT | `/api/properties/[id]` | Update property | Yes | Owner/Admin |
| DELETE | `/api/properties/[id]` | Delete property | Yes | Admin |
| GET | `/api/properties/owner` | Get owner properties | Yes | Owner |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/bookings` | Create booking | No | - |
| GET | `/api/bookings/[id]` | Get booking details | Yes | Guest/Owner/Admin |
| GET | `/api/bookings/[id]/status` | Get booking status | Yes | Guest/Owner/Admin |
| PUT | `/api/bookings/[id]/status` | Update booking status | Yes | Owner/Admin |
| GET | `/api/owner/bookings` | Get owner bookings | Yes | Owner |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/payments?action=create-deposit` | Create deposit payment | Yes | Guest/Admin |
| POST | `/api/payments?action=create-balance` | Create balance payment | Yes | Guest/Admin |
| POST | `/api/payments?action=refund` | Process refund | Yes | Owner/Admin |
| GET | `/api/payments?transactionId=xxx` | Get payment details | Yes | Guest/Owner/Admin |
| GET | `/api/payments?action=by-booking&bookingId=123` | Get booking payments | Yes | Guest/Owner/Admin |

### Webhook Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/webhooks/booking-payments` | Stripe webhook | No (Verified) |
| POST | `/api/webhooks/orchards` | Orchards webhook | No (Verified) |
| POST | `/api/webhooks/billing` | Billing webhook | No (Verified) |

### CRM Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/enquiries` | Get all enquiries | Yes | Admin |
| POST | `/api/enquiries` | Create enquiry | No | - |
| PUT | `/api/enquiries/[id]` | Update enquiry | Yes | Admin |
| GET | `/api/crm/owners` | Get owner profiles | Yes | Admin |
| POST | `/api/crm/activity` | Log activity | Yes | Admin |

---

## 💾 DATABASE VERIFICATION

### Key Tables and Fields

#### bookings Table
```sql
-- Check booking records
SELECT 
  id,
  propertyName,
  guestName,
  guestEmail,
  checkInDate,    -- DD/MM/YYYY format
  checkOutDate,   -- DD/MM/YYYY format
  bookingStatus,  -- pending, deposit_paid, confirmed, completed, cancelled
  totalPrice,
  depositAmount,
  depositPaid,
  balanceAmount,
  balancePaid,
  stripeDepositPaymentIntentId,
  stripeBalancePaymentIntentId,
  createdAt,
  updatedAt
FROM bookings
WHERE id = 123;
```

#### properties Table
```sql
-- Check property records
SELECT 
  id,
  title,
  slug,
  location,
  region,
  status,         -- pending, approved, rejected
  ownerId,
  featured,
  isPublished,
  approvedBy,
  approvedAt,
  rejectionReason
FROM properties
WHERE id = 1;
```

#### availability_calendar Table
```sql
-- Check availability
SELECT 
  propertyId,
  date,           -- DD/MM/YYYY format
  status,         -- available, booked, blocked, maintenance
  isAvailable,
  price,
  bookingId
FROM availability_calendar
WHERE propertyId = 1 
AND date BETWEEN '25/12/2025' AND '31/12/2025'
ORDER BY date;
```

#### orchards_payments Table
```sql
-- Check payment records
SELECT 
  id,
  bookingId,
  orchardsTransactionId,
  paymentType,    -- deposit, balance, full
  amount,
  currency,
  status,         -- pending, processing, completed, failed, refunded
  orchardsPaymentUrl,
  paidAt,
  createdAt
FROM orchards_payments
WHERE bookingId = 123;
```

#### user Table
```sql
-- Check user accounts
SELECT 
  id,
  name,
  email,
  role,           -- guest, owner, admin
  emailVerified,
  phone,
  companyName,
  createdAt
FROM user
WHERE email = 'test@example.com';
```

---

## 🔍 CRM SYNC VERIFICATION

### 1. Verify Owner Sync

#### Check Owner Profile Creation
```sql
-- After owner registration, verify CRM profile created
SELECT 
  u.id AS userId,
  u.name,
  u.email,
  u.role,
  cop.businessName,
  cop.status,
  cop.source
FROM user u
LEFT JOIN crm_owner_profiles cop ON u.id = cop.userId
WHERE u.role = 'owner';
```

#### Success Criteria
- ✅ CRM profile automatically created when owner registers
- ✅ Profile linked to user account
- ✅ Status set to 'active'

### 2. Verify Booking Sync

#### Check Booking Activity Logging
```sql
-- Check booking creation logged
SELECT 
  entityType,
  entityId,
  activityType,
  title,
  createdAt
FROM crm_activity_log
WHERE entityType = 'booking' 
AND entityId = '123'
ORDER BY createdAt DESC;
```

#### Expected Activities
- ✅ Booking created
- ✅ Deposit payment received
- ✅ Balance payment received
- ✅ Status changes (confirmed, completed, etc.)

### 3. Verify Enquiry Conversion

#### Check Enquiry to Booking Conversion
```sql
-- Link enquiry to booking
SELECT 
  e.id AS enquiryId,
  e.email AS enquiryEmail,
  e.status AS enquiryStatus,
  b.id AS bookingId,
  b.guestEmail AS bookingEmail,
  b.bookingStatus
FROM enquiries e
LEFT JOIN bookings b ON e.email = b.guestEmail
WHERE e.enquiryType = 'booking';
```

#### Manual Conversion Test
```bash
# Update enquiry status to converted
curl -X PUT http://localhost:3000/api/enquiries/[id] \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[admin-session-token]" \
  -d '{
    "status": "converted"
  }'
```

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue 1: Email Not Sending

#### Symptoms
- No confirmation emails received
- Error: "Failed to send email"

#### Verification
```bash
# Check Resend API key
echo $RESEND_API_KEY

# Test Resend connection
curl https://api.resend.com/emails \
  -H "Authorization: Bearer ${RESEND_API_KEY}"
```

#### Solutions
1. Verify `RESEND_API_KEY` in `.env.local`
2. Check domain verification in Resend dashboard
3. Check email logs: `/api/email/logs` (admin only)
4. Verify `EMAIL_FROM` address is verified in Resend

---

### Issue 2: Webhook Not Receiving Events

#### Symptoms
- Payments succeed but booking not updated
- Webhook endpoint returns errors

#### Verification
```bash
# Test webhook endpoint directly
curl -X POST http://localhost:3000/api/webhooks/booking-payments \
  -H "Content-Type: application/json" \
  -d '{}'

# Should return 400 with signature verification error
```

#### Solutions
1. Verify `STRIPE_WEBHOOK_SECRET` in `.env.local`
2. For local testing, use Stripe CLI forwarding
3. Check webhook signature verification
4. Ensure webhook URL is accessible from internet (for production)
5. Check Stripe dashboard → Webhooks → Event logs

---

### Issue 3: Calendar Not Updating

#### Symptoms
- Dates remain available after booking
- Double bookings possible

#### Verification
```sql
-- Check calendar entries exist
SELECT COUNT(*) FROM availability_calendar 
WHERE propertyId = 1;

-- Check specific date range
SELECT * FROM availability_calendar 
WHERE propertyId = 1 
AND date BETWEEN '25/12/2025' AND '31/12/2025';
```

#### Solutions
1. Run calendar population script:
```bash
curl -X POST http://localhost:3000/api/calendar/populate \
  -H "Cookie: session=[admin-session-token]" \
  -d '{"propertyId": 1}'
```

2. Check booking creation logic updates calendar
3. Verify date format is DD/MM/YYYY throughout

---

### Issue 4: Payment Status Not Updating

#### Symptoms
- Payment succeeded in Stripe/Orchards
- Database still shows unpaid

#### Verification
```sql
-- Check booking payment status
SELECT 
  id,
  depositPaid,
  balancePaid,
  stripeDepositPaymentIntentId,
  stripeBalancePaymentIntentId
FROM bookings 
WHERE id = 123;

-- Check webhook processed
SELECT * FROM orchards_payments 
WHERE bookingId = 123 
ORDER BY updatedAt DESC;
```

#### Solutions
1. Check webhook delivery in payment provider dashboard
2. Manually sync payment status:
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Cookie: session=[admin-session-token]" \
  -d '{
    "action": "sync-status",
    "bookingId": 123
  }'
```

3. Verify webhook signature is correct
4. Check application logs for webhook processing errors

---

### Issue 5: Permission Denied Errors

#### Symptoms
- 403 Forbidden errors
- "Unauthorized" messages

#### Verification
```sql
-- Check user role
SELECT id, email, role FROM user 
WHERE email = 'user@example.com';

-- Check session
SELECT userId, expiresAt FROM session 
WHERE token = '[session-token]';
```

#### Solutions
1. Verify user has correct role for action
2. Check session hasn't expired
3. Clear cache and re-login:
```bash
npm run clear-cache
```

4. For admin operations, verify user role is 'admin'
5. Check API endpoint requires correct role

---

## 📊 PERFORMANCE MONITORING

### Database Query Performance
```sql
-- Check slow queries
EXPLAIN QUERY PLAN
SELECT * FROM bookings 
WHERE propertyId = 1 
AND checkInDate >= '25/12/2025';

-- Verify indexes exist
SELECT name FROM sqlite_master 
WHERE type = 'index';
```

### API Response Time
```bash
# Test endpoint response time
time curl http://localhost:3000/api/public/properties

# Should complete in < 1 second
```

### Webhook Processing Time
Monitor webhook processing logs for timing:
```
[timestamp] Booking Payment Webhook: Processing event { type: 'payment_intent.succeeded' }
[timestamp] Booking Payment Webhook: Payment confirmed (processed in 234ms)
```

---

## ✅ COMPLETE VERIFICATION CHECKLIST

### Pre-Deployment Checklist

#### Environment
- [ ] All environment variables configured
- [ ] Database connection successful
- [ ] Email service configured and tested
- [ ] Payment providers configured
- [ ] Webhook endpoints accessible

#### Authentication
- [ ] User registration working
- [ ] Email verification working
- [ ] Login/logout working
- [ ] Password reset working
- [ ] Role-based access control working

#### Properties
- [ ] Create property working
- [ ] Approval workflow working
- [ ] Public listing working
- [ ] Search and filters working
- [ ] Image upload working

#### Bookings
- [ ] Create booking working
- [ ] Calendar updates correctly
- [ ] Pricing calculation correct
- [ ] Status transitions working
- [ ] Guest/owner notifications sent

#### Payments
- [ ] Stripe deposit payment working
- [ ] Stripe balance payment working
- [ ] Orchards payment working
- [ ] Refund processing working
- [ ] Payment confirmations sent

#### Webhooks
- [ ] Stripe webhook processing
- [ ] Orchards webhook processing
- [ ] Signature verification working
- [ ] Database updates triggering
- [ ] Error handling working

#### CRM
- [ ] Enquiry creation working
- [ ] Owner profile management working
- [ ] Activity logging working
- [ ] Enquiry status updates working

#### Emails
- [ ] Booking confirmations sending
- [ ] Payment confirmations sending
- [ ] Owner notifications sending
- [ ] Email templates correct
- [ ] UK date format (DD/MM/YYYY) throughout

---

## 🚀 PRODUCTION DEPLOYMENT

### Final Verification Steps

1. **Database Backup**
```bash
# Backup production database before deployment
```

2. **Environment Variables**
- Verify all production keys configured
- Update webhook URLs to production domain
- Configure production payment provider keys

3. **DNS & SSL**
- Verify domain DNS configured
- SSL certificate active
- Webhook URLs accessible via HTTPS

4. **Payment Providers**
- Switch from test to live API keys
- Update webhook endpoints in provider dashboards
- Test with real cards (small amounts)

5. **Monitoring**
- Set up error tracking (Sentry, etc.)
- Configure uptime monitoring
- Set up webhook failure alerts

---

## 📞 SUPPORT & TROUBLESHOOTING

### Getting Help

1. Check application logs: `/var/log/app.log`
2. Check webhook delivery logs in payment provider dashboard
3. Check email delivery logs in Resend dashboard
4. Review database records for data integrity

### Debug Mode

Enable debug logging:
```env
# .env.local
DEBUG=true
LOG_LEVEL=debug
```

### Contact Information

For additional support:
- Documentation: See all `MILESTONE_*_COMPLETE.md` files
- Email: support@yourdomain.com
- Admin Dashboard: `/admin`

---

**END OF VERIFICATION & TESTING GUIDE**

*Last Updated: December 17, 2025*
*Version: 1.0.0*
