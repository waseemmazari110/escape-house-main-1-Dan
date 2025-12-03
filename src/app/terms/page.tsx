import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-[900px] mx-auto px-6 py-24">
        <h1 className="mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Terms and Conditions
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-8" style={{ color: "var(--color-neutral-dark)" }}>
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              1. Booking and Payment Terms
            </h2>
            <p className="mb-4">
              When you make a booking with Group Escape Houses, you agree to pay a deposit at the time of booking. The deposit is typically 25% of the total booking cost and is non-refundable except in cases covered by our cancellation policy.
            </p>
            <p className="mb-4">
              The remaining balance is due 8 weeks before your arrival date. If you book within 8 weeks of your arrival date, the full balance is payable at the time of booking.
            </p>
            <p className="mb-4">
              All prices are quoted in British Pounds (GBP) and include VAT where applicable. We accept payment by credit card, debit card, or bank transfer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              2. Cancellation Policy
            </h2>
            <p className="mb-4">
              If you need to cancel your booking, the following charges apply:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>More than 8 weeks before arrival: Deposit forfeited</li>
              <li>4-8 weeks before arrival: 50% of total booking cost</li>
              <li>2-4 weeks before arrival: 75% of total booking cost</li>
              <li>Less than 2 weeks before arrival: 100% of total booking cost</li>
            </ul>
            <p className="mt-4">
              We strongly recommend taking out travel insurance to cover unexpected cancellations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              3. Security Deposit
            </h2>
            <p className="mb-4">
              A refundable security deposit of £250-£500 (depending on the property) is required. This will be taken as a pre-authorisation on your credit or debit card 7 days before arrival.
            </p>
            <p className="mb-4">
              The deposit will be released within 7 days after your departure, provided there is no damage to the property or its contents, and the property is left in a reasonable condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              4. House Rules
            </h2>
            <p className="mb-4">
              All guests must comply with the house rules provided for each property. Key rules include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maximum occupancy must not be exceeded</li>
              <li>No smoking inside the property</li>
              <li>Respect quiet hours (typically 11pm-8am)</li>
              <li>No parties or events beyond the booked group size</li>
              <li>Respect neighbours and local community</li>
              <li>No illegal activities</li>
            </ul>
            <p className="mt-4">
              Failure to comply with house rules may result in immediate eviction without refund and forfeiture of the security deposit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              5. Check-In and Check-Out
            </h2>
            <p className="mb-4">
              Standard check-in time is 4pm and check-out time is 10am. Early check-in or late check-out may be available on request and subject to availability, with additional charges.
            </p>
            <p className="mb-4">
              Check-in instructions will be sent to you 48 hours before arrival. Please ensure you provide accurate contact details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              6. Liability and Insurance
            </h2>
            <p className="mb-4">
              Group Escape Houses acts as an agent for property owners. While we take reasonable care to ensure properties meet our standards, we cannot be held liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal injury or illness during your stay</li>
              <li>Loss or damage to personal belongings</li>
              <li>Temporary loss of facilities due to maintenance or circumstances beyond our control</li>
              <li>Changes to local amenities or attractions</li>
            </ul>
            <p className="mt-4">
              We recommend all guests take out appropriate travel and personal contents insurance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              7. Property Descriptions and Photos
            </h2>
            <p className="mb-4">
              We make every effort to ensure property descriptions and photographs are accurate. However, minor variations may occur. Properties are let on the understanding that minor differences do not constitute grounds for compensation or refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              8. Add-On Experiences
            </h2>
            <p className="mb-4">
              Add-on experiences such as cocktail classes, private chefs, and entertainment are provided by third-party suppliers. While we work with trusted partners, we cannot be held responsible for the quality or delivery of these services.
            </p>
            <p className="mb-4">
              Payment for add-ons is typically required in full at the time of booking. Cancellation terms may differ from accommodation bookings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              9. Changes by Group Escape Houses
            </h2>
            <p className="mb-4">
              We reserve the right to make changes to bookings in exceptional circumstances. If we need to change your property, we will offer suitable alternatives of equal or higher standard.
            </p>
            <p className="mb-4">
              If no suitable alternative is available, we will provide a full refund. We cannot be held liable for any additional costs you may incur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              10. Data Protection
            </h2>
            <p className="mb-4">
              We process your personal data in accordance with UK GDPR and data protection laws. Please see our Privacy Policy for full details on how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              11. Complaints and Disputes
            </h2>
            <p className="mb-4">
              If you have any complaints during your stay, please contact us immediately so we can attempt to resolve the issue. Complaints made after departure may not be eligible for compensation.
            </p>
            <p className="mb-4">
              Any disputes will be governed by English law and subject to the exclusive jurisdiction of the English courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              12. Contact Information
            </h2>
            <p className="mb-4">
              For questions about these terms and conditions, please contact us:
            </p>
            <p className="mb-2">
              <strong>Group Escape Houses</strong><br />
              Office, 11a North Street<br />
              Brighton<br />
              BN41 1DH
            </p>
            <p>
              Email: <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:underline">hello@groupescapehouses.co.uk</a>
            </p>
          </section>

          <section>
            <p className="text-sm italic" style={{ color: "var(--color-neutral-dark)" }}>
              Last updated: January 2025
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}





