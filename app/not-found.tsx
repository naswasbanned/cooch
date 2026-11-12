"use client";

import { LinkButton } from "@/components/Button";
import { ArtImage } from "@/components/ArtImage";
import { Reveal } from "@/components/motion/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { useSettings } from "@/lib/settings";

export default function NotFound() {
  const { t } = useSettings();
  return (
    <SiteShell tabbar={false}>
      <main className="container page" id="main">
        <Reveal as="section" className="notfound panel" labelledBy="nf-title" y={20}>
          <ArtImage className="notfound__art" src="/art/not-found.svg" alt="" aria-hidden="true" />
          <span className="notfound__code" aria-hidden="true">
            404
          </span>
          <h1 className="page-header__title" id="nf-title">
            {t("notFoundTitle")}
          </h1>
          <p className="panel__text">{t("notFoundText")}</p>
          <div className="cluster">
            <LinkButton href="/" size="lg" icon="i-home">
              {t("toHome")}
            </LinkButton>
            <LinkButton href="/games" size="lg" variant="ghost">
              {t("browse")}
            </LinkButton>
          </div>
        </Reveal>
      </main>
    </SiteShell>
  );
}
