"use client";

import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings";
import { Icon } from "./Icon";
import { useMotionReduced } from "./motion/Reveal";

interface RevealCardProps {
  playerName: string;
  roleLabel: string;
  secret: string;
  note: string;
  variant?: "default" | "impostor";
  hint: string;
  onRevealed?: () => void;
}

/**
 * Hold-or-tap secret card. The face is in the DOM but CSS hides it until
 * aria-pressed is true, matching the design's leak-prevention pattern.
 */
export function RevealCard({
  playerName,
  roleLabel,
  secret,
  note,
  variant = "default",
  hint,
  onRevealed,
}: RevealCardProps) {
  const [open, setOpen] = useState(false);
  const holding = useRef(false);
  const timer = useRef<number | null>(null);
  const revealed = useRef(false);
  const { t } = useSettings();
  const reduceMotion = useMotionReduced();

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const markRevealed = () => {
    if (!revealed.current) {
      revealed.current = true;
      onRevealed?.();
    }
  };

  const openCard = () => {
    setOpen(true);
    markRevealed();
    if (timer.current !== null) window.clearTimeout(timer.current);
    // A tapped (not held) card closes itself after the token delay.
    if (!holding.current) {
      timer.current = window.setTimeout(() => setOpen(false), 15000);
    }
  };

  const closeCard = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    setOpen(false);
  };

  return (
    <div className="reveal">
      <h2 className="reveal__player">
        {t("cardOf")} <strong>{playerName}</strong>
      </h2>
      <m.button
        className={cn("reveal-card", variant === "impostor" && "reveal-card--impostor")}
        type="button"
        aria-pressed={open}
        aria-label={hint}
        draggable={false}
        initial={false}
        animate={
          reduceMotion
            ? { scale: 1, rotate: 0 }
            : { scale: open ? 1.02 : 1, rotate: open ? -2 : 0 }
        }
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        onDragStartCapture={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          holding.current = true;
          event.currentTarget.setPointerCapture?.(event.pointerId);
          openCard();
        }}
        onPointerUp={() => {
          if (!holding.current) return;
          holding.current = false;
          closeCard();
        }}
        onPointerLeave={() => {
          if (!holding.current) return;
          holding.current = false;
          closeCard();
        }}
        onPointerCancel={() => {
          holding.current = false;
          closeCard();
        }}
        onKeyDown={(event) => {
          if (event.key !== " " && event.key !== "Enter") return;
          event.preventDefault();
          if (open) closeCard();
          else openCard();
        }}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span className="reveal-card__cover">
          <Icon name="i-eye-off" />
          <span className="reveal-card__cover-text">{hint}</span>
        </span>
        <span className="reveal-card__face">
          <span className="reveal-card__role">{roleLabel}</span>
          <span className="reveal-card__secret">{secret}</span>
          <span className="reveal-card__note">{note}</span>
        </span>
      </m.button>
      <p className="reveal__hint">{t("revealHint")}</p>
    </div>
  );
}
