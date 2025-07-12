# Kilowhat Architecture

## Overview

Kilowhat is a minimal, typography-focused blog built with Astro and Tailwind CSS. The architecture has been refactored to follow modern TypeScript patterns with proper separation of concerns.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Client Browser"
        UI[User Interface]
    end
    
    subgraph "Astro Pages"
        HP[Home Page<br/>index.astro]
        AP[About Page<br/>about.astro]
        BP[Blog Pages<br/>blog/[...slug].astro]
    end
    
    subgraph "Astro Components"
        HC[Header.astro]
        FC[Footer.astro]
        TL[TouchLightbox.astro]
        RI[ResponsiveImage.astro]
        RP[ReadingProgress.astro]
    end
    
    subgraph "TypeScript Library (src/lib)"
        subgraph "Components"
            BC[BaseComponent]
            TLC[TouchLightbox Class]
            BC --> TLC
        end
        
        subgraph "Animations"
            TW[Typewriter]
        end
        
        subgraph "Utils"
            DOM[DOM Utils]
            EVT[Event Manager]
            A11Y[Accessibility]
        end
        
        subgraph "Config"
            ANIM[Animation Config]
            DIM[Dimensions]
            CLR[Colors]
        end
    end
    
    subgraph "Content"
        MDX[MDX Blog Posts]
        IMG[Images]
    end
    
    subgraph "Build Output"
        DIST[Static HTML/CSS/JS]
    end
    
    UI --> HP
    UI --> AP
    UI --> BP
    
    HP --> HC
    HP --> FC
    HP --> TW
    
    BP --> HC
    BP --> FC
    BP --> TL
    BP --> RI
    BP --> RP
    BP --> MDX
    
    TL --> TLC
    TLC --> DOM
    TLC --> EVT
    TLC --> A11Y
    
    TW --> DOM
    TW --> EVT
    TW --> A11Y
    TW --> ANIM
    
    MDX --> IMG
    
    HP --> DIST
    AP --> DIST
    BP --> DIST
```

## Key Architectural Decisions

### 1. TypeScript Module System

All JavaScript has been extracted into TypeScript modules in `src/lib/`:

- **Type Safety**: Full TypeScript support with strict mode
- **Modular Design**: Clear separation of concerns
- **Tree Shaking**: Only import what you use
- **IntelliSense**: Better developer experience

### 2. Component Architecture

```typescript
// BaseComponent provides lifecycle management
class BaseComponent<T extends HTMLElement> {
  protected element: T
  protected options: BaseComponentOptions
  protected events: EventManager
  
  // Lifecycle methods
  protected mount(): void
  protected unmount(): void
  destroy(): void
}

// Components extend BaseComponent
class TouchLightbox extends BaseComponent<HTMLDivElement> {
  // Component-specific implementation
}
```

### 3. Memory Management

- **EventManager**: Automatic cleanup of event listeners
- **Resource Tracking**: Components track and clean up resources
- **Lifecycle Methods**: Proper mount/unmount patterns

### 4. Security

- **XSS Prevention**: Safe DOM manipulation utilities
- **No innerHTML**: All content is safely escaped
- **Type Safety**: TypeScript prevents many runtime errors

### 5. Accessibility

- **Screen Reader Support**: Built-in ARIA announcements
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: FocusTrap for modals
- **Reduced Motion**: Respects user preferences

## Module Structure

### Utils (`src/lib/utils/`)

- **dom.ts**: Safe DOM manipulation functions
- **events.ts**: Event handling with automatic cleanup
- **accessibility.ts**: Screen reader and ARIA utilities

### Components (`src/lib/components/`)

- **BaseComponent.ts**: Base class for all components
- **TouchLightbox.ts**: Touch-enabled image lightbox

### Animations (`src/lib/animations/`)

- **typewriter.ts**: Accessible typewriter effect

### Config (`src/lib/config/`)

- **animation.ts**: Animation timings and settings
- **animations.ts**: Comprehensive animation config
- **colors.ts**: Color system
- **dimensions.ts**: Layout dimensions

## Data Flow

1. **Content Creation**: MDX files in `src/content/blog/`
2. **Build Time**: Astro processes MDX and generates static HTML
3. **Client Side**: TypeScript modules enhance interactivity
4. **User Interaction**: Components handle events and update UI

## Performance Optimizations

1. **Static Generation**: All pages are pre-rendered
2. **View Transitions**: Smooth navigation without full page loads
3. **Lazy Loading**: Images load on demand
4. **Font Loading**: Optimized with font-display: swap
5. **Code Splitting**: Modules are loaded as needed

## Testing Architecture

```
tests/
├── core.spec.ts         # Core functionality
├── accessibility.spec.ts # A11y tests
├── performance.spec.ts  # Performance metrics
├── seo.spec.ts         # SEO validation
└── visual.spec.ts      # Visual regression
```

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Type Checking**: TypeScript compiler
3. **Testing**: Playwright E2E tests
4. **Building**: `npm run build`
5. **Preview**: `npm run preview`

## Future Considerations

1. **Unit Testing**: Add Vitest for component testing
2. **State Management**: Consider adding a store if needed
3. **API Integration**: Structure ready for API calls
4. **Progressive Enhancement**: Works without JavaScript