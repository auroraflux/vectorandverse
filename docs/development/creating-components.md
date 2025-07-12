# Creating Components

## Component Types

### 1. Astro Components (.astro)
For UI rendering and layouts

```astro
---
export interface Props {
  title: string;
  variant?: 'default' | 'large';
}

const { title, variant = 'default' } = Astro.props;
---

<div class={`component ${variant}`}>
  <h2>{title}</h2>
  <slot />
</div>
```

### 2. TypeScript Components (.ts)
For interactive behavior

```typescript
import { BaseComponent } from '@/lib/components';
import { EventManager } from '@/lib/utils';

export class InteractiveComponent extends BaseComponent<HTMLElement> {
  protected mount(): void {
    this.events.on(this.element, 'click', this.handleClick);
  }
  
  private handleClick = (e: Event) => {
    // Handle interaction
  };
}
```

### 3. MDX Components
For markdown enhancement

```typescript
// In src/components/mdx/index.ts
export const mdxComponents = {
  CustomBlock: (props: any) => {
    return <div class="custom-block">{props.children}</div>;
  }
};
```

## Development Workflow

### 1. Check for Existing Components
```bash
# Search for similar functionality
find src/components -name "*.astro" | xargs grep -l "similar_pattern"
find src/lib/components -name "*.ts" | xargs grep -l "similar_behavior"
```

### 2. Follow Naming Conventions
- **Astro components**: PascalCase.astro
- **TS components**: PascalCase.ts
- **CSS classes**: kebab-case
- **Props**: camelCase

### 3. Use Existing Patterns

#### For Styling
```astro
<!-- Use existing Tailwind patterns -->
<div class="max-w-7xl mx-auto px-6">
  <!-- Content -->
</div>
```

#### For Typography
```astro
<!-- Follow site typography scale -->
<h2 class="text-4xl md:text-5xl" style="font-weight: 850;">
  {title}
</h2>
```

#### For Animations
```typescript
import { getAnimationDuration } from '@/lib/config';

const duration = getAnimationDuration('normal'); // Respects motion preferences
```

## Component Checklist

### Functionality
- [ ] Follows existing component patterns
- [ ] Uses TypeScript for type safety
- [ ] Implements proper error handling
- [ ] Supports SSR (works without JavaScript)

### Accessibility
- [ ] Semantic HTML elements
- [ ] Proper ARIA attributes
- [ ] Keyboard navigation support
- [ ] Screen reader announcements
- [ ] Focus management

### Performance
- [ ] No memory leaks (automatic cleanup)
- [ ] Respects motion preferences
- [ ] Lazy loading where appropriate
- [ ] Optimal bundle size

### Testing
- [ ] Playwright tests for interactions
- [ ] Accessibility tests
- [ ] Mobile responsiveness tests
- [ ] Performance impact tests

## Integration Steps

1. **Create component files**
2. **Add to appropriate directory**
3. **Export from index files**
4. **Update documentation**
5. **Add tests**
6. **Test in development**
7. **Update type definitions if needed**