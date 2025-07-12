# File Structure

## Project Layout

```
kilowhat/
├── src/
│   ├── content/          # Content collections
│   │   └── blog/        # Blog posts (MDX)
│   ├── pages/           # Routes
│   │   ├── index.astro  # Home page
│   │   ├── about.astro  # About page
│   │   └── blog/        # Blog routes
│   ├── layouts/         # Page layouts
│   ├── components/      # Astro components
│   ├── lib/            # TypeScript modules
│   │   ├── animations/ # Animation logic
│   │   ├── components/ # Component classes
│   │   ├── config/     # Configuration
│   │   └── utils/      # Utilities
│   └── styles/         # CSS files
├── public/             # Static assets
│   ├── fonts/         # Web fonts
│   └── images/        # Images
│       └── blog/      # Blog post images
├── tests/             # Playwright tests
├── docs/              # Documentation
└── archive/           # Archived docs
```

## Key Files

### Configuration
- `astro.config.mjs` - Astro configuration
- `tailwind.config.mjs` - Tailwind setup
- `tsconfig.json` - TypeScript config
- `playwright.config.ts` - Test config

### Content
- `src/content/config.ts` - Content schema
- `src/content/blog/*.mdx` - Blog posts

### Components
- `src/components/*.astro` - UI components
- `src/lib/components/*.ts` - TS components

## Naming Conventions

- **Files**: kebab-case.ts
- **Components**: PascalCase.astro
- **Utilities**: camelCase functions
- **CSS**: kebab-case.css