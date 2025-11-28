"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import EnquiryForm from "@/components/EnquiryForm";
import FAQAccordion from "@/components/FAQAccordion";
import { Button } from "@/components/ui/button";
import {
  Users,
  Bed,
  Bath,
  MapPin,
  Wifi,
  Car,
  Flame,
  Waves,
  Music,
  ChefHat,
  Download,
  Share2,
  Heart,
  Calendar,
  Loader2,
} from "lucide-react";

// Add metadata generation for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://groupescapehouses.co.uk';
    const response = await fetch(`${baseUrl}/api/properties?slug=${params.slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return {
        title: 'Property Not Found | Group Escape Houses',
        description: 'Luxury hen party houses across the UK with hot tubs, pools, and stylish interiors.',
      };
    }

    const properties = await response.json();
    const property = properties[0];

    if (!property) {
      return {
        title: 'Property Not Found | Group Escape Houses',
        description: 'Luxury hen party houses across the UK with hot tubs, pools, and stylish interiors.',
      };
    }

    const title = `${property.title} - Sleeps ${property.sleepsMax} | ${property.location}`;
    const description = property.description 
      ? property.description.substring(0, 155) + '...'
      : `Luxury hen party house in ${property.location} sleeping ${property.sleepsMax} guests. ${property.bedrooms} bedrooms, from £${property.priceFromWeekend} per weekend.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [property.heroImage],
        url: `${baseUrl}/properties/${params.slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [property.heroImage],
      },
      alternates: {
        canonical: `${baseUrl}/properties/${params.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Property | Group Escape Houses',
      description: 'Luxury hen party houses across the UK with hot tubs, pools, and stylish interiors.',
    };
  }
}

export default function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch property data from database
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the specific property by slug
        const propertyResponse = await fetch(`/api/properties?slug=${params.slug}`);
        
        if (!propertyResponse.ok) {
          throw new Error('Failed to fetch property');
        }

        const propertyData = await propertyResponse.json();
        
        if (!propertyData || propertyData.length === 0) {
          setError('Property not found');
          return;
        }

        const prop = propertyData[0];

        // Transform property data
        const transformedProperty = {
          id: prop.id,
          title: prop.title,
          location: prop.location,
          sleeps: prop.sleepsMax,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          priceWeekend: prop.priceFromWeekend,
          priceMidweek: prop.priceFromMidweek,
          images: [prop.heroImage], // TODO: Add gallery images from property_images
          description: prop.description,
          features: [], // TODO: Add features from property_features
          houseRules: [
            `Check-in: ${prop.checkInTime || '4pm'}`,
            `Check-out: ${prop.checkOutTime || '10am'}`,
            "No smoking inside",
            "Quiet hours: 11pm - 8am",
            `Maximum occupancy: ${prop.sleepsMax} guests`,
            "Damage deposit: £500 (refundable)",
          ],
          slug: prop.slug,
        };

        setProperty(transformedProperty);

        // Fetch related properties (same location, exclude current)
        const relatedResponse = await fetch(`/api/properties?isPublished=true&limit=3`);
        
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          
          const transformedRelated = relatedData
            .filter((p: any) => p.slug !== params.slug)
            .slice(0, 2)
            .map((p: any) => ({
              id: p.id.toString(),
              title: p.title,
              location: p.location,
              sleeps: p.sleepsMax,
              bedrooms: p.bedrooms,
              priceFrom: Math.round(p.priceFromMidweek / 3),
              image: p.heroImage,
              features: [],
              slug: p.slug,
            }));
          
          setRelatedProperties(transformedRelated);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Unable to load property. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [params.slug]);

  const faqs = [
    {
      question: "What is included in the price?",
      answer:
        "The price includes full use of the property and all facilities including hot tub, pool, games room, and all utilities. Bedding and towels are provided. Additional cleaning during your stay can be arranged for an extra fee.",
    },
    {
      question: "How do deposits and payments work?",
      answer:
        "A 25% deposit is required to secure your booking. The remaining balance is due 6 weeks before your arrival. A refundable damage deposit of £500 is also required.",
    },
    {
      question: "Can we bring pets?",
      answer:
        "Unfortunately, pets are not permitted at this property. Please check our other listings for pet-friendly options.",
    },
    {
      question: "Is there parking available?",
      answer:
        "Yes, there is free private parking for up to 6 cars on the property. Additional street parking is available nearby.",
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <Header />
        <div className="pt-24 pb-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-[var(--color-accent-sage)] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <Header />
        <div className="pt-24 pb-24 text-center">
          <h1 className="mb-4">Property Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the property you're looking for.</p>
          <Link href="/properties">
            <Button>Browse All Properties</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      <div className="pt-24">
        {/* Image Gallery */}
        <div className="max-w-[1400px] mx-auto px-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
            <div className="relative h-[400px] md:h-[600px]">
              <Image
                src={property.images[currentImageIndex]}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {property.images.slice(1, 4).map((image: string, index: number) => (
                <div key={index} className="relative h-[190px] md:h-[290px] cursor-pointer">
                  <Image
                    src={image}
                    alt={`${property.title} ${index + 2}`}
                    fill
                    className="object-cover hover:opacity-80 transition-opacity"
                    onClick={() => setCurrentImageIndex(index + 1)}
                  />
                </div>
              ))}
              {property.images.length < 4 && (
                <>
                  {[...Array(4 - property.images.length)].map((_, index) => (
                    <div key={`placeholder-${index}`} className="relative h-[190px] md:h-[290px] bg-gray-200"></div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Title and Location */}
              <div className="mb-8">
                <h1 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-lg text-[var(--color-neutral-dark)] mb-6">
                  <MapPin className="w-5 h-5" />
                  <span>{property.location}</span>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Fast Facts */}
              <div className="bg-white rounded-2xl p-8 mb-8 shadow-md">
                <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  Fast Facts
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-pink)]" />
                    <p className="text-2xl font-bold">{property.sleeps}</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Sleeps</p>
                  </div>
                  <div className="text-center">
                    <Bed className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-sage)]" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-gold)]" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Bathrooms</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-pink)]" />
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Night min</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--color-bg-secondary)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Weekend from</p>
                      <p className="text-3xl font-bold" style={{ color: "var(--color-accent-pink)" }}>
                        £{property.priceWeekend}
                      </p>
                      <p className="text-xs text-[var(--color-neutral-dark)]">
                        Split from £{Math.round(property.priceWeekend / property.sleeps)} per guest
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Midweek from</p>
                      <p className="text-3xl font-bold" style={{ color: "var(--color-accent-sage)" }}>
                        £{property.priceMidweek}
                      </p>
                      <p className="text-xs text-[var(--color-neutral-dark)]">
                        Split from £{Math.round(property.priceMidweek / property.sleeps)} per guest
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  About this property
                </h3>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-8 mb-8 shadow-md">
                <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Default features - will be replaced with dynamic features later */}
                  {[
                    { icon: Waves, label: "Hot Tub" },
                    { icon: Wifi, label: "Fast Wi-Fi" },
                    { icon: Car, label: "Free Parking" },
                    { icon: Flame, label: "BBQ Area" },
                    { icon: ChefHat, label: "Gourmet Kitchen" },
                    { icon: Music, label: "Sound System" },
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="text-center">
                        <div
                          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                          style={{ background: "var(--color-accent-pink)/20" }}
                        >
                          <Icon className="w-8 h-8" style={{ color: "var(--color-accent-pink)" }} />
                        </div>
                        <p className="text-sm font-medium">{feature.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--color-bg-secondary)]">
                  <Button variant="outline" className="rounded-xl">
                    <Download className="w-4 h-4 mr-2" />
                    Download Floorplan
                  </Button>
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  House Rules
                </h3>
                <ul className="space-y-3">
                  {property.houseRules.map((rule: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[var(--color-accent-pink)] mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQs */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  Frequently Asked Questions
                </h3>
                <FAQAccordion faqs={faqs} />
              </div>
            </div>

            {/* Right Column - Enquiry Form */}
            <div className="lg:col-span-1">
              <EnquiryForm propertyTitle={property.title} propertySlug={params.slug} />
            </div>
          </div>

          {/* Related Properties */}
          {relatedProperties.length > 0 && (
            <div className="mt-24">
              <h3 className="text-3xl font-semibold mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Similar Properties
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedProperties.map((relatedProperty) => (
                  <PropertyCard key={relatedProperty.id} {...relatedProperty} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 z-40 border-t border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--color-neutral-dark)]">From</p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-accent-pink)" }}>
              £{property.priceMidweek}
            </p>
          </div>
          <Button
            asChild
            className="rounded-2xl px-8 py-6 font-medium"
            style={{
              background: "var(--color-accent-pink)",
              color: "var(--color-text-primary)",
            }}
          >
            <a href="#enquiry">Enquire Now</a>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}