"use client";

import { notFound, useParams } from "next/navigation";
import { ImpostorSetup } from "@/components/setup/ImpostorSetup";
import { WerewolfSetup } from "@/components/setup/WerewolfSetup";

export default function SetupPage() {
  const params = useParams<{ slug: string }>();
  if (params.slug === "impostor") return <ImpostorSetup />;
  if (params.slug === "werewolf") return <WerewolfSetup />;
  notFound();
}
