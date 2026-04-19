"use client";

import { IoLocationSharp, IoStorefrontSharp } from "react-icons/io5";

import type { Campaign } from "@/lib/api-types";
import { cn } from "@/lib/cn";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { SponsorBadge } from "../atoms/SponsorBadge";
import { PopupModal } from "./PopupModal";

export type CampaignAlertModalProps = {
  visible: boolean;
  campaign: Campaign | null;
  onDismiss: () => void;
  onAccept?: (campaign: Campaign) => void;
};

/**
 * Organism — the popup that fires on the user side when a nearby shop
 * launches a promo. Composed from existing atoms so tokens stay the
 * single source of truth; replacing any atom upgrades the look without
 * touching this file.
 */
export function CampaignAlertModal({
  visible,
  campaign,
  onDismiss,
  onAccept,
}: CampaignAlertModalProps) {
  if (!campaign) return null;

  const discountLabel = `Cashback ${campaign.discountPct}%`;
  const subtitle = campaign.business.barrio
    ? `${campaign.business.name} · ${campaign.business.barrio}`
    : campaign.business.name;

  return (
    <PopupModal
      visible={visible}
      title=""
      onClose={onDismiss}
      size="md"
      className={cn(
        "!gap-4 !p-0 overflow-hidden",
        "bg-[radial-gradient(circle_at_0%_0%,#FFE3B8_0%,var(--color-primary-softer)_55%,#F4EAFE_100%)]",
      )}
    >
      <div className="flex flex-col items-center gap-3 px-5 pb-2 pt-6 text-center">
        <div className="flex w-full items-center justify-between">
          <Badge tone="primary" size="sm">
            {campaign.title}
          </Badge>
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur-sm">
            Cerca de ti
          </span>
        </div>

        <div className="w-[150px]">
          <SponsorBadge name={campaign.business.name} size="md" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary">
            Solo por hoy
          </span>
          <span className="text-[44px] font-black leading-none text-primary">
            {discountLabel}
          </span>
          <span className="mt-1 text-sm leading-5 text-ink/80">
            {campaign.description}
          </span>
        </div>

        <div className="flex w-full flex-col gap-1 rounded-[var(--radius-md)] bg-white/70 p-3 text-left backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <IoStorefrontSharp className="h-4 w-4" />
            <span>{subtitle}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <IoLocationSharp className="h-3.5 w-3.5" />
            <span>Promo activa en un radio de {campaign.radiusM} m</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-5 pb-5">
        <Button
          label={`Quiero mi ${discountLabel}`}
          size="lg"
          onClick={() => {
            onAccept?.(campaign);
            onDismiss();
          }}
        />
        <Button
          label="Ahora no"
          size="md"
          variant="ghost"
          onClick={onDismiss}
        />
      </div>
    </PopupModal>
  );
}
