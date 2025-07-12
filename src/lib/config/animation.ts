/**
 * @module kilowhat/lib/config/animation
 * @description Animation configuration constants and utilities.
 * 
 * Provides standardized animation timings, easings, and utilities
 * for consistent animations throughout the application.
 */

/**
 * Common easing functions for animations.
 * 
 * @constant
 * @type {Object}
 * @property {string} linear - Linear easing (no acceleration)
 * @property {string} easeInOut - Ease in and out
 * @property {string} easeOut - Ease out (decelerate)
 * @property {string} easeIn - Ease in (accelerate)
 * @property {string} smooth - Custom smooth easing
 * @property {string} bounce - Bounce effect easing
 * @property {string} sharp - Sharp, quick easing
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
 * Standard animation durations in milliseconds.
 * 
 * @constant
 * @type {Object}
 * @property {number} instant - No animation (0ms)
 * @property {number} fast - Fast animations (150ms)
 * @property {number} normal - Normal animations (300ms)
 * @property {number} slow - Slow animations (500ms)
 * @property {number} verySlow - Very slow animations (1000ms)
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
 * Check if user prefers reduced motion.
 * 
 * Respects the user's system preference for reduced motion.
 * 
 * @returns {boolean} True if user prefers reduced motion
 * 
 * @example
 * ```typescript
 * if (!prefersReducedMotion()) {
 *   element.animate(keyframes, options);
 * }
 * ```
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on user preferences.
 * 
 * Returns 0 if user prefers reduced motion, otherwise returns the specified duration.
 * 
 * @param {number} duration - Desired animation duration in milliseconds
 * @returns {number} Adjusted duration (0 if reduced motion is preferred)
 * 
 * @example
 * ```typescript
 * const duration = getAnimationDuration(300); // Returns 0 or 300
 * ```
 */
export function getAnimationDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

/**
 * Common animation options interface.
 * 
 * @interface AnimationOptions
 * @property {number} [duration] - Animation duration in milliseconds
 * @property {string} [easing] - CSS easing function
 * @property {number} [delay] - Animation delay in milliseconds
 * @property {FillMode} [fill] - Animation fill mode
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

/**
 * Typewriter animation timing configuration.
 * 
 * @constant
 * @type {Object}
 * @property {number} TYPE_SPEED_MS - Speed of typing each character (70ms)
 * @property {number} ERASE_SPEED_MS - Speed of erasing each character (50ms)
 * @property {number} DISPLAY_DURATION_MS - How long to display complete phrase (3000ms)
 * @property {number} PAUSE_BETWEEN_MS - Pause between phrases (500ms)
 * @property {number} INITIAL_DELAY_MS - Initial delay before starting (100ms)
 */
export const TYPEWRITER_TIMINGS = {
  TYPE_SPEED_MS: 70,
  ERASE_SPEED_MS: 50,
  DISPLAY_DURATION_MS: 3000,
  PAUSE_BETWEEN_MS: 500,
  INITIAL_DELAY_MS: 100
} as const;

/**
 * Taglines for typewriter animation.
 * 
 * Collection of programming-themed taglines that rotate on the homepage.
 * Each tagline combines programming concepts with philosophical themes.
 * 
 * @constant
 * @type {ReadonlyArray<string>}
 */
export const TAGLINES = [
  "git commit -m 'still believing'",
  "segfault optimism since 2024",
  "try { hope() } catch { blog() }",
  "npm install faith --save-dev",
  "sudo make me believe",
  "undefined is not a feeling",
  "console.log('everything is fine')",
  "AI won't replace my anxiety",
  "docker run -it hope:latest",
  "// TODO: fix everything",
  "merge conflicts with reality",
  "stack overflow but make it poetry",
  "kubernetes for my emotions",
  "cached optimism (expires: never)",
  "rm -rf doubts 2>/dev/null",
  "404: pessimism not found",
  "debugging life in production",
  "ctrl+z doesn't work here",
  "async/await the apocalypse",
  "<div class='silver-lining' />"
] as const;