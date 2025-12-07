"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, UsersRound, MapPinned } from "lucide-react";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";
import { useMemo } from "react";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  sleeps: number;
  bedrooms: number;
  priceFrom: number;
  image: string;
  features: string[];
  slug: string;
}

export default function PropertyCard({
  id,
  title,
  location,
  sleeps,
  bedrooms,
  priceFrom,
  image,
  features,
  slug,
}: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAllowedImageHost = useMemo(() => {
    try {
      const url = new URL(image);
      const allowed = new Set([
        "slelguoygbfzlpylpxfs.supabase.co",
        "images.unsplash.com",
        "v3b.fal.media",
        "butlersinthebuff.com.au",
        "butlersinthebuff.co.uk",
        "encrypted-tbn0.gstatic.com",
        "www.londonbay.com",
        "www.propertista.co.uk",
        "propertista.co.uk",
        "localhost",
        "127.0.0.1",
      ]);
      return allowed.has(url.hostname);
    } catch (e) {
      return false;
    }
  }, [image]);

  // Extract city name and convert to slug for destination link
  const getDestinationSlug = (location: string) => {
    const city = location.split(',')[0].trim().toLowerCase();
    return city.replace(/\s+/g, '-');
  };

  const destinationSlug = getDestinationSlug(location);

  return (
    <>
      <div className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
        <Link href={`/properties/${slug}`}>
          <div className="relative h-64 overflow-hidden bg-gray-200">
            {!imageError && isAllowedImageHost ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : !imageError ? (
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <span className="text-white text-sm font-medium">Image unavailable</span>
              </div>
            )}
            
            {/* Feature Tags */}
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              {features.slice(0, 2).map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsSaved(!isSaved);
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-5 h-5 ${
                  isSaved ? "fill-red-500 text-red-500" : "text-[var(--color-text-primary)]"
                }`}
              />
            </button>
          </div>
        </Link>

        <div className="p-6">
          <Link href={`/properties/${slug}`}>
            <h3
              className="text-xl font-semibold mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {title}
            </h3>
          </Link>

          <Link 
            href={`/destinations/${destinationSlug}`}
            className="flex items-center gap-2 text-sm text-[var(--color-neutral-dark)] mb-4 hover:text-[var(--color-accent-sage)] transition-colors w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <MapPinned className="w-4 h-4" />
            <span>{location}</span>
          </Link>

          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <UsersRound className="w-4 h-4 text-[var(--color-accent-sage)]" />
              <span>Sleeps {sleeps}</span>
            </div>
            <span className="text-[var(--color-neutral-dark)]">•</span>
            <span>{bedrooms} bedrooms</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-bg-secondary)]">
            <div>
              <p className="text-sm text-[var(--color-neutral-dark)]">From</p>
              <p className="text-2xl font-semibold" style={{ color: "var(--color-accent-sage)" }}>
                £{priceFrom}
              </p>
              <p className="text-xs text-[var(--color-neutral-dark)]">per night</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/properties/${slug}`}
                className="px-4 py-2 rounded-xl border-2 font-medium text-sm transition-all duration-200 hover:bg-[var(--color-accent-sage)] hover:text-white hover:border-[var(--color-accent-sage)]"
                style={{
                  borderColor: "var(--color-accent-sage)",
                  color: "var(--color-text-primary)",
                }}
              >
                View
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setBookingModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white",
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        propertyId={id}
        propertyTitle={title}
        priceFrom={priceFrom}
      />
    </>
  );
}





