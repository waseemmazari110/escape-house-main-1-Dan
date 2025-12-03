import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Year Party Houses | Celebrate NYE in Private Group Houses",
  description: "See in the New Year together in a luxury party house. Hot tubs, champagne and celebrations from £99pp. Available for New Year's Eve and full New Year week breaks.",
  keywords: ["New Year party houses UK", "NYE group accommodation", "New Year's Eve houses", "Hogmanay group houses"],
  openGraph: {
    title: "New Year's Eve Party Houses | Group Escape Houses",
    description: "Celebrate NYE in private houses. Hot tubs, celebrations and champagne from £99pp.",
    url: "https://groupescapehouses.co.uk/occasions/new-year",
  },
};

export default function NewYearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





