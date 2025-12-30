/**
 * API ROUTE PROTECTION UTILITIES
 * 
 * Middleware for protecting API endpoints based on user roles.
 * Returns 403 Forbidden for unauthorized access.
 * 
 * Usage:
 * ```typescript
 * // In api/admin/some-endpoint/route.ts
 * export async function GET(request: NextRequest) {
 *   const authResult = await requireAuth(request, ['admin']);
 *   if (!authResult.authorized) return authResult.response;
 *   
 *   const user = authResult.user;
 *   // ... rest of handler
 * }
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCurrentUserWithRole, type UserRole } from '@/lib/auth-roles';
import { auditLog } from '@/lib/audit-logger';

export interface AuthResult {
  authorized: boolean;
  response?: NextResponse;
  user?: any;
}

/**
 * Require authentication and specific roles for an API endpoint
 * Returns 403 if user is not authenticated or doesn't have required role
 */
export async function requireAuth(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<AuthResult> {
  try {
    // Get session from request
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const user = session?.user;

    // Not authenticated
    if (!user) {
      await auditLog({
        action: 'API_UNAUTHORIZED_ACCESS',
        resource: request.nextUrl.pathname,
        status: 'unauthorized',
        userId: 'anonymous',
        ipAddress: request.ip || 'unknown',
        details: { reason: 'No authentication' },
      });

      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Unauthorized: Authentication required' },
          { status: 401 }
        ),
      };
    }

    // Get full user profile with role
    const userProfile = await getCurrentUserWithRole();

    // User doesn't have required role
    if (!userProfile || !allowedRoles.includes(userProfile.role)) {
      await auditLog({
        action: 'API_FORBIDDEN_ACCESS',
        resource: request.nextUrl.pathname,
        status: 'forbidden',
        userId: user.id,
        userRole: (user.role as string) || 'unknown',
        ipAddress: request.ip || 'unknown',
        details: { 
          reason: 'Insufficient permissions',
          requiredRoles: allowedRoles,
          userRole: user.role,
        },
      });

      return {
        authorized: false,
        response: NextResponse.json(
          { 
            error: 'Forbidden: Insufficient permissions',
            requiredRoles: allowedRoles,
          },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      user: userProfile,
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Require admin role only
 */
export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  return requireAuth(request, ['admin']);
}

/**
 * Require owner role (owner or admin)
 */
export async function requireOwner(request: NextRequest): Promise<AuthResult> {
  return requireAuth(request, ['owner', 'admin']);
}

/**
 * Require guest role (any authenticated user)
 */
export async function requireGuest(request: NextRequest): Promise<AuthResult> {
  return requireAuth(request, ['guest', 'owner', 'admin']);
}

/**
 * Generic role-based API protection middleware
 * Can be used to wrap API handlers
 */
export function withRoleProtection(
  allowedRoles: UserRole[],
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await requireAuth(request, allowedRoles);
    
    if (!authResult.authorized) {
      return authResult.response!;
    }

    try {
      return await handler(request, authResult.user);
    } catch (error) {
      console.error('Handler error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
