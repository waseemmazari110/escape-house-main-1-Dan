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
  Users,
  Settings,
  TrendingUp,
  Building,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  UserCheck,
  UserCog,
  MapPin,
  Mail,
  Phone,
  Search,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// UK Date formatting utility
const formatUKDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

interface AdminStats {
  totalBookings: number;
  totalUsers: number;
  totalOwners: number;
  totalGuests: number;
  totalProperties: number;
  totalRevenue: number;
}

interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  numberOfGuests?: number;
  totalPrice?: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  emailVerified?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

function AdminDashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "bookings" | "users">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const session = await authClient.getSession();
        
        if (!session?.data?.user) {
          router.replace('/admin/login');
          return;
        }

        setUser({
          id: session.data.user.id,
          name: session.data.user.name || session.data.user.email.split('@')[0],
          email: session.data.user.email,
          role: (session.data.user as any).role || 'admin',
        });

        // Fetch stats
        const statsRes = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch all bookings
        const bookingsRes = await fetch('/api/bookings?limit=50', { cache: 'no-store' });
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.bookings || []);
        }

        // Fetch all users
        const usersRes = await fetch('/api/admin/users', { cache: 'no-store' });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users || []);
        }

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace('/admin/login');
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

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'owner':
        return 'bg-blue-100 text-blue-700';
      case 'guest':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-gray-900 to-gray-800 flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">Admin Panel</span>
            {user?.name && <span className="text-xs text-gray-400">{user.name}</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          <button
            onClick={() => setActiveView("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeView === "overview"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveView("bookings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeView === "bookings"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>All Bookings</span>
          </button>
          <button
            onClick={() => setActiveView("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeView === "users"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </button>
        </nav>

        {/* Sign Out */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
        <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-white">Admin Panel</span>
              {user?.name && <span className="text-xs text-gray-400">{user.name}</span>}
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-gray-800 border-t border-gray-700">
            <nav className="px-4 py-4 space-y-2">
              <button
                onClick={() => { setActiveView("overview"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                  activeView === "overview" ? "bg-blue-600 text-white" : "text-gray-300"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => { setActiveView("bookings"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                  activeView === "bookings" ? "bg-blue-600 text-white" : "text-gray-300"
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Bookings</span>
              </button>
              <button
                onClick={() => { setActiveView("users"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                  activeView === "users" ? "bg-blue-600 text-white" : "text-gray-300"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </button>
              <button
                onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-[60px] md:pt-0">
        <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {activeView === "overview" && "Dashboard Overview"}
              {activeView === "bookings" && "All Bookings"}
              {activeView === "users" && "User Management"}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              {activeView === "overview" && "Monitor your platform's performance and activity"}
              {activeView === "bookings" && "View and manage all booking records"}
              {activeView === "users" && "Manage guests and property owners"}
            </p>
          </div>

          {/* Overview Section */}
          {activeView === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div>
                      <p className="text-xs sm:text-sm opacity-90 mb-1">Total Bookings</p>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {stats?.totalBookings?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                  </div>
                  <p className="text-xs sm:text-sm opacity-90">All time bookings</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div>
                      <p className="text-xs sm:text-sm opacity-90 mb-1">Total Users</p>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {stats?.totalUsers || '0'}
                      </p>
                    </div>
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                  </div>
                  <p className="text-xs sm:text-sm opacity-90">Registered users</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div>
                      <p className="text-xs sm:text-sm opacity-90 mb-1">Property Owners</p>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {stats?.totalOwners || '0'}
                      </p>
                    </div>
                    <UserCog className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                  </div>
                  <p className="text-xs sm:text-sm opacity-90">Active owners</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div>
                      <p className="text-xs sm:text-sm opacity-90 mb-1">Guests</p>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {stats?.totalGuests || '0'}
                      </p>
                    </div>
                    <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                  </div>
                  <p className="text-xs sm:text-sm opacity-90">Guest accounts</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {/* Recent Bookings */}
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Bookings</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveView("bookings")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{booking.guestName}</p>
                          <p className="text-xs text-gray-500 truncate">{booking.propertyName}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatUKDate(booking.createdAt)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveView("users")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-white">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                              {user.role}
                            </span>
                            <span className="text-xs text-gray-400">{formatUKDate(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bookings Section */}
          {activeView === "bookings" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search bookings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-gray-900"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Check-in</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Guests</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.guestName}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{booking.guestEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 max-w-[200px] truncate">{booking.propertyName}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden sm:table-cell">{formatUKDate(booking.checkInDate)}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden md:table-cell">{booking.numberOfGuests || '-'}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 hidden lg:table-cell">
                          {booking.totalPrice ? `£${booking.totalPrice.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeView === "users" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-gray-900"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Joined</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{user.email}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden md:table-cell">{formatUKDate(user.createdAt)}</td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.emailVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.emailVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
