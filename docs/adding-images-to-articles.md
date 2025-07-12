# Adding Images to Articles

This document explains how to add images to blog articles in the Kilowhat project, ensuring they have automatic lightbox functionality.

## Overview

All images in blog articles automatically get lightbox functionality - clicking on any image opens it in a full-screen overlay. The implementation is intentionally simple and lightweight.

## Adding Images in MDX Files

### Basic Markdown Syntax

In your MDX blog posts, use standard markdown image syntax:

```markdown
![Description of the image](/images/blog/your-article/image-name.png)
```

**Important conventions:**
- Store images in `/public/images/blog/[article-slug]/`
- Use descriptive alt text for accessibility
- Images automatically get lightbox functionality

### Example

```markdown
Here's a screenshot of the application:

![Application dashboard showing user metrics](/images/blog/my-app-review/dashboard.png)

The dashboard provides real-time insights...
```

## How It Works

### Automatic MDX Component Override

The project uses a custom MDX component that overrides the default `<img>` tag. Every image in MDX content is automatically:

1. Wrapped in a clickable button element
2. Given a zoom cursor on hover
3. Made clickable to open in fullscreen

### Implementation Details

The system uses two components:

1. **MDXImage Component** (`src/components/MDXImage.astro`)
   - Automatically applied to all markdown images
   - Wraps images in a button with `class="lightbox-trigger"`
   - Adds `data-src` and `data-alt` attributes
   - No complex state management

2. **GlobalLightbox Component** (`src/components/GlobalLightbox.astro`)
   - Single instance in the layout
   - Uses vanilla JavaScript for simplicity
   - Click overlay or press ESC to close
   - No touch gestures, zoom, or other complex features

## For Component-Based Images

If you're using the `ResponsiveImage` component directly in Astro files:

```astro
<ResponsiveImage 
  src={myImage}
  alt="Description of the image"
  type="inline"
/>
```

The `type="inline"` automatically enables lightbox functionality.

## Best Practices

1. **Alt Text**: Always provide meaningful alt text for accessibility
2. **File Organization**: Keep images organized in article-specific folders
3. **File Names**: Use descriptive, kebab-case file names
4. **Image Format**: Use appropriate formats (PNG for screenshots, JPG for photos)
5. **Image Size**: Optimize images before adding them (aim for < 200KB for inline images)

## Troubleshooting

### Lightbox Not Working?

1. Ensure the image is inside an MDX file or using `ResponsiveImage` with `type="inline"`
2. Check that the image path is correct and starts with `/`
3. Verify the image file exists in the public directory
4. Check browser console for any JavaScript errors

### Images Not Displaying?

1. Check the file path - it should be relative to the public directory
2. Ensure the image file name matches exactly (case-sensitive)
3. Verify the image is in a web-friendly format (PNG, JPG, WebP)

## Technical Notes

- The lightbox uses event delegation on the document for performance
- Images are lazy-loaded by default
- The lightbox component is included once in the main layout
- Extremely simple implementation - just click to open, click/ESC to close
- No external dependencies or complex state management