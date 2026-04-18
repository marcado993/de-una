import { BalanceCard, Card, ScreenHeader } from "@/components/yapass";

export default function BilleteraScreen() {
  return (
    <div className="flex flex-col pt-[max(env(safe-area-inset-top),0.5rem)]">
      <ScreenHeader name="Samira" initials="SA" />
      <div className="flex flex-col gap-4 px-4 pt-3 pb-8">
        <BalanceCard amount={0.02} spentLast30Days={2.25} />
        <Card variant="elevated" padding="lg">
          <h2 className="text-title-sm">Tus movimientos</h2>
          <p className="text-body-sm mt-1">
            Aún no hay movimientos en este periodo.
          </p>
        </Card>
      </div>
    </div>
  );
}
