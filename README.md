# Kilowhat

A minimal, typography-focused blog built with Astro and Tailwind CSS.

## Features

- ✨ Clean, minimal design focused on readability
- 📝 Typography-first approach with careful font selection
- 🎯 Smooth page transitions with Astro View Transitions
- 🎨 Minimal styled components (blockquotes, code blocks, admonitions)
- ⚡ Optimized for performance
- 📱 Fully responsive design
- ♿ Accessibility-first approach with screen reader support
- 🧪 Comprehensive test coverage with Playwright
- 🏗️ Modular TypeScript architecture

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Playwright](https://playwright.dev/) - E2E testing framework
- Custom Satoshi font with variable weights

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:4321 in your browser

## Development

### Commands

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

### Project Architecture

The codebase follows a modular TypeScript architecture:

```
src/
├── lib/                  # TypeScript modules (NEW)
│   ├── animations/       # Animation components
│   │   ├── typewriter.ts # Typewriter effect with accessibility
│   │   └── index.ts      # Animation exports
│   ├── components/       # UI components
│   │   ├── BaseComponent.ts  # Base class for all components
│   │   ├── TouchLightbox.ts  # Touch-enabled lightbox
│   │   └── index.ts          # Component exports
│   ├── config/           # Configuration constants
│   │   ├── animation.ts  # Animation timings & settings
│   │   ├── colors.ts     # Color system
│   │   └── dimensions.ts # Layout dimensions
│   └── utils/            # Utility functions
│       ├── dom.ts        # Safe DOM manipulation
│       ├── events.ts     # Event handling with cleanup
│       └── accessibility.ts # Screen reader utilities
├── content/
│   ├── blog/            # MDX blog posts
│   └── config.ts        # Content collection schema
├── layouts/
│   ├── Layout.astro     # Base layout with font loading
│   └── BlogPost.astro   # Blog post specific layout
├── pages/
│   ├── index.astro      # Home page
│   ├── about.astro      # About page
│   └── blog/[...slug].astro # Dynamic blog routes
├── components/          # Astro components
│   ├── Header.astro
│   ├── Footer.astro
│   └── ... (UI components)
└── styles/              # CSS modules
    ├── global.css
    └── ... (component styles)
```

### Key Architectural Improvements

1. **TypeScript Modules**: All JavaScript has been extracted into type-safe TypeScript modules in `src/lib/`
2. **Component Architecture**: Object-oriented design with `BaseComponent` class for consistent lifecycle management
3. **Memory Safety**: Automatic event listener cleanup and proper resource management
4. **XSS Prevention**: Safe DOM manipulation utilities that prevent innerHTML vulnerabilities
5. **Accessibility**: Built-in screen reader support and ARIA announcements
6. **Test Coverage**: Comprehensive Playwright tests for all functionality

## Adding Blog Posts

Create new blog posts in `src/content/blog/` with the following frontmatter:

```markdown
---
title: 'Your Post Title'
description: 'A brief description of your post.'
date: 2024-01-15
heroImage: '/images/blog/your-post/hero.jpg'
heroAlt: 'Description of hero image'
tags: ['tag1', 'tag2']
draft: false
---

Your content here...
```

### MDX Support

Blog posts support MDX, allowing you to import and use components:

```mdx
import ResponsiveImage from '../../components/ResponsiveImage.astro';

<ResponsiveImage 
  src="/images/example.jpg" 
  alt="Example image"
  width={800}
  height={600}
/>
```

## Customization

### Styling
- **Fonts**: Edit the font imports in `src/layouts/Layout.astro`
- **Colors**: Modify color constants in `src/lib/config/colors.ts`
- **Typography**: Adjust prose styles in `tailwind.config.mjs`
- **Animations**: Configure timings in `src/lib/config/animation.ts`

### Components
- **Typewriter**: Customize taglines in `src/lib/config/animation.ts`
- **Lightbox**: Configure touch gestures in `src/lib/components/TouchLightbox.ts`
- **Header**: Modify sticky behavior in `src/components/Header.astro`

### Performance
- **Image Optimization**: Images are automatically optimized by Astro
- **Font Loading**: Uses font-display: swap for optimal loading
- **View Transitions**: Configured in `astro.config.mjs`

## Testing

The project includes comprehensive Playwright tests covering:

- Core functionality & navigation
- Accessibility (screen readers, keyboard navigation)
- Performance metrics
- SEO and meta tags
- Visual styling consistency
- Touch gestures and animations

### Running Tests

```bash
# Start dev server in one terminal
npm run dev

# Run tests in another terminal
npm test              # Run all tests
npm test:ui           # Run with UI mode
npm test:debug        # Debug mode
npm test -- --grep "accessibility"  # Run specific tests
```

## Build & Deploy

Build for production:

```bash
npm run build
```

The site will be generated in the `dist/` folder, ready for deployment to any static hosting service.

### Production Features
- HTML compression enabled
- Asset optimization
- View Transitions work without JavaScript
- Prefetching strategy: viewport-based

## Contributing

1. Follow the established component patterns
2. Ensure all tests pass before submitting PRs
3. Add tests for new functionality
4. Use TypeScript modules in `src/lib/` for logic
5. Keep accessibility in mind

## License

MIT