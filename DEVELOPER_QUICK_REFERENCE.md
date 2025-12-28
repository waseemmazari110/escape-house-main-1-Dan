# Developer Quick Reference - Subscription & Owner Dashboard

**Quick access to key endpoints, functions, and code examples**

---

## 🔑 Key API Endpoints

### Subscription APIs
```
POST   /api/subscriptions/create                    # Create subscription
GET    /api/subscriptions/current                   # Get current subscription
POST   /api/subscriptions/cancel                    # Cancel subscription
POST   /api/subscriptions/reactivate                # Reactivate suspended
POST   /api/subscriptions/update-payment-method     # Update payment
GET    /api/subscriptions/plans                     # Get all plans
```

### Property Management APIs
```
POST   /api/owner/properties/create                 # Create property
GET    /api/owner/properties                        # List owner properties
GET    /api/owner/properties/[id]                   # Get property details
PUT    /api/owner/properties/[id]                   # Update property
DELETE /api/owner/properties/[id]                   # Delete property
POST   /api/owner/properties/[id]/images            # Add images
POST   /api/owner/properties/[id]/features          # Set features
POST   /api/owner/properties/[id]/pricing           # Add pricing rule
```

### Analytics APIs
```
GET    /api/owner/analytics                         # Get dashboard stats
GET    /api/owner/analytics?includeRevenue=true     # With revenue data
GET    /api/owner/analytics?includeTrends=true      # With trends
GET    /api/owner/analytics?includeComparison=true  # With comparison
```

### Public APIs
```
GET    /api/public/properties                       # List all properties
GET    /api/public/properties/[slug]                # Get by slug
GET    /api/public/availability/[id]                # Check availability
```

### Webhooks
```
POST   /api/webhooks/billing                        # Stripe webhooks
```

---

## 📦 Core Functions

### Subscription Management
```typescript
// Create subscription
import { createSubscription } from '@/lib/stripe-billing';

const result = await createSubscription({
  userId: 'user_123',
  customerId: 'cus_123',
  priceId: 'price_123',
  planName: 'premium',
  planType: 'yearly',
  trialDays: 14
});

// Handle payment failure
import { handlePaymentFailure } from '@/lib/subscription-manager';

await handlePaymentFailure({
  subscriptionId: 'sub_123',
  invoiceId: 'inv_123',
  failureReason: 'card_declined',
  attemptCount: 1
});

// Suspend subscription
import { suspendSubscription } from '@/lib/subscription-manager';

await suspendSubscription(
  'sub_123',
  'Payment failure - all retry attempts exhausted'
);

// Reactivate subscription
import { reactivateSubscription } from '@/lib/subscription-manager';

const result = await reactivateSubscription({
  userId: 'user_123',
  paymentMethodId: 'pm_123'
});
```

### Property Management
```typescript
// Create property
import { createProperty } from '@/lib/property-manager';

const result = await createProperty({
  ownerId: 'user_123',
  title: 'Luxury Cottage',
  slug: 'luxury-cottage',
  location: 'Cotswolds',
  region: 'Cotswolds',
  sleepsMin: 2,
  sleepsMax: 6,
  bedrooms: 3,
  bathrooms: 2,
  priceFromMidweek: 450,
  priceFromWeekend: 550,
  description: 'Beautiful cottage...',
  heroImage: 'https://cdn.com/image.jpg'
});

// Add images
import { addPropertyImages } from '@/lib/property-manager';

await addPropertyImages(123, [
  { imageURL: 'https://...', caption: 'Living room', orderIndex: 0 },
  { imageURL: 'https://...', caption: 'Bedroom', orderIndex: 1 }
]);

// Add features
import { addPropertyFeatures } from '@/lib/property-manager';

await addPropertyFeatures(123, [
  'WiFi',
  'Hot Tub',
  'Parking',
  'Pet Friendly'
]);

// Add pricing
import { addSeasonalPricing } from '@/lib/property-manager';

await addSeasonalPricing({
  propertyId: 123,
  name: 'Summer Peak',
  seasonType: 'peak',
  startDate: '01/06/2026',
  endDate: '31/08/2026',
  pricePerNight: 750,
  dayType: 'any',
  minimumStay: 3
});
```

### Analytics
```typescript
// Get dashboard stats
import { getOwnerDashboardStats } from '@/lib/owner-analytics';

const stats = await getOwnerDashboardStats('user_123');

// Get revenue breakdown
import { getRevenueByMonth } from '@/lib/owner-analytics';

const revenue = await getRevenueByMonth('user_123');

// Get booking trends
import { getBookingTrends } from '@/lib/owner-analytics';

const trends = await getBookingTrends('user_123');

// Compare properties
import { compareOwnerProperties } from '@/lib/owner-analytics';

const comparison = await compareOwnerProperties('user_123');
```

---

## 🗓️ Payment Retry Schedule

```typescript
// Automatic retry schedule
const PAYMENT_RETRY_SCHEDULE = [
  { attempt: 1, daysAfterFailure: 3 },   // Day 3
  { attempt: 2, daysAfterFailure: 5 },   // Day 8
  { attempt: 3, daysAfterFailure: 7 },   // Day 15
  { attempt: 4, daysAfterFailure: 7 },   // Day 22
];

// Grace period before suspension
const GRACE_PERIOD_DAYS = 7;  // Day 29 total
```

---

## 💰 Subscription Plans

```typescript
// Plan IDs
const PLANS = {
  FREE: 'free',
  BASIC_MONTHLY: 'basic_monthly',
  BASIC_YEARLY: 'basic_yearly',
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_YEARLY: 'premium_yearly',
  ENTERPRISE_MONTHLY: 'enterprise_monthly',
  ENTERPRISE_YEARLY: 'enterprise_yearly'
};

// Pricing
const PRICING = {
  BASIC_MONTHLY: 19.99,
  BASIC_YEARLY: 199.99,      // Save £39.89
  PREMIUM_MONTHLY: 49.99,
  PREMIUM_YEARLY: 499.99,    // Save £99.89
  ENTERPRISE_MONTHLY: 99.99,
  ENTERPRISE_YEARLY: 999.99  // Save £199.89
};

// Property limits
const LIMITS = {
  FREE: { properties: 2, photos: 10 },
  BASIC: { properties: 5, photos: 20 },
  PREMIUM: { properties: 25, photos: 50 },
  ENTERPRISE: { properties: -1, photos: -1 }  // -1 = unlimited
};
```

---

## 🔐 Authentication

```typescript
// Check authentication
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const session = await auth.api.getSession({ headers: await headers() });

if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Check role
if (session.user.role !== 'owner') {
  return NextResponse.json(
    { error: 'Owner access required' },
    { status: 403 }
  );
}

// Get user ID
const userId = session.user.id;
```

---

## 🌐 Webhook Handling

```typescript
// Verify Stripe webhook
import { verifyWebhookSignature, handleWebhook } from '@/lib/stripe-billing';

const body = await request.text();
const signature = headers.get('stripe-signature');

if (!signature) {
  return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
}

const event = verifyWebhookSignature(body, signature);

if (!event) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}

// Handle event
await handleWebhook(event);

// Supported events
// - invoice.payment_succeeded
// - invoice.payment_failed
// - customer.subscription.updated
// - customer.subscription.deleted
```

---

## 📅 Date Formatting

```typescript
// UK date utilities
import { 
  nowUKFormatted,
  todayUKFormatted,
  formatDateUK,
  addDaysUK,
  addMonthsUK,
  addYearsUK
} from '@/lib/date-utils';

// Current timestamp
const now = nowUKFormatted();  // "18/12/2025 14:30:00"

// Today's date
const today = todayUKFormatted();  // "18/12/2025"

// Format date
const formatted = formatDateUK(new Date());  // "18/12/2025"

// Add days
const nextWeek = addDaysUK(new Date(), 7);

// Add months
const nextMonth = addMonthsUK(new Date(), 1);

// Add years
const nextYear = addYearsUK(new Date(), 1);
```

---

## 🎨 Code Examples

### Create Subscription Flow
```typescript
// 1. Create Stripe customer
const customer = await stripe.customers.create({
  email: user.email,
  name: user.name,
  metadata: { userId: user.id }
});

// 2. Attach payment method
await stripe.paymentMethods.attach(paymentMethodId, {
  customer: customer.id
});

// 3. Set as default
await stripe.customers.update(customer.id, {
  invoice_settings: { default_payment_method: paymentMethodId }
});

// 4. Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: priceId }],
  trial_period_days: 14
});

// 5. Save to database
await db.insert(subscriptions).values({
  userId: user.id,
  stripeSubscriptionId: subscription.id,
  stripeCustomerId: customer.id,
  stripePriceId: priceId,
  planName: 'premium',
  planType: 'yearly',
  status: 'active',
  amount: 499.99,
  createdAt: nowUKFormatted()
});
```

### Complete Property Creation
```typescript
// 1. Create property
const property = await createProperty({
  ownerId: session.user.id,
  title: 'Luxury Cottage',
  slug: 'luxury-cottage',
  location: 'Cotswolds',
  region: 'Cotswolds',
  sleepsMin: 2,
  sleepsMax: 6,
  bedrooms: 3,
  bathrooms: 2,
  priceFromMidweek: 450,
  priceFromWeekend: 550,
  description: 'Beautiful cottage',
  heroImage: 'https://cdn.com/hero.jpg'
});

// 2. Add images
await addPropertyImages(property.id, [
  { imageURL: 'https://cdn.com/1.jpg', caption: 'Living room' },
  { imageURL: 'https://cdn.com/2.jpg', caption: 'Bedroom' }
]);

// 3. Add features
await addPropertyFeatures(property.id, [
  'WiFi', 'Hot Tub', 'Parking'
]);

// 4. Add seasonal pricing
await addSeasonalPricing({
  propertyId: property.id,
  name: 'Summer Peak',
  seasonType: 'peak',
  startDate: '01/06/2026',
  endDate: '31/08/2026',
  pricePerNight: 750,
  dayType: 'any',
  minimumStay: 3
});

// 5. Submit for approval
await submitPropertyForApproval(property.id, session.user.id);
```

### Handle Payment Failure
```typescript
// Webhook receives payment_failed event
export async function POST(request: NextRequest) {
  const event = await verifyWebhook(request);
  
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    
    // Get attempt count
    const attemptCount = invoice.attempt_count || 1;
    
    // Handle failure with retry
    await handlePaymentFailure({
      subscriptionId: invoice.subscription,
      invoiceId: invoice.id,
      failureReason: invoice.last_payment_error?.message,
      attemptCount
    });
  }
}
```

---

## 📊 Database Queries

### Get User Subscription
```typescript
const [subscription] = await db
  .select()
  .from(subscriptions)
  .where(eq(subscriptions.userId, userId))
  .limit(1);
```

### Get Owner Properties
```typescript
const properties = await db
  .select()
  .from(properties)
  .where(eq(properties.ownerId, ownerId))
  .orderBy(desc(properties.createdAt));
```

### Get Property with Images
```typescript
const [property] = await db
  .select()
  .from(properties)
  .where(eq(properties.id, propertyId));

const images = await db
  .select()
  .from(propertyImages)
  .where(eq(propertyImages.propertyId, propertyId))
  .orderBy(propertyImages.orderIndex);
```

### Get Invoices for User
```typescript
const userInvoices = await db
  .select()
  .from(invoices)
  .where(eq(invoices.userId, userId))
  .orderBy(desc(invoices.createdAt));
```

---

## 🐛 Error Handling

```typescript
// Standard error response
return NextResponse.json(
  { error: 'Error message' },
  { status: 400 }
);

// Status codes
// 200 - Success
// 400 - Bad Request (validation error)
// 401 - Unauthorized (not logged in)
// 403 - Forbidden (wrong role)
// 404 - Not Found
// 500 - Internal Server Error

// Try-catch pattern
try {
  const result = await someOperation();
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error('Operation failed:', error);
  return NextResponse.json(
    { error: 'Operation failed' },
    { status: 500 }
  );
}
```

---

## 🔄 Common Workflows

### New Owner Signup
```
1. User registers → role: 'guest'
2. Choose subscription plan
3. Enter payment method
4. Create subscription → role: 'owner'
5. Add properties (up to plan limit)
6. Submit for approval
7. Properties go live after approval
```

### Payment Failure Recovery
```
1. Payment fails → status: 'past_due'
2. Email sent to owner
3. Retry Day 3 → attempt 1
4. Retry Day 8 → attempt 2
5. Retry Day 15 → attempt 3
6. Retry Day 22 → attempt 4 (final)
7. Day 29 → suspend (if all fail)
8. Owner updates payment → reactivate
```

### Property Listing Workflow
```
1. Create property → status: 'pending'
2. Add photos & features
3. Set pricing rules
4. Submit for approval
5. Admin reviews
6. Approved → status: 'approved', published: true
7. Appears on public website
```

---

## 🧪 Testing

### Test Stripe Cards
```typescript
// Success
const successCard = '4242 4242 4242 4242';

// Decline
const declineCard = '4000 0000 0000 0002';

// Authentication required
const authCard = '4000 0027 6000 3184';

// Insufficient funds
const insufficientCard = '4000 0000 0000 9995';
```

### Test API with cURL
```bash
# Create subscription
curl -X POST http://localhost:3000/api/subscriptions/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"planId":"premium_yearly","paymentMethodId":"pm_123"}'

# Create property
curl -X POST http://localhost:3000/api/owner/properties/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d @property.json

# Get analytics
curl http://localhost:3000/api/owner/analytics?includeRevenue=true \
  -H "Authorization: Bearer TOKEN"
```

---

## 📚 Documentation Files

- `API_DOCUMENTATION_COMPLETE.md` - Full API reference
- `IMPLEMENTATION_COMPLETE_MILESTONES_4_5.md` - Technical guide
- `OWNER_QUICK_START_GUIDE.md` - User manual
- `MILESTONE_DELIVERY_SUMMARY.md` - Feature summary
- This file - Developer quick reference

---

**Quick tips:**
- All timestamps use UK format: DD/MM/YYYY HH:mm:ss
- Use `nowUKFormatted()` for current timestamp
- Check user role before operations
- Verify webhook signatures
- Handle errors gracefully
- Log actions with timestamps

**Happy coding! 🚀**
