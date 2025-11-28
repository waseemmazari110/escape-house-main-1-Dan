import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Experiences to Your Hen Weekend | Chef, Cocktails & Spa Days",
  description: "Transform your hen weekend with curated experiences. Private chefs from £55pp, cocktail masterclasses, mobile spa treatments, yoga and wellness. Book activities with your property.",
  keywords: ["hen party activities UK", "cocktail masterclass", "private chef hen party", "spa treatments", "hen do experiences"],
  openGraph: {
    title: "Hen Weekend Experiences & Activities | Group Escape Houses",
    description: "Private chefs, cocktail classes, spa days & wellness. Prices from £40pp.",
    url: "https://groupescapehouses.co.uk/experiences",
  },
  alternates: {
    canonical: "https://groupescapehouses.co.uk/experiences",
  },
};

export default function ExperiencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}