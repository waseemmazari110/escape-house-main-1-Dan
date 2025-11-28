import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Five-Star Luxury Party Houses | Premium Group Accommodation UK",
  description: "Top-tier luxury properties with premium facilities, designer interiors and exceptional service. Hot tubs, pools, chefs kitchens and boutique bedrooms for discerning hen parties.",
  keywords: ["luxury party houses UK", "high-end group accommodation", "5-star party houses", "premium celebration venues"],
  openGraph: {
    title: "Five-Star Luxury Houses | Group Escape Houses",
    description: "Premium properties with designer interiors, exceptional facilities and boutique service.",
    url: "https://groupescapehouses.co.uk/house-styles/luxury-houses",
  },
};

export default function LuxuryHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}