import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Property | Advertise with Group Escape Houses",
  description: "Join our network of premium group accommodation providers. Commission-based model with no upfront fees. Reach thousands of group travellers across the UK.",
  keywords: ["list property", "advertise accommodation", "property owner", "holiday rental commission", "group accommodation platform"],
  openGraph: {
    title: "List Your Property | Advertise with Group Escape Houses",
    description: "Join our network of premium group accommodation providers. Commission-based model with no upfront fees.",
    url: "https://groupescapehouses.co.uk/advertise-with-us",
  },
  alternates: {
    canonical: "https://groupescapehouses.co.uk/advertise-with-us",
  },
};

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
