# Configuration Constants

This directory contains centralized configuration for all magic numbers and constants used throughout the Kilowhat project.

## Structure

### `animations.ts`
Contains all animation-related constants:
- **Durations**: Standardized timing values (fast: 200ms to veryLong: 2000ms)
- **CSS Timings**: String versions of durations for CSS use
- **Easing Functions**: Standard and custom cubic bezier functions
- **Component-specific animations**: Typewriter, scroll, touch, hero, pulse, links, and variable fonts

### `dimensions.ts`
Contains all sizing and spacing constants:
- **Header**: Height (80px), spacer heights, max width, padding
- **Typography**: Font sizes for hero, headings, taglines, and body text
- **Spacing**: Standardized padding/margin values (xs to 2xl)
- **Borders**: Width and radius values
- **Z-index**: Layering system from -10 to 70
- **Touch targets**: WCAG-compliant minimum size (44px)
- **Image dimensions**: Avatar and hero image sizes
- **Effects**: Blur, text shadow, and box shadow values
- **Layout**: Max widths and grid pattern sizes
- **Animation thresholds**: Scroll, swipe, and zoom limits

### `colors.ts`
Contains all color-related constants:
- **Opacity levels**: 0 to 1 with common increments
- **Gradient stops**: Vignette gradient configuration
- **Shadow colors**: Text and box shadow rgba values
- **Pulse colors**: Grid animation colors with 22.5% opacity
- **Drop shadows**: Glow effects for interactive elements
- **Border colors**: Gray and white variations with opacity
- **Overlays**: Dark and light overlay options

## Usage

Import the constants you need:

```typescript
import { ANIMATION_CONFIG, DIMENSION_CONFIG, COLOR_CONFIG } from '@/lib/config';

// Use specific values
const headerHeight = DIMENSION_CONFIG.header.height;
const fadeInDuration = ANIMATION_CONFIG.durations.normal;
const shadowColor = COLOR_CONFIG.shadows.text.medium;
```

Or use the combined CONFIG object:

```typescript
import { CONFIG } from '@/lib/config';

const headerHeight = CONFIG.dimensions.header.height;
```

## Helper Functions

Each module provides helper functions:

- `getCssTiming()`: Convert duration key to CSS string
- `getMilliseconds()`: Get numeric milliseconds
- `getPx()`: Convert number to pixel string
- `getRem()`: Convert pixels to rem
- `getOpacity()`: Get opacity value
- `getRgba()`: Create rgba color string
- `getBlackOverlay()`: Get black overlay with opacity
- `getWhiteOverlay()`: Get white overlay with opacity

## Benefits

1. **Single source of truth**: All magic numbers in one place
2. **Type safety**: TypeScript ensures correct usage
3. **Consistency**: Standardized values across the codebase
4. **Maintainability**: Easy to update values globally
5. **Documentation**: Clear purpose for each value
6. **Refactoring friendly**: Change values without searching the codebase