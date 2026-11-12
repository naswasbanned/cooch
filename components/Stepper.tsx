"use client";

import { m } from "motion/react";
import { Button } from "./Button";
import { Icon } from "./Icon";

export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
  decreaseLabel,
  increaseLabel,
  disabled,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="stepper" role="group" aria-labelledby={label}>
      <Button
        variant="ghost"
        iconOnly
        round
        aria-label={decreaseLabel}
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Icon name="i-minus" />
      </Button>
      <input
        className="stepper__value"
        type="number"
        min={min}
        max={max}
        value={value}
        aria-labelledby={label}
        inputMode="numeric"
        disabled={disabled}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next)));
        }}
      />
      <Button
        variant="ghost"
        iconOnly
        round
        aria-label={increaseLabel}
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Icon name="i-plus" />
      </Button>
    </div>
  );
}

export function ProgressDots({ total, done }: { total: number; done: number }) {
  return (
    <div className="progress" role="img" aria-label={`${done} / ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <m.span
          key={index}
          className={index < done ? "progress__dot progress__dot--done" : "progress__dot"}
          initial={false}
          animate={index < done ? { scale: [1, 1.28, 1], opacity: 1 } : { scale: 1, opacity: 0.45 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
