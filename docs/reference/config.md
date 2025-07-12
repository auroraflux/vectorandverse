# Configuration Reference

## Astro Config

Key settings in `astro.config.mjs`:

```javascript
{
  site: 'https://kilowhat.buzz',
  integrations: [
    mdx(),           // MDX support
    tailwind(),      // Tailwind CSS
    sitemap()        // Sitemap generation
  ],
  viewTransitions: true,  // Smooth navigation
  prefetch: {
    defaultStrategy: 'viewport'  // Prefetch visible links
  }
}
```

## TypeScript Config

Strict mode enabled with path aliases:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Content Schema

Blog post schema in `src/content/config.ts`:

```typescript
{
  title: z.string(),
  description: z.string(),
  date: z.date(),
  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false)
}
```

## Animation Config

Timings in `src/lib/config/animations.ts`:

```typescript
{
  duration: {
    fast: 200,
    normal: 300,
    slow: 500
  },
  easing: {
    default: 'ease-out',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
```