# Draft System

## Overview

The draft system allows you to work on blog posts without them appearing in production.

## How It Works

- **Development**: Draft posts are visible and marked with a yellow "Draft" badge
- **Production**: Draft posts are completely hidden (not built/accessible)

## Setting Draft Status

Add to frontmatter:

```yaml
---
title: "My Work in Progress"
description: "Still working on this..."
date: 2025-01-15
draft: true
---
```

## Draft Indicators

In development mode, drafts show:
- Yellow "Draft" badge on homepage listing
- Yellow "Draft" badge on blog post page
- Normal functionality (clickable, searchable)

## Publishing

To publish a draft:
1. Remove `draft: true` from frontmatter, OR
2. Change to `draft: false`

## Best Practices

- Use drafts for work-in-progress posts
- Test drafts thoroughly in development
- Remember to remove draft status before expecting posts to go live
- Draft posts won't generate sitemap entries or be accessible via direct URL in production