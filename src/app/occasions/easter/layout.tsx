import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Easter Holiday Houses UK | Spring Break Group Accommodation",
  description: "Easter holiday houses perfect for family gatherings and spring celebrations. Luxury properties sleeping 8-30 guests across the UK.",
  keywords: ["Easter houses", "spring break accommodation", "Easter holiday rental", "family Easter breaks"],
  openGraph: {
    title: "Easter Holiday Houses | Group Escape Houses",
    description: "Celebrate Easter in luxury group accommodation. Perfect for families and friends.",
    url: "https://groupescapehouses.co.uk/occasions/easter",
  },
  alternates: {
    canonical: "https://groupescapehouses.co.uk/occasions/easter",
  },
};

export default function EasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





