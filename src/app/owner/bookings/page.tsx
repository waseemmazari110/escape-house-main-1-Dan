"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Home, 
  Calendar, 
  Settings, 
  LogOut,
  User,
  TrendingUp,
  Search,
  Filter,
  Download,
  ChevronLeft
} from "lucide-react";

// UK Date formatting utility
const formatFullUKDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  bookingStatus: string;
  totalPrice?: number;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

function OwnerBookingsContent() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          const userData = session.data.user as any;
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });
        }

        // Fetch all bookings
        const bookingsRes = await fetch('/api/owner/bookings?limit=50', { cache: 'no-store' });
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.bookings || []);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    localStorage.removeItem("bearer_token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-sage)]"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.bookingStatus.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">PropManager</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              <Link
                href="/owner/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Home className="w-5 h-5" />
                Overview
              </Link>
              <Link
                href="/owner/bookings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-accent-sage)] text-white font-medium"
              >
                <Calendar className="w-5 h-5" />
                Bookings
              </Link>
              <Link
                href="/admin/properties"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Home className="w-5 h-5" />
                Properties
              </Link>
              <Link
                href="/owner/payments"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                Payments
              </Link>
              <Link
                href="/owner/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
              </div>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-8">
              <Link 
                href="/owner/dashboard"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Bookings</h2>
              <p className="text-gray-600">Manage all your property bookings</p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by guest name, property, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-sage)]"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-sage)]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                        Property
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                        Check-in
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden xl:table-cell">
                        Check-out
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                        Guests
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No bookings found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{booking.guestName}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none">{booking.guestEmail}</div>
                            <div className="text-xs text-gray-500 md:hidden truncate max-w-[120px]">{booking.propertyName}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 hidden md:table-cell">{booking.propertyName}</td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{formatFullUKDate(booking.checkInDate)}</td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">{formatFullUKDate(booking.checkOutDate)}</td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{booking.numberOfGuests}</td>
                          <td className="px-3 sm:px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 hidden lg:table-cell">
                            £{booking.totalPrice?.toLocaleString() || '0'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function OwnerBookings() {
  return (
    <ProtectedRoute allowedRoles={['owner', 'admin']}>
      <OwnerBookingsContent />
    </ProtectedRoute>
  );
}
