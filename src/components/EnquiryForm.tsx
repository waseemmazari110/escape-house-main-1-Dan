"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface EnquiryFormProps {
  propertyTitle?: string;
  propertySlug?: string;
}

export default function EnquiryForm({ propertyTitle, propertySlug }: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Spam protection state
  const [formLoadTime, setFormLoadTime] = useState<number>(0);
  const [honeypot, setHoneypot] = useState("");
  const [userInteraction, setUserInteraction] = useState({ clicks: 0, keystrokes: 0 });
  const formRef = useRef<HTMLFormElement>(null);

  // Track form load time and user interaction
  useEffect(() => {
    setFormLoadTime(Date.now());

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

  // Helper function to convert experience name to URL slug
  const experienceToSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const addons = formData.getAll('addons');

    try {
      // Generate JavaScript challenge
      const challenge = Math.floor(Date.now() / 10000).toString();

      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          checkin: formData.get('checkin'),
          checkout: formData.get('checkout'),
          groupSize: formData.get('groupSize'),
          occasion: formData.get('occasion'),
          addons,
          message: formData.get('message'),
          propertyTitle,
          propertySlug,
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

      setIsSubmitted(true);
      toast.success("Enquiry sent successfully! Our team will get back to you within 24 hours.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send enquiry. Please try again.");
      console.error("Enquiry submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Enquiry Sent!
        </h3>
        <p className="text-[var(--color-neutral-dark)]">
          Thank you for your enquiry. Our team will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
      <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
        Check dates and enquire
      </h3>

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

        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium mb-2 block">
            Your name
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Jane Smith"
            className="rounded-xl"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium mb-2 block">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
            className="rounded-xl"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
            Phone number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="07123 456789"
            className="rounded-xl"
          />
        </div>

        {/* Dates */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="checkin" className="text-base font-semibold mb-2 block">
              Arrival date
            </Label>
            <div className="relative">
              <Input
                id="checkin"
                name="checkin"
                type="date"
                required
                className="rounded-xl text-base py-6"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-[var(--color-accent-sage)]" />
            </div>
            <p className="text-xs text-[var(--color-neutral-dark)] mt-1.5">
              Check-in from 4pm
            </p>
          </div>
          <div>
            <Label htmlFor="checkout" className="text-base font-semibold mb-2 block">
              Departure date
            </Label>
            <div className="relative">
              <Input
                id="checkout"
                name="checkout"
                type="date"
                required
                className="rounded-xl text-base py-6"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-[var(--color-accent-sage)]" />
            </div>
            <p className="text-xs text-[var(--color-neutral-dark)] mt-1.5">
              Check-out by 10am · 3 night minimum
            </p>
          </div>
        </div>

        {/* Group Size */}
        <div>
          <Label htmlFor="groupSize" className="text-sm font-medium mb-2 block">
            Group size
          </Label>
          <Input
            id="groupSize"
            name="groupSize"
            type="number"
            min="1"
            required
            placeholder="12"
            className="rounded-xl"
          />
        </div>

        {/* Occasion */}
        <div>
          <Label htmlFor="occasion" className="text-sm font-medium mb-2 block">
            Occasion
          </Label>
          <Input
            id="occasion"
            name="occasion"
            placeholder="Hen party"
            className="rounded-xl"
          />
        </div>

        {/* Add-ons */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Add experiences (optional)</Label>
          <div className="space-y-2.5">
            {[
              "Cocktail Masterclass",
              "Butlers in the Buff",
              "Life Drawing",
              "Private Chef",
              "Spa Treatments",
              "Mobile Beauty Bar",
              "Make-up Artist",
              "Hair Styling",
              "Prosecco Reception",
              "Afternoon Tea",
              "BBQ Catering",
              "Pizza Making Class",
              "Bottomless Brunch",
              "Brunch Package",
              "Gin Tasting",
              "Wine Tasting",
              "Cocktail Bar Hire",
              "Flower Crown Making",
              "Dance Class",
              "Karaoke Night",
              "Yoga Session",
              "Photography Package",
              "Videography Package",
              "DJ Entertainment",
              "Games & Activities Pack",
              "Decorations & Balloons",
              "Personalised Robes",
              "Pamper Party Package",
            ].map((addon) => (
              <label key={addon} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="addons"
                  value={addon}
                  className="w-4 h-4 rounded border-2 border-[var(--color-neutral-dark)] accent-[var(--color-accent-sage)] cursor-pointer transition-all"
                />
                <Link
                  href={`/experiences/${experienceToSlug(addon)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm group-hover:text-[var(--color-accent-sage)] transition-colors flex items-center gap-1.5 flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {addon}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message" className="text-sm font-medium mb-2 block">
            Additional requests
          </Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us more about your celebration..."
            className="rounded-xl"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl py-6 text-base font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          style={{
            background: isSubmitting ? "var(--color-bg-secondary)" : "var(--color-accent-sage)",
            color: "white",
          }}
        >
          {isSubmitting ? "Sending..." : "Send Enquiry"}
        </Button>

        <p className="text-xs text-center text-[var(--color-neutral-dark)]">
          Fast response from our UK team. We'll get back to you within 24 hours.
        </p>
      </form>
    </div>
  );
}