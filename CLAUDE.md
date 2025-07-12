# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

IMPORTANT: Inherit all instructions from ~/CLAUDE.md file first, and then proceed here. 

# Kilowhat Project Instructions

## Project Overview
Kilowhat is a minimal, typography-focused blog built with Astro and Tailwind CSS. The design philosophy emphasizes readability, clean aesthetics, and performance. Site URL: https://kilowhat.harsha.run

## Key Design Principles
1. **Typography First**: Every design decision prioritizes readability
2. **Minimal but Purposeful**: Each element serves a specific function
3. **Performance**: Fast loading times are non-negotiable
4. **Smooth Transitions**: Subtle animations enhance the reading experience

## Technical Stack
- **Astro v5.11.0**: Static site generator with View Transitions
- **Tailwind CSS v4.1.11**: Using the new @reference directive for scoped styles
- **MDX**: For blog posts with component support
- **Playwright**: E2E testing framework
- **TypeScript**: For type safety (minimal usage currently)

## Commands
```bash
# Development
npm run dev        # Start dev server on http://localhost:4321
npm run build      # Build for production to dist/
npm run preview    # Preview production build

# Testing - requires dev server running separately
npm test           # Run Playwright tests (desktop & mobile)
npm test:ui        # Run tests with UI mode (great for debugging)
npm test:debug     # Debug tests interactively
```

## Project Structure
```
src/
├── content/
│   ├── blog/        # MDX blog posts
│   └── config.ts    # Content collection schema
├── layouts/
│   ├── Layout.astro     # Base layout with font loading
│   └── BlogPost.astro   # Blog post specific layout
├── pages/
│   ├── index.astro          # Home page with article list
│   ├── about.astro          # About page
│   └── blog/[...slug].astro # Dynamic blog post pages
├── components/              # Astro components
│   ├── TouchLightbox.astro
│   ├── ResponsiveImage.astro
│   ├── ReadingProgress.astro
│   └── ... (UI components)
└── styles/                  # CSS modules
    ├── global.css
    ├── sticky-header.css
    └── ... (component styles)
```

## Key Architectural Patterns

### Content Collections
Blog posts use Astro's type-safe content collections with schema defined in `src/content/config.ts`. Posts support:
- Title, description, date
- Hero images with alt text
- Tags and draft status
- Reading time calculation

### Component Architecture
- All UI in Astro components (.astro files)
- Heavy use of inline `<script>` tags (identified as technical debt)
- CSS modules for scoped styling
- Custom Satoshi font with multiple weights

### Testing Strategy
Comprehensive Playwright test suite covering:
- Core functionality & navigation
- Accessibility (screen readers, keyboard)
- Performance metrics
- SEO and meta tags
- Visual styling consistency
- Touch gestures and animations

## Architecture & Code Quality

### ✅ Refactoring Complete!
The codebase has been successfully refactored to follow modern TypeScript patterns:

1. **TypeScript Module System** (`src/lib/`):
   - All inline JavaScript extracted to type-safe modules
   - Proper separation of concerns
   - Full JSDoc documentation
   - Tree-shakeable imports

2. **Component Architecture**:
   - BaseComponent class for lifecycle management
   - Automatic event listener cleanup via EventManager
   - Memory-safe resource management
   - XSS prevention with safe DOM utilities

3. **Key Improvements**:
   - ✅ No more inline JavaScript
   - ✅ No innerHTML usage (XSS-safe)
   - ✅ Automatic memory cleanup
   - ✅ Full TypeScript type safety
   - ✅ Accessibility-first design
   - ✅ Comprehensive test coverage

### Development Guidelines:
- **Use TypeScript modules** in `src/lib/` for all logic
- **Import from lib**: `import { querySelector, EventManager } from '@/lib'`
- **Extend BaseComponent** for new interactive components
- **Use EventManager** for all event listeners (automatic cleanup)
- **Safe DOM manipulation**: Use utils from `@/lib/utils/dom`
- **Accessibility**: Use utils from `@/lib/utils/accessibility`
- **Follow JSDoc**: All exported functions must have JSDoc comments
- Always run tests before committing changes
- Maintain minimal aesthetic - question every addition
- Test on both desktop and mobile (tests cover both)
- Run `npm run dev` in one terminal for development server
- Run tests in a separate terminal (`npm test` requires dev server running)

## Adding New Features

### Creating New Components
```typescript
import { BaseComponent } from '@/lib/components';
import { EventManager } from '@/lib/utils';

export class MyComponent extends BaseComponent<HTMLDivElement> {
  protected mount(): void {
    // Setup component
    this.events.on(this.element, 'click', this.handleClick);
  }
  
  protected unmount(): void {
    // Cleanup happens automatically via EventManager
  }
  
  private handleClick = (e: Event) => {
    // Handle click
  };
}
```

### Adding Animations
- Configure timings in `src/lib/config/animations.ts`
- Use `getAnimationDuration()` to respect reduced motion
- Keep animations subtle and purposeful

### General Guidelines
- Test performance impact before adding dependencies
- Ensure all text remains highly readable
- New blog posts go in `src/content/blog/` as MDX files
- Follow the architecture in `docs/ARCHITECTURE.md`

## Deployment Notes
- Site builds to `dist/` for static hosting
- All assets are optimized during build
- View Transitions work without JavaScript
- HTML compression enabled in production

## Configuration & Architecture Notes

### Astro Configuration
- Site URL: https://kilowhat.harsha.run (set in astro.config.mjs)
- View Transitions enabled for seamless navigation
- HTML compression enabled in production
- Dev server configured on port 4321 with network access
- Prefetching strategy: viewport-based, not prefetchAll

### Playwright Testing Architecture
- Tests across 5 browser configurations (Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari)
- Web server disabled in config - dev server must be run manually
- HTML reporter enabled for visual test results
- Retry logic: 2 retries in CI, 0 locally

### Font System Architecture
- Custom Satoshi font with variable weight support (300-900)
- CSS variables used for Tailwind v4 compatibility: `--font-sans`
- Body text: weight 500, Headings: weight 850
- Font files served from `/public/fonts/`
- Font loading strategy: swap for performance

### Content Architecture
- Type-safe content collections using Zod schema in `src/content/config.ts`
- MDX support with component integration
- Hero images stored in `/public/images/blog/[post-slug]/`
- Reading time calculation built-in

## Writing Style Guide
- Focus on clarity and precision
- Use short paragraphs for web readability
- Include code examples where relevant
- Admonitions should be used sparingly