import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse by House Style & Features | Manor Houses, Castles & Hot Tubs",
  description: "Filter party houses by architectural style and premium features. Grand manors, historic castles, luxury cottages. Search by hot tubs, pools, games rooms and cinema rooms.",
  keywords: ["luxury manor houses UK", "party houses with hot tubs", "houses with pools", "castles for hire UK", "luxury cottages"],
  openGraph: {
    title: "House Styles & Premium Features | Group Escape Houses",
    description: "Filter by architectural style or feature. Manors, castles, hot tubs, pools and entertainment.",
    url: "https://groupescapehouses.co.uk/house-styles-and-features",
  },
};

export default function HouseStylesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





