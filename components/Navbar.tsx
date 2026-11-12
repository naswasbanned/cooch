"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { MOTION_EASE, useMotionReduced } from "@/components/motion/Reveal";
import { useSettings } from "@/lib/settings";
import { Icon } from "./Icon";
import { LinkButton } from "./Button";

export function LangSwitch({ className }: { className?: string }) {
  const { settings, setLanguage, t } = useSettings();
  return (
    <fieldset className={`lang-switch ${className ?? ""}`.trim()}>
      <legend className="sr-only">{t("language")}</legend>
      {(["id", "en"] as const).map((lang) => (
        <label className="lang-switch__option" key={lang}>
          <input
            type="radio"
            name="lang-switch"
            value={lang}
            checked={settings.language === lang}
            onChange={() => setLanguage(lang)}
          />
          <span>{lang.toUpperCase()}</span>
        </label>
      ))}
    </fieldset>
  );
}

const NAV_ITEMS = [
  { href: "/", key: "navHome" as const },
  { href: "/games", key: "navBrowse" as const },
  { href: "/how-to", key: "navHowTo" as const },
  { href: "/history", key: "navHistory" as const },
];

export function Navbar() {
  const pathname = usePathname();
  const { t } = useSettings();
  const [open, setOpen] = useState(false);
  const reduceMotion = useMotionReduced();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="navbar">
      <div className="container">
        <nav className="navbar__inner" aria-label={t("mainNav")}>
          <Link className="navbar__brand" href="/">
            <span className="navbar__logo">
              <Icon name="i-dice" />
            </span>
            <span className="navbar__brand-text">Cooch</span>
          </Link>
          <div className="navbar__links">
            {NAV_ITEMS.map((item) => (
              <Link
                className="navbar__link"
                href={item.href}
                key={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
          <div className="navbar__actions">
            <LinkButton
              href="/games#cari"
              variant="ghost"
              iconOnly
              round
              className="hide-mobile"
              aria-label={t("searchGame")}
            >
              <Icon name="i-search" />
            </LinkButton>
            <LinkButton
              href="/settings"
              variant="ghost"
              iconOnly
              round
              className="hide-mobile"
              aria-label={t("settings")}
            >
              <Icon name="i-settings" />
            </LinkButton>
            <LangSwitch />
            <button
              className="btn btn--icon btn--round navbar__toggle"
              type="button"
              aria-controls="navbar-menu"
              aria-expanded={open}
              aria-label={t("menu")}
              onClick={() => setOpen((value) => !value)}
            >
              <m.span
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.2, ease: MOTION_EASE }}
              >
                <Icon name={open ? "i-close" : "i-menu"} />
              </m.span>
            </button>
          </div>
        </nav>
        <AnimatePresence initial={false}>
          {open ? (
            <m.div
              className="navbar__menu"
              id="navbar-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.26, ease: MOTION_EASE }}
              style={{ overflow: "hidden" }}
            >
              <div className="navbar__menu-inner">
                {[...NAV_ITEMS, { href: "/settings", key: "navSettings" as const }].map((item) => (
                  <Link
                    className="navbar__link"
                    href={item.href}
                    key={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
