/**
 * Design Tokens for Inner Serenity Counselling Centre
 * TypeScript exports for use in JS/TS logic (charts, dynamic styles, etc.)
 */

export const colors = {
  // Brand Colors
  ivory: '#FFEFCD',
  ivoryDark: '#E8DDB8',
  natural: '#A5BE74',
  apricot: '#E09132',
  fern: '#424530',
  fernLight: '#6B6E5A',
  
  // Semantic Colors
  primary: '#424530',
  secondary: '#A5BE74',
  accent: '#E09132',
  background: '#FFEFCD',
  surface: '#FFFFFF',
  text: '#424530',
  textMuted: '#6B6E5A',
  
  // Dark Mode
  backgroundDark: '#2a2d20',
  surfaceDark: '#242424',
  textDark: '#E8E8E8',
  textMutedDark: '#A0A0A0',
} as const;

export const typography = {
  fontFamily: {
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  base: '250ms ease-in-out',
  slow: '350ms ease-in-out',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Chart color palette (for use in charts/graphs)
export const chartColors = [
  colors.natural,
  colors.apricot,
  colors.fern,
  colors.ivory,
  colors.fernLight,
] as const;

// Complete theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  chartColors,
} as const;

// Helper function to get CSS variable value
export function getCssVar(name: string): string {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '';
}

// Helper to get color for charts based on index
export function getChartColor(index: number): string {
  return chartColors[index % chartColors.length];
}
