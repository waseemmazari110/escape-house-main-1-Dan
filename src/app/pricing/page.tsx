"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { PricingTable } from "@/components/autumn/pricing-table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Award, Users, Clock } from "lucide-react";

export default function PricingPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Ensure user is logged in for pricing actions
  useEffect(() => {
    if (!isPending && !session && typeof window !== "undefined" && window.location.search.includes("plan=")) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [session, isPending, router]);

  const productDetails = [
    {
      id: "free",
      description: "Browse properties and save favorites. Perfect for exploring options.",
    },
    {
      id: "deposit_small",
      description: "Secure your booking for properties sleeping up to 12 guests.",
      recommendText: "Small Groups",
      price: {
        primaryText: "£200 deposit",
        secondaryText: "one-time payment",
      },
      items: [
        {
          primaryText: "1 Property Booking",
          secondaryText: "Secure your dates",
        },
        {
          primaryText: "Booking Confirmation",
          secondaryText: "Instant confirmation",
        },
        {
          primaryText: "Date Reservation",
          secondaryText: "Hold your preferred dates",
        },
        {
          primaryText: "Experience Add-ons Access",
          secondaryText: "Enhance your stay",
        },
      ],
    },
    {
      id: "deposit_medium",
      description: "Ideal for medium-sized groups sleeping 13-20 guests.",
      recommendText: "Most Popular",
      price: {
        primaryText: "£350 deposit",
        secondaryText: "one-time payment",
      },
      items: [
        {
          primaryText: "1 Property Booking",
          secondaryText: "Secure your dates",
        },
        {
          primaryText: "Booking Confirmation",
          secondaryText: "Instant confirmation",
        },
        {
          primaryText: "Date Reservation",
          secondaryText: "Hold your preferred dates",
        },
        {
          primaryText: "Experience Add-ons Access",
          secondaryText: "Enhance your stay",
        },
      ],
    },
    {
      id: "deposit_large",
      description: "Perfect for large groups sleeping 21+ guests.",
      recommendText: "Large Groups",
      price: {
        primaryText: "£500 deposit",
        secondaryText: "one-time payment",
      },
      items: [
        {
          primaryText: "1 Property Booking",
          secondaryText: "Secure your dates",
        },
        {
          primaryText: "Booking Confirmation",
          secondaryText: "Instant confirmation",
        },
        {
          primaryText: "Date Reservation",
          secondaryText: "Hold your preferred dates",
        },
        {
          primaryText: "Experience Add-ons Access",
          secondaryText: "Enhance your stay",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
            >
              Choose Your Perfect Package
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto leading-relaxed">
              Secure your luxury hen party house with a simple deposit. Browse properties for free, then choose the right deposit tier based on your group size.
            </p>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[var(--color-accent-sage)]" />
              </div>
              <h3 className="text-base font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Protected by Stripe</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-accent-gold)]/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-[var(--color-accent-gold)]" />
              </div>
              <h3 className="text-base font-semibold mb-2">5-Star Rated</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">3,000+ happy customers</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--color-accent-sage)]" />
              </div>
              <h3 className="text-base font-semibold mb-2">UK Support</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Brighton-based team</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-accent-gold)]/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[var(--color-accent-gold)]" />
              </div>
              <h3 className="text-base font-semibold mb-2">Fast Response</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">24-hour reply time</p>
            </div>
          </div>

          {/* Pricing Table */}
          <PricingTable productDetails={productDetails} />

          {/* Add-ons Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
              >
                Enhance Your Stay with Experiences
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
                After securing your deposit, add unforgettable experiences to make your hen party extra special.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Cocktail Masterclass",
                  price: "£50",
                  description: "Learn to mix cocktails with a professional bartender",
                },
                {
                  name: "Private Chef",
                  price: "£55",
                  description: "Enjoy gourmet meals prepared in your property",
                },
                {
                  name: "Sip & Paint",
                  price: "£45",
                  description: "Creative art session with drinks and guidance",
                },
                {
                  name: "Pamper Party",
                  price: "£65",
                  description: "Beauty treatments and spa services at your property",
                },
                {
                  name: "Yoga & Wellness",
                  price: "£40",
                  description: "Relaxing yoga session with experienced instructor",
                },
                {
                  name: "Murder Mystery Night",
                  price: "£50",
                  description: "Interactive detective game for groups",
                },
              ].map((addon) => (
                <div 
                  key={addon.name}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">{addon.name}</h3>
                  <p className="text-2xl font-bold text-[var(--color-accent-sage)] mb-3">
                    {addon.price} <span className="text-sm font-normal text-[var(--color-neutral-dark)]">per person</span>
                  </p>
                  <p className="text-sm text-[var(--color-neutral-dark)]">{addon.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-[var(--color-neutral-dark)]">
                Experience add-ons can be purchased after securing your property deposit.
              </p>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="mt-20 bg-white rounded-2xl p-8 md:p-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold mb-2">How do deposits work?</h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Your deposit secures your booking and holds your preferred dates. The remaining balance is due before your stay. Deposits are non-refundable but transferable to different dates subject to availability.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Which deposit tier should I choose?</h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Choose based on your group size: Small (up to 12 guests), Medium (13-20 guests), or Large (21+ guests). This ensures you have the right sized property for your group.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">When can I add experiences?</h3>
                <p className="text-[var(--color-neutral-dark)]">
                  After securing your property deposit, you'll have access to book experience add-ons. You can add these anytime before your stay.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-[var(--color-neutral-dark)]">
                  We accept all major credit and debit cards through our secure Stripe payment system. Your payment information is never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
