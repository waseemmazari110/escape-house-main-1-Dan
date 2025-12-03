import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manor Houses for Hire | Grand Country Estates for Large Groups",
  description: "Historic manor houses and country estates sleeping 16-30+ guests. Period features, sprawling grounds and elegant interiors for sophisticated hen party weekends.",
  keywords: ["manor houses to rent UK", "country estates for groups", "historic houses for hire", "stately homes hen parties"],
  openGraph: {
    title: "Manor Houses & Country Estates | Group Escape Houses",
    description: "Grand historic properties with period features and sprawling grounds for elegant celebrations.",
    url: "https://groupescapehouses.co.uk/house-styles/manor-houses",
  },
};

export default function ManorHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





