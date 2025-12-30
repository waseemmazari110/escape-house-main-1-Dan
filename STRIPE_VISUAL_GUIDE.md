# 🎨 VISUAL STEP-BY-STEP: Create Stripe Products

## 📍 WHERE TO GO

1. Open your browser
2. Go to: **https://dashboard.stripe.com/test/products**
3. Make sure you're in **TEST MODE** (toggle at top)

---

## 🛠️ CREATE PRODUCT 1: Basic Monthly

### Step 1: Click "+ Add product"
```
┌─────────────────────────────────────┐
│  Products                           │
│  ┌───────────────┐                  │
│  │ + Add product │  ← Click here    │
│  └───────────────┘                  │
└─────────────────────────────────────┘
```

### Step 2: Fill in Details
```
┌─────────────────────────────────────┐
│ Product information                 │
│                                     │
│ Name *                              │
│ ┌─────────────────────────────────┐ │
│ │ Basic Monthly Plan              │ │ ← Type this
│ └─────────────────────────────────┘ │
│                                     │
│ Description (optional)              │
│ ┌─────────────────────────────────┐ │
│ │ Perfect for individual property │ │ ← Type this
│ │ owners                          │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Step 3: Set Price
```
┌─────────────────────────────────────┐
│ Pricing                             │
│                                     │
│ Pricing model                       │
│ ● Standard pricing  ○ Custom        │ ← Select Standard
│                                     │
│ Price *                             │
│ ┌───┬─────────────────────────────┐ │
│ │GBP│ 19.99                       │ │ ← Enter 19.99
│ └───┴─────────────────────────────┘ │
│                                     │
│ Billing period                      │
│ ┌─────────────────────────────────┐ │
│ │ Monthly                     ▼   │ │ ← Select Monthly
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Step 4: Save & Copy Price ID
```
┌─────────────────────────────────────┐
│ ┌───────────────┐                   │
│ │ Save product  │  ← Click here     │
│ └───────────────┘                   │
└─────────────────────────────────────┘

After saving, you'll see:

┌─────────────────────────────────────┐
│ Basic Monthly Plan                  │
│                                     │
│ Pricing                             │
│ £19.99 / month                      │
│                                     │
│ API ID: price_1QkZXaIakKHMdeEk... │ ← COPY THIS!
│         └──────────────────────┬──┘ │
│         This is your Price ID  │    │
└─────────────────────────────────────┘
```

**✅ SAVE THIS:** `price_1QkZXaIakKHMdeEk...`

---

## 🔁 REPEAT FOR OTHER PRODUCTS

### Product 2: Basic Yearly
- Name: `Basic Yearly Plan`
- Price: `£199.99`
- Billing: `Yearly`
- Save Price ID

### Product 3: Premium Monthly
- Name: `Premium Monthly Plan`
- Price: `£49.99`
- Billing: `Monthly`
- Save Price ID

### Product 4: Premium Yearly
- Name: `Premium Yearly Plan`
- Price: `£499.99`
- Billing: `Yearly`
- Save Price ID

### Product 5: Enterprise Yearly
- Name: `Enterprise Yearly Plan`
- Price: `£999.99`
- Billing: `Yearly`
- Save Price ID

---

## 📝 UPDATE .ENV FILE

Open `e:\escape-houses-1-main\.env` and update:

```bash
# BEFORE (with example IDs)
STRIPE_PRICE_BASIC_MONTHLY=price_1QkqPGIakKHMdeEkdLJRMN0D
STRIPE_PRICE_BASIC_YEARLY=price_1QkqPGIakKHMdeEk6aK7Z8pB
STRIPE_PRICE_PREMIUM_MONTHLY=price_1QkqQGIakKHMdeEk3xY9JKLM
STRIPE_PRICE_PREMIUM_YEARLY=price_1QkqQGIakKHMdeEkP4N5WXYZ
STRIPE_PRICE_ENTERPRISE_YEARLY=price_1QkqRHIakKHMdeEkQ6M8ABCD

# AFTER (with YOUR actual Price IDs from Stripe)
STRIPE_PRICE_BASIC_MONTHLY=price_YOUR_ACTUAL_ID_HERE
STRIPE_PRICE_BASIC_YEARLY=price_YOUR_ACTUAL_ID_HERE
STRIPE_PRICE_PREMIUM_MONTHLY=price_YOUR_ACTUAL_ID_HERE
STRIPE_PRICE_PREMIUM_YEARLY=price_YOUR_ACTUAL_ID_HERE
STRIPE_PRICE_ENTERPRISE_YEARLY=price_YOUR_ACTUAL_ID_HERE
```

---

## 🔄 RESTART SERVER

In your terminal:
```bash
# Press Ctrl+C to stop the server
# Then run:
npm run dev
```

---

## ✅ CHECKLIST

- [ ] Created Basic Monthly product in Stripe
- [ ] Created Basic Yearly product in Stripe
- [ ] Created Premium Monthly product in Stripe
- [ ] Created Premium Yearly product in Stripe
- [ ] Created Enterprise Yearly product in Stripe
- [ ] Copied all 5 Price IDs
- [ ] Updated .env file with actual Price IDs
- [ ] Saved .env file
- [ ] Restarted development server
- [ ] Tested subscription (use card 4242 4242 4242 4242)

---

## 🎯 VERIFY IT'S WORKING

1. Go to: http://localhost:3000/owner/subscription
2. Click "Subscribe Now" on any plan
3. Should redirect to Stripe Checkout (not show error)
4. Fill in test card: `4242 4242 4242 4242`
5. Complete checkout
6. Should return to your site with success message
7. Only ONE plan should be active

---

## 🚨 IF YOU STILL SEE ERROR

Check your terminal output for:
```
Error creating checkout session: No such price: 'price_xxxxx'
```

If you see this:
1. The Price ID in .env is still wrong
2. Double-check you copied the EXACT Price ID from Stripe
3. Make sure you saved the .env file
4. Make sure you restarted the server

---

**Quick Reference:**
- Products: https://dashboard.stripe.com/test/products
- Price ID format: `price_1Qk...` (starts with "price_")
- Test card: 4242 4242 4242 4242
