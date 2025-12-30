"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface BackfillResults {
  processed: number;
  created: number;
  existing: number;
  errors: string[];
}

export default function BackfillInvoicesPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BackfillResults | null>(null);
  const [error, setError] = useState<string>("");

  async function handleBackfill() {
    try {
      setLoading(true);
      setError("");
      setResults(null);

      const response = await fetch('/api/admin/backfill-invoices', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to backfill invoices');
      }

      const data = await response.json();
      setResults(data.results);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Backfill Invoice Records</h1>
        <p className="text-gray-600 mb-8">
          This tool will create invoice records for all existing subscriptions by fetching them from Stripe.
        </p>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>This process will scan all subscriptions in the database</li>
            <li>For each subscription, it will fetch invoices from Stripe</li>
            <li>Missing invoices will be created in the database</li>
            <li>Existing invoices will be skipped</li>
          </ol>
        </Card>

        <div className="flex gap-4 mb-6">
          <Button
            onClick={handleBackfill}
            disabled={loading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? 'Processing...' : 'Start Backfill'}
          </Button>
        </div>

        {error && (
          <Card className="p-4 bg-red-50 border-red-200 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {results && (
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Backfill Complete
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{results.processed}</div>
                <div className="text-sm text-blue-700">Subscriptions Processed</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{results.created}</div>
                <div className="text-sm text-green-700">Invoices Created</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{results.existing}</div>
                <div className="text-sm text-gray-700">Already Existed</div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  Errors ({results.errors.length})
                </h4>
                <ul className="space-y-1">
                  {results.errors.map((err, idx) => (
                    <li key={idx} className="text-sm text-yellow-800">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
