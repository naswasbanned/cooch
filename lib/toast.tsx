"use client";

import { AnimatePresence, m } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { MOTION_EASE } from "@/components/motion/Reveal";

type ToastTone = "info" | "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, tone: ToastTone = "info") => {
    counter.current += 1;
    const id = counter.current;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * The toast stack lives outside the phone screen so it stays fixed above the
 * app while the screen scrolls. On mobile it is fixed to the viewport.
 */
export function ToastViewport() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("ToastViewport must be used inside ToastProvider");
  const { toasts } = context;

  return (
    <div className="toast-region" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <m.div
            key={toast.id}
            className={`toast toast--${toast.tone}`}
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.24, ease: MOTION_EASE }}
          >
            <Icon
              name={toast.tone === "success" ? "i-check-circle" : toast.tone === "error" ? "i-alert" : "i-info"}
              aria-hidden
            />
            <span className="toast__text">{toast.message}</span>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

/** Small helper used by screens that need a timeout that is cleared on unmount. */
export function useTimeout(callback: () => void, delay: number | null) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = window.setTimeout(() => saved.current(), delay);
    return () => window.clearTimeout(id);
  }, [delay]);
}
