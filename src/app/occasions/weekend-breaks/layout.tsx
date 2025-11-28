import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weekend Breaks for Groups | Friday to Sunday Short Stays UK",
  description: "Two and three-night weekend breaks in party houses. Friday arrivals, flexible check-outs and midweek discounts available. Perfect for quick getaways and mini-celebrations.",
  keywords: ["weekend breaks for groups UK", "short stay party houses", "Friday to Sunday breaks", "group weekend accommodation"],
  openGraph: {
    title: "Group Weekend Breaks | Group Escape Houses",
    description: "2-3 night stays with Friday arrivals. Quick getaways and mini-celebrations from £69pp.",
    url: "https://groupescapehouses.co.uk/occasions/weekend-breaks",
  },
};

export default function WeekendBreaksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}