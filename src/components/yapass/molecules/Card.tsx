import { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Variant = "surface" | "soft" | "elevated" | "flat";
type Padding = 0 | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  padding?: Padding;
};

const paddingMap: Record<Exclude<Padding, 0>, string> = {
  xs: "p-1",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
  xl: "p-5",
  xxl: "p-6",
  xxxl: "p-8",
};

const variantMap: Record<Variant, string> = {
  surface: "bg-surface border border-divider",
  soft: "bg-primary-soft",
  elevated: "bg-surface shadow-[var(--shadow-card)]",
  flat: "bg-surface-alt",
};

/**
 * Molecule — branded surface container used as the base for every
 * card-like section (balance, challenge, info, etc). Variants control
 * background/elevation; padding uses the spacing scale from tokens.
 */
export function Card({
  variant = "surface",
  padding = "lg",
  className,
  children,
  ...rest
}: CardProps) {
  const pad = padding === 0 ? "p-0" : paddingMap[padding];
  return (
    <div
      {...rest}
      className={cn("rounded-[var(--radius-lg)]", variantMap[variant], pad, className)}
    >
      {children}
    </div>
  );
}
