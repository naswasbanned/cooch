"use client";

import { useSettings } from "@/lib/settings";

export function PlayLoading() {
  const { t } = useSettings();
  return (
    <div className="container play">
      <div className="screen__center play-loading">
        <div className="play-loading__card">
          <span className="handover__icon">
            <span aria-hidden="true">🎲</span>
          </span>
          <p className="screen__text">{t("loading")}</p>
        </div>
      </div>
    </div>
  );
}
