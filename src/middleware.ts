import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers for enhanced protection
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is using HTTP (not HTTPS)
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('host');
  
  // If protocol is HTTP, redirect to HTTPS (production only)
  if (protocol === 'http' && host && process.env.NODE_ENV === 'production') {
    const httpsUrl = `https://${host}${pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(httpsUrl, {
      status: 301, // Permanent redirect
    });
  }

  // Create response
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Protect owner routes
  if (pathname.startsWith('/owner') && !pathname.startsWith('/owner/login') && !pathname.startsWith('/owner/register') && !pathname.startsWith('/owner/forgot-password') && !pathname.startsWith('/owner/reset-password')) {
    // Check for auth session cookie - actual auth check happens in API/pages
    const session = request.cookies.get('better-auth.session_token');
    if (!session) {
      const loginUrl = new URL('/owner/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('better-auth.session_token');
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rate limiting headers for API routes
  if (pathname.startsWith('/api')) {
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');
  }

  return response;
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
