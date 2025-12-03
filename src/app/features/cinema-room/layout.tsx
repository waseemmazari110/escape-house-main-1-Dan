import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses with Cinema Rooms | Private Screening Spaces for Groups",
  description: "Luxury party houses featuring private cinema rooms with big screens, surround sound and comfy seating. Perfect for movie nights and chilled hen party evenings.",
  keywords: ["houses with cinema rooms UK", "party houses with movie room", "private screening rooms", "home cinema group accommodation"],
  openGraph: {
    title: "Party Houses with Cinema Rooms | Group Escape Houses",
    description: "Private screening rooms with big screens and surround sound. Perfect for movie night relaxation.",
    url: "https://groupescapehouses.co.uk/features/cinema-room",
  },
};

export default function CinemaRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





