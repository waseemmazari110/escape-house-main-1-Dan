"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight, Instagram, Home as HomeIcon, Sparkles, CreditCard, PartyPopper, Shield, Users, Award, Clock, Calendar, MapPin, User, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ExperienceCard from "@/components/ExperienceCard";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

// Lazy load non-critical components with no SSR
const ReviewSlider = dynamic(() => import("@/components/ReviewSlider"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-2xl" />
});

const FAQSection = dynamic(() => import("@/components/FAQSection"), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-2xl" />
});

// Static destinations data
const destinations = [
  { 
    name: "London", 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-london-citysc-8f325788-20251019170619.jpg?",
    description: "Iconic attractions & world-class nightlife"
  },
  { 
    name: "Brighton", 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/wide-angle-photograph-of-brighton-seafro-11bd7734-20251017161212.jpg",
    description: "Seaside fun with vibrant beach bars"
  },
  { 
    name: "Bath", 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/historic-bath-city-center-photograph%2c--eef16b18-20251017161220.jpg",
    description: "Georgian elegance & thermal spas"
  },
  { 
    name: "Manchester", 
    image: "https://v3b.fal.media/files/b/tiger/TnJnPy7geHZHAjOwxZKxO_output.png",
    description: "Northern vibes & legendary nightlife"
  },
  { 
    name: "Newquay", 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-newquay-beach-1b9fbe44-20251019170627.jpg?",
    description: "Surf beaches & coastal adventures"
  },
  { 
    name: "Liverpool", 
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    description: "Beatles heritage & waterfront bars"
  },
];

// All destinations for dropdown
const allDestinations = [
  "All Locations", "Brighton", "Bath", "Bournemouth", "London", "Manchester", "Liverpool", "York", 
  "Newcastle", "Cardiff", "Edinburgh", "Scottish Highlands", "Snowdonia", "Newquay", "Devon", 
  "Cotswolds", "Lake District", "Birmingham", "Blackpool", "Bristol", "Cambridge", "Canterbury", 
  "Cheltenham", "Chester", "Durham", "Exeter", "Harrogate", "Leeds", "Margate", "Nottingham", 
  "Oxford", "Plymouth", "Sheffield", "St Ives", "Stratford-upon-Avon", "Windsor"
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formLoadTime] = useState<number>(Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [userInteraction, setUserInteraction] = useState({ clicks: 0, keystrokes: 0 });

  // Dynamic data
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Video lazy loading state
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Search form state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [destination, setDestination] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [focusedDestinationIndex, setFocusedDestinationIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  
  const dateFieldRef = useRef<HTMLButtonElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);
  const destinationButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const newsletterFormRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch data with proper error handling - DEFER to reduce initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          setIsLoadingData(true);

          const [propertiesRes, experiencesRes, reviewsRes] = await Promise.all([
            fetch('/api/properties?featured=true&isPublished=true&limit=3'),
            fetch('/api/experiences?isPublished=true&limit=6'),
            fetch('/api/reviews?isApproved=true&isPublished=true&limit=6&sort=reviewDate&order=desc')
          ]);

          if (!propertiesRes.ok || !experiencesRes.ok || !reviewsRes.ok) {
            throw new Error('Failed to fetch data');
          }

          const [propertiesData, experiencesData, reviewsData] = await Promise.all([
            propertiesRes.json(),
            experiencesRes.json(),
            reviewsRes.json()
          ]);

          // Handle both array and object response formats for properties
          const propertiesArray = Array.isArray(propertiesData) ? propertiesData : (propertiesData.properties || []);

          setFeaturedProperties(propertiesArray.map((prop: any) => ({
            id: prop.id.toString(),
            title: prop.title,
            location: prop.location,
            sleeps: prop.sleepsMax,
            bedrooms: prop.bedrooms,
            priceFrom: prop.priceFromWeekend || prop.priceFromMidweek,
            image: prop.heroImage,
            features: [],
            slug: prop.slug,
          })));

          // Handle both array and object response formats for experiences
          const experiencesArray = Array.isArray(experiencesData) ? experiencesData : (experiencesData.experiences || []);
          
          setExperiences(experiencesArray.map((exp: any) => ({
            title: exp.title,
            duration: exp.duration,
            priceFrom: exp.priceFrom,
            groupSize: `${exp.groupSizeMin}-${exp.groupSizeMax} guests`,
            image: exp.heroImage,
            slug: exp.slug,
          })));

          // Handle both array and object response formats for reviews
          const reviewsArray = Array.isArray(reviewsData) ? reviewsData : (reviewsData.reviews || []);
          
          setReviews(reviewsArray.map((review: any) => ({
            name: review.guestName,
            rating: review.rating,
            comment: review.comment,
            date: new Date(review.reviewDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
            property: review.propertyId ? 'Property' : undefined,
            image: review.guestImage,
          })));
        } catch (error) {
          console.error('Error fetching data:', error);
          setFeaturedProperties([]);
          setExperiences([]);
          setReviews([]);
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchData();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Lazy load video after initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Minimal setup
  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize, { passive: true });

    const trackClick = () => setUserInteraction(prev => ({ ...prev, clicks: prev.clicks + 1 }));
    const trackKeypress = () => setUserInteraction(prev => ({ ...prev, keystrokes: prev.keystrokes + 1 }));

    const formElement = newsletterFormRef.current;
    if (formElement) {
      formElement.addEventListener('click', trackClick, { passive: true });
      formElement.addEventListener('keydown', trackKeypress, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (formElement) {
        formElement.removeEventListener('click', trackClick);
        formElement.removeEventListener('keydown', trackKeypress);
      }
    };
  }, []);

  const announce = (message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      const challenge = Math.floor(Date.now() / 10000).toString();
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          honeypot,
          timestamp: formLoadTime.toString(),
          challenge,
          userInteraction
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      setSubmitStatus("success");
      setEmail("");
      setUserInteraction({ clicks: 0, keystrokes: 0 });
      
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Subscription error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (dateRange?.from) params.set('checkIn', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange?.to) params.set('checkOut', format(dateRange.to, 'yyyy-MM-dd'));
    params.set('guests', String(adults + children));
    if (pets > 0) params.set('pets', String(pets));
    
    window.location.href = `/properties?${params.toString()}`;
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (datePickerOpen) setDatePickerOpen(false);
        if (destinationOpen) {
          setDestinationOpen(false);
          setFocusedDestinationIndex(-1);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [datePickerOpen, destinationOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!destinationOpen) return;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedDestinationIndex((prev) => {
          const next = prev + 1 >= allDestinations.length ? 0 : prev + 1;
          destinationButtonsRef.current[next]?.focus();
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedDestinationIndex((prev) => {
          const next = prev - 1 < 0 ? allDestinations.length - 1 : prev - 1;
          destinationButtonsRef.current[next]?.focus();
          return next;
        });
      } else if (e.key === "Enter" && focusedDestinationIndex >= 0) {
        e.preventDefault();
        const selected = allDestinations[focusedDestinationIndex];
        if (selected) {
          setDestination(selected.toLowerCase().replace(/\s+/g, '-'));
          setDestinationOpen(false);
          setFocusedDestinationIndex(-1);
          announce(`${selected} selected`);
        }
      }
    };

    if (destinationOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [destinationOpen, focusedDestinationIndex]);

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest.toLowerCase().replace(/\s+/g, '-'));
    setDestinationOpen(false);
    setFocusedDestinationIndex(-1);
    announce(`${dest} selected`);
  };

  const dateRangeDisplay = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, 'dd MMM')} → ${format(dateRange.to, 'dd MMM')}`
    : dateRange?.from
    ? `${format(dateRange.from, 'dd MMM')} → ?`
    : "Select dates";

  const totalGuests = adults + children + infants;
  const guestsSummary = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''} - ${pets} pet${pets !== 1 ? 's' : ''}`;

  return (
    <div className="min-h-screen">
      <StructuredData type="home" />
      <Header />

      <div
        ref={announcementRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              poster="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxury-uk-group-holiday-house-exterior%2c-10e76810-20251016181409.jpg"
            >
              <source src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/videos/luma_video_1729107219.mp4" type="video/mp4" />
            </video>
          )}

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <h1 className="mb-6 text-white drop-shadow-lg" style={{ fontFamily: "var(--font-display)" }}>
              Large Group Accommodation Across the UK
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Luxury houses for groups of all sizes with hot tubs, pools, and outstanding amenities
            </p>

            {/* Search Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Destination */}
                <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-16 justify-start text-left font-normal rounded-2xl border-2 hover:border-[var(--color-accent-sage)] transition-colors"
                    >
                      <MapPin className="mr-2 h-5 w-5 text-[var(--color-accent-sage)]" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Where</span>
                        <span className="text-sm font-medium">{destination || "Search destinations"}</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 max-h-96 overflow-y-auto smooth-scroll" align="start">
                    <div className="space-y-2">
                      {allDestinations.map((dest, index) => (
                        <button
                          key={dest}
                          ref={(el) => { destinationButtonsRef.current[index] = el; }}
                          onClick={() => handleDestinationSelect(dest)}
                          className="w-full text-left px-4 py-2 rounded-xl hover:bg-[var(--color-bg-primary)] transition-colors"
                        >
                          {dest}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Dates */}
                <div className="relative">
                  <Button
                    ref={dateFieldRef}
                    variant="outline"
                    className="h-16 w-full justify-start text-left font-normal rounded-2xl border-2 hover:border-[var(--color-accent-sage)] transition-colors"
                    onClick={() => setDatePickerOpen(!datePickerOpen)}
                  >
                    <Calendar className="mr-2 h-5 w-5 text-[var(--color-accent-sage)]" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">When</span>
                      <span className="text-sm font-medium">{dateRangeDisplay}</span>
                    </div>
                  </Button>
                  {datePickerOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setDatePickerOpen(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border p-4">
                        <CalendarComponent
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={isMobile ? 1 : 2}
                          disabled={(date) => date < new Date()}
                        />
                        <div className="flex justify-end pt-4 border-t mt-4">
                          <Button
                            size="sm"
                            onClick={() => setDatePickerOpen(false)}
                            style={{ background: "var(--color-accent-sage)", color: "white" }}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Guests */}
                <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-16 justify-start text-left font-normal rounded-2xl border-2 hover:border-[var(--color-accent-sage)] transition-colors"
                    >
                      <User className="mr-2 h-5 w-5 text-[var(--color-accent-sage)]" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Who</span>
                        <span className="text-sm font-medium">{guestsSummary}</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Adults</div>
                          <div className="text-sm text-gray-500">Age 13+</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{adults}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setAdults(adults + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Children</div>
                          <div className="text-sm text-gray-500">Age 2-12</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{children}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setChildren(children + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Infants</div>
                          <div className="text-sm text-gray-500">Under 2</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setInfants(Math.max(0, infants - 1))}
                            disabled={infants <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{infants}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setInfants(infants + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Pets</div>
                          <div className="text-sm text-gray-500">Bring a pet</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setPets(Math.max(0, pets - 1))}
                            disabled={pets <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{pets}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setPets(pets + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="h-16 rounded-2xl font-semibold text-lg transition-all hover:scale-[1.02]"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/properties">
                <Button
                  size="lg"
                  className="rounded-2xl px-8 py-6 font-medium transition-all hover:scale-[1.05]"
                  style={{
                    background: "var(--color-accent-pink)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Browse Houses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8 py-6 font-medium border-2 transition-all hover:bg-white"
                  style={{
                    borderColor: "var(--color-accent-gold)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Get Instant Quote
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="transition-transform hover:scale-105">
                <Award className="w-12 h-12 mx-auto mb-3 text-[var(--color-accent-gold)]" />
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>3,000+</div>
                <div className="text-[var(--color-neutral-dark)]">5 Star Reviews</div>
              </div>
              <div className="transition-transform hover:scale-105">
                <Shield className="w-12 h-12 mx-auto mb-3 text-[var(--color-accent-sage)]" />
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>Secure</div>
                <div className="text-[var(--color-neutral-dark)]">Safe Payments</div>
              </div>
              <div className="transition-transform hover:scale-105">
                <Users className="w-12 h-12 mx-auto mb-3 text-[var(--color-accent-pink)]" />
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>UK Team</div>
                <div className="text-[var(--color-neutral-dark)]">Expert Support</div>
              </div>
              <div className="transition-transform hover:scale-105">
                <Clock className="w-12 h-12 mx-auto mb-3 text-[var(--color-accent-gold)]" />
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>Fast</div>
                <div className="text-[var(--color-neutral-dark)]">Quick Response</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-20 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Featured Large Group Houses
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                Exceptional properties sleeping 10 to 40 guests with premium facilities
              </p>
            </div>

            {isLoadingData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-96"></div>
                ))}
              </div>
            ) : featuredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-[var(--color-neutral-dark)]">
                  No featured properties available at the moment.
                </p>
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/properties">
                <Button
                  size="lg"
                  className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05]"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  View All Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Experiences */}
        <section className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Enhance Your Group Stay
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                Add special touches and activities to make your group trip unforgettable
              </p>
            </div>

            {isLoadingData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-80"></div>
                ))}
              </div>
            ) : experiences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {experiences.map((experience) => (
                  <ExperienceCard key={experience.slug} {...experience} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-[var(--color-neutral-dark)]">
                  No experiences available at the moment.
                </p>
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/experiences">
                <Button
                  size="lg"
                  className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05]"
                  style={{
                    background: "var(--color-accent-pink)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  View All Experiences
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section className="py-20 bg-[var(--color-bg-secondary)] overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Explore Top Destinations
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                From vibrant cities to coastal escapes
              </p>
            </div>

            {/* Scrolling Carousel */}
            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex gap-6 animate-slide-left">
                  {/* First set of destinations */}
                  {destinations.map((destination, index) => (
                    <Link
                      key={`set1-${destination.name}-${index}`}
                      href={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="group relative flex-shrink-0 w-[400px] overflow-hidden rounded-2xl aspect-[4/3] transition-transform hover:scale-[1.02]"
                    >
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "var(--font-display)" }}>
                          {destination.name}
                        </h3>
                        <p className="text-sm text-white opacity-90">{destination.description}</p>
                      </div>
                    </Link>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {destinations.map((destination, index) => (
                    <Link
                      key={`set2-${destination.name}-${index}`}
                      href={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="group relative flex-shrink-0 w-[400px] overflow-hidden rounded-2xl aspect-[4/3] transition-transform hover:scale-[1.02]"
                    >
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "var(--font-display)" }}>
                          {destination.name}
                        </h3>
                        <p className="text-sm text-white opacity-90">{destination.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/destinations">
                <Button
                  size="lg"
                  className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05]"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  View All Destinations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                How It Works
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                Booking your perfect group accommodation is simple
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center transition-transform hover:scale-105">
                <div className="w-20 h-20 rounded-full bg-[var(--color-accent-pink)] text-white flex items-center justify-center mx-auto mb-6 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  Choose Property
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Browse our collection and find the perfect house for your group
                </p>
              </div>

              <div className="text-center transition-transform hover:scale-105">
                <div className="w-20 h-20 rounded-full bg-[var(--color-accent-sage)] text-white flex items-center justify-center mx-auto mb-6 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  Add Services
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Enhance your stay with catering, activities, and special services
                </p>
              </div>

              <div className="text-center transition-transform hover:scale-105">
                <div className="w-20 h-20 rounded-full bg-[var(--color-accent-gold)] text-white flex items-center justify-center mx-auto mb-6 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  Secure Booking
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Reserve with a deposit, balance due 8 weeks before arrival
                </p>
              </div>

              <div className="text-center transition-transform hover:scale-105">
                <div className="w-20 h-20 rounded-full bg-[var(--color-accent-pink)] text-white flex items-center justify-center mx-auto mb-6 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  4
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  Enjoy Together
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Gather your group and create lasting memories
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-10 py-6 font-medium border-2 transition-all hover:bg-[var(--color-bg-primary)]"
                  style={{
                    borderColor: "var(--color-accent-sage)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-20 bg-[var(--color-bg-secondary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                What Our Guests Say
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                Over 3,000 five-star reviews from happy groups
              </p>
            </div>

            {mounted && <ReviewSlider reviews={reviews} isLoading={isLoadingData} />}

            <div className="text-center mt-12">
              <Link href="/reviews">
                <Button
                  size="lg"
                  className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05]"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  Read All Reviews
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {mounted && <FAQSection />}

        {/* Newsletter */}
        <section className="py-20 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="bg-gradient-to-r from-[var(--color-accent-sage)] to-[var(--color-accent-gold)] rounded-3xl p-12 text-center text-white">
              <PartyPopper className="w-16 h-16 mx-auto mb-6" />
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Get Group Travel Inspiration
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Subscribe for exclusive deals, new properties, and group planning tips
              </p>

              <form ref={newsletterFormRef} onSubmit={handleEmailSubmit} className="max-w-md mx-auto flex gap-4">
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-14 rounded-2xl border-2 border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:bg-white/20"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !email}
                  className="h-14 px-8 rounded-2xl font-semibold transition-all hover:scale-[1.05]"
                  style={{
                    background: "white",
                    color: "var(--color-accent-sage)",
                  }}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>

              {submitStatus === "success" && (
                <p className="mt-4 text-white font-medium">Thanks for subscribing! Check your inbox.</p>
              )}
              {submitStatus === "error" && (
                <p className="mt-4 text-white font-medium">Something went wrong. Please try again.</p>
              )}
            </div>
          </div>
        </section>

        {/* Instagram */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Instagram className="w-16 h-16 text-transparent" style={{
                  background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }} />
              </div>
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Follow Us on Instagram
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)] mb-8 max-w-2xl mx-auto">
                Get daily inspiration and see our houses in action
              </p>
              <a
                href="https://www.instagram.com/groupescapehouses/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05] text-white border-0"
                  style={{
                    background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                  }}
                >
                  @groupescapehouses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>

            {/* Instagram Scrolling Carousel */}
            <div className="relative mt-12">
              <div className="overflow-hidden">
                <div className="flex gap-4 animate-slide-left">
                  {/* First set of images */}
                  {[
                    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-b6c21bf3-20251018131712.jpg",
                    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-71429268-20251018131719.jpg",
                    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-303caf30-20251018131730.jpg",
                    "https://images.unsplash.com/photo-1626995216005-51fce6be8f73?w=800&q=90",
                    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=90",
                    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/wide-angle-photograph-of-brighton-seafro-11bd7734-20251017161212.jpg",
                  ].map((img, index) => (
                    <a
                      key={`set1-img-${index}`}
                      href="https://www.instagram.com/groupescapehouses/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex-shrink-0 w-[280px] aspect-square overflow-hidden rounded-xl transition-transform hover:scale-[1.02] bg-gray-100"
                    >
                      <Image
                        src={img}
                        alt={`Instagram post ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="280px"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
                          <Instagram className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    </a>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {[
                    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-b6c21bf3-20251018131712.jpg",
                    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-71429268-20251018131719.jpg",
                    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-303caf30-20251018131730.jpg",
                    "https://images.unsplash.com/photo-1626995216005-51fce6be8f73?w=800&q=90",
                    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=90",
                    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/wide-angle-photograph-of-brighton-seafro-11bd7734-20251017161212.jpg",
                  ].map((img, index) => (
                    <a
                      key={`set2-img-${index}`}
                      href="https://www.instagram.com/groupescapehouses/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex-shrink-0 w-[280px] aspect-square overflow-hidden rounded-xl transition-transform hover:scale-[1.02] bg-gray-100"
                    >
                      <Image
                        src={img}
                        alt={`Instagram post ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="280px"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
                          <Instagram className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}