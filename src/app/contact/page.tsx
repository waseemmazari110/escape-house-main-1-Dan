"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Calendar, Check, ExternalLink } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { formatDateUKLong } from "@/lib/date-utils";
import "react-day-picker/dist/style.css";
import "./datepicker-styles.css";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    groupSize: "",
    dates: "",
    location: "",
    experiences: [] as string[],
    message: "",
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Spam protection state
  const [formLoadTime, setFormLoadTime] = useState<number>(0);
  const [honeypot, setHoneypot] = useState("");
  const [userInteraction, setUserInteraction] = useState({ clicks: 0, keystrokes: 0 });
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Track form load time
  useEffect(() => {
    setFormLoadTime(Date.now());

    // Track user interaction
    const trackClick = () => {
      setUserInteraction(prev => ({ ...prev, clicks: prev.clicks + 1 }));
    };

    const trackKeypress = () => {
      setUserInteraction(prev => ({ ...prev, keystrokes: prev.keystrokes + 1 }));
    };

    if (formRef.current) {
      formRef.current.addEventListener('click', trackClick);
      formRef.current.addEventListener('keydown', trackKeypress);
      
      return () => {
        formRef.current?.removeEventListener('click', trackClick);
        formRef.current?.removeEventListener('keydown', trackKeypress);
      };
    }
  }, []);

  // Lazy load video
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Only these experiences have actual pages
  const experiencesWithPages = [
    "cocktail-masterclass",
    "sip-and-paint",
    "private-chef",
    "spa-treatments",
    "hair-styling",
    "karaoke-night",
    "flower-crown-making"
  ];

  const experienceOptions = [
    { value: "cocktail-masterclass", label: "Cocktail Masterclass" },
    { value: "sip-and-paint", label: "Sip & Paint" },
    { value: "butlers-in-the-buff", label: "Butlers in the Buff" },
    { value: "life-drawing", label: "Life Drawing" },
    { value: "private-chef", label: "Private Chef" },
    { value: "spa-treatments", label: "Spa Treatments" },
    { value: "mobile-beauty-bar", label: "Mobile Beauty Bar" },
    { value: "make-up-artist", label: "Make-up Artist" },
    { value: "hair-styling", label: "Hair Styling" },
    { value: "pamper-party-package", label: "Pamper Party Package" },
    { value: "personalised-robes", label: "Personalised Robes" },
    { value: "prosecco-reception", label: "Prosecco Reception" },
    { value: "afternoon-tea", label: "Afternoon Tea" },
    { value: "bbq-catering", label: "BBQ Catering" },
    { value: "pizza-making-class", label: "Pizza Making Class" },
    { value: "bottomless-brunch", label: "Bottomless Brunch" },
    { value: "gin-tasting", label: "Gin Tasting" },
    { value: "wine-tasting", label: "Wine Tasting" },
    { value: "flower-crown-making", label: "Flower Crown Making" },
    { value: "dance-class", label: "Dance Class" },
    { value: "karaoke-night", label: "Karaoke Night" },
    { value: "yoga-session", label: "Yoga Session" },
    { value: "photography-package", label: "Photography Package" },
    { value: "dj-entertainment", label: "DJ Entertainment" },
    { value: "games-activities-pack", label: "Games & Activities Pack" },
    { value: "decorations-balloons", label: "Decorations & Balloons" },
  ];

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      setDateRange(range);
      if (range.from && range.to) {
        const formattedDates = `${formatDateUKLong(range.from)} - ${formatDateUKLong(range.to)}`;
        setFormData({ ...formData, dates: formattedDates });
      } else if (range.from) {
        const formattedDate = formatDateUKLong(range.from);
        setFormData({ ...formData, dates: formattedDate });
      }
    }
  };

  const handleExperienceToggle = (experienceValue: string) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.includes(experienceValue)
        ? prev.experiences.filter((exp) => exp !== experienceValue)
        : [...prev.experiences, experienceValue],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate JavaScript challenge
      const challenge = Math.floor(Date.now() / 10000).toString();

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          honeypot,
          timestamp: formLoadTime.toString(),
          challenge,
          userInteraction
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send enquiry');
      }

      toast.success("Enquiry sent successfully! We'll be in touch within 2 hours.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        groupSize: "",
        dates: "",
        location: "",
        experiences: [],
        message: "",
      });
      setDateRange({});
      setUserInteraction({ clicks: 0, keystrokes: 0 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send enquiry. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] overflow-hidden">
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
        
        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Get in Touch
          </h1>
          <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
            Ready to book your perfect group celebration? Our UK team is here to help with any questions.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-accent-sage)" }}
                    >
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a
                        href="tel:+441273569301"
                        className="text-[var(--color-accent-sage)] hover:underline"
                      >
                        01273 569301
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-accent-sage)" }}
                    >
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:hello@groupescapehouses.co.uk"
                        className="text-[var(--color-accent-sage)] hover:underline"
                      >
                        hello@groupescapehouses.co.uk
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-accent-sage)" }}
                    >
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office</h3>
                      <p className="text-[var(--color-neutral-dark)]">
                        11a North Street<br />
                        Brighton<br />
                        BN41 1DH
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-accent-sage)" }}
                    >
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Opening Hours</h3>
                      <p className="text-[var(--color-neutral-dark)]">
                        Monday - Friday: 9am - 6pm<br />
                        Saturday: 10am - 4pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-bg-primary)] p-6 rounded-2xl">
                <h3 className="font-semibold mb-3">Fast Response Guaranteed</h3>
                <p className="text-[var(--color-neutral-dark)] text-sm">
                  We typically respond to enquiries within 2 hours during office hours. For urgent requests, please call or email directly.
                </p>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8 shadow-md">
                <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Send Us an Enquiry
                </h2>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field - hidden from users */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ 
                      position: 'absolute', 
                      left: '-9999px',
                      width: '1px',
                      height: '1px'
                    }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-accent-sage)] focus:outline-none"
                        placeholder="Sarah Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-accent-sage)] focus:outline-none"
                        placeholder="sarah@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-accent-sage)] focus:outline-none"
                        placeholder="07123 456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Group Size *</label>
                      <select
                        required
                        value={formData.groupSize}
                        onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-accent-sage)] focus:outline-none"
                      >
                        <option value="">Select group size</option>
                        <option value="6-10">6-10 guests</option>
                        <option value="11-15">11-15 guests</option>
                        <option value="16-20">16-20 guests</option>
                        <option value="21+">21+ guests</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">Preferred Dates *</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.dates}
                          onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                          onClick={() => setShowCalendar(!showCalendar)}
                          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-[var(--color-accent-sage)] focus:outline-none cursor-pointer"
                          placeholder="Select dates (DD/MM/YYYY)"
                          readOnly
                        />
                        <Calendar 
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                        />
                      </div>
                      {showCalendar && (
                        <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg p-4">
                          <DayPicker
                            mode="range"
                            selected={dateRange as any}
                            onSelect={handleDateSelect}
                            disabled={{ before: new Date() }}
                          />
                          <div className="mt-3 flex gap-2">
                            {dateRange.from && dateRange.to && (
                              <button
                                type="button"
                                onClick={() => setShowCalendar(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                                style={{
                                  background: "var(--color-accent-sage)",
                                }}
                              >
                                Confirm Dates
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setDateRange({});
                                setFormData({ ...formData, dates: "" });
                              }}
                              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Location</label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-accent-sage)] focus:outline-none"
                      >
                        <option value="">Any location</option>
                        <option value="bath">Bath</option>
                        <option value="birmingham">Birmingham</option>
                        <option value="blackpool">Blackpool</option>
                        <option value="bournemouth">Bournemouth</option>
                        <option value="brighton">Brighton</option>
                        <option value="bristol">Bristol</option>
                        <option value="cambridge">Cambridge</option>
                        <option value="canterbury">Canterbury</option>
                        <option value="cheltenham">Cheltenham</option>
                        <option value="chester">Chester</option>
                        <option value="cotswolds">Cotswolds</option>
                        <option value="durham">Durham</option>
                        <option value="exeter">Exeter</option>
                        <option value="harrogate">Harrogate</option>
                        <option value="lake-district">Lake District</option>
                        <option value="leeds">Leeds</option>
                        <option value="liverpool">Liverpool</option>
                        <option value="london">London</option>
                        <option value="manchester">Manchester</option>
                        <option value="margate">Margate</option>
                        <option value="newcastle">Newcastle</option>
                        <option value="newquay">Newquay</option>
                        <option value="nottingham">Nottingham</option>
                        <option value="oxford">Oxford</option>
                        <option value="plymouth">Plymouth</option>
                        <option value="sheffield">Sheffield</option>
                        <option value="st-ives">St Ives</option>
                        <option value="stratford-upon-avon">Stratford-upon-Avon</option>
                        <option value="windsor">Windsor</option>
                        <option value="york">York</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Add Experiences (Optional) 
                      {formData.experiences.length > 0 && (
                        <span className="ml-2 text-[var(--color-accent-sage)]">
                          ({formData.experiences.length} selected)
                        </span>
                      )}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-4 bg-white rounded-xl border border-gray-300">
                      {experienceOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors group"
                        >
                          <label 
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={formData.experiences.includes(option.value)}
                                onChange={() => handleExperienceToggle(option.value)}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                  formData.experiences.includes(option.value)
                                    ? "bg-[var(--color-accent-sage)] border-[var(--color-accent-sage)]"
                                    : "border-gray-300 group-hover:border-[var(--color-accent-sage)]"
                                }`}
                              >
                                {formData.experiences.includes(option.value) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-[var(--color-neutral-dark)] group-hover:text-[var(--color-text-primary)]">
                              {option.label}
                            </span>
                          </label>
                          {experiencesWithPages.includes(option.value) && (
                            <Link
                              href={`/experiences/${option.value}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex-shrink-0 p-1.5 rounded hover:bg-[var(--color-accent-sage)]/10 text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                              title={`View ${option.label} details`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-accent-sage)] focus:outline-none resize-none"
                      placeholder="Tell us about your celebration and any special requirements..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl py-6 text-lg font-medium transition-all duration-200 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "var(--color-accent-sage)",
                      color: "white",
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send Enquiry"}
                  </Button>

                  <p className="text-sm text-[var(--color-neutral-dark)] text-center">
                    By submitting this form, you agree to our{" "}
                    <a href="/privacy" className="text-[var(--color-accent-sage)] hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}





