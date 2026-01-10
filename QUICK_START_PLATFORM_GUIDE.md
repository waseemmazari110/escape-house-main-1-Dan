# 🚀 Quick Start Guide - Property Listing Platform

## System Type
**Property Listing Platform with Admin Approval** (NOT a booking platform)

---

## 👥 User Roles

| Role | Login URL | Dashboard | Key Actions |
|------|-----------|-----------|-------------|
| **Admin** | `/auth/admin-login` | `/admin/dashboard` | Approve listings, view all payments, manage users |
| **Owner** | `/owner/login` | `/owner/dashboard` | Pay subscription, add properties, edit listings |
| **Visitor** | N/A (No login) | `/properties` | Browse properties, send enquiries |

---

## 💳 Subscription Plans (Owners Only)

| Plan | Price | Max Properties | Access |
|------|-------|---------------|--------|
| Free | £0/mo | 2 properties | Basic |
| Basic | £9.99/mo | 5 properties | Standard |
| Premium | £19.99/mo | 25 properties | Featured |
| Enterprise | £29.99/mo | Unlimited | Full access |

**Payment Method:** Stripe Checkout
**Subscription Page:** `/owner/subscription`

---

## 📝 Property Workflow

```
Owner Creates → pending → Admin Reviews → approved/rejected → Live/Hidden
```

### Default Behavior:
- New properties = **`pending`** status
- Owners **cannot** publish directly
- Only **Admin** can approve/reject
- Public sees only **`approved`** properties

---

## 🎛️ Admin Functions

### View Memberships & Payments
**URL:** `/admin/payments` or `/admin/dashboard?view=transactions`

**Shows:**
- All owner subscriptions
- Payment history
- Owner names & emails
- Plan types
- Payment dates & amounts

### Approve/Reject Properties
**URL:** `/admin/dashboard?view=approvals` or `/admin/properties/approvals`

**Actions:**
- View pending properties
- Approve → Property goes live
- Reject → Property stays hidden (with reason)

### Manage Users
**URL:** `/admin/dashboard?view=users`

**Actions:**
- View all users (owners, guests)
- Delete users
- Check subscription status
- Suspend owners if payment fails

---

## 🏠 Owner Functions

### Subscribe to a Plan
1. Go to `/owner/subscription`
2. Click "Upgrade Now" on desired plan
3. Complete Stripe payment
4. Subscription activates automatically

### Add New Property
1. Navigate to `/owner/properties`
2. Click "Add New Property"
3. Fill in details (title, location, pricing, etc.)
4. Upload images
5. Submit → Status = **`pending`**
6. Wait for admin approval

### Edit Existing Property
1. Go to `/owner/properties`
2. Click pencil icon on property
3. Make changes
4. Save → May require re-approval if major changes

### View Payments
- **URL:** `/owner/payments`
- See payment history
- Download receipts
- Check subscription status

---

## 🌐 Public Visitor Experience

### What Visitors Can Do:
✅ Browse approved properties: `/properties`  
✅ View property details: `/properties/[slug]`  
✅ Send enquiry form  
✅ Search/filter properties  

### What Visitors CANNOT Do:
❌ Book properties  
❌ Make payments  
❌ Create listings  
❌ Access dashboards  

---

## 🔐 Important Notes

### Visitor Changes Made:
- ❌ **Removed:** "Book Now" button
- ❌ **Removed:** BookingModal component
- ✅ **Added:** "Enquire" button (links to enquiry form)
- ✅ **Kept:** Contact/enquiry functionality

### Property Status Values:
- **`pending`** - Awaiting admin review (default for new listings)
- **`approved`** - Live on website, visible to public
- **`rejected`** - Not approved, owner can see rejection reason

### Database Tables:
- **`properties`** - All listings (with status, ownerId, approval fields)
- **`user`** - All users (with role: guest/owner/admin)
- **`subscriptions`** - Owner subscription data
- **`payments`** - Payment transaction history

---

## 🧪 Testing Accounts

### Admin Account
```
Email: admin@example.com
Password: [Your admin password]
Login: /auth/admin-login
```

### Owner Account
```
Create new: /auth/sign-up
Login: /owner/login
Default Plan: Free (2 properties)
```

### Visitor Access
```
No login required
Browse: /properties
```

---

## 🔗 Key URLs

### Admin URLs:
- Dashboard: `/admin/dashboard`
- Approvals: `/admin/properties/approvals`
- Payments: `/admin/payments`
- Users: `/admin/dashboard?view=users`
- Bookings: `/admin/bookings`

### Owner URLs:
- Dashboard: `/owner/dashboard`
- Properties: `/owner/properties`
- Add Property: `/owner/properties/new`
- Subscription: `/owner/subscription`
- Payments: `/owner/payments`
- Settings: `/owner/settings`

### Public URLs:
- Browse Properties: `/properties`
- Property Details: `/properties/[slug]`
- Contact: `/contact`
- Home: `/`

---

## 📊 Admin Dashboard Tabs

| Tab | Purpose |
|-----|---------|
| **Overview** | Stats, recent activity |
| **Bookings** | View enquiries/bookings |
| **Users** | Manage all users |
| **Approvals** | Pending property listings |
| **Transactions** | All subscription payments |

---

## ⚡ Quick Commands

### Start Development Server:
```bash
npm run dev
```

### Access Dashboard:
- Admin: `http://localhost:3000/admin/dashboard`
- Owner: `http://localhost:3000/owner/dashboard`
- Properties: `http://localhost:3000/properties`

### Check Database:
```bash
npm run db:studio
```

---

## 🆘 Troubleshooting

### Owner Cannot See Property Live
**Solution:** Property must be approved by admin first
- Check status in `/owner/properties`
- If "pending" → wait for admin approval
- If "rejected" → check rejection reason, fix and resubmit

### Payment Not Showing in Admin Dashboard
**Solution:** Check Stripe webhook
1. Verify webhook is configured in Stripe
2. Check webhook endpoint: `/api/webhooks/stripe`
3. Ensure `STRIPE_WEBHOOK_SECRET` is set in `.env`

### Visitor Can See Unapproved Property
**Solution:** Check property status
- Only `status='approved'` should be visible
- Verify API filters by status
- Check `/api/properties` endpoint

---

## 📚 Full Documentation

For detailed documentation, see:
- [SYSTEM_CONFIGURATION_COMPLETE.md](SYSTEM_CONFIGURATION_COMPLETE.md)
- [RBAC_COMPLETE_SUMMARY.md](RBAC_COMPLETE_SUMMARY.md)
- [ADMIN_DASHBOARD_FIXES_COMPLETE_SUMMARY.md](ADMIN_DASHBOARD_FIXES_COMPLETE_SUMMARY.md)
- [API_DOCUMENTATION_COMPLETE.md](API_DOCUMENTATION_COMPLETE.md)

---

**Last Updated:** January 10, 2026  
**System Status:** ✅ Fully Operational
