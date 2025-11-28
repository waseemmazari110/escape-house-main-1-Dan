import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Process Explained | Deposits, Payments & House Rules Guide",
  description: "Simple 4-step booking process for hen party houses. Understand deposits, payment schedules, cancellation policy and house rules. Transparent pricing with no hidden fees.",
  keywords: ["how to book hen party house", "hen weekend booking process", "party house payment guide", "booking deposit"],
  openGraph: {
    title: "How Our Booking Process Works | Group Escape Houses",
    description: "Easy 4-step process. Deposits, payment terms and cancellation policy explained clearly.",
    url: "https://groupescapehouses.co.uk/how-it-works",
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}