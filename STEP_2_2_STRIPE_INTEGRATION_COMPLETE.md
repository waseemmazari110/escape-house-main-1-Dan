# STEP 2.2 - Stripe Integration for Bookings - COMPLETE ✅

**Date:** December 17, 2025  
**Phase:** Membership Billing + Owner Dashboard + Property Management  
**Status:** Payment Integration Implemented

---

## 📋 WHAT WAS IMPLEMENTED

### ✅ Database Schema Updates

**Added Stripe Payment Fields to Bookings Table:**
```typescript
// New fields in bookings table
stripeCustomerId: text('stripe_customer_id')
stripeDepositPaymentIntentId: text('stripe_deposit_payment_intent_id')
stripeBalancePaymentIntentId: text('stripe_balance_payment_intent_id')
stripeDepositChargeId: text('stripe_deposit_charge_id')
stripeBalanceChargeId: text('stripe_balance_charge_id')
stripeRefundId: text('stripe_refund_id')
paymentMetadata: text('payment_metadata', { mode: 'json' })
```

---

## 🔧 CORE PAYMENT SERVICE

### **File:** [src/lib/stripe-booking-payments.ts](src/lib/stripe-booking-payments.ts)

**Features:**
- ✅ Customer management (create or retrieve)
- ✅ Payment intent creation for deposit & balance
- ✅ Payment confirmation with auto-booking status update
- ✅ Payment failure handling with logging
- ✅ Refund creation (full or partial)
- ✅ Payment details retrieval

**Functions:**
```typescript
// Customer Management
getOrCreateBookingCustomer(params) → string (customerId)

// Payment Intent Creation
createBookingPaymentIntent(params) → PaymentIntentResult
  - Handles deposit and balance separately
  - Creates Stripe customer if needed
  - Stores payment intent ID in booking
  - Includes booking metadata

// Payment Confirmation
confirmBookingPayment(paymentIntentId) → { success, bookingId, paymentType }
  - Verifies payment succeeded
  - Updates depositPaid/balancePaid
  - Auto-confirms booking when deposit paid
  - Logs payment in admin notes

// Payment Failure
handlePaymentFailure(paymentIntentId, reason?) → void
  - Logs failure in booking admin notes
  - Records failure reason

// Refunds
createBookingRefund(params) → RefundResult
  - Full or partial refunds
  - Updates booking with refund ID
  - Logs refund in admin notes

// Payment Details
getBookingPaymentDetails(bookingId) → { deposit, balance, refunds }
```

---

## 🌐 API ENDPOINTS

### 1. **POST /api/bookings/[id]/payment** ✅
Create payment intent for deposit or balance

**Authentication:** Required (logged-in user)

**Request Body:**
```json
{
  "paymentType": "deposit" // or "balance"
}
```

**Response:**
```json
{
  "success": true,
  "paymentIntent": {
    "id": "pi_xxx",
    "clientSecret": "pi_xxx_secret_xxx",
    "amount": 178.75,
    "currency": "gbp",
    "customerId": "cus_xxx"
  },
  "bookingDetails": {
    "id": 123,
    "propertyName": "The Brighton Manor",
    "checkInDate": "2025-12-20",
    "checkOutDate": "2025-12-27",
    "guestName": "John Smith",
    "paymentType": "deposit",
    "amountDue": 178.75
  }
}
```

**Validation:**
- ✅ Booking must exist and not be cancelled/completed
- ✅ Payment not already made
- ✅ Deposit must be paid before balance
- ✅ Valid payment amount

---

### 2. **GET /api/bookings/[id]/payment** ✅
Get payment status and details

**Response:**
```json
{
  "bookingId": 123,
  "paymentStatus": {
    "deposit": {
      "amount": 178.75,
      "paid": true,
      "paymentIntentId": "pi_xxx",
      "chargeId": "ch_xxx"
    },
    "balance": {
      "amount": 536.25,
      "paid": false,
      "paymentIntentId": null,
      "chargeId": null
    },
    "total": 715.00,
    "refundId": null
  },
  "stripeCustomerId": "cus_xxx"
}
```

---

### 3. **POST /api/bookings/[id]/refund** ✅
Create refund for booking (owner/admin only)

**Authorization:** Owner or Admin

**Request Body:**
```json
{
  "amount": 178.75, // Optional: omit for full refund
  "reason": "Guest cancellation due to emergency"
}
```

**Response:**
```json
{
  "success": true,
  "refund": {
    "refundId": "re_xxx",
    "amount": 178.75,
    "status": "succeeded",
    "currency": "GBP"
  },
  "booking": {
    "id": 123,
    "status": "cancelled" // Auto-cancelled if full refund
  },
  "message": "Refund of £178.75 processed successfully"
}
```

**Features:**
- ✅ Full or partial refunds
- ✅ Auto-cancels booking on full refund
- ✅ Validates refund amount doesn't exceed payment
- ✅ Prevents duplicate refunds

---

### 4. **GET /api/bookings/[id]/refund** ✅
Get refund status and refundable amount

**Response:**
```json
{
  "bookingId": 123,
  "refundStatus": {
    "hasRefund": false,
    "refundId": null,
    "refundableAmount": 715.00,
    "currency": "GBP"
  },
  "paymentStatus": {
    "depositPaid": true,
    "depositAmount": 178.75,
    "balancePaid": true,
    "balanceAmount": 536.25,
    "totalPaid": 715.00
  },
  "bookingStatus": "confirmed"
}
```

---

### 5. **POST /api/webhooks/booking-payments** ✅
Stripe webhook handler for booking payments

**Webhook Events Handled:**
- ✅ `payment_intent.succeeded` - Confirms payment, updates booking
- ✅ `payment_intent.payment_failed` - Logs failure
- ✅ `charge.succeeded` - Backup confirmation
- ✅ `charge.failed` - Logs charge failure
- ✅ `charge.refunded` - Logs refund confirmation

**Features:**
- ✅ Webhook signature verification
- ✅ Auto-booking confirmation when deposit paid
- ✅ Payment failure logging
- ✅ Comprehensive event handling

---

## 🔄 PAYMENT WORKFLOW

### **Deposit Payment Flow**
```
1. User creates booking (status: pending)
   ↓
2. Frontend calls POST /api/bookings/[id]/payment with paymentType: "deposit"
   ↓
3. Backend creates Stripe payment intent
   ↓
4. Frontend displays Stripe payment UI with clientSecret
   ↓
5. Guest enters payment details
   ↓
6. Stripe processes payment
   ↓
7. Webhook: payment_intent.succeeded
   ↓
8. Backend confirms payment:
   - Sets depositPaid = true
   - Stores charge ID
   - Auto-changes status: pending → confirmed
   - Logs in admin notes
   ↓
9. Guest receives confirmation
```

### **Balance Payment Flow**
```
1. Booking status: confirmed (deposit paid)
   ↓
2. Guest initiates balance payment (6 weeks before check-in)
   ↓
3. Frontend calls POST /api/bookings/[id]/payment with paymentType: "balance"
   ↓
4. Backend validates deposit is paid
   ↓
5. Creates Stripe payment intent for balance
   ↓
6. Guest completes payment
   ↓
7. Webhook: payment_intent.succeeded
   ↓
8. Backend confirms payment:
   - Sets balancePaid = true
   - Stores charge ID
   - Logs in admin notes
   ↓
9. Booking fully paid
```

### **Refund Flow**
```
1. Owner/Admin cancels booking
   ↓
2. Backend calls POST /api/bookings/[id]/refund
   ↓
3. Backend validates refund eligibility
   ↓
4. Creates Stripe refund (full or partial)
   ↓
5. Updates booking:
   - Stores refund ID
   - Auto-cancels if full refund
   - Logs in admin notes
   ↓
6. Webhook: charge.refunded (confirmation)
   ↓
7. Guest receives refund notification from Stripe
```

---

## 🔐 SECURITY FEATURES

### Authentication & Authorization
- ✅ Payment creation requires authentication
- ✅ Refunds require owner/admin role
- ✅ Webhook signature verification

### Validation
- ✅ Booking status validation
- ✅ Payment already made check
- ✅ Deposit before balance enforcement
- ✅ Refund amount validation
- ✅ Duplicate refund prevention

### Data Integrity
- ✅ Payment intent ID stored before payment
- ✅ Charge ID stored after success
- ✅ Metadata includes booking details
- ✅ All updates logged with UK timestamps

---

## 💰 PRICING & FEES

### Current Configuration
- **Currency:** GBP (British Pounds)
- **Deposit:** 25% of total price
- **Balance:** 75% of total price
- **Cleaning Fee:** £50 (standard)
- **Security Deposit:** £500 (refundable, NOT charged)
- **Service Fee:** £0 (can be configured)
- **Taxes:** 0% (UK accommodation typically VAT exempt)

### Stripe Fees (Not charged to guest)
- **Standard cards:** 1.4% + 20p per transaction
- **Platform handles:** All Stripe fees

---

## 🧪 TESTING

### Test Card Numbers (Stripe Test Mode)
```
SUCCESS:
4242 4242 4242 4242 - Visa (succeeds immediately)

FAILURE:
4000 0000 0000 0002 - Card declined
4000 0000 0000 9995 - Insufficient funds

AUTHENTICATION REQUIRED:
4000 0025 0000 3155 - Requires 3D Secure
```

### Test Deposit Payment
```bash
# 1. Create payment intent
curl -X POST http://localhost:3000/api/bookings/123/payment \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{"paymentType": "deposit"}'

# 2. Use clientSecret with Stripe.js on frontend

# 3. After payment, check status
curl http://localhost:3000/api/bookings/123/payment
```

### Test Refund
```bash
# Full refund
curl -X POST http://localhost:3000/api/bookings/123/refund \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-auth-cookie" \
  -d '{"reason": "Guest cancellation"}'

# Partial refund
curl -X POST http://localhost:3000/api/bookings/123/refund \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-auth-cookie" \
  -d '{"amount": 100, "reason": "Partial refund"}'
```

---

## 📊 WEBHOOK CONFIGURATION

### Stripe Dashboard Setup
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/booking-payments`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
   - `charge.failed`
   - `charge.refunded`
4. Copy webhook secret to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### Local Testing with Stripe CLI
```bash
# Forward webhooks to local server
stripe listen --forward-to http://localhost:3000/api/webhooks/booking-payments

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

---

## 📁 FILES CREATED

1. **src/lib/stripe-booking-payments.ts** (510 lines)
   - Core payment service
   - Customer management
   - Payment intents
   - Refunds

2. **src/app/api/bookings/[id]/payment/route.ts** (172 lines)
   - Payment creation endpoint
   - Payment status endpoint

3. **src/app/api/bookings/[id]/refund/route.ts** (201 lines)
   - Refund creation endpoint
   - Refund status endpoint

4. **src/app/api/webhooks/booking-payments/route.ts** (339 lines)
   - Webhook event handler
   - Payment success/failure handling
   - Refund confirmation

**Total:** ~1,222 lines of production code

---

## ✅ INTEGRATION POINTS

### With Existing Systems

**Booking System:**
- ✅ Links to booking records via `bookingId`
- ✅ Auto-confirms booking on deposit payment
- ✅ Updates `depositPaid` and `balancePaid` flags
- ✅ Stores payment intent and charge IDs

**Status Lifecycle:**
- ✅ Auto-transitions: pending → confirmed (on deposit paid)
- ✅ Auto-cancels on full refund
- ✅ Logs all payment events in admin notes

**Existing Stripe Setup:**
- ✅ Uses same Stripe instance and configuration
- ✅ Separate webhook endpoint for bookings
- ✅ Doesn't interfere with subscription billing

---

## 🚫 NOT IMPLEMENTED (Frontend)

As requested, **NO UI components** were created:

❌ Payment form UI  
❌ Stripe Elements integration  
❌ Payment success/failure pages  
❌ Refund management UI  
❌ Payment history display  

These will be implemented when UI work is requested.

---

## 📋 NEXT STEPS (Awaiting Instructions)

**Recommended:**
1. **Frontend Payment UI** - Stripe Elements integration for checkout
2. **Email Notifications** - Payment confirmation, receipts
3. **Owner Payment Dashboard** - View payments and issue refunds
4. **Guest Payment Portal** - View payment status, make balance payments
5. **Automated Reminders** - Balance payment due reminders

**Ready for:** STEP 2.3 or any other phase.

---

**Status:** ✅ STEP 2.2 COMPLETE - Stripe payment integration for bookings fully implemented and production-ready.
