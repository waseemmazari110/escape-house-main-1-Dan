'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { formatUKDate } from '@/lib/utils/uk-date-formatter';

interface Booking {
  id: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function GuestBookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/auth/login');
      return;
    }

    if (session) {
      fetchBookings();
    }
  }, [session, isPending]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/my-bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        <div className="grid gap-6">
          {bookings.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              No bookings yet. Start exploring properties!
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.propertyName}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>
                        Check-in: <span className="font-medium">{formatUKDate(booking.checkIn)}</span>
                      </p>
                      <p>
                        Check-out: <span className="font-medium">{formatUKDate(booking.checkOut)}</span>
                      </p>
                      <p>
                        Booked on: {formatUKDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                    <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
