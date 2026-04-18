"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IoArrowDownCircleOutline,
  IoBusinessOutline,
  IoCashOutline,
  IoPeopleOutline,
  IoPhonePortraitOutline,
  IoReaderOutline,
  IoStorefrontOutline,
  IoSwapHorizontalOutline,
  IoTrainOutline,
  IoWalletOutline,
} from "react-icons/io5";

import {
  ActionGrid,
  BalanceCard,
  Button,
  Card,
  ChallengeCard,
  LevelsCarousel,
  PopupModal,
  RaspaYGanaModal,
  ScanButton,
  ScreenHeader,
  WelcomeAdPopup,
} from "@/components/yapass";
import type { ActionTileProps, Level } from "@/components/yapass";
import { useOnceFlag } from "@/hooks/use-once-flag";

/**
 * Home screen — matches the Figma "Home" frame (balance card,
 * YaPass levels, action grid, scan CTA).
 *
 * On the user's very first session the "ad" frame is shown as a
 * welcome popup (persisted via localStorage so it only appears once).
 * The bell icon reopens the "pop up" frame (new daily challenge).
 */
export default function HomeScreen() {
  const router = useRouter();
  const [showWelcome, markWelcomeSeen] = useOnceFlag("yapass.welcome.seen");
  const [showChallenge, setShowChallenge] = useState(false);
  const [showRaspa, setShowRaspa] = useState(false);

  const actions: ActionTileProps[] = [
    { icon: IoSwapHorizontalOutline, label: "Transferir" },
    { icon: IoBusinessOutline, label: "Transferir a otro banco", badge: "+" },
    { icon: IoWalletOutline, label: "Recargar" },
    { icon: IoCashOutline, label: "Cobrar" },
    { icon: IoArrowDownCircleOutline, label: "Retirar" },
    { icon: IoPhonePortraitOutline, label: "Recarga celular" },
    { icon: IoReaderOutline, label: "Pagar servicios" },
    { icon: IoTrainOutline, label: "Metro de Quito" },
    { icon: IoPeopleOutline, label: "Deuna Jóvenes" },
    { icon: IoStorefrontOutline, label: "Tienda Deuna" },
  ];

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
    <div className="flex flex-col pt-[max(env(safe-area-inset-top),0.5rem)]">
      <ScreenHeader
        name="Samira"
        initials="SA"
        onBellPress={() => setShowChallenge(true)}
        onHelpPress={() => {}}
      />

      <div className="flex flex-col gap-4 px-4 pt-3 pb-8">
        <BalanceCard
          amount={0.02}
          spentLast30Days={2.25}
          onPressRecharge={() => {}}
          onPressDetail={() => {}}
        />

        <Card variant="elevated" padding="lg" className="flex flex-col gap-3">
          <LevelsCarousel
            title="YaPass"
            levels={levels}
            currentLabel="Nivel 2"
            progress={0.55}
          />
          <Button
            label="Ver Misiones"
            variant="primary"
            size="md"
            onClick={() => router.push("/beneficios")}
            fullWidth={false}
            className="self-center"
          />
        </Card>

        <ActionGrid items={actions} />

        <ScanButton onPress={() => {}} />
      </div>

      <WelcomeAdPopup
        visible={showWelcome === true}
        onClose={() => markWelcomeSeen()}
        onCta={() => {
          markWelcomeSeen();
          router.push("/beneficios");
        }}
      />

      <RaspaYGanaModal
        visible={showRaspa}
        onClose={() => setShowRaspa(false)}
        sponsor={{ name: "Netlife" }}
        prize={{ amount: "$1.50", label: "Cashback Netlife", emoji: "🎉" }}
        onClaim={() => {}}
      />

      <PopupModal
        visible={showChallenge}
        title="Nuevo Desafío!"
        description={'"¡Hay un nuevo desafío de compra!"'}
        onClose={() => setShowChallenge(false)}
      >
        <div className="flex flex-col gap-3">
          <ChallengeCard
            title=""
            description="Compra 10 dólares en tu tiendita"
            progress={3}
            total={10}
            emoji="🏪"
          />
          <Button
            label="Nuevo Desafío!"
            onClick={() => {
              setShowChallenge(false);
              router.push("/beneficios");
            }}
            size="lg"
          />
        </div>
      </PopupModal>
    </div>
  );
}
