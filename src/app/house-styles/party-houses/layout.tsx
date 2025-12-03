import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purpose-Built Party Houses | Entertainment Venues for Celebrations",
  description: "Houses specifically designed for celebrations with sound systems, outdoor spaces, hot tubs and entertainment facilities. Relaxed noise policies perfect for hen parties and birthdays.",
  keywords: ["party houses UK", "celebration venues", "entertainment houses", "group party accommodation"],
  openGraph: {
    title: "Purpose-Built Party Houses | Group Escape Houses",
    description: "Designed for celebrations with entertainment facilities and relaxed noise policies.",
    url: "https://groupescapehouses.co.uk/house-styles/party-houses",
  },
};

export default function PartyHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





