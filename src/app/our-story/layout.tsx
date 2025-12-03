import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Brighton Team | Meet the Hen Party Specialists Since 2018",
  description: "Founded in Brighton in 2018 by celebration enthusiasts. Our team personally inspects every property and arranges 500+ hen weekends annually. Passionate about creating perfect celebrations.",
  keywords: ["about group escape houses", "hen party specialists UK", "Brighton accommodation team"],
  openGraph: {
    title: "Our Story & Team | Group Escape Houses",
    description: "Brighton-based since 2018. Arranging 500+ hen weekends annually with personal service.",
    url: "https://groupescapehouses.co.uk/our-story",
  },
};

export default function OurStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





