# Component Architecture

## BaseComponent Pattern

All interactive components extend from `BaseComponent` for consistent lifecycle management:

```typescript
class BaseComponent<T extends HTMLElement> {
  protected element: T
  protected options: BaseComponentOptions
  protected events: EventManager
  
  // Lifecycle hooks
  protected mount(): void    // Setup
  protected unmount(): void  // Cleanup
  destroy(): void           // Public cleanup
}
```

## Component Examples

### TouchLightbox Component

```typescript
class TouchLightbox extends BaseComponent<HTMLDivElement> {
  protected mount(): void {
    // Setup event listeners
    this.events.on(this.element, 'click', this.handleClick)
    this.events.on(document, 'keydown', this.handleKeydown)
  }
  
  protected unmount(): void {
    // Cleanup happens automatically via EventManager
  }
}
```

### Key Features

1. **Automatic Cleanup** - EventManager handles listener removal
2. **Type Safety** - Full TypeScript support
3. **Lifecycle Management** - Consistent mount/unmount pattern
4. **Memory Safe** - No memory leaks

## Creating New Components

1. Extend `BaseComponent`
2. Implement `mount()` for setup
3. Use `this.events` for event handling
4. Cleanup happens automatically

```typescript
export class MyComponent extends BaseComponent<HTMLElement> {
  protected mount(): void {
    // Your setup code here
  }
}
```