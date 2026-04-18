"use client";

import { Button } from "../atoms/Button";
import { Mascot } from "../atoms/Mascot";
import { PopupModal } from "./PopupModal";

export type WelcomeAdPopupProps = {
  visible: boolean;
  onClose: () => void;
  onCta: () => void;
  title?: string;
  description?: string;
  ctaLabel?: string;
};

/**
 * Organism — one-time welcome popup. Thin wrapper over `PopupModal`
 * that arranges the title/description next to the `Mascot` with a
 * primary CTA at the bottom.
 */
export function WelcomeAdPopup({
  visible,
  onClose,
  onCta,
  title = "Yapass,",
  description = "Gana recompensas\ncomprando en tu barrio.",
  ctaLabel = "Descubrir ahora",
}: WelcomeAdPopupProps) {
  return (
    <PopupModal visible={visible} title="" onClose={onClose} className="!gap-4">
      <div className="-mt-6 flex items-center gap-3 pr-4">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-2xl font-extrabold leading-[30px] text-primary">{title}</span>
          <span className="whitespace-pre-line text-sm leading-5 text-ink">{description}</span>
        </div>
        <Mascot size={140} className="shrink-0" />
      </div>
      <Button label={ctaLabel} size="lg" onClick={onCta} className="mt-1" />
    </PopupModal>
  );
}
