# LLM Guide — Vector & Verse Blog

Audience: coding assistants (Claude Code, Gemini CLI, etc.). Purpose: quickly understand the stack, where things live, and how to make safe changes without breaking conventions.

## Stack Overview

- Framework: Astro 5.x with MDX and Tailwind CSS v4
- Build: static site (output to `dist/`)
- Styling: Tailwind + custom CSS in `src/styles/*`
- Fonts: Satoshi variable font (preloaded); utilities for variable weights
- Content: Astro Content Collections with zod schema validation
- Behavior: small client scripts in components/layouts; TypeScript utilities under `src/lib`

## Repo Structure (high‑value paths)

- `astro.config.mjs`: site URL, integrations (MDX, sitemap), Vite aliases
- `tailwind.config.mjs`: typography defaults, font family/weights, Tailwind Typography plugin tuning
- `public/`: static assets served as‑is (fonts, images, robots.txt, favicon)
- `src/content/`: MDX content and collection schema
  - `src/content/config.ts`: blog collection schema (title, description, date, hero, tags, draft, series)
  - `src/content/blog/*.mdx`: individual posts
- `src/pages/`: routes
  - `index.astro`: homepage, recent posts, hero typewriter
  - `blog/[...slug].astro`: dynamic blog route, prev/next props for swipe nav
  - `about.astro`, `404.astro`: static pages
- `src/layouts/`:
  - `Layout.astro`: global HTML head, meta, fonts, global CSS and lightbox
  - `BlogPost.astro`: article hero, typography, progress bar
- `src/components/`: UI + behavior
  - `Header.astro`, `GlobalLightbox.astro`, `LogoScrollTransform.astro`, `ReadingProgress.astro`, `SwipeNavigation.astro`, `MDXImage.astro`
  - `mdx/index.ts`: maps MDX elements → components (e.g., `img` → `MDXImage`)
- `src/styles/`: CSS modules
  - `global.css` imports tokens, link animations, sticky header, variable font effects
  - `design-tokens.css`: CSS variables for spacing, radii, z‑index, shadows, animation thresholds, etc.
  - `variable-font-effects.css`: uses `font-variation-settings` for interactive weights
- `src/lib/`:
  - `config/`: `brand.ts`, `dimensions.ts`, `colors.ts`, `animation.ts`, `index.ts`
  - `animations/typewriter.ts`: homepage tagline animator
  - `utils/`: DOM/events/accessibility helpers

## Content Model & Authoring

- Schema: `src/content/config.ts` enforces frontmatter
  - Required: `title: string`, `description: string`, `date: Date`
  - Optional: `heroImage: string`, `heroImageAlt: string`, `tags: string[]`, `draft: boolean`, `series: string`, `seriesOrder: number`
- File naming: any `.mdx` under `src/content/blog/` becomes `/blog/<slug>`
- Images:
  - Prefer absolute paths under `public/images/...` for hero and inline images (no import processing)
  - MDX `<img>` is auto-replaced by `MDXImage` to enable the global lightbox
- Drafts: set `draft: true` (filtered in production; shown in dev)
- Example frontmatter:

```mdx
---
title: 'my post title'
date: 2025-01-02
description: 'short summary for cards and SEO'
heroImage: /images/blog/slug/hero.jpg
heroImageAlt: 'Accessible description of the image'
tags: ['tag1', 'tag2']
draft: false
---
```

## Routing & Data Flow

- `src/pages/blog/[...slug].astro`:
  - `getStaticPaths()` reads the `blog` collection, filters drafts in prod, sorts by `date`
  - Passes `post`, `prevPost`, `nextPost` props to the page for swipe navigation
- `src/pages/index.astro`:
  - Reads the same collection for the homepage list
  - Renders hero with rotating taglines using the typewriter module

## Layout & Components

- `Layout.astro`
  - Global `<head>`: canonical, OG/Twitter tags, `twitter:card` summary, title composition using `BRAND_CONFIG.name`
  - Preloads Satoshi fonts; defines `@font-face` for variable and italic cuts
  - Imports `src/styles/global.css` and mounts `<GlobalLightbox />`
- `BlogPost.astro`
  - Composes `Layout`, `Header` variant, `ReadingProgress`, hero (image or gradient)
  - Wraps MDX in `div.prose.prose-lg` and adds article‑specific CSS (headings, lists, code, tables, images)
- `Header.astro`
  - Fixed top nav; `variant: 'home' | 'article' | 'minimal'`; article variant adds vignette overlay
- `GlobalLightbox.astro`
  - Overlay dialog bound to clicks on `.lightbox-trigger` (provided by `MDXImage`); uses `overscroll-behavior` + `overflow: hidden` to lock background
- `LogoScrollTransform.astro`
  - Inserts a minimal sticky header that appears after threshold; fades hero logo only
- `SwipeNavigation.astro`
  - Touch gestures to go prev/next; visible indicators at page edges
- `ReadingProgress.astro`
  - Bottom gradient progress bar based on scroll position

## Styling & Typography

- Tailwind (`tailwind.config.mjs`)
  - `fontFamily.sans`: `'Satoshi', system stacks`
  - Custom font sizes and `fontWeight` values; extended `@tailwindcss/typography` defaults:
    - Base: `20px/1.6`, max width ~`65ch`, headings heavy (wght ~850)
- Global CSS (`src/styles/global.css`)
  - Imports Tailwind and local modules; sets selection, `.prose` lists/tables/blockquote, heading underlines
  - Utility classes for variable font weights: `.font-weight-{300|500|600|800|850|900}` and italic variants using `font-variation-settings: 'wght' N`
- Variable font effects (`src/styles/variable-font-effects.css`)
  - Interactive `font-variation-settings` on links, buttons, nav; enhanced blockquotes with decorative quotes; dark mode adjustments
- Fonts defined in `Layout.astro`
  - `@font-face` for Satoshi variable (`font-weight: 300 900`) + specific italic cuts; body uses Satoshi 500 by default; headings set to 850

## Configuration

- Branding: `src/lib/config/brand.ts` — name, taglines, descriptions, domain
- Colors/Dimensions/Animation: centralized constants in `src/lib/config/*`
- Aliases: `astro.config.mjs` (`@lib`, `@components`, `@utils`, `@animations`, `@config`)
- Site URL: `astro.config.mjs > site` (used by sitemap; keep accurate in production)

## SEO & Meta

- Open Graph & Twitter set in `Layout.astro` from page props (`title`, `description`, `image`, `type`)
- Canonical URL: derived from `Astro.url.pathname` + `Astro.site`
- Default OG image: `/images/og-default.png` (override via `image` prop from `BlogPost.astro` -> `heroImage`)
- Sitemap: `@astrojs/sitemap` (respects `site` config)
- Robots: `public/robots.txt`

## Behavior & Lifecycle Notes

- Astro navigation events are used for hydration lifecycle:
  - `astro:page-load` to initialize components
  - `astro:before-swap` to clean up event listeners/DOM
- Reduced motion: `src/lib/config/animation.ts` exposes helpers; the typewriter animation respects this; prefer using `getAnimationDuration()` for new effects
- Accessibility:
  - Skip link in `Header.astro`
  - Lightbox uses ARIA dialog semantics and ESC/overlay click to close
  - Typewriter can announce phrases via aria‑live (polite); utilities in `src/lib/utils/accessibility`

## Authoring & Editing Tasks (LLM‑friendly)

- Add a blog post
  1) Create `src/content/blog/<slug>.mdx` with valid frontmatter (see example)
  2) Place hero and inline images under `public/images/blog/<slug>/...`
  3) Use standard Markdown/MDX; plain `<img>` is fine — it’s auto‑wrapped for the lightbox
- Update taglines (homepage typewriter)
  - Preferred: edit `TAGLINES` in `src/lib/config/animation.ts`
  - Alternative: pass `phrases` to the `Typewriter` in `src/pages/index.astro`
- Change branding text
  - Edit `src/lib/config/brand.ts` (name, descriptions, navigation blurb)
  - Favicon: `public/favicon.svg`
- Typography tweaks
  - Headings/body scale: `tailwind.config.mjs` (fontSize, typography plugin css)
  - Interactive weights/blockquote visuals: `src/styles/variable-font-effects.css`
  - Global `.prose` rules: `src/styles/global.css`
  - Font faces/preloads: `src/layouts/Layout.astro`
- SEO defaults
  - Default OG image path: `src/layouts/Layout.astro`
  - Site URL for sitemap/canonical: `astro.config.mjs`

## Conventions & Pitfalls

- Prefer config constants over hardcoding magic numbers — see `src/lib/config/*`
- When adding client scripts, always wire cleanup on `astro:before-swap`
- For images in MDX, absolute `/images/...` paths avoid bundler transforms and work with the lightbox override
- `date` in frontmatter must parse to a valid Date; sort order depends on it
- Don’t remove `<GlobalLightbox />` from `Layout.astro` unless also removing MDX override (`mdx/index.ts`)
- Dark mode classes exist in CSS, but there is no toggle component; if you add one, prefer adding/removing the `.dark` class on `<html>`

## Development

- Scripts (`package.json`):
  - `npm run dev`: starts dev server (port `4321` via wrapper)
  - `npm run build`: static build to `dist/`
  - `npm run preview`: preview built site
  - `npm run test[:*]`: Playwright tests and smoke suite
- Server config: `astro.config.mjs > server` (`host: true`, `port: 4321`)

## Extending MDX Rendering

- Current overrides: `img` → `MDXImage` (lightbox integration)
- To add code block/highlight or custom admonitions:
  - Extend `src/components/mdx/index.ts` with mappings (e.g., `pre`, `code`, `blockquote`)
  - Add corresponding components and styles (leverage `.prose` defaults in `global.css`)

## Security Notes

- DOM manipulation done with care in components (safe creation/append, cleanup)
- Previous XSS in scrolling header was addressed; when injecting text into DOM, avoid `innerHTML` with untrusted content

---

If you’re an LLM making changes:

- Use existing configs/utilities; don’t duplicate constants
- Keep edits surgical; follow file/module ownership patterns
- Validate with `npm run build` and optional `npm run test:smoke`
- Add lifecycle cleanup for any new event listeners
- Prefer CSS utilities/tokens; avoid inline styles unless matching existing style

