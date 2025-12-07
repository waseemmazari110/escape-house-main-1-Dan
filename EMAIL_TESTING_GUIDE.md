# 🧪 Gmail SMTP Email Testing Guide

## Quick Test Scenarios

### ✅ Test 1: Guest Account Registration with Email Verification

1. **Navigate**: Go to `http://localhost:3000/register`
2. **Fill Form**:
   - Name: `Test User`
   - Email: Your test email (e.g., `your-email@gmail.com`)
   - Password: `Test1234!`
   - Confirm Password: `Test1234!`
3. **Submit**: Click "Create Account"
4. **Expected Results**:
   - ✅ Toast: "Account created successfully! Please check your email for verification."
   - ✅ Redirect to `/login?registered=true`
   - ✅ Email received with subject: "Verify Your Email - Group Escape Houses"
   - ✅ Email sent from: `groupescapehouses.co.uk`
5. **Check Console**: Should see `✅ Verification email sent to <email>`

### ✅ Test 2: Owner Account Registration with Email Verification

1. **Navigate**: Go to `http://localhost:3000/owner/signup`
2. **Fill Form**:
   - Name: `Test Owner`
   - Email: Your test email
   - Phone: `+44 1234567890`
   - Company Name: `Test Company`
   - Password: `Owner1234!`
   - Confirm Password: `Owner1234!`
   - ☑️ Agree to Terms
3. **Submit**: Click "Create Owner Account"
4. **Expected Results**:
   - ✅ Toast: "Owner account created successfully! Please check your email for verification."
   - ✅ Redirect to `/owner/login?registered=true`
   - ✅ Email received with verification link
   - ✅ Console log: `✅ Verification email sent to owner`

### ✅ Test 3: OTP Sign-In Flow

1. **Navigate**: Go to `http://localhost:3000/auth/sign-in`
2. **Enter Email**: Type your email address
3. **Click**: "Continue with Email"
4. **Expected Results**:
   - ✅ Toast: "Verification code sent to your email!"
   - ✅ UI shows OTP input field
   - ✅ Email received with 6-digit code
   - ✅ Subject: "Your Sign-In Code - Group Escape Houses"
   - ✅ Console log: `✅ OTP email sent to <email>`
5. **Enter OTP**: Type the 6-digit code from email
6. **Expected**: Successfully signed in

### ✅ Test 4: Forgot Password Flow

1. **Navigate**: Go to `http://localhost:3000/forgot-password`
2. **Enter Email**: Type registered email
3. **Submit**: Click "Send Reset Link"
4. **Expected Results**:
   - ✅ Toast: "Password reset link sent to your email"
   - ✅ Email received with reset button
   - ✅ Subject: "Reset Your Password - Group Escape Houses"
   - ✅ Console log: `✅ Password reset email sent to: <email>`
5. **Click Link**: Should open `/reset-password?token=...`
6. **Set New Password**: Enter and confirm new password
7. **Expected**: Password updated successfully

## 📧 Email Verification Checklist

### Email Content Checks

#### Verification Email
- [ ] Subject: "Verify Your Email - Group Escape Houses"
- [ ] From: "Group Escape Houses" <groupescapehouses.co.uk>
- [ ] Header: Sage green (#89A38F) with white text
- [ ] Button: "Verify Email Address" (clickable)
- [ ] Link: Also provided as plain text
- [ ] Footer: Business address and copyright
- [ ] Note: "Link expires in 24 hours"

#### OTP Email
- [ ] Subject: "Your Sign-In Code - Group Escape Houses"
- [ ] 6-digit code displayed in large font
- [ ] Code: Monospace font, centered
- [ ] Note: "Code expires in 10 minutes"
- [ ] Security notice present

#### Password Reset Email
- [ ] Subject: "Reset Your Password - Group Escape Houses"
- [ ] Button: "Reset Password" (clickable)
- [ ] Security warning displayed
- [ ] Note: "Link expires in 1 hour"

## 🔍 Console Logs to Look For

### Successful Email Send
```
✅ Email sent successfully: <message-id>
Gmail SMTP server is ready to send emails
✅ Verification email sent to <email>
✅ OTP email sent to <email>
✅ Password reset email sent to: <email>
```

### Email Errors (Fallback Mode)
```
❌ Failed to send email: <error>
📧 OTP Code for <email>: 123456 (fallback)
Password reset link (fallback): http://localhost:3000/reset-password?token=...
```

## 🐛 Troubleshooting

### No Email Received?

1. **Check Spam Folder**: Gmail might flag first email
2. **Check Console**: Look for error messages
3. **Verify Environment Variable**:
   ```bash
   # Check .env file
   cat .env | grep GMAIL_SMTP_APP_PASSWORD
   ```
4. **Check Gmail Account**: Ensure not locked/suspended
5. **Test Gmail Login**: Try logging into Gmail manually

### TypeScript Errors?

```bash
# Reinstall nodemailer types
npm install --save-dev @types/nodemailer

# Restart VS Code TypeScript server
# Press Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Email Shows "Sent from groupescapehouses.co.uk"

This is expected! Gmail doesn't allow custom FROM addresses without domain verification. Recipients will see:
- **Name**: "Group Escape Houses"
- **Email**: groupescapehouses.co.uk

To use custom domain (noreply@groupescapehouses.co.uk), you need:
1. Google Workspace account
2. Domain verification
3. SPF/DKIM records

## 📊 Testing Matrix

| Test Scenario | Email Type | Expiry | Status |
|--------------|-----------|--------|--------|
| Guest Registration | Verification Link | 24h | ⬜ Not Tested |
| Owner Registration | Verification Link | 24h | ⬜ Not Tested |
| OTP Sign-In | 6-Digit Code | 10m | ⬜ Not Tested |
| Forgot Password | Reset Link | 1h | ⬜ Not Tested |

Check boxes after successful testing!

## 🎯 Success Criteria

✅ All emails delivered within 30 seconds
✅ HTML formatting displays correctly
✅ Links are clickable and work
✅ Tokens expire as expected
✅ Console logs show success messages
✅ No error messages in terminal
✅ Users can complete full auth flow

## 📝 Test Results Template

```
Date: _____________
Tester: _____________

Test 1 - Guest Registration:
- Email Received: Yes / No
- Time to Receive: ____ seconds
- Link Works: Yes / No
- Notes: _________________________

Test 2 - Owner Registration:
- Email Received: Yes / No
- Time to Receive: ____ seconds
- Link Works: Yes / No
- Notes: _________________________

Test 3 - OTP Sign-In:
- Email Received: Yes / No
- Time to Receive: ____ seconds
- Code Works: Yes / No
- Notes: _________________________

Test 4 - Forgot Password:
- Email Received: Yes / No
- Time to Receive: ____ seconds
- Link Works: Yes / No
- Notes: _________________________
```

## 🚀 Production Deployment Tests

Before going live, test:
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Add `GMAIL_SMTP_APP_PASSWORD` to hosting environment
- [ ] Send test email from production
- [ ] Verify links point to production domain
- [ ] Check email deliverability rates
- [ ] Monitor Gmail sending limits

## 📞 Support

If you encounter issues:
1. Check terminal console for error messages
2. Verify `.env` configuration
3. Test Gmail credentials manually
4. Check Gmail app password status
5. Review `GMAIL_SMTP_SETUP_COMPLETE.md` for detailed troubleshooting

---

**Ready to test!** Start with Test 1 (Guest Registration) and work through all scenarios.
