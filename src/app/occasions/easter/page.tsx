"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Egg, Trees, Sun, Sparkles, Check, ChevronDownIcon, Star } from "lucide-react";
import { useState } from "react";

export default function EasterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    "Family-friendly houses with outdoor space",
    "Easter activity ideas and local events",
    "Short breaks and long weekends available",
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1600&q=80",
      alt: "Countryside picnic with family dining outdoors"
    },
    {
      url: "https://images.unsplash.com/photo-1584201712767-a80a2f29c1c6?w=1600&q=80",
      alt: "Beautiful spring garden perfect for Easter egg hunts"
    },
    {
      url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1600&q=80",
      alt: "Family gathering in country house garden"
    },
    {
      url: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1600&q=80",
      alt: "Springtime countryside with blooming flowers"
    },
    {
      url: "https://images.unsplash.com/photo-1416169607655-0c2b3ce2e1cc?w=1600&q=80",
      alt: "Luxury holiday home with beautiful spring gardens"
    },
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
      alt: "Easter celebration breakfast table outdoors"
    }
  ];

  const faqs = [
    {
      question: "Are your Easter houses family-friendly?",
      answer: "Absolutely! Our Easter properties are chosen for their family-friendly features including gardens for egg hunts, safe outdoor spaces, and plenty of room for everyone. Many have games rooms and entertainment areas perfect for all ages."
    },
    {
      question: "What's the best time to book for Easter?",
      answer: "Easter is a popular time, so we recommend booking 6-9 months in advance, especially for larger properties. However, we often have last-minute availability, so it's always worth checking with us."
    },
    {
      question: "Can you suggest Easter activities in the area?",
      answer: "Yes! Each of our properties comes with local area guides including Easter events, family attractions, country walks, and nearby activities. We're always happy to help you plan the perfect Easter break."
    },
    {
      question: "Do you offer short breaks over Easter?",
      answer: "Yes, we offer flexible stay options including 3-4 night Easter breaks. Many families prefer to arrive on Good Friday and stay through Easter Monday for the full bank holiday experience."
    },
    {
      question: "Are pets allowed for Easter stays?",
      answer: "Many of our properties are pet-friendly, perfect for bringing the whole family including your four-legged friends. Check individual property listings or ask us to find dog-friendly Easter houses."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl mb-12"
          >
            <img
              src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1600&q=80"
              alt="Countryside picnic with family dining outdoors"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 
                className="text-white mb-2" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                Easter Breaks
              </h1>
              <p className="text-white/90 text-lg">Springtime family escapes in beautiful countryside</p>
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
                Enjoy a springtime escape with family or friends. Our Easter holiday houses offer comfort, gardens for egg hunts, and beautiful countryside settings for quality time together.
              </p>

              <h3 className="mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                <Sparkles className="w-6 h-6 text-[var(--color-accent-gold)]" />
                What's Included
              </h3>

              <div className="space-y-4 mb-8">
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
                  <Link href="/properties">Browse Houses</Link>
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

            {/* Sidebar Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Trees className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Beautiful Gardens</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Perfect for Easter egg hunts
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Sun className="w-8 h-8 text-[var(--color-accent-gold)] mb-3" />
                <h4 className="font-semibold mb-2">Spring Settings</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Countryside locations for quality time
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Egg className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Family Activities</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Local events and Easter activities
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
                <p className="text-sm font-medium">Perfect Family Breaks</p>
                <p className="text-xs opacity-90 mt-1">Trusted by Easter families</p>
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
              Easter House Gallery
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

      {/* FAQ Section */}
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
              Easter FAQs
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Everything you need to know about Easter bookings
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
                  <ChevronDownIcon 
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





