# Kilowhat Project Instructions

## Project Overview
Kilowhat is a minimal, typography-focused blog built with Astro and Tailwind CSS. The design philosophy emphasizes readability, clean aesthetics, and performance.

## Key Design Principles
1. **Typography First**: Every design decision prioritizes readability
2. **Minimal but Purposeful**: Each element serves a specific function
3. **Performance**: Fast loading times are non-negotiable
4. **Smooth Transitions**: Subtle animations enhance the reading experience

## Technical Stack
- **Astro**: Static site generator with View Transitions
- **Tailwind CSS v4**: Using the new @reference directive for scoped styles
- **Tailwind Typography**: For beautiful prose styling
- **Content Collections**: Type-safe blog post management

## Project Structure
```
src/
├── content/
│   ├── blog/        # Blog posts in Markdown
│   └── config.ts    # Content collection schema
├── layouts/
│   ├── Layout.astro     # Base layout with font loading
│   └── BlogPost.astro   # Blog post specific layout
├── pages/
│   ├── index.astro          # Home page with article list
│   └── blog/[...slug].astro # Dynamic blog post pages
└── styles/
    └── global.css   # Global styles and utilities
```

## Adding New Features
- Maintain the minimal aesthetic - question every addition
- Test performance impact before adding new dependencies
- Keep animations subtle and purposeful
- Ensure all text remains highly readable

## Deployment Notes
- Use `.gitignore.production` to exclude dev files
- The site builds to `dist/` for static hosting
- All assets are optimized during build
- View Transitions work without JavaScript

## Writing Style Guide
- Focus on clarity and precision
- Use short paragraphs for web readability
- Include code examples where relevant
- Admonitions should be used sparingly

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build