"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { LinkButton } from "./Button";
import { MOTION_EASE } from "./motion/Reveal";

export function SectionHeading({
  title,
  subtitle,
  action,
  id,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  id?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-heading__text">
        <h2 className="section-heading__title" id={id}>
          {title}
        </h2>
        {subtitle ? <p className="section-heading__sub">{subtitle}</p> : null}
      </div>
      {action ? (
        <LinkButton href={action.href} variant="ghost" size="sm" className="link">
          {action.label}
          <Icon name="i-arrow-right" />
        </LinkButton>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon = "i-search",
  art,
  title,
  text,
  action,
  className,
}: {
  icon?: string;
  art?: string;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={cn("empty-state", className)}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: MOTION_EASE }}
    >
      {art ? (
        <m.img
          className="empty-state__art"
          src={art}
          alt=""
          aria-hidden="true"
          initial={{ scale: 0.9, rotate: -3, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.06 }}
        />
      ) : (
        <span className="empty-state__icon">
          <Icon name={icon} />
        </span>
      )}
      <h2 className="empty-state__title">{title}</h2>
      {text ? <p className="empty-state__text">{text}</p> : null}
      {action}
    </m.div>
  );
}
