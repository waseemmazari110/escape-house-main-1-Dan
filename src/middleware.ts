/**
 * NEXT.JS MIDDLEWARE - ROUTE-LEVEL RBAC
 * 
 * Protects routes based on user roles.
 * - Admin routes: /admin/*
 * - Owner routes: /owner/*
 * - Guest routes: /guest/* (optional, most are public)
 * - Public routes: / /properties, /auth/*, etc.
 * 
 * Redirects unauthorized users to appropriate login or dashboard.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Define route groups and their required roles
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['admin'],
  '/owner': ['owner'], // Only owners (layout will handle role check)
  '/guest/bookings': ['guest', 'owner', 'admin'], // All authenticated users can view bookings
};

const PUBLIC_ROUTES = [
  '/',
  '/properties',
  '/auth/sign-in',
  '/auth/admin-login',
  '/auth/owner-login',
  '/auth/guest-login',
  '/auth/sign-up',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/contact',
  '/blog',
  '/how-it-works',
  '/about',
  '/terms',
  '/privacy',
  '/destinations',
  '/house-styles',
  '/occasions',
  '/features',
  '/experiences',
  '/reviews',
];

const ROLE_LOGIN_REDIRECTS: Record<string | null, string> = {
  admin: '/admin/dashboard',
  owner: '/owner/dashboard',
  guest: '/properties',
  null: '/auth/sign-in', // Not authenticated
};

/**
 * Check if a route is protected and what roles are allowed
 */
function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return roles;
    }
  }
  return null;
}

/**
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === pathname) return true;
    if (route.endsWith('*')) {
      const prefix = route.slice(0, -1);
      return pathname.startsWith(prefix);
    }
    return false;
  });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow API routes to handle their own auth (they use API middleware)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // For /owner routes, let the layout handle auth checks
  // This avoids duplicate auth checks and session mismatches
  if (pathname.startsWith('/owner')) {
    return NextResponse.next();
  }

  // Get session from request
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user;
  const userRole = (user?.role as string | undefined) || null;

  // Get required roles for this route
  const requiredRoles = getRequiredRoles(pathname);

  // If route is not protected, allow access
  if (requiredRoles === null) {
    return NextResponse.next();
  }

  // If user is not authenticated
  if (!user) {
    return NextResponse.redirect(
      new URL(`/auth/sign-in?redirect=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  // If user role is not allowed for this route
  if (!requiredRoles.includes(userRole as string)) {
    // Redirect to user's appropriate dashboard
    const redirectPath = ROLE_LOGIN_REDIRECTS[userRole as string] || '/';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.gif).*)',
  ],
};
