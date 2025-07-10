# Kilowhat

A minimal, typography-focused blog built with Astro and Tailwind CSS.

## Features

- ✨ Clean, minimal design focused on readability
- 📝 Typography-first approach with careful font selection
- 🎯 Smooth page transitions with Astro View Transitions
- 🎨 Minimal styled components (blockquotes, code blocks, admonitions)
- ⚡ Optimized for performance
- 📱 Fully responsive design

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography) - Beautiful typographic defaults

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

## Adding Blog Posts

Create new blog posts in `src/content/blog/` with the following frontmatter:

```markdown
---
title: 'Your Post Title'
description: 'A brief description of your post.'
date: 2024-01-15
---

Your content here...
```

## Customization

- **Fonts**: Edit the font imports in `src/layouts/Layout.astro`
- **Colors**: Modify the Tailwind configuration in `tailwind.config.mjs`
- **Typography**: Adjust prose styles in the Tailwind config
- **Animations**: Edit transitions in `src/styles/global.css`

## Build & Deploy

Build for production:

```bash
npm run build
```

The site will be generated in the `dist/` folder, ready for deployment to any static hosting service.

## License

MIT