"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { Button } from "../atoms/Button";
import { ScratchCard } from "../atoms/ScratchCard";
import { SponsorBadge } from "../atoms/SponsorBadge";
import { PopupModal } from "./PopupModal";

export type RaspaPrize = {
  /** Headline amount: "$1.50", "10%", "Envío gratis"... */
  amount: string;
  /** Supporting label shown below the amount ("Cashback"). */
  label?: string;
  /** Optional emoji / unicode glyph rendered above the amount. */
  emoji?: string;
};

export type RaspaYGanaModalProps = {
  visible: boolean;
  onClose: () => void;
  /** Fires on CTA tap after the prize is revealed. Modal closes automatically afterwards. */
  onClaim?: (prize: RaspaPrize) => void;
  sponsor: { name: string; logoSrc?: string };
  prize: RaspaPrize;
  title?: string;
  subtitle?: string;
  /** Fraction (0→1) of the scratch surface required to trigger auto-reveal. */
  revealThreshold?: number;
};

type RaspaContentProps = Omit<RaspaYGanaModalProps, "visible">;

/** Internal body of the modal. Extracted so that `revealed` state lives
 *  inside a component that unmounts whenever `visible` flips to `false`
 *  (PopupModal returns `null` in that case). That gives us a guaranteed
 *  reset on every reopen without needing setState-in-effect. */
function RaspaContent({
  onClose,
  onClaim,
  sponsor,
  prize,
  title = "¡Raspa y Gana!",
  subtitle = "Desliza el dedo sobre la lámina para descubrir tu premio.",
  revealThreshold = 0.55,
}: RaspaContentProps) {
  const [revealed, setRevealed] = useState(false);

  const handleClaim = () => {
    if (!revealed) return;
    onClaim?.(prize);
    onClose();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3 px-5 pb-2 pt-6 text-center">
        <div className="w-[130px]">
          <SponsorBadge name={sponsor.name} logoSrc={sponsor.logoSrc} size="md" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-2xl font-extrabold leading-[28px] text-primary">
            {title}
          </span>
          <span className="mx-auto max-w-[280px] text-sm leading-5 text-ink/80">
            {subtitle}
          </span>
        </div>

        <div className="my-2">
          <ScratchCard
            width={280}
            height={160}
            threshold={revealThreshold}
            onReveal={() => setRevealed(true)}
            hintText="Rasca aquí ✨"
          >
            <div className="flex flex-col items-center gap-0.5">
              {prize.emoji ? (
                <span className="text-[34px] leading-none">{prize.emoji}</span>
              ) : null}
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                ¡Ganaste!
              </span>
              <span className="text-[36px] font-extrabold leading-none text-primary">
                {prize.amount}
              </span>
              {prize.label ? (
                <span className="mt-0.5 text-sm font-semibold text-ink">{prize.label}</span>
              ) : null}
            </div>
          </ScratchCard>
        </div>
      </div>

      <div className="px-5 pb-5">
        <Button
          label={revealed ? "Reclamar premio" : "Sigue raspando…"}
          variant={revealed ? "primary" : "secondary"}
          disabled={!revealed}
          onClick={handleClaim}
          size="lg"
        />
      </div>
    </>
  );
}

/**
 * Organism — "Raspa y Gana!" scratch-to-reveal modal.
 *
 * Composition:
 *   PopupModal
 *   └─ SponsorBadge         (who is sponsoring the prize)
 *   └─ Title + subtitle
 *   └─ ScratchCard          (hides the RaspaPrize until scratched)
 *   └─ Button               (disabled until revealed → "Reclamar premio")
 *
 * Each piece is swappable: replace `ScratchCard` with a `WheelOfFortune`
 * atom later and the rest of the modal keeps working unchanged.
 */
export function RaspaYGanaModal({ visible, onClose, ...rest }: RaspaYGanaModalProps) {
  return (
    <PopupModal
      visible={visible}
      title=""
      onClose={onClose}
      className={cn(
        "!gap-4 overflow-hidden !p-0",
        // Festive gradient backdrop reminiscent of a lottery ticket
        "bg-[radial-gradient(circle_at_20%_0%,#FFE3B8_0%,var(--color-primary-softer)_55%,#F4EAFE_100%)]",
      )}
    >
      <RaspaContent onClose={onClose} {...rest} />
    </PopupModal>
  );
}
