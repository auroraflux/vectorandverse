# JavaScript Refactoring Guide - Practical Implementation

## Overview

This guide provides concrete steps to refactor the 1000+ lines of inline JavaScript identified in the code quality plan. We'll start with the highest-impact changes that will immediately improve testability and maintainability.

**Last Updated**: 2025-07-12  
**Validation Status**: ✅ Enhanced with deep analysis findings

## Phase 1: Extract Core Animation Logic (Week 1)

### 1.1 Create TypeScript Module Structure

First, create the directory structure:

```bash
mkdir -p src/lib/animations
mkdir -p src/lib/utils
mkdir -p src/lib/config
mkdir -p src/lib/components
```

### 1.2 Extract Typewriter Animation

**Current Problem**: 123 lines of complex animation logic in `index.astro`

**Step 1**: Create configuration module

```typescript
// src/lib/config/animations.ts
export const ANIMATION_TIMINGS = {
  TYPEWRITER: {
    TYPE_SPEED_MS: 70,
    ERASE_SPEED_MS: 50,
    DISPLAY_DURATION_MS: 3000,
    PAUSE_BETWEEN_MS: 500,
    INITIAL_DELAY_MS: 100
  }
} as const;

export const TAGLINES = [
  "git commit -m 'still believing'",
  "segfault optimism since 2024",
  "try { hope() } catch { blog() }",
  // ... rest of taglines
] as const;
```

**Step 2**: Create TypeScript typewriter module

```typescript
// src/lib/animations/typewriter.ts
import { ANIMATION_TIMINGS, TAGLINES } from '../config/animations';

export interface TypewriterConfig {
  element: HTMLElement;
  phrases?: readonly string[];
  typeSpeed?: number;
  eraseSpeed?: number;
  displayDuration?: number;
  pauseDuration?: number;
  onPhraseComplete?: (phrase: string, index: number) => void;
}

export class Typewriter {
  private element: HTMLElement;
  private phrases: readonly string[];
  private currentIndex = 0;
  private intervals: number[] = [];
  private timeouts: number[] = [];
  private isDestroyed = false;
  private config: Required<Omit<TypewriterConfig, 'element' | 'onPhraseComplete'>> & {
    onPhraseComplete?: TypewriterConfig['onPhraseComplete'];
  };

  constructor(config: TypewriterConfig) {
    this.element = config.element;
    this.phrases = config.phrases || TAGLINES;
    this.config = {
      typeSpeed: config.typeSpeed ?? ANIMATION_TIMINGS.TYPEWRITER.TYPE_SPEED_MS,
      eraseSpeed: config.eraseSpeed ?? ANIMATION_TIMINGS.TYPEWRITER.ERASE_SPEED_MS,
      displayDuration: config.displayDuration ?? ANIMATION_TIMINGS.TYPEWRITER.DISPLAY_DURATION_MS,
      pauseDuration: config.pauseDuration ?? ANIMATION_TIMINGS.TYPEWRITER.PAUSE_BETWEEN_MS,
      phrases: this.phrases,
      onPhraseComplete: config.onPhraseComplete
    };
    
    // Shuffle phrases on initialization
    this.phrases = this.shuffleArray([...this.phrases]);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private updateDisplay(text: string, showCursor = true): void {
    if (this.isDestroyed) return;
    
    if (showCursor) {
      this.element.innerHTML = `<span>${text}</span><span class="tagline-cursor text-gray-400">│</span>`;
    } else {
      this.element.innerHTML = `<span>${text}</span>`;
    }
  }

  private async typePhrase(phrase: string): Promise<void> {
    return new Promise((resolve) => {
      let charIndex = 0;
      this.updateDisplay('');
      
      const interval = window.setInterval(() => {
        if (this.isDestroyed) {
          clearInterval(interval);
          resolve();
          return;
        }
        
        if (charIndex < phrase.length) {
          this.updateDisplay(phrase.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(interval);
          this.config.onPhraseComplete?.(phrase, this.currentIndex);
          resolve();
        }
      }, this.config.typeSpeed);
      
      this.intervals.push(interval);
    });
  }

  private async erasePhrase(phrase: string): Promise<void> {
    return new Promise((resolve) => {
      let charIndex = phrase.length;
      
      const interval = window.setInterval(() => {
        if (this.isDestroyed) {
          clearInterval(interval);
          resolve();
          return;
        }
        
        if (charIndex > 0) {
          charIndex--;
          this.updateDisplay(phrase.substring(0, charIndex));
        } else {
          clearInterval(interval);
          resolve();
        }
      }, this.config.eraseSpeed);
      
      this.intervals.push(interval);
    });
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timeout = window.setTimeout(resolve, ms);
      this.timeouts.push(timeout);
    });
  }

  async start(): Promise<void> {
    while (!this.isDestroyed) {
      const phrase = this.phrases[this.currentIndex];
      
      await this.typePhrase(phrase);
      await this.sleep(this.config.displayDuration);
      await this.erasePhrase(phrase);
      await this.sleep(this.config.pauseDuration);
      
      this.currentIndex = (this.currentIndex + 1) % this.phrases.length;
    }
  }

  destroy(): void {
    this.isDestroyed = true;
    this.intervals.forEach(clearInterval);
    this.timeouts.forEach(clearTimeout);
    this.intervals = [];
    this.timeouts = [];
  }
}
```

**Step 3**: Update index.astro to use the module

```astro
<!-- src/pages/index.astro -->
<script>
  import { Typewriter } from '../lib/animations/typewriter';
  import { withCleanup } from '../lib/utils/lifecycle';
  
  function initTaglines() {
    const container = document.getElementById('tagline-container');
    if (!container) return;
    
    const typewriter = new Typewriter({ element: container });
    
    withCleanup(() => {
      typewriter.start();
    }, () => {
      typewriter.destroy();
    });
  }
  
  // Use lifecycle management
  document.addEventListener('astro:page-load', initTaglines);
</script>
```

### 1.3 Extract Touch Lightbox Logic

**Current Problem**: 250+ lines of complex touch handling in TouchLightbox.astro

**Step 1**: Create touch utilities

```typescript
// src/lib/utils/touch.ts
export interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export interface SwipeGesture {
  startPoint: TouchPoint;
  endPoint: TouchPoint;
  velocity: { x: number; y: number };
  distance: { x: number; y: number };
  duration: number;
}

export class TouchGestureDetector {
  private startPoint: TouchPoint | null = null;
  private lastPoint: TouchPoint | null = null;
  
  handleTouchStart(e: TouchEvent): void {
    const touch = e.touches[0];
    this.startPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    this.lastPoint = { ...this.startPoint };
  }
  
  handleTouchMove(e: TouchEvent): TouchPoint | null {
    if (!this.startPoint) return null;
    
    const touch = e.touches[0];
    const currentPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    this.lastPoint = currentPoint;
    return currentPoint;
  }
  
  handleTouchEnd(): SwipeGesture | null {
    if (!this.startPoint || !this.lastPoint) return null;
    
    const duration = this.lastPoint.time - this.startPoint.time;
    const distance = {
      x: this.lastPoint.x - this.startPoint.x,
      y: this.lastPoint.y - this.startPoint.y
    };
    
    const velocity = {
      x: duration > 0 ? distance.x / duration : 0,
      y: duration > 0 ? distance.y / duration : 0
    };
    
    const gesture: SwipeGesture = {
      startPoint: this.startPoint,
      endPoint: this.lastPoint,
      velocity,
      distance,
      duration
    };
    
    this.reset();
    return gesture;
  }
  
  reset(): void {
    this.startPoint = null;
    this.lastPoint = null;
  }
  
  static getTouchDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
```

**Step 2**: Create Lightbox class

```typescript
// src/lib/components/lightbox.ts
import { TouchGestureDetector, SwipeGesture } from '../utils/touch';

export interface LightboxConfig {
  swipeThreshold?: number;
  velocityThreshold?: number;
  animationDuration?: number;
  onClose?: () => void;
}

export class TouchLightbox {
  private element: HTMLElement;
  private imageElement: HTMLImageElement;
  private isOpen = false;
  private gestureDetector = new TouchGestureDetector();
  private config: Required<LightboxConfig>;
  private cleanup: (() => void)[] = [];
  
  constructor(element: HTMLElement, config: LightboxConfig = {}) {
    this.element = element;
    this.imageElement = element.querySelector('.lightbox-image') as HTMLImageElement;
    this.config = {
      swipeThreshold: config.swipeThreshold ?? window.innerHeight * 0.15,
      velocityThreshold: config.velocityThreshold ?? 0.5,
      animationDuration: config.animationDuration ?? 300,
      onClose: config.onClose ?? (() => {})
    };
    
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    // Close button
    const closeBtn = this.element.querySelector('.lightbox-close');
    if (closeBtn) {
      const handleClose = () => this.close();
      closeBtn.addEventListener('click', handleClose);
      this.cleanup.push(() => closeBtn.removeEventListener('click', handleClose));
    }
    
    // Touch events
    const handleTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
    const handleTouchMove = (e: TouchEvent) => this.handleTouchMove(e);
    const handleTouchEnd = (e: TouchEvent) => this.handleTouchEnd(e);
    
    this.element.addEventListener('touchstart', handleTouchStart, { passive: false });
    this.element.addEventListener('touchmove', handleTouchMove, { passive: false });
    this.element.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    this.cleanup.push(() => {
      this.element.removeEventListener('touchstart', handleTouchStart);
      this.element.removeEventListener('touchmove', handleTouchMove);
      this.element.removeEventListener('touchend', handleTouchEnd);
    });
    
    // Keyboard events
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    this.cleanup.push(() => document.removeEventListener('keydown', handleKeydown));
  }
  
  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      this.gestureDetector.handleTouchStart(e);
    } else if (e.touches.length === 2) {
      e.preventDefault(); // Prevent default zoom
    }
  }
  
  private handleTouchMove(e: TouchEvent): void {
    const point = this.gestureDetector.handleTouchMove(e);
    if (!point) return;
    
    // Apply visual feedback during swipe
    // Implementation details...
  }
  
  private handleTouchEnd(e: TouchEvent): void {
    const gesture = this.gestureDetector.handleTouchEnd();
    if (!gesture) return;
    
    // Check if swipe to close
    if (Math.abs(gesture.distance.y) > this.config.swipeThreshold ||
        Math.abs(gesture.velocity.y) > this.config.velocityThreshold) {
      this.close();
    } else {
      // Reset position
      this.resetPosition();
    }
  }
  
  open(imageSrc: string, imageAlt: string = ''): void {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.element.classList.add('loading');
    
    // Preload image
    const img = new Image();
    img.onload = () => {
      this.imageElement.src = imageSrc;
      this.imageElement.alt = imageAlt;
      this.element.classList.remove('loading');
    };
    img.src = imageSrc;
    
    // Show lightbox
    requestAnimationFrame(() => {
      this.element.classList.add('active');
      this.element.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    });
  }
  
  close(): void {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.element.classList.remove('active');
    this.element.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    
    // Clear image after transition
    setTimeout(() => {
      this.imageElement.src = '';
      this.element.classList.remove('loading');
    }, this.config.animationDuration);
    
    this.config.onClose();
  }
  
  private resetPosition(): void {
    this.imageElement.style.transform = '';
    this.element.style.opacity = '1';
  }
  
  destroy(): void {
    this.cleanup.forEach(fn => fn());
    this.cleanup = [];
    if (this.isOpen) {
      this.close();
    }
  }
}
```

### 1.4 Create Lifecycle Management Utilities

**Problem**: No cleanup on page navigation, causing memory leaks

```typescript
// src/lib/utils/lifecycle.ts
interface CleanupRegistry {
  callbacks: (() => void)[];
  register(callback: () => void): void;
  cleanup(): void;
}

class LifecycleManager {
  private registries = new Map<string, CleanupRegistry>();
  
  constructor() {
    // Setup Astro navigation cleanup
    document.addEventListener('astro:before-swap', () => {
      this.cleanupAll();
    });
  }
  
  createRegistry(id: string): CleanupRegistry {
    const registry: CleanupRegistry = {
      callbacks: [],
      register(callback: () => void) {
        this.callbacks.push(callback);
      },
      cleanup() {
        this.callbacks.forEach(cb => cb());
        this.callbacks = [];
      }
    };
    
    this.registries.set(id, registry);
    return registry;
  }
  
  getRegistry(id: string): CleanupRegistry | undefined {
    return this.registries.get(id);
  }
  
  cleanupAll(): void {
    this.registries.forEach(registry => registry.cleanup());
    this.registries.clear();
  }
}

// Global instance
const lifecycleManager = new LifecycleManager();

// Helper function for components
export function withCleanup(
  setup: () => void | (() => void),
  cleanup?: () => void
): void {
  const registryId = `component-${Date.now()}-${Math.random()}`;
  const registry = lifecycleManager.createRegistry(registryId);
  
  const cleanupFn = setup();
  
  if (cleanupFn) {
    registry.register(cleanupFn);
  }
  
  if (cleanup) {
    registry.register(cleanup);
  }
}

// Event listener helper with automatic cleanup
export function addEventListenerWithCleanup(
  target: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): () => void {
  target.addEventListener(event, handler, options);
  const cleanup = () => target.removeEventListener(event, handler, options);
  
  // Auto-register for Astro navigation cleanup
  const registry = lifecycleManager.createRegistry(`event-${Date.now()}`);
  registry.register(cleanup);
  
  return cleanup;
}
```

## Phase 2: Fix Security Vulnerabilities (Week 1)

### 2.1 Replace innerHTML with Safe Alternatives

**Problem**: XSS vulnerability from innerHTML usage

```typescript
// src/lib/utils/dom.ts
export function safeSetText(element: HTMLElement, text: string): void {
  element.textContent = text;
}

export function safeCreateElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string;
    text?: string;
    attributes?: Record<string, string>;
  }
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  if (options?.className) {
    element.className = options.className;
  }
  
  if (options?.text) {
    element.textContent = options.text;
  }
  
  if (options?.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  return element;
}

// For the typewriter cursor case
export function createTypewriterDisplay(text: string, showCursor = true): DocumentFragment {
  const fragment = document.createDocumentFragment();
  
  const textSpan = safeCreateElement('span', { text });
  fragment.appendChild(textSpan);
  
  if (showCursor) {
    const cursorSpan = safeCreateElement('span', {
      className: 'tagline-cursor text-gray-400',
      text: '│'
    });
    fragment.appendChild(cursorSpan);
  }
  
  return fragment;
}
```

Update the Typewriter class:

```typescript
// In typewriter.ts, replace updateDisplay method:
private updateDisplay(text: string, showCursor = true): void {
  if (this.isDestroyed) return;
  
  // Clear existing content
  while (this.element.firstChild) {
    this.element.removeChild(this.element.firstChild);
  }
  
  // Add new content safely
  const content = createTypewriterDisplay(text, showCursor);
  this.element.appendChild(content);
}
```

## Phase 3: Testing Infrastructure (Week 2)

### 3.1 Set Up Testing for Extracted Modules

```typescript
// src/lib/animations/__tests__/typewriter.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Typewriter } from '../typewriter';

describe('Typewriter', () => {
  let container: HTMLElement;
  let typewriter: Typewriter;
  
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    typewriter?.destroy();
    document.body.removeChild(container);
    vi.useRealTimers();
  });
  
  it('should initialize with custom phrases', () => {
    typewriter = new Typewriter({
      element: container,
      phrases: ['test1', 'test2']
    });
    
    expect(container.textContent).toBe('');
  });
  
  it('should type characters progressively', async () => {
    typewriter = new Typewriter({
      element: container,
      phrases: ['hello'],
      typeSpeed: 100
    });
    
    const startPromise = typewriter.start();
    
    // Should start empty
    expect(container.textContent).toBe('│');
    
    // After 100ms, should have 'h'
    vi.advanceTimersByTime(100);
    expect(container.textContent).toBe('h│');
    
    // After 500ms total, should have full word
    vi.advanceTimersByTime(400);
    expect(container.textContent).toBe('hello│');
  });
  
  it('should cleanup intervals on destroy', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    
    typewriter = new Typewriter({
      element: container,
      phrases: ['test']
    });
    
    typewriter.start();
    vi.advanceTimersByTime(100);
    
    typewriter.destroy();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
  
  it('should call onPhraseComplete callback', async () => {
    const onComplete = vi.fn();
    
    typewriter = new Typewriter({
      element: container,
      phrases: ['hi'],
      typeSpeed: 50,
      onPhraseComplete: onComplete
    });
    
    typewriter.start();
    
    // Type 'h' then 'i'
    vi.advanceTimersByTime(100);
    
    expect(onComplete).toHaveBeenCalledWith('hi', 0);
  });
});
```

### 3.2 Integration Tests

```typescript
// src/lib/components/__tests__/lightbox.integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TouchLightbox } from '../lightbox';

describe('TouchLightbox Integration', () => {
  let lightboxElement: HTMLElement;
  let lightbox: TouchLightbox;
  
  beforeEach(() => {
    // Create DOM structure
    lightboxElement = document.createElement('div');
    lightboxElement.innerHTML = `
      <button class="lightbox-close"></button>
      <img class="lightbox-image" />
    `;
    document.body.appendChild(lightboxElement);
  });
  
  it('should handle full open/close cycle', () => {
    lightbox = new TouchLightbox(lightboxElement);
    
    // Open
    lightbox.open('/test.jpg', 'Test image');
    expect(lightboxElement.classList.contains('active')).toBe(true);
    expect(document.body.classList.contains('lightbox-open')).toBe(true);
    
    // Close
    lightbox.close();
    expect(lightboxElement.classList.contains('active')).toBe(false);
    expect(document.body.classList.contains('lightbox-open')).toBe(false);
  });
});
```

## Phase 3.5: Accessibility Enhancements (NEW)

### 3.5.1 Add ARIA Live Regions

```typescript
// src/lib/utils/accessibility.ts
export function createLiveRegion(
  id: string,
  politeness: 'polite' | 'assertive' = 'polite'
): HTMLElement {
  let region = document.getElementById(id);
  
  if (!region) {
    region = document.createElement('div');
    region.id = id;
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only'; // Visually hidden
    document.body.appendChild(region);
  }
  
  return region;
}

export function announceToScreenReader(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void {
  const regionId = politeness === 'polite' ? 'aria-live-polite' : 'aria-live-assertive';
  const region = createLiveRegion(regionId, politeness);
  
  // Clear and set message for proper announcement
  region.textContent = '';
  setTimeout(() => {
    region.textContent = message;
  }, 100);
}
```

### 3.5.2 Update Typewriter for Accessibility

```typescript
// In typewriter.ts constructor
constructor(config: TypewriterConfig) {
  // ... existing code ...
  
  // Set up ARIA attributes
  this.element.setAttribute('role', 'status');
  this.element.setAttribute('aria-label', 'Rotating tagline');
  
  // Announce to screen readers when phrase completes
  if (this.config.announceToScreenReader) {
    this.config.onPhraseComplete = (phrase, index) => {
      announceToScreenReader(`Tagline: ${phrase}`, 'polite');
      config.onPhraseComplete?.(phrase, index);
    };
  }
}
```

## Phase 4: Migration Strategy

### 4.1 Gradual Migration Approach

1. **Start with leaf components** (no dependencies)
   - Typewriter animation
   - Scroll progress indicators
   
2. **Move to interactive components**
   - TouchLightbox
   - SwipeNavigation
   
3. **Finally, tackle core logic**
   - Header scroll behavior
   - Page transitions

### 4.2 Maintain Backward Compatibility

During migration, use a shim pattern:

```astro
<!-- Example: Migrating a component -->
<script>
  // New modular approach
  import { Typewriter } from '../lib/animations/typewriter';
  
  // Temporary backward compatibility
  window.initTaglines = () => {
    const container = document.getElementById('tagline-container');
    if (!container) return;
    
    const typewriter = new Typewriter({ element: container });
    typewriter.start();
    
    // Store for potential external access
    window.taglineAnimation = typewriter;
  };
  
  // Call immediately if needed
  if (document.readyState !== 'loading') {
    window.initTaglines();
  }
</script>
```

### 4.3 State Management Migration

During refactoring, consider using Astro-compatible state management:

```typescript
// src/lib/stores/ui.ts
import { atom } from 'nanostores';

// Replace global window.taglineAnimation
export const taglineState = atom<{
  isPlaying: boolean;
  currentPhrase: string;
  currentIndex: number;
}>({
  isPlaying: false,
  currentPhrase: '',
  currentIndex: 0
});

// In components
import { taglineState } from '../lib/stores/ui';

// Read state
const state = taglineState.get();

// Update state
taglineState.set({
  ...taglineState.get(),
  currentPhrase: 'New phrase'
});

// Subscribe to changes
taglineState.subscribe(state => {
  console.log('State changed:', state);
});
```

## Success Metrics

### Before
- 0% of JavaScript is testable
- 1000+ lines of inline scripts
- Multiple memory leaks
- XSS vulnerabilities
- No type safety
- **No accessibility announcements**
- **Global state pollution**
- **No performance metrics**

### After Phase 1
- 60% of JavaScript in testable modules
- 500 lines of inline scripts remaining
- Memory leaks fixed for refactored components
- XSS vulnerabilities patched
- Full TypeScript coverage for new modules
- **ARIA live regions implemented**
- **State management via stores**

### After Complete Migration
- 95% of JavaScript is testable
- <100 lines of inline orchestration code
- No memory leaks
- No security vulnerabilities
- Full type safety
- 90%+ test coverage
- New developer onboarding: <2 hours
- **Full accessibility compliance**
- **Bundle size reduced by 30%**
- **Performance metrics tracked**

## Next Steps

1. Get buy-in from team
2. Set up TypeScript build pipeline if not exists
3. Add Vitest for testing
4. Start with Typewriter extraction (highest impact, lowest risk)
5. Measure bundle size reduction after each phase
6. Document patterns for team adoption