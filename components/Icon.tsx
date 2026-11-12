import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function Icon({ name, size, className, ...props }: IconProps) {
  return (
    <svg
      className={cn("icon", size === "sm" && "icon--sm", size === "lg" && "icon--lg", className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <use href={`#${name}`} />
    </svg>
  );
}
