import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christmas Party Houses UK | Festive Group Accommodation & Breaks",
  description: "Celebrate Christmas together in a luxury party house. Log fires, hot tubs and festive cheer for groups of 8-30+. Available for Christmas week, Boxing Day and New Year.",
  keywords: ["Christmas party houses UK", "festive group accommodation", "Christmas breaks for groups", "holiday houses Christmas"],
  openGraph: {
    title: "Christmas Group Accommodation | Group Escape Houses",
    description: "Festive party houses with log fires and hot tubs. Christmas week and New Year availability.",
    url: "https://groupescapehouses.co.uk/occasions/christmas",
  },
};

export default function ChristmasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





