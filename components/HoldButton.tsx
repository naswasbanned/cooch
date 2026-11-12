"use client";

import { m } from "motion/react";
import { useCallback, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonClass } from "./Button";
import { useMotionReduced } from "./motion/Reveal";

interface HoldButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | "onClick"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  > {
  onConfirm: () => void;
  children: ReactNode;
  holdMs?: number;
  block?: boolean;
}

/**
 * Hold-to-confirm button. Mirrors the 500 ms hold from the design so a handoff
 * button cannot open while the phone is changing hands.
 */
export function HoldButton({
  onConfirm,
  children,
  className,
  holdMs = 500,
  block = true,
  disabled,
  ...props
}: HoldButtonProps) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<number | null>(null);
  const fired = useRef(false);
  const reduceMotion = useMotionReduced();

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (disabled || timer.current !== null) return;
    fired.current = false;
    setHolding(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      fired.current = true;
      setHolding(false);
      onConfirm();
    }, holdMs);
  }, [disabled, holdMs, onConfirm]);

  const cancel = useCallback(() => {
    clear();
    setHolding(false);
  }, [clear]);

  return (
    <m.button
      type="button"
      className={cn(buttonClass({ size: "lg", block }), "btn--hold", className)}
      data-holding={holding ? "true" : "false"}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      draggable={false}
      initial={false}
      animate={{ scale: holding && !reduceMotion ? 0.985 : 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      onDragStartCapture={(event) => event.preventDefault()}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        start();
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(event) => {
        if (event.key !== " " && event.key !== "Enter") return;
        event.preventDefault();
        if (!event.repeat) start();
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") cancel();
      }}
      onBlur={cancel}
      onClick={(event) => event.preventDefault()}
      {...props}
    >
      {children}
    </m.button>
  );
}
