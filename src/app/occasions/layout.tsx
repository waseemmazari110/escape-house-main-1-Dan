import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Houses by Occasion | Hen Weekends, Birthdays & Reunions",
  description: "Properties suited to every celebration type. Hen parties, milestone birthdays, family reunions, Christmas gatherings and New Year breaks. Find the perfect house for your occasion.",
  keywords: ["hen party houses", "birthday party houses UK", "wedding accommodation", "celebration venues", "Christmas party houses"],
  openGraph: {
    title: "Properties for Every Occasion | Group Escape Houses",
    description: "Hen parties, birthdays, reunions, weddings and seasonal celebrations. Find your perfect match.",
    url: "https://groupescapehouses.co.uk/occasions",
  },
};

export default function OccasionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}