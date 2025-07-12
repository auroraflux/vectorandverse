/**
 * Animation configuration constants
 */

/**
 * Common easing functions
 */
export const EASINGS = {
  linear: 'linear',
  easeInOut: 'ease-in-out',
  easeOut: 'ease-out',
  easeIn: 'ease-in',
  // Custom cubic-bezier easings
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
} as const;

/**
 * Animation durations in milliseconds
 */
export const DURATIONS = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000
} as const;

/**
 * Transition timing for CSS transitions
 */
export const TRANSITIONS = {
  fast: `${DURATIONS.fast}ms ${EASINGS.smooth}`,
  normal: `${DURATIONS.normal}ms ${EASINGS.smooth}`,
  slow: `${DURATIONS.slow}ms ${EASINGS.smooth}`
} as const;

/**
 * Animation breakpoints for responsive animations
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
} as const;

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on user preferences
 */
export function getAnimationDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

/**
 * Common animation options
 */
export interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  fill?: FillMode;
}

/**
 * Default animation options
 */
export const DEFAULT_ANIMATION_OPTIONS: Required<AnimationOptions> = {
  duration: DURATIONS.normal,
  easing: EASINGS.smooth,
  delay: 0,
  fill: 'forwards'
};