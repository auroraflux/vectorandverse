# Adding Images to Articles

This guide explains how to add images to your blog posts with automatic lightbox functionality.

## Overview

All images in MDX blog posts automatically get lightbox functionality. When users click on an image, it opens in a fullscreen overlay with touch gestures support (pinch to zoom, swipe to close).

## How to Add Images

### Basic Markdown Syntax

Simply use standard Markdown image syntax in your MDX files:

```markdown
![Alt text for the image](/images/blog/your-post/image-name.png)
```

### With Title (Tooltip)

```markdown
![Alt text](/images/blog/your-post/image.png "Optional title tooltip")
```

### Image Storage

Store your blog post images in the public folder following this convention:
```
public/
  images/
    blog/
      [post-slug]/
        image1.png
        image2.jpg
        ...
```

For example, for a post with slug `011-imposter`, images go in:
```
public/images/blog/011-imposter/
```

## Features

### Automatic Lightbox

All images automatically get:
- Click to open in fullscreen overlay
- Touch gesture support (mobile):
  - Swipe up/down to close
  - Pinch to zoom
- Keyboard support:
  - ESC key to close
- Visual indicators:
  - Zoom cursor on hover
  - Shadow effects

### Lazy Loading

Images are automatically lazy-loaded for better performance.

### Styling

Images receive these styles automatically:
- Full width within article container
- Rounded corners
- Shadow effects
- Hover animations

## Technical Details

The lightbox functionality is implemented through:

1. **Custom MDX Component** (`src/components/mdx/Image.astro`):
   - Overrides the default `img` element in MDX
   - Adds `data-lightbox="true"` and `data-full-src` attributes
   - Applies consistent styling

2. **TouchLightbox Component** (`src/components/TouchLightbox.astro`):
   - Provides the lightbox overlay UI
   - Handles touch gestures and keyboard navigation
   - Manages image loading states

3. **TouchLightbox Class** (`src/lib/components/TouchLightbox.ts`):
   - Implements the interaction logic
   - Handles click events on images with `data-lightbox="true"`
   - Manages touch gestures for mobile devices

## Best Practices

1. **Alt Text**: Always provide descriptive alt text for accessibility
2. **File Names**: Use descriptive, SEO-friendly file names (e.g., `user-dashboard-overview.png` instead of `img1.png`)
3. **Image Optimization**: Optimize images before uploading:
   - Use appropriate formats (WebP, PNG for graphics, JPEG for photos)
   - Compress images to reduce file size
   - Consider providing multiple resolutions for responsive images

4. **Relative Paths**: Always use absolute paths starting with `/` for images in the public folder

## Example

Here's a complete example from the "Imposter" article:

```markdown
---
title: 'Reality Check: Everyone''s Winging It'
heroImage: /images/blog/011-imposter/life-is-diffusion.png
---

## Two Ways to Create Meaning

### autoregression

![autoregress](/images/blog/011-imposter/autoregress.png)

It's why you can sometimes predict the next word...
```

When users click on the `autoregress.png` image, it will open in the lightbox overlay.

## Troubleshooting

### Image Not Showing Lightbox

1. Ensure the image is in an MDX file (not plain Markdown)
2. Check that the image path starts with `/`
3. Verify the image file exists in the public folder

### Image Not Loading

1. Check the browser console for 404 errors
2. Ensure the path matches the actual file location
3. Verify file permissions on the image

### Lightbox Not Closing

1. Try pressing ESC key
2. Click outside the image or on the close button
3. On mobile, swipe up or down