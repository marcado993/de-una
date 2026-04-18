"use client";

import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

import { cn } from "@/lib/cn";
import { Button } from "../atoms/Button";
import { IconButton } from "../atoms/IconButton";
import { Mascot } from "../atoms/Mascot";

export type AdBannerProps = {
  title: string;
  description: string;
  ctaLabel: string;
  onPressCta?: () => void;
  onDismiss?: () => void;
  mascot?: ReactNode;
  className?: string;
};

/**
 * Organism — lavender promo banner used inside screens.
 * Composes the `Mascot`, `IconButton` (dismiss) and `Button` atoms.
 */
export function AdBanner({
  title,
  description,
  ctaLabel,
  onPressCta,
  onDismiss,
  mascot,
  className,
}: AdBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-primary-softer p-4",
        className,
      )}
    >
      {onDismiss ? (
        <IconButton
          aria-label="Cerrar"
          onClick={onDismiss}
          size="sm"
          className="absolute right-3 top-3 z-10"
          icon={<IoClose className="h-5 w-5 text-ink" />}
        />
      ) : null}
      <div className="flex items-center gap-3 pr-4">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-xl font-extrabold leading-[26px] text-primary">{title}</span>
          <span className="whitespace-pre-line text-sm leading-5 text-ink">{description}</span>
        </div>
        <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center">
          {mascot ?? <Mascot size={120} />}
        </div>
      </div>
      <Button label={ctaLabel} onClick={onPressCta} size="lg" className="mt-3" />
    </div>
  );
}
