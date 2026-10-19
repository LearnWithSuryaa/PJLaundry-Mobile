export const COLORS = {
  // Brand Colors
  brandBlue: "#3998E5",
  brandBlueDark: "#2476BC",
  brandBlueSoft: "#EAF5FF",
  brandYellow: "#FFE98A",
  brandOrange: "#FFB45C",
  brandOrangeSoft: "#FFF2DE",

  // Light Theme Surfaces & Backgrounds
  bgPrimary: "#F7F9FC",
  surfacePrimary: "#FFFFFF",
  surfaceSecondary: "#F1F5F9",
  borderDefault: "#E2E8F0",

  // Text Hierarchy
  textPrimary: "#172033",
  textSecondary: "#64748B",
  textDisabled: "#94A3B8",
  textOnAccent: "#FFFFFF",
  textOnWarm: "#78350F", // Dark text on warm yellow/orange backgrounds for WCAG AA

  // Semantics
  success: "#16845B",
  successSurface: "#E8F7EF",
  warning: "#A86408",
  warningSurface: "#FFF4D8",
  error: "#C93636",
  errorSurface: "#FDECEC",
  information: "#2476BC",
  informationSurface: "#EAF5FF",
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  hero: 44,
} as const;

export const RADIUS = {
  sm: 8,
  input: 12,
  button: 14,
  card: 16,
  full: 9999,
} as const;

export const TOUCH_TARGET = {
  min: 48,
} as const;

export const SHADOWS = {
  subtle: {
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  modal: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;
