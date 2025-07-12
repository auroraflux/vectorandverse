/**
 * @module kilowhat/lib/config/animations
 * @description Comprehensive animation configuration for all UI animations.
 * 
 * Centralized animation timings, durations, and easing functions
 * to ensure consistent motion design throughout the application.
 */

// Import existing typewriter config
import { TYPEWRITER_TIMINGS, TAGLINES } from './animation';

/**
 * Master animation configuration object.
 * 
 * Contains all animation timings, durations, and settings organized by feature.
 * Use this to maintain consistent animations across the application.
 * 
 * @constant
 * @type {Object}
 */
export const ANIMATION_CONFIG = {
  // Transition durations (in milliseconds)
  durations: {
    fast: 200,
    normal: 300,
    medium: 400,
    slow: 600,
    slower: 800,
    slowest: 1000,
    extended: 1200,
    long: 1500,
    veryLong: 2000,
  },

  // CSS duration strings
  cssTimings: {
    fast: '0.2s',
    normal: '0.3s',
    medium: '0.4s',
    slow: '0.6s',
    slower: '0.8s',
    slowest: '1s',
    extended: '1.2s',
    long: '1.5s',
    veryLong: '2s',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom cubic bezier functions
    smoothOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    material: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Animation-specific configurations
  typewriter: {
    ...TYPEWRITER_TIMINGS,
    cursorBlinkDuration: '1s',
    revealDuration: '2s',
    revealSteps: 30,
    taglineRotateDuration: '25s',
    taglines: TAGLINES,
  },

  // Scroll animations
  scroll: {
    headerTransitionDuration: '0.3s',
    revealDelay: 100, // pixels from bottom to trigger
    revealStaggerDelay: 100, // ms between staggered elements
    maxStaggerDelay: 400,
  },

  // Touch/gesture animations
  touch: {
    rippleDuration: '0.6s',
    transformDuration: '0.1s',
    hoverTransformDuration: '0.2s',
    swipeAnimationDuration: 300,
  },

  // Logo and hero animations
  hero: {
    fadeInDuration: '0.3s',
    fadeInUpDuration: '1s',
    gentleDriftDuration: '25s',
    gentleDriftReverseDuration: '30s',
    gradientMoveDuration: '30s',
    gradientMoveSlowDuration: '60s',
    colorMorphDuration: '16.8s',
    shimmerDuration: '3s',
    shimmerDelay: '1.5s',
    subtleBounceDuration: '2s',
    enhancedBounceDuration: '1.5s',
  },

  // Border and pulse animations
  pulse: {
    // Duration variations for different pulse animations
    durations: [5.2, 5.4, 5.5, 5.8, 5.9, 6, 6.3, 6.4, 6.6, 6.8, 7.1, 7.2, 7.5, 7.7, 7.9, 8],
    // Delay variations
    delays: [0.7, 1.2, 1.4, 1.8, 2.1, 2.3, 2.5, 3.1, 3.4, 3.9, 4.3, 4.7, 4.8, 5.2, 5.5],
  },

  // Link animations
  link: {
    colorTransitionDuration: '0.3s',
    underlineTransitionDuration: '0.3s',
    underlineGlowDuration: '3s',
  },

  // Variable font effects
  variableFont: {
    transitionDuration: '0.3s',
    transitionDurationSlow: '0.4s',
    transitionDurationFast: '0.2s',
  },
} as const;

/**
 * Get CSS timing string from duration key.
 * 
 * Converts a duration key to its CSS timing string value.
 * 
 * @param {keyof typeof ANIMATION_CONFIG.durations} duration - Duration key
 * @returns {string} CSS timing string (e.g., '0.3s')
 * 
 * @example
 * ```typescript
 * const timing = getCssTiming('normal'); // Returns '0.3s'
 * ```
 */
export function getCssTiming(duration: keyof typeof ANIMATION_CONFIG.durations): string {
  return ANIMATION_CONFIG.cssTimings[duration];
}

/**
 * Get duration in milliseconds from duration key.
 * 
 * Converts a duration key to its numeric millisecond value.
 * 
 * @param {keyof typeof ANIMATION_CONFIG.durations} duration - Duration key
 * @returns {number} Duration in milliseconds
 * 
 * @example
 * ```typescript
 * const ms = getMilliseconds('fast'); // Returns 200
 * setTimeout(callback, ms);
 * ```
 */
export function getMilliseconds(duration: keyof typeof ANIMATION_CONFIG.durations): number {
  return ANIMATION_CONFIG.durations[duration];
}