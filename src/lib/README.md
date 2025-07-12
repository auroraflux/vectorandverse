# TypeScript Library Structure

This directory contains the TypeScript infrastructure for refactoring inline JavaScript from Astro components into testable, maintainable modules.

## Directory Structure

```
src/lib/
├── animations/     # Animation-specific modules
├── components/     # Reusable UI component classes
├── config/         # Configuration and constants
└── utils/          # Utility functions and helpers
    ├── dom.ts      # DOM manipulation utilities
    └── events.ts   # Event handling with cleanup
```

## Usage Examples

### DOM Utilities

```typescript
import { querySelector, addClass, removeClass } from '@utils/dom';

const element = querySelector<HTMLElement>('.my-element');
if (element) {
  addClass(element, 'active');
  removeClass(element, 'inactive');
}
```

### Event Management

```typescript
import { EventManager, debounce } from '@utils/events';

const events = new EventManager();

// Add event with automatic cleanup tracking
events.on(window, 'scroll', debounce(() => {
  console.log('Scrolled!');
}, 100));

// Clean up all events
events.cleanup();
```

### Animation Config

```typescript
import { DURATIONS, EASINGS, getAnimationDuration } from '@config/animation';

// Respects user's prefers-reduced-motion setting
const duration = getAnimationDuration(DURATIONS.normal);
```

### Base Component

```typescript
import { BaseComponent } from '@components/BaseComponent';

class MyComponent extends BaseComponent<HTMLDivElement> {
  protected mount(): void {
    // Setup component
    this.events.on(this.element, 'click', () => {
      console.log('Clicked!');
    });
  }
}
```

## Path Aliases

The following path aliases are configured in `tsconfig.json` and `astro.config.mjs`:

- `@lib/*` → `src/lib/*`
- `@components/*` → `src/components/*`
- `@utils/*` → `src/lib/utils/*`
- `@animations/*` → `src/lib/animations/*`
- `@config/*` → `src/lib/config/*`

## Type Safety

All utilities are fully typed with TypeScript, providing:
- Intellisense support
- Type checking at compile time
- Better refactoring capabilities
- Self-documenting code

## Memory Management

The `EventManager` class automatically tracks all event listeners and provides a `cleanup()` method to prevent memory leaks. This is crucial for components that are created and destroyed dynamically.

## Next Steps

1. Extract inline JavaScript from Astro components
2. Create TypeScript modules using these utilities
3. Add unit tests with Vitest
4. Gradually migrate all inline scripts