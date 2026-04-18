"use client";

import { useState } from "react";

import {
  AdBanner,
  Button,
  ChallengeCard,
  LevelsCarousel,
  MapModal,
  Mascot,
  RaspaYGanaModal,
  ScreenHeader,
  type Level,
  type MapLocal,
} from "@/components/yapass";

/**
 * "Barrio" fallback — used when the user denies / revokes geolocation.
 * Coordinates point to La Floresta, Quito, to match the original product spec.
 */
const FALLBACK_CENTER = { lat: -0.1696, lng: -78.476 };

const LOCALES: MapLocal[] = [
  { id: "1", title: "Tienda Doña Rosa", desc: "Abarrotes y más", lat: -0.1692, lng: -78.4755 },
  { id: "2", title: "Panadería La Floresta", desc: "Pan fresco cada día", lat: -0.17, lng: -78.477 },
  { id: "3", title: "Farmacia del Barrio", desc: "Salud cerca de ti", lat: -0.1688, lng: -78.4765 },
];

/** YAPASS screen — matches the Figma "YAPASS" frame. */
export default function BeneficiosScreen() {
  const [showRaspa, setShowRaspa] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const levels: Level[] = [
    { id: "1", amount: "$0.20", label: "Cashback", name: "Nivel 1", variant: "completed" },
    { id: "2", amount: "$0.50", label: "Cashback", name: "Nivel 2", variant: "active" },
    { id: "3", amount: "$0.70", label: "Cashback", name: "Nivel 3" },
    { id: "4", amount: "$1", label: "Cashback", name: "Nivel 4" },
    {
      id: "5",
      kind: "sponsored",
      name: "Nivel 5",
      sponsor: { name: "Netlife" },
      cta: "Raspa y Gana!",
      onCtaClick: () => setShowRaspa(true),
    },
  ];

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col pt-[max(env(safe-area-inset-top),0.5rem)]">
      <ScreenHeader
        name="Samira"
        initials="SA"
        location="Barrio La Floresta"
        onBellPress={() => {}}
        onHelpPress={() => {}}
      />

      <div className="flex flex-col gap-4 px-4 pt-3 pb-32">
        <AdBanner
          title="YaPass,"
          description={"gana recompensas\ncomprando en tu barrio."}
          ctaLabel="Ver beneficios"
          onPressCta={() => {}}
          mascot={<Mascot size={110} />}
        />

        <LevelsCarousel
          title="YaPass"
          levels={levels}
          currentLabel="Nivel 2"
          progress={0.55}
        />

        <ChallengeCard
          description="Consume en el establecimiento de PoliBurguers"
          progress={0}
          total={1}
          emoji="🍔"
        />
      </div>

      <div className="pointer-events-none fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <div className="pointer-events-auto mb-20">
          <Button label="Ver Locales" size="lg" onClick={() => setShowMap(true)} />
        </div>
      </div>

      <RaspaYGanaModal
        visible={showRaspa}
        onClose={() => setShowRaspa(false)}
        sponsor={{ name: "Netlife" }}
        prize={{ amount: "$1.50", label: "Cashback Netlife", emoji: "🎉" }}
        onClaim={() => {}}
      />

      <MapModal
        visible={showMap}
        onClose={() => setShowMap(false)}
        locales={LOCALES}
        fallbackCenter={FALLBACK_CENTER}
        onSelectLocal={() => {}}
      />
    </div>
  );
}
