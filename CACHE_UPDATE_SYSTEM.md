# Automatic Cache Update System

## Overview

The application now has automatic cache invalidation and revalidation whenever data changes. This ensures the UI stays in sync with the database without manual page refreshes.

## How It Works

### Server-Side Cache Revalidation

When data changes on the server (via API routes), the cache is automatically invalidated using Next.js `revalidatePath()` and `revalidateTag()` functions.

### Cache Tags

Located in: `src/lib/cache.ts`

Organized by data type:
- **Properties**: `PROPERTIES`, `PROPERTY(id)`, `OWNER_PROPERTIES(userId)`
- **Bookings**: `BOOKINGS`, `BOOKING(id)`, `PROPERTY_BOOKINGS(propertyId)`
- **Payments**: `PAYMENTS`, `TRANSACTIONS`, `OWNER_PAYMENTS(userId)`
- **Subscriptions**: `SUBSCRIPTIONS`, `USER_SUBSCRIPTION(userId)`
- **Approvals**: `APPROVALS`, `PROPERTY_APPROVAL(propertyId)`
- **Availability**: `AVAILABILITY(propertyId)`
- **Dashboards**: `OWNER_DASHBOARD(userId)`, `ADMIN_DASHBOARD`

## Automatic Cache Updates

### Property Operations

**When a property is created:**
```typescript
// src/app/api/owner/properties/route.ts (POST)
revalidateProperty(newProperty[0].id.toString(), session.user.id);
revalidateOwnerDashboard(session.user.id);
```

**When a property is deleted:**
```typescript
// src/app/api/properties/route.ts (DELETE)
revalidateProperty(id, existingProperty[0].ownerId);
revalidateOwnerDashboard(existingProperty[0].ownerId);
revalidateAdminDashboard();
```

### Payment/Transaction Operations

**When a payment is created/updated via Stripe webhook:**
```typescript
// src/lib/stripe-billing.ts - createOrUpdatePayment()
revalidatePayment(paymentUserId);
```

This updates:
- Admin transactions dashboard
- Owner payment history
- All payment-related views

### Subscription Operations

**When a subscription is updated:**
```typescript
// src/lib/stripe-billing.ts - handleSubscriptionUpdated()
revalidateSubscription(userId);
```

This updates:
- Owner dashboard subscription status
- Admin dashboard subscription data
- Billing pages

## Client-Side Refresh Hook

Located in: `src/hooks/useRefresh.ts`

### Usage

```typescript
import { useRefresh } from '@/hooks/useRefresh';

function MyComponent() {
  const { refresh, isRefreshing } = useRefresh();
  
  const handleAction = async () => {
    // Perform API call
    await fetch('/api/some-endpoint', { method: 'POST' });
    
    // Manually refresh cache
    await refresh();
  };
  
  return (
    <button onClick={handleAction} disabled={isRefreshing}>
      {isRefreshing ? 'Refreshing...' : 'Do Action'}
    </button>
  );
}
```

### Auto-Refresh Hook

For delayed automatic refreshes:

```typescript
import { useAutoRefresh } from '@/hooks/useRefresh';

function MyComponent() {
  const { scheduleRefresh } = useAutoRefresh(2000); // 2 second delay
  
  const handleAction = async () => {
    await fetch('/api/some-endpoint', { method: 'POST' });
    scheduleRefresh(); // Will refresh after 2 seconds
  };
}
```

## Cache Revalidation Functions

### `revalidateOwnerDashboard(userId)`
Invalidates:
- Owner dashboard page
- Owner's properties
- Owner's bookings
- Owner's payments

### `revalidateAdminDashboard()`
Invalidates:
- Admin dashboard page
- All properties
- All bookings
- All transactions
- All approvals

### `revalidateProperty(propertyId, ownerId?)`
Invalidates:
- Properties list
- Single property page
- Property bookings
- Property approval
- Owner's property list (if ownerId provided)

### `revalidateBooking(bookingId, propertyId, ownerId?)`
Invalidates:
- Bookings list
- Single booking
- Property bookings
- Property availability calendar
- Owner's bookings (if ownerId provided)
- Admin dashboard

### `revalidatePayment(userId)`
Invalidates:
- All payments
- All transactions
- User's payment history
- Owner dashboard
- Admin dashboard

### `revalidateSubscription(userId)`
Invalidates:
- All subscriptions
- User's subscription
- Owner dashboard
- Admin dashboard

### `revalidateApproval(propertyId, ownerId?)`
Invalidates:
- All approvals
- Property approval status
- Property data
- Admin dashboard

### `revalidateAvailability(propertyId, ownerId?)`
Invalidates:
- Property availability calendar
- Owner dashboard (if ownerId provided)

### `revalidateAll()`
**Use sparingly!** Clears entire application cache.

## Implementation Examples

### Example 1: Property Creation with Cache Update

```typescript
// API Route
export async function POST(request: NextRequest) {
  const newProperty = await db.insert(properties).values(data).returning();
  
  // Automatically update cache
  revalidateProperty(newProperty[0].id.toString(), userId);
  revalidateOwnerDashboard(userId);
  
  return NextResponse.json({ property: newProperty[0] });
}
```

### Example 2: Payment Webhook with Cache Update

```typescript
// Stripe Webhook Handler
async function createOrUpdatePayment(paymentIntent, eventId, userId) {
  const payment = await db.insert(payments).values(data).returning();
  
  // Automatically update all payment views
  revalidatePayment(userId);
  
  return payment;
}
```

### Example 3: Client-Side Deletion with Manual Refresh

```typescript
// Owner Dashboard
const handleDeleteProperty = async (propertyId: number) => {
  await fetch(`/api/owner/properties/${propertyId}`, { method: 'DELETE' });
  
  // Update local state
  setProperties(prev => prev.filter(p => p.id !== propertyId));
  
  // Refresh cache for any server-rendered content
  await refresh();
};
```

## Benefits

✅ **Automatic UI Updates** - No manual page refreshes needed
✅ **Real-time Sync** - Data stays consistent across all views
✅ **Better UX** - Users see changes immediately
✅ **Dashboard Accuracy** - Stats and counts update automatically
✅ **Multi-User Support** - Changes reflect for all users viewing the same data

## When Cache Updates Happen

- ✅ Property created, updated, or deleted
- ✅ Booking created, updated, or cancelled
- ✅ Payment processed via Stripe webhook
- ✅ Subscription created, updated, or cancelled
- ✅ Property approval status changed
- ✅ Availability calendar updated
- ✅ Any admin dashboard action

## Performance Considerations

- Cache revalidation is **lightweight** - only invalidates specific tags
- Uses Next.js's built-in **incremental static regeneration**
- Server components automatically re-fetch when cache is invalidated
- Client components use `router.refresh()` to trigger updates

## Testing Cache Updates

1. **Create a property** → Owner dashboard should update immediately
2. **Delete a property** → Property list should refresh automatically
3. **Make a Stripe payment** → Admin transactions should show new payment
4. **Update subscription** → Dashboard subscription status should update

## Debugging

Enable cache debugging by checking:
1. Network tab for refetch requests after mutations
2. Console logs in `src/lib/cache.ts` (add if needed)
3. React DevTools to see component re-renders

## Future Enhancements

- Add optimistic UI updates for instant feedback
- Implement WebSocket for real-time multi-user updates
- Add cache warming for frequently accessed data
- Implement stale-while-revalidate strategy
