import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ImpostorGame } from "@/components/play/ImpostorGame";
import { PlayLoading } from "@/components/play/PlayLoading";
import { WerewolfGame } from "@/components/play/WerewolfGame";
import { getGame } from "@/lib/games";

export function generateStaticParams() {
  return [{ slug: "impostor" }, { slug: "werewolf" }];
}

export default async function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game || game.status !== "live") notFound();

  return (
    <Suspense fallback={<PlayLoading />}>
      {slug === "impostor" ? <ImpostorGame /> : <WerewolfGame />}
    </Suspense>
  );
}
