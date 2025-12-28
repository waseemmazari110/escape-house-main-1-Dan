# Orchards Integration - Environment Configuration

## 🔧 Environment Variables Setup

This guide shows how to configure the Orchards integration for different environments.

---

## 📁 File Location

Create or update: `.env.local` (for local development)

For production, use your hosting provider's environment variable configuration.

---

## 🔑 Required Variables

### 1. API Key Configuration

```env
# Orchards Production API Key
# Request from system administrator
ORCHARDS_API_KEY=orchards_live_key_2025

# Alternative keys for testing
ORCHARDS_STAGING_KEY=orchards_staging_key_2025
ORCHARDS_DEV_KEY=demo_api_key_standard
```

**Usage in code:**
```typescript
// API keys are hardcoded in src/lib/rate-limiter.ts
// Update API_KEYS map for production keys
const API_KEYS = {
  'orchards_live_key_2025': 'premium',
  'orchards_staging_key_2025': 'authenticated',
  'demo_api_key_standard': 'authenticated',
};
```

---

### 2. API Base URL

```env
# Base URL for API endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_API_BASE_URL=https://your-production-domain.com

# Staging
NEXT_PUBLIC_API_BASE_URL=https://your-staging-domain.vercel.app
```

**Usage in Orchards website:**
```javascript
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_ENDPOINT = `${BASE_URL}/api/orchards/properties`;
```

---

### 3. CORS Configuration

**Edit:** `src/app/api/orchards/properties/route.ts` (and other Orchards endpoints)

```typescript
const ORCHARDS_ORIGINS = [
  'https://www.orchards-escapes.co.uk',          // Production
  'https://orchards-escapes.co.uk',              // Production (no www)
  'https://orchards-staging.vercel.app',         // Staging
  'http://localhost:3000',                       // Development (remove in production)
  // Add your domains here:
  'https://your-custom-domain.com',
];
```

**For production, remove localhost:**
```typescript
const ORCHARDS_ORIGINS = process.env.NODE_ENV === 'production'
  ? [
      'https://www.orchards-escapes.co.uk',
      'https://orchards-escapes.co.uk',
    ]
  : [
      'https://www.orchards-escapes.co.uk',
      'https://orchards-escapes.co.uk',
      'https://orchards-staging.vercel.app',
      'http://localhost:3000',
    ];
```

---

### 4. Rate Limiting (Optional)

```env
# Rate limits (requests per minute)
RATE_LIMIT_PUBLIC=30
RATE_LIMIT_AUTHENTICATED=100
RATE_LIMIT_PREMIUM=300

# Cleanup interval (milliseconds)
RATE_LIMIT_CLEANUP_INTERVAL=3600000  # 1 hour
```

**Update in code:** `src/lib/rate-limiter.ts`
```typescript
const RATE_LIMITS = {
  public: parseInt(process.env.RATE_LIMIT_PUBLIC || '30'),
  authenticated: parseInt(process.env.RATE_LIMIT_AUTHENTICATED || '100'),
  premium: parseInt(process.env.RATE_LIMIT_PREMIUM || '300'),
};
```

---

## 🚀 Deployment Configurations

### Vercel

1. Go to Project Settings → Environment Variables
2. Add variables:

```
NEXT_PUBLIC_API_BASE_URL = https://your-domain.vercel.app
ORCHARDS_API_KEY = orchards_live_key_2025
NODE_ENV = production
```

3. Redeploy the application

---

### Netlify

1. Site Settings → Build & Deploy → Environment
2. Add variables:

```
NEXT_PUBLIC_API_BASE_URL = https://your-domain.netlify.app
ORCHARDS_API_KEY = orchards_live_key_2025
NODE_ENV = production
```

3. Trigger a new deploy

---

### Custom Server (Node.js)

**Option 1: .env file**
```bash
# .env (never commit to git)
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
ORCHARDS_API_KEY=orchards_live_key_2025
NODE_ENV=production
```

**Option 2: System environment**
```bash
export NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
export ORCHARDS_API_KEY=orchards_live_key_2025
export NODE_ENV=production

npm run start
```

---

### Docker

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
      - ORCHARDS_API_KEY=orchards_live_key_2025
      - NODE_ENV=production
```

**Dockerfile with .env:**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Environment variables
ENV NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
ENV ORCHARDS_API_KEY=orchards_live_key_2025
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔒 Security Best Practices

### 1. API Key Management

**❌ DON'T:**
```typescript
// Don't hardcode in client-side code
const API_KEY = 'orchards_live_key_2025';
```

**✅ DO:**
```typescript
// Use environment variables
const API_KEY = process.env.ORCHARDS_API_KEY;

// Or make API calls from backend only
// Orchards website backend calls our API with key
```

---

### 2. Git Ignore

Ensure `.env.local` is in `.gitignore`:

```gitignore
# Environment Variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Keep example file
!.env.example
```

---

### 3. Environment Example File

Create `.env.example` for documentation:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
ORCHARDS_API_KEY=your_api_key_here

# Rate Limiting (Optional)
RATE_LIMIT_PUBLIC=30
RATE_LIMIT_AUTHENTICATED=100
RATE_LIMIT_PREMIUM=300

# Environment
NODE_ENV=development
```

Commit `.env.example`, never `.env.local`

---

## 🧪 Testing Different Environments

### Local Development

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
ORCHARDS_API_KEY=demo_api_key_standard
NODE_ENV=development
```

Test:
```bash
npm run dev
curl http://localhost:3000/api/orchards/properties \
  -H "X-API-Key: demo_api_key_standard"
```

---

### Staging

```env
# .env.staging
NEXT_PUBLIC_API_BASE_URL=https://staging.your-domain.com
ORCHARDS_API_KEY=orchards_staging_key_2025
NODE_ENV=production
```

Deploy to staging and test:
```bash
curl https://staging.your-domain.com/api/orchards/properties \
  -H "X-API-Key: orchards_staging_key_2025"
```

---

### Production

```env
# .env.production (set in hosting provider)
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
ORCHARDS_API_KEY=orchards_live_key_2025
NODE_ENV=production
```

Verify:
```bash
curl https://your-domain.com/api/orchards/properties \
  -H "X-API-Key: orchards_live_key_2025"
```

---

## 📝 Orchards Website Configuration

The Orchards website needs these variables to consume the API:

```env
# .env.local (Orchards website)

# API Configuration
NEXT_PUBLIC_ESCAPE_HOUSES_API=https://your-domain.com/api/orchards
ESCAPE_HOUSES_API_KEY=orchards_live_key_2025

# Cache Configuration (Optional)
CACHE_PROPERTIES_TTL=3600        # 1 hour
CACHE_PROPERTY_DETAILS_TTL=1800  # 30 minutes
```

**Usage example:**
```typescript
// lib/api.ts (Orchards website)
const API_BASE = process.env.NEXT_PUBLIC_ESCAPE_HOUSES_API;
const API_KEY = process.env.ESCAPE_HOUSES_API_KEY;

export async function fetchProperties() {
  const response = await fetch(`${API_BASE}/properties`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });
  return response.json();
}
```

---

## 🔄 API Key Rotation

### When to Rotate Keys

- Scheduled rotation (e.g., every 90 days)
- Suspected key compromise
- Team member departure
- Security audit recommendation

### Rotation Process

1. **Generate new key** (system admin)
   ```typescript
   // Update src/lib/rate-limiter.ts
   const API_KEYS = {
     'orchards_live_key_2026': 'premium',  // New key
     'orchards_live_key_2025': 'premium',  // Keep old key temporarily
   };
   ```

2. **Deploy with both keys** (grace period)
   ```env
   ORCHARDS_API_KEY=orchards_live_key_2026
   ORCHARDS_API_KEY_OLD=orchards_live_key_2025
   ```

3. **Update Orchards website** with new key

4. **Test with new key**

5. **Remove old key** after grace period (e.g., 7 days)
   ```typescript
   const API_KEYS = {
     'orchards_live_key_2026': 'premium',  // Only new key
   };
   ```

6. **Redeploy**

---

## 🛠️ Troubleshooting

### Issue: CORS errors in browser

**Check:**
1. Origin is in `ORCHARDS_ORIGINS` array
2. CORS headers are sent in response
3. OPTIONS preflight is handled

**Fix:**
```typescript
// Add your domain to allowed origins
const ORCHARDS_ORIGINS = [
  'https://www.orchards-escapes.co.uk',
  'https://your-actual-domain.com',  // Add this
];
```

---

### Issue: Rate limit hit too quickly

**Check:**
1. API key is being sent correctly
2. Key is in premium tier
3. Multiple requests from same IP

**Fix:**
```typescript
// Increase rate limits in src/lib/rate-limiter.ts
const RATE_LIMITS = {
  premium: 500,  // Increase from 300
};
```

---

### Issue: 401 Unauthorized

**Check:**
1. API key is correct
2. Key is in `API_KEYS` map
3. Header name is `X-API-Key`

**Fix:**
```bash
# Verify key in request
curl -v https://your-domain.com/api/orchards/properties \
  -H "X-API-Key: orchards_live_key_2025" 2>&1 | grep "X-API-Key"
```

---

### Issue: Environment variables not loading

**Check:**
1. File name is `.env.local` (not `.env.local.txt`)
2. Restart development server after changes
3. Use `NEXT_PUBLIC_` prefix for client-side variables

**Fix:**
```bash
# Restart dev server
npm run dev

# Verify variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_API_BASE_URL)"
```

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_API_BASE_URL` to production domain
- [ ] Use production API key (`orchards_live_key_2025`)
- [ ] Remove `localhost` from `ORCHARDS_ORIGINS`
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Set environment variables in hosting provider
- [ ] Test CORS from Orchards production domain
- [ ] Verify rate limiting works
- [ ] Test all three API endpoints
- [ ] Document API key in secure location
- [ ] Set up key rotation schedule

---

## 📚 Related Documentation

- [ORCHARDS_API_DOCUMENTATION.md](ORCHARDS_API_DOCUMENTATION.md) - Full API reference
- [STEP_4_ORCHARDS_INTEGRATION_SUMMARY.md](STEP_4_ORCHARDS_INTEGRATION_SUMMARY.md) - Integration summary
- [DEPLOYMENT_READY_CHECKLIST.md](DEPLOYMENT_READY_CHECKLIST.md) - Deployment guide

---

**Last Updated:** 17/12/2025  
**Version:** 1.0
