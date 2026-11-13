"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "motion/react";
import { useSettings } from "@/lib/settings";
import { Icon } from "./Icon";

const ITEMS = [
  { href: "/", key: "navHome" as const, icon: "i-home" },
  { href: "/games", key: "navBrowse" as const, icon: "i-search" },
  { href: "/settings", key: "navSettingsShort" as const, icon: "i-settings" },
];

export function Tabbar() {
  const pathname = usePathname();
  const { t } = useSettings();

  // The tab bar is global now; these are the routes that opted into it.
  const show =
    pathname === "/" ||
    pathname === "/games" ||
    pathname === "/settings" ||
    pathname === "/word-bank";
  if (!show) return null;

  return (
    <nav className="tabbar" aria-label={t("bottomNav")}>
      {ITEMS.map((item) => {
        const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            className="tabbar__item"
            href={item.href}
            key={item.href}
            aria-current={current ? "page" : undefined}
          >
            <m.span
              className="tabbar__icon"
              animate={{ y: current ? -2 : 0, scale: current ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <Icon name={item.icon} />
            </m.span>
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
