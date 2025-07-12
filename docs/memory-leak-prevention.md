# Memory Leak Prevention Guide

## Overview

This guide documents the memory leak prevention strategies implemented in the Kilowhat codebase. With Astro's View Transitions, pages are not fully reloaded during navigation, making it crucial to properly clean up event listeners, observers, and other resources.

## Key Principles

1. **Always pair setup with cleanup**: Every `addEventListener` needs a corresponding `removeEventListener`
2. **Use `astro:before-swap` for cleanup**: This event fires before page navigation
3. **Store references**: Keep references to handlers and observers for proper cleanup
4. **Cancel animations**: Always cancel `requestAnimationFrame` and clear timeouts/intervals

## Implementation Patterns

### Basic Event Listener Pattern

```javascript
<script>
  let scrollHandler;
  
  function init() {
    // Clean up first
    cleanup();
    
    // Define handler
    scrollHandler = (e) => {
      // Handle event
    };
    
    // Add listener
    window.addEventListener('scroll', scrollHandler);
  }
  
  function cleanup() {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
      scrollHandler = null;
    }
  }
  
  // Initialize on page load
  document.addEventListener('astro:page-load', init);
  
  // Clean up on page navigation
  document.addEventListener('astro:before-swap', cleanup);
</script>
```

### Observer Pattern (IntersectionObserver, ResizeObserver, etc.)

```javascript
<script>
  let observer;
  
  function init() {
    // Clean up existing observer
    if (observer) {
      observer.disconnect();
    }
    
    // Create new observer
    observer = new IntersectionObserver((entries) => {
      // Handle intersections
    });
    
    // Start observing
    const elements = document.querySelectorAll('.observe-me');
    elements.forEach(el => observer.observe(el));
  }
  
  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
  
  document.addEventListener('astro:page-load', init);
  document.addEventListener('astro:before-swap', cleanup);
</script>
```

### Animation Frame Pattern

```javascript
<script>
  let animationId;
  let isAnimating = false;
  
  function animate() {
    // Your animation logic
    
    if (isAnimating) {
      animationId = requestAnimationFrame(animate);
    }
  }
  
  function startAnimation() {
    isAnimating = true;
    animate();
  }
  
  function stopAnimation() {
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  document.addEventListener('astro:before-swap', stopAnimation);
</script>
```

### Using EventManager Utility

For complex components with multiple event listeners, use the EventManager utility:

```javascript
<script>
  import { EventManager } from '@/lib/utils/events';
  
  let eventManager;
  
  function init() {
    // Clean up previous instance
    if (eventManager) {
      eventManager.cleanup();
    }
    
    // Create new instance
    eventManager = new EventManager();
    
    // Add listeners - they're automatically tracked
    eventManager.on(window, 'scroll', handleScroll);
    eventManager.on(window, 'resize', handleResize);
    eventManager.on(document, 'click', handleClick);
  }
  
  function cleanup() {
    if (eventManager) {
      eventManager.cleanup(); // Removes all tracked listeners
      eventManager = null;
    }
  }
  
  document.addEventListener('astro:page-load', init);
  document.addEventListener('astro:before-swap', cleanup);
</script>
```

## Components with Memory Leak Prevention

### SwipeNavigation.astro
- Removes touch event listeners on navigation
- Cleans up DOM classes
- Stores cleanup function in window object

### ReadingProgress.astro
- Removes scroll and resize listeners
- Cancels pending animation frames
- Removes progress bar element

### ScrollTextReveal.astro
- Disconnects IntersectionObserver
- Properly cleans up observed elements

### TouchLightbox.astro
- Removes all event listeners (click, keydown, touch)
- Cancels animation frames
- Closes lightbox if open during navigation

### LogoScrollTransform.astro
- Removes scroll listener
- Removes dynamically created sticky header element

## Testing for Memory Leaks

1. **Chrome DevTools**:
   - Open Memory Profiler
   - Take heap snapshot
   - Navigate between pages multiple times
   - Take another snapshot
   - Compare snapshots for growing memory usage

2. **Check Active Listeners**:
   - In Chrome DevTools Console:
   ```javascript
   getEventListeners(window);
   getEventListeners(document);
   ```

3. **Manual Testing**:
   - Navigate between pages rapidly
   - Check if animations/interactions still work correctly
   - Verify no duplicate elements are created

## Common Pitfalls

1. **Anonymous Functions**: Always store function references for removal
   ```javascript
   // Bad - can't remove this listener
   window.addEventListener('scroll', () => { });
   
   // Good - can remove using the reference
   const handler = () => { };
   window.addEventListener('scroll', handler);
   ```

2. **Third-party Libraries**: Ensure they have cleanup methods
3. **Global State**: Reset any window/global variables
4. **DOM References**: Clear references to removed DOM elements

## Future Improvements

1. Consider implementing a global cleanup registry
2. Add automated memory leak detection tests
3. Create ESLint rules for memory leak prevention
4. Add performance monitoring for memory usage