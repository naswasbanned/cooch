import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameDetail } from "@/components/GameDetail";
import { GAMES, getGame } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return { title: "404" };
  return {
    title: game.name.id,
    description: game.description.id,
  };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getGame(slug)) notFound();
  return <GameDetail slug={slug} />;
}
