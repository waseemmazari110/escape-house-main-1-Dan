/**
 * RBAC FRONTEND EXAMPLES
 * 
 * Examples of how to use role-based access control in your Next.js pages,
 * components, and hooks.
 */

// ================================================
// EXAMPLE 1: PROTECTING ENTIRE ADMIN PAGE
// ================================================

/**
 * File: src/app/admin/dashboard/page.tsx
 * 
 * Wrap the entire page with ProtectedRoute to require admin role.
 * Non-admin users will be redirected to appropriate dashboard.
 */

'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminDashboardContent from '@/components/admin/Dashboard';

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

// ================================================
// EXAMPLE 2: PROTECTING OWNER PAGES
// ================================================

/**
 * File: src/app/owner/dashboard/page.tsx
 * 
 * Protect page for owner + admin (admin can manage on behalf of owner)
 */

'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function OwnerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['owner', 'admin']}>
      {/* Page content here */}
    </ProtectedRoute>
  );
}

// ================================================
// EXAMPLE 3: CONDITIONAL RENDERING BY ROLE
// ================================================

/**
 * File: src/components/Navigation.tsx
 * 
 * Show different navigation items based on user role
 */

'use client';

import { useUserRole, RoleBasedRender } from '@/components/ProtectedRoute';
import Link from 'next/link';

export function Navigation() {
  const { role } = useUserRole();

  return (
    <nav className="flex gap-4">
      {/* Show to all authenticated users */}
      <Link href="/">Home</Link>

      {/* Show only to admins */}
      <RoleBasedRender allowedRoles={['admin']}>
        <Link href="/admin/dashboard">Admin Panel</Link>
      </RoleBasedRender>

      {/* Show only to owners */}
      <RoleBasedRender allowedRoles={['owner']}>
        <Link href="/owner/dashboard">My Properties</Link>
      </RoleBasedRender>

      {/* Show to guests and owners */}
      <RoleBasedRender allowedRoles={['guest', 'owner']}>
        <Link href="/bookings">My Bookings</Link>
      </RoleBasedRender>
    </nav>
  );
}

// ================================================
// EXAMPLE 4: USING useHasRole HOOK
// ================================================

/**
 * File: src/components/UserSettings.tsx
 * 
 * Check permissions using useHasRole hook
 */

'use client';

import { useHasRole } from '@/components/ProtectedRoute';
import Button from '@/components/ui/button';

export function UserSettings() {
  const { hasRole: isAdmin } = useHasRole(['admin']);
  const { hasRole: isOwner } = useHasRole(['owner']);

  return (
    <div>
      {/* Admin-only setting */}
      {isAdmin && (
        <section>
          <h2>Admin Settings</h2>
          {/* Admin-only content */}
        </section>
      )}

      {/* Owner-only setting */}
      {isOwner && (
        <section>
          <h2>Property Settings</h2>
          {/* Owner-only content */}
        </section>
      )}
    </div>
  );
}

// ================================================
// EXAMPLE 5: PERMISSIONS-BASED VISIBILITY
// ================================================

/**
 * File: src/components/PropertyActions.tsx
 * 
 * Show actions based on granular permissions
 */

'use client';

import { useUserRole } from '@/components/ProtectedRoute';
import { canEditResource } from '@/lib/rbac-utils';

interface PropertyActionsProps {
  propertyId: string;
  ownerId: string;
}

export function PropertyActions({ propertyId, ownerId }: PropertyActionsProps) {
  const { user, role } = useUserRole();

  // Check if user can edit this property
  const canEdit = canEditResource(role, ownerId, user?.id);

  return (
    <div className="flex gap-2">
      {canEdit && (
        <>
          <button>Edit Property</button>
          <button>Delete Property</button>
          <button>Publish</button>
        </>
      )}
    </div>
  );
}

// ================================================
// EXAMPLE 6: ROLE-BASED API CALLS
// ================================================

/**
 * File: src/lib/api-client.ts
 * 
 * Make role-aware API calls
 */

import { authClient } from '@/lib/auth-client';

export async function fetchUserDashboard() {
  const session = await authClient.getSession();
  const userRole = session?.data?.user?.role;

  // Make different API calls based on role
  switch (userRole) {
    case 'admin':
      return fetch('/api/admin/stats');
    case 'owner':
      return fetch('/api/owner/dashboard');
    default:
      return fetch('/api/guest/properties');
  }
}

// ================================================
// EXAMPLE 7: DYNAMIC BREADCRUMBS BY ROLE
// ================================================

/**
 * File: src/components/Breadcrumb.tsx
 * 
 * Generate breadcrumbs based on user role and current page
 */

'use client';

import { useUserRole } from '@/components/ProtectedRoute';
import { usePathname } from 'next/navigation';

export function Breadcrumb() {
  const { role } = useUserRole();
  const pathname = usePathname();

  // Generate breadcrumbs based on role
  const getBreadcrumbs = () => {
    if (pathname.startsWith('/admin')) {
      return [
        { label: 'Home', href: '/admin/dashboard' },
        { label: 'Admin', href: '/admin/dashboard' },
      ];
    }
    if (pathname.startsWith('/owner')) {
      return [
        { label: 'Home', href: '/owner/dashboard' },
        { label: 'Owner Portal', href: '/owner/dashboard' },
      ];
    }
    return [{ label: 'Home', href: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex gap-2 text-sm">
      {breadcrumbs.map((crumb, idx) => (
        <div key={idx}>
          <a href={crumb.href}>{crumb.label}</a>
          {idx < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
        </div>
      ))}
    </nav>
  );
}

// ================================================
// EXAMPLE 8: PROTECTED FORM WITH ROLE VALIDATION
// ================================================

/**
 * File: src/components/PropertyForm.tsx
 * 
 * Form that validates permissions before submission
 */

'use client';

import { useUserRole } from '@/components/ProtectedRoute';
import { canEditResource } from '@/lib/rbac-utils';
import { useState } from 'react';

interface PropertyFormProps {
  propertyId?: string;
  ownerId: string;
  onSubmit: (data: any) => Promise<void>;
}

export function PropertyForm({ propertyId, ownerId, onSubmit }: PropertyFormProps) {
  const { user, role } = useUserRole();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check permission first
  if (!canEditResource(role, ownerId, user?.id)) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded">
        You do not have permission to edit this property.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Property'}
      </button>
    </form>
  );
}

// ================================================
// EXAMPLE 9: LAYOUT WITH ROLE-BASED STRUCTURE
// ================================================

/**
 * File: src/app/layout.tsx (or admin/layout.tsx)
 * 
 * Layout that changes structure based on role
 */

'use client';

import { useUserRole } from '@/components/ProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import OwnerLayout from '@/components/layouts/OwnerLayout';
import GuestLayout from '@/components/layouts/GuestLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render different layout based on role
  switch (role) {
    case 'admin':
      return <AdminLayout>{children}</AdminLayout>;
    case 'owner':
      return <OwnerLayout>{children}</OwnerLayout>;
    default:
      return <GuestLayout>{children}</GuestLayout>;
  }
}
