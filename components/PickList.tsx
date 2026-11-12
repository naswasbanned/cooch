"use client";

import { m } from "motion/react";
import { avatarTone, cn } from "@/lib/utils";
import { Avatar } from "./Badge";
import { Icon } from "./Icon";
import { useMotionReduced } from "./motion/Reveal";

export interface PickPlayer {
  id: string;
  name: string;
  alive?: boolean;
  note?: string;
}

interface PickListProps {
  name: string;
  legend: string;
  players: PickPlayer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabledIds?: string[];
  noteFor?: (player: PickPlayer) => string | undefined;
}

export function PickList({
  name,
  legend,
  players,
  selectedId,
  onSelect,
  disabledIds = [],
  noteFor,
}: PickListProps) {
  const reduceMotion = useMotionReduced();
  return (
    <fieldset className="pick-list">
      <legend className="sr-only">{legend}</legend>
      {players.map((player) => {
        const disabled = disabledIds.includes(player.id);
        const note = noteFor?.(player) ?? player.note;
        return (
          <m.label
            key={player.id}
            className="pick"
            whileTap={disabled || reduceMotion ? undefined : { scale: 0.985 }}
            transition={{ duration: 0.12 }}
          >
            <input
              className="pick__input"
              type="radio"
              name={name}
              value={player.id}
              checked={selectedId === player.id}
              disabled={disabled}
              onChange={() => onSelect(player.id)}
            />
            <Avatar name={player.name} tone={avatarTone(player.name)} />
            <span className="pick__name">{player.name}</span>
            {note ? <span className="pick__note">{note}</span> : null}
            <span className="pick__mark" aria-hidden="true">
              <Icon name="i-check" />
            </span>
          </m.label>
        );
      })}
    </fieldset>
  );
}

export function RankList({
  rows,
  className,
}: {
  rows: Array<{
    id: string;
    name: string;
    position?: string | number;
    badge?: string;
    badgeTone?: "accent" | "success" | "error" | "info";
    me?: boolean;
    out?: boolean;
    role?: string;
  }>;
  className?: string;
}) {
  return (
    <ol className={cn("rank-list", className)}>
      {rows.map((row) => (
        <li
          key={row.id}
          className={cn("rank-row", row.me && "rank-row--me", row.out && "rank-row--out")}
        >
          <span className="rank-row__pos">{row.position ?? ""}</span>
          <Avatar name={row.name} tone={avatarTone(row.name)} />
          <span className="rank-row__name">{row.name}</span>
          {row.badge ? (
            <span className={cn("badge", row.badgeTone && `badge--${row.badgeTone}`)}>
              {row.badge}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
