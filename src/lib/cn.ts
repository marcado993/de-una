import clsx, { ClassValue } from "clsx";

/** Tiny className helper. Keeps the JSX in components readable. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
