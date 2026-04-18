"use client";

import { ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

import { cn } from "@/lib/cn";
import { IconButton } from "../atoms/IconButton";

export type PopupModalSize = "md" | "lg" | "full";

export type PopupModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onDismissBackdrop?: () => void;
  children?: ReactNode;
  className?: string;
  /**
   * Controls the modal card footprint:
   *   - `md`   (default): compact 420px, auto height — confirmations, alerts
   *   - `lg`:   480px wide, auto height — forms, rich popups
   *   - `full`: fills ~95vw × 92vh — immersive UIs (maps, scanners, media)
   */
  size?: PopupModalSize;
};

const sizeClassMap: Record<PopupModalSize, string> = {
  md: "max-w-[420px] p-5 gap-3",
  lg: "max-w-[480px] p-5 gap-3",
  full:
    "w-[min(100vw-16px,480px)] h-[min(100vh-16px,760px)] max-h-[92vh] p-0 gap-0",
};

/**
 * Organism — reusable modal dialog (backdrop + centered card + close).
 * Handles ESC and body scroll-lock internally. The `size` prop tunes
 * the card footprint so the same primitive powers everything from tiny
 * confirmations to fullscreen experiences like the map.
 */
export function PopupModal({
  visible,
  title,
  description,
  onClose,
  onDismissBackdrop,
  children,
  className,
  size = "md",
}: PopupModalProps) {
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || undefined}
      onClick={onDismissBackdrop ?? onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,13,25,0.45)] p-2 animate-[fadeIn_120ms_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full rounded-[var(--radius-lg)] bg-primary-softer shadow-[var(--shadow-elevated)]",
          "flex flex-col overflow-hidden",
          sizeClassMap[size],
          className,
        )}
      >
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          size="sm"
          className="absolute right-3 top-3 z-10 bg-white/70 backdrop-blur-sm"
          icon={<IoClose className="h-[22px] w-[22px] text-ink" />}
        />
        {title ? (
          <span className="text-xl font-extrabold leading-[26px] text-primary">
            {title}
          </span>
        ) : null}
        {description ? (
          <span className="whitespace-pre-line text-sm leading-5 text-ink">
            {description}
          </span>
        ) : null}
        {children}
      </div>
    </div>
  );
}
