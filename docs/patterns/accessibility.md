# Accessibility Patterns

## Screen Reader Support

### Live Regions

```typescript
import { announceToScreenReader } from '@/lib/utils/accessibility';

// Announce status changes
announceToScreenReader('Image opened in lightbox');
announceToScreenReader('Loading complete', 'assertive');
```

### ARIA Attributes

```typescript
// Set ARIA states
element.setAttribute('aria-expanded', 'true');
element.setAttribute('aria-label', 'Close dialog');
element.setAttribute('role', 'dialog');
```

## Keyboard Navigation

### Focus Management

```typescript
import { FocusTrap } from '@/lib/utils/accessibility';

// Trap focus in modal
const trap = new FocusTrap(modalElement);
trap.activate();

// On close
trap.deactivate();
```

### Keyboard Handlers

```typescript
function handleKeyboard(e: KeyboardEvent) {
  switch(e.key) {
    case 'Escape':
      closeModal();
      break;
    case 'Tab':
      if (e.shiftKey) {
        focusPrevious();
      } else {
        focusNext();
      }
      break;
  }
}
```

## Motion Preferences

```typescript
import { respectsMotionPreference } from '@/lib/utils/accessibility';

// Check preference
if (respectsMotionPreference()) {
  element.style.transition = 'opacity 0.3s';
} else {
  element.style.transition = 'none';
}
```

## Best Practices

1. **Semantic HTML**: Use proper elements
2. **Alt Text**: Always include for images
3. **Focus Indicators**: Visible focus states
4. **Skip Links**: Navigation shortcuts
5. **Color Contrast**: WCAG AA minimum