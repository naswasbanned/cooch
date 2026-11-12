"use client";

import { CatalogBrowser } from "@/components/CatalogBrowser";
import { Reveal } from "@/components/motion/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { useSettings } from "@/lib/settings";

export default function GamesPage() {
  const { t } = useSettings();
  return (
    <SiteShell>
      <main className="container page" id="main">
        <Reveal className="page-header">
          <h1 className="page-header__title">{t("browseTitle")}</h1>
          <p className="page-header__text">{t("browseSubtitle")}</p>
        </Reveal>
        <Reveal>
          <CatalogBrowser variant="browse" />
        </Reveal>
      </main>
    </SiteShell>
  );
}
