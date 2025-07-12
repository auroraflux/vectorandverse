/**
 * Color Configuration
 * Centralized color values and opacity levels
 */

export const COLOR_CONFIG = {
  // Opacity levels
  opacity: {
    transparent: 0,
    5: 0.05,
    10: 0.1,
    15: 0.15,
    20: 0.2,
    25: 0.225,
    30: 0.3,
    40: 0.4,
    50: 0.5,
    60: 0.6,
    70: 0.7,
    75: 0.75,
    80: 0.8,
    85: 0.85,
    90: 0.9,
    95: 0.95,
    full: 1,
  },

  // Gradient stops for header vignette
  gradientStops: {
    vignette: [
      { position: '0%', opacity: 0.9 },
      { position: '5%', opacity: 0.85 },
      { position: '10%', opacity: 0.8 },
      { position: '20%', opacity: 0.7 },
      { position: '30%', opacity: 0.6 },
      { position: '40%', opacity: 0.5 },
      { position: '50%', opacity: 0.4 },
      { position: '60%', opacity: 0.3 },
      { position: '70%', opacity: 0.2 },
      { position: '80%', opacity: 0.1 },
      { position: '90%', opacity: 0.05 },
      { position: '100%', opacity: 0 },
    ],
  },

  // Shadow colors and values
  shadows: {
    text: {
      subtle: 'rgba(0,0,0,0.08)',
      light: 'rgba(0,0,0,0.1)',
      medium: 'rgba(0,0,0,0.15)',
      strong: 'rgba(0,0,0,0.3)',
      heavy: 'rgba(0,0,0,0.5)',
      veryHeavy: 'rgba(0,0,0,0.7)',
      extreme: 'rgba(0,0,0,0.9)',
    },
    box: {
      light: 'rgba(0, 0, 0, 0.08)',
      default: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.12)',
    },
  },

  // Pulse animation colors (for grid effects)
  pulseColors: {
    blue: 'rgba(59, 130, 246, 0.225)',
    orange: 'rgba(251, 146, 60, 0.225)',
    rose: 'rgba(244, 63, 94, 0.225)',
    teal: 'rgba(20, 184, 166, 0.225)',
    purple: 'rgba(147, 51, 234, 0.225)',
    sky: 'rgba(14, 165, 233, 0.225)',
    amber: 'rgba(245, 158, 11, 0.225)',
    yellow: 'rgba(249, 115, 22, 0.225)',
    gray: 'rgba(155, 138, 153, 0.225)',
    green: 'rgba(16, 185, 129, 0.225)',
    indigo: 'rgba(99, 102, 241, 0.225)',
    pink: 'rgba(236, 72, 153, 0.225)',
    lime: 'rgba(132, 204, 22, 0.225)',
    cyan: 'rgba(6, 182, 212, 0.225)',
  },

  // Filter drop shadows
  dropShadows: {
    blueGlow: 'rgba(59, 130, 246, 0.3)',
    roseGlow: 'rgba(244, 63, 94, 0.3)',
  },

  // Border colors with opacity
  borders: {
    gray: {
      light: 'rgba(229, 231, 235, 0.8)', // gray-200 with 80% opacity
      default: 'rgba(229, 231, 235, 1)', // gray-200
    },
    white: {
      subtle: 'rgba(255, 255, 255, 0.3)',
      medium: 'rgba(255, 255, 255, 0.5)',
      strong: 'rgba(255, 255, 255, 0.7)',
    },
  },

  // Background overlays
  overlays: {
    dark: {
      0: 'rgba(0, 0, 0, 0)',
      5: 'rgba(0, 0, 0, 0.05)',
      10: 'rgba(0, 0, 0, 0.1)',
      20: 'rgba(0, 0, 0, 0.2)',
      30: 'rgba(0, 0, 0, 0.3)',
      40: 'rgba(0, 0, 0, 0.4)',
      50: 'rgba(0, 0, 0, 0.5)',
      60: 'rgba(0, 0, 0, 0.6)',
      70: 'rgba(0, 0, 0, 0.7)',
      75: 'rgba(0, 0, 0, 0.75)',
      80: 'rgba(0, 0, 0, 0.8)',
      85: 'rgba(0, 0, 0, 0.85)',
      90: 'rgba(0, 0, 0, 0.9)',
    },
    light: {
      10: 'rgba(255, 255, 255, 0.1)',
      20: 'rgba(255, 255, 255, 0.2)',
      30: 'rgba(255, 255, 255, 0.3)',
      50: 'rgba(255, 255, 255, 0.5)',
      70: 'rgba(255, 255, 255, 0.7)',
      80: 'rgba(255, 255, 255, 0.8)',
      90: 'rgba(255, 255, 255, 0.9)',
    },
  },
} as const;

// Helper functions
export function getOpacity(level: keyof typeof COLOR_CONFIG.opacity): number {
  return COLOR_CONFIG.opacity[level];
}

export function getRgba(r: number, g: number, b: number, opacity: keyof typeof COLOR_CONFIG.opacity): string {
  return `rgba(${r}, ${g}, ${b}, ${COLOR_CONFIG.opacity[opacity]})`;
}

export function getBlackOverlay(opacity: keyof typeof COLOR_CONFIG.overlays.dark): string {
  return COLOR_CONFIG.overlays.dark[opacity];
}

export function getWhiteOverlay(opacity: keyof typeof COLOR_CONFIG.overlays.light): string {
  return COLOR_CONFIG.overlays.light[opacity];
}