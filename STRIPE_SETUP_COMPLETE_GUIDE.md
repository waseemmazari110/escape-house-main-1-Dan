# 🎯 STRIPE PAYMENT SETUP - COMPLETE GUIDE

## 🚨 CRITICAL ISSUE: Invalid Price IDs

**Current Error:**
```
Error creating checkout session: No such price: 'price_1QkqPGIakKHMdeEkdLJRMN0D'
```

**Problem:** The Price IDs in your `.env` file don't exist in your Stripe account. These are example IDs and need to be replaced with REAL ones from YOUR Stripe dashboard.

---

## ✅ STEP-BY-STEP STRIPE SETUP

### Step 1: Create Stripe Products (Required!)

1. **Login to Stripe Dashboard**
   - Test Mode: https://dashboard.stripe.com/test/products
   - Live Mode: https://dashboard.stripe.com/products

2. **Create Each Product**

   #### Product 1: Basic Monthly
   - Click "+ Add product"
   - Name: `Basic Monthly Plan`
   - Description: `Perfect for individual property owners`
   - Pricing model: `Standard pricing`
   - Price: `£19.99`
   - Billing period: `Monthly`
   - Click "Save product"
   - **COPY THE PRICE ID** (starts with `price_`)

   #### Product 2: Basic Yearly
   - Name: `Basic Yearly Plan`
   - Description: `Save 16.6% with annual billing`
   - Price: `£199.99`
   - Billing period: `Yearly`
   - **COPY THE PRICE ID**

   #### Product 3: Premium Monthly
   - Name: `Premium Monthly Plan`
   - Description: `Ideal for growing property businesses`
   - Price: `£49.99`
   - Billing period: `Monthly`
   - **COPY THE PRICE ID**

   #### Product 4: Premium Yearly
   - Name: `Premium Yearly Plan`
   - Description: `Save 16.6% with annual billing`
   - Price: `£499.99`
   - Billing period: `Yearly`
   - **COPY THE PRICE ID**

   #### Product 5: Enterprise Yearly
   - Name: `Enterprise Yearly Plan`
   - Description: `For established property management companies`
   - Price: `£999.99`
   - Billing period: `Yearly`
   - **COPY THE PRICE ID**

---

### Step 2: Update .env File

Replace the example Price IDs with YOUR actual Price IDs:

```bash
# REPLACE THESE WITH YOUR ACTUAL STRIPE PRICE IDs
STRIPE_PRICE_BASIC_MONTHLY=price_YOUR_ACTUAL_ID_HERE
STRIPE_PRICE_BASIC_YEARLY=price_YOUR_ACTUAL_ID_HERE
STRIPE_PRICE_PREMIUM_MONTHLY=price_YOUR_ACTUAL_ID_HERE
STRIPE_PRICE_PREMIUM_YEARLY=price_YOUR_ACTUAL_ID_HERE
STRIPE_PRICE_ENTERPRISE_YEARLY=price_YOUR_ACTUAL_ID_HERE
```

**Example (with real IDs):**
```bash
STRIPE_PRICE_BASIC_MONTHLY=price_1QkZXaIakKHMdeEkABCD1234
STRIPE_PRICE_BASIC_YEARLY=price_1QkZXbIakKHMdeEkEFGH5678
STRIPE_PRICE_PREMIUM_MONTHLY=price_1QkZXcIakKHMdeEkIJKL9012
STRIPE_PRICE_PREMIUM_YEARLY=price_1QkZXdIakKHMdeEkMNOP3456
STRIPE_PRICE_ENTERPRISE_YEARLY=price_1QkZXeIakKHMdeEkQRST7890
```

---

### Step 3: Configure Webhooks

**Why Webhooks?** Webhooks tell your app when subscriptions are created, payments succeed/fail, etc.

#### A. For Development (Using Stripe CLI)

1. **Install Stripe CLI**
   ```bash
   # Windows (with Scoop)
   scoop install stripe
   
   # Or download from:
   https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward Webhooks to Local Server**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/billing
   ```

4. **Copy the Webhook Signing Secret**
   - The CLI will display a secret like: `whsec_xxxxxxxxxxxxx`
   - Update your `.env`:
     ```bash
     STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
     ```

#### B. For Production

1. **Go to Stripe Dashboard**
   - https://dashboard.stripe.com/webhooks

2. **Add Endpoint**
   - Click "+ Add endpoint"
   - Endpoint URL: `https://yourdomain.com/api/webhooks/billing`
   - Select events:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.paid`
     - ✅ `invoice.payment_failed`

3. **Copy Signing Secret**
   - After creating, click on the webhook
   - Click "Reveal" under "Signing secret"
   - Update your production `.env`:
     ```bash
     STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
     ```

---

### Step 4: Get Your Stripe API Keys

1. **Go to Stripe Dashboard**
   - Test Keys: https://dashboard.stripe.com/test/apikeys
   - Live Keys: https://dashboard.stripe.com/apikeys

2. **Copy Your Keys**
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

3. **Update .env**
   ```bash
   # Test Mode (for development)
   STRIPE_TEST_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
   
   # Live Mode (for production)
   STRIPE_LIVE_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxx
   STRIPE_SECRET_ID=sk_live_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

### Step 5: Restart Your Server

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

---

## 🔍 TESTING YOUR SETUP

### Test Cards (Test Mode Only)

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Successful payment |
| `4000 0025 0000 3155` | ✅ Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | ❌ Card declined |
| `4000 0000 0000 0002` | ❌ Card declined - insufficient funds |

**Details:**
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Test Flow

1. **Go to Subscription Page**
   ```
   http://localhost:3000/owner/subscription
   ```

2. **Click "Subscribe Now"**
   - Choose any plan (e.g., Basic Monthly)

3. **Fill Stripe Checkout**
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `123`
   - ZIP: `12345`

4. **Verify Success**
   - Should redirect back to subscription page
   - Should show "Subscription Activated!" notification
   - Only the selected plan should be active

5. **Check Webhook Logs**
   - In Stripe CLI terminal, you should see:
     ```
     checkout.session.completed
     customer.subscription.created
     invoice.paid
     ```

---

## 🐛 TROUBLESHOOTING

### Issue 1: "No such price" Error

**Cause:** Price IDs in `.env` don't exist in Stripe

**Solution:**
1. Go to Stripe Dashboard → Products
2. Click on each product
3. Copy the ACTUAL Price ID
4. Update `.env` file
5. Restart server

---

### Issue 2: Webhook Not Firing

**In Development:**
```bash
# Make sure Stripe CLI is running
stripe listen --forward-to localhost:3000/api/webhooks/billing
```

**In Production:**
1. Check webhook URL is correct
2. Verify endpoint is publicly accessible
3. Check Stripe Dashboard → Webhooks → Recent deliveries

---

### Issue 3: Multiple Subscriptions Created

**This happens when:**
- Webhook secret is missing or incorrect
- `checkout.session.completed` event isn't configured

**Solution:**
1. Ensure webhook secret is in `.env`
2. Verify webhook includes `checkout.session.completed` event
3. Check webhook handler is processing events correctly

---

### Issue 4: Unauthorized Error

**Cause:** Not logged in or session expired

**Solution:**
1. Log out and log back in
2. Clear browser cookies
3. Check session table in database

---

## 📋 CONFIGURATION CHECKLIST

Before going live, ensure:

- [ ] Created all 5 products in Stripe Dashboard
- [ ] Copied all Price IDs to `.env`
- [ ] Updated webhook endpoint URL
- [ ] Configured webhook events (especially `checkout.session.completed`)
- [ ] Copied webhook signing secret to `.env`
- [ ] Tested with test cards
- [ ] Verified only one subscription creates per checkout
- [ ] Checked webhook logs are showing events
- [ ] Tested subscription cancellation
- [ ] Tested subscription reactivation

---

## 🔐 SECURITY BEST PRACTICES

### 1. Never Commit Secrets
```bash
# .env should be in .gitignore
echo ".env" >> .gitignore
```

### 2. Use Environment Variables
```bash
# Development
STRIPE_TEST_KEY=sk_test_xxxxx

# Production
STRIPE_LIVE_KEY=sk_live_xxxxx
```

### 3. Validate Webhook Signatures
```typescript
// Already implemented in src/lib/stripe-billing.ts
const event = stripe.webhooks.constructEvent(
  payload,
  signature,
  webhookSecret
);
```

### 4. Use HTTPS in Production
```bash
# Production webhook URL must use HTTPS
https://yourdomain.com/api/webhooks/billing
```

---

## 🎯 WHAT YOU NEED TO DO RIGHT NOW

1. **Create Stripe Products**
   - Go to: https://dashboard.stripe.com/test/products
   - Create 5 products (as described in Step 1)
   - Copy each Price ID

2. **Update .env File**
   - Open: `e:\escape-houses-1-main\.env`
   - Replace example Price IDs with YOUR actual IDs
   - Save file

3. **Restart Server**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

4. **Test Subscription**
   - Go to: http://localhost:3000/owner/subscription
   - Click Subscribe Now on Basic Monthly
   - Use test card: 4242 4242 4242 4242
   - Verify it works

---

## 📞 NEED HELP?

### Stripe Resources
- Dashboard: https://dashboard.stripe.com
- Documentation: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Test Cards: https://stripe.com/docs/testing

### Common Errors
- **401 Unauthorized:** Not logged in or session expired
- **404 Not Found:** API route doesn't exist
- **500 Internal Server Error:** Server-side error (check logs)
- **No such price:** Price ID doesn't exist in Stripe

---

**Last Updated:** December 24, 2025
**Status:** Requires Stripe Product Configuration
