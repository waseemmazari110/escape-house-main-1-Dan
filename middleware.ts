import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    // If accessing admin routes without session, redirect to login
    if (request.nextUrl.pathname.startsWith('/admin') && 
        request.nextUrl.pathname !== '/admin/login' && 
        !session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};