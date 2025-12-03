import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Hen Party Destinations | Brighton, Bath, Manchester & 25+ Cities",
  description: "Choose from 25+ hen party destinations across the UK. Coastal cities, vibrant nightlife and countryside retreats. Find party houses in Brighton, Bath, Manchester, York and Liverpool.",
  keywords: ["hen party destinations UK", "best cities for hen weekends", "Brighton hen parties", "Bath hen do", "Manchester hen weekend"],
  openGraph: {
    title: "Top UK Hen Party Destinations | Group Escape Houses",
    description: "Explore 25+ cities with luxury party houses. Beach towns, nightlife hotspots & country escapes.",
    url: "https://groupescapehouses.co.uk/destinations",
  },
  alternates: {
    canonical: "https://groupescapehouses.co.uk/destinations",
  },
};

export default function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





