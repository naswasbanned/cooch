import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

export function buttonClass({
  variant = "primary",
  size = "md",
  block,
  iconOnly,
  round,
  className,
}: {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  iconOnly?: boolean;
  round?: boolean;
  className?: string;
} = {}) {
  return cn(
    "btn",
    variant !== "primary" && `btn--${variant}`,
    size !== "md" && `btn--${size}`,
    block && "btn--block",
    iconOnly && "btn--icon",
    round && "btn--round",
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  iconOnly?: boolean;
  round?: boolean;
  icon?: string;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  block,
  iconOnly,
  round,
  icon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, block, iconOnly, round, className })}
      {...props}
    >
      {icon ? <Icon name={icon} /> : null}
      {children}
    </button>
  );
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  iconOnly?: boolean;
  round?: boolean;
  icon?: string;
  children?: ReactNode;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  block,
  iconOnly,
  round,
  icon,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <a className={buttonClass({ variant, size, block, iconOnly, round, className })} {...props}>
      {icon ? <Icon name={icon} /> : null}
      {children}
    </a>
  );
}
