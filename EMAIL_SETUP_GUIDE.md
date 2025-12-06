# Email Configuration Guide

## 🚨 Current Issues Fixed

### 1. ✅ Spam Protection Blocking Localhost
**Problem:** Your spam protection was blocking `::1` (IPv6 localhost)
**Solution:** Added localhost whitelist in development mode

The system now recognizes these IPs as development/local:
- `127.0.0.1`
- `::1` 
- `localhost`
- `::ffff:127.0.0.1`

**Result:** Forms will work in development without triggering spam blocks.

---

## 📧 Email Setup Required

### Issue: No Emails Being Sent

Your `.env` file has a placeholder value:
```
RESEND_API_KEY=your_resend_api_key_here
```

**You need a real Resend API key for emails to work.**

---

## 🔧 How to Set Up Email (Resend)

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Sign up for free account
3. Verify your email

### Step 2: Get API Key

1. Login to Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name: "Escape Houses Production"
5. Copy the API key (starts with `re_...`)

### Step 3: Add Domain (For Production)

**For Development/Testing:**
- Use Resend's default domain (no setup needed)
- Emails will come from `onboarding@resend.dev`

**For Production:**
1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain: `groupescapehouses.co.uk`
4. Add the DNS records shown:
   - SPF record
   - DKIM record
   - Return-Path record
5. Wait for verification (usually 5-15 minutes)

### Step 4: Update .env File

Open `.env` and replace the placeholder:

```env
# BEFORE:
RESEND_API_KEY=your_resend_api_key_here

# AFTER:
RESEND_API_KEY=re_YourActualAPIKeyHere123456789
```

### Step 5: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🧪 Test Email Functionality

### Test 1: Contact Form

1. Go to http://localhost:3000/contact
2. Fill out the form completely
3. Submit
4. **Check terminal output:**
   ```
   ✅ Contact email sent successfully: email_id_here
   ```
5. **Check Resend dashboard:**
   - Go to https://resend.com/emails
   - You should see the sent email

### Test 2: Property Enquiry

1. Go to any property page
2. Click "Enquire Now" or similar
3. Fill out enquiry form
4. Submit
5. Check terminal and Resend dashboard

### Test 3: Owner Signup (If implemented)

1. Register as owner
2. Should receive verification email
3. Check inbox and spam folder

---

## 📨 Email Templates Currently Set Up

Your system sends these emails:

### 1. **Contact Form** (`sendContactEmail`)
- **From:** `enquiries@groupescapehouses.co.uk`
- **To:** `hello@groupescapehouses.co.uk`
- **Trigger:** Contact form submission
- **Location:** `/api/contact`

### 2. **Property Enquiry** (`sendEnquiryEmail`)
- **From:** `enquiries@groupescapehouses.co.uk`
- **To:** `hello@groupescapehouses.co.uk`
- **Trigger:** Property enquiry form
- **Location:** `/api/enquiry`

### 3. **Welcome Email** (if configured)
- Owner registration welcome

### 4. **Password Reset** (if configured)
- Password reset link

---

## 🔐 Email Verification Setup (Phase 1 TODO)

To add email verification for owner signups:

### Create Verification Email Template

```typescript
// In src/lib/email.ts

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link expires in 24 hours.</p>
      </body>
    </html>
  `;

  await resend.emails.send({
    from: 'Group Escape Houses <noreply@groupescapehouses.co.uk>',
    to: email,
    subject: 'Verify your email address',
    html: htmlContent,
  });
}
```

### Add to Owner Signup

```typescript
// In src/app/api/owner/complete-signup/route.ts

import { sendVerificationEmail } from "@/lib/email";

// After creating user:
const verificationToken = generateToken(); // Implement this
await sendVerificationEmail(updatedUser.email, verificationToken);
```

---

## 🚨 Troubleshooting

### Email Not Sending

**Check 1: API Key**
```bash
# Check if API key is set
echo $env:RESEND_API_KEY  # Windows PowerShell
```

**Check 2: Terminal Errors**
Look for:
```
❌ Failed to send enquiry email: [error details]
```

**Check 3: Resend Dashboard**
- Go to https://resend.com/emails
- Check for failed emails
- View error messages

### Common Errors

**Error: "API key is invalid"**
- Check API key in `.env` is correct
- Restart dev server after changing `.env`

**Error: "Domain not verified"**
- In development: Change `from:` to use `@resend.dev`
- In production: Verify domain in Resend dashboard

**Error: "Rate limit exceeded"**
- Free plan: 100 emails/day
- Paid plan: Higher limits

---

## 💰 Resend Pricing

**Free Plan:**
- 100 emails/day
- 3,000 emails/month
- All features included
- **Perfect for development and testing**

**Pro Plan ($20/month):**
- 50,000 emails/month
- $1 per 1,000 additional emails
- Custom domains
- Analytics

---

## 📋 Quick Setup Checklist

- [ ] Create Resend account at https://resend.com
- [ ] Get API key from dashboard
- [ ] Update `.env` with real API key: `RESEND_API_KEY=re_...`
- [ ] Restart dev server: `npm run dev`
- [ ] Test contact form at http://localhost:3000/contact
- [ ] Check terminal for "✅ Email sent successfully"
- [ ] Verify email appears in Resend dashboard
- [ ] (Production) Add and verify custom domain
- [ ] (Optional) Set up email verification for owners
- [ ] (Optional) Set up password reset emails

---

## 🎯 What's Working Now

✅ **Spam Protection:**
- Localhost IPs whitelisted in development
- Forms work without triggering spam blocks
- Production spam checks still active

✅ **Email Infrastructure:**
- Resend integration configured
- Email templates ready
- Contact and enquiry forms set up

⏳ **Needs Setup:**
- Add real Resend API key
- Test email delivery
- (Optional) Add email verification
- (Optional) Add password reset

---

## 📞 Support

**Resend Support:**
- Docs: https://resend.com/docs
- Discord: https://resend.com/discord
- Email: support@resend.com

**Your Email Config:**
- Location: `src/lib/email.ts`
- Contact API: `src/app/api/contact/route.ts`
- Enquiry API: `src/app/api/enquiry/route.ts`

---

Once you add the Resend API key, all emails will work automatically! 🚀
