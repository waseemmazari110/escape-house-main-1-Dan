import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare,
  CreditCard,
  BarChart3,
  FileEdit,
  Check,
  ArrowRight,
  Star,
  Download,
  Users,
  Home,
  Trophy,
  BookOpen
} from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise Your Property on Group Escape Houses",
  description: "No hidden costs, no commission, just direct bookings from guests who love luxury group stays. Simple annual membership for quality large group houses.",
  openGraph: {
    title: "Advertise Your Property on Group Escape Houses",
    description: "No hidden costs, no commission, just direct bookings from guests who love luxury group stays.",
    type: "website",
  },
};

export default function AdvertiseWithUs() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-0 overflow-hidden">
          <div className="relative h-[600px] w-full">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxurious-large-group-holiday-property-e-77c8a93c-20251127181030.jpg"
              alt="Luxury large group holiday property"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1200px] mx-auto px-6 w-full">
                <div className="max-w-3xl">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white" style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                    Advertise Your Property on Group Escape Houses
                  </h1>
                  
                  <p className="text-2xl mb-10 leading-relaxed text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                    No hidden costs, no commission, just direct bookings from guests who love luxury group stays.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      asChild
                      size="lg"
                      className="rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                      style={{ background: "var(--color-accent-sage)" }}
                    >
                      <Link href="#contact">
                        Register Your Property
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                    
                    <Button 
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-2xl px-10 py-6 text-lg font-semibold bg-white/95 hover:bg-white border-0 text-[var(--color-text-primary)]"
                    >
                      <Link href="#download">
                        Download Owners Guide
                        <Download className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Short Intro */}
        <section className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
                No Hidden Costs, No Hidden Surprises
              </h2>
              
              <div className="space-y-6 text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                <p>
                  Group Escape Houses is for quality large group houses, barns, estates and lodges that sleep 10 or more guests. We're passionate about showcasing the best properties across the UK for memorable group holidays.
                </p>
                
                <p>
                  Owners keep full control of prices, booking process and guest contact. You manage everything the way you want, while we drive enquiries directly to you.
                </p>
                
                <p>
                  We charge a simple annual membership, not commission on every booking. This means more revenue in your pocket and a transparent relationship with no surprise fees. Ideal for owners who want more control, more flexibility and direct contact with guests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: What You Get */}
        <section className="py-20 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                What You Get With Your Group Escape Houses Listing
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-sage)]/10 flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-[var(--color-accent-sage)]" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Direct Contact With Guests
                </h3>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                  All enquiries come straight to you so you can build a direct relationship with every group.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-sage)]/10 flex items-center justify-center mb-6">
                  <CreditCard className="w-7 h-7 text-[var(--color-accent-sage)]" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Commission Free Bookings
                </h3>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                  We charge an annual membership, not a slice of each booking, so you keep more of your revenue.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-sage)]/10 flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-[var(--color-accent-sage)]" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Owner Dashboard
                </h3>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                  Log in to view enquiries, track listing performance and update key details at any time.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-sage)]/10 flex items-center justify-center mb-6">
                  <FileEdit className="w-7 h-7 text-[var(--color-accent-sage)]" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Unique Property Page
                </h3>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                  Showcase your property with photos, description, facilities, pricing and clear calls to book direct.
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-accent-sage)]/10 border-l-4 border-[var(--color-accent-sage)] rounded-lg p-8 max-w-5xl mx-auto">
              <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                <strong className="text-[var(--color-text-primary)]">Bonus:</strong> You also get a free Late Availability feature where you can promote last minute dates up to three months ahead, including peak times such as Christmas and New Year.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Why Different */}
        <section className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-center" style={{ fontFamily: "var(--font-display)" }}>
              Why Advertise With Group Escape Houses
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 flex-shrink-0 mt-1 text-[var(--color-accent-sage)]" />
                    <span className="text-lg text-[var(--color-neutral-dark)]">
                      You set your own prices and booking rules
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 flex-shrink-0 mt-1 text-[var(--color-accent-sage)]" />
                    <span className="text-lg text-[var(--color-neutral-dark)]">
                      You control and update your own calendar
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 flex-shrink-0 mt-1 text-[var(--color-accent-sage)]" />
                    <span className="text-lg text-[var(--color-neutral-dark)]">
                      Direct link to your own website or booking system
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 flex-shrink-0 mt-1 text-[var(--color-accent-sage)]" />
                    <span className="text-lg text-[var(--color-neutral-dark)]">
                      Live availability through iCal connections to your current PMS or booking software
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 flex-shrink-0 mt-1 text-[var(--color-accent-sage)]" />
                    <span className="text-lg text-[var(--color-neutral-dark)]">
                      Rich media gallery for images, videos and floorplans
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 flex-shrink-0 mt-1 text-[var(--color-accent-sage)]" />
                    <span className="text-lg text-[var(--color-neutral-dark)]">
                      Dedicated support from our team to help your listing perform
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 flex-shrink-0 mt-1 text-[var(--color-accent-sage)]" />
                    <span className="text-lg text-[var(--color-neutral-dark)]">
                      SEO and PR activity to promote high quality properties to our audience
                    </span>
                  </li>
                </ul>
              </div>

              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/stunning-luxury-group-accommodation-prop-b3cdd1f4-20251127181030.jpg"
                  alt="Luxury group property"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Membership and Pricing */}
        <section id="pricing" className="py-20 bg-[var(--color-bg-secondary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-4">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Membership and Pricing Options
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)]">
                Choose the membership that suits your marketing needs, all with commission free direct bookings.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8 mt-12">
              {/* Bronze */}
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Bronze
                  </h3>
                  <p className="text-[var(--color-neutral-dark)]">
                    Fully optimised listing and core support.
                  </p>
                </div>
                
                <div className="mb-8">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 justify-center mb-1">
                      <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        £450
                      </span>
                      <span className="text-[var(--color-neutral-dark)]">+ VAT</span>
                    </div>
                    <p className="text-sm text-center text-[var(--color-neutral-dark)]">per year</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-[var(--color-neutral-dark)] mb-1">
                      Or <strong>£40 per month</strong>
                    </p>
                    <p className="text-xs text-[var(--color-neutral-dark)]">
                      Minimum 12 months
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Fully optimised property page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Annual membership with direct enquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Live availability via iCal connections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Direct link to your own booking system or website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Access to Owner Dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Standard SEO and marketing support</span>
                  </li>
                </ul>
                
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full rounded-2xl px-8 py-6 font-semibold border-2 border-[var(--color-accent-sage)] text-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] hover:text-white transition-all"
                >
                  <Link href="#contact">
                    Get Started
                  </Link>
                </Button>
              </div>

              {/* Silver - Most Popular */}
              <div className="bg-white rounded-3xl p-8 border-2 border-[var(--color-accent-sage)] shadow-2xl relative scale-105 hover:shadow-xl transition-all">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[var(--color-accent-sage)] text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Silver
                  </h3>
                  <p className="text-[var(--color-neutral-dark)]">
                    Extra visibility and marketing support.
                  </p>
                </div>
                
                <div className="mb-8">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 justify-center mb-1">
                      <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        £650
                      </span>
                      <span className="text-[var(--color-neutral-dark)]">+ VAT</span>
                    </div>
                    <p className="text-sm text-center text-[var(--color-neutral-dark)]">per year</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-[var(--color-neutral-dark)] mb-1">
                      Or <strong>£57 per month</strong>
                    </p>
                    <p className="text-xs text-[var(--color-neutral-dark)]">
                      Minimum 12 months
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm font-semibold">Everything in Bronze</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Page build and ongoing production support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Social media promotion including late deals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Themed blog feature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Inclusion on three Holiday Focus pages for added reach</span>
                  </li>
                </ul>
                
                <Button 
                  asChild
                  size="lg"
                  className="w-full rounded-2xl px-8 py-6 font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "var(--color-accent-sage)" }}
                >
                  <Link href="#contact">
                    Get Started
                  </Link>
                </Button>
              </div>

              {/* Gold */}
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Gold
                  </h3>
                  <p className="text-[var(--color-neutral-dark)]">
                    Maximum exposure for premium properties.
                  </p>
                </div>
                
                <div className="mb-8">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 justify-center mb-1">
                      <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        £850
                      </span>
                      <span className="text-[var(--color-neutral-dark)]">+ VAT</span>
                    </div>
                    <p className="text-sm text-center text-[var(--color-neutral-dark)]">per year</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-[var(--color-neutral-dark)] mb-1">
                      Or <strong>£75 per month</strong>
                    </p>
                    <p className="text-xs text-[var(--color-neutral-dark)]">
                      Minimum 12 months
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm font-semibold">Everything in Silver</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Homepage features during the year</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Specialist page placement, for example Weddings, Youth, or Business groups</span>
                  </li>
                </ul>
                
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full rounded-2xl px-8 py-6 font-semibold border-2 border-[var(--color-accent-sage)] text-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] hover:text-white transition-all"
                >
                  <Link href="#contact">
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                All memberships include unlimited enquiries, with no commission charged on bookings.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: PDF Download */}
        <section id="download" className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Take More Direct Bookings – Download The Owners Guide
                </h2>
                
                <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-8">
                  Want to see exactly how Group Escape Houses can work for your property? The Owners Guide walks you through listings, marketing, membership options and how to maximise direct bookings from large groups.
                </p>
                
                <Button 
                  asChild
                  size="lg"
                  className="rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  style={{ background: "var(--color-accent-sage)" }}
                >
                  <Link href="#contact">
                    Download Owners Guide
                    <Download className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                
                <p className="text-sm text-[var(--color-neutral-dark)] mt-4">
                  We will email you a copy and give you access to any future updates.
                </p>
              </div>

              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/modern-businessman-using-tablet-device-v-9c3d19e0-20251127181031.jpg"
                  alt="Property owner viewing booking confirmation on tablet"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Owner Resources */}
        <section className="py-20 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Owner Resources
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              <Link 
                href="/our-story"
                className="group p-6 rounded-2xl bg-white hover:bg-[var(--color-accent-sage)] transition-all hover:shadow-lg text-center"
              >
                <Users className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:text-white transition-colors" />
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  Meet the Team
                </h3>
              </Link>

              <Link 
                href="/properties"
                className="group p-6 rounded-2xl bg-white hover:bg-[var(--color-accent-sage)] transition-all hover:shadow-lg text-center"
              >
                <Home className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:text-white transition-colors" />
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  Properties Recently Joined
                </h3>
              </Link>

              <Link 
                href="#testimonials"
                className="group p-6 rounded-2xl bg-white hover:bg-[var(--color-accent-sage)] transition-all hover:shadow-lg text-center"
              >
                <Trophy className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:text-white transition-colors" />
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  Success Stories
                </h3>
              </Link>

              <Link 
                href="#download"
                className="group p-6 rounded-2xl bg-white hover:bg-[var(--color-accent-sage)] transition-all hover:shadow-lg text-center"
              >
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:text-white transition-colors" />
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  Owner Guides
                </h3>
              </Link>
            </div>

            {/* Testimonials */}
            <div id="testimonials" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" />
                  ))}
                </div>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed italic mb-6">
                  "Set up was quick, the listing looks great and our annual membership paid for itself in the first week with confirmed bookings."
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-bg-secondary)]">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-portrait-photograph-of-a-co-c2a10f6e-20251127184832.jpg"
                      alt="Sarah Mitchell"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Sarah Mitchell</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Manor House Owner, Cotswolds</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" />
                  ))}
                </div>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed italic mb-6">
                  "We get regular enquiries for large groups and the team are always helpful and proactive."
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-bg-secondary)]">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-portrait-photograph-of-a-fr-81c7fcec-20251127184832.jpg"
                      alt="James Thornton"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">James Thornton</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Estate Owner, Lake District</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" />
                  ))}
                </div>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed italic mb-6">
                  "Professional support from start to finish. The commission-free model makes so much more sense for our business."
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-bg-secondary)]">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-portrait-photograph-of-a-su-474d0a6c-20251127184832.jpg"
                      alt="Emma Richardson"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Emma Richardson</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Country House Owner, Yorkshire</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Final CTA */}
        <section id="contact" className="py-20 bg-[var(--color-bg-secondary)]">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Join Group Escape Houses Today
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Ready to unlock more direct bookings for your large group property? Become a member of Group Escape Houses and reach guests who are searching specifically for luxury houses and estates for groups.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
              <div className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all">
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  Email Us
                </h3>
                <a 
                  href="mailto:hello@groupescapehouses.co.uk" 
                  className="text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors text-lg font-medium"
                >
                  hello@groupescapehouses.co.uk
                </a>
              </div>
              
              <div className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all">
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  Visit Our Office
                </h3>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                  11a North St<br />
                  Brighton and Hove<br />
                  Brighton BN41 1DH
                </p>
              </div>
            </div>

            <Button 
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ background: "var(--color-accent-sage)" }}
            >
              <Link href="/contact">
                Register Your Property
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}