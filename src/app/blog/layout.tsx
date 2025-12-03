import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hen Party Planning Blog | Expert Tips, City Guides & House Spotlights",
  description: "Free planning resources from hen party experts. City nightlife guides, packing checklists, budgeting tips and property spotlights. Updated weekly with fresh inspiration.",
  keywords: ["hen party planning tips", "hen weekend ideas", "UK hen party blog", "celebration planning guide"],
  openGraph: {
    title: "Hen Party Planning Blog & Resources | Group Escape Houses",
    description: "Free expert advice, city guides, checklists and inspiration. Updated weekly.",
    url: "https://groupescapehouses.co.uk/blog",
  },
  alternates: {
    canonical: "https://groupescapehouses.co.uk/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





