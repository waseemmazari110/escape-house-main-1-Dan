import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Booking Terms, Cancellations & House Rules",
  description: "Booking terms and conditions including deposits, payment schedules, cancellation policy, damage deposits and house rules. Everything explained in plain English.",
  keywords: ["terms and conditions", "booking terms", "cancellation policy", "house rules"],
  openGraph: {
    title: "Terms & Conditions | Group Escape Houses",
    description: "Booking terms, cancellation policy and house rules explained clearly.",
    url: "https://groupescapehouses.co.uk/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}