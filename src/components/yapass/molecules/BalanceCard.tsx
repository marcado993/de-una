"use client";

import { useState } from "react";
import {
  IoChevronForward,
  IoEyeOffOutline,
  IoEyeOutline,
  IoSparklesOutline,
} from "react-icons/io5";

import { AmountText } from "../atoms/AmountText";
import { Divider } from "../atoms/Divider";
import { IconButton } from "../atoms/IconButton";
import { Card } from "./Card";

export type BalanceCardProps = {
  amount: number;
  spentLast30Days?: number;
  accountLabel?: string;
  onPressRecharge?: () => void;
  onPressDetail?: () => void;
  rechargeAmount?: number;
};

/**
 * Molecule — user balance summary card. Composes:
 *   · `Card` (surface)
 *   · `AmountText` (the "$0.02" figure with visible/masked support)
 *   · `IconButton` (toggle visibility)
 *   · `Divider` (hairline before the recharge row)
 */
export function BalanceCard({
  amount,
  spentLast30Days = 0,
  accountLabel = "Principal ******9440",
  onPressRecharge,
  onPressDetail,
  rechargeAmount = 20,
}: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  return (
    <Card variant="elevated" padding="lg" className="flex flex-col gap-3">
      <span className="text-body-sm">Saldo disponible</span>

      <button
        type="button"
        onClick={onPressDetail}
        className="flex items-center gap-3 text-left active:opacity-70 cursor-pointer"
      >
        <AmountText value={amount} visible={visible} size="xl" />
        <IconButton
          aria-label={visible ? "Ocultar saldo" : "Mostrar saldo"}
          onClick={(e) => {
            e.stopPropagation();
            setVisible((v) => !v);
          }}
          size="sm"
          icon={
            visible ? (
              <IoEyeOutline className="h-[22px] w-[22px] text-ink" />
            ) : (
              <IoEyeOffOutline className="h-[22px] w-[22px] text-ink" />
            )
          }
        />
        <span className="flex-1" />
        <IoChevronForward className="h-[22px] w-[22px] text-text-secondary" />
      </button>

      <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-primary-softer px-3 py-2">
        <IoSparklesOutline className="h-4 w-4 shrink-0 text-primary" />
        <span className="shrink text-body">
          Gastaste{" "}
          <span className="font-semibold text-primary underline">
            $ {spentLast30Days.toFixed(2)} los últimos 30 días
          </span>
        </span>
      </div>

      <Divider className="my-1" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex shrink flex-col">
          <span className="text-body-sm">Recargar desde</span>
          <span className="text-body font-semibold">{accountLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPressRecharge}
            className="rounded-full border border-primary-soft bg-surface-alt px-3 py-1.5 text-sm font-bold text-primary transition-opacity active:opacity-70 cursor-pointer"
          >
            + ${rechargeAmount}
          </button>
          <IoChevronForward className="h-4 w-4 text-primary" />
          <IoChevronForward className="-ml-3 h-4 w-4 text-primary" />
          <span className="text-[20px] font-black italic text-primary">d!</span>
        </div>
      </div>
    </Card>
  );
}
