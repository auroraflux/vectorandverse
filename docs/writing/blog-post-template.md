# Blog Post Template

## Complete Template

Copy this template when creating a new blog post:

```markdown
---
title: "Your Compelling Blog Post Title"
description: "A brief 1-2 sentence description that appears in search results and social media previews"
date: 2025-01-15
heroImage: /images/blog/your-post-slug/hero.webp
heroImageAlt: "Descriptive alt text for the hero image"
tags: ["topic1", "topic2", "topic3"]
draft: false
---

## Introduction

Start with a hook that draws readers in. Explain what problem you're solving or what the reader will learn.

## Main Content Section

Break your content into logical sections with clear headings.

![Descriptive caption for image](/images/blog/your-post-slug/image1.png)

### Subsection with Details

Use subsections to organize complex topics.

::: note
Important information that supplements the main text.
:::

## Step-by-Step Guide

When explaining a process:

::: stepper
{items: [
  {title: "First step", content: "Clear instruction for step one"},
  {title: "Second step", content: "What to do next"},
  {title: "Final step", content: "How to complete the process"}
]}
:::

## Code Examples

```typescript
// Include relevant code examples
function exampleFunction() {
  return "Hello, world!";
}
```

## Key Takeaways

::: tip "Remember"
Summarize the most important points for readers to remember.
:::

## Conclusion

Wrap up with a brief summary and call to action. What should readers do next?

## Further Reading

- [Related Article 1](/blog/related-post-1)
- [External Resource](https://example.com)
```

## File Naming

Save as: `src/content/blog/your-post-slug.mdx`

## Image Folder

Create: `public/images/blog/your-post-slug/`