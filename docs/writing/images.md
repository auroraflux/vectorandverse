# Images in Blog Posts

## Basic Image Syntax

```markdown
![Alt text describing the image](/images/blog/your-post/image-name.png)
```

## Image Storage

Always store images in: `public/images/blog/[post-slug]/`

Example structure:
```
public/
  images/
    blog/
      my-first-post/
        screenshot.png
        diagram.webp
        comparison.jpg
```

## Hero Images

Set in frontmatter:

```yaml
---
heroImage: /images/blog/your-post/hero.webp
heroImageAlt: "Descriptive alt text for the hero image"
---
```

## Inline Images

In your content:

```markdown
Here's what the interface looks like:

![Dashboard showing user analytics](/images/blog/your-post/dashboard.png)

The dashboard provides real-time metrics...
```

## Image Guidelines

1. **Alt Text**: Always include descriptive alt text
2. **File Names**: Use kebab-case (my-image.png)
3. **Formats**: 
   - WebP for best compression
   - PNG for screenshots with text
   - JPG for photographs
4. **Size**: Optimize to under 200KB when possible
5. **Dimensions**: 1200px width for hero images

## Lightbox

All images automatically get lightbox functionality:
- Click to expand fullscreen
- Click outside or ESC to close
- Touch gestures on mobile