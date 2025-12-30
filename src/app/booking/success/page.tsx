"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Calendar } from "lucide-react";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Booking Request Submitted!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your booking request. We've received your details and will contact you shortly to confirm your reservation and arrange payment.
          </p>

          {bookingId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-500 mb-2">Booking Reference</p>
              <p className="text-2xl font-mono font-bold text-gray-900">#{bookingId}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>You'll receive a confirmation email with your booking details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Our team will review your request and contact you within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>We'll send you a secure payment link to complete your booking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Once payment is confirmed, you'll receive your booking confirmation</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button variant="outline" className="w-full sm:w-auto">
                Browse More Properties
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto bg-[var(--color-accent-sage)] text-white hover:bg-emerald-700">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
