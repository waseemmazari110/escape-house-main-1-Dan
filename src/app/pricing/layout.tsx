import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparent Pricing | Weekend & Midweek Rates | No Hidden Fees",
  description: "Clear pricing for luxury hen party houses. Weekend from £69pp, midweek from £49pp. 25% deposit, balance 8 weeks before. No hidden fees or surprises.",
  keywords: ["hen party house prices", "group accommodation pricing", "weekend rates", "transparent booking costs"],
  openGraph: {
    title: "Transparent Pricing & Payment Terms | Group Escape Houses",
    description: "Clear pricing from £49pp with no hidden fees. Deposits and payment terms explained.",
    url: "https://groupescapehouses.co.uk/pricing",
  },
  alternates: {
    canonical: "https://groupescapehouses.co.uk/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





