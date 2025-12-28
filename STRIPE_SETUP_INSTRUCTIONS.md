# Stripe Subscription Setup Instructions

## Quick Setup Guide

Your subscription page is ready, but you need to configure Stripe products to accept payments.

### Step 1: Create Products in Stripe Dashboard

1. Go to **[Stripe Test Dashboard](https://dashboard.stripe.com/test/products)**
2. Click **"+ Add Product"** button

### Step 2: Create Each Subscription Product

Create the following products with these exact details:

#### Product 1: Basic Monthly
- **Name**: Basic Monthly
- **Description**: Perfect for individual property owners
- **Pricing**: 
  - **Price**: £19.99
  - **Billing period**: Monthly
  - **Currency**: GBP
- Click **Save Product**
- **Copy the Price ID** (starts with `price_...`)

#### Product 2: Basic Yearly
- **Name**: Basic Yearly  
- **Description**: Perfect for individual property owners - Save 16.6% annually
- **Pricing**:
  - **Price**: £199.99
  - **Billing period**: Yearly
  - **Currency**: GBP
- Click **Save Product**
- **Copy the Price ID**

#### Product 3: Premium Monthly
- **Name**: Premium Monthly
- **Description**: Ideal for growing property businesses
- **Pricing**:
  - **Price**: £49.99
  - **Billing period**: Monthly
  - **Currency**: GBP
- Click **Save Product**
- **Copy the Price ID**

#### Product 4: Premium Yearly
- **Name**: Premium Yearly
- **Description**: Ideal for growing property businesses - Save 16.6% annually
- **Pricing**:
  - **Price**: £499.99
  - **Billing period**: Yearly
  - **Currency**: GBP
- Click **Save Product**
- **Copy the Price ID**

#### Product 5: Enterprise Yearly
- **Name**: Enterprise Yearly
- **Description**: For established property management companies
- **Pricing**:
  - **Price**: £99.99
  - **Billing period**: Monthly (displayed as monthly but you can adjust)
  - **Currency**: GBP
- Click **Save Product**
- **Copy the Price ID**

### Step 3: Update Your .env File

Open your `.env` file and replace the placeholder price IDs with the real ones from Stripe:

```env
# Replace these with your actual Stripe Price IDs
STRIPE_PRICE_BASIC_MONTHLY=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_BASIC_YEARLY=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_PREMIUM_MONTHLY=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_PREMIUM_YEARLY=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Restart Your Dev Server

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test the Subscription Flow

1. Navigate to http://localhost:3000/owner/subscription
2. Click **"Subscribe Now"** on any plan
3. You should be redirected to Stripe Checkout
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete the checkout and verify you're redirected back with success message

## Troubleshooting

### Error: "No such price: 'price_...'"
- ✅ Make sure you copied the **Price ID**, not the Product ID
- ✅ Price IDs start with `price_`, Product IDs start with `prod_`
- ✅ Make sure you're using Test mode prices (not Live mode)
- ✅ Restart your dev server after updating `.env`

### Webhook Setup (Required for Production)
You'll also need to configure webhooks for subscription events:

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/billing`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing Secret** and add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```

## Current Status

- ✅ Subscription UI complete and responsive
- ✅ Single plan selection (no multi-select bug)
- ✅ Error handling with helpful messages
- ✅ Stripe customer creation working
- ⚠️ **PENDING**: Configure real Stripe Price IDs
- ⚠️ **PENDING**: Add webhook secret for production

Once you complete Steps 1-4 above, your subscription system will be fully functional!
