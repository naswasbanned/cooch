"use client";

import { m } from "motion/react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { MOTION_EASE } from "./motion/Reveal";

export function PlayerRow({
  index,
  name,
  placeholder,
  label,
  onChange,
  onRemove,
  canRemove,
  removeLabel,
}: {
  index: number;
  name: string;
  placeholder: string;
  label: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  removeLabel: string;
}) {
  return (
    <m.div
      className="player-row"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: MOTION_EASE }}
    >
      <span className="player-row__num" aria-hidden="true">
        {index}
      </span>
      <input
        className="input"
        type="text"
        value={name}
        placeholder={placeholder}
        aria-label={label}
        maxLength={18}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        round
        aria-label={removeLabel}
        disabled={!canRemove}
        onClick={onRemove}
      >
        <Icon name="i-close" />
      </Button>
    </m.div>
  );
}
