"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BookingTermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <nav className="flex gap-2 text-sm mb-6 text-[var(--color-neutral-dark)]">
            <Link href="/" className="hover:text-[var(--color-accent-sage)] transition-colors">Home</Link>
            <span>/</span>
            <span>Booking Terms & Conditions</span>
          </nav>
          
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Booking Terms & Conditions
          </h1>
          <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl leading-relaxed">
            Please read these terms and conditions carefully before booking your stay with Group Escape Houses.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            
            {/* Bookings & Payment */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                1. Bookings & Payment
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  All bookings are subject to availability and acceptance by Group Escape Houses. A booking is confirmed only when we have received your deposit payment and issued a booking confirmation.
                </p>
                <p>
                  <strong>Deposit:</strong> A non-refundable deposit of 25% of the total booking cost is required to secure your reservation. This must be paid within 48 hours of making your booking request.
                </p>
                <p>
                  <strong>Balance Payment:</strong> The remaining balance must be paid in full no later than 8 weeks before your arrival date. If your booking is made within 8 weeks of arrival, full payment is required immediately.
                </p>
                <p>
                  <strong>Security Deposit:</strong> A refundable security deposit is required for all bookings. The amount varies by property (typically £250-£1,000) and will be returned within 7-14 days after your departure, subject to property inspection.
                </p>
              </div>
            </div>

            {/* Cancellations */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                2. Cancellation Policy
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  We understand that plans can change. However, please note our cancellation terms:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cancellations made more than 8 weeks before arrival: Deposit forfeited, balance refunded</li>
                  <li>Cancellations made 4-8 weeks before arrival: 50% of total booking cost forfeited</li>
                  <li>Cancellations made less than 4 weeks before arrival: 100% of total booking cost forfeited</li>
                  <li>No refunds for early departures or unused nights</li>
                </ul>
                <p>
                  We strongly recommend purchasing travel insurance to protect against unforeseen circumstances.
                </p>
              </div>
            </div>

            {/* Arrival & Departure */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                3. Arrival & Departure
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  <strong>Check-in:</strong> Standard check-in time is 4:00 PM. Early check-in may be available upon request (additional charges may apply).
                </p>
                <p>
                  <strong>Check-out:</strong> Standard check-out time is 10:00 AM. Late check-out may be available upon request (additional charges may apply).
                </p>
                <p>
                  Keys and access instructions will be provided 7 days before your arrival. Please ensure you arrive within the property's specified check-in hours.
                </p>
              </div>
            </div>

            {/* House Rules */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                4. House Rules & Guest Conduct
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  All guests must respect the property and follow house rules:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Maximum Occupancy:</strong> The number of guests must not exceed the stated maximum capacity. Additional guests are not permitted without prior approval.</li>
                  <li><strong>No Smoking:</strong> All properties are strictly non-smoking inside. Smoking is only permitted in designated outdoor areas.</li>
                  <li><strong>Noise Policy:</strong> Please respect neighbours and local residents. Quiet hours are typically 11:00 PM to 8:00 AM. Excessive noise complaints may result in termination of your booking without refund.</li>
                  <li><strong>Parties:</strong> Some properties allow parties and celebrations with prior approval. Please confirm with us before booking if you plan to host an event.</li>
                  <li><strong>Pets:</strong> Only permitted in pet-friendly properties and with prior approval. Additional cleaning fees may apply.</li>
                </ul>
              </div>
            </div>

            {/* Damage & Liability */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                5. Damage & Liability
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  Guests are responsible for any damage caused during their stay. This includes but is not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Damage to property, furniture, fixtures, or fittings</li>
                  <li>Loss or theft of items from the property</li>
                  <li>Excessive cleaning requirements beyond normal wear and tear</li>
                  <li>Damage to gardens, hot tubs, pools, or outdoor facilities</li>
                </ul>
                <p>
                  Any damage must be reported immediately. Repair or replacement costs will be deducted from your security deposit. If costs exceed the deposit, you will be invoiced for the additional amount.
                </p>
                <p>
                  Group Escape Houses is not liable for personal injury, loss, or damage to guests' belongings during their stay.
                </p>
              </div>
            </div>

            {/* Facilities & Amenities */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                6. Facilities & Amenities
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  We strive to ensure all advertised facilities are available during your stay. However:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Hot tubs, pools, and saunas may be temporarily unavailable due to maintenance. We will notify you as soon as possible if this occurs.</li>
                  <li>Some facilities may be seasonal (e.g., outdoor pools available May-September only)</li>
                  <li>Games room equipment, bicycles, and sports facilities are provided for guest use at their own risk</li>
                </ul>
                <p>
                  If a major facility is unavailable and we're unable to provide adequate notice, a partial refund may be offered at our discretion.
                </p>
              </div>
            </div>

            {/* Force Majeure */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                7. Force Majeure
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  Group Escape Houses shall not be liable for any failure to perform its obligations due to circumstances beyond our reasonable control, including but not limited to acts of God, war, terrorism, pandemic, government restrictions, or natural disasters.
                </p>
                <p>
                  In such cases, we will work with you to reschedule your booking or provide alternative accommodation where possible. Refunds are at our discretion.
                </p>
              </div>
            </div>

            {/* Privacy & Data */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                8. Privacy & Data Protection
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  We collect and process personal data in accordance with UK GDPR regulations. Your information is used solely for booking administration and will not be shared with third parties without your consent.
                </p>
                <p>
                  For full details, please refer to our <Link href="/privacy" className="text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">Privacy Policy</Link>.
                </p>
              </div>
            </div>

            {/* Changes to Booking */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                9. Changes to Your Booking
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  If you wish to change your booking dates or property, please contact us as soon as possible. Changes are subject to availability and may incur an administration fee of £50.
                </p>
                <p>
                  Date changes made within 4 weeks of your original arrival date will be treated as a cancellation and rebooking, subject to our standard cancellation policy.
                </p>
              </div>
            </div>

            {/* Complaints */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                10. Complaints & Issues
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  If you experience any issues during your stay, please contact us immediately so we can resolve the matter promptly. We aim to respond to all concerns within 2 hours during office hours.
                </p>
                <p>
                  Formal complaints must be submitted in writing within 14 days of your departure. We will investigate and respond within 28 days.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                11. Governing Law
              </h2>
              <div className="space-y-4 text-[var(--color-neutral-dark)]">
                <p>
                  These terms and conditions are governed by English law. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Questions About Our Terms?
              </h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">
                If you have any questions about our booking terms and conditions, please don't hesitate to get in touch.
              </p>
              <p className="text-[var(--color-neutral-dark)]">
                <strong>Email:</strong> <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">hello@groupescapehouses.co.uk</a><br />
                <strong>Office:</strong> 11a North Street, Brighton BN41 1DH
              </p>
            </div>

            <div className="mt-8 text-sm text-[var(--color-neutral-dark)]">
              <p><em>Last updated: January 2025</em></p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}





