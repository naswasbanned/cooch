"use client";

import Link from "next/link";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { useSettings } from "@/lib/settings";

export default function PrivacyPage() {
  const { t } = useSettings();
  return (
    <SiteShell tabbar={false}>
      <main className="container page" id="main">
        <Reveal className="page-header">
          <h1 className="page-header__title">{t("privacyTitle")}</h1>
          <p className="page-header__text">{t("privacySubtitle")}</p>
        </Reveal>

        <Reveal as="article" className="panel prose reading" y={12}>
          <h2>{t("privacyNoAccount")}</h2>
          <p>{t("privacyNoAccountText")}</p>

          <h2>{t("privacyLocal")}</h2>
          <p>{t("privacyLocalText")}</p>
          <ul>
            <li>{t("privacyBullet1")}</li>
            <li>{t("privacyBullet2")}</li>
          </ul>

          <h2>{t("privacyStats")}</h2>
          <p>{t("privacyStatsText")}</p>

          <h2 id="kontak">{t("privacyContact")}</h2>
          <p>
            {t("privacyContactText")}{" "}
            <a className="link" href="mailto:halo@cooch.example">
              halo@cooch.example
            </a>
            .
          </p>
          <p className="field__hint">{t("privacyDemoNote")}</p>

          <div className="cluster">
            <LinkButton href="/how-to" variant="ghost">
              {t("howToShort")}
            </LinkButton>
            <Link className="link" href="/settings">
              {t("settings")}
            </Link>
          </div>
        </Reveal>
      </main>
    </SiteShell>
  );
}
