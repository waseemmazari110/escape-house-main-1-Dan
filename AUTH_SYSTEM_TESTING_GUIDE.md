# Authentication System Testing Guide

## ✅ Completed Implementation

### New Components & Pages
1. **AuthModal Component** (`src/components/AuthModal.tsx`)
   - Unified modal for guest and owner authentication
   - Login/Register mode switching
   - Guest/Owner tabs
   - Cyan-themed design matching groupaccommodation.com samples
   - Rounded inputs, terms checkbox, password visibility toggle

2. **Email Verification System**
   - Token generation: `/api/auth/send-verification`
   - Token validation: `/api/auth/verify-email`
   - Verification page: `/verify-email`
   - 24-hour token expiration

3. **Password Reset System**
   - Request reset: `/forgot-password` page
   - Reset token generation: `/api/auth/forgot-password`
   - Complete reset: `/reset-password` page
   - Reset token validation: `/api/auth/reset-password`

4. **Email Service**
   - Resend API integration: `/api/email/send`
   - Verification emails
   - Password reset emails

5. **Header Integration**
   - Desktop login/register buttons open AuthModal
   - Mobile menu login/register buttons open AuthModal
   - AuthModal rendered with state management

## 🔧 Environment Setup Required

### 1. Email Configuration (.env)
```bash
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

**To get Resend API key:**
1. Sign up at https://resend.com
2. Create an API key in dashboard
3. Add to `.env` file

### 2. Database Schema
The verification table should already exist from Drizzle migrations. Verify with:
```bash
# Check if verification table exists
npm run db:studio
```

## 🧪 Testing Flows

### Test 1: Guest Registration with Email Verification
1. Navigate to http://localhost:3000
2. Click "Sign Up" or "Register" button
3. AuthModal opens with Guest tab selected
4. Enter email: `test-guest@example.com`
5. Enter name: `Test Guest`
6. Enter password (min 8 chars)
7. Check "I agree to terms" checkbox
8. Click "Sign Up" button
9. **Expected:** Registration success message
10. **Expected:** Verification email sent to inbox
11. Open verification email and click link
12. **Expected:** Redirected to `/verify-email?token=...`
13. **Expected:** Success message: "Your email has been verified!"
14. Click "Go to Login"
15. Login with same credentials
16. **Expected:** Redirected to home page as authenticated guest

### Test 2: Owner Registration with Email Verification
1. Navigate to http://localhost:3000
2. Click "Log In" button
3. AuthModal opens - click "Owner" tab
4. Click "Register" at bottom of modal
5. Enter email: `test-owner@example.com`
6. Enter name: `Test Owner`
7. Enter password
8. Check terms checkbox
9. Click "Sign Up"
10. **Expected:** Success message
11. **Expected:** Verification email sent
12. Verify email via link
13. Login as owner
14. **Expected:** Redirected to `/owner/dashboard`

### Test 3: Password Reset Flow
1. Navigate to http://localhost:3000
2. Click "Log In"
3. AuthModal opens - click "Forgot password?" link
4. **Expected:** Redirected to `/forgot-password`
5. Enter email: `test-guest@example.com`
6. Click "Send Reset Link"
7. **Expected:** Success message "Check your email"
8. Open password reset email and click link
9. **Expected:** Redirected to `/reset-password?token=...`
10. Enter new password (min 8 chars)
11. Enter confirm password (must match)
12. Click "Reset Password"
13. **Expected:** Success message
14. Click "Back to Login"
15. Login with new password
16. **Expected:** Successful login

### Test 4: Modal UI Flow
1. Open AuthModal from Header
2. **Check:** Guest tab active by default
3. **Check:** Login mode by default
4. Click "Register" - **Check:** switches to register form
5. Click "Owner" tab - **Check:** switches to owner login
6. Click "Register" - **Check:** shows owner registration
7. Click "Guest" tab - **Check:** returns to guest registration
8. Click X button - **Check:** modal closes
9. Click outside modal - **Check:** modal closes

## ⚠️ Known Limitations

### Email Sending
- Resend API key must be configured for emails to send
- Without API key, registration/reset will work but emails won't send
- Test with real email addresses for full flow verification

### Multi-Property Support
- ⚠️ **NOT YET IMPLEMENTED**
- Owner dashboard needs property listing UI
- Database schema needs properties relationship table
- Owner can register but can't manage multiple properties yet

## 🚀 Next Steps

### Priority 1: Remove Old Auth Pages
The following pages are now obsolete and should be removed:
- ❌ `/app/login/page.tsx`
- ❌ `/app/register/page.tsx`
- ❌ `/app/owner/login/page.tsx`
- ❌ `/app/owner/signup/page.tsx`

**Action:**
```bash
# Delete old auth page directories
rm -r src/app/login
rm -r src/app/register
rm -r src/app/owner/login
rm -r src/app/owner/signup
```

### Priority 2: Configure Email Service
1. Sign up for Resend account
2. Add API key to `.env`
3. Test email sending with real addresses
4. Customize email templates in verification/reset APIs

### Priority 3: Multi-Property Implementation
**Database Schema Changes:**
```typescript
// Add to src/db/schema.ts
export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").references(() => user.id).notNull(),
  name: text("name").notNull(),
  address: text("address"),
  description: text("description"),
  maxGuests: integer("max_guests"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  pricePerNight: integer("price_per_night"), // in cents
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
```

**Owner Dashboard Updates:**
- List all properties for logged-in owner
- Add property button → property creation form
- Edit property functionality
- Delete property functionality
- Property analytics (bookings, revenue)

### Priority 4: Testing & Polish
- [ ] Test all auth flows with real email service
- [ ] Add loading states to AuthModal
- [ ] Add error boundaries for auth failures
- [ ] Test on mobile devices
- [ ] Add rate limiting to prevent spam
- [ ] Add reCAPTCHA to registration forms
- [ ] Add session management (logout from all devices)
- [ ] Add email change functionality with verification

## 🐛 Troubleshooting

### Issue: Modal doesn't open
**Fix:** Check browser console for errors, verify AuthModal import in Header.tsx

### Issue: Emails not sending
**Fix:** Verify RESEND_API_KEY in .env, check `/api/email/send` endpoint logs

### Issue: "Invalid origin" errors
**Fix:** Ensure trustedOrigins in `src/lib/auth.ts` includes your access URL

### Issue: Token expired
**Fix:** Tokens expire after 24 hours. Request new verification/reset email

### Issue: TypeScript errors for lucide-react
**Fix:** This is just type checking - code still runs. Optionally install:
```bash
npm install --save-dev @types/lucide-react --legacy-peer-deps
```

## 📝 Design Specifications

### AuthModal Design (from groupaccommodation.com samples)
- **Colors:**
  - Primary button: Cyan (#17a2b8)
  - Secondary button: White with cyan border
  - Text: Dark gray (#333)
  - Background: White
  - Overlay: rgba(0,0,0,0.5)

- **Layout:**
  - Max width: 500px
  - Padding: 32px
  - Border radius: 12px
  - Input border radius: 8px
  - Button border radius: 8px

- **Typography:**
  - Heading: 24px bold
  - Body: 14px regular
  - Link: 14px underline on hover

## 🔗 Related Documentation
- [Better Auth Docs](https://www.better-auth.com/)
- [Resend API Docs](https://resend.com/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
