"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/lib/settings";
import { useToast } from "@/lib/toast";
import { Icon } from "./Icon";

/**
 * Service worker registration. The demo works offline after the first visit;
 * game data lives in localStorage, so the shell is all the SW needs to cache.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is an enhancement; never block the app on it.
    });
  }, []);
  return null;
}

export function OfflineBadge() {
  const { t } = useSettings();
  const { showToast } = useToast();
  const [online, setOnline] = useState(true);
  const wasOffline = useRef(false);

  useEffect(() => {
    const sync = () => {
      setOnline(navigator.onLine);
      if (!navigator.onLine) {
        wasOffline.current = true;
      } else if (wasOffline.current) {
        wasOffline.current = false;
        showToast(t("offlineReady"), "success");
      }
    };
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, [showToast, t]);

  if (online) return null;
  return (
    <Link className="alert" href="/how-to#faq" role="status">
      <Icon name="i-info" />
      <span className="alert__body">
        <span className="alert__title">{t("offlineReady")}</span>
      </span>
    </Link>
  );
}
