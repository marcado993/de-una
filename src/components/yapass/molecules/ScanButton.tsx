"use client";

import { IoScanOutline } from "react-icons/io5";

import { Button } from "../atoms/Button";

export type ScanButtonProps = {
  label?: string;
  onPress?: () => void;
};

/**
 * Molecule — QR scan CTA. Thin preset over the generic `Button` atom:
 * always full-width, primary, large, with a scan icon on the left.
 */
export function ScanButton({ label = "Escanear QR", onPress }: ScanButtonProps) {
  return (
    <Button
      label={label}
      onClick={onPress}
      size="lg"
      variant="primary"
      leftIcon={<IoScanOutline className="h-5 w-5" />}
    />
  );
}
