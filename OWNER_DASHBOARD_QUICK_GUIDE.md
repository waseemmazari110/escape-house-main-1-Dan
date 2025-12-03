# Owner Dashboard - Quick Setup & Testing Guide

## 🚀 Quick Start

### 1. Run Database Migration
```bash
# Apply the schema changes
drizzle-kit push:sqlite

# Or manually run SQL:
# ALTER TABLE bookings ADD COLUMN property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE;
```

### 2. Setup Test Data

#### Create Owner Account
```sql
-- Create or update user to owner role
UPDATE user SET role = 'owner' WHERE email = 'john@example.com';
```

#### Assign Properties to Owner
```sql
-- Link properties to owner
UPDATE properties 
SET owner_id = 'user-id-here' 
WHERE id IN (1, 2, 3);
```

#### Link Bookings to Properties (Optional)
```sql
-- If you have existing bookings, link them to properties
UPDATE bookings 
SET property_id = 1 
WHERE property_name = 'Sunset Villa';
```

### 3. Test Login Flow

1. **Login as Owner**:
   - Email: john@example.com
   - Click "Owner Dashboard" in header
   - Should see dashboard with YOUR properties only

2. **Login as Admin**:
   - Should see ALL properties and bookings

3. **Login as Guest**:
   - Try accessing `/owner/dashboard`
   - Should see "Access Restricted" message

## 📊 Dashboard Features

### Overview Page (`/owner/dashboard`)
- **Stats Cards**: Total bookings, active properties, revenue, upcoming check-ins
- **Recent Bookings**: Latest 5 bookings for your properties
- **Upcoming Check-ins**: Next 30 days check-ins
- **Your Properties**: Grid of up to 6 properties with management links

### Bookings Page (`/owner/bookings`)
- **Full List**: All bookings for your properties
- **Search**: By guest name, property name, or email
- **Filter**: By booking status (pending, confirmed, completed, cancelled)
- **Details**: Guest info, dates, guests count, total price

## 🔐 Access Rules

| Role   | Dashboard Access | Data Visible |
|--------|-----------------|--------------|
| Guest  | ❌ Restricted   | None         |
| Owner  | ✅ Full Access  | Own Properties Only |
| Admin  | ✅ Full Access  | All Properties |

## 🎯 API Endpoints

```
GET /api/owner/stats
- Returns: totalBookings, activeProperties, revenue, upcomingCheckIns
- Access: Owner/Admin only
- Filtered by: ownerId (owners) or all (admins)

GET /api/owner/bookings?limit=10
- Returns: Array of bookings
- Access: Owner/Admin only
- Filtered by: Owner's properties

GET /api/owner/upcoming-checkins
- Returns: Array of upcoming check-ins (next 30 days)
- Access: Owner/Admin only
- Filtered by: Owner's properties
```

## 🎨 UI Components

### Sidebar Navigation
```
✓ Overview (highlighted when active)
✓ Bookings
✓ Properties
✓ Payments (placeholder)
✓ Settings (placeholder)
✓ Sign Out
```

### Status Badges
```
Confirmed  → Green
Pending    → Amber/Orange
Completed  → Blue
Cancelled  → Red
```

### Date Format
```
Full: DD/MM/YYYY (e.g., 28/07/2024)
Short: DD Mon (e.g., 28 Jul)
```

### Currency
```
Format: £1,245 (UK Pound with thousands separator)
```

## 🐛 Troubleshooting

### No Data Showing?
1. Check if user has `role = 'owner'` in database
2. Verify properties have `owner_id` set to user's ID
3. Check if bookings have `property_id` or correct `property_name`

### Stats Show Zero?
1. Ensure properties are published (`is_published = true`)
2. Check if bookings exist for your properties
3. Verify booking dates are valid

### Access Restricted Error?
1. Confirm you're logged in
2. Check user role in database
3. Clear browser cache and localStorage
4. Re-login

### Properties Not Appearing?
1. SQL Query:
   ```sql
   SELECT * FROM properties WHERE owner_id = 'your-user-id';
   ```
2. If empty, assign properties:
   ```sql
   UPDATE properties SET owner_id = 'your-user-id' WHERE id IN (1,2,3);
   ```

## 📱 Responsive Breakpoints

```
Mobile:  < 768px (stacked layout)
Tablet:  768px - 1024px (2 columns)
Desktop: > 1024px (full layout with sidebar)
```

## 🔗 Navigation Links

```
Header:
- "Owner Dashboard" → /owner/dashboard (owners/admins only)
- "Admin" → /admin/bookings (admins only)

Footer:
- "Owner Dashboard" → /admin/properties (owners/admins only)

Sidebar:
- Overview → /owner/dashboard
- Bookings → /owner/bookings
- Properties → /admin/properties
- Payments → /owner/payments (placeholder)
- Settings → /owner/settings (placeholder)
```

## ✅ Testing Checklist

- [ ] Database migration applied
- [ ] Owner user created with proper role
- [ ] Properties assigned to owner
- [ ] Can login as owner
- [ ] Dashboard shows correct stats
- [ ] Recent bookings appear
- [ ] Upcoming check-ins display
- [ ] Properties grid shows owner's properties
- [ ] Bookings page lists owner's bookings only
- [ ] Search functionality works
- [ ] Status filter works
- [ ] Guest account sees "Access Restricted"
- [ ] Admin can see all data
- [ ] Sign out works correctly

## 🎯 Key URLs

```
Production Dashboard: /owner/dashboard
Production Bookings:  /owner/bookings
Property Management:  /admin/properties
Admin Bookings:       /admin/bookings
```

## 📞 Support

For issues or questions:
1. Check console for errors (F12 → Console)
2. Verify database schema is updated
3. Check API responses in Network tab
4. Review OWNER_DASHBOARD_IMPLEMENTATION.md for details

---

**Status**: ✅ Production Ready
**Last Updated**: December 4, 2025
