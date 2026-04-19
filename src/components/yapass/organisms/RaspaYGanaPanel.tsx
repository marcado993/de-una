"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";
import { IoArrowBack, IoGiftOutline, IoSettingsOutline } from "react-icons/io5";

import { cn } from "@/lib/cn";
import { Button } from "../atoms/Button";
import { IconButton } from "../atoms/IconButton";
import { ScratchCard } from "../atoms/ScratchCard";

export type RaspaYGanaPanelProps = {
  /** Closes the whole panel and goes back to the default Home layout. */
  onBack: () => void;
  /** Fires when the user reveals the 3 slots and presses "Reclamar premio". */
  onClaim?: () => void;
};

type Step = "intro" | "board";
type SlotId = "chance1" | "chance2" | "yapa";

const FEATURES = [
  {
    Icon: IoSettingsOutline,
    title: "Desbloquea recompensas",
    body: "Completa misiones, gana cashback y un Raspa y Gana mensual.",
  },
  {
    Icon: IoGiftOutline,
    title: "Gana premios",
    body: "Cada mes es una oportunidad de ganar premios increíbles.",
  },
  {
    Icon: PercentGlyph,
    title: "Obtén descuentos y boostea YaPass",
    body: "Completa misiones diarias, obtén descuentos en locales y avanza en YaPass anticipadamente.",
  },
];

function PercentGlyph({ className }: { className?: string }) {
  return (
    <span className={cn("text-[18px] font-extrabold leading-none", className)} aria-hidden="true">
      %
    </span>
  );
}

/**
 * Organism — in-place "Raspa y Gana" pestaña (NOT a modal).
 *
 * Mounted by the Home screen alongside `showMisiones` / `showLocales`.
 * It owns its own internal `step` state so the parent only needs to know
 * "open the raspa pestaña" / "close it".
 *
 *   step="intro"  → Figma frame "Raspa y Gana 1"   (welcome + features + Empezar)
 *   step="board"  → Figma frame "Raspa y Gana 2"   (purple board + 3 ScratchCards)
 *
 * The board is rendered entirely with JSX/CSS (purple frame, dotted "casino"
 * lights, internal slot frames, "d!" logo) instead of a screenshot, so the
 * 3 silver scratch zones are real `ScratchCard` atoms — the manito follows
 * the pointer just like in Raspa y Gana standalone.
 */
export function RaspaYGanaPanel({ onBack, onClaim }: RaspaYGanaPanelProps) {
  const [step, setStep] = useState<Step>("intro");
  const [revealed, setRevealed] = useState<Record<SlotId, boolean>>({
    chance1: false,
    chance2: false,
    yapa: false,
  });

  const allRevealed = revealed.chance1 && revealed.chance2 && revealed.yapa;

  // Back arrow goes step-by-step: from board back to intro, from intro out.
  const handleBack = () => {
    if (step === "board") {
      setStep("intro");
      return;
    }
    onBack();
  };

  return (
    <div
      key={`raspa-${step}`}
      className={cn(
        "flex flex-col pb-32 animate-[yp-expand-in_320ms_ease-out]",
        // Intro keeps the standard panel header (back + label).
        // Board has the techo flush with the top edge — no chrome above it.
        step === "intro" ? "gap-4 px-4 pt-3" : "gap-4 pt-0",
      )}
    >
      {step === "intro" ? (
        <>
          <div className="flex items-center gap-2">
            <IconButton
              aria-label="Volver"
              onClick={handleBack}
              size="sm"
              icon={<IoArrowBack className="h-5 w-5 text-ink" />}
            />
            <span className="text-sm font-semibold text-text-secondary">
              Raspa y Gana
            </span>
          </div>
          <RaspaIntroContent onEmpezar={() => setStep("board")} />
        </>
      ) : (
        <RaspaBoardContent
          revealed={revealed}
          onRevealSlot={(id) =>
            setRevealed((prev) => ({ ...prev, [id]: true }))
          }
          allRevealed={allRevealed}
          onFinish={() => {
            onClaim?.();
            onBack();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Intro ("Raspa y Gana 1")
// ─────────────────────────────────────────────────────────────────────────────

function RaspaIntroContent({ onEmpezar }: { onEmpezar: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Hero — Alpina co-brand banner: blue mountain backdrop with the
          DeUna mascot showing off a winning scratch ticket. */}
      <div className="relative h-[170px] w-full shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-gradient-to-b from-[#5BA3F0] to-[#2F77C9]">
        <Image
          src="/assets/raspa/hero-banner.png"
          alt=""
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover object-center"
          priority
        />
      </div>

      <h2 className="text-[24px] font-extrabold uppercase leading-[28px] text-primary">
        Raspa y Gana
      </h2>

      {/* Prizes row */}
      <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-white bg-white px-3 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
        <PrizeChip src="/assets/raspa/medal-1.png" label="$100" />
        <PrizeChip src="/assets/raspa/medal-2.png" label="1 mes gratis" />
        <PrizeChip src="/assets/raspa/medal-3.png" label="juego PS5" />
        <span className="ml-auto whitespace-pre text-[12px] leading-[14px] text-text-secondary">
          {"y\nmás"}
        </span>
      </div>

      {/* Features list */}
      <ul className="flex flex-col gap-3">
        {FEATURES.map(({ Icon, title, body }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold leading-4 text-ink">
                {title}
              </span>
              <span className="text-[12px] leading-[16px] text-text-secondary">
                {body}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="mt-2 flex flex-col gap-2">
        <p className="text-center text-[12px] leading-4 text-text-secondary">
          Al presionar "Empezar" aceptas los{" "}
          <span className="font-semibold text-primary underline underline-offset-2">
            Términos y condiciones
          </span>
        </p>
        <Button label="Empezar" onClick={onEmpezar} size="lg" />
      </div>
    </div>
  );
}

function PrizeChip({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex flex-1 items-center gap-1.5">
      <Image
        src={src}
        alt=""
        width={26}
        height={26}
        className="h-7 w-7 shrink-0 object-contain"
      />
      <span className="truncate text-[12px] font-medium leading-4 text-ink">
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Board ("Raspa y Gana 2")
// ─────────────────────────────────────────────────────────────────────────────

type RaspaBoardProps = {
  revealed: Record<SlotId, boolean>;
  onRevealSlot: (id: SlotId) => void;
  allRevealed: boolean;
  /** Fires automatically once the user finishes scratching all 3 slots
   *  (after a short delay so the prizes stay visible for a moment). */
  onFinish: () => void;
};

// Pixel sizes for the 3 silver scratch zones. Chosen so two Chance cards
// + a small gap fit on a single row inside the dotted purple frame, and so
// the Yapa card spans the full inner width.
const CHANCE_W = 132;
const CHANCE_H = 118;
const YAPA_W = CHANCE_W * 2 + 10; // = 274 (matches the row above + gap)
const YAPA_H = 84;

function RaspaBoardContent({
  revealed,
  onRevealSlot,
  allRevealed,
  onFinish,
}: RaspaBoardProps) {
  // Once every slot has been scratched, hold the prizes on screen for a
  // moment so the user gets to see them, then automatically return to the
  // previous view. This replaces the explicit "Reclamar premio" button.
  useEffect(() => {
    if (!allRevealed) return;
    const t = window.setTimeout(onFinish, 1800);
    return () => window.clearTimeout(t);
  }, [allRevealed, onFinish]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Techo — full-bleed scalloped roof. Rendered with its natural
          aspect ratio so the rounded fringes at the bottom are never
          clipped. Nothing is layered above or over it. */}
      <Image
        src="/assets/techo.png"
        alt=""
        width={575}
        height={134}
        sizes="(max-width: 480px) 100vw, 480px"
        className="block h-auto w-full select-none"
        priority
      />

      {/* The board — recreated entirely in CSS (no background screenshot) */}
      <div className="relative px-4 pt-6">
        {/* "d!" logo floating above the top edge */}
        <div className="absolute left-1/2 -top-1 z-20 -translate-x-1/2">
          <div
            className={cn(
              "flex h-[52px] w-[52px] items-center justify-center rounded-full",
              "bg-gradient-to-b from-[#8B4FCB] to-[#5A2A8E]",
              "shadow-[0_6px_14px_rgba(75,29,140,0.45),inset_0_-2px_4px_rgba(0,0,0,0.25)]",
              "ring-[3px] ring-[#eee8f8]",
            )}
          >
            <span className="text-[22px] font-black italic leading-none text-white">
              d!
            </span>
          </div>
        </div>

        {/* Purple frame with the dotted "casino lights" border.
            CSS `border-dotted` gives evenly-spaced round dots that match
            the Figma chrome without needing a background image. */}
        <div
          className={cn(
            "rounded-[26px] border-[5px] border-dotted border-[#A4EEE5] p-3",
            "bg-[radial-gradient(circle_at_50%_-10%,#7A4AAE_0%,#5A2A8E_45%,#3B1268_100%)]",
            "shadow-[0_14px_30px_rgba(75,29,140,0.35),inset_0_2px_8px_rgba(255,255,255,0.10)]",
          )}
        >
          <div className="flex flex-col items-center gap-2.5">
            {/* Row 1 — Chance 1 + Chance 2 */}
            <div className="flex items-stretch justify-center gap-2.5">
              <SlotCard label="Chance 1">
                <ScratchCard
                  width={CHANCE_W}
                  height={CHANCE_H}
                  threshold={0.5}
                  brushRadius={16}
                  hintText=""
                  className="!shadow-none"
                  onReveal={() => onRevealSlot("chance1")}
                >
                  <SlotPrize main="$1000" emoji="😎" winner />
                </ScratchCard>
              </SlotCard>

              <SlotCard label="Chance 2">
                <ScratchCard
                  width={CHANCE_W}
                  height={CHANCE_H}
                  threshold={0.5}
                  brushRadius={16}
                  hintText=""
                  className="!shadow-none"
                  onReveal={() => onRevealSlot("chance2")}
                >
                  <SlotPrize main="Sigue" sub="intentando" emoji="✨" />
                </ScratchCard>
              </SlotCard>
            </div>

            {/* Row 2 — Yapa (spans full width) */}
            <SlotCard label="Yapa">
              <ScratchCard
                width={YAPA_W}
                height={YAPA_H}
                threshold={0.5}
                brushRadius={16}
                hintText=""
                className="!shadow-none"
                onReveal={() => onRevealSlot("yapa")}
              >
                <SlotPrize main="yapa" emoji="🎁" />
              </ScratchCard>
            </SlotCard>
          </div>
        </div>
      </div>

      {/* Alpina sponsor logo (blue mountain oval). */}
      <Image
        src="/assets/alpina/logo.png"
        alt="Alpina"
        width={140}
        height={56}
        className="h-12 w-auto object-contain"
      />

      <div className="w-full px-4">
        <p className="text-center text-[12px] leading-5 text-text-secondary">
          {allRevealed
            ? "¡Felicidades! Tus premios se han registrado."
            : "Rasca los 3 cuadros para descubrir tu premio."}
        </p>
      </div>
    </div>
  );
}

/** A single slot inside the board: dark purple frame + white label on top
 *  + the silver `ScratchCard` sitting flush in the middle. */
function SlotCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-[14px] p-2",
        "bg-[linear-gradient(180deg,#3A1A6B_0%,#2A1052_100%)]",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),inset_0_-2px_4px_rgba(0,0,0,0.30)]",
      )}
    >
      <span className="text-[14px] font-bold leading-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
        {label}
      </span>
      <div className="overflow-hidden rounded-[10px] ring-1 ring-white/30">
        {children}
      </div>
    </div>
  );
}

function SlotPrize({
  main,
  sub,
  emoji,
  winner,
}: {
  main: string;
  sub?: string;
  emoji?: string;
  winner?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 leading-none">
      {emoji ? (
        <span
          className={cn(
            "text-[24px] leading-none",
            winner ? "drop-shadow-[0_2px_2px_rgba(255,200,0,0.45)]" : "",
          )}
          aria-hidden="true"
        >
          {emoji}
        </span>
      ) : null}
      <span
        className={cn(
          "font-extrabold text-primary",
          winner ? "text-[26px]" : "text-[18px]",
        )}
      >
        {main}
      </span>
      {sub ? (
        <span className="text-[13px] font-semibold text-primary/80">{sub}</span>
      ) : null}
    </div>
  );
}
