# Configuration Guide

## Issues Fixed

### 1. Database Timestamp Format Error
**Problem:** Database was receiving JavaScript `Date` objects instead of Unix timestamps  
**Solution:** All user table updates now use `Math.floor(Date.now() / 1000)` for integer timestamps

### 2. Email Service Configuration
**Problem:** Invalid Resend API key causing email failures  
**Solution:** Added proper error handling and fallback behavior

## Required Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database (Turso)
TURSO_CONNECTION_URL=your_turso_connection_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# Authentication
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setting Up Email Service (Resend)

### Option 1: Use Resend (Recommended for Production)

1. **Create Resend Account:**
   - Go to https://resend.com/
   - Sign up for a free account (3,000 emails/month free tier)

2. **Get API Key:**
   - Go to API Keys section
   - Create a new API key
   - Copy the key and add to `.env`:
     ```env
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     ```

3. **Verify Domain:**
   - Go to Domains section
   - Add `groupescapehouses.co.uk`
   - Follow DNS verification steps
   - Or use Resend's testing domain: `onboarding@resend.dev`

4. **Update Email Addresses (if using test domain):**
   In `src/lib/email.ts`, temporarily change:
   ```typescript
   from: 'Group Escape Houses <onboarding@resend.dev>',
   ```

### Option 2: Development Without Email Service

If you don't have a Resend API key yet, the app will still work:

1. **Leave RESEND_API_KEY empty or unset**
2. **Check Console for Links:**
   - Verification links will be logged to console
   - Password reset links will be logged to console
   - Example:
     ```
     ⚠️ RESEND_API_KEY not configured - verification email not sent
     Verification link (for development): http://localhost:3000/verify-email?token=...
     ```

3. **Use the Console Links:**
   - Copy the link from terminal
   - Paste in browser to verify/reset

## Database Connection Issues

### If Turso Database Times Out:

1. **Check Connection:**
   ```bash
   # Test database connection
   curl -H "Authorization: Bearer $TURSO_AUTH_TOKEN" $TURSO_CONNECTION_URL
   ```

2. **Verify Environment Variables:**
   - Ensure `.env` file exists
   - Check that variables don't have quotes or extra spaces
   - Restart dev server after changing `.env`

3. **Check Turso Status:**
   - Login to Turso dashboard
   - Verify database is active
   - Check if there are rate limits

4. **Alternative: Use Local SQLite:**
   If Turso is having issues, you can temporarily use local SQLite:
   
   In `src/db/index.ts`:
   ```typescript
   const client = createClient({
     url: 'file:local.db', // Local SQLite file
   });
   ```

## Testing the Fixes

### 1. Test Contact Form (Localhost Spam Protection):
```bash
# Start dev server
npm run dev

# Submit contact form at http://localhost:3000/contact
# Should now work without 429 error
```

### 2. Test User Registration:
```bash
# Register at http://localhost:3000/register
# Check terminal for verification link
# Or check email if RESEND_API_KEY is configured
```

### 3. Test Password Reset:
```bash
# Request reset at http://localhost:3000/forgot-password
# Check terminal for reset link
# Or check email if RESEND_API_KEY is configured
```

### 4. Test Owner Signup:
```bash
# Register as owner at http://localhost:3000/owner/signup
# Complete signup form
# Should now work without timestamp error
```

## Verification Email Setup

The app now sends verification emails automatically after:
- User registration
- Password reset requests
- Owner signup

Email templates include:
- Branded design with your colors (#89A38F sage green)
- Clear call-to-action buttons
- Fallback text links
- Professional footer with business address

## Common Issues

### Issue: "API key is invalid"
**Solution:** Check your RESEND_API_KEY in `.env` file

### Issue: "Failed query: update user..."
**Solution:** Fixed! Timestamps now use Unix format (seconds)

### Issue: "Connect Timeout Error"
**Solution:** Check Turso database connection and credentials

### Issue: Emails not sending in development
**Solution:** This is normal if RESEND_API_KEY is not set. Use console links instead.

## Production Checklist

Before deploying:
- [ ] Set up Resend account with verified domain
- [ ] Add production RESEND_API_KEY to environment
- [ ] Verify TURSO database is production instance
- [ ] Set NEXT_PUBLIC_APP_URL to production domain
- [ ] Test email sending in production environment
- [ ] Configure NODE_ENV=production (removes spam protection bypass)

## Support

If you continue to have issues:
1. Check terminal console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database schema matches the code
4. Test with a fresh browser session (clear cookies)
