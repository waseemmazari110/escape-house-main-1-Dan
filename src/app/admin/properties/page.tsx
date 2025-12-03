"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { GEH_API } from "@/lib/api-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Calendar, PoundSterling, Search, Filter, LogOut, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Property {
  id: string;
  title: string;
  status: "active" | "inactive" | "draft";
  town: string;
  max_guests: number;
  price_from: number;
  updated_at: string;
}

interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

function AdminPropertiesPageContent() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [townFilter, setTownFilter] = useState<string>("all");

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  // Fetch properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "50",
        page: page.toString(),
        isPublished: "true", // Show only published properties
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (townFilter !== "all") {
        params.append("town", townFilter);
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const data = await GEH_API.get<PropertiesResponse>(
        `/properties?${params.toString()}`
      );

      setProperties(data.properties);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, statusFilter, townFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchProperties();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      draft: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles] || styles.draft
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Properties Management
            </h1>
            <p className="text-gray-600">
              Manage your property listings, availability, and pricing
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Owner</p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* Town Filter */}
            <Select value={townFilter} onValueChange={setTownFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Town" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Towns</SelectItem>
                <SelectItem value="brighton">Brighton</SelectItem>
                <SelectItem value="bath">Bath</SelectItem>
                <SelectItem value="manchester">Manchester</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="liverpool">Liverpool</SelectItem>
                <SelectItem value="york">York</SelectItem>
                <SelectItem value="newcastle">Newcastle</SelectItem>
                <SelectItem value="cardiff">Cardiff</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button onClick={handleSearch} variant="default">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>

            {/* Add New Property */}
            <Button
              asChild
              style={{ background: "var(--color-accent-sage)", color: "white" }}
            >
              <Link href="/admin/properties/new">Add Property</Link>
            </Button>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading properties...</div>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-4">No properties found</p>
                <Button asChild>
                  <Link href="/admin/properties/new">Create First Property</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Town</TableHead>
                    <TableHead>Max Guests</TableHead>
                    <TableHead>Price From</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        {property.title}
                      </TableCell>
                      <TableCell>{getStatusBadge(property.status)}</TableCell>
                      <TableCell className="capitalize">{property.town}</TableCell>
                      <TableCell>{property.max_guests}</TableCell>
                      <TableCell>£{property.price_from}</TableCell>
                      <TableCell>
                        {format(new Date(property.updated_at), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            title="Edit Property"
                          >
                            <Link href={`/admin/properties/${property.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            title="Manage Availability"
                          >
                            <Link href={`/admin/properties/${property.id}/availability`}>
                              <Calendar className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            title="Manage Pricing"
                          >
                            <Link href={`/admin/properties/${property.id}/pricing`}>
                              <PoundSterling className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                  <div className="text-sm text-gray-700">
                    Showing page {page} of {totalPages} ({total} total properties)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={['owner', 'admin']}>
      <AdminPropertiesPageContent />
    </ProtectedRoute>
  );
}





