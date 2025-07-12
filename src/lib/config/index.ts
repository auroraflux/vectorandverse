/**
 * @module kilowhat/lib/config
 * @description Central configuration module for the Kilowhat blog.
 * 
 * Re-exports all configuration modules and provides a combined CONFIG object
 * for convenient access to all configuration values.
 * 
 * @example
 * ```typescript
 * // Import specific configs
 * import { TYPEWRITER_TIMINGS, COLOR_CONFIG } from '@/lib/config';
 * 
 * // Or use the combined config
 * import { CONFIG } from '@/lib/config';
 * console.log(CONFIG.animations.typewriter);
 * ```
 */

export * from './animations';
export * from './dimensions';
export * from './colors';

// Combined config object for convenience
import { ANIMATION_CONFIG } from './animations';
import { DIMENSION_CONFIG } from './dimensions';
import { COLOR_CONFIG } from './colors';

/**
 * Combined configuration object containing all config modules.
 * 
 * @constant
 * @type {Object}
 * @property {Object} animations - Animation timing and behavior settings
 * @property {Object} dimensions - Layout and spacing dimensions
 * @property {Object} colors - Color palette and theme colors
 */
export const CONFIG = {
  animations: ANIMATION_CONFIG,
  dimensions: DIMENSION_CONFIG,
  colors: COLOR_CONFIG,
} as const;