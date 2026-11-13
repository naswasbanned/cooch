"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { PhoneScrollbar } from "@/components/PhoneScrollbar";
import { Tabbar } from "@/components/Tabbar";
import { useSettings } from "@/lib/settings";
import { ToastViewport, useToast } from "@/lib/toast";

/**
 * Cooch is a pass-and-play game, so the app keeps its phone-width layout on
 * every screen. On desktop the app sits inside a phone frame with a short
 * reminder to open it on a real phone.
 */
export function DesktopStage({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const screenRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const { t } = useSettings();
  const { showToast } = useToast();

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (screenRef.current) screenRef.current.scrollTop = 0;
  }, [pathname]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t("linkCopied"), "success");
    } catch {
      showToast(t("copyFailed"), "error");
    }
  };

  return (
    <div className="desktop-stage">
      <aside className="desktop-note" aria-labelledby="desktop-note-title">
        <span className="desktop-note__badge">
          <Icon name="i-phone" />
          {t("desktopBadge")}
        </span>
        <p className="desktop-note__short">{t("desktopShort")}</p>
        <h2 className="desktop-note__title" id="desktop-note-title">
          {t("desktopTitle")}
        </h2>
        <p className="desktop-note__body">{t("desktopBody")}</p>
        <div className="desktop-note__actions">
          <Button variant="secondary" size="sm" onClick={copyLink}>
            {t("copyLink")}
          </Button>
        </div>
        <p className="desktop-note__small">{t("desktopTry")}</p>
      </aside>

      <div className="phone-shell">
        <span className="phone-shell__speaker" aria-hidden="true" />
        <span className="phone-shell__camera" aria-hidden="true" />
        <div className="phone-screen" id="phone-screen" ref={screenRef}>
          {children}
        </div>
        <PhoneScrollbar targetRef={screenRef} resetKey={pathname} />
        <Tabbar />
        <ToastViewport />
      </div>
    </div>
  );
}
