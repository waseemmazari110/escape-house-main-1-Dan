"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Church, Camera, Utensils, Sparkles, Check, ChevronDown, Star, Users } from "lucide-react";
import { useState } from "react";

export default function WeddingsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    "Spacious grounds and photo-perfect backdrops for your special day",
    "On-site or nearby ceremony options for intimate celebrations",
    "Catering, styling, and entertainment packages available",
    "Accommodation for wedding party and guests all in one place",
    "Exclusive use properties for complete privacy",
    "Dedicated wedding coordinator to help plan every detail"
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=90",
      alt: "Beautiful outdoor wedding ceremony in elegant garden setting"
    },
    {
      url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=90",
      alt: "Romantic countryside wedding venue"
    },
    {
      url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=90",
      alt: "Elegant wedding reception table setup"
    },
    {
      url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&q=90",
      alt: "Wedding celebration with guests"
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=90",
      alt: "Bride and groom in beautiful garden venue"
    },
    {
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=90",
      alt: "Luxury wedding venue with stunning architecture"
    }
  ];

  const benefits = [
    {
      title: "Intimate Venues",
      description: "Beautiful houses and grounds perfect for micro-weddings and weekend celebrations",
      icon: Church
    },
    {
      title: "All-In-One Stay",
      description: "Ceremony, reception, and accommodation in one stunning location",
      icon: Users
    },
    {
      title: "Picture Perfect",
      description: "Gorgeous gardens, elegant interiors, and scenic backdrops for wedding photos",
      icon: Camera
    }
  ];

  const faqs = [
    {
      question: "Can we hold the wedding ceremony at the house?",
      answer: "Many of our properties are licensed for civil ceremonies or have beautiful grounds perfect for outdoor weddings. Some work with nearby venues. We'll help you find the perfect setup for your ceremony and celebration."
    },
    {
      question: "How many guests can stay at the property?",
      answer: "Our wedding houses typically accommodate 10-30 guests for overnight stays. This is perfect for intimate weddings where the wedding party and close family can stay together for the whole weekend."
    },
    {
      question: "Can you arrange catering for our wedding?",
      answer: "Absolutely! We work with excellent caterers and can arrange everything from formal wedding breakfasts to relaxed barbecues and buffets. We can also arrange private chefs, bar service, and wedding cakes."
    },
    {
      question: "What about decorations and styling?",
      answer: "We can arrange professional styling and decoration services including florals, table settings, lighting, and more. Many couples also choose to bring their own personal touches, which is absolutely fine."
    },
    {
      question: "How far in advance should we book for a wedding?",
      answer: "We recommend booking 12-18 months in advance for summer weekends and popular dates. However, we often have availability for smaller timescales, especially for midweek weddings or off-peak months."
    },
    {
      question: "Do you have wedding packages available?",
      answer: "Yes! We can create bespoke wedding packages including accommodation, catering, styling, and coordination. Get in touch to discuss your dream wedding and we'll create a tailored package for you."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl mb-12"
          >
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop"
              alt="Beautiful outdoor wedding ceremony in elegant garden setting"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 
                className="text-white mb-2" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                Wedding Houses
              </h1>
              <p className="text-white/90 text-lg">Intimate venues for unforgettable celebrations</p>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2"
            >
              <p className="text-xl text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Celebrate your special day in a setting that's truly yours. Our wedding houses offer elegant backdrops for intimate ceremonies, receptions, and full-weekend celebrations surrounded by family and friends. From countryside manors to coastal retreats, create memories in your perfect wedding venue.
              </p>

              <h3 className="mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                <Sparkles className="w-6 h-6 text-[var(--color-accent-gold)]" />
                What's Included
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--color-accent-sage)] bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-[var(--color-accent-sage)]" />
                    </div>
                    <p className="text-[var(--color-neutral-dark)]">{feature}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-8 py-6 font-medium transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  <Link href="/properties">Browse Wedding Venues</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8 py-6 font-medium border-2"
                  style={{
                    borderColor: "var(--color-accent-gold)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <Link href="/contact">Check Availability and Book</Link>
                </Button>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Camera className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Beautiful Grounds</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Photo-perfect backdrops for your special day
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Church className="w-8 h-8 text-[var(--color-accent-gold)] mb-3" />
                <h4 className="font-semibold mb-2">Ceremony Options</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  On-site or nearby venues available
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Utensils className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Catering Packages</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Full service available for your celebration
                </p>
              </div>

              {/* Trust Badge */}
              <div className="bg-gradient-to-br from-[var(--color-accent-sage)] to-[var(--color-accent-gold)] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-sm font-medium">Perfect Wedding Venues</p>
                <p className="text-xs opacity-90 mt-1">Trusted by hundreds of couples</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Wedding Venue Gallery
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Why Choose Our Wedding Houses
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--color-accent-sage)] bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[var(--color-accent-sage)]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-[var(--color-neutral-dark)]">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Wedding FAQs
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Common questions about booking wedding venues
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-[var(--color-bg-primary)] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <span className="font-semibold text-[var(--color-text-primary)] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}