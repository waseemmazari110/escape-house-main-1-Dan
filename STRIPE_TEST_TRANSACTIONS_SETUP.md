# Stripe Test Transactions - Complete Setup Guide

## ✅ What's Been Configured

### 1. Environment Variables Updated
- ✅ `STRIPE_TEST_KEY` - Your new test secret key
- ✅ `STRIPE_PUBLISH_KEY` - Your test publishable key  
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Added for frontend
- ✅ `NEXT_PUBLIC_APP_URL=http://localhost:3000` - Local redirects
- ✅ `STRIPE_WEBHOOK_SECRET` - For webhook signature verification

### 2. Payment Tracking Enhanced
Updated [src/app/api/subscriptions/checkout-session/route.ts](src/app/api/subscriptions/checkout-session/route.ts) to include `payment_intent_data` with userId metadata:

```typescript
payment_intent_data: {
  metadata: {
    userId: session.user.id,
    userName: session.user.name || '',
    userEmail: session.user.email || '',
    planId: plan.id,
    tier: plan.tier,
  },
}
```

**This ensures ALL payment intents created from checkout include userId!**

---

## 🎯 How It Works Now

When an owner makes a Stripe payment:

1. **Checkout Session Created** → Includes userId in `payment_intent_data.metadata`
2. **Payment Completed** → Stripe webhook fires `payment_intent.succeeded`
3. **Webhook Received** → [/api/webhooks/billing](src/app/api/webhooks/billing/route.ts) processes it
4. **Payment Saved** → `createOrUpdatePayment()` extracts userId and saves to database
5. **Admin Dashboard** → Transaction appears in [Transactions tab](src/components/admin/Transactions.tsx)

---

## 🔧 Testing Your Setup

### Method 1: Make a Real Test Payment (Recommended)

1. **Login as an owner**:
   ```
   http://localhost:3000/owner/dashboard
   ```

2. **Navigate to Subscriptions**:
   ```
   http://localhost:3000/owner/subscription
   ```

3. **Select a plan** (Basic, Premium, or Enterprise)

4. **Use Stripe test card**:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

5. **Complete payment** → You'll be redirected back to owner dashboard

6. **Check admin dashboard**:
   ```
   http://localhost:3000/admin/dashboard
   ```
   Click "Transactions" tab → Your test payment should appear!

---

### Method 2: Configure Stripe Webhook (For Production)

#### Step 1: Install Stripe CLI

**Windows (PowerShell):**
```powershell
# Download from: https://github.com/stripe/stripe-cli/releases/latest
# Or use Scoop:
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Verify installation:**
```powershell
stripe --version
```

#### Step 2: Login to Stripe CLI

```powershell
stripe login
```

This will open your browser to authenticate.

#### Step 3: Forward Webhooks to Local Server

```powershell
stripe listen --forward-to localhost:3000/api/webhooks/billing
```

**Output will show:**
```
> Ready! Your webhook signing secret is whsec_xxxxx
```

**Copy the signing secret** and update your `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Replace with your secret
```

**Keep the terminal running!** This forwards all Stripe events to your local server.

#### Step 4: Test Payment

In another terminal, trigger a test event:
```powershell
stripe trigger payment_intent.succeeded
```

Or make a real payment through your app.

#### Step 5: Verify in Admin Dashboard

Check logs in the terminal running `stripe listen`:
```
[✓] payment_intent.succeeded [evt_xxxxx]
```

Check admin dashboard for new transaction.

---

### Method 3: Quick SQL Test Data

If you just want to see the UI working without payments:

1. **Open Drizzle Studio**:
   ```powershell
   npx drizzle-kit studio
   ```

2. **Run this SQL**:
   ```sql
   INSERT INTO payments (
     id, userId, amount, currency, paymentStatus,
     stripePaymentIntentId, paymentMethod, paymentMethodBrand,
     paymentMethodLast4, description, createdAt, updatedAt
   )
   SELECT 
     'test_payment_' || hex(randomblob(8)),
     (SELECT id FROM user WHERE role = 'owner' LIMIT 1),
     29.99,
     'GBP',
     'succeeded',
     'pi_test_' || hex(randomblob(8)),
     'card',
     'Visa',
     '4242',
     'Premium Monthly Subscription - Test',
     datetime('now'),
     datetime('now')
   FROM (SELECT 1)
   WHERE EXISTS (SELECT 1 FROM user WHERE role = 'owner');
   ```

3. **Refresh admin dashboard** → Transaction appears!

---

## 🔍 Verifying Transactions Are Being Saved

### Check Server Logs

When a payment is processed, you should see:
```
[DD/MM/YYYY HH:mm:ss] Stripe Billing: Creating/updating payment record
[DD/MM/YYYY HH:mm:ss] Stripe Billing: Payment succeeded and tracked
```

If userId is missing:
```
[DD/MM/YYYY HH:mm:ss] Stripe Billing: Payment succeeded but no userId found
```

### Check Database Directly

```sql
SELECT 
  id,
  userId,
  amount,
  currency,
  paymentStatus,
  stripePaymentIntentId,
  description,
  createdAt
FROM payments
ORDER BY createdAt DESC
LIMIT 10;
```

### Check Admin Dashboard

1. Login as admin: `http://localhost:3000/admin/dashboard`
2. Click "Transactions" tab
3. Should see:
   - User name and email
   - Amount in GBP
   - Payment status badge
   - Payment method (Visa/Mastercard/etc.)
   - Date and time

---

## 🎨 Admin Transactions Dashboard Features

### Filters
- **All** - Show all transactions
- **Succeeded** - Only successful payments
- **Pending** - Payments in progress
- **Failed** - Failed payments
- **Refunded** - Refunded payments
- **Canceled** - Canceled payments

### Search
Search by:
- User name
- User email
- Payment ID

### Revenue Summary
- Total Revenue (all succeeded payments)
- Total Pending
- Total Failed
- Total Refunded

### Responsive Design
- Mobile: Shows User, Amount, Status
- Tablet: + Payment Method
- Desktop: + Date

---

## 🐛 Troubleshooting

### Issue: Transactions Not Appearing

**Check 1: Webhook Secret**
```powershell
# Verify in .env
echo $env:STRIPE_WEBHOOK_SECRET
```

**Check 2: Server Logs**
Look for: "Payment record skipped - no userId"
- If you see this, the payment didn't have userId in metadata
- Solution: Make sure you're using the updated checkout code

**Check 3: Stripe Dashboard**
- Go to Stripe Dashboard → Developers → Events
- Find recent `payment_intent.succeeded` event
- Check metadata → Should have `userId`

**Check 4: Database**
```sql
SELECT COUNT(*) FROM payments;
```

If 0, payments aren't being saved. Check webhook configuration.

### Issue: Webhook Signature Invalid

**Solution:** Update `STRIPE_WEBHOOK_SECRET` in `.env` with the correct value from:
- Stripe Dashboard → Developers → Webhooks → Signing secret
- Or from `stripe listen` output

### Issue: Payment Redirects to Vercel

**Solution:** Already fixed! `.env` now has:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 What Gets Tracked

Every payment stores:
- ✅ User ID, name, email
- ✅ Amount and currency
- ✅ Payment status (succeeded, pending, failed, refunded, canceled)
- ✅ Payment method (card, bank, etc.)
- ✅ Card brand (Visa, Mastercard, Amex)
- ✅ Last 4 digits of card
- ✅ Description
- ✅ Receipt URL
- ✅ Stripe payment intent ID
- ✅ Stripe charge ID
- ✅ Invoice ID (if from subscription)
- ✅ Subscription ID (if from subscription)
- ✅ Refund info (if refunded)
- ✅ Failure reason (if failed)
- ✅ Risk score and level
- ✅ Created and updated timestamps

---

## 🚀 Next Steps

1. **Test the payment flow**:
   - Login as owner
   - Subscribe to a plan
   - Use test card: 4242 4242 4242 4242
   - Complete payment
   - Check admin dashboard

2. **Set up webhook for production** (when deploying):
   - Add webhook endpoint in Stripe Dashboard
   - Use production URL: `https://yourdomain.com/api/webhooks/billing`
   - Select events: `payment_intent.succeeded`, `charge.succeeded`, `invoice.paid`
   - Copy webhook secret to production `.env`

3. **Monitor transactions**:
   - Admin dashboard → Transactions
   - Filter by status
   - Search by user
   - Export data (future feature)

---

## 📝 Files Modified

1. **[.env](.env)** - Added `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. **[src/app/api/subscriptions/checkout-session/route.ts](src/app/api/subscriptions/checkout-session/route.ts)** - Added `payment_intent_data` with userId

## 📄 Related Documentation

- **[STRIPE_TRANSACTIONS_FIX.md](STRIPE_TRANSACTIONS_FIX.md)** - Why transactions weren't showing
- **[ADMIN_DASHBOARD_FIXES_COMPLETE_SUMMARY.md](ADMIN_DASHBOARD_FIXES_COMPLETE_SUMMARY.md)** - CSS fixes and overview
- **[TRANSACTIONS_FIX_SUMMARY.md](TRANSACTIONS_FIX_SUMMARY.md)** - Responsive design details

---

## ✅ Summary

**Everything is now configured!** Your Stripe test payments will automatically:
1. Include userId in metadata
2. Get captured by webhook
3. Be saved to database
4. Appear in admin transactions dashboard

**Test it now:**
```
http://localhost:3000/owner/subscription
```

Use card: `4242 4242 4242 4242` and check the admin dashboard!

---

*Last Updated: December 28, 2025*  
*Server: http://localhost:3000 ✅ Running*
