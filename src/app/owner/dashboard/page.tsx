"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  Plus, 
  Settings, 
  BarChart3, 
  Calendar, 
  Mail, 
  Eye,
  Edit,
  CheckCircle,
  User,
  LogOut,
  CreditCard,
  Phone,
  ChevronDownIcon,
  Trash2
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  phone?: string;
  emailVerified: boolean;
}

interface Property {
  id: number;
  title: string;
  location: string;
  description: string;
  sleepsMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  priceFromMidweek?: number;
  priceFromWeekend?: number;
  isPublished: boolean;
  heroImage?: string;
  createdAt: string;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await authClient.getSession();

        if (!session || !session.data?.user) {
          router.push("/");
          return;
        }

        const userData = session.data.user as any;
        if (userData.role !== "owner" && userData.role !== "admin") {
          router.push("/");
          return;
        }

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          companyName: userData.companyName,
          phone: userData.phone,
          emailVerified: userData.emailVerified,
        });

        // Fetch properties
        fetchProperties();
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties/owner");
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  const handleDeleteProperty = async (propertyId: number, propertyTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/properties?id=${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Property deleted successfully!");
        fetchProperties(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Failed to delete property: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete property. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17a2b8] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hi {user.name?.split(" ")[0]}, Welcome to your account area.
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your account settings here
              </p>
            </div>
            
            {/* Owner Profile Dropdown */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full border-2 border-gray-300 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#17a2b8] text-white rounded-full flex items-center justify-center font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.emailVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Verified Account
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => setActiveTab("personal-info")}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setActiveTab("properties")}>
                    <Home className="w-4 h-4 mr-2" />
                    My Properties ({properties.length})
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setActiveTab("enquiries")}>
                    <Mail className="w-4 h-4 mr-2" />
                    Enquiries
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setActiveTab("statistics")}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistics
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing & Payments
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <Mail className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Privacy & Security
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem>
                    <Phone className="w-4 h-4 mr-2" />
                    Help & Support
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <Calendar className="w-4 h-4 mr-2" />
                    Terms & Conditions
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {user.emailVerified && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Card className="bg-white border-l-4 border-l-green-500 p-4">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thank You. Your account has been successfully created.
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Use this area to manage your favourites and enquiries.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="overview" className="rounded-md">
              <Home className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="properties" className="rounded-md">
              <Home className="w-4 h-4 mr-2" />
              My Properties
            </TabsTrigger>
            <TabsTrigger value="personal-info" className="rounded-md">
              <Settings className="w-4 h-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="rounded-md">
              <Mail className="w-4 h-4 mr-2" />
              Enquiries
            </TabsTrigger>
            <TabsTrigger value="statistics" className="rounded-md">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Properties</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {properties.length}
                    </h3>
                  </div>
                  <Home className="w-12 h-12 text-[#17a2b8]" />
                </div>
              </Card>

              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {properties.filter((p) => p.isPublished).length}
                    </h3>
                  </div>
                  <Eye className="w-12 h-12 text-green-500" />
                </div>
              </Card>

              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Enquiries</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">0</h3>
                  </div>
                  <Mail className="w-12 h-12 text-blue-500" />
                </div>
              </Card>
            </div>

            <div className="mt-8">
              <Button
                onClick={() => router.push("/owner/properties/new")}
                className="bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Property
              </Button>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
              <Button
                onClick={() => router.push("/owner/properties/new")}
                className="bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>

            {properties.length === 0 ? (
              <Card className="p-12 text-center bg-white">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your first property listing
                </p>
                <Button
                  onClick={() => router.push("/owner/properties/new")}
                  className="bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Property
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden bg-white">
                    <div className="h-48 bg-gray-200 relative">
                      {property.heroImage ? (
                        <img
                          src={property.heroImage}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Home className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            property.isPublished
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {property.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {property.location}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>{property.bedrooms || 0} Beds</span>
                        <span>{property.bathrooms || 0} Baths</span>
                        <span>{property.sleepsMax || 0} Guests</span>
                      </div>
                      {property.priceFromMidweek && (
                        <p className="text-lg font-bold text-[#17a2b8] mb-4">
                          £{property.priceFromMidweek} / night
                        </p>
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() =>
                            router.push(`/owner/properties/${property.id}/edit`)
                          }
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() =>
                            router.push(`/owner/properties/${property.id}/calendar`)
                          }
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteProperty(property.id, property.title)}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Personal Info Tab - continues in next replacement */}
          <TabsContent value="personal-info" className="mt-6">
            <Card className="p-8 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Edit Personal Info
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                These are your personal contact details.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Details
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="flex-1 px-4 py-3 rounded-full border-2 border-gray-300 bg-gray-50"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#17a2b8]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter Here..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter Here..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repeat Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter Here..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                  </div>
                  <Button className="mt-4 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full px-8">
                    Submit
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name?.split(" ")[0] || ""}
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name?.split(" ")[1] || ""}
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter Here..."
                        defaultValue={user.phone || ""}
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address 1
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Here..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address 2
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Here..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Town/City
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Here..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        County
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Here..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select className="w-full px-4 py-3 rounded-full border-2 border-gray-300">
                        <option>Select Country</option>
                        <option>United Kingdom</option>
                        <option>Ireland</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postcode
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Here..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Subscriptions
                  </h3>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm text-gray-700">Newsletter</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm text-gray-700">Late Deals</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 border-2 border-[#17a2b8] text-[#17a2b8]"
                  >
                    Cancel Changes
                  </Button>
                  <Button className="bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full px-8">
                    Submit
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Enquiries Tab */}
          <TabsContent value="enquiries" className="mt-6">
            <Card className="p-8 bg-white text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No enquiries yet
              </h3>
              <p className="text-gray-600">
                Enquiries from guests will appear here
              </p>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="mt-6">
            <Card className="p-8 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Property Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Enquiries</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">£0</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}





