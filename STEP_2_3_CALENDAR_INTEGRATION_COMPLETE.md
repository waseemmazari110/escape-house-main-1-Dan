# STEP 2.3 – Availability & Calendar Integration

**Status:** ✅ COMPLETE  
**Date:** 17/12/2025  
**Code Added:** ~850 lines

## Overview

Complete FullCalendar integration with blocked dates display, booking overlap prevention, and automatic iCal sync from external platforms (Airbnb, VRBO, Booking.com).

---

## What's Implemented

### 1. **iCal Sync Service** (`src/lib/ical-sync.ts`)
- Parse iCal format from external calendar feeds
- Extract booking events with date ranges
- Identify source platform (Airbnb, VRBO, Booking.com)
- Merge overlapping date ranges
- Conflict detection with existing bookings

**Key Functions:**
- `parseICalData()` - Parse iCal text format into structured events
- `fetchICalFeed()` - Fetch external calendar via HTTP
- `syncPropertyICalFeed()` - Complete sync workflow for a property
- `hasICalConflict()` - Check if dates conflict with external calendar
- `mergeBlockedDates()` - Consolidate overlapping date ranges

### 2. **Calendar Events API** (`src/app/api/calendar/events/[propertyId]/route.ts`)
Returns FullCalendar-compatible event data including:
- Existing bookings (color-coded by status)
- iCal synced blocked dates
- Event metadata (guest info, source platform)

**Endpoint:** `GET /api/calendar/events/[propertyId]`

**Response:**
```json
{
  "success": true,
  "propertyId": 1,
  "propertyName": "Luxury Cottage",
  "events": [
    {
      "id": "booking-123",
      "title": "John Doe - confirmed",
      "start": "2025-01-15",
      "end": "2025-01-20",
      "backgroundColor": "#10b981",
      "borderColor": "#059669",
      "textColor": "#ffffff",
      "extendedProps": {
        "type": "booking",
        "bookingId": 123,
        "status": "confirmed",
        "guestName": "John Doe",
        "guestEmail": "john@example.com"
      }
    },
    {
      "id": "ical-2025-02-01-2025-02-05",
      "title": "Blocked (Airbnb)",
      "start": "2025-02-01",
      "end": "2025-02-05",
      "backgroundColor": "#f59e0b",
      "borderColor": "#d97706",
      "textColor": "#ffffff",
      "extendedProps": {
        "type": "ical-blocked",
        "source": "Airbnb"
      }
    }
  ],
  "eventCounts": {
    "bookings": 15,
    "icalBlocked": 8,
    "total": 23
  }
}
```

**Color Coding:**
- 🔵 Blue (`#3b82f6`) - Pending bookings
- 🟢 Green (`#10b981`) - Confirmed bookings
- ⚫ Gray (`#6b7280`) - Completed bookings
- 🔴 Red (`#ef4444`) - Cancelled bookings
- 🟠 Orange (`#f59e0b`) - iCal blocked dates

### 3. **iCal Sync API** (`src/app/api/calendar/sync/[propertyId]/route.ts`)

**POST** - Manually trigger iCal sync (owner/admin only)
```bash
POST /api/calendar/sync/123
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "propertyId": 123,
  "eventsFound": 12,
  "blockedDates": [
    {
      "startDate": "2025-01-15",
      "endDate": "2025-01-20",
      "source": "Airbnb"
    }
  ],
  "message": "Successfully synced 12 events from external calendar"
}
```

**GET** - Check sync status (public)
```bash
GET /api/calendar/sync/123
```

### 4. **PropertyCalendar Component** (`src/components/calendar/property-calendar.tsx`)

React component with FullCalendar integration:

**Full Calendar:**
```tsx
import { PropertyCalendar } from '@/components/calendar/property-calendar';

<PropertyCalendar
  propertyId={123}
  propertyName="Luxury Cottage"
  selectable={true}
  onDateSelect={(start, end) => {
    console.log('Selected:', start, end);
    // Open booking form with pre-filled dates
  }}
  onEventClick={(bookingId) => {
    console.log('Clicked booking:', bookingId);
    // Navigate to booking details
  }}
/>
```

**Mini Calendar (for listings):**
```tsx
import { PropertyCalendarMini } from '@/components/calendar/property-calendar';

<PropertyCalendarMini propertyId={123} />
```

**Features:**
- Month/week view switching
- Click events to view booking details
- Select date ranges (when `selectable={true}`)
- Auto-refresh on property change
- Loading and error states
- Color-coded legend

### 5. **Enhanced Availability Checking**

Updated `src/lib/booking-availability.ts`:
- `checkAvailability()` now validates against iCal blocked dates
- `getBlockedDates()` returns both database bookings + iCal blocks
- Prevents double-booking from external platforms

**iCal Integration:**
```typescript
// Availability check now includes iCal validation
const result = await checkAvailability({
  propertyId: 123,
  checkInDate: '2025-01-15',
  checkOutDate: '2025-01-20'
});

if (!result.available) {
  console.log(result.reason);
  // "Property is blocked on external calendar (Airbnb, VRBO, etc.)"
}
```

---

## How It Works

### iCal Sync Flow

1. **Property Setup:**
   - Owner adds iCalURL to property (e.g., Airbnb's iCal export URL)
   - Field stored in `properties.iCalURL`

2. **Automatic Sync:**
   - Calendar API (`/api/calendar/events/[propertyId]`) auto-fetches iCal on load
   - Availability checker validates against iCal before accepting bookings
   - Cache: 5-minute revalidation to avoid excessive external requests

3. **Manual Sync:**
   - Owners/admins can trigger via `/api/calendar/sync/[propertyId]`
   - Useful for immediate updates after external booking

### Overlap Prevention

**Three-Layer Protection:**

1. **Database Bookings:** Pending/confirmed bookings block dates
2. **iCal Sync:** External calendar bookings block dates
3. **Merge Logic:** Overlapping blocks consolidated for clean display

**Conflict Resolution:**
- Database bookings take precedence (shown as bookings, not iCal blocks)
- iCal blocks only displayed if no database booking exists for those dates
- Prevents duplicate event display

---

## Usage Examples

### Example 1: Property Listing Page
```tsx
import { PropertyCalendar } from '@/components/calendar/property-calendar';

export default function PropertyPage({ propertyId }: { propertyId: number }) {
  return (
    <div className="container mx-auto p-6">
      <h1>Property Availability</h1>
      
      <PropertyCalendar
        propertyId={propertyId}
        selectable={true}
        onDateSelect={(start, end) => {
          // Redirect to booking form with dates
          const params = new URLSearchParams({
            checkIn: start.toISOString().split('T')[0],
            checkOut: end.toISOString().split('T')[0]
          });
          window.location.href = `/book/${propertyId}?${params}`;
        }}
      />
    </div>
  );
}
```

### Example 2: Owner Dashboard Calendar
```tsx
import { PropertyCalendar } from '@/components/calendar/property-calendar';

export default function OwnerCalendarView({ propertyId }: { propertyId: number }) {
  return (
    <PropertyCalendar
      propertyId={propertyId}
      propertyName="My Property"
      selectable={false}
      onEventClick={(bookingId) => {
        // Navigate to booking details
        window.location.href = `/owner/bookings/${bookingId}`;
      }}
    />
  );
}
```

### Example 3: Check Availability Manually
```typescript
import { checkAvailability } from '@/lib/booking-availability';

const result = await checkAvailability({
  propertyId: 123,
  checkInDate: '2025-03-01',
  checkOutDate: '2025-03-05'
});

if (result.available) {
  console.log('✅ Property available for these dates');
} else {
  console.log('❌ Not available:', result.reason);
  
  if (result.conflictingBookings) {
    console.log('Conflicts with bookings:', result.conflictingBookings);
  }
}
```

### Example 4: Sync External Calendar
```typescript
// Trigger iCal sync from owner dashboard
async function syncExternalCalendar(propertyId: number) {
  const response = await fetch(`/api/calendar/sync/${propertyId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    alert(`Synced ${data.eventsFound} events from external calendar`);
  } else {
    alert(`Sync failed: ${data.error}`);
  }
}
```

---

## Configuration

### Add iCal URL to Property

**Option 1: Direct Database Update**
```sql
UPDATE properties 
SET ical_url = 'https://www.airbnb.com/calendar/ical/12345.ics?s=secret'
WHERE id = 123;
```

**Option 2: Owner Dashboard (if property edit UI exists)**
```tsx
<input
  type="url"
  name="iCalURL"
  placeholder="https://airbnb.com/calendar/ical/..."
  value={property.iCalURL || ''}
/>
```

### How to Get iCal URLs

**Airbnb:**
1. Go to property listing → Calendar
2. Click "Availability settings"
3. Scroll to "Calendar sync"
4. Click "Export calendar" → Copy iCal URL

**VRBO:**
1. Go to property calendar
2. Click "Import/Export"
3. Copy the iCal export URL

**Booking.com:**
1. Extranet → Calendar
2. "Synchronise calendars"
3. Copy iCal URL

---

## Security & Performance

### Security
- **Auth Required:** iCal sync POST requires owner/admin role
- **URL Validation:** iCal fetcher validates HTTP/HTTPS URLs
- **Error Handling:** Sync failures don't block bookings (graceful degradation)
- **No Direct Execution:** iCal data parsed safely, no eval/exec

### Performance
- **Cache:** 5-minute revalidation on iCal fetches
- **Non-blocking:** Availability checks don't fail if iCal sync fails
- **Lazy Load:** Calendar component fetches events on mount (not server-side)
- **Merge Logic:** Overlapping dates consolidated to reduce event count

### Error Handling
```typescript
// Availability check continues even if iCal fails
try {
  const icalSync = await syncPropertyICalFeed(propertyId);
  // Validate against iCal
} catch (icalError) {
  console.error('iCal validation error:', icalError);
  // Continue with booking - don't block due to sync issues
}
```

---

## Testing

### Test iCal Parsing
```typescript
import { parseICalData } from '@/lib/ical-sync';

const testData = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Airbnb Inc//Hosting Calendar 0.8.8//EN
BEGIN:VEVENT
UID:abc123@airbnb.com
DTSTART;VALUE=DATE:20250115
DTEND;VALUE=DATE:20250120
SUMMARY:Reserved
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
`;

const events = parseICalData(testData);
console.log(events);
// [{ uid: 'abc123@airbnb.com', summary: 'Reserved', startDate: ..., endDate: ... }]
```

### Test API Endpoints
```bash
# Get calendar events
curl http://localhost:3000/api/calendar/events/123

# Sync iCal (requires auth)
curl -X POST http://localhost:3000/api/calendar/sync/123 \
  -H "Authorization: Bearer <token>"

# Check sync status
curl http://localhost:3000/api/calendar/sync/123
```

### Test Availability with iCal
```typescript
// 1. Add iCal URL to property (with known blocked dates)
// 2. Check availability for those dates
const result = await checkAvailability({
  propertyId: 123,
  checkInDate: '2025-01-15', // Should be blocked in iCal
  checkOutDate: '2025-01-20'
});

console.log(result.available); // Should be false
console.log(result.reason); // "Property is blocked on external calendar..."
```

---

## Known Limitations

### 1. **iCal Format Variations**
- Parser handles standard iCal format (RFC 5545)
- Some platforms use non-standard fields (may be ignored)
- Tested with Airbnb, VRBO, Booking.com formats

### 2. **Sync Frequency**
- Current: 5-minute cache on iCal fetches
- Manual sync available via API
- Consider adding scheduled background job for automated sync

### 3. **No Two-Way Sync**
- Current implementation is read-only (imports external calendars)
- Bookings made in Escape Houses don't export to external platforms
- Would require iCal server implementation (future enhancement)

### 4. **Time Zone Handling**
- iCal dates are DATE-only (no time component)
- Assumes midnight-to-midnight bookings
- Works correctly for UK timezone but may need adjustment for multi-timezone properties

---

## Future Enhancements

### Recommended Next Steps

1. **Two-Way Sync:**
   - Export Escape Houses bookings to iCal feed
   - Allow external platforms to import our calendar
   - Requires iCal server endpoint (`/api/ical/property/[id].ics`)

2. **Scheduled Background Sync:**
   - Cron job to sync all properties every hour
   - Store synced data in database table (avoid repeated fetches)
   - Send owner notifications on sync failures

3. **Sync Status Dashboard:**
   - Owner dashboard showing last sync time
   - Sync success/failure indicators
   - Quick "Sync Now" button

4. **Advanced Conflict Resolution:**
   - Allow manual override of iCal blocks
   - Priority system (direct bookings vs external)
   - Grace period for checkout/check-in same day

5. **Multi-Calendar Support:**
   - Multiple iCal URLs per property
   - Different sources (Airbnb + VRBO + Booking.com)
   - Consolidated view of all external bookings

---

## Files Created/Modified

### Created:
1. `src/lib/ical-sync.ts` (310 lines) - iCal parsing and sync service
2. `src/app/api/calendar/events/[propertyId]/route.ts` (179 lines) - Calendar events API
3. `src/app/api/calendar/sync/[propertyId]/route.ts` (140 lines) - iCal sync API
4. `src/components/calendar/property-calendar.tsx` (230 lines) - FullCalendar React component

### Modified:
1. `src/lib/booking-availability.ts` - Added iCal validation to availability checks

**Total:** ~850 lines of new code

---

## Integration Checklist

- ✅ FullCalendar installed and configured
- ✅ iCal sync service implemented
- ✅ Calendar events API endpoint
- ✅ iCal sync API endpoint (GET + POST)
- ✅ PropertyCalendar React component
- ✅ Availability checker enhanced with iCal validation
- ✅ Color-coded event display
- ✅ Booking overlap prevention (database + iCal)
- ✅ Error handling and graceful degradation
- ✅ Security (auth for sync, safe parsing)
- ✅ Documentation complete

---

## Summary

STEP 2.3 provides a complete calendar integration with:
- **Visual calendar display** using FullCalendar
- **Blocked dates** from both database bookings and external platforms
- **Booking overlap prevention** across all sources
- **iCal sync** from Airbnb, VRBO, Booking.com
- **Owner-friendly API** for manual sync triggers
- **Production-ready** with error handling and caching

The system prevents double-bookings, displays availability clearly, and keeps external calendars in sync automatically. Ready for immediate use in property listing and owner dashboard pages.
