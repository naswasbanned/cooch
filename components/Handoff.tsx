"use client";

import { m } from "motion/react";
import { useSettings } from "@/lib/settings";
import { useMotionReduced } from "./motion/Reveal";
import { HoldButton } from "./HoldButton";
import { Icon } from "./Icon";

interface HandoffProps {
  name: string;
  eyebrow?: string;
  hint: string;
  buttonLabel: string;
  onContinue: () => void;
  icon?: string;
  holdHint?: string;
}

export function Handoff({
  name,
  eyebrow,
  hint,
  buttonLabel,
  onContinue,
  icon = "i-hand",
  holdHint,
}: HandoffProps) {
  const { t } = useSettings();
  const reduceMotion = useMotionReduced();
  return (
    <section className="screen">
      <div className="handover">
        <m.span
          className="handover__icon"
          initial={reduceMotion ? false : { scale: 0.82, opacity: 0 }}
          animate={
            reduceMotion
              ? { scale: 1, opacity: 1 }
              : { scale: 1, opacity: 1, y: [0, -5, 0] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  scale: { type: "spring", stiffness: 360, damping: 20 },
                  opacity: { duration: 0.3 },
                  y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
                }
          }
        >
          <Icon name={icon} />
        </m.span>
        <span className="handover__eyebrow">{eyebrow ?? t("passPhoneTo")}</span>
        <h2 className="handover__name">{name}</h2>
        <p className="field__hint">{hint}</p>
      </div>
      <div className="screen__foot">
        <HoldButton onConfirm={onContinue}>{buttonLabel}</HoldButton>
        <p className="screen__hint">{holdHint ?? t("holdHint")}</p>
      </div>
    </section>
  );
}
