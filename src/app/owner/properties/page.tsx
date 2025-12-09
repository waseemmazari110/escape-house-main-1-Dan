"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { ArrowLeft, Building, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Property {
  id: number;
  title: string;
  location: string;
  sleepsMax: number;
  bedrooms: number;
  priceFromWeekend: number;
  isPublished: boolean;
  heroImage: string;
}

function OwnerPropertiesContent() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/owner/properties', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProperties(data.properties || []);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-sage)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/owner/dashboard")}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Building className="w-8 h-8 text-[var(--color-accent-sage)]" />
                  My Properties
                </h1>
                <p className="text-sm text-gray-600 mt-1">Manage all your listings</p>
              </div>
            </div>
            <Link href="/owner/properties/new">
              <Button className="inline-flex items-center gap-2 bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)]/90 text-white">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Property</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {properties.length === 0 ? (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-gray-200">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h2>
            <p className="text-gray-600 mb-6">Get started by adding your first property</p>
            <Link href="/owner/properties/new">
              <Button className="bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)]/90 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                {property.heroImage && (
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={property.heroImage}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          property.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {property.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{property.location}</p>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>🛏️ {property.bedrooms} bed</span>
                    <span>👥 {property.sleepsMax} guests</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-[var(--color-accent-sage)]">
                      £{property.priceFromWeekend}
                    </div>
                    <Link href={`/owner/properties/${property.id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OwnerPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "admin"]}>
      <OwnerPropertiesContent />
    </ProtectedRoute>
  );
}
