"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatClock } from "@/lib/utils";
import { useSettings } from "@/lib/settings";
import { Button } from "./Button";

interface TimerProps {
  seconds: number;
  onExpire?: () => void;
  allowAdjust?: boolean;
  onAdjust?: (delta: number) => void;
}

export function Timer({ seconds, onExpire, allowAdjust, onAdjust }: TimerProps) {
  const { settings, t } = useSettings();
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const expired = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setLeft(seconds);
    setRunning(false);
    expired.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((current) => {
        if (current <= 1) {
          window.clearInterval(id);
          setRunning(false);
          if (!expired.current) {
            expired.current = true;
            if (settings.vibration && "vibrate" in navigator) navigator.vibrate([120, 60, 120]);
            onExpireRef.current?.();
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, settings.vibration]);

  return (
    <div className={cn("timer", left <= 10 && left > 0 && "timer--urgent")}>
      <span className="timer__label">{t("timeLeft")}</span>
      <span className="timer__value" aria-live="off">
        {formatClock(left)}
      </span>
      <div className="cluster">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            if (left === 0) {
              setLeft(seconds);
              expired.current = false;
            }
            setRunning((value) => !value);
          }}
        >
          {running ? t("pause") : left === 0 ? t("reset") : t("start")}
        </Button>
        {allowAdjust ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              iconOnly
              round
              aria-label={t("minusMinute")}
              onClick={() => {
                onAdjust?.(-60);
                setLeft((value) => Math.max(0, value - 60));
              }}
            >
              −
            </Button>
            <Button
              size="sm"
              variant="ghost"
              iconOnly
              round
              aria-label={t("plusMinute")}
              onClick={() => {
                onAdjust?.(60);
                setLeft((value) => value + 60);
              }}
            >
              +
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
