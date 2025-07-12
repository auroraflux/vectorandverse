# Migration Guide: JavaScript to TypeScript Refactoring

This guide helps developers understand the changes made during the JavaScript to TypeScript refactoring and how to work with the new architecture.

## Overview of Changes

### Before (Inline JavaScript)
- 1000+ lines of inline JavaScript in Astro components
- Global state pollution
- Memory leaks from uncleared event listeners
- XSS vulnerabilities from innerHTML usage
- Untestable code

### After (TypeScript Modules)
- Modular TypeScript architecture in `src/lib/`
- Automatic memory management
- XSS-safe DOM manipulation
- Full test coverage
- Type safety

## Key Changes

### 1. Typewriter Animation

**Before:**
```javascript
// In Layout.astro
<script>
  function typewriter() {
    // 200+ lines of inline code
    let taglines = [...];
    // Direct DOM manipulation
    element.innerHTML = text;
  }
</script>
```

**After:**
```typescript
// Import from lib
import { Typewriter } from '@/lib/animations';

// In component script
const typewriter = new Typewriter({
  element: taglineElement,
  phrases: TAGLINES,
  announceToScreenReader: true
});

typewriter.start();

// Cleanup on page navigation
document.addEventListener('astro:before-swap', () => {
  typewriter.destroy();
});
```

### 2. TouchLightbox

**Before:**
```javascript
// In TouchLightbox.astro
<script>
  // 300+ lines of inline code
  let touchState = {};
  function handleTouch(e) {
    // Manual event handling
  }
</script>
```

**After:**
```typescript
// Import from lib
import { TouchLightbox } from '@/lib/components';

// Auto-initialize
const lightbox = TouchLightbox.autoInit('#lightbox');

// Or manual initialization
const lightbox = new TouchLightbox(lightboxElement, {
  swipeThreshold: 0.15,
  maxZoom: 3
});
```

### 3. Event Handling

**Before:**
```javascript
// Manual event listeners everywhere
element.addEventListener('click', handler);
// No cleanup - memory leaks!
```

**After:**
```typescript
import { EventManager } from '@/lib/utils';

const events = new EventManager();

// Add listeners with automatic tracking
events.on(element, 'click', handleClick);
events.on(window, 'resize', debounce(handleResize, 300));

// Cleanup all at once
events.cleanup();
```

### 4. DOM Manipulation

**Before:**
```javascript
// XSS vulnerable
element.innerHTML = userContent;
```

**After:**
```typescript
import { setTextContent, createElement, setChildren } from '@/lib/utils/dom';

// XSS safe
setTextContent(element, userContent);

// Or for complex content
setChildren(element, [
  createElement('h2', {}, [title]),
  createElement('p', {}, [description])
]);
```

## Working with the New Architecture

### Creating a New Component

```typescript
import { BaseComponent, BaseComponentOptions } from '@/lib/components';
import { EventManager } from '@/lib/utils';

export interface MyComponentOptions extends BaseComponentOptions {
  customOption?: string;
}

export class MyComponent extends BaseComponent<HTMLDivElement> {
  private customOption: string;
  
  constructor(element: HTMLDivElement, options: MyComponentOptions = {}) {
    super(element, options);
    this.customOption = options.customOption || 'default';
  }
  
  protected mount(): void {
    // Component initialization
    this.setupEventListeners();
    this.render();
  }
  
  protected unmount(): void {
    // Cleanup happens automatically via EventManager
    // Add any component-specific cleanup here
  }
  
  private setupEventListeners(): void {
    this.events.on(this.element, 'click', this.handleClick);
  }
  
  private handleClick = (e: Event) => {
    // Handle click
  };
  
  private render(): void {
    // Render component
  }
}
```

### Using Utilities

```typescript
// DOM utilities
import { querySelector, querySelectorAll, isVisible } from '@/lib/utils/dom';

const button = querySelector<HTMLButtonElement>('.submit-btn');
if (button && isVisible(button)) {
  button.disabled = false;
}

// Event utilities
import { debounce, throttle, once } from '@/lib/utils/events';

const debouncedSave = debounce(saveData, 500);
const throttledScroll = throttle(handleScroll, 100);

once(video, 'loadeddata', () => {
  console.log('Video loaded');
});

// Accessibility utilities
import { announceToScreenReader, FocusTrap } from '@/lib/utils/accessibility';

announceToScreenReader('Form submitted successfully');

const modal = new FocusTrap(modalElement);
modal.activate();
```

### Configuration

All configuration is centralized in `src/lib/config/`:

```typescript
import { ANIMATION_CONFIG, COLOR_CONFIG, DIMENSION_CONFIG } from '@/lib/config';

// Use animation timings
const duration = ANIMATION_CONFIG.durations.normal; // 300ms

// Use color values
const primaryColor = COLOR_CONFIG.primary;

// Use dimensions
const headerHeight = DIMENSION_CONFIG.header.height;
```

## Testing

The refactored code is fully testable:

```typescript
// Example test
import { Typewriter } from '@/lib/animations';

describe('Typewriter', () => {
  it('should cycle through phrases', async () => {
    const element = document.createElement('div');
    const phrases = ['Hello', 'World'];
    
    const typewriter = new Typewriter({
      element,
      phrases,
      typeSpeed: 0 // Instant for testing
    });
    
    await typewriter.start();
    expect(element.textContent).toContain('Hello');
  });
});
```

## Migration Checklist

When updating existing code:

1. **Remove inline `<script>` tags** from Astro components
2. **Import from `@/lib`** instead
3. **Use EventManager** for all event listeners
4. **Replace innerHTML** with safe DOM utilities
5. **Add cleanup** in `astro:before-swap` event
6. **Test thoroughly** - run `npm test`

## Common Patterns

### Pattern 1: Component Initialization
```typescript
// In Astro component
<script>
  import { MyComponent } from '@/lib/components';
  
  document.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('my-component');
    if (element) {
      const component = new MyComponent(element);
    }
  });
</script>
```

### Pattern 2: Cleanup on Navigation
```typescript
<script>
  import { cleanup } from '@/lib/utils';
  
  let component;
  
  document.addEventListener('DOMContentLoaded', () => {
    component = initializeComponent();
  });
  
  document.addEventListener('astro:before-swap', () => {
    component?.destroy();
  });
</script>
```

### Pattern 3: Respecting User Preferences
```typescript
import { prefersReducedMotion, getAnimationDuration } from '@/lib/config/animation';

if (!prefersReducedMotion()) {
  element.animate(keyframes, {
    duration: getAnimationDuration(300)
  });
}
```

## Troubleshooting

### Issue: Component not initializing
- Check if element exists: `console.log(document.getElementById('your-id'))`
- Ensure script runs after DOM is ready
- Check for console errors

### Issue: Memory leaks
- Ensure all components call `.destroy()` on cleanup
- Use EventManager for all event listeners
- Check for lingering timeouts/intervals

### Issue: TypeScript errors
- Run `npm run build` to see all TS errors
- Check imports are from `@/lib`
- Ensure proper type annotations

## Benefits of the New Architecture

1. **Type Safety**: Catch errors at compile time
2. **Memory Safety**: Automatic cleanup prevents leaks
3. **Security**: XSS prevention built-in
4. **Testability**: Unit test individual components
5. **Maintainability**: Clear module structure
6. **Performance**: Tree-shaking removes unused code
7. **Developer Experience**: IntelliSense and autocomplete

## Next Steps

1. Review the architecture diagram in `docs/ARCHITECTURE.md`
2. Explore the lib modules in `src/lib/`
3. Run tests to understand expected behavior
4. Start building with the new patterns!