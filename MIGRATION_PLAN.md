# Blog Migration Plan: kilowhat2 → kilowhat

## Overview
Migrating 11 blog posts and an About page from the old Astro blog to the new minimal design.

## Source Analysis

### Content Structure
- **Location**: `/src/content/blog/` (11 posts total)
- **Format**: MDX with frontmatter
- **Images**: Stored alongside posts in same directory
- **About Page**: `/src/content/about/index.md` (plain Markdown)

### MDX Components Used
1. **`<Aside>`** - Used for callout boxes (types: note, warning, etc.)
   - Maps to our new admonition system
2. **`<Steps>`** - Used for step-by-step content
   - Maps to our new stepper component
3. **`<LinkPreview>`** - Used for link previews (only in one post)
   - Will need custom solution or removal

### Frontmatter Structure
```yaml
title: "post title"
publishDate: 2025-03-05
description: "post description"
heroImage: {
  src: './image.png',
  alt: 'Image alt text'
}
language: 'English'
series: "Series Name" # optional
seriesOrder: 1 # optional
```

## Migration Tasks

### 1. Component Mapping

#### Aside → Admonition
Old format:
```mdx
<Aside type="note" title="Hold up a sec.">
Content here
</Aside>
```

New format:
```markdown
::: note "Hold up a sec."
Content here
:::
```

#### Steps → Stepper
Old format:
```mdx
<Steps>
1. **Step title**
   Step content
2. **Another step**
   More content
</Steps>
```

New format:
```markdown
::: stepper
{items: [
  {title: "Step title", content: "Step content"},
  {title: "Another step", content: "More content"}
]}
:::
```

#### LinkPreview → Remove or Plain Link
Since we only have one instance, we'll convert to a plain link.

### 2. Image Migration
- Copy all images from each post directory
- Update image references from relative `./image.png` to `/images/blog/[post-slug]/image.png`
- Ensure hero images work with new structure

### 3. Frontmatter Updates
- Convert `publishDate` to `date`
- Convert `heroImage.src` to `heroImage` (string path)
- Convert `heroImage.alt` to `heroImageAlt`
- Keep series/seriesOrder as-is

### 4. File Structure
Old: `/src/content/blog/001s25-ultra/index.mdx`
New: `/src/content/blog/001s25-ultra.mdx`

### 5. About Page
- Copy content from `/src/content/about/index.md`
- Create new page at `/src/pages/about.astro`
- Apply new design system styling

## Migration Script Strategy

1. **Read MDX files** and parse frontmatter
2. **Convert components** using regex replacements
3. **Update image paths** to new structure
4. **Copy images** to public directory
5. **Write new MDX files** with updated content

## Post-Migration Checklist
- [ ] Verify all 11 posts render correctly
- [ ] Check all images load properly
- [ ] Test admonitions display correctly
- [ ] Verify stepper components work
- [ ] Ensure About page matches design
- [ ] Update navigation if needed
- [ ] Test series linking if implemented

## Posts to Migrate
1. 001s25-ultra - "the s25 ultra: are we all just bored now?"
2. 002-joyless - TBD
3. 003-grind-is-gamble - TBD
4. 004-lucid-audio-ama - TBD (has LinkPreview)
5. 005-llm-pt1 - "large language models explained" (has Aside, Steps)
6. 006-deepseek - TBD
7. 007-mac-mini-hope-and-cope - TBD
8. 008-llm-context-pt1 - TBD
9. 009-llm-context-pt2 - TBD
10. 010-llm-context-pt3 - TBD
11. 011-imposter - TBD