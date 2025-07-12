/**
 * Dimension Configuration
 * Centralized sizing, spacing, and layout constants
 */

export const DIMENSION_CONFIG = {
  // Header dimensions
  header: {
    height: 80, // px
    heightCss: '80px',
    spacerHomeHeight: 96, // px (h-24 = 6rem = 96px)
    spacerArticleHeight: 0,
    maxWidth: '80rem',
    padding: {
      x: '1.5rem',
      y: '1.5rem',
    },
  },

  // Typography sizes
  typography: {
    hero: {
      mobile: '4.5rem',
      sm: '6rem',
      md: '12rem',
      lg: '13.5rem',
    },
    heading: {
      h1: '6rem',
      h2: '4rem',
      h3: '3rem',
      h4: '2rem',
      article: {
        mobile: '4xl', // 2.25rem
        md: '5xl', // 3rem
        lg: '6xl', // 3.75rem
      },
    },
    tagline: {
      mobile: '2xl', // 1.5rem
      sm: '3xl', // 1.875rem
      md: '6xl', // 3.75rem
    },
    body: {
      normal: '1rem',
      large: 'lg', // 1.125rem
      xl: 'xl', // 1.25rem
    },
  },

  // Spacing
  spacing: {
    // Padding/margin values
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    // Specific spacings
    heroSection: {
      paddingY: {
        mobile: '5rem', // py-20
        md: '7rem', // py-28
      },
      minHeight: '50vh',
    },
    articleCard: {
      padding: {
        mobile: '2rem', // p-8
        md: '3rem', // p-12
        lg: '4rem', // p-16
      },
    },
  },

  // Border widths
  borders: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
    focus: '2px',
    gradient: '2px',
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    default: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
    // Specific radii
    card: '8px',
    button: '0.5rem',
    pill: '9999px',
  },

  // Z-index layers
  zIndex: {
    behind: -10,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
  },

  // Touch targets
  touch: {
    minSize: 44, // px (WCAG minimum)
    minSizeCss: '44px',
    expandedHitArea: 4, // px expansion for touch targets
  },

  // Image dimensions
  images: {
    avatar: {
      mobile: {
        width: 128,
        height: 128,
        cssSize: '8rem', // w-32 h-32
      },
      desktop: {
        width: 160,
        height: 160,
        cssSize: '10rem', // w-40 h-40
      },
    },
    hero: {
      width: 1536,
      height: 500,
    },
  },

  // Shadows and effects
  effects: {
    blur: {
      sm: '4px',
      default: '8px',
      lg: '16px',
      xl: '24px',
    },
    textShadow: {
      subtle: '0 2px 4px rgba(0,0,0,0.1)',
      default: '0 2px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.1)',
      strong: '0 4px 30px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.3)',
      heavy: '0 4px 30px rgba(0,0,0,0.7)',
    },
    boxShadow: {
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      default: '0 2px 10px rgba(0, 0, 0, 0.1)',
      md: '0 4px 20px rgba(0, 0, 0, 0.08)',
      lg: '0 12px 30px rgba(0, 0, 0, 0.12)',
    },
  },

  // Grid and layout
  layout: {
    maxWidth: {
      prose: '65ch',
      content: '3xl', // 48rem
      wide: '7xl', // 80rem
    },
    grid: {
      patternSize: '40px',
      lineWidth: '1px',
    },
  },

  // Animation thresholds
  animation: {
    scrollThreshold: 100, // px to trigger header hide
    swipeThreshold: 0.15, // 15% of screen height
    velocityThreshold: 0.5,
    maxZoom: 3,
    minZoom: 0.5,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.04em',
    tight: '-0.03em',
    snug: '-0.02em',
    normal: '-0.01em',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.3em',
  },
} as const;

// Helper functions
export function getPx(value: number): string {
  return `${value}px`;
}

export function getRem(value: number): string {
  return `${value / 16}rem`;
}

export function getHeaderHeight(): number {
  return DIMENSION_CONFIG.header.height;
}

export function getTouchTargetSize(): number {
  return DIMENSION_CONFIG.touch.minSize;
}