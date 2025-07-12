# Frontmatter Guide

## Required Fields

Every blog post must start with frontmatter between `---` markers:

```yaml
---
title: "Your Blog Post Title"
description: "A brief description for SEO and previews"
date: 2025-01-15
---
```

## Optional Fields

```yaml
---
title: "Your Blog Post Title"
description: "A brief description for SEO and previews"
date: 2025-01-15
heroImage: /images/blog/your-post/hero.png
heroImageAlt: "Description of the hero image"
tags: ["technology", "tutorial", "astro"]
draft: false
---
```

## Field Details

- **title**: The main heading displayed on the page
- **description**: Shows in search results and social shares
- **date**: Publication date (YYYY-MM-DD format)
- **heroImage**: Path to hero image (optional)
- **heroImageAlt**: Alt text for hero image (required if heroImage is set)
- **tags**: Array of topic tags (optional)
- **draft**: Set to `true` to hide from production (optional, defaults to `false`)

## Example

```yaml
---
title: "Building a Fast Blog with Astro"
description: "Learn how to create a performant blog using Astro and TypeScript"
date: 2025-01-15
heroImage: /images/blog/astro-blog/hero.webp
heroImageAlt: "Astro logo with code in the background"
tags: ["astro", "performance", "tutorial"]
draft: false
---
```