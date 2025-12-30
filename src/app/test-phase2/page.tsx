'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatUKDate, formatUKDateTime, getUKTimestamp } from '@/lib/utils/uk-date-formatter';

export default function TestPhase2Page() {
  const [currentTime, setCurrentTime] = useState(getUKTimestamp());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getUKTimestamp());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Phase 2 Testing Dashboard
        </h1>

        {/* UK Time Display */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Current UK Time</h2>
          <p className="text-3xl font-mono text-blue-600">{currentTime}</p>
        </div>

        {/* Test Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TestCard
            title="Authentication"
            links={[
              { href: '/auth/login', label: 'Login Page' },
              { href: '/auth/register', label: 'Register Page' },
            ]}
          />
          
          <TestCard
            title="Payments"
            links={[
              { href: '/payments', label: 'Payment History' },
            ]}
          />

          <TestCard
            title="Bookings"
            links={[
              { href: '/guest/bookings', label: 'My Bookings' },
            ]}
          />

          <TestCard
            title="Properties"
            links={[
              { href: '/properties', label: 'Browse Properties' },
              { href: '/admin/properties', label: 'Admin Properties' },
            ]}
          />
        </div>

        {/* Date Format Examples */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">UK Date Format Examples</h2>
          <div className="space-y-2 font-mono text-sm">
            <p>Date: {formatUKDate(new Date())}</p>
            <p>Date & Time: {formatUKDateTime(new Date())}</p>
            <p>Timestamp: {getUKTimestamp()}</p>
          </div>
        </div>

        {/* Milestone Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Phase 2 Features</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-blue-800">Milestone 11 - Frontend Integration</h3>
              <ul className="list-disc list-inside text-sm text-blue-700 mt-2">
                <li>React components with UK date formatting</li>
                <li>Authentication forms (Login, Register)</li>
                <li>Payment history with UK timestamps</li>
                <li>Booking calendar with UK dates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">Milestone 12 - Monitoring & Logging</h3>
              <ul className="list-disc list-inside text-sm text-blue-700 mt-2">
                <li>UK timestamp logging (DD/MM/YYYY HH:MM:SS)</li>
                <li>Error handling system</li>
                <li>API request/response logging</li>
                <li>Console logs with UK timestamps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestCard({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
