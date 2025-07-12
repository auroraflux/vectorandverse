# Memory Management Patterns

## Overview

With Astro View Transitions, pages don't fully reload. Proper cleanup prevents memory leaks.

## Core Pattern

```javascript
let handler;

function init() {
  // Clean up first
  cleanup();
  
  // Setup new handler
  handler = (e) => { /* ... */ };
  window.addEventListener('scroll', handler);
}

function cleanup() {
  if (handler) {
    window.removeEventListener('scroll', handler);
    handler = null;
  }
}

// Lifecycle hooks
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', cleanup);
```

## EventManager Pattern

For multiple listeners:

```javascript
import { EventManager } from '@/lib/utils/events';

let events;

function init() {
  if (events) events.cleanup();
  
  events = new EventManager();
  events.on(window, 'scroll', handleScroll);
  events.on(window, 'resize', handleResize);
}

function cleanup() {
  if (events) {
    events.cleanup(); // Removes all
    events = null;
  }
}
```

## Observer Pattern

```javascript
let observer;

function init() {
  if (observer) observer.disconnect();
  
  observer = new IntersectionObserver(callback);
  elements.forEach(el => observer.observe(el));
}

function cleanup() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
```

## Testing for Leaks

1. Chrome DevTools → Memory Profiler
2. Navigate between pages multiple times
3. Check for growing memory usage
4. Verify no duplicate listeners:
   ```javascript
   getEventListeners(window);
   ```