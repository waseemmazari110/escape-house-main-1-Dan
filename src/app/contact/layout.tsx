import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Your Free Quote | Contact Our Hen Party Booking Team Brighton",
  description: "Free instant quotes for hen party houses. Call our Brighton team on 01273 569301 or submit an enquiry form. Same-day response Monday to Friday. No booking fees.",
  keywords: ["contact group escape houses", "hen party booking enquiry", "quote hen weekend", "book party house UK"],
  openGraph: {
    title: "Contact Us for Free Quote | Group Escape Houses",
    description: "Brighton-based booking team ready to help. Same-day quotes, no fees. Call 01273 569301 or enquire online.",
    url: "https://groupescapehouses.co.uk/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





