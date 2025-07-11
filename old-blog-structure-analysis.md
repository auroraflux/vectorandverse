# Old Astro Blog Structure Analysis

## Directory Structure

### Content Organization
- **Blog posts**: `/src/content/blog/[post-slug]/index.mdx`
  - Each post is in its own directory with MDX file and assets
  - Format: `001s25-ultra`, `002-joyless`, etc.
  - Images are stored alongside the MDX file in the same directory

- **About page**: `/src/content/about/index.md` (using Markdown, not MDX)

### Pages Structure
- `/src/pages/` contains all routes:
  - `/about/index.astro`
  - `/archives/index.astro`
  - `/blog/[...id].astro` (dynamic blog post pages)
  - `/blog/[...page].astro` (blog listing pagination)
  - `/links/index.astro`
  - `/search/index.astro`
  - `/tags/index.astro`
  - `/tags/[tag]/[...page].astro`
  - `/terms/` (contains MD files for legal pages)
  - `/404.astro`
  - `/[...page].astro` (home page pagination)

## Content Format

### Blog Post MDX Format
```mdx
---
title: "the s25 ultra: are we all just bored now? (probably, and it's kind of our own fault)"
publishDate: 2025-03-05
description: "another year, another rectangle, another reason to question the meaning of life. at least the photos are slightly sharper."
heroImage: {
  src: './smartphone-hell.png',
  alt: 'Smartphone hell illustration'
}
language: 'English'
---

[Content with MDX components]
```

### About Page MD Format
```md
---
title: Zero Surveillance, Artfully Augmented AI, Full Transparency
description: No ads, no trackers, just opinions. And maybe some AI help.
---

[Content in plain Markdown]
```

## Assets and Images
- Blog post images are stored in each post's directory
- Referenced using relative paths: `![alt](./image.png)`
- Hero images defined in frontmatter with object notation
- Public assets in `/public/` directory:
  - `/favicon/`
  - `/scripts/`
  - `/styles/`

## Special Components Used
From the `astro-pure` package:
- `<Aside>` - Used for callout boxes
- `<Steps>` - Used for step-by-step content
- `<LinkPreview>` - Used for link previews

Import pattern:
```mdx
import { Aside } from 'astro-pure/user'
import { Steps } from 'astro-pure/user'
import { LinkPreview } from 'astro-pure/advanced'
```

## Project Configuration
- Built with Astro using MDX integration
- Uses `astro-pure` theme/template system
- Hosted on Netlify (recently migrated from Vercel)
- Static site generation (output: 'static')
- UnoCSS for styling
- Custom rehype/remark plugins for:
  - Auto-linking headings
  - Image captions
  - Code block enhancements (copy button, language labels, etc.)

## Key Differences from Current Blog
1. **MDX vs MD**: Old blog uses MDX for posts (with component support)
2. **Directory-based posts**: Each post has its own directory with assets
3. **Frontmatter structure**: Different fields and hero image as object
4. **Component system**: Uses astro-pure components
5. **Pages directory**: Separate pages for different routes
6. **Terms pages**: Legal pages stored as MD files in `/pages/terms/`

## Migration Considerations
1. Convert MDX to MD or support MDX in new blog
2. Handle image paths (currently relative to post directory)
3. Port or replace astro-pure components
4. Migrate frontmatter format
5. Handle hero image object format
6. Port any custom styling or features