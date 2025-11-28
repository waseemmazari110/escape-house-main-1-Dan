import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Guest Reviews | 3,000+ Five-Star Hen Party Testimonials",
  description: "Read genuine reviews from hen parties who stayed at our properties. 3,000+ verified five-star testimonials. See photos, ratings and honest feedback from real celebrations.",
  keywords: ["hen party house reviews", "group escape houses reviews", "party house testimonials UK", "5 star hen accommodation"],
  openGraph: {
    title: "3,000+ Verified Guest Reviews | Group Escape Houses",
    description: "Real testimonials with photos from hen parties across the UK. Average rating 4.9/5.",
    url: "https://groupescapehouses.co.uk/reviews",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}