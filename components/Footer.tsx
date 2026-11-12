"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings";

export function Footer({ noTabbar }: { noTabbar?: boolean }) {
  const { t } = useSettings();
  return (
    <footer className={noTabbar ? "footer footer--no-tabbar" : "footer"}>
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="footer__name">Cooch</span>
            <p className="footer__tagline">{t("tagline")}</p>
          </div>
          <nav aria-label={t("footerExplore")}>
            <h2 className="footer__title">{t("footerExplore")}</h2>
            <ul className="footer__links">
              <li>
                <Link className="footer__link" href="/games">
                  {t("allGames")}
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/how-to">
                  {t("footerHowTo")}
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/word-bank">
                  {t("wordBank")}
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/history">
                  {t("footerHistory")}
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label={t("footerHelp")}>
            <h2 className="footer__title">{t("footerHelp")}</h2>
            <ul className="footer__links">
              <li>
                <Link className="footer__link" href="/how-to#faq">
                  {t("footerFaq")}
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/privacy">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/privacy#kontak">
                  {t("footerContact")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer__bottom">
          <span>{t("footerData")}</span>
          <span>Cooch 2026</span>
        </div>
      </div>
    </footer>
  );
}
