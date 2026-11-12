import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type BadgeTone = "default" | "success" | "warning" | "error" | "info" | "accent" | "new";

export function Badge({
  children,
  tone = "default",
  icon,
  className,
}: {
  children?: ReactNode;
  tone?: BadgeTone;
  icon?: string;
  className?: string;
}) {
  return (
    <span className={cn("badge", tone !== "default" && `badge--${tone}`, className)}>
      {icon ? <Icon name={icon} /> : null}
      {children}
    </span>
  );
}

export function Chip({
  children,
  pressed,
  onClick,
  icon,
  value,
  className,
  disabled,
}: {
  children: ReactNode;
  pressed: boolean;
  onClick?: () => void;
  icon?: string;
  value?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={cn("chip", className)}
      type="button"
      aria-pressed={pressed}
      data-value={value}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? <Icon name={icon} /> : null}
      {children}
    </button>
  );
}

export function LabelTag({
  children,
  tone = "default",
  flat,
}: {
  children: ReactNode;
  tone?: "default" | "sky" | "grape";
  flat?: boolean;
}) {
  return (
    <span
      className={cn(
        "label-tag",
        tone === "sky" && "label-tag--sky",
        tone === "grape" && "label-tag--grape",
        flat && "label-tag--flat",
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({
  name,
  tone,
  size = "sm",
  ring,
  className,
}: {
  name: string;
  tone: string;
  size?: "sm" | "md" | "lg" | "xl";
  ring?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "avatar",
        size !== "md" && `avatar--${size}`,
        tone,
        ring && "avatar--ring",
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
