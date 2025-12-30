# Subscription Checkout - Error Reference Guide

## Common Error Messages & Solutions

### ❌ "Checkout not available" (HTTP 503)

```json
{
  "error": "Checkout not available",
  "message": "Subscription plan \"Basic Monthly\" is not yet available. Please contact support...",
  "details": "Plan ID: basic_monthly, Tier: basic, Interval: monthly"
}
```

**Root Cause**: Stripe Price ID is missing or invalid

**Solution**:
```env
# Check your .env.local for:
STRIPE_PRICE_BASIC_MONTHLY=price_1Abc123Def456

# If empty or not set, add the actual Stripe Price ID
```

Run diagnostic:
```bash
npx tsx check-stripe-setup.ts
```

---

### ❌ "Failed to create checkout session"

**Frontend Error**:
```
Subscription error: Error: Failed to create checkout session
```

**Root Causes**:
1. Network error - API endpoint unreachable
2. Invalid plan ID submitted
3. User not authenticated

**Solutions**:

Option A - Check authentication:
```typescript
// In browser console:
await authClient.getSession()
// Should return user object with id, email, name
```

Option B - Check plan ID is valid:
```typescript
// Valid plan IDs:
- basic_monthly
- basic_yearly
- premium_monthly
- premium_yearly
- enterprise_monthly
- enterprise_yearly
- test_basic
- test_basic2
```

Option C - Check Stripe Price IDs:
```bash
npx tsx check-stripe-setup.ts
```

---

### ❌ "Invalid Stripe Price ID" (in console logs)

```
[20:50:04] ERROR [Better Auth]: Invalid password
```

This is a **misleading error message**. The actual issue is:

**Real Problem**: Stripe Price ID validation failed

**Solution**: Add proper Stripe Price IDs to `.env.local`

---

### ❌ "Unauthorized" (HTTP 401)

```json
{
  "error": "Unauthorized"
}
```

**Root Cause**: User is not logged in

**Solution**: 
1. Navigate to `/owner/login`
2. Log in with valid credentials
3. Then access `/owner/subscription`

---

### ✅ Success Response (HTTP 200)

```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8",
  "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8",
  "timestamp": "29/12/2025 20:50:30"
}
```

**What Happens Next**:
1. Frontend redirects to `url`
2. User sees Stripe Checkout page
3. User enters payment details
4. After payment, redirected back to app with `?success=true`

---

## Diagnostic Commands

### Check Stripe Configuration

```bash
# Show all Stripe env vars status
npx tsx check-stripe-setup.ts
```

Output:
```
✅ CONFIGURED  STRIPE_PRICE_BASIC_MONTHLY
               Value: price_1Abc123Def456

❌ NOT SET     STRIPE_PRICE_BASIC_YEARLY
```

### Check User Authentication

Browser Console:
```javascript
// Copy-paste this:
await authClient.getSession().then(s => console.log(JSON.stringify(s.data, null, 2)))
```

Expected Output:
```json
{
  "user": {
    "id": "user_abc123",
    "email": "owner@example.com",
    "name": "Owner Name",
    "role": "owner"
  },
  "session": "..."
}
```

### Check API Response

Browser Network Tab:
1. Click "Subscribe Now"
2. Open DevTools → Network tab
3. Look for `checkout-session` request
4. Click it to see Response
5. Check for error message

Example Error Response:
```json
{
  "error": "Checkout not available",
  "message": "Subscription plan \"Basic Monthly\" is not yet available...",
  "details": "Plan ID: basic_monthly"
}
```

---

## Step-by-Step Debugging

### 1. Is the user logged in?

```javascript
// Browser console:
const session = await authClient.getSession();
if (!session?.data?.user) {
  console.log("❌ NOT LOGGED IN - redirect to /owner/login");
} else {
  console.log("✅ LOGGED IN as:", session.data.user.email);
}
```

### 2. Are Stripe Price IDs configured?

```bash
npx tsx check-stripe-setup.ts
```

If any show `❌ NOT SET` or `⚠️ INVALID FORMAT`, fix `.env.local`

### 3. Is the checkout endpoint responding?

```javascript
// Browser console:
const response = await fetch('/api/subscriptions/checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ planId: 'basic_monthly' })
});
const data = await response.json();
console.log('Status:', response.status);
console.log('Response:', JSON.stringify(data, null, 2));
```

Expected Success:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

---

## Stripe Test Cards

Use these cards for testing (expires: any future date, CVC: any 3 digits):

| Card Number | Type | Behavior |
|---|---|---|
| `4242 4242 4242 4242` | Visa | ✅ Succeeds |
| `4000 0025 0000 3155` | Visa | ❌ Declines |
| `4000 0000 0000 0002` | Visa | ❌ Declines |
| `5555 5555 5555 4444` | Mastercard | ✅ Succeeds |

---

## Common Scenarios

### Scenario: User clicks "Subscribe" but nothing happens

**Debugging**:
1. Check browser console for JS errors
2. Open DevTools Network tab
3. Repeat the click
4. Look for red request - click to see error

**Likely Causes**:
- `Button is disabled` → Already processing
- `No onSubscribe handler` → Component issue
- Network error → Check API logs

### Scenario: Gets "Checkout not available"

**Debugging**:
1. Run: `npx tsx check-stripe-setup.ts`
2. Check output - should show all ✅
3. If not, add missing Stripe Price IDs
4. Restart: `npm run dev`

### Scenario: Redirected to Stripe but card is declined

**Debugging**:
1. Check you're using test card: `4242 4242 4242 4242`
2. Try different card if in test mode
3. Check Stripe Dashboard for payment logs

---

## Files to Check

When debugging, inspect these files:

```
# Subscription Plans Definition
src/lib/subscription-plans.ts
  → Check Plan objects have correct stripePriceId

# Checkout API Endpoint
src/app/api/subscriptions/checkout-session/route.ts
  → Check validation logic

# Frontend Handler
src/app/owner/subscription/page.tsx
  → Check handleSubscribe function

# Environment File
.env.local
  → Check all STRIPE_PRICE_* variables set
```

---

## Support Resources

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe Docs**: https://stripe.com/docs/billing/checkout
- **Check Setup**: Run `npx tsx check-stripe-setup.ts`
- **Setup Guide**: Read `STRIPE_SETUP_GUIDE.md`

---

**Last Updated**: 29 Dec 2025
