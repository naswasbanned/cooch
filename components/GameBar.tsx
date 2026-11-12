"use client";

import { m } from "motion/react";
import { useSettings } from "@/lib/settings";
import { Button } from "./Button";

export function GameBar({
  gameName,
  phase,
  onPause,
  onRules,
}: {
  gameName: string;
  phase: string;
  onPause: () => void;
  onRules: () => void;
}) {
  const { t } = useSettings();
  return (
    <header className="game-bar">
      <div className="game-bar__inner">
        <Button variant="ghost" size="sm" icon="i-pause" onClick={onPause}>
          {t("pause")}
        </Button>
        <div className="game-bar__title">
          <h1 className="game-bar__game">{gameName}</h1>
          <m.span
            key={phase}
            className="game-bar__phase"
            aria-live="polite"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {phase}
          </m.span>
        </div>
        <Button variant="ghost" size="sm" icon="i-help" onClick={onRules}>
          {t("rules")}
        </Button>
      </div>
    </header>
  );
}
