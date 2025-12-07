"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDownIcon, LogOut, User as UserIcon, CreditCard, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCustomer } from "autumn-js/react";
import AuthModal from "@/components/AuthModal";

// Safe wrapper for useCustomer that handles SSR
function useSafeCustomer() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  try {
    const customerData = useCustomer();
    return mounted ? customerData : { customer: null, isLoading: false };
  } catch (e) {
    return { customer: null, isLoading: false };
  }
}

function Header() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const { customer, isLoading: isCustomerLoading } = useSafeCustomer();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHousesOpen, setIsHousesOpen] = useState(false);
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);
  const [isExperiencesOpen, setIsExperiencesOpen] = useState(false);
  const [isMobileStylesOpen, setIsMobileStylesOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const [isMobileDestinationsOpen, setIsMobileDestinationsOpen] = useState(false);
  const [isMobileOccasionsOpen, setIsMobileOccasionsOpen] = useState(false);
  const [isMobileExperiencesOpen, setIsMobileExperiencesOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authType, setAuthType] = useState<"guest" | "owner">("guest");
  const [userRole, setUserRole] = useState<'guest' | 'owner' | 'admin'>('guest');

  // Fetch user role from profile API
  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user) {
        try {
          const token = localStorage.getItem("bearer_token");
          const response = await fetch("/api/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const profile = await response.json();
            setUserRole(profile.role || 'guest');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole('guest');
      }
    }
    
    fetchUserRole();
  }, [session]);

  const isAdmin = userRole === 'admin';
  const isOwner = userRole === 'owner';
  const isGuest = userRole === 'guest';

  // Get current plan name
  const currentPlan = customer?.products?.at(-1);
  const planName = currentPlan?.name || "Free Plan";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open and reset submenu states when closing
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset submenu states when menu closes
      setIsMobileStylesOpen(false);
      setIsMobileFeaturesOpen(false);
      setIsMobileDestinationsOpen(false);
      setIsMobileOccasionsOpen(false);
      setIsMobileExperiencesOpen(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    
    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    
    if (error?.code) {
      toast.error("Error signing out");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  const houseStyles = [
    { title: "Manor Houses", slug: "manor-houses" },
    { title: "Country Houses", slug: "country-houses" },
    { title: "Luxury Houses", slug: "luxury-houses" },
    { title: "Castles", slug: "castles" },
    { title: "Party Houses", slug: "party-houses" },
    { title: "Large Holiday Homes", slug: "large-holiday-homes" },
    { title: "Large Cottages", slug: "large-cottages" },
    { title: "Stately Houses", slug: "stately-houses" },
  ];

  const features = [
    { title: "Hot Tub", slug: "hot-tub" },
    { title: "Swimming Pool", slug: "swimming-pool" },
    { title: "Games Room", slug: "games-room" },
    { title: "Cinema Room", slug: "cinema-room" },
    { title: "Tennis Court", slug: "tennis-court" },
    { title: "EV Charging", slug: "ev-charging" },
    { title: "Ground Floor Bedroom", slug: "ground-floor-bedroom" },
    { title: "Indoor Swimming Pool", slug: "indoor-swimming-pool" },
  ];

  const destinations = [
    { title: "Brighton", slug: "brighton" },
    { title: "Bath", slug: "bath" },
    { title: "London", slug: "london" },
    { title: "Manchester", slug: "manchester" },
    { title: "Bournemouth", slug: "bournemouth" },
    { title: "York", slug: "york" },
    { title: "Cardiff", slug: "cardiff" },
    { title: "Newcastle", slug: "newcastle" },
  ];

  const occasions = [
    { title: "Weddings & Celebrations", slug: "weddings", description: "Perfect for your special day" },
    { title: "Weekend Breaks", slug: "weekend-breaks", description: "Relaxing group getaways" },
    { title: "Special Celebrations", slug: "special-celebrations", description: "Birthdays & milestones" },
    { title: "Hen Parties", slug: "hen-party-houses", description: "Memorable hen weekends" },
    { title: "Christmas Gatherings", slug: "christmas", description: "Festive celebrations" },
    { title: "New Year Events", slug: "new-year", description: "Ring in the new year" },
  ];

  const experiences = [
    { title: "Cocktail Masterclass", slug: "cocktail-masterclass" },
    { title: "Sip & Paint", slug: "sip-and-paint" },
    { title: "Butlers in the Buff", slug: "butlers-in-the-buff" },
    { title: "Life Drawing", slug: "life-drawing" },
    { title: "Private Chef", slug: "private-chef" },
    { title: "Spa Treatments", slug: "spa-treatments" },
    { title: "Mobile Beauty Bar", slug: "mobile-beauty-bar" },
    { title: "Pamper Party Package", slug: "pamper-party-package" },
    { title: "Make-up Artist", slug: "make-up-artist" },
    { title: "Hair Styling", slug: "hair-styling" },
    { title: "Personalised Robes", slug: "personalised-robes" },
    { title: "Prosecco Reception", slug: "prosecco-reception" },
    { title: "Afternoon Tea", slug: "afternoon-tea" },
    { title: "BBQ Catering", slug: "bbq-catering" },
    { title: "Pizza Making Class", slug: "pizza-making-class" },
    { title: "Bottomless Brunch", slug: "bottomless-brunch" },
    { title: "Gin Tasting", slug: "gin-tasting" },
    { title: "Wine Tasting", slug: "wine-tasting" },
    { title: "Flower Crown Making", slug: "flower-crown-making" },
    { title: "Dance Class", slug: "dance-class" },
    { title: "Karaoke Night", slug: "karaoke-night" },
    { title: "Yoga Session", slug: "yoga-session" },
    { title: "Photography Package", slug: "photography-package" },
    { title: "DJ Entertainment", slug: "dj-entertainment" },
    { title: "Games & Activities Pack", slug: "games-activities-pack" },
    { title: "Decorations & Balloons", slug: "decorations-balloons" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-md"
        } z-50`}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center relative z-[60]"
            >
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/stacked_logo-1760785640378.jpg"
                alt="Group Escape Houses"
                width={180}
                height={120}
                className="h-24 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Houses to Rent Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsHousesOpen(true)}
                onMouseLeave={() => setIsHousesOpen(false)}
              >
                <button
                  className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group flex items-center gap-1.5 py-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Properties
                  <ChevronDownIcon className="w-4 h-4" />
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isHousesOpen && (
                  <div className="absolute top-full left-0 w-[640px] bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="grid grid-cols-2 gap-10">
                      {/* House Styles Column */}
                      <div>
                        <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                          House Styles
                        </h3>
                        <ul className="space-y-2.5">
                          {houseStyles.map((style) => (
                            <li key={style.slug}>
                              <Link
                                href={`/house-styles/${style.slug}`}
                                className="text-[15px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                              >
                                {style.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Must-Have Features Column */}
                      <div>
                        <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                          Must-Have Features
                        </h3>
                        <ul className="space-y-2.5">
                          {features.map((feature) => (
                            <li key={feature.slug}>
                              <Link
                                href={`/features/${feature.slug}`}
                                className="text-[15px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                              >
                                {feature.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* View All Link */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <Link
                        href="/properties"
                        className="text-sm font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                      >
                        Browse All Properties →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Occasions Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsOccasionsOpen(true)}
                onMouseLeave={() => setIsOccasionsOpen(false)}
              >
                <button
                  className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group flex items-center gap-1.5 py-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Occasions
                  <ChevronDownIcon className="w-4 h-4" />
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isOccasionsOpen && (
                  <div className="absolute top-full left-0 w-[420px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                      Perfect For Your Celebration
                    </h3>
                    <ul className="space-y-3">
                      {occasions.map((occasion) => (
                        <li key={occasion.slug}>
                          <Link
                            href={`/occasions/${occasion.slug}`}
                            className="group/item flex flex-col py-2 hover:bg-[var(--color-bg-secondary)] rounded-lg px-3 -mx-3 transition-all"
                          >
                            <span className="text-[15px] font-medium text-[var(--color-text-primary)] group-hover/item:text-[var(--color-accent-sage)] transition-colors">
                              {occasion.title}
                            </span>
                            <span className="text-xs text-[var(--color-neutral-dark)]">
                              {occasion.description}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* View All Link */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <Link
                        href="/occasions"
                        className="text-sm font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                      >
                        View All Occasions →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Experiences Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsExperiencesOpen(true)}
                onMouseLeave={() => setIsExperiencesOpen(false)}
              >
                <button
                  className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group flex items-center gap-1.5 py-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Experiences
                  <ChevronDownIcon className="w-4 h-4" />
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isExperiencesOpen && (
                  <div className="absolute top-full left-0 w-[480px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                      Add To Your Stay
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 max-h-[420px] overflow-y-auto pr-2 scrollbar-hide">
                      <ul className="space-y-2.5">
                        {experiences.slice(0, Math.ceil(experiences.length / 2)).map((experience) => (
                          <li key={experience.slug}>
                            <Link
                              href={`/experiences/${experience.slug}`}
                              className="text-[14px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                            >
                              {experience.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2.5">
                        {experiences.slice(Math.ceil(experiences.length / 2)).map((experience) => (
                          <li key={experience.slug}>
                            <Link
                              href={`/experiences/${experience.slug}`}
                              className="text-[14px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                            >
                              {experience.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* View All Link */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <Link
                        href="/experiences"
                        className="text-sm font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                      >
                        View All Experiences →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Destinations Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsDestinationsOpen(true)}
                onMouseLeave={() => setIsDestinationsOpen(false)}
              >
                <button
                  className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group flex items-center gap-1.5 py-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Destinations
                  <ChevronDownIcon className="w-4 h-4" />
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isDestinationsOpen && (
                  <div className="absolute top-full left-0 w-[320px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                      Popular Destinations
                    </h3>
                    <ul className="space-y-2.5">
                      {destinations.map((destination) => (
                        <li key={destination.slug}>
                          <Link
                            href={`/destinations/${destination.slug}`}
                            className="text-[15px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                          >
                            {destination.title}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* View All Link */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <Link
                        href="/destinations"
                        className="text-sm font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                      >
                        View All Destinations →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* How It Works Link */}
              <Link
                href="/how-it-works"
                className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group py-8"
                style={{ fontFamily: "var(--font-body)" }}
              >
                How It Works
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
              </Link>

              {/* Owner Dashboard Link - Only for Owners and Admins */}
              {session?.user && (isOwner || isAdmin) && (
                <Link
                  href="/owner/dashboard"
                  className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group py-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Owner Dashboard
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </Link>
              )}

              {/* Admin Link - Only for Admins */}
              {session?.user && isAdmin && (
                <Link
                  href="/admin/bookings"
                  className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group py-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Admin
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </Link>
              )}

              {/* Advertise Link */}
              <Link
                href="/advertise-with-us"
                className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group py-8"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Advertise
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
              </Link>
            </nav>

            {/* Auth & CTA Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Phone Number - Always visible */}
              <a
                href="tel:+441273569301"
                className="group flex items-center gap-2 px-4 py-2 bg-[var(--color-accent-sage)]/10 hover:bg-[var(--color-accent-sage)] rounded-xl transition-all duration-200 border border-[var(--color-accent-sage)]/20"
                aria-label="Call us at 01273 569301"
              >
                <Phone className="w-4 h-4 text-[var(--color-accent-sage)] group-hover:text-white" />
                <span className="text-sm font-medium text-[var(--color-accent-sage)] group-hover:text-white">
                  01273 569301
                </span>
              </a>
              
              {isPending || isCustomerLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : session?.user ? (
                <>
                  {/* Plan Badge - MANDATORY: Constantly visible */}
                  <Link
                    href="/pricing"
                    className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent-sage)]/10 hover:bg-[var(--color-accent-sage)]/20 rounded-full transition-all duration-200 border border-[var(--color-accent-sage)]/20"
                  >
                    <CreditCard className="w-4 h-4 text-[var(--color-accent-sage)]" />
                    <span className="text-sm font-medium text-[var(--color-accent-sage)]">
                      {planName}
                    </span>
                  </Link>
                  
                  {/* User Name Display - Show for ALL logged in users (guest, owner, admin) */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-accent-sage)]/20">
                    <UserIcon className="w-4 h-4 text-[var(--color-accent-sage)]" />
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {session.user.name || 'User'}
                    </span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="rounded-xl px-4 py-2 font-medium border-2 transition-all duration-200 hover:bg-red-50 hover:border-red-500 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setAuthMode("login");
                      setAuthType("guest");
                      setIsAuthModalOpen(true);
                    }}
                    variant="outline"
                    className="rounded-xl px-6 py-2 font-medium border-2 transition-all duration-200 hover:bg-[var(--color-accent-sage)] hover:text-white hover:border-[var(--color-accent-sage)]"
                    style={{
                      borderColor: "var(--color-accent-sage)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthMode("register");
                      setAuthType("guest");
                      setIsAuthModalOpen(true);
                    }}
                    className="rounded-xl px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      background: "var(--color-accent-gold)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 flex items-center gap-2 relative z-[60]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
              <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                {isMobileMenuOpen ? "Close" : "Menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[55] bg-[#E5D8C5] flex flex-col overflow-hidden">
          {/* Menu Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-8 pt-32 pb-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {/* Left Column - Main Navigation */}
              <nav className="space-y-6">
                <Link
                  href="/"
                  className="block text-4xl md:text-5xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Properties Dropdown */}
                <div className="space-y-3">
                  <Link
                    href="/properties"
                    className="block text-4xl md:text-5xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Properties
                  </Link>
                  
                  {/* House Styles Submenu */}
                  <button
                    onClick={() => setIsMobileStylesOpen(!isMobileStylesOpen)}
                    className="flex items-center gap-2 text-lg text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                  >
                    House Styles
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMobileStylesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMobileStylesOpen && (
                    <div className="pl-4 space-y-2 text-[var(--color-neutral-dark)]">
                      {houseStyles.map((style) => (
                        <Link
                          key={style.slug}
                          href={`/house-styles/${style.slug}`}
                          className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {style.title}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Features Submenu */}
                  <button
                    onClick={() => setIsMobileFeaturesOpen(!isMobileFeaturesOpen)}
                    className="flex items-center gap-2 text-lg text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                  >
                    Must-Have Features
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMobileFeaturesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMobileFeaturesOpen && (
                    <div className="pl-4 space-y-2 text-[var(--color-neutral-dark)]">
                      {features.map((feature) => (
                        <Link
                          key={feature.slug}
                          href={`/features/${feature.slug}`}
                          className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {feature.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Occasions Dropdown */}
                <div className="space-y-3">
                  <Link
                    href="/occasions"
                    className="block text-4xl md:text-5xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Occasions
                  </Link>
                  
                  <button
                    onClick={() => setIsMobileOccasionsOpen(!isMobileOccasionsOpen)}
                    className="flex items-center gap-2 text-lg text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                  >
                    View By Occasion
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMobileOccasionsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMobileOccasionsOpen && (
                    <div className="pl-4 space-y-2 text-[var(--color-neutral-dark)]">
                      {occasions.map((occasion) => (
                        <Link
                          key={occasion.slug}
                          href={`/occasions/${occasion.slug}`}
                          className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {occasion.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experiences Dropdown */}
                <div className="space-y-3">
                  <Link
                    href="/experiences"
                    className="block text-4xl md:text-5xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Experiences
                  </Link>
                  
                  <button
                    onClick={() => setIsMobileExperiencesOpen(!isMobileExperiencesOpen)}
                    className="flex items-center gap-2 text-lg text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                  >
                    Popular Experiences
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMobileExperiencesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMobileExperiencesOpen && (
                    <div className="pl-4 space-y-2 text-[var(--color-neutral-dark)]">
                      {experiences.map((experience) => (
                        <Link
                          key={experience.slug}
                          href={`/experiences/${experience.slug}`}
                          className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {experience.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destinations with Dropdown */}
                <div className="space-y-3">
                  <Link
                    href="/destinations"
                    className="block text-4xl md:text-5xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Destinations
                  </Link>
                  
                  <button
                    onClick={() => setIsMobileDestinationsOpen(!isMobileDestinationsOpen)}
                    className="flex items-center gap-2 text-lg text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                  >
                    Popular Locations
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMobileDestinationsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMobileDestinationsOpen && (
                    <div className="pl-4 space-y-2 text-[var(--color-neutral-dark)]">
                      {destinations.map((destination) => (
                        <Link
                          key={destination.slug}
                          href={`/destinations/${destination.slug}`}
                          className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {destination.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>

              {/* Right Column - Secondary Navigation */}
              <nav className="space-y-4 md:pt-0 pt-8">
                <Link
                  href="/how-it-works"
                  className="block text-2xl font-medium hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>

                {/* Owner Dashboard - Only for Owners and Admins */}
                {session?.user && (isOwner || isAdmin) && (
                  <Link
                    href="/owner/dashboard"
                    className="block text-2xl font-medium hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Owner Dashboard
                  </Link>
                )}

                <Link
                  href="/advertise-with-us"
                  className="block text-2xl font-medium hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Advertise Your Property
                </Link>

                {/* Admin Dashboard - Only for Admins */}
                {session?.user && isAdmin && (
                  <Link
                    href="/admin/bookings"
                    className="block text-2xl font-medium hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  href="/our-story"
                  className="block text-2xl font-medium hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Story
                </Link>

                <Link
                  href="/contact"
                  className="block text-2xl font-medium hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>

                <Link
                  href="/blog"
                  className="block text-2xl font-medium hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inspiration
                </Link>
              </nav>
            </div>
          </div>

          {/* Bottom CTA with Auth */}
          <div className="border-t border-[var(--color-text-primary)]/20 px-8 py-6 bg-[#E5D8C5] space-y-3">
            {isPending || isCustomerLoading ? (
              <div className="w-full h-12 rounded-2xl bg-white/50 animate-pulse"></div>
            ) : session?.user ? (
              <>
                {/* Plan Badge - Mobile */}
                <Link
                  href="/pricing"
                  className="flex items-center justify-between p-4 bg-white/90 rounded-xl hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[var(--color-accent-sage)]" />
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {planName}
                    </span>
                  </div>
                  <span className="text-sm text-[var(--color-accent-sage)]">Manage →</span>
                </Link>
                
                {/* User Name Display - Mobile - Show for ALL logged in users */}
                <div className="flex items-center justify-between p-4 bg-white/90 rounded-xl border border-[var(--color-accent-sage)]/20">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-[var(--color-accent-sage)]" />
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {session.user.name || 'User'}
                    </span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-2xl px-8 py-3 font-medium"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  <Link href="/contact">Check Availability and Book</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-2xl px-6 py-3 font-medium bg-white border-2 border-[var(--color-accent-sage)]"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setAuthMode("login");
                      setAuthType("guest");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-2xl px-6 py-3 font-medium"
                    style={{
                      background: "var(--color-accent-gold)",
                      color: "white",
                    }}
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setAuthMode("register");
                      setAuthType("guest");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-2xl px-8 py-3 font-medium"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  <Link href="/contact">Check Availability and Book</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
        defaultType={authType}
      />
    </>
  );
}

export default memo(Header);





