import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Houses with Pools | Indoor & Heated Outdoor Swimming Pools",
  description: "Group properties featuring indoor heated pools and outdoor summer pools. Ideal for active hen parties with pool games, swimming and splash-filled celebrations.",
  keywords: ["houses with pools UK", "party houses with swimming pool", "group accommodation pool", "houses with indoor pool"],
  openGraph: {
    title: "Houses with Swimming Pools for Groups | Group Escape Houses",
    description: "Indoor heated and outdoor pools. Perfect for active hen weekends and pool parties.",
    url: "https://groupescapehouses.co.uk/features/swimming-pool",
  },
};

export default function SwimmingPoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}