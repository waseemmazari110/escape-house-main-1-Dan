import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hen Party Houses UK | Luxury Accommodation for 8-30 Guests",
  description: "Handpicked hen party houses across the UK. Hot tubs, pools, games rooms. Sleeping 8-30+ guests. Weekend and midweek availability. Free instant quotes.",
  keywords: ["hen party houses", "hen weekend accommodation", "hen do houses UK", "large group hen venues"],
  openGraph: {
    title: "Hen Party Houses UK | Group Escape Houses",
    description: "Luxury hen party accommodation with hot tubs and pools. 8-30+ guests.",
    url: "https://groupescapehouses.co.uk/occasions/hen-party-houses",
  },
  alternates: {
    canonical: "https://groupescapehouses.co.uk/occasions/hen-party-houses",
  },
};

export default function OccasionsHenPartyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
