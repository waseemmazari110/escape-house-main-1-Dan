"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { 
  Loader2
} from "lucide-react";

// Force dynamic rendering since this page uses searchParams
export const dynamic = 'force-dynamic';

// Destinations list
const destinations = [
  { name: "Bath", slug: "bath" },
  { name: "Birmingham", slug: "birmingham" },
  { name: "Blackpool", slug: "blackpool" },
  { name: "Bournemouth", slug: "bournemouth" },
  { name: "Brighton", slug: "brighton" },
  { name: "Bristol", slug: "bristol" },
  { name: "Cambridge", slug: "cambridge" },
  { name: "Canterbury", slug: "canterbury" },
  { name: "Cardiff", slug: "cardiff" },
  { name: "Cheltenham", slug: "cheltenham" },
  { name: "Chester", slug: "chester" },
  { name: "Cotswolds", slug: "cotswolds" },
  { name: "Durham", slug: "durham" },
  { name: "Exeter", slug: "exeter" },
  { name: "Harrogate", slug: "harrogate" },
  { name: "Lake District", slug: "lake-district" },
  { name: "Leeds", slug: "leeds" },
  { name: "Liverpool", slug: "liverpool" },
  { name: "London", slug: "london" },
  { name: "Manchester", slug: "manchester" },
  { name: "Margate", slug: "margate" },
  { name: "Newcastle", slug: "newcastle" },
  { name: "Newquay", slug: "newquay" },
  { name: "Nottingham", slug: "nottingham" },
  { name: "Oxford", slug: "oxford" },
  { name: "Plymouth", slug: "plymouth" },
  { name: "Sheffield", slug: "sheffield" },
  { name: "St Ives", slug: "st-ives" },
  { name: "Stratford-upon-Avon", slug: "stratford-upon-avon" },
  { name: "Windsor", slug: "windsor" },
  { name: "York", slug: "york" },
].sort((a, b) => a.name.localeCompare(b.name));

const featureOptions = [
  { icon: null, label: "Hot Tub" },
  { icon: null, label: "Pool" },
  { icon: null, label: "Games Room" },
  { icon: null, label: "Pet Friendly" },
  { icon: null, label: "Accessible" },
  { icon: null, label: "Cinema" },
  { icon: null, label: "BBQ" },
  { icon: null, label: "Garden" },
];

// Separate component that uses useSearchParams
function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(6);
  
  // NEW: State for dynamic data
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  
  // Read search params from homepage (destination, checkIn, checkOut, guests, pets)
  const destinationParam = searchParams.get("destination") || searchParams.get("location") || "";
  const guestsParam = searchParams.get("guests") || "0";
  
  const [filters, setFilters] = useState({
    location: destinationParam,
    groupSize: parseInt(guestsParam),
    priceMin: 50,
    priceMax: 3000,
    features: [] as string[],
  });

  // NEW: Fetch properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoadingData(true);
        setDataError(null);

        const response = await fetch('/api/properties?isPublished=true', { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        // Handle both array and object response formats
        const propertiesArray = Array.isArray(data) ? data : (data.properties || []);

        // Transform properties data to match PropertyCard props
        const transformedProperties = propertiesArray.map((prop: any) => ({
          id: prop.id.toString(),
          title: prop.title,
          location: prop.location,
          sleeps: prop.sleepsMax,
          bedrooms: prop.bedrooms,
          priceFrom: prop.priceFromWeekend || prop.priceFromMidweek,
          image: prop.heroImage,
          features: [], // Features will be added when we integrate property_features
          slug: prop.slug,
        }));

        setProperties(transformedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setDataError('Unable to load properties. Please refresh the page.');
        setProperties([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchProperties();
  }, []);

  // Update URL when location filter changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Remove old destination param to avoid conflicts
    params.delete("destination");
    
    if (filters.location) {
      params.set("location", filters.location);
    } else {
      params.delete("location");
    }
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  }, [filters.location, router, searchParams]);

  // Reset displayedCount when filters change
  useEffect(() => {
    setDisplayedCount(6);
  }, [filters]);

  const toggleFeature = (feature: string) => {
    setFilters((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  // Apply filters to properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Location filter
      if (filters.location) {
        const locationMatch = property.location
          .toLowerCase()
          .includes(filters.location.toLowerCase().replace("-", " "));
        if (!locationMatch) return false;
      }

      // Group size filter
      if (filters.groupSize > 0 && property.sleeps < filters.groupSize) {
        return false;
      }

      // Price filter
      if (property.priceFrom < filters.priceMin || property.priceFrom > filters.priceMax) {
        return false;
      }

      // Features filter - Skip for now until we integrate property_features
      // if (filters.features.length > 0) {
      //   const hasAllFeatures = filters.features.every((feature) =>
      //     property.features.includes(feature)
      //   );
      //   if (!hasAllFeatures) return false;
      // }

      return true;
    });
  }, [filters, properties]);

  const visibleProperties = filteredProperties.slice(0, displayedCount);
  const hasMore = displayedCount < filteredProperties.length;

  const loadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 6, filteredProperties.length));
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div>
            <h1 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Luxury Group Houses to Rent
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl">
              Perfect for hen parties, weddings, celebrations, and group getaways across the UK
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-12 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Filter Toggle Button (Mobile) */}
          <div className="md:hidden mb-6">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full rounded-xl py-6 font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`md:w-80 ${showFilters ? "block" : "hidden md:block"}`}>
              <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFilters({
                        location: "",
                        groupSize: 0,
                        priceMin: 50,
                        priceMax: 3000,
                        features: [],
                      })
                    }
                    className="hover:text-[var(--color-accent-pink)] transition-colors"
                  >
                    Clear all
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Location
                    </label>
                    <select
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent-sage)] focus:border-transparent"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    >
                      <option value="">All locations</option>
                      {destinations.map((destination) => (
                        <option key={destination.slug} value={destination.slug}>
                          {destination.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Group Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Group size: {filters.groupSize > 0 ? `${filters.groupSize}+ people` : 'Any'}
                    </label>
                    <Slider
                      value={[filters.groupSize]}
                      onValueChange={([value]) => setFilters({ ...filters, groupSize: value })}
                      max={30}
                      step={2}
                      className="py-4"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Price per night: £{filters.priceMin} - £{filters.priceMax}
                    </label>
                    <Slider
                      value={[filters.priceMin, filters.priceMax]}
                      onValueChange={([min, max]) =>
                        setFilters({ ...filters, priceMin: min, priceMax: max })
                      }
                      max={3000}
                      step={10}
                      className="py-4"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                      Features
                    </label>
                    <div className="space-y-2">
                      {featureOptions.map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <label 
                            key={feature.label} 
                            className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={filters.features.includes(feature.label)}
                              onChange={() => toggleFeature(feature.label)}
                              className="w-4 h-4 rounded accent-[var(--color-accent-pink)]"
                            />
                            <span className="text-sm">{feature.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instant Enquiry Only */}
                  <div>
                    <label 
                      className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded accent-[var(--color-accent-pink)]"
                      />
                      <span className="text-sm font-medium">Instant enquiry only</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Grid */}
            <div className="flex-1">
              {/* Error State */}
              {dataError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {dataError}
                </div>
              )}

              {/* Sort and Count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-[var(--color-neutral-dark)] flex items-center gap-2">
                  {isLoadingData ? (
                    "Loading properties..."
                  ) : (
                    `Showing ${visibleProperties.length} of ${filteredProperties.length} properties`
                  )}
                </p>
                <select className="px-4 py-2 rounded-xl border border-gray-300 text-sm transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent-sage)] focus:border-transparent">
                  <option>Sort by: Price (Low to High)</option>
                  <option>Sort by: Price (High to Low)</option>
                  <option>Sort by: Sleeps (Most first)</option>
                  <option>Sort by: Newest</option>
                </select>
              </div>

              {/* Property Cards */}
              {isLoadingData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-96"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {visibleProperties.length > 0 ? (
                    visibleProperties.map((property) => (
                      <div key={property.id}>
                        <PropertyCard {...property} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-xl text-[var(--color-neutral-dark)]">
                        No properties match your filters. Try adjusting your search criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Load More */}
              {!isLoadingData && hasMore && (
                <div className="text-center mt-12">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={loadMore}
                      size="lg"
                      className="rounded-2xl px-10 py-6 font-medium transition-all duration-300 hover:scale-[1.05] hover:shadow-lg"
                      style={{
                        background: "var(--color-accent-sage)",
                        color: "white",
                      }}
                    >
                      Load More Properties
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-2xl px-10 py-6 font-medium border-2 transition-all duration-300 hover:bg-[var(--color-accent-gold)] hover:text-white hover:border-[var(--color-accent-gold)]"
                      style={{
                        borderColor: "var(--color-accent-gold)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      <Link href="/contact">Request a Quote</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Loading fallback component
function PropertiesLoading() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div>
            <h1 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Hen Party Houses to Rent
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl">
              Luxury group accommodation across the UK with hot tubs, pools, and amazing features
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[var(--color-accent-sage)] animate-spin" />
          </div>
        </div>
      </section>
    </>
  );
}

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />
      <Suspense fallback={<PropertiesLoading />}>
        <PropertiesContent />
      </Suspense>
      <Footer />
    </div>
  );
}





