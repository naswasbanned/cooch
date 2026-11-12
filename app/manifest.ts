import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cooch - Main bareng, cukup satu HP",
    short_name: "Cooch",
    description:
      "Platform game party satu perangkat. Guess the Impostor dan Werewolf bisa dimainkan tanpa akun.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f0f8ff",
    theme_color: "#f0f8ff",
    lang: "id",
    categories: ["games", "entertainment"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
