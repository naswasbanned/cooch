"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";
import { useSettings } from "@/lib/settings";

/**
 * One Motion context for the whole app.
 *
 * `domAnimation` keeps the bundle small (no drag/layout features). The app's
 * own "reduce motion" setting wins over the OS preference; otherwise Motion
 * still respects `prefers-reduced-motion`.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion={settings.reduceMotion ? "always" : "user"}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
