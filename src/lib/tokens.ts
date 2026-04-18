/**
 * YaPass design tokens (runtime).
 * Mirrors the CSS variables declared in `globals.css` so components
 * can reference brand colors inside inline styles (e.g. the MapLibre
 * HTML string, which can't read Tailwind classes).
 */

export const palette = {
  primary: "#4B1D8C",
  primaryDark: "#3A1370",
  primaryLight: "#7A4EC7",
  primarySoft: "#EFE7F7",
  primarySofter: "#F8F4FB",

  teal: "#1FC9B6",
  tealSoft: "#D7F4F0",

  white: "#FFFFFF",
  black: "#000000",
  ink: "#1C1C1C",
  textPrimary: "#1C1C1C",
  textSecondary: "#6B6B6B",
  textMuted: "#9A9AA0",
  border: "#E6E6EA",
  divider: "#ECECEF",
  surface: "#FFFFFF",
  surfaceAlt: "#F6F6F8",
  background: "#F1F1F3",

  levelPink: "#F3E3E0",
  levelPinkDark: "#E7D0CC",
  levelGray: "#6E6A6B",

  success: "#1FC9B6",
  warning: "#F4B740",
  danger: "#E0543B",
} as const;
