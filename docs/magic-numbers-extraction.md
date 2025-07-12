# Magic Numbers Extraction Summary

This document summarizes the extraction of magic numbers to configuration constants in the Kilowhat project.

## What Was Done

### 1. Created Configuration Modules

Three main configuration modules were created in `/src/lib/config/`:

#### `animations.ts`
- **Durations**: Standardized timing values from 200ms (fast) to 2000ms (veryLong)
- **Easing Functions**: Including custom cubic bezier functions
- **Component-specific timings**: Typewriter, scroll, touch, hero animations, etc.
- **Helper functions**: `getCssTiming()`, `getMilliseconds()`

#### `dimensions.ts`
- **Header**: Height (80px), spacer heights, max width
- **Typography**: Font sizes for all heading levels and text types
- **Spacing**: Standardized values from xs (0.5rem) to 2xl (4rem)
- **Borders**: Widths and radius values
- **Z-index system**: Layering from -10 to 70
- **Touch targets**: WCAG-compliant 44px minimum
- **Effects**: Blur, shadows, letter spacing
- **Animation thresholds**: Scroll, swipe, zoom limits

#### `colors.ts`
- **Opacity levels**: 0 to 1 with common increments
- **Gradient configurations**: Vignette effects
- **Shadow colors**: Text and box shadows
- **Pulse animation colors**: For grid effects
- **Border colors**: With opacity variations
- **Overlay options**: Dark and light variations

### 2. Created CSS Custom Properties

`design-tokens.css` - Exports all configuration values as CSS custom properties for use in stylesheets:
- `--duration-*` for animations
- `--spacing-*` for margins/padding
- `--z-*` for z-index layers
- `--shadow-*` for shadows
- `--blur-*` for filter effects
- And many more...

### 3. Updated Components

Examples of components updated to use configuration:
- **Header.astro**: Uses `DIMENSION_CONFIG` and `COLOR_CONFIG`
- **LogoScrollTransform.astro**: Uses scroll threshold and animation durations
- **sticky-header.css**: Uses CSS custom properties

## Benefits Achieved

1. **Single Source of Truth**: All magic numbers are now in one centralized location
2. **Type Safety**: TypeScript ensures correct usage of values
3. **Consistency**: Same values used across all components
4. **Maintainability**: Easy to update values globally
5. **Documentation**: Each value has a clear purpose
6. **CSS Integration**: Values available in both TypeScript and CSS

## Usage Examples

### In TypeScript/Astro Components:
```typescript
import { ANIMATION_CONFIG, DIMENSION_CONFIG } from '@/lib/config';

const fadeInDuration = ANIMATION_CONFIG.durations.normal; // 300ms
const headerHeight = DIMENSION_CONFIG.header.height; // 80px
```

### In CSS:
```css
.my-element {
  transition: opacity var(--duration-normal, 0.3s);
  padding: var(--spacing-md, 1.5rem);
  z-index: var(--z-modal, 50);
}
```

## Next Steps

To fully implement this system across the codebase:

1. **Update remaining components**: Replace all hardcoded values with configuration constants
2. **Update all CSS files**: Use CSS custom properties instead of hardcoded values
3. **Add build-time validation**: Ensure all magic numbers come from configuration
4. **Document usage patterns**: Add examples to component documentation
5. **Consider runtime configuration**: For values that might need to change dynamically

## Files Created/Modified

### Created:
- `/src/lib/config/animations.ts`
- `/src/lib/config/dimensions.ts`
- `/src/lib/config/colors.ts`
- `/src/lib/config/index.ts`
- `/src/lib/config/README.md`
- `/src/styles/design-tokens.css`
- `/docs/magic-numbers-extraction.md`

### Modified:
- `/src/components/Header.astro`
- `/src/components/LogoScrollTransform.astro`
- `/src/styles/sticky-header.css`
- `/src/styles/global.css`

## Common Magic Numbers Found

### Animation Timings:
- 300ms (normal transitions)
- 600ms (slow transitions)
- 1s (cursor blink)
- 2s (typewriter reveal)
- 25s (tagline rotation)
- 30s (gradient animations)

### Dimensions:
- 80px (header height)
- 44px (touch target minimum)
- 1px, 2px, 3px (border widths)
- 8px (default blur)
- 4px (touch area expansion)

### Opacity Values:
- 0.1, 0.2, 0.3... (increments of 0.1)
- 0.05, 0.15, 0.25... (special cases)
- 0.225 (pulse animation opacity)

### Z-index Layers:
- 20 (sticky)
- 30 (fixed)
- 40 (modal backdrop)
- 50 (modal)

This refactoring makes the codebase more maintainable and consistent while preserving all existing functionality.