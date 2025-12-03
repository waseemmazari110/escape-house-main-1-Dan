import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Large Group Accommodation UK | Luxury Houses for 10-40 Guests | Group Escape Houses",
  description: "Book exceptional large group accommodation across the UK. Luxury houses sleeping 10-40 guests with hot tubs, pools, games rooms. Perfect for celebrations, reunions & group holidays. 3,000+ 5-star reviews.",
  keywords: [
    "large group accommodation UK",
    "group holiday houses",
    "luxury group accommodation",
    "houses for large groups",
    "group holiday rentals UK",
    "large holiday homes UK",
    "group getaway accommodation",
    "houses with hot tubs UK",
    "group houses with pools",
    "celebration venues UK"
  ],
  openGraph: {
    title: "Large Group Accommodation UK | Group Escape Houses",
    description: "Book exceptional large group accommodation across the UK. Luxury houses sleeping 10-40 guests with hot tubs, pools, games rooms.",
    url: "https://groupescapehouses.co.uk",
    siteName: "Group Escape Houses",
    images: [
      {
        url: "https://groupescapehouses.co.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury UK group accommodation with hot tubs and swimming pools",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Large Group Accommodation UK | Group Escape Houses",
    description: "Book exceptional large group accommodation across the UK. Luxury houses sleeping 10-40 guests with hot tubs, pools, games rooms.",
    images: ["https://groupescapehouses.co.uk/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://groupescapehouses.co.uk/",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}





