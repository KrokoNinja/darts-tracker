import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Games",
};

interface Game {
  name: string;
  description: string;
  href: string;
}

const games: Game[] = [
  {
    name: "Local 501",
    description:
      "Local 501 game, ideal if you want to play with friends at home.",
    href: "/games/local-501",
  },
];

export default function GamesPage() {
  return games.map((game: Game) => (
    <Link href={game.href}>
      <Card key={game.name}>
        <CardHeader>
          <CardTitle>{game.name}</CardTitle>
          <CardDescription>{game.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  ));
}
