import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Castle Hire for Groups | Historic Castles Sleeping 20-40 Guests",
  description: "Rent an entire castle for your celebration. Scottish fortresses, Welsh castles and English keeps with towers, turrets and dramatic settings for unforgettable hen parties.",
  keywords: ["castle hire UK", "rent a castle for groups", "castle accommodation hen party", "castle weddings and events"],
  openGraph: {
    title: "Hire a Castle for Your Celebration | Group Escape Houses",
    description: "Scottish, Welsh and English castles sleeping 20-40+. Towers, turrets and dramatic settings.",
    url: "https://groupescapehouses.co.uk/house-styles/castles",
  },
};

export default function CastlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}