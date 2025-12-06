# 🚀 Quick Start - Email Verification System

## Immediate Setup (2 Minutes)

### 1. Add Environment Variables

Create/update `.env` file:

```env
# Resend (get free key at https://resend.com)
RESEND_API_KEY=re_your_key_here

# Database
TURSO_CONNECTION_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test Sign-In Flow

Open: `http://localhost:3000/auth/sign-in`

**Without Resend API Key (Development Mode):**
1. Enter any email: `test@example.com`
2. Check terminal for OTP code: `📧 OTP Code: 123456`
3. Enter the 6-digit code from terminal
4. ✅ Done! Auto-logged in

**With Resend API Key (Production Mode):**
1. Enter your real email
2. Check your inbox for OTP email
3. Enter the 6-digit code
4. ✅ Done! Auto-logged in

---

## 📧 Email Preview

Your users will receive this beautiful email:

```
┌─────────────────────────────────────────┐
│  🔐 Your Sign-In Code                   │
│  [Green Header with Brand Color]        │
├─────────────────────────────────────────┤
│                                         │
│  Hello,                                 │
│                                         │
│  You requested to sign in to your      │
│  Group Escape Houses account.          │
│                                         │
│  ╔═════════════════════════════╗        │
│  ║                             ║        │
│  ║        1 2 3 4 5 6         ║        │
│  ║                             ║        │
│  ╚═════════════════════════════╝        │
│                                         │
│  This code expires in 10 minutes.      │
│                                         │
│  ⚠️  If you didn't request this,       │
│     your account is safe. Ignore.      │
│                                         │
├─────────────────────────────────────────┤
│  Group Escape Houses                    │
│  11a North Street, Brighton BN41 1DH    │
└─────────────────────────────────────────┘
```

**From:** `noreply@groupescapehouses.co.uk`  
**Subject:** Your Sign-In Code - Group Escape Houses

---

## 🎯 What You Get

✅ **Passwordless Login Option** - Users can sign in with just email + OTP  
✅ **Password Support** - Existing users enter password after OTP  
✅ **Auto Account Creation** - New users auto-registered on first OTP  
✅ **Beautiful Emails** - Professional branded HTML templates  
✅ **Fallback Mode** - Works without email (console logging)  
✅ **Secure Sessions** - 30-day HTTP-only cookies  
✅ **Role-Based Redirects** - Owners, Admins, Guests to correct dashboards  
✅ **No Domain Issues** - Uses your existing verified domain only

---

## 🔗 Key URLs

- **Sign-In Page:** `/auth/sign-in`
- **Send OTP API:** `/api/auth/send-otp`
- **Verify OTP API:** `/api/auth/verify-otp`
- **Create Session API:** `/api/auth/create-session`

---

## ⚡ Testing Shortcuts

### Test New User:
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com"}'
```

### Test Existing User:
1. Register account at `/register`
2. Use `/auth/sign-in` with same email
3. Verify OTP, then enter password

---

## 🐛 Common Issues

**"API key is invalid"**
- ➡️ Add valid `RESEND_API_KEY` to `.env`
- ➡️ OR ignore and use console OTP fallback

**"Database connection timeout"**
- ➡️ Check `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`
- ➡️ Restart server after updating `.env`

**OTP not in email**
- ➡️ Check spam folder
- ➡️ Use console fallback for testing
- ➡️ Verify domain in Resend dashboard

---

## 📖 Full Documentation

See `EMAIL_VERIFICATION_COMPLETE.md` for:
- Complete authentication flow details
- Production deployment guide
- Security features
- Troubleshooting
- Database schema
- API documentation

---

## ✅ Verification Checklist

Before going live:

- [ ] Test with development mode (console OTP)
- [ ] Add Resend API key
- [ ] Test with real email
- [ ] Verify OTP arrives within 5 seconds
- [ ] Test expired code handling
- [ ] Test wrong code entry
- [ ] Test new user registration
- [ ] Test existing user login
- [ ] Test role-based redirects
- [ ] Test session persistence

---

**🎉 Your email verification system is ready to use!**

Start testing now: `http://localhost:3000/auth/sign-in`
