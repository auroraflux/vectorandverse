# Quick Writing Reference

## File Setup

1. Create file: `src/content/blog/my-post.mdx`
2. Create image folder: `public/images/blog/my-post/`

## Minimal Frontmatter

```yaml
---
title: "Post Title"
description: "Brief description"
date: 2025-01-15
---
```

## Common Patterns

### Image with Caption
```markdown
![Screenshot of the dashboard](/images/blog/my-post/dashboard.png)
*Figure 1: The new dashboard interface*
```

### Code with Explanation
````markdown
Here's how to implement the solution:

```javascript
const result = data.filter(item => item.active);
```

This filters out inactive items from the array.
````

### Important Note
```markdown
::: note
Remember to save your work frequently!
:::
```

### Warning Box
```markdown
::: warning
This will delete all data permanently.
:::
```

### Step Instructions
```markdown
::: stepper
{items: [
  {title: "Download", content: "Get the latest version"},
  {title: "Install", content: "Run the installer"},
  {title: "Configure", content: "Set your preferences"}
]}
:::
```

## Typography Tips

- Use `**bold**` for emphasis
- Use `_italics_` for subtle emphasis
- Use `## Headings` to structure content
- Keep paragraphs short (3-4 sentences)
- Use lists for multiple related items