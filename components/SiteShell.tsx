"use client";

import { m } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MOTION_EASE } from "@/components/motion/Reveal";
import { useSettings } from "@/lib/settings";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

/**
 * Page chrome shared by every non-play route. Play screens own their own
 * minimal shell so a secret card never sits under navigation.
 */
export function SiteShell({
  children,
  tabbar = true,
}: {
  children: ReactNode;
  tabbar?: boolean;
}) {
  const { t } = useSettings();
  const pathname = usePathname();

  return (
    <>
      <a className="skip-link btn btn--sm" href="#main">
        {t("skip")}
      </a>
      <Navbar />
      <m.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: MOTION_EASE }}
      >
        {children}
      </m.div>
      <Footer noTabbar={!tabbar} />
    </>
  );
}
