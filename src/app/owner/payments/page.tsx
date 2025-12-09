"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { CreditCard, Home } from "lucide-react";

function OwnerPaymentsContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-sage)]/15 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[var(--color-accent-sage)]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Billing</p>
            <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Payments coming soon</h2>
          <p className="text-sm text-gray-600 mb-6">
            Payments are not yet enabled. You&apos;ll soon be able to manage payouts and invoices from here.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => router.push("/owner/dashboard")}
              className="inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OwnerPaymentsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "admin"]}>
      <OwnerPaymentsContent />
    </ProtectedRoute>
  );
}
