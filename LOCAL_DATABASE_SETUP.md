# Switch to Local SQLite Database (For Testing)

## Instructions

The remote Turso database is experiencing connection timeouts. To test the payment history feature, you can temporarily switch to a local SQLite database.

### Step 1: Create Local Environment Override

Create a new file `.env.local` with the following content:

```env
# Local SQLite Database (for testing only)
TURSO_CONNECTION_URL=file:./local-test.db
TURSO_AUTH_TOKEN=

# Copy all other environment variables from .env
STRIPE_TEST_KEY=sk_test_51SOHHRI0J9sqa21CrO1rABNFbkjGSZHdZO96ABPfIIcJkcXT93cm8tTWs763Wq9ifjre11B4JZbRiugMWBWbpg3j00j0Rxvhhi
STRIPE_WEBHOOK_SECRET=whsec_Op7YCdhiz0fBqi2diFnhQD5j4GZP9oE7
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SOHHRI0J9sqa21Cwr6MvfrvXvzPnZo45DaFzNYDrXJK9PWOMWAhY0IqTwxAmwXHVDZiUr6uPOQRP2QrZ7WEzUvC00DjI5QujS
RESEND_API_KEY=re_UtQp9PQQ_5EcQiPqWLQVsF6rbeA8NA7Eo
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=fGlZzqjKlNfUjNpxER0T9sLlV5vGyRM5
BETTER_AUTH_URL=http://localhost:3000
GMAIL_SMTP_APP_PASSWORD=sqhjkglbaquduicm
GOOGLE_CLIENT_ID=728246446044-d20mgdiul6lfkhqqboas08s2h9t86gpa.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### Step 2: Push Database Schema

```bash
npx drizzle-kit push:sqlite
```

This will create all tables in the local database.

### Step 3: Create Test Admin User

```bash
npx tsx check-dan-user.mjs
```

### Step 4: Create Test Payment Data

```bash
npm run test:transactions
```

This will create 3 sample payments in the local database.

### Step 5: Start Dev Server

```bash
npm run dev
```

### Step 6: Test Payment History

1. Navigate to `http://localhost:3000/admin/dashboard`
2. Login with admin credentials
3. Click "Transactions" tab
4. You should see the 3 test payments

### Step 7: Revert to Production Database

When Turso connection is fixed:

1. Delete `.env.local` file
2. The app will use `.env` file with Turso connection
3. Restart dev server

---

**Note**: `.env.local` overrides `.env` variables, so while it exists, you'll use the local database instead of Turso.
