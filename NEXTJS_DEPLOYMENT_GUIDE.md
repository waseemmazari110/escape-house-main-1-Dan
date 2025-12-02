# Next.js 15 Deployment Guide

## ✅ Current Status: All Dynamic Routes Correctly Configured

This project follows Next.js 15 best practices for dynamic routes and deployment.

---

## 🎯 Dynamic Route Params - Correct Implementation

### ✅ For Client Components ("use client")

When using `"use client"`, access params via `useParams()` hook:

```tsx
"use client";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const slug = params.slug as string;
  // ... rest of component
}
```

**Current Implementation:**
- ✅ `src/app/destinations/[slug]/page.tsx` - Uses `useParams()`

---

### ✅ For Server Components (default)

When NOT using `"use client"`, params are passed as props:

```tsx
// Correct Type Definition
interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  const { slug } = params;
  return <div>Slug: {slug}</div>;
}
```

**Current Implementation:**
- ✅ `src/app/blog/[slug]/page.tsx` - Correct params type
- ✅ `src/app/properties/[slug]/page.tsx` - Correct params type  
- ✅ `src/app/experiences/[slug]/page.tsx` - Correct params type

---

## ❌ Common Mistakes to Avoid

### 1. DO NOT Use Promise for params

```tsx
// ❌ WRONG - Will cause deployment errors
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  // ...
}
```

```tsx
// ✅ CORRECT
export default function Page({ params }: { params: { slug: string } }) {
  // ...
}
```

### 2. DO NOT Mix Client and Server Patterns

```tsx
// ❌ WRONG - Don't use both useParams and params prop
"use client";
export default function Page({ params }: { params: { slug: string } }) {
  const routeParams = useParams(); // Unnecessary!
}
```

---

## 🚀 Static Generation with generateStaticParams

For better performance and SEO, use `generateStaticParams` to pre-render dynamic routes:

```tsx
// ✅ CORRECT Implementation
export async function generateStaticParams() {
  return [
    { slug: "post-1" },
    { slug: "post-2" },
    { slug: "post-3" },
  ];
}

export default function Page({ params }: { params: { slug: string } }) {
  // ...
}
```

**Current Implementation:**
- ✅ `src/app/blog/[slug]/page.tsx` - Has `generateStaticParams` for all 6 blog posts

---

## 📦 Deployment Checklist

### Before Deploying:

1. **Build Test Locally**
   ```bash
   npm run build
   ```
   - Ensure no TypeScript errors
   - Check for missing dependencies
   - Verify all dynamic routes build successfully

2. **Environment Variables**
   - Set `TURSO_CONNECTION_URL` on deployment platform
   - Set `TURSO_AUTH_TOKEN` on deployment platform
   - Set `BETTER_AUTH_SECRET` on deployment platform
   - Set other API keys as needed

3. **Database Access**
   - Ensure production database is accessible from deployment platform
   - Verify connection string format
   - Test database queries

4. **Image Optimization**
   - All remote image patterns configured in `next.config.ts`
   - Current allowed domains:
     - slelguoygbfzlpylpxfs.supabase.co
     - images.unsplash.com
     - v3b.fal.media
     - butlersinthebuff.com.au
     - butlersinthebuff.co.uk

5. **API Routes**
   - All API routes under `/api/*` are Edge-compatible
   - No Node.js-specific APIs used
   - Database client properly configured

---

## 🔧 Configuration Files

### next.config.ts
- ✅ TypeScript errors NOT ignored (`ignoreBuildErrors: false`)
- ✅ Image optimization configured
- ✅ Remote patterns for all image sources
- ✅ Development CORS properly configured

### tsconfig.json
- ✅ Strict mode enabled
- ✅ Path aliases configured (`@/*`)
- ✅ ESNext module resolution

---

## 🐛 Troubleshooting Common Deployment Errors

### Error: "Type 'X' is not assignable to type 'Promise<X>'"
**Solution:** Remove `Promise` from params type. Params are always synchronous objects.

### Error: "generateStaticParams must return an array"
**Solution:** Ensure you're returning an array of objects, not objects directly:
```tsx
// ✅ CORRECT
return [{ slug: "a" }, { slug: "b" }];

// ❌ WRONG
return { slug: "a" };
```

### Error: "Cannot use useParams in a server component"
**Solution:** Either:
1. Add `"use client"` directive at the top, OR
2. Use the `params` prop instead

### Build Error: "Module not found"
**Solution:** 
1. Check import paths use `@/` alias correctly
2. Verify all dependencies are in `package.json`
3. Run `npm install` to ensure all packages installed

---

## 📊 Current Project Structure

```
src/app/
├── (home)/page.tsx                    # Home page (static)
├── blog/
│   └── [slug]/page.tsx                # ✅ Dynamic + generateStaticParams
├── destinations/
│   └── [slug]/page.tsx                # ✅ Dynamic (client component)
├── properties/
│   └── [slug]/page.tsx                # ✅ Dynamic (client component)
├── experiences/
│   └── [slug]/page.tsx                # ✅ Dynamic (client component)
├── owner/
│   ├── dashboard/page.tsx             # Owner dashboard
│   └── properties/
│       └── [id]/edit/page.tsx         # ✅ Dynamic (edit page)
└── api/                               # API routes
    ├── properties/route.ts
    ├── auth/[...all]/route.ts
    └── ...
```

---

## 🎯 Deployment Platforms

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push to main

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in dashboard

### Self-Hosted
1. Build: `npm run build`
2. Start: `npm start`
3. Ensure Node.js 18+ installed
4. Set PORT environment variable if needed

---

## ✨ Performance Optimizations

- ✅ Static generation for blog posts
- ✅ Image optimization enabled
- ✅ Edge runtime for API routes
- ✅ Incremental builds enabled
- ✅ 1-year cache for optimized images

---

## 📝 Notes

- All dynamic route pages use correct TypeScript types
- No `Promise<params>` antipatterns present
- Client components properly use `useParams()`
- Server components properly receive `params` prop
- `generateStaticParams` added where beneficial
- Build tested successfully locally

**Last Updated:** December 3, 2025
**Next.js Version:** 15.3.5
**Status:** ✅ Production Ready
