"use client";

import { InputHTMLAttributes, ReactNode, useState } from "react";

import { cn } from "@/lib/cn";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  helper?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
};

/**
 * Atom — labeled text input with optional icons, helper and error states.
 * Focus/error visuals are handled internally so consumers can stay stateless.
 */
export function Input({
  label,
  helper,
  error,
  leftIcon,
  rightIcon,
  containerClassName,
  onFocus,
  onBlur,
  className,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderClass = error
    ? "border-danger"
    : focused
      ? "border-primary"
      : "border-line";

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      {label ? (
        <span className="ml-1 text-xs font-medium leading-4 text-text-secondary">{label}</span>
      ) : null}
      <div
        className={cn(
          "flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] border-[1.5px] bg-white px-4",
          borderClass,
        )}
      >
        {leftIcon ? <span className="inline-flex items-center">{leftIcon}</span> : null}
        <input
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "flex-1 bg-transparent py-3 text-sm leading-5 text-ink placeholder:text-text-muted outline-none",
            className,
          )}
        />
        {rightIcon ? <span className="inline-flex items-center">{rightIcon}</span> : null}
      </div>
      {error ? (
        <span className="ml-1 text-xs font-medium leading-4 text-danger">{error}</span>
      ) : helper ? (
        <span className="ml-1 text-xs font-medium leading-4 text-text-muted">{helper}</span>
      ) : null}
    </div>
  );
}
