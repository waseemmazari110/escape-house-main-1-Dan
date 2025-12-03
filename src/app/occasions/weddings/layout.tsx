import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Party Accommodation | Guest Houses for Wedding Groups UK",
  description: "Exclusive-use houses for wedding parties and guests. Sleep entire wedding groups together with space for getting ready, celebrations and post-wedding brunches.",
  keywords: ["wedding accommodation UK", "wedding party houses", "exclusive use wedding venues", "wedding guest accommodation"],
  openGraph: {
    title: "Wedding Party Accommodation | Group Escape Houses",
    description: "Exclusive houses for wedding parties and guests. Getting ready space, celebrations and brunches.",
    url: "https://groupescapehouses.co.uk/occasions/weddings",
  },
};

export default function WeddingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





