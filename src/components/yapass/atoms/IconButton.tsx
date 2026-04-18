"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type IconButtonSize = "sm" | "md" | "lg";
export type IconButtonVariant = "ghost" | "soft" | "solid";

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** Accessible label — always required for icon-only controls. */
  "aria-label": string;
  icon: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

const sizeMap: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};

const variantMap: Record<IconButtonVariant, string> = {
  ghost: "bg-transparent text-ink hover:bg-surface-alt",
  soft: "bg-primary-soft text-primary hover:brightness-95",
  solid: "bg-primary text-white hover:brightness-110",
};

/**
 * Atom — a square, icon-only pressable (header bells, modal close, etc).
 * Enforces an `aria-label` at the type level so every usage stays accessible.
 */
export function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-full",
        "transition-opacity active:opacity-60 disabled:cursor-not-allowed disabled:opacity-40",
        sizeMap[size],
        variantMap[variant],
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}
