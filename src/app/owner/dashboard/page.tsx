"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, 
  Calendar, 
  DollarSign,
  Settings,
  TrendingUp,
  Building,
  Menu,
  X,
  Users,
  LogOut,
  CreditCard,
  MapPin
} from "lucide-react";

// UK Date formatting utility
const formatUKDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
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
  numberOfGuests?: number;
  totalPrice?: number;
}

interface Property {
  id: number;
  title: string;
  location: string;
  heroImage: string;
  isPublished: boolean;
  sleepsMax?: number;
  bedrooms?: number;
  priceFromWeekend?: number;
}

interface CheckIn {
  id: number;
  guestName: string;
  propertyName: string;
  checkInDate: string;
  numberOfGuests: number;
  guestEmail?: string;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const session = await authClient.getSession();
        
        if (!session?.data?.user) {
          router.push('/owner/login');
          return;
        }

        // Set user from session data
        setUser({
          id: session.data.user.id,
          name: session.data.user.name || session.data.user.email.split('@')[0],
          email: session.data.user.email,
          role: (session.data.user as any).role || 'owner',
        });

        // Fetch stats
        const statsRes = await fetch('/api/owner/stats', { cache: 'no-store' });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch recent bookings
        const bookingsRes = await fetch('/api/owner/bookings?limit=5', { cache: 'no-store' });
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setRecentBookings(bookingsData.bookings || []);
        }

        // Fetch upcoming check-ins
        const checkInsRes = await fetch('/api/owner/upcoming-checkins', { cache: 'no-store' });
        if (checkInsRes.ok) {
          const checkInsData = await checkInsRes.json();
          setUpcomingCheckIns(checkInsData.checkIns || []);
        }

        // Fetch properties
        const propertiesRes = await fetch('/api/owner/properties', { cache: 'no-store' });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89A38F]"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#89A38F] flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">PropManager</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/owner/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#89A38F] text-white font-medium"
          >
            <Home className="w-5 h-5" />
            <span>Overview</span>
          </Link>
          <Link
            href="/owner/bookings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span>Bookings</span>
          </Link>
          <Link
            href="/admin/properties"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Building className="w-5 h-5" />
            <span>Properties</span>
          </Link>
          <Link
            href="/owner/payments"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>Payments</span>
          </Link>
          <Link
            href="/owner/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Sign Out */}
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#89A38F] flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'Y'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || 'Yasir Ali'}
              </p>
              <p className="text-xs text-gray-500">owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#89A38F] flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">PropManager</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-50"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <nav className="px-4 py-4 space-y-1">
              <Link
                href="/owner/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#89A38F] text-white font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Overview</span>
              </Link>
              <Link
                href="/owner/bookings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="w-5 h-5" />
                <span>Bookings</span>
              </Link>
              <Link
                href="/admin/properties"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Building className="w-5 h-5" />
                <span>Properties</span>
              </Link>
              <Link
                href="/owner/payments"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CreditCard className="w-5 h-5" />
                <span>Payments</span>
              </Link>
              <Link
                href="/owner/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto lg:pt-0 pt-20">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Overview</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-[#89A38F] flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'Y'}
                </span>
              </div>
              <span className="font-medium hidden sm:block">{user?.name || 'Yasir Ali'}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Bookings */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.totalBookings?.toLocaleString() || '0'}
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              {stats?.bookingsGrowth ? (
                <p className="text-sm text-green-600 font-medium">{stats.bookingsGrowth} from last month</p>
              ) : (
                <p className="text-sm text-green-600 font-medium">+0% from last month</p>
              )}
            </div>

            {/* Active Properties */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Properties</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.activeProperties ?? properties.filter(p => p.isPublished).length}
                  </p>
                </div>
                <Building className="w-5 h-5 text-gray-400" />
              </div>
              {stats?.propertiesGrowth ? (
                <p className="text-sm text-green-600 font-medium">{stats.propertiesGrowth} from last month</p>
              ) : (
                <p className="text-sm text-green-600 font-medium">+0% from last month</p>
              )}
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    £{(stats?.revenue || 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              {stats?.revenueGrowth ? (
                <p className="text-sm text-green-600 font-medium">{stats.revenueGrowth} from last month</p>
              ) : (
                <p className="text-sm text-green-600 font-medium">+0% from last month</p>
              )}
            </div>

            {/* Upcoming Check-ins */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming Check-ins</p>
                  <p className="text-3xl font-bold text-gray-900">{upcomingCheckIns.length}</p>
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">Next 30 days</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Bookings */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                <Link
                  href="/owner/bookings"
                  className="text-sm text-[#89A38F] hover:text-[#C6A76D] font-medium transition-colors"
                >
                  View all
                </Link>
              </div>
              
              {recentBookings.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium mb-1">No bookings yet</p>
                  <p className="text-sm text-gray-500">
                    Your bookings will appear here once guests make reservations
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Guest</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Property</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Check-in</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Check-out</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-4">
                            <p className="text-sm font-medium text-gray-900">{booking.guestName}</p>
                            {booking.numberOfGuests && (
                              <p className="text-xs text-gray-500">{booking.numberOfGuests} guests</p>
                            )}
                          </td>
                          <td className="py-4 text-sm text-gray-700">{booking.propertyName}</td>
                          <td className="py-4 text-sm text-gray-700">{formatUKDate(booking.checkInDate)}</td>
                          <td className="py-4 text-sm text-gray-700">{formatUKDate(booking.checkOutDate)}</td>
                          <td className="py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Upcoming Check-ins */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Upcoming Check-ins</h2>
              
              {upcomingCheckIns.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No upcoming check-ins</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingCheckIns.map((checkIn, index) => (
                    <div 
                      key={checkIn.id} 
                      className={`flex items-start gap-3 ${index < upcomingCheckIns.length - 1 ? 'pb-4 border-b border-gray-100' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#89A38F] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-white">
                          {checkIn.guestName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-0.5">{checkIn.guestName}</p>
                        <p className="text-xs text-gray-500 mb-2 truncate">{checkIn.propertyName}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="font-medium">{formatUKDate(checkIn.checkInDate)}</span>
                          <span>{checkIn.numberOfGuests} guests</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Your Properties */}
          {properties.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Your Properties</h2>
                <Link
                  href="/admin/properties"
                  className="text-sm text-[#89A38F] hover:text-[#C6A76D] font-medium transition-colors"
                >
                  View all
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((property) => (
                  <Link
                    key={property.id}
                    href={`/admin/properties`}
                    className="block rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {property.heroImage ? (
                        <Image
                          src={property.heroImage}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Home className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{property.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          property.isPublished 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {property.isPublished ? 'Available' : 'Draft'}
                        </span>
                        <button className="text-sm text-[#89A38F] hover:text-[#C6A76D] font-medium">
                          Manage
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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
