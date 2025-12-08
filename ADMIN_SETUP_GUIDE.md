# Admin Access Setup Guide

## How to Create an Admin Account

Since there's no admin registration page (for security), you need to manually set a user's role to 'admin' in the database.

### Method 1: Update Existing User

1. **Register a regular account** at `/register`
2. **Find your user in the database** (users table)
3. **Update the role field** to `'admin'`
4. **Login at** `/admin/login`

### Method 2: Direct Database Insert

```sql
-- If using SQLite
UPDATE user SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Method 3: Using Database GUI

1. Open your database file with a GUI tool (DB Browser for SQLite, etc.)
2. Find the `user` table
3. Locate your user record by email
4. Change the `role` field from `'guest'` to `'admin'`
5. Save changes

## Admin Access URLs

- **Admin Login**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`

## Admin Features

✅ View all bookings across all properties
✅ Manage all users (guests & owners)  
✅ View platform statistics
✅ Search and filter capabilities
✅ Responsive design for all devices

## Security Notes

- Only users with `role = 'admin'` can access admin pages
- All admin routes are protected with role-based access control
- Regular users and owners cannot access admin dashboard
- Admin accounts should be created manually for security

## Testing Admin Access

1. Create/update an admin account using one of the methods above
2. Visit: `http://localhost:3000/admin/login`
3. Login with your admin credentials
4. You'll be redirected to the admin dashboard

## Troubleshooting

**Can't login as admin?**
- Verify the user's `role` field is exactly `'admin'` (lowercase)
- Check database connection
- Clear browser cache and cookies
- Try logging out and back in

**Access denied?**
- Ensure you're logging in at `/admin/login` not `/login`
- Verify the role was saved correctly in database
- Check server console for any errors
