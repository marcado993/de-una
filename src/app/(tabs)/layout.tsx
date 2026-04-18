"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ComponentType, type SVGProps } from "react";
import {
  IoGift,
  IoGiftOutline,
  IoHome,
  IoHomeOutline,
  IoPersonCircle,
  IoPersonCircleOutline,
  IoWallet,
  IoWalletOutline,
} from "react-icons/io5";

import { CampaignAlerts } from "@/components/yapass/organisms";
import { cn } from "@/lib/cn";

type Tab = {
  href: string;
  label: string;
  ActiveIcon: ComponentType<SVGProps<SVGSVGElement>>;
  InactiveIcon: ComponentType<SVGProps<SVGSVGElement>>;
};

const TABS: Tab[] = [
  { href: "/", label: "Inicio", ActiveIcon: IoHome, InactiveIcon: IoHomeOutline },
  {
    href: "/beneficios",
    label: "Beneficios",
    ActiveIcon: IoGift,
    InactiveIcon: IoGiftOutline,
  },
  {
    href: "/billetera",
    label: "Billetera",
    ActiveIcon: IoWallet,
    InactiveIcon: IoWalletOutline,
  },
  {
    href: "/tu",
    label: "Tú",
    ActiveIcon: IoPersonCircle,
    InactiveIcon: IoPersonCircleOutline,
  },
];

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <main className="flex-1 pb-20">{children}</main>
      <nav
        aria-label="Navegación principal"
        className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-divider bg-white px-2 pt-1 pb-[max(env(safe-area-inset-bottom),0.25rem)]"
      >
        <ul className="flex h-16 items-center justify-around">
          {TABS.map(({ href, label, ActiveIcon, InactiveIcon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            const Icon = active ? ActiveIcon : InactiveIcon;
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-1 text-[11px] font-semibold transition-colors",
                    active ? "text-primary" : "text-text-muted",
                  )}
                >
                  <Icon className="h-[22px] w-[22px]" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Global controller — listens to the SSE stream and shows the
          campaign alert modal over whichever tab the user is on. */}
      <Suspense fallback={null}>
        <CampaignAlerts />
      </Suspense>
    </div>
  );
}
