# 🎯 Property Listing Platform - Visual Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROPERTY LISTING PLATFORM                        │
│                   (Admin-Approved Listings Only)                    │
└─────────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │   VISITORS   │
                          │  (Read-Only) │
                          └──────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │  Browse  │ │   View   │ │ Enquire  │
              │Properties│ │ Details  │ │   Form   │
              └──────────┘ └──────────┘ └──────────┘
                    │            │            │
                    └────────────┼────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   APPROVED PROPERTIES   │
                    │    (status=approved)    │
                    └────────────▲────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────▼─────┐           ┌─────▼─────┐
              │  OWNERS   │           │   ADMIN   │
              │  (Paid)   │           │  (Control)│
              └─────┬─────┘           └─────┬─────┘
                    │                       │
        ┌───────────┼───────────┐           │
        │           │           │           │
        ▼           ▼           ▼           │
  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
  │   Pay   │ │   Add   │ │  Edit   │     │
  │  Stripe │ │Property │ │Property │     │
  └─────────┘ └────┬────┘ └─────────┘     │
                    │                      │
                    ▼                      │
            ┌──────────────┐               │
            │   PENDING    │               │
            │  Properties  │───────────────┘
            └──────────────┘               │
                                           │
                    ┌──────────────────────┤
                    │                      │
                    ▼                      ▼
            ┌──────────────┐       ┌──────────────┐
            │   APPROVE    │       │    REJECT    │
            └──────┬───────┘       └──────┬───────┘
                   │                      │
                   ▼                      ▼
          ┌──────────────┐         ┌──────────────┐
          │ Property LIVE│         │ Property     │
          │ (Public View)│         │ Hidden       │
          └──────────────┘         └──────────────┘
```

---

## User Flow Diagrams

### 🔵 Visitor Flow (No Account Required)

```
START → Browse Properties (/properties)
              ↓
        View Property Details (/properties/[slug])
              ↓
        Read Description, Photos, Amenities
              ↓
        Click "Enquire" Button
              ↓
        Fill Contact Form
              ↓
        Submit → Email sent to property owner
              ↓
        END (No booking, No payment)
```

### 🟢 Owner Flow (Paid Subscription)

```
START → Register Account (/auth/sign-up)
              ↓
        Login (/owner/login)
              ↓
        Default: Free Plan (2 properties)
              ↓
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   Keep Free Plan          Upgrade Subscription
        │                    (/owner/subscription)
        │                         ↓
        │                   Choose Plan & Pay (Stripe)
        │                         ↓
        └────────────┬────────────┘
                     │
                     ▼
        Add New Property (/owner/properties/new)
              ↓
        Fill Details, Upload Photos
              ↓
        Submit → Status: PENDING
              ↓
        Wait for Admin Approval
              ↓
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
    APPROVED                   REJECTED
        │                         │
  Property LIVE              Fix & Resubmit
        │                         │
   Visible to Public          Not Visible
              ↓
        Monitor Enquiries (/owner/dashboard)
              ↓
        END
```

### 🔴 Admin Flow (Full Control)

```
START → Admin Login (/auth/admin-login)
              ↓
        Admin Dashboard (/admin/dashboard)
              ↓
        ┌────────────┬────────────┬────────────┐
        │            │            │            │
        ▼            ▼            ▼            ▼
  View Stats   Pending      All Users    Payment
               Approvals                  History
        │            │            │            │
        │            ▼            │            │
        │     Review Property     │            │
        │            │            │            │
        │      ┌─────┴─────┐      │            │
        │      │           │      │            │
        │      ▼           ▼      │            │
        │  APPROVE     REJECT     │            │
        │      │           │      │            │
        │      ▼           ▼      │            │
        │  Goes Live   Hidden     │            │
        │      │           │      │            │
        │      │           │      ▼            │
        │      │           │  Suspend User     │
        │      │           │  Delete User      │
        │      │           │      │            │
        │      └───────────┴──────┘            │
        │            │                         │
        └────────────┴─────────────────────────┘
                     │
                     ▼
                    END
```

---

## Payment & Subscription Flow

```
┌──────────────────────────────────────────────────────────────┐
│                OWNER SUBSCRIPTION FLOW                       │
└──────────────────────────────────────────────────────────────┘

Owner Registration
       ↓
Free Plan Assigned (Default)
       ↓
Owner Visits /owner/subscription
       ↓
Sees Available Plans:
  • Free: £0/mo - 2 properties
  • Basic: £9.99/mo - 5 properties
  • Premium: £19.99/mo - 25 properties
  • Enterprise: £29.99/mo - Unlimited
       ↓
Click "Upgrade Now" on desired plan
       ↓
Redirect to Stripe Checkout
       ↓
Owner Enters Payment Details
       ↓
Payment Successful
       ↓
Stripe Webhook → /api/webhooks/stripe
       ↓
Database Updates:
  • subscriptions table: new record
  • payments table: transaction record
  • user: maxProperties updated
       ↓
Owner Redirected: /owner/dashboard?payment_success=true
       ↓
Subscription Active
       ↓
Owner Can Add More Properties
       ↓
Admin Can View Payment in /admin/payments:
  • Owner name & email
  • Plan type
  • Amount paid
  • Payment date
  • Stripe receipt link
```

---

## Property Approval Workflow

```
┌──────────────────────────────────────────────────────────────┐
│             PROPERTY LISTING LIFECYCLE                       │
└──────────────────────────────────────────────────────────────┘

Owner Creates New Property
       ↓
Fills Form:
  • Title, Location, Pricing
  • Upload Images (Hero + Gallery)
  • Add Amenities
  • Add Description
       ↓
Clicks "Submit"
       ↓
┌────────────────────────┐
│ Database Record Created│
│  status: "pending"     │
│  isPublished: false    │
│  ownerId: [owner-id]   │
└────────────────────────┘
       ↓
Property Appears in:
  • Owner Dashboard (/owner/properties) ✅
  • Public Site (/properties) ❌
  • Admin Approvals (/admin/properties/approvals) ✅
       ↓
Admin Reviews Property
       ↓
       ┌────────────┴────────────┐
       │                         │
       ▼                         ▼
┌─────────────┐           ┌─────────────┐
│   APPROVE   │           │   REJECT    │
│ (Click Btn) │           │ (Click Btn) │
└──────┬──────┘           └──────┬──────┘
       │                         │
       ▼                         ▼
Database Update:           Database Update:
status: "approved"         status: "rejected"
approvedBy: [admin-id]     rejectionReason: "..."
approvedAt: [timestamp]    approvedAt: null
isPublished: true          isPublished: false
       │                         │
       ▼                         ▼
Property Now Visible:      Property Hidden:
  • Public Site ✅              • Public Site ❌
  • Owner Dashboard ✅          • Owner Dashboard ✅
  • Search Results ✅           • Search Results ❌
       │                         │
       │                         ▼
       │                   Owner Can:
       │                     • View reason
       │                     • Edit & resubmit
       │                     • Back to PENDING
       │                         │
       └─────────────┬───────────┘
                     │
                     ▼
              Property Active
                     │
       Owner Can Manage:
         • Edit details
         • Update photos
         • View enquiries
         • Check analytics
```

---

## Database Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                          │
└─────────────────────────────────────────────────────────────┘

┌──────────┐
│   USER   │
├──────────┤
│ id (PK)  │───────────────┐
│ email    │               │
│ name     │               │
│ role     │               │ 1:Many
│ phone    │               │
└──────────┘               │
                           │
                           ▼
              ┌────────────────────┐
              │    PROPERTIES      │
              ├────────────────────┤
              │ id (PK)            │
              │ ownerId (FK)       │───┐
              │ title              │   │
              │ location           │   │
              │ status             │   │ Owned By
              │ approvedBy (FK)    │───┘
              │ approvedAt         │
              │ rejectionReason    │
              │ isPublished        │
              └────────────────────┘
                           │
                           │ 1:Many
                           │
                           ▼
              ┌────────────────────┐
              │  PROPERTY_IMAGES   │
              ├────────────────────┤
              │ id (PK)            │
              │ propertyId (FK)    │
              │ imageURL           │
              │ caption            │
              └────────────────────┘

┌──────────┐
│   USER   │
├──────────┤
│ id (PK)  │───────────────┐
└──────────┘               │
                           │ 1:Many
                           │
                           ▼
              ┌────────────────────┐
              │   SUBSCRIPTIONS    │
              ├────────────────────┤
              │ id (PK)            │
              │ userId (FK)        │
              │ stripeSubId        │
              │ planName           │
              │ status             │
              │ amount             │
              │ currentPeriodEnd   │
              └────────────────────┘
                           │
                           │ 1:Many
                           │
                           ▼
              ┌────────────────────┐
              │     PAYMENTS       │
              ├────────────────────┤
              │ id (PK)            │
              │ userId (FK)        │
              │ amount             │
              │ status             │
              │ stripePaymentId    │
              │ createdAt          │
              └────────────────────┘
```

---

## Role Permissions Matrix

```
┌─────────────────────────────────────────────────────────────┐
│               ROLE PERMISSIONS MATRIX                       │
└─────────────────────────────────────────────────────────────┘

ACTION                          | VISITOR | OWNER | ADMIN |
────────────────────────────────┼─────────┼───────┼───────┤
Browse Approved Properties      |    ✅   |   ✅  |   ✅  |
View Property Details           |    ✅   |   ✅  |   ✅  |
Send Enquiry Form               |    ✅   |   ✅  |   ✅  |
────────────────────────────────┼─────────┼───────┼───────┤
Register as Owner               |    ❌   |   -   |   -   |
Pay for Subscription            |    ❌   |   ✅  |   ❌  |
Add New Property                |    ❌   |   ✅  |   ❌  |
Edit Own Property               |    ❌   |   ✅  |   ❌  |
Delete Own Property             |    ❌   |   ✅  |   ❌  |
View Own Dashboard              |    ❌   |   ✅  |   -   |
View Own Payments               |    ❌   |   ✅  |   -   |
────────────────────────────────┼─────────┼───────┼───────┤
Approve/Reject Listings         |    ❌   |   ❌  |   ✅  |
View All Properties             |    ❌   |   ❌  |   ✅  |
View All Users                  |    ❌   |   ❌  |   ✅  |
View All Payments               |    ❌   |   ❌  |   ✅  |
Delete Any User                 |    ❌   |   ❌  |   ✅  |
Suspend Owner                   |    ❌   |   ❌  |   ✅  |
Change Listing Status           |    ❌   |   ❌  |   ✅  |
Access Admin Dashboard          |    ❌   |   ❌  |   ✅  |
────────────────────────────────┼─────────┼───────┼───────┤
Book Property (REMOVED)         |    ❌   |   ❌  |   ❌  |
Checkout/Payment (REMOVED)      |    ❌   |   ❌  |   ❌  |
```

---

## API Endpoint Map

```
┌─────────────────────────────────────────────────────────────┐
│                   API ENDPOINTS                             │
└─────────────────────────────────────────────────────────────┘

PUBLIC ENDPOINTS (No Auth Required)
───────────────────────────────────
GET  /api/properties              → List approved properties
GET  /api/properties?slug=[slug]  → Get single property by slug
POST /api/enquiries               → Submit enquiry form

OWNER ENDPOINTS (Owner + Admin)
───────────────────────────────────
GET  /api/owner/dashboard         → Owner dashboard data
GET  /api/owner/properties        → List owner's properties
POST /api/owner/properties/create → Add new property (status=pending)
PUT  /api/owner/properties/[id]   → Update own property
DELETE /api/owner/properties/[id] → Delete own property
GET  /api/owner/payment-history   → View own payments

SUBSCRIPTION ENDPOINTS (Owner + Admin)
───────────────────────────────────────
POST /api/subscriptions/checkout-session → Create Stripe checkout
GET  /api/subscriptions/status            → Get subscription status
POST /api/subscriptions/cancel            → Cancel subscription
POST /api/subscriptions/switch-plan       → Change plan

ADMIN ENDPOINTS (Admin Only)
───────────────────────────────────
GET  /api/admin/stats              → Admin dashboard statistics
GET  /api/admin/users              → List all users
DELETE /api/admin/users?id=[id]    → Delete user
GET  /api/admin/transactions       → All payment transactions
GET  /api/admin/properties/pending → Pending approvals
POST /api/admin/properties/[id]/approve → Approve property
POST /api/admin/properties/[id]/reject  → Reject property

WEBHOOK ENDPOINTS (Stripe)
───────────────────────────────────
POST /api/webhooks/stripe          → Stripe payment webhooks
```

---

## Status Badges Reference

```
┌─────────────────────────────────────────────────────────────┐
│                 PROPERTY STATUS BADGES                      │
└─────────────────────────────────────────────────────────────┘

🟡 PENDING
   → Awaiting admin review
   → Not visible to public
   → Owner can view/edit
   → Admin can approve/reject

🟢 APPROVED
   → Live on website
   → Visible to public
   → Owner can edit
   → Appears in search results

🔴 REJECTED
   → Not approved by admin
   → Hidden from public
   → Owner can see rejection reason
   → Owner can fix and resubmit

───────────────────────────────────────────────────────────────

SUBSCRIPTION STATUS BADGES

✅ ACTIVE
   → Subscription is current
   → All features unlocked
   → Payment successful

⚠️ PAST_DUE
   → Payment failed
   → Retry payment
   → Features may be limited

❌ CANCELLED
   → Subscription ended
   → Reactivate to add properties

⏰ EXPIRED
   → Trial or subscription ended
   → Upgrade to continue
```

---

## File Structure Overview

```
escape-houses-1-main/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/        → Admin main dashboard
│   │   │   ├── properties/       → Property management
│   │   │   │   └── approvals/    → Pending approvals
│   │   │   ├── payments/         → View all subscriptions
│   │   │   └── bookings/         → View enquiries
│   │   │
│   │   ├── owner/
│   │   │   ├── dashboard/        → Owner main dashboard
│   │   │   ├── properties/       → Manage properties
│   │   │   │   ├── new/          → Add new property
│   │   │   │   └── [id]/edit/    → Edit property
│   │   │   ├── subscription/     → Manage subscription
│   │   │   └── payments/         → View payment history
│   │   │
│   │   ├── properties/
│   │   │   ├── page.tsx          → Public property listing
│   │   │   └── [slug]/           → Property detail page
│   │   │
│   │   ├── api/
│   │   │   ├── admin/            → Admin-only APIs
│   │   │   ├── owner/            → Owner+Admin APIs
│   │   │   ├── properties/       → Public property APIs
│   │   │   ├── subscriptions/    → Subscription APIs
│   │   │   └── webhooks/         → Stripe webhooks
│   │   │
│   │   └── auth/                 → Authentication pages
│   │
│   ├── components/
│   │   ├── PropertyCard.tsx      → Property card (UPDATED)
│   │   ├── EnquiryForm.tsx       → Contact form
│   │   ├── Header.tsx            → Site header
│   │   └── ProtectedRoute.tsx    → Role-based protection
│   │
│   ├── lib/
│   │   ├── auth-roles.ts         → Role definitions
│   │   ├── rbac-utils.ts         → Permission utilities
│   │   ├── api-auth.ts           → API protection
│   │   ├── subscription-plans.ts → Plan definitions
│   │   └── stripe-client.ts      → Stripe integration
│   │
│   └── db/
│       └── schema.ts              → Database schema
│
└── Documentation/
    ├── SYSTEM_CONFIGURATION_COMPLETE.md  → Full system docs
    ├── QUICK_START_PLATFORM_GUIDE.md     → Quick reference
    └── VISUAL_SYSTEM_OVERVIEW.md         → This file
```

---

**Last Updated:** January 10, 2026  
**System Type:** Property Listing Platform (Admin-Approved)  
**Status:** ✅ Fully Configured & Operational
