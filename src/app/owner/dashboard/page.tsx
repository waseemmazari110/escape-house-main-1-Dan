"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, 
  Calendar, 
  Settings, 
  LogOut,
  User,
  TrendingUp,
  ChevronRight,
  MapPin,
  Users,
  Clock
} from "lucide-react";

// UK Date formatting utility
const formatUKDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short'
  }).format(date);
};

const formatFullUKDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

interface OwnerStats {
  totalBookings: number;
  bookingsGrowth: string;
  activeProperties: number;
  propertiesGrowth: string;
  revenue: number;
  revenueGrowth: string;
  upcomingCheckIns: number;
  checkInsGrowth: string;
}

interface Booking {
  id: number;
  guestName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
}

interface Property {
  id: number;
  title: string;
  location: string;
  heroImage: string;
  isPublished: boolean;
}

interface CheckIn {
  id: number;
  guestName: string;
  propertyName: string;
  checkInDate: string;
  numberOfGuests: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

function OwnerDashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingCheckIns, setUpcomingCheckIns] = useState<CheckIn[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadDashboard() {
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

        // Fetch stats
        const statsRes = await fetch('/api/owner/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch recent bookings
        const bookingsRes = await fetch('/api/owner/bookings?limit=5');
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setRecentBookings(bookingsData.bookings || []);
        }

        // Fetch upcoming check-ins
        const checkInsRes = await fetch('/api/owner/upcoming-checkins');
        if (checkInsRes.ok) {
          const checkInsData = await checkInsRes.json();
          setUpcomingCheckIns(checkInsData.checkIns || []);
        }

        // Fetch properties
        const propertiesRes = await fetch('/api/properties');
        if (propertiesRes.ok) {
          const propertiesData = await propertiesRes.json();
          setProperties(propertiesData.properties || []);
        }

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
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

  const getPropertyStatusColor = (isPublished: boolean) => {
    return isPublished 
      ? 'text-green-600 bg-green-50' 
      : 'text-amber-600 bg-amber-50';
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">PropManager</h1>
            </div>

            {/* User Menu */}
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-accent-sage)] text-white font-medium"
              >
                <Home className="w-5 h-5" />
                Overview
              </Link>
              <Link
                href="/owner/bookings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Overview</h2>
              <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your properties.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Bookings */}
              <Card className="p-6 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">
                      {stats?.totalBookings.toLocaleString() || 0}
                    </h3>
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-green-600 font-medium">{stats?.bookingsGrowth}</span>
                  <span className="text-gray-500">from last month</span>
                </div>
              </Card>

              {/* Active Properties */}
              <Card className="p-6 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Properties</p>
                    <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">
                      {stats?.activeProperties || 0}
                    </h3>
                  </div>
                  <Home className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-green-600 font-medium">{stats?.propertiesGrowth}</span>
                  <span className="text-gray-500">from last month</span>
                </div>
              </Card>

              {/* Revenue */}
              <Card className="p-6 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                    <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">
                      £{stats?.revenue.toLocaleString() || 0}
                    </h3>
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-green-600 font-medium">{stats?.revenueGrowth}</span>
                  <span className="text-gray-500">from last month</span>
                </div>
              </Card>

              {/* Upcoming Check-ins */}
              <Card className="p-6 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Upcoming Check-ins</p>
                    <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">
                      {stats?.upcomingCheckIns || 0}
                    </h3>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-500">Next 30 days</span>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Bookings */}
              <Card className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Recent Bookings</h3>
                  <Link 
                    href="/owner/bookings"
                    className="text-sm text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] font-medium"
                  >
                    View all
                  </Link>
                </div>

                {recentBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-4 pb-3 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                      <div>Guest</div>
                      <div>Property</div>
                      <div>Check-in</div>
                      <div>Check-out</div>
                      <div>Status</div>
                    </div>
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="grid grid-cols-5 gap-4 items-center py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                        <div className="text-sm text-gray-600">{booking.propertyName}</div>
                        <div className="text-sm text-gray-600">{formatFullUKDate(booking.checkInDate)}</div>
                        <div className="text-sm text-gray-600">{formatFullUKDate(booking.checkOutDate)}</div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Upcoming Check-ins */}
              <Card className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Upcoming Check-ins</h3>
                </div>

                {upcomingCheckIns.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No upcoming check-ins</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingCheckIns.map((checkIn) => (
                      <div key={checkIn.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-white">
                            {checkIn.guestName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{checkIn.guestName}</p>
                          <p className="text-xs text-gray-500 truncate">{checkIn.propertyName}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatUKDate(checkIn.checkInDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {checkIn.numberOfGuests}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Your Properties */}
            <Card className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Your Properties</h3>
                <Link 
                  href="/admin/properties"
                  className="text-sm text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] font-medium"
                >
                  View all
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No properties yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.slice(0, 6).map((property) => (
                    <div key={property.id} className="group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-gray-100">
                        {property.heroImage ? (
                          <Image
                            src={property.heroImage}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1 truncate">{property.title}</h4>
                        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPropertyStatusColor(property.isPublished)}`}>
                            {property.isPublished ? 'Available' : 'Maintenance'}
                          </span>
                          <Link 
                            href={`/admin/properties/${property.id}`}
                            className="text-sm text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] font-medium"
                          >
                            Manage
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-6 text-center text-sm text-gray-500">
          © 2025 PropManager. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default function OwnerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['owner', 'admin']}>
      <OwnerDashboardContent />
    </ProtectedRoute>
  );
}





