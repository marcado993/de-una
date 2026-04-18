"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { SpinnerRing } from "./SpinnerRing";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

const variantMap: Record<Variant, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-primary-soft text-primary",
  ghost: "bg-transparent text-primary",
  outline: "bg-transparent text-primary border-[1.5px] border-primary",
};

const sizeMap: Record<Size, string> = {
  sm: "py-2 px-4 text-sm rounded-[var(--radius-md)]",
  md: "py-3 px-5 text-base rounded-[var(--radius-md)]",
  lg: "py-4 px-6 text-base rounded-[var(--radius-lg)]",
};

/**
 * Atom — the primary CTA button across the app.
 * Loading state swaps the label+icons for a `SpinnerRing`.
 */
export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold leading-5 transition-opacity",
        "active:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed",
        "cursor-pointer select-none",
        variantMap[variant],
        sizeMap[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <SpinnerRing size={size === "lg" ? "md" : "sm"} />
      ) : (
        <>
          {leftIcon ? <span className="inline-flex items-center">{leftIcon}</span> : null}
          <span>{label}</span>
          {rightIcon ? <span className="inline-flex items-center">{rightIcon}</span> : null}
        </>
      )}
    </button>
  );
}
