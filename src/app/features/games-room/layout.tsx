import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Houses with Games Rooms | Pool Tables & Entertainment Spaces",
  description: "Properties with dedicated games rooms featuring pool tables, table tennis, darts and board games. Perfect entertainment for rainy days and competitive hen party fun.",
  keywords: ["houses with games rooms UK", "party houses with pool tables", "entertainment rooms", "group houses with games"],
  openGraph: {
    title: "Houses with Games Rooms & Entertainment | Group Escape Houses",
    description: "Pool tables, table tennis and entertainment facilities. Perfect for competitive hen party fun.",
    url: "https://groupescapehouses.co.uk/features/games-room",
  },
};

export default function GamesRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}