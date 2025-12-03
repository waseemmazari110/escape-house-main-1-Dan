import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handpicked Hen Party Houses UK | Verified Luxury Group Properties",
  description: "Every hen party house personally inspected and verified. Sleeping 8-30+ with essential features like hot tubs, BBQ areas and entertainment spaces. Weekend and midweek availability.",
  keywords: ["hen party houses", "hen weekend accommodation UK", "hen do houses", "large group hen party venues"],
  openGraph: {
    title: "Verified Hen Party Houses | Group Escape Houses",
    description: "Handpicked properties for hen celebrations. Each house inspected, verified and ready to party.",
    url: "https://groupescapehouses.co.uk/hen-party-houses",
  },
};

export default function HenPartyHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





