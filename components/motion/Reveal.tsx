"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings";

export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * True when the app setting or the OS asks for less motion. MotionConfig
 * already skips transform animations, but gesture effects (whileHover/whileTap)
 * still need to be switched off explicitly.
 */
export function useMotionReduced() {
  const osReduced = useReducedMotion();
  const { settings } = useSettings();
  return Boolean(osReduced) || settings.reduceMotion;
}

/**
 * Fade-and-rise on first view. Used for sections and list items so long pages
 * feel assembled rather than dumped in one paint.
 *
 * `as` lets a section keep its own element and CSS instead of gaining a wrapper
 * div, which matters for flex/grid parents.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  as = "div",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article";
  id?: string;
  labelledBy?: string;
}) {
  const Tag = as === "section" ? m.section : as === "article" ? m.article : m.div;

  return (
    <Tag
      id={id}
      className={cn(className)}
      aria-labelledby={labelledBy}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.45, delay, ease: MOTION_EASE }}
    >
      {children}
    </Tag>
  );
}

/** Staggered delay for items rendered in a map. Keeps long lists calm. */
export function itemDelay(index: number, step = 0.045, max = 0.36) {
  return Math.min(index * step, max);
}
