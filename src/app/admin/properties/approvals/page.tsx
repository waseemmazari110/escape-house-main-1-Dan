"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// This page redirects to the admin dashboard with approvals view active
function AdminPropertiesApprovalRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard with approvals view
    router.replace('/admin/dashboard?view=approvals');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to admin dashboard...</p>
      </div>
    </div>
  );
}

export default function AdminPropertiesApprovalPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPropertiesApprovalRedirect />
    </ProtectedRoute>
  );
}
