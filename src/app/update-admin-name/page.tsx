"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, User } from "lucide-react";

export default function UpdateAdminNamePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const updateName = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/update-admin-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'cswaseem110@gmail.com',
          newName: 'Dan Harley',
          secret: 'update-admin-name-2025'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, message: data.error });
      }
    } catch (error) {
      setResult({ success: false, message: 'Failed to update name' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Update Admin Name
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Change admin display name to Dan Harley
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>Email:</strong> cswaseem110@gmail.com<br />
            <strong>Current Name:</strong> Dan Harley<br />
            <strong>New Name:</strong> Dan Harley
          </p>
        </div>

        <Button
          onClick={updateName}
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium rounded-lg"
        >
          {loading ? 'Updating...' : 'Update Admin Name'}
        </Button>

        {result && (
          <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {result?.success && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
            <p className="text-sm font-medium text-gray-900">✅ Name Updated Successfully!</p>
            <p className="text-sm text-gray-600">
              The admin name has been changed to Dan Harley. You can now see this name in the admin dashboard.
            </p>
            <a
              href="/admin/dashboard"
              className="block px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Admin Dashboard
            </a>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
