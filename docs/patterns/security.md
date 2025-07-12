# Security Patterns

## XSS Prevention

### Safe DOM Manipulation

Never use `innerHTML` with user content. Use safe utilities:

```typescript
import { setTextContent, createElement } from '@/lib/utils/dom';

// Safe text content
setTextContent(element, userInput);

// Safe element creation
const div = createElement('div', {
  className: 'safe-content',
  textContent: userInput
});
```

### Content Security

1. **No innerHTML**: All dynamic content uses textContent
2. **Attribute Safety**: Use setAttribute for dynamic attributes
3. **Event Handlers**: Attach via addEventListener, not onclick
4. **URL Validation**: Validate all dynamic URLs

## Input Sanitization

```typescript
// Escape HTML entities
function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Safe attribute setting
function setSafeAttribute(el: Element, attr: string, value: string) {
  if (attr === 'href' || attr === 'src') {
    // Validate URL
    if (!isValidUrl(value)) return;
  }
  el.setAttribute(attr, value);
}
```

## TypeScript Safety

1. **Strict Mode**: Enabled for null safety
2. **Type Guards**: Validate input types
3. **Const Assertions**: Immutable configurations

## Best Practices

- Always escape user input
- Use Content Security Policy headers
- Validate all external data
- Regular security audits