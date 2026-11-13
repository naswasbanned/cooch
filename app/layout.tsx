import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { DesktopStage } from "@/components/DesktopStage";
import { IconSprite } from "@/components/IconSprite";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ServiceWorkerRegister } from "@/components/Pwa";
import { FavoritesProvider } from "@/lib/favorites";
import { HistoryProvider } from "@/lib/history";
import { SettingsProvider } from "@/lib/settings";
import { ToastProvider } from "@/lib/toast";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cooch - Main bareng, cukup satu HP",
    template: "%s - Cooch",
  },
  description:
    "Platform game party satu perangkat. Tanpa login, tanpa install. Guess the Impostor dan Werewolf bisa dimainkan sekarang.",
  applicationName: "Cooch",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Cooch",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Cooch - Main bareng, cukup satu HP",
    description: "Game party satu perangkat. Tanpa akun, tanpa install.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f0f8ff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <SettingsProvider>
          <MotionProvider>
            <FavoritesProvider>
              <HistoryProvider>
                <ToastProvider>
                  <IconSprite />
                  <DesktopStage>
                    {children}
                    <ServiceWorkerRegister />
                  </DesktopStage>
                </ToastProvider>
              </HistoryProvider>
            </FavoritesProvider>
          </MotionProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
