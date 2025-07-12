/**
 * @module kilowhat/lib
 * @description Main entry point for the Kilowhat TypeScript library.
 * 
 * This module exports all utilities, configuration, and components for the Kilowhat blog.
 * 
 * @example
 * ```typescript
 * // Import specific utilities
 * import { querySelector, EventManager, Typewriter } from '@/lib';
 * 
 * // Or import from specific modules
 * import { createElement, setTextContent } from '@/lib/utils/dom';
 * import { TouchLightbox } from '@/lib/components';
 * ```
 */

export * from './utils';
export * from './config';
export * from './components';