import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses with Hot Tubs for Groups | Private Tubs Sleeping 8-30+",
  description: "Party houses featuring private hot tubs with stunning views. Wood-fired, electric and inflatable options available. Perfect for relaxing after a night out on your hen weekend.",
  keywords: ["houses with hot tubs UK", "party houses hot tub", "group accommodation hot tub", "hen party houses with hot tubs"],
  openGraph: {
    title: "Group Houses with Private Hot Tubs | Group Escape Houses",
    description: "Properties with wood-fired and electric hot tubs. Scenic views, privacy and perfect hen party relaxation.",
    url: "https://groupescapehouses.co.uk/features/hot-tub",
  },
};

export default function HotTubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





